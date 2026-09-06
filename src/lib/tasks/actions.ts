"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import type { Priority } from "@/lib/data/tasks";
import type { Lane, TaskStatus } from "@/lib/lanes";
import {
  assignTask,
  changeTaskStatus,
  createTask,
  editTask,
  reorderTask,
  setTaskDueDate,
} from "@/lib/tasks/mutate";

export type TaskActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function fail(err: unknown, label: string): TaskActionResult {
  console.error(`[${label}] failed`, err);
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Could not update the task.",
  };
}

function revalidate(slug: string) {
  revalidatePath("/");
  revalidatePath(`/v/${slug}`);
}

export async function createTaskAction(input: {
  slug: string;
  ventureId: string;
  title: string;
  lane: Lane;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string | null;
  dueDate?: string | null;
  description?: string | null;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await createTask(
      {
        ventureId: input.ventureId,
        title: input.title,
        lane: input.lane,
        status: input.status,
        priority: input.priority,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate,
        description: input.description,
      },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "createTask");
  }
}

export async function editTaskAction(input: {
  slug: string;
  taskId: string;
  title?: string;
  description?: string | null;
  priority?: Priority;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await editTask(
      {
        taskId: input.taskId,
        title: input.title,
        description: input.description,
        priority: input.priority,
      },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "editTask");
  }
}

export async function assignTaskAction(input: {
  slug: string;
  taskId: string;
  assigneeId: string | null;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await assignTask(
      { taskId: input.taskId, assigneeId: input.assigneeId },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "assignTask");
  }
}

export async function setTaskDueDateAction(input: {
  slug: string;
  taskId: string;
  dueDate: string | null;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await setTaskDueDate(
      { taskId: input.taskId, dueDate: input.dueDate },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "setTaskDueDate");
  }
}

export async function changeTaskStatusAction(input: {
  slug: string;
  taskId: string;
  status: TaskStatus;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await changeTaskStatus(
      { taskId: input.taskId, status: input.status },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "changeTaskStatus");
  }
}

export async function reorderTaskAction(input: {
  slug: string;
  taskId: string;
  lane: Lane;
  status: TaskStatus;
  beforeId?: string | null;
  afterId?: string | null;
}): Promise<TaskActionResult> {
  const user = await requirePartner();
  try {
    const row = await reorderTask(
      {
        taskId: input.taskId,
        lane: input.lane,
        status: input.status,
        beforeId: input.beforeId,
        afterId: input.afterId,
      },
      { actorId: user.id },
    );
    revalidate(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "reorderTask");
  }
}
