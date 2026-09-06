import { describe, expect, test } from "vitest";
import {
  activity,
  noteMentions,
  notes,
  tasks,
  users,
  ventureMembers,
  ventures,
} from "@/db/schema";
import type { CurrentUser } from "@/lib/auth/resolve";
import { EMPTY_DOC } from "@/lib/notes/save";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

function founder(id: string, ventureId: string): CurrentUser {
  return { id, role: "founder", ventureIds: [ventureId] };
}

function partner(id: string): CurrentUser {
  return { id, role: "partner", ventureIds: [] };
}

describe.skipIf(!hasTestDb)("founder access (ADR-0006)", () => {
  test("a founder on venture A cannot see B, partner-only fields, or studio notes", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { getVenture, listVentures } = await import("./ventures");
    const { getNoteById, listMentionedNotes, listNotes, saveNote } =
      await import("./notes");
    const { authorizeDocUpload } = await import("./docs");
    const { listVentureActivity } = await import("./activity");
    const { addTaskComment } = await import("./tasks");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [owner] = await db
      .insert(users)
      .values({
        email: "sr@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [founderUser] = await db
      .insert(users)
      .values({
        email: "tunde@example.com",
        name: "Tunde Adeyemi",
        initials: "TA",
        role: "founder",
      })
      .returning({ id: users.id });

    const [ventureA] = await db
      .insert(ventures)
      .values({
        slug: "immiclaw",
        name: "ImmiClaw",
        equityPct: 0.45,
        potential: "high",
        ownerId: owner.id,
        founderName: "Tunde Adeyemi",
      })
      .returning({ id: ventures.id, slug: ventures.slug });
    const [ventureB] = await db
      .insert(ventures)
      .values({
        slug: "chhar",
        name: "Chhar",
        equityPct: 0.31,
        potential: "medium",
        ownerId: owner.id,
      })
      .returning({ id: ventures.id, slug: ventures.slug });

    await db.insert(ventureMembers).values({
      ventureId: ventureA.id,
      userId: founderUser.id,
      role: "founder",
    });

    const [studioNote] = await db
      .insert(notes)
      .values({
        title: "Internal thesis",
        ventureId: ventureA.id,
        visibility: "studio",
        content: EMPTY_DOC,
        plainText: "",
        createdBy: owner.id,
      })
      .returning({ id: notes.id });
    const [sharedNote] = await db
      .insert(notes)
      .values({
        title: "Shared update",
        ventureId: ventureA.id,
        visibility: "shared",
        content: EMPTY_DOC,
        plainText: "",
        createdBy: owner.id,
      })
      .returning({ id: notes.id });
    const [mentionedStudio] = await db
      .insert(notes)
      .values({
        title: "Studio weekly",
        ventureId: ventureB.id,
        visibility: "studio",
        content: EMPTY_DOC,
        plainText: "",
        createdBy: owner.id,
      })
      .returning({ id: notes.id });
    await db.insert(noteMentions).values({
      noteId: mentionedStudio.id,
      ventureId: ventureA.id,
    });

    const [taskA] = await db
      .insert(tasks)
      .values({
        title: "Write the memo",
        lane: "thesis",
        ventureId: ventureA.id,
        createdBy: owner.id,
      })
      .returning({ id: tasks.id });
    const [taskB] = await db
      .insert(tasks)
      .values({
        title: "Other venture task",
        lane: "gtm",
        ventureId: ventureB.id,
        createdBy: owner.id,
      })
      .returning({ id: tasks.id });

    await db.insert(activity).values([
      {
        verb: "uploaded",
        entity: "doc",
        entityId: sharedNote.id,
        ventureId: ventureA.id,
        actorId: owner.id,
        payload: { name: "deck.pdf" },
      },
      {
        verb: "passed",
        entity: "venture",
        entityId: ventureA.id,
        ventureId: ventureA.id,
        actorId: owner.id,
      },
      {
        verb: "cleared",
        entity: "venture",
        entityId: ventureA.id,
        ventureId: ventureA.id,
        actorId: owner.id,
        payload: { label: "Founder call logged" },
      },
    ]);

    const founderUserCtx = founder(founderUser.id, ventureA.id);
    const partnerUser = partner(owner.id);

    expect(await listVentures(founderUserCtx, db)).toEqual([]);
    expect(await getVenture(founderUserCtx, ventureB.slug, db)).toBeNull();

    const payload = await getVenture(founderUserCtx, ventureA.slug, db);
    expect(payload).not.toBeNull();
    expect(payload).not.toHaveProperty("equityPct");
    expect(payload).not.toHaveProperty("potential");
    expect(payload).not.toHaveProperty("ownerId");
    expect(payload?.name).toBe("ImmiClaw");

    const partnerPayload = await getVenture(partnerUser, ventureA.slug, db);
    expect(partnerPayload).toMatchObject({
      equityPct: 0.45,
      potential: "high",
      ownerId: owner.id,
    });
    expect(await getVenture(partnerUser, ventureB.slug, db)).not.toBeNull();

    const founderNotes = await listNotes(founderUserCtx, ventureA.id, db);
    expect(founderNotes.map((n) => n.id)).toEqual([sharedNote.id]);
    expect(await getNoteById(founderUserCtx, studioNote.id, db)).toBeNull();
    const shared = await getNoteById(founderUserCtx, sharedNote.id, db);
    expect(shared?.id).toBe(sharedNote.id);
    expect(shared).toHaveProperty("content");

    const partnerNotes = await listNotes(partnerUser, ventureA.id, db);
    expect(partnerNotes.map((n) => n.id).sort()).toEqual(
      [studioNote.id, sharedNote.id].sort(),
    );
    expect(await getNoteById(partnerUser, studioNote.id, db)).not.toBeNull();

    expect(
      await listMentionedNotes(founderUserCtx, ventureA.id, db),
    ).toEqual([]);

    const feed = await listVentureActivity(founderUserCtx, ventureA.id, db);
    expect(feed.map((row) => row.verb)).toEqual(["uploaded"]);
    expect(feed[0]).not.toHaveProperty("payload");
    const partnerFeed = await listVentureActivity(partnerUser, ventureA.id, db);
    expect(partnerFeed.map((row) => row.verb).sort()).toEqual(
      ["cleared", "passed", "uploaded"].sort(),
    );

    const saved = await saveNote(
      founderUserCtx,
      {
        noteId: sharedNote.id,
        content: {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: "hello" }] },
          ],
        },
        reason: "blur",
      },
      db,
    );
    expect(saved?.id).toBe(sharedNote.id);
    expect(
      await saveNote(
        founderUserCtx,
        { noteId: studioNote.id, content: EMPTY_DOC, reason: "blur" },
        db,
      ),
    ).toBeNull();

    const comment = await addTaskComment(
      founderUserCtx,
      { taskId: taskA.id, body: "Need the memo this week." },
      db,
    );
    expect(comment?.id).toBeTruthy();
    expect(
      await addTaskComment(
        founderUserCtx,
        { taskId: taskB.id, body: "Should not land." },
        db,
      ),
    ).toBeNull();

    const authorized = await authorizeDocUpload(
      founderUserCtx,
      {
        ventureId: ventureA.id,
        name: "deck.pdf",
        visibility: "studio",
      },
      db,
    );
    expect(authorized.visibility).toBe("shared");
    expect(authorized.ventureId).toBe(ventureA.id);
    await expect(
      authorizeDocUpload(
        founderUserCtx,
        { ventureId: ventureB.id, name: "secret.pdf" },
        db,
      ),
    ).rejects.toThrow(/not found/i);
  });
});
