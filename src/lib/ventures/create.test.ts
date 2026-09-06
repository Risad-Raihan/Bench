import { asc, eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  activity,
  gateItems,
  stageTemplates,
  users,
  ventures,
  ventureStageEvents,
} from "@/db/schema";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDb)("createVenture", () => {
  test("writes a meet venture, null→meet event, active-template gates, and one activity row", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVenture } = await import("./create");
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
        stage: "meet",
        kind: "gate",
        label: "Retired gate",
        sortOrder: 2,
        isActive: false,
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
      {
        name: "ImmiClaw",
        oneLiner: "Study-abroad automation for West African agents",
        founderName: "Tunde Adeyemi",
      },
      { executor: db },
    );

    expect(venture.name).toBe("ImmiClaw");
    expect(venture.slug).toBe("immiclaw");
    expect(venture.stage).toBe("meet");
    expect(venture.status).toBe("active");
    expect(venture.oneLiner).toBe(
      "Study-abroad automation for West African agents",
    );
    expect(venture.founderName).toBe("Tunde Adeyemi");
    expect(venture.createdBy).toBeNull();

    const events = await db
      .select()
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, venture.id));
    expect(events).toHaveLength(1);
    expect(events[0].fromStage).toBeNull();
    expect(events[0].toStage).toBe("meet");
    expect(events[0].actorId).toBeNull();

    const gates = await db
      .select()
      .from(gateItems)
      .where(eq(gateItems.ventureId, venture.id))
      .orderBy(asc(gateItems.sortOrder));
    expect(gates.map((g) => g.label)).toEqual([
      "Founder call logged",
      "Thesis fit written up",
    ]);
    expect(gates.every((g) => g.stage === "meet")).toBe(true);

    const activityRows = await db
      .select()
      .from(activity)
      .where(eq(activity.ventureId, venture.id));
    expect(activityRows).toHaveLength(1);
    expect(activityRows[0].verb).toBe("created");
    expect(activityRows[0].entity).toBe("venture");
    expect(activityRows[0].entityId).toBe(venture.id);
    expect(activityRows[0].actorId).toBeNull();
  });

  test("slug collisions produce a unique slug", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVenture } = await import("./create");
    const db = getTestDb();
    await truncateVentureBirthGraph(db);

    await db.insert(ventures).values({
      slug: "immiclaw",
      name: "ImmiClaw existing",
    });

    const venture = await createVenture({ name: "ImmiClaw" }, { executor: db });

    expect(venture.slug).not.toBe("immiclaw");
    expect(venture.slug.startsWith("immiclaw-")).toBe(true);
  });

  test("threads actorId onto the venture, stage event, and activity row", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVenture } = await import("./create");
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

    const venture = await createVenture(
      { name: "ImmiClaw" },
      { actorId: actor.id, executor: db },
    );

    expect(venture.createdBy).toBe(actor.id);

    const [event] = await db
      .select()
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, venture.id));
    expect(event.actorId).toBe(actor.id);

    const [row] = await db
      .select()
      .from(activity)
      .where(eq(activity.ventureId, venture.id));
    expect(row.actorId).toBe(actor.id);
  });
});
