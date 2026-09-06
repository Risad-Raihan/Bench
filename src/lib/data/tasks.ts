/**
 * Task writes and partner-picker reads. Pages never touch `db` (ADR-0006).
 * Founders never see tasks (S14 / CONTEXT.md); these paths are partner-only.
 */
import { and, asc, eq, inArray, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
} from "@/lib/auth/resolve";
import type { Lane, TaskStatus } from "@/lib/lanes";

export type Executor = typeof db;

export type Priority = "low" | "normal" | "high";

export type CellTask = {
  id: string;
  position: number;
};

export type TaskRow = {
  id: string;
  ventureId: string | null;
  title: string;
  description: string | null;
  lane: Lane;
  status: TaskStatus;
  priority: Priority;
  position: number;
  assigneeId: string | null;
  dueDate: string | null;
  createdBy: string | null;
  completedAt: Date | null;
  archivedAt: Date | null;
};

export type AssignablePartner = {
  id: string;
  name: string;
  initials: string;
};

export type InsertTaskValues = {
  ventureId: string;
  title: string;
  description?: string | null;
  lane: Lane;
  status: TaskStatus;
  priority: Priority;
  position: number;
  assigneeId?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  completedAt?: Date | null;
};

export type TaskPatch = {
  title?: string;
  description?: string | null;
  lane?: Lane;
  status?: TaskStatus;
  priority?: Priority;
  position?: number;
  assigneeId?: string | null;
  dueDate?: string | null;
  completedAt?: Date | null;
};

export async function listAssignablePartners(
  user: CurrentUser,
  executor?: Executor,
): Promise<AssignablePartner[]> {
  const run = executor ?? db;
  if (!isInternalUser(user)) return [];
  return run
    .select({
      id: users.id,
      name: users.name,
      initials: users.initials,
    })
    .from(users)
    .where(
      and(
        inArray(users.role, ["partner", "admin", "viewer"]),
        isNull(users.disabledAt),
      ),
    )
    .orderBy(asc(users.name));
}

export async function getTask(
  taskId: string,
  executor?: Executor,
): Promise<TaskRow | null> {
  const run = executor ?? db;
  const [row] = await run
    .select({
      id: tasks.id,
      ventureId: tasks.ventureId,
      title: tasks.title,
      description: tasks.description,
      lane: tasks.lane,
      status: tasks.status,
      priority: tasks.priority,
      position: tasks.position,
      assigneeId: tasks.assigneeId,
      dueDate: tasks.dueDate,
      createdBy: tasks.createdBy,
      completedAt: tasks.completedAt,
      archivedAt: tasks.archivedAt,
    })
    .from(tasks)
    .where(and(eq(tasks.id, taskId), isNull(tasks.archivedAt)))
    .limit(1);
  return row ?? null;
}

export async function listCellTasks(
  args: {
    ventureId: string;
    lane: Lane;
    status: TaskStatus;
    excludeId?: string;
  },
  executor?: Executor,
): Promise<CellTask[]> {
  const run = executor ?? db;
  const where = [
    eq(tasks.ventureId, args.ventureId),
    eq(tasks.lane, args.lane),
    eq(tasks.status, args.status),
    isNull(tasks.archivedAt),
  ];
  return run
    .select({ id: tasks.id, position: tasks.position })
    .from(tasks)
    .where(
      args.excludeId
        ? and(...where, ne(tasks.id, args.excludeId))
        : and(...where),
    )
    .orderBy(asc(tasks.position));
}

export async function insertTask(
  values: InsertTaskValues,
  executor?: Executor,
) {
  const run = executor ?? db;
  const [row] = await run
    .insert(tasks)
    .values({
      ventureId: values.ventureId,
      title: values.title,
      description: values.description ?? null,
      lane: values.lane,
      status: values.status,
      priority: values.priority,
      position: values.position,
      assigneeId: values.assigneeId ?? null,
      dueDate: values.dueDate ?? null,
      createdBy: values.createdBy ?? null,
      completedAt: values.completedAt ?? null,
    })
    .returning();
  if (!row) throw new Error("task insert returned no row");
  return row;
}

export async function updateTaskRow(
  taskId: string,
  patch: TaskPatch,
  executor?: Executor,
) {
  const run = executor ?? db;
  const [row] = await run
    .update(tasks)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();
  if (!row) throw new Error("task update returned no row");
  return row;
}

export async function applyCellPositions(
  updates: { id: string; position: number }[],
  executor?: Executor,
) {
  const run = executor ?? db;
  for (const u of updates) {
    await run
      .update(tasks)
      .set({ position: u.position, updatedAt: new Date() })
      .where(eq(tasks.id, u.id));
  }
}
