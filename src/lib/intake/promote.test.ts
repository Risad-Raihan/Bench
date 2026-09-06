import { asc, eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  activity,
  applications,
  docs,
  gateItems,
  stageTemplates,
  users,
  ventureStageEvents,
} from "@/db/schema";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDb)("createVentureFromApplication", () => {
  test("uses createVenture for shared writes, attaches the deck, and marks the application approved", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVentureFromApplication } = await import("./promote");
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
    ]);

    const [application] = await db
      .insert(applications)
      .values({
        companyName: "ImmiClaw",
        founderName: "Tunde Adeyemi",
        founderEmail: "tunde@example.com",
        problem: "Agents drown in paperwork",
        marketSize: "West Africa study-abroad",
        deckStorageKey: "blob://decks/immi.pdf",
        deckName: "deck.pdf",
        deckMimeType: "application/pdf",
        deckSizeBytes: 2400,
      })
      .returning();

    const venture = await createVentureFromApplication(application.id, {
      actorId: actor.id,
      executor: db,
    });

    expect(venture.stage).toBe("meet");
    expect(venture.name).toBe("ImmiClaw");
    expect(venture.oneLiner).toBe("Agents drown in paperwork");
    expect(venture.market).toBe("West Africa study-abroad");
    expect(venture.founderName).toBe("Tunde Adeyemi");
    expect(venture.founderEmail).toBe("tunde@example.com");
    expect(venture.createdBy).toBe(actor.id);

    const [event] = await db
      .select()
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, venture.id));
    expect(event.fromStage).toBeNull();
    expect(event.toStage).toBe("meet");
    expect(event.actorId).toBe(actor.id);

    const gates = await db
      .select()
      .from(gateItems)
      .where(eq(gateItems.ventureId, venture.id))
      .orderBy(asc(gateItems.sortOrder));
    expect(gates.map((g) => g.label)).toEqual(["Founder call logged"]);

    const [row] = await db
      .select()
      .from(activity)
      .where(eq(activity.ventureId, venture.id));
    expect(row.verb).toBe("created");
    expect(row.entity).toBe("venture");
    expect(row.actorId).toBe(actor.id);
    expect(row.payload).toEqual({
      source: "application",
      applicationId: application.id,
    });

    const [doc] = await db
      .select()
      .from(docs)
      .where(eq(docs.ventureId, venture.id));
    expect(doc.name).toBe("deck.pdf");
    expect(doc.folder).toBe("Application");
    expect(doc.storageKey).toBe("blob://decks/immi.pdf");
    expect(doc.uploadedBy).toBe(actor.id);

    const [updated] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, application.id));
    expect(updated.status).toBe("approved");
    expect(updated.ventureId).toBe(venture.id);
  });
});
