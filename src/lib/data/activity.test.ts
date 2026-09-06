import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import { activity, notifications, tasks, users, ventures } from "@/db/schema";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDb)("recordActivity", () => {
  test("writes one activity row and notifies the assignee, never the actor", async () => {
    const { getTestDb, truncateActivityGraph } = await import("@/test/db");
    const { recordActivity, unreadCount } = await import("./activity");
    const db = getTestDb();
    await truncateActivityGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "actor@aponvlab.io",
        name: "Actor",
        initials: "AA",
        role: "partner",
      })
      .returning({ id: users.id });
    const [assignee] = await db
      .insert(users)
      .values({
        email: "assignee@aponvlab.io",
        name: "Assignee",
        initials: "AS",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: assignee.id })
      .returning({ id: ventures.id });
    const [task] = await db
      .insert(tasks)
      .values({
        title: "Write the memo",
        lane: "thesis",
        ventureId: venture.id,
        assigneeId: assignee.id,
        createdBy: actor.id,
      })
      .returning({ id: tasks.id });

    const written = await recordActivity(
      {
        verb: "assigned",
        entity: "task",
        entityId: task.id,
        ventureId: venture.id,
        actorId: actor.id,
      },
      db,
    );

    const activityRows = await db.select().from(activity);
    expect(activityRows).toHaveLength(1);
    expect(activityRows[0].id).toBe(written.id);
    expect(activityRows[0].verb).toBe("assigned");
    expect(activityRows[0].actorId).toBe(actor.id);

    const notes = await db.select().from(notifications);
    expect(notes).toHaveLength(1);
    expect(notes[0].userId).toBe(assignee.id);
    expect(notes[0].activityId).toBe(written.id);
    expect(notes[0].readAt).toBeNull();

    expect(await unreadCount(assignee.id, db)).toBe(1);
    expect(await unreadCount(actor.id, db)).toBe(0);
  });

  test("engaged notifies every other partner", async () => {
    const { getTestDb, truncateActivityGraph } = await import("@/test/db");
    const { recordActivity } = await import("./activity");
    const db = getTestDb();
    await truncateActivityGraph(db);

    const inserted = await db
      .insert(users)
      .values([
        {
          email: "a@aponvlab.io",
          name: "Actor",
          initials: "AA",
          role: "partner",
        },
        {
          email: "b@aponvlab.io",
          name: "Beta",
          initials: "BB",
          role: "partner",
        },
        {
          email: "c@aponvlab.io",
          name: "Gamma",
          initials: "CC",
          role: "partner",
        },
        {
          email: "founder@example.com",
          name: "Founder",
          initials: "FF",
          role: "founder",
        },
      ])
      .returning({ id: users.id, role: users.role });
    const actor = inserted.find((u) => u.role === "partner")!;
    const otherPartners = inserted.filter(
      (u) => u.role === "partner" && u.id !== actor.id,
    );

    const written = await recordActivity(
      {
        verb: "engaged",
        entity: "venture",
        entityId: actor.id,
        actorId: actor.id,
      },
      db,
    );

    const notes = await db
      .select()
      .from(notifications)
      .where(eq(notifications.activityId, written.id));
    expect(notes.map((n) => n.userId).sort()).toEqual(
      otherPartners.map((p) => p.id).sort(),
    );
  });

  test("stale writes activity and no notifications", async () => {
    const { getTestDb, truncateActivityGraph } = await import("@/test/db");
    const { recordActivity, unreadCount } = await import("./activity");
    const db = getTestDb();
    await truncateActivityGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "actor@aponvlab.io",
        name: "Actor",
        initials: "AA",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: actor.id })
      .returning({ id: ventures.id });

    await recordActivity(
      {
        verb: "stale",
        entity: "venture",
        entityId: venture.id,
        ventureId: venture.id,
        actorId: null,
      },
      db,
    );

    expect(await db.select().from(activity)).toHaveLength(1);
    expect(await db.select().from(notifications)).toHaveLength(0);
    expect(await unreadCount(actor.id, db)).toBe(0);
  });
});

describe.skipIf(!hasTestDb)("activity feeds", () => {
  test("lists a venture's activity newest first, not the other venture's", async () => {
    const { getTestDb, truncateActivityGraph } = await import("@/test/db");
    const { recordActivity, listVentureActivity, listActivity } =
      await import("./activity");
    const db = getTestDb();
    await truncateActivityGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "actor@aponvlab.io",
        name: "Actor",
        initials: "AA",
        role: "partner",
      })
      .returning({ id: users.id, initials: users.initials });
    const [immi] = await db
      .insert(ventures)
      .values({ slug: "immi", name: "ImmiClaw", ownerId: actor.id })
      .returning({ id: ventures.id });
    const [chhar] = await db
      .insert(ventures)
      .values({ slug: "chhar", name: "Chhar", ownerId: actor.id })
      .returning({ id: ventures.id });

    await recordActivity(
      {
        verb: "created",
        entity: "venture",
        entityId: immi.id,
        ventureId: immi.id,
        actorId: actor.id,
      },
      db,
    );
    await recordActivity(
      {
        verb: "uploaded",
        entity: "doc",
        entityId: immi.id,
        ventureId: immi.id,
        actorId: actor.id,
        payload: { name: "deck.pdf" },
      },
      db,
    );
    await recordActivity(
      {
        verb: "created",
        entity: "venture",
        entityId: chhar.id,
        ventureId: chhar.id,
        actorId: actor.id,
      },
      db,
    );

    const partner = { id: actor.id, role: "partner" as const, ventureIds: [] };
    const immiFeed = await listVentureActivity(partner, immi.id, db);
    expect(immiFeed.map((row) => row.verb)).toEqual(["uploaded", "created"]);
    expect(immiFeed[0].actorInitials).toBe("AA");
    expect(immiFeed[0].ventureName).toBe("ImmiClaw");
    expect(immiFeed.every((row) => row.ventureId === immi.id)).toBe(true);

    const global = await listActivity(partner, db);
    expect(global).toHaveLength(3);
    expect(global[0].ventureName).toBe("Chhar");
  });
});

describe.skipIf(!hasTestDb)("notifications inbox", () => {
  test("lists the current partner's directed notifications and marks them read", async () => {
    const { getTestDb, truncateActivityGraph } = await import("@/test/db");
    const {
      recordActivity,
      listNotifications,
      markRead,
      markAllRead,
      unreadCount,
    } = await import("./activity");
    const db = getTestDb();
    await truncateActivityGraph(db);

    const inserted = await db
      .insert(users)
      .values([
        {
          email: "a@aponvlab.io",
          name: "Actor",
          initials: "AA",
          role: "partner",
        },
        {
          email: "b@aponvlab.io",
          name: "Beta",
          initials: "BB",
          role: "partner",
        },
        {
          email: "c@aponvlab.io",
          name: "Gamma",
          initials: "CC",
          role: "partner",
        },
      ])
      .returning({ id: users.id, initials: users.initials });
    const actor = inserted[0];
    const beta = inserted[1];
    const gamma = inserted[2];

    const [venture] = await db
      .insert(ventures)
      .values({
        slug: "immi",
        name: "ImmiClaw",
        ownerId: beta.id,
        color: "var(--magenta)",
      })
      .returning({ id: ventures.id });
    const [task] = await db
      .insert(tasks)
      .values({
        title: "Write the memo",
        lane: "thesis",
        ventureId: venture.id,
        assigneeId: beta.id,
        createdBy: actor.id,
      })
      .returning({ id: tasks.id });

    await recordActivity(
      {
        verb: "assigned",
        entity: "task",
        entityId: task.id,
        ventureId: venture.id,
        actorId: actor.id,
      },
      db,
    );
    await recordActivity(
      {
        verb: "uploaded",
        entity: "doc",
        entityId: task.id,
        ventureId: venture.id,
        actorId: actor.id,
        payload: { name: "deck.pdf" },
      },
      db,
    );

    const actorUser = { id: actor.id, role: "partner" as const, ventureIds: [] };
    const betaUser = { id: beta.id, role: "partner" as const, ventureIds: [] };
    const gammaUser = { id: gamma.id, role: "partner" as const, ventureIds: [] };

    expect(await listNotifications(actorUser, db)).toEqual([]);
    expect(await listNotifications(gammaUser, db)).toEqual([]);

    const inbox = await listNotifications(betaUser, db);
    expect(inbox).toHaveLength(2);
    expect(inbox.map((n) => n.verb)).toEqual(["uploaded", "assigned"]);
    expect(inbox[0].actorInitials).toBe("AA");
    expect(inbox[0].entity).toBe("doc");
    expect(inbox[0].ventureName).toBe("ImmiClaw");
    expect(inbox.every((n) => n.readAt === null)).toBe(true);
    expect(await unreadCount(beta.id, db)).toBe(2);

    await markRead(betaUser, inbox[0].id, db);
    expect(await unreadCount(beta.id, db)).toBe(1);
    const afterOne = await listNotifications(betaUser, db);
    expect(afterOne[0].readAt).not.toBeNull();
    expect(afterOne[1].readAt).toBeNull();

    await markAllRead(betaUser, db);
    expect(await unreadCount(beta.id, db)).toBe(0);
    expect(
      (await listNotifications(betaUser, db)).every((n) => n.readAt != null),
    ).toBe(true);
  });
});
