import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  activity,
  decisions,
  noteMentions,
  notes,
  notifications,
  tasks,
  users,
  ventures,
} from "@/db/schema";
import type { CurrentUser } from "@/lib/auth/resolve";
import { EMPTY_DOC } from "@/lib/notes/save";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

function partner(id: string): CurrentUser {
  return { id, role: "partner", ventureIds: [] };
}

function mentionDoc(ventureId: string, label: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "mention", attrs: { ventureId, label } }],
      },
    ],
  };
}

describe.skipIf(!hasTestDb)("note capture", () => {
  test("/task from a note writes a board row with origin_note_id and leaves it when the note is archived", async () => {
    const { getTestDb, truncateNoteCaptureGraph } = await import("@/test/db");
    const { createNote, archiveNote } = await import("@/lib/data/notes");
    const { createTask } = await import("@/lib/tasks/mutate");
    const db = getTestDb();
    await truncateNoteCaptureGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "sr@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: actor.id })
      .returning({ id: ventures.id });
    const note = await createNote(
      partner(actor.id),
      { ventureId: venture.id, title: "Call with Tunde" },
      db,
    );

    const task = await createTask(
      {
        ventureId: venture.id,
        title: "Draft term sheet",
        lane: "capital",
        originNoteId: note.id,
      },
      { actorId: actor.id, executor: db },
    );

    expect(task.originNoteId).toBe(note.id);
    expect(task.ventureId).toBe(venture.id);
    expect(task.lane).toBe("capital");
    expect(task.status).toBe("todo");

    await archiveNote(partner(actor.id), note.id, db);

    const [surviving] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, task.id));
    expect(surviving).toBeDefined();
    expect(surviving.archivedAt).toBeNull();
    expect(surviving.originNoteId).toBeNull();
  });

  test("/decision freezes decided_by and decided_at when the title is later edited", async () => {
    const { getTestDb, truncateNoteCaptureGraph } = await import("@/test/db");
    const { createNote } = await import("@/lib/data/notes");
    const { createDecision } = await import("@/lib/decisions/create");
    const { updateDecisionTitle } = await import("@/lib/data/decisions");
    const db = getTestDb();
    await truncateNoteCaptureGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "sr@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [owner] = await db
      .insert(users)
      .values({
        email: "ms@aponvlab.io",
        name: "Maher",
        initials: "MS",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: owner.id })
      .returning({ id: ventures.id });
    const note = await createNote(
      partner(actor.id),
      { ventureId: venture.id, title: "Call with Tunde" },
      db,
    );

    const decision = await createDecision(
      {
        ventureId: venture.id,
        title: "No exclusivity",
        sourceNoteId: note.id,
      },
      { actorId: actor.id, executor: db },
    );

    expect(decision.decidedBy).toBe(actor.id);
    expect(decision.sourceNoteId).toBe(note.id);
    const frozenAt = decision.decidedAt;

    const activityRows = await db
      .select()
      .from(activity)
      .where(eq(activity.verb, "decided"));
    expect(activityRows).toHaveLength(1);
    const fans = await db
      .select()
      .from(notifications)
      .where(eq(notifications.activityId, activityRows[0].id));
    expect(fans.map((n) => n.userId)).toEqual([owner.id]);

    const updated = await updateDecisionTitle(
      decision.id,
      "No exclusivity in the term sheet",
      db,
    );
    expect(updated.title).toBe("No exclusivity in the term sheet");
    expect(updated.decidedBy).toBe(actor.id);
    expect(updated.decidedAt.getTime()).toBe(frozenAt.getTime());
  });

  test("@venture reconciles note_mentions on autosave and notifies the venture owner", async () => {
    const { getTestDb, truncateNoteCaptureGraph } = await import("@/test/db");
    const { createNote, listMentionedNotes, saveNote } = await import(
      "@/lib/data/notes"
    );
    const db = getTestDb();
    await truncateNoteCaptureGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "sr@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [owner] = await db
      .insert(users)
      .values({
        email: "ms@aponvlab.io",
        name: "Maher",
        initials: "MS",
        role: "partner",
      })
      .returning({ id: users.id });
    const [home] = await db
      .insert(ventures)
      .values({ slug: "studio", name: "Studio", ownerId: actor.id })
      .returning({ id: ventures.id });
    const [mentioned] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: owner.id })
      .returning({ id: ventures.id });

    const note = await createNote(
      partner(actor.id),
      { ventureId: home.id, title: "Studio weekly" },
      db,
    );

    await saveNote(
      partner(actor.id),
      {
        noteId: note.id,
        content: mentionDoc(mentioned.id, "ImmiClaw"),
        reason: "interval",
      },
      db,
    );

    const links = await db.select().from(noteMentions);
    expect(links).toEqual([
      { noteId: note.id, ventureId: mentioned.id },
    ]);

    const surfaced = await listMentionedNotes(
      partner(actor.id),
      mentioned.id,
      db,
    );
    expect(surfaced.map((n) => n.id)).toEqual([note.id]);

    const mentionedEvents = await db
      .select()
      .from(activity)
      .where(eq(activity.verb, "mentioned"));
    expect(mentionedEvents).toHaveLength(1);
    const fans = await db
      .select()
      .from(notifications)
      .where(eq(notifications.activityId, mentionedEvents[0].id));
    expect(fans.map((n) => n.userId)).toEqual([owner.id]);

    await saveNote(
      partner(actor.id),
      {
        noteId: note.id,
        content: EMPTY_DOC,
        reason: "interval",
      },
      db,
    );

    const after = await db.select().from(noteMentions);
    expect(after).toEqual([]);
    const gone = await listMentionedNotes(
      partner(actor.id),
      mentioned.id,
      db,
    );
    expect(gone).toEqual([]);
  });

  test("deleting a task or decision block is not a row delete — only note archive nulls the back-link", async () => {
    const { getTestDb, truncateNoteCaptureGraph } = await import("@/test/db");
    const { createNote, archiveNote } = await import("@/lib/data/notes");
    const { createDecision } = await import("@/lib/decisions/create");
    const db = getTestDb();
    await truncateNoteCaptureGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "sr@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw" })
      .returning({ id: ventures.id });
    const note = await createNote(
      partner(actor.id),
      { ventureId: venture.id, title: "Call" },
      db,
    );
    const decision = await createDecision(
      {
        ventureId: venture.id,
        title: "No exclusivity",
        sourceNoteId: note.id,
      },
      { actorId: actor.id, executor: db },
    );

    const [before] = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, decision.id));
    expect(before.sourceNoteId).toBe(note.id);

    await archiveNote(partner(actor.id), note.id, db);

    const [after] = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, decision.id));
    expect(after).toBeDefined();
    expect(after.sourceNoteId).toBeNull();

    const [noteRow] = await db.select().from(notes).where(eq(notes.id, note.id));
    expect(noteRow.archivedAt).not.toBeNull();
  });
});
