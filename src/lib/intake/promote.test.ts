import { asc, eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  activity,
  applications,
  docs,
  gateItems,
  notifications,
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

    const activityRows = await db
      .select()
      .from(activity)
      .where(eq(activity.ventureId, venture.id));
    const created = activityRows.find((r) => r.verb === "created");
    expect(created).toBeDefined();
    expect(created!.entity).toBe("venture");
    expect(created!.actorId).toBe(actor.id);
    expect(created!.payload).toEqual({
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
    expect(updated.reviewedBy).toBe(actor.id);
  });

  test("notifies every other partner on engage, never the actor or a founder", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { createVentureFromApplication } = await import("./promote");
    const db = getTestDb();
    await truncateVentureBirthGraph(db);

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
      .returning({ id: users.id, role: users.role, email: users.email });
    const actor = inserted.find((u) => u.email === "a@aponvlab.io")!;
    const otherPartners = inserted.filter(
      (u) => u.role === "partner" && u.id !== actor.id,
    );

    const [application] = await db
      .insert(applications)
      .values({
        companyName: "ImmiClaw",
        founderName: "Tunde Adeyemi",
        founderEmail: "tunde@example.com",
      })
      .returning();

    const venture = await createVentureFromApplication(application.id, {
      actorId: actor.id,
      executor: db,
    });

    const [event] = await db
      .select()
      .from(activity)
      .where(eq(activity.verb, "engaged"));
    expect(event.ventureId).toBe(venture.id);
    expect(event.actorId).toBe(actor.id);

    const notes = await db
      .select()
      .from(notifications)
      .where(eq(notifications.activityId, event.id));
    expect(notes.map((n) => n.userId).sort()).toEqual(
      otherPartners.map((p) => p.id).sort(),
    );
  });
});
