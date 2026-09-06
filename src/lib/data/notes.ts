/**
 * Founder-reachable note reads and partner writes. Pages never touch `db`
 * (ADR-0006). Founder visibility filter (`shared` only) lands in S14.
 */
import { and, count, desc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { db } from "@/db";
import {
  decisions,
  noteMentions,
  notes,
  noteVersions,
  tasks,
  users,
  ventures,
  type visibility,
} from "@/db/schema";
import { recordActivity } from "@/lib/data/activity";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";
import {
  EMPTY_DOC,
  asEditorDoc,
  diffMentions,
  flattenToPlainText,
  shouldSnapshot,
} from "@/lib/notes/save";

export type Executor = typeof db;

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

export type PartnerNoteIndexItem = PartnerNote & {
  ventureName: string | null;
  ventureColor: string | null;
};

export type PartnerNoteDetail = PartnerNote & {
  content: unknown;
  createdAt: Date;
  createdBy: string | null;
  lastEditedBy: string | null;
  lastEditedByName: string | null;
  lastEditedByInitials: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  ventureSlug: string | null;
  versionCount: number;
};

const listColumns = {
  id: notes.id,
  ventureId: notes.ventureId,
  title: notes.title,
  visibility: notes.visibility,
  isFavorite: notes.isFavorite,
  parentNoteId: notes.parentNoteId,
  updatedAt: notes.updatedAt,
};

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
    .select(listColumns)
    .from(notes)
    .where(and(eq(notes.ventureId, ventureId), isNull(notes.archivedAt)))
    .orderBy(desc(notes.updatedAt));
}

export async function listAllNotes(
  user: CurrentUser,
  executor: Executor = db,
): Promise<PartnerNoteIndexItem[]> {
  if (!isInternalUser(user)) return [];
  return executor
    .select({
      ...listColumns,
      ventureName: ventures.name,
      ventureColor: ventures.color,
    })
    .from(notes)
    .leftJoin(ventures, eq(notes.ventureId, ventures.id))
    .where(isNull(notes.archivedAt))
    .orderBy(desc(notes.updatedAt));
}

export async function getNoteById(
  user: InternalUser,
  noteId: string,
  executor?: Executor,
): Promise<PartnerNoteDetail | null>;
export async function getNoteById(
  user: CurrentUser,
  noteId: string,
  executor?: Executor,
): Promise<PartnerNoteDetail | FounderNote | null>;
export async function getNoteById(
  user: CurrentUser,
  noteId: string,
  executor: Executor = db,
): Promise<PartnerNoteDetail | FounderNote | null> {
  if (!isInternalUser(user)) {
    // S14: studio or out-of-scope id → 404.
    void noteId;
    return null;
  }
  const [row] = await executor
    .select({
      ...listColumns,
      content: notes.content,
      createdAt: notes.createdAt,
      createdBy: notes.createdBy,
      lastEditedBy: notes.lastEditedBy,
      lastEditedByName: users.name,
      lastEditedByInitials: users.initials,
      ventureName: ventures.name,
      ventureColor: ventures.color,
      ventureSlug: ventures.slug,
    })
    .from(notes)
    .leftJoin(users, eq(notes.lastEditedBy, users.id))
    .leftJoin(ventures, eq(notes.ventureId, ventures.id))
    .where(and(eq(notes.id, noteId), isNull(notes.archivedAt)))
    .limit(1);
  if (!row) return null;

  const [versions] = await executor
    .select({ n: count() })
    .from(noteVersions)
    .where(eq(noteVersions.noteId, noteId));

  return { ...row, versionCount: versions?.n ?? 0 };
}

export async function listMentionedNotes(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<PartnerNote[]> {
  if (!isInternalUser(user)) return [];
  return executor
    .select(listColumns)
    .from(notes)
    .innerJoin(noteMentions, eq(noteMentions.noteId, notes.id))
    .where(
      and(
        eq(noteMentions.ventureId, ventureId),
        isNull(notes.archivedAt),
        or(isNull(notes.ventureId), ne(notes.ventureId, ventureId)),
      ),
    )
    .orderBy(desc(notes.updatedAt));
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

export type CreateNoteInput = {
  title?: string;
  ventureId?: string | null;
  parentNoteId?: string | null;
};

export async function createNote(
  user: CurrentUser,
  input: CreateNoteInput = {},
  executor: Executor = db,
): Promise<PartnerNoteDetail> {
  if (!isInternalUser(user)) {
    throw new Error("forbidden");
  }
  const title = input.title?.trim() || "Untitled";
  const [row] = await executor
    .insert(notes)
    .values({
      title,
      ventureId: input.ventureId ?? null,
      parentNoteId: input.parentNoteId ?? null,
      content: EMPTY_DOC,
      plainText: "",
      createdBy: user.id,
      lastEditedBy: user.id,
    })
    .returning({ id: notes.id });
  if (!row) throw new Error("note insert returned no row");

  const created = await getNoteById(user, row.id, executor);
  if (!created) throw new Error("note insert could not be re-read");
  return created;
}

export type SaveNoteInput = {
  noteId: string;
  content: unknown;
  title?: string;
  reason: "blur" | "interval" | "flush";
};

export type SaveNoteResult = {
  id: string;
  updatedAt: Date;
  lastEditedByName: string | null;
  snapshotted: boolean;
};

export async function saveNote(
  user: CurrentUser,
  input: SaveNoteInput,
  executor: Executor = db,
): Promise<SaveNoteResult | null> {
  if (!isInternalUser(user)) return null;

  const [existing] = await executor
    .select({
      id: notes.id,
      content: notes.content,
      title: notes.title,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(and(eq(notes.id, input.noteId), isNull(notes.archivedAt)))
    .limit(1);
  if (!existing) return null;

  const content = asEditorDoc(input.content);
  const title = input.title?.trim() || existing.title;
  const hasChanges =
    JSON.stringify(existing.content) !== JSON.stringify(content) ||
    title !== existing.title;
  if (!hasChanges) {
    return {
      id: existing.id,
      updatedAt: existing.updatedAt,
      lastEditedByName: null,
      snapshotted: false,
    };
  }

  const now = new Date();
  const plainText = flattenToPlainText(content);
  const [updated] = await executor
    .update(notes)
    .set({
      content,
      plainText,
      title,
      lastEditedBy: user.id,
      updatedAt: now,
    })
    .where(eq(notes.id, input.noteId))
    .returning({
      id: notes.id,
      updatedAt: notes.updatedAt,
    });
  if (!updated) return null;

  const { added, removed } = diffMentions(existing.content, content);
  if (removed.length > 0) {
    await executor
      .delete(noteMentions)
      .where(
        and(
          eq(noteMentions.noteId, input.noteId),
          inArray(noteMentions.ventureId, removed),
        ),
      );
  }
  for (const ventureId of added) {
    await executor
      .insert(noteMentions)
      .values({ noteId: input.noteId, ventureId })
      .onConflictDoNothing();
    await recordActivity(
      {
        verb: "mentioned",
        entity: "note",
        entityId: input.noteId,
        ventureId,
        actorId: user.id,
      },
      executor,
    );
  }

  const [latest] = await executor
    .select({ createdAt: noteVersions.createdAt })
    .from(noteVersions)
    .where(eq(noteVersions.noteId, input.noteId))
    .orderBy(desc(noteVersions.createdAt))
    .limit(1);

  const snapshotted = shouldSnapshot({
    reason: input.reason === "interval" ? "interval" : "blur",
    hasChanges: true,
    since: latest?.createdAt ?? existing.createdAt,
    now,
  });
  if (snapshotted) {
    await executor.insert(noteVersions).values({
      noteId: input.noteId,
      content,
      editedBy: user.id,
    });
  }

  const [editor] = await executor
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return {
    id: updated.id,
    updatedAt: updated.updatedAt,
    lastEditedByName: editor?.name ?? null,
    snapshotted,
  };
}

export async function archiveNote(
  user: CurrentUser,
  noteId: string,
  executor: Executor = db,
): Promise<{ id: string } | null> {
  if (!isInternalUser(user)) return null;
  const [row] = await executor
    .update(notes)
    .set({ archivedAt: new Date() })
    .where(and(eq(notes.id, noteId), isNull(notes.archivedAt)))
    .returning({ id: notes.id });
  if (!row) return null;

  await executor
    .update(tasks)
    .set({ originNoteId: null })
    .where(eq(tasks.originNoteId, noteId));
  await executor
    .update(decisions)
    .set({ sourceNoteId: null })
    .where(eq(decisions.sourceNoteId, noteId));
  await executor.delete(noteMentions).where(eq(noteMentions.noteId, noteId));
  return row;
}
