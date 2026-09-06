"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { createNote, saveNote } from "@/lib/data/notes";

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

export async function createNoteAction(input: {
  ventureId?: string | null;
  slug?: string | null;
}): Promise<NoteActionResult> {
  const user = await requirePartner();
  try {
    const row = await createNote(user, {
      ventureId: input.ventureId ?? null,
    });
    revalidatePath("/notes");
    if (input.slug) revalidatePath(`/v/${input.slug}`);
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
