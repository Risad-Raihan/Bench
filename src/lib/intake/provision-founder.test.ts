import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import {
  users,
  ventureMembers,
  ventures,
} from "@/db/schema";
import { deriveAccessStatus } from "@/lib/auth/status";

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

describe.skipIf(!hasTestDb)("provisionFounderAccess", () => {
  test("creates the founder user + membership and sends the first magic link", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { provisionFounderAccess } = await import("./provision-founder");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [actor] = await db
      .insert(users)
      .values({
        email: "saif@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });

    const sent: string[] = [];
    const result = await provisionFounderAccess(
      venture.id,
      { name: "Tunde Adeyemi", email: "Tunde@Example.com" },
      actor.id,
      { executor: db, sendMagicLink: async (email) => { sent.push(email); } },
    );

    expect(result.user.email).toBe("tunde@example.com");
    expect(result.user.name).toBe("Tunde Adeyemi");
    expect(result.user.role).toBe("founder");
    expect(result.user.initials).toBe("TA");
    expect(result.membership.ventureId).toBe(venture.id);
    expect(result.membership.userId).toBe(result.user.id);
    expect(result.membership.role).toBe("founder");
    expect(sent).toEqual(["tunde@example.com"]);
  });

  test("provisions a collaborator with the same access scope, different membership role", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { provisionFounderAccess } = await import("./provision-founder");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });

    const result = await provisionFounderAccess(
      venture.id,
      { name: "Ada Okonkwo", email: "ada@example.com" },
      null,
      {
        executor: db,
        memberRole: "collaborator",
        sendMagicLink: async () => {},
      },
    );

    expect(result.user.role).toBe("founder");
    expect(result.membership.role).toBe("collaborator");
  });

  test("refuses to provision a partner email", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { provisionFounderAccess } = await import("./provision-founder");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [partner] = await db
      .insert(users)
      .values({
        email: "risad@aponvlab.io",
        name: "Risad Mahmud",
        initials: "RM",
        role: "partner",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });

    await expect(
      provisionFounderAccess(
        venture.id,
        { name: "Risad Mahmud", email: "risad@aponvlab.io" },
        partner.id,
        { executor: db, sendMagicLink: async () => {} },
      ),
    ).rejects.toThrow(/partner/i);
  });

  test("re-inviting an existing member on the same venture resends the link", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { provisionFounderAccess } = await import("./provision-founder");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });

    const sent: string[] = [];
    const sendMagicLink = async (email: string) => {
      sent.push(email);
    };

    const first = await provisionFounderAccess(
      venture.id,
      { name: "Tunde Adeyemi", email: "tunde@example.com" },
      null,
      { executor: db, sendMagicLink },
    );
    const second = await provisionFounderAccess(
      venture.id,
      { name: "Tunde Adeyemi", email: "tunde@example.com" },
      null,
      { executor: db, sendMagicLink },
    );

    expect(second.user.id).toBe(first.user.id);
    expect(sent).toEqual(["tunde@example.com", "tunde@example.com"]);
    const rows = await db
      .select()
      .from(ventureMembers)
      .where(eq(ventureMembers.userId, first.user.id));
    expect(rows).toHaveLength(1);
  });

  test("lists members with derived status and last sign-in", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { listVentureAccess } = await import("@/lib/data/members");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const signedInAt = new Date("2026-09-01T12:00:00.000Z");
    const [partner] = await db
      .insert(users)
      .values({
        email: "saif@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const inserted = await db
      .insert(users)
      .values([
        {
          email: "tunde@example.com",
          name: "Tunde Adeyemi",
          initials: "TA",
          role: "founder",
        },
        {
          email: "ada@example.com",
          name: "Ada Okonkwo",
          initials: "AO",
          role: "founder",
          lastSignInAt: signedInAt,
        },
        {
          email: "old@example.com",
          name: "Old Founder",
          initials: "OF",
          role: "founder",
          lastSignInAt: signedInAt,
          disabledAt: signedInAt,
        },
      ])
      .returning({ id: users.id, email: users.email });
    const tunde = inserted.find((u) => u.email === "tunde@example.com")!;
    const ada = inserted.find((u) => u.email === "ada@example.com")!;
    const old = inserted.find((u) => u.email === "old@example.com")!;

    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });
    await db.insert(ventureMembers).values([
      { ventureId: venture.id, userId: tunde.id, role: "founder" },
      { ventureId: venture.id, userId: ada.id, role: "collaborator" },
      { ventureId: venture.id, userId: old.id, role: "founder" },
    ]);

    const rows = await listVentureAccess(
      { id: partner.id, role: "partner", ventureIds: [] },
      venture.id,
      db,
    );
    expect(rows).toHaveLength(3);
    const byEmail = Object.fromEntries(rows.map((r) => [r.email, r]));
    expect(byEmail["tunde@example.com"]).toMatchObject({
      name: "Tunde Adeyemi",
      memberRole: "founder",
      status: "invited",
      lastSignInAt: null,
    });
    expect(byEmail["ada@example.com"]).toMatchObject({
      memberRole: "collaborator",
      status: "active",
      lastSignInAt: signedInAt,
    });
    expect(byEmail["old@example.com"]?.status).toBe("disabled");
    expect(deriveAccessStatus(byEmail["tunde@example.com"]!)).toBe("invited");
  });

  test("disable sets disabled_at and leaves the membership row", async () => {
    const { getTestDb, truncateFounderAccessGraph } = await import("@/test/db");
    const { disableVentureMember } = await import("@/lib/data/members");
    const db = getTestDb();
    await truncateFounderAccessGraph(db);

    const [partner] = await db
      .insert(users)
      .values({
        email: "saif@aponvlab.io",
        name: "Saif Rashid",
        initials: "SR",
        role: "partner",
      })
      .returning({ id: users.id });
    const [founder] = await db
      .insert(users)
      .values({
        email: "tunde@example.com",
        name: "Tunde Adeyemi",
        initials: "TA",
        role: "founder",
      })
      .returning({ id: users.id });
    const [venture] = await db
      .insert(ventures)
      .values({ slug: "immiclaw", name: "ImmiClaw" })
      .returning({ id: ventures.id });
    await db.insert(ventureMembers).values({
      ventureId: venture.id,
      userId: founder.id,
      role: "founder",
    });

    const updated = await disableVentureMember(
      { id: partner.id, role: "partner", ventureIds: [] },
      { ventureId: venture.id, userId: founder.id },
      db,
    );
    expect(updated?.disabledAt).toBeInstanceOf(Date);

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, founder.id));
    expect(row.disabledAt).toBeInstanceOf(Date);
    const memberships = await db
      .select()
      .from(ventureMembers)
      .where(eq(ventureMembers.userId, founder.id));
    expect(memberships).toHaveLength(1);
  });
});
