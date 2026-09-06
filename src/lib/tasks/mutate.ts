/**
 * Task mutations. Position is a fractional index scoped to one board cell
 * `(venture, lane, status)`. Every write records one activity row (ADR-0005).
 */
import { recordActivity } from "@/lib/data/activity";
import {
  applyCellPositions,
  getTask,
  insertTask,
  listCellTasks,
  updateTaskRow,
  type Executor,
  type Priority,
  type TaskRow,
} from "@/lib/data/tasks";
import { getVentureById } from "@/lib/data/ventures";
import {
  isBoardLane,
  isBoardStatus,
  type Lane,
  type TaskStatus,
} from "@/lib/lanes";
import {
  needsRebalance,
  positionBetween,
  rebalance,
} from "@/lib/tasks/position";

export type MutateOpts = {
  actorId: string;
  executor?: Executor;
};

export type CreateTaskInput = {
  ventureId: string | null;
  title: string;
  lane: Lane;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string | null;
  dueDate?: string | null;
  description?: string | null;
  originNoteId?: string | null;
};

export type EditTaskInput = {
  taskId: string;
  title?: string;
  description?: string | null;
  priority?: Priority;
};

export type ReorderTaskInput = {
  taskId: string;
  lane: Lane;
  status: TaskStatus;
  beforeId?: string | null;
  afterId?: string | null;
};

function requireBoardLane(lane: string | undefined): Lane {
  if (!lane || !isBoardLane(lane)) {
    throw new Error("lane is required");
  }
  return lane;
}

function requireBoardStatus(status: string | undefined): TaskStatus {
  if (!status || !isBoardStatus(status)) {
    throw new Error("status is required");
  }
  return status;
}

function completedAtFor(
  status: TaskStatus,
  previous: Date | null,
): Date | null {
  if (status === "done") return previous ?? new Date();
  return null;
}

async function positionInCell(
  input: ReorderTaskInput,
  ventureId: string | null,
  executor: Executor | undefined,
): Promise<{ position: number; cell: { id: string; position: number }[] }> {
  const cell = await listCellTasks(
    {
      ventureId,
      lane: input.lane,
      status: input.status,
      excludeId: input.taskId,
    },
    executor,
  );
  const before = input.beforeId
    ? cell.find((t) => t.id === input.beforeId)
    : undefined;
  const after = input.afterId
    ? cell.find((t) => t.id === input.afterId)
    : undefined;
  if (!before && !after) {
    const last = cell[cell.length - 1];
    return { position: positionBetween(last?.position, undefined), cell };
  }
  return { position: positionBetween(before?.position, after?.position), cell };
}

async function rebalanceIfNeeded(
  moved: { id: string; position: number },
  cellWithoutMoved: { id: string; position: number }[],
  executor: Executor | undefined,
) {
  const combined = [...cellWithoutMoved, moved];
  const sorted = [...combined].sort((a, b) => a.position - b.position);
  if (!needsRebalance(sorted.map((t) => t.position))) return;
  await applyCellPositions(rebalance(combined), executor);
}

function verbFor(args: {
  kind: "create" | "edit" | "assign" | "due" | "reorder";
  previous: Pick<TaskRow, "status" | "lane" | "assigneeId"> | null;
  next: { status: TaskStatus; lane: Lane; assigneeId: string | null };
}) {
  if (args.kind === "create" || !args.previous) return "created" as const;
  if (args.kind === "assign") return "assigned" as const;
  if (args.next.status === "done" && args.previous.status !== "done") {
    return "completed" as const;
  }
  // A status or lane change is "moved" (notifies assignee + creator, ADR-0005).
  // A pure within-cell reorder changes nothing anyone needs pinging about.
  if (
    args.previous.status !== args.next.status ||
    args.previous.lane !== args.next.lane
  ) {
    return "moved" as const;
  }
  return "updated" as const;
}

export async function createTask(input: CreateTaskInput, opts: MutateOpts) {
  const lane = requireBoardLane(input.lane);
  const title = input.title.trim();
  if (!title) throw new Error("title is required");
  const status = input.status ? requireBoardStatus(input.status) : "todo";
  const executor = opts.executor;

  if (input.ventureId) {
    const venture = await getVentureById(input.ventureId, executor);
    if (!venture) throw new Error("venture not found");
  }

  const cell = await listCellTasks(
    { ventureId: input.ventureId, lane, status },
    executor,
  );
  const last = cell[cell.length - 1];
  const position = positionBetween(last?.position, undefined);

  const row = await insertTask(
    {
      ventureId: input.ventureId,
      title,
      description: input.description ?? null,
      lane,
      status,
      priority: input.priority ?? "normal",
      position,
      assigneeId: input.assigneeId ?? null,
      dueDate: input.dueDate ?? null,
      createdBy: opts.actorId,
      completedAt: completedAtFor(status, null),
      originNoteId: input.originNoteId ?? null,
    },
    executor,
  );

  await recordActivity(
    {
      verb: "created",
      entity: "task",
      entityId: row.id,
      ventureId: input.ventureId,
      actorId: opts.actorId,
    },
    executor,
  );

  return row;
}

export async function editTask(input: EditTaskInput, opts: MutateOpts) {
  const executor = opts.executor;
  const previous = await getTask(input.taskId, executor);
  if (!previous) throw new Error("task not found");

  const title = input.title !== undefined ? input.title.trim() : previous.title;
  if (!title) throw new Error("title is required");

  const row = await updateTaskRow(
    input.taskId,
    {
      title,
      description:
        input.description !== undefined
          ? input.description
          : previous.description,
      priority: input.priority ?? previous.priority,
    },
    executor,
  );

  await recordActivity(
    {
      verb: verbFor({
        kind: "edit",
        previous,
        next: {
          status: previous.status,
          lane: previous.lane,
          assigneeId: previous.assigneeId,
        },
      }),
      entity: "task",
      entityId: row.id,
      ventureId: previous.ventureId,
      actorId: opts.actorId,
    },
    executor,
  );

  return row;
}

export async function assignTask(
  input: { taskId: string; assigneeId: string | null },
  opts: MutateOpts,
) {
  const executor = opts.executor;
  const previous = await getTask(input.taskId, executor);
  if (!previous) throw new Error("task not found");

  const row = await updateTaskRow(
    input.taskId,
    { assigneeId: input.assigneeId },
    executor,
  );

  await recordActivity(
    {
      verb: "assigned",
      entity: "task",
      entityId: row.id,
      ventureId: previous.ventureId,
      actorId: opts.actorId,
    },
    executor,
  );

  return row;
}

export async function setTaskDueDate(
  input: { taskId: string; dueDate: string | null },
  opts: MutateOpts,
) {
  const executor = opts.executor;
  const previous = await getTask(input.taskId, executor);
  if (!previous) throw new Error("task not found");

  const row = await updateTaskRow(
    input.taskId,
    { dueDate: input.dueDate },
    executor,
  );

  await recordActivity(
    {
      verb: "updated",
      entity: "task",
      entityId: row.id,
      ventureId: previous.ventureId,
      actorId: opts.actorId,
    },
    executor,
  );

  return row;
}

export async function changeTaskStatus(
  input: { taskId: string; status: TaskStatus },
  opts: MutateOpts,
) {
  const status = requireBoardStatus(input.status);
  const previous = await getTask(input.taskId, opts.executor);
  if (!previous) throw new Error("task not found");
  if (previous.status === status) return previous;

  return reorderTask(
    { taskId: input.taskId, lane: previous.lane, status },
    opts,
  );
}

export async function reorderTask(input: ReorderTaskInput, opts: MutateOpts) {
  const lane = requireBoardLane(input.lane);
  const status = requireBoardStatus(input.status);
  const executor = opts.executor;
  const previous = await getTask(input.taskId, executor);
  if (!previous) throw new Error("task not found");

  const { position, cell } = await positionInCell(
    { ...input, lane, status },
    previous.ventureId,
    executor,
  );

  const row = await updateTaskRow(
    input.taskId,
    {
      lane,
      status,
      position,
      completedAt: completedAtFor(status, previous.completedAt),
    },
    executor,
  );

  await rebalanceIfNeeded({ id: row.id, position }, cell, executor);

  await recordActivity(
    {
      verb: verbFor({
        kind: "reorder",
        previous,
        next: { status, lane, assigneeId: previous.assigneeId },
      }),
      entity: "task",
      entityId: row.id,
      ventureId: previous.ventureId,
      actorId: opts.actorId,
    },
    executor,
  );

  return row;
}
