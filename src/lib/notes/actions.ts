"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { getDecisionById, updateDecisionTitle } from "@/lib/data/decisions";
import {
  archiveNote,
  createNote,
  getNoteById,
  saveNote,
} from "@/lib/data/notes";
import { getTaskBlock } from "@/lib/data/tasks";
import { createDecision } from "@/lib/decisions/create";
import type { Lane } from "@/lib/lanes";
import { changeTaskStatus, createTask, editTask } from "@/lib/tasks/mutate";

export type NoteActionResult =
  | {
      ok: true;
      id: string;
      updatedAt?: string;
      lastEditedByName?: string | null;
    }
  | { ok: false; error: string };

function fail(err: unknown, label: string): NoteActionResult {
  console.error(`[${label}] failed`, err);
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Could not save the note.",
  };
}

function revalidateNoteSurfaces(slug?: string | null) {
  revalidatePath("/notes");
  revalidatePath("/");
  revalidatePath("/my-work");
  if (slug) revalidatePath(`/v/${slug}`);
}

export async function createNoteAction(input: {
  ventureId?: string | null;
  slug?: string | null;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await createNote(user, {
      ventureId: input.ventureId ?? null,
    });
    revalidateNoteSurfaces(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "createNote");
  }
}

export async function saveNoteAction(input: {
  noteId: string;
  content: unknown;
  title?: string;
  reason: "blur" | "interval" | "flush";
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await saveNote(user, input);
    if (!row) return { ok: false, error: "Note not found." };
    return {
      ok: true,
      id: row.id,
      updatedAt: row.updatedAt.toISOString(),
      lastEditedByName: row.lastEditedByName,
    };
  } catch (err) {
    return fail(err, "saveNote");
  }
}

export async function createTaskFromNoteAction(input: {
  noteId: string;
  lane: Lane;
  title?: string;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const note = await getNoteById(user, input.noteId);
    if (!note) return { ok: false, error: "Note not found." };
    const row = await createTask(
      {
        ventureId: note.ventureId,
        title: input.title?.trim() || "Untitled",
        lane: input.lane,
        originNoteId: note.id,
      },
      { actorId: user.id },
    );
    revalidateNoteSurfaces("ventureSlug" in note ? note.ventureSlug : null);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "createTaskFromNote");
  }
}

export async function createDecisionFromNoteAction(input: {
  noteId: string;
  title?: string;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const note = await getNoteById(user, input.noteId);
    if (!note) return { ok: false, error: "Note not found." };
    const row = await createDecision(
      {
        ventureId: note.ventureId,
        title: input.title?.trim() || "Untitled",
        sourceNoteId: note.id,
      },
      { actorId: user.id },
    );
    revalidateNoteSurfaces("ventureSlug" in note ? note.ventureSlug : null);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "createDecisionFromNote");
  }
}

export async function getTaskBlockAction(taskId: string) {
  await requirePartner();
  return getTaskBlock(taskId);
}

export async function getDecisionBlockAction(decisionId: string) {
  const user = await requirePartner();
  const row = await getDecisionById(user, decisionId);
  if (!row) return null;
  return { id: row.id, title: row.title };
}

export async function updateNoteTaskTitleAction(input: {
  taskId: string;
  title: string;
  slug?: string | null;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await editTask(
      { taskId: input.taskId, title: input.title },
      { actorId: user.id },
    );
    revalidateNoteSurfaces(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "updateNoteTaskTitle");
  }
}

export async function toggleNoteTaskAction(input: {
  taskId: string;
  done: boolean;
  slug?: string | null;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await changeTaskStatus(
      { taskId: input.taskId, status: input.done ? "done" : "todo" },
      { actorId: user.id },
    );
    revalidateNoteSurfaces(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "toggleNoteTask");
  }
}

export async function updateDecisionTitleAction(input: {
  decisionId: string;
  title: string;
  slug?: string | null;
}): Promise<NoteActionResult> {
  await requirePartner();
  try {
    const row = await updateDecisionTitle(input.decisionId, input.title);
    revalidateNoteSurfaces(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "updateDecisionTitle");
  }
}

export async function archiveNoteAction(input: {
  noteId: string;
  slug?: string | null;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await archiveNote(user, input.noteId);
    if (!row) return { ok: false, error: "Note not found." };
    revalidateNoteSurfaces(input.slug);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "archiveNote");
  }
}
