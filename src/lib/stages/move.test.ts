import { asc, eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  activity,
  gateItems,
  stageTemplates,
  users,
  ventureStageEvents,
} from "@/db/schema";
import { reasonRequired } from "./reason";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe("reasonRequired", () => {
  test("true for any backward move, even with gates cleared", () => {
    expect(reasonRequired("validate", "meet", 0)).toBe(true);
    expect(reasonRequired("grow", "meet", 0)).toBe(true);
    expect(reasonRequired("grow", "build", 0)).toBe(true);
  });

  test("true for a forward move with gates still open", () => {
    expect(reasonRequired("meet", "validate", 1)).toBe(true);
    expect(reasonRequired("meet", "build", 6)).toBe(true);
    expect(reasonRequired("form", "grow", 1)).toBe(true);
  });

  test("false for a clean forward move", () => {
    expect(reasonRequired("meet", "validate", 0)).toBe(false);
    expect(reasonRequired("meet", "grow", 0)).toBe(false);
    expect(reasonRequired("build", "form", 0)).toBe(false);
  });

  test("false when the stage is unchanged", () => {
    expect(reasonRequired("meet", "meet", 0)).toBe(false);
    expect(reasonRequired("meet", "meet", 4)).toBe(false);
  });
});

describe.skipIf(!hasTestDb)("seedGatesForStage", () => {
  test("is a no-op when gate items already exist for the (venture, stage)", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVenture } = await import("@/lib/ventures/create");
    const { seedGatesForStage } = await import("./move");
    const db = getTestDb();
    await truncateVentureBirthGraph(db);

    await db.insert(stageTemplates).values([
      {
        stage: "meet",
        kind: "gate",
        label: "Founder call logged",
        sortOrder: 0,
        isActive: true,
      },
      {
        stage: "meet",
        kind: "gate",
        label: "Thesis fit written up",
        sortOrder: 1,
        isActive: true,
      },
      {
        stage: "validate",
        kind: "gate",
        label: "Market memo drafted",
        sortOrder: 0,
        isActive: true,
      },
    ]);

    const venture = await createVenture(
      { name: "ImmiClaw" },
      { executor: db },
    );

    const [first] = await db
      .select()
      .from(gateItems)
      .where(eq(gateItems.ventureId, venture.id))
      .orderBy(asc(gateItems.sortOrder));
    await db
      .update(gateItems)
      .set({ doneAt: new Date() })
      .where(eq(gateItems.id, first.id));

    await seedGatesForStage(venture.id, "meet", db);

    const meetGates = await db
      .select()
      .from(gateItems)
      .where(eq(gateItems.ventureId, venture.id))
      .orderBy(asc(gateItems.sortOrder));
    expect(meetGates).toHaveLength(2);
    expect(meetGates.map((g) => g.label)).toEqual([
      "Founder call logged",
      "Thesis fit written up",
    ]);
    expect(meetGates[0].doneAt).toBeInstanceOf(Date);

    await seedGatesForStage(venture.id, "validate", db);
    await seedGatesForStage(venture.id, "validate", db);

    const allGates = await db
      .select()
      .from(gateItems)
      .where(eq(gateItems.ventureId, venture.id))
      .orderBy(asc(gateItems.stage), asc(gateItems.sortOrder));
    expect(allGates).toHaveLength(3);
    expect(allGates.filter((g) => g.stage === "validate").map((g) => g.label)).toEqual([
      "Market memo drafted",
    ]);
    expect(allGates.find((g) => g.id === first.id)?.doneAt).toBeInstanceOf(
      Date,
    );
  });
});

describe.skipIf(!hasTestDb)("moveStage", () => {
  test("inserts a stage event and never updates an existing one", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVenture } = await import("@/lib/ventures/create");
    const { moveStage } = await import("./move");
    const db = getTestDb();
    await truncateVentureBirthGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "risad@aponvlab.io",
        name: "Risad",
        initials: "RM",
        role: "partner",
      })
      .returning({ id: users.id });

    await db.insert(stageTemplates).values([
      {
        stage: "meet",
        kind: "gate",
        label: "Founder call logged",
        sortOrder: 0,
        isActive: true,
      },
      {
        stage: "validate",
        kind: "gate",
        label: "Market memo drafted",
        sortOrder: 0,
        isActive: true,
      },
    ]);

    const venture = await createVenture(
      { name: "ImmiClaw" },
      { actorId: actor.id, executor: db },
    );
    const enteredAt = venture.stageEnteredAt;

    const [birth] = await db
      .select()
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, venture.id));

    const moved = await moveStage(
      {
        ventureId: venture.id,
        toStage: "validate",
        reason: "Gates can wait",
        actorId: actor.id,
      },
      db,
    );

    expect(moved.stage).toBe("validate");
    expect(moved.stageEnteredAt.getTime()).toBeGreaterThan(enteredAt.getTime());

    const events = await db
      .select()
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, venture.id))
      .orderBy(asc(ventureStageEvents.createdAt));
    expect(events).toHaveLength(2);
    expect(events[0].id).toBe(birth.id);
    expect(events[0].fromStage).toBeNull();
    expect(events[0].toStage).toBe("meet");
    expect(events[0].reason).toBeNull();
    expect(events[1].fromStage).toBe("meet");
    expect(events[1].toStage).toBe("validate");
    expect(events[1].actorId).toBe(actor.id);
    expect(events[1].reason).toBe("Gates can wait");

    const activityRows = await db
      .select()
      .from(activity)
      .where(eq(activity.ventureId, venture.id));
    expect(activityRows.some((row) => row.verb === "updated")).toBe(true);

    await expect(
      moveStage(
        {
          ventureId: venture.id,
          toStage: "meet",
          actorId: actor.id,
        },
        db,
      ),
    ).rejects.toThrow("reason is required");
  });
});
