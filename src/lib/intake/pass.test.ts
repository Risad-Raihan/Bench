import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import { activity, applications, notifications, users } from "@/db/schema";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDb)("passApplication", () => {
  test("marks the row passed, leaves it in the table, and notifies every other partner", async () => {
    const { getTestDb, truncateVentureBirthGraph } = await import("@/test/db");
    const { passApplication } = await import("./pass");
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
        problem: "Agents drown in paperwork",
      })
      .returning();

    await passApplication(application.id, {
      actorId: actor.id,
      executor: db,
    });

    const [row] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, application.id));
    expect(row.status).toBe("passed");
    expect(row.ventureId).toBeNull();
    expect(row.reviewedBy).toBe(actor.id);
    expect(row.reviewedAt).toBeInstanceOf(Date);

    const [event] = await db.select().from(activity);
    expect(event.verb).toBe("passed");
    expect(event.actorId).toBe(actor.id);
    expect(event.payload).toEqual({
      applicationId: application.id,
      companyName: "ImmiClaw",
    });

    const notes = await db
      .select()
      .from(notifications)
      .where(eq(notifications.activityId, event.id));
    expect(notes.map((n) => n.userId).sort()).toEqual(
      otherPartners.map((p) => p.id).sort(),
    );
  });
});
