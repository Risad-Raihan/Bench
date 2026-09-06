/**
 * Founder-reachable note reads. Partner path returns studio + shared.
 * Founder visibility filter (`shared` only) lands in S14.
 */
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { notes, type visibility } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

type Visibility = (typeof visibility.enumValues)[number];

export type PartnerNote = {
  id: string;
  ventureId: string | null;
  title: string;
  visibility: Visibility;
  isFavorite: boolean;
  parentNoteId: string | null;
  updatedAt: Date;
};

export type FounderNote = PartnerNote;

export async function listNotes(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerNote[]>;
export async function listNotes(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerNote[] | FounderNote[]>;
export async function listNotes(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerNote[] | FounderNote[]> {
  if (!isInternalUser(user)) {
    // S14: visibility = shared, 404 out of scope; studio @mentions do not surface.
    void ventureId;
    return [];
  }
  return db
    .select({
      id: notes.id,
      ventureId: notes.ventureId,
      title: notes.title,
      visibility: notes.visibility,
      isFavorite: notes.isFavorite,
      parentNoteId: notes.parentNoteId,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(and(eq(notes.ventureId, ventureId), isNull(notes.archivedAt)))
    .orderBy(desc(notes.updatedAt));
}

export async function getNoteById(
  user: InternalUser,
  noteId: string,
): Promise<PartnerNote | null>;
export async function getNoteById(
  user: CurrentUser,
  noteId: string,
): Promise<PartnerNote | FounderNote | null>;
export async function getNoteById(
  user: CurrentUser,
  noteId: string,
): Promise<PartnerNote | FounderNote | null> {
  if (!isInternalUser(user)) {
    // S14: studio or out-of-scope id → 404.
    void noteId;
    return null;
  }
  const [row] = await db
    .select({
      id: notes.id,
      ventureId: notes.ventureId,
      title: notes.title,
      visibility: notes.visibility,
      isFavorite: notes.isFavorite,
      parentNoteId: notes.parentNoteId,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(and(eq(notes.id, noteId), isNull(notes.archivedAt)))
    .limit(1);
  return row ?? null;
}

export async function countNotes(
  user: CurrentUser,
  ventureId: string,
): Promise<number> {
  if (!isInternalUser(user)) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(notes)
    .where(and(eq(notes.ventureId, ventureId), isNull(notes.archivedAt)));
  return row?.n ?? 0;
}
