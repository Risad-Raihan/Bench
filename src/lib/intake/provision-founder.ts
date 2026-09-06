/**
 * Provision a founder or collaborator login scoped to a single venture.
 *
 * Creates the `users` row + `venture_members` link, then sends the first
 * magic link through the same Auth.js/Resend path as the sign-in form
 * (ADR-0001). No open sign-up — this is the only way an external user
 * comes into existence.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, ventureMembers, type ventureMemberRole } from "@/db/schema";
import { INTERNAL_ROLES } from "@/lib/auth/resolve";
import { isAllowlistedPartner, normalizeEmail } from "@/lib/auth/partners";
import { initialsFromName } from "./initials";

type Executor = typeof db;
type MemberRole = (typeof ventureMemberRole.enumValues)[number];

export type ProvisionFounderOpts = {
  executor?: Executor;
  memberRole?: MemberRole;
  sendMagicLink?: (email: string) => Promise<void>;
};

async function defaultSendMagicLink(email: string): Promise<void> {
  const { requestMagicLink } = await import("@/lib/auth/send-magic-link");
  await requestMagicLink(email);
}

export async function provisionFounderAccess(
  ventureId: string,
  founder: { name: string; email: string },
  actorId: string | null,
  opts: ProvisionFounderOpts = {},
) {
  const executor = opts.executor ?? db;
  const memberRole = opts.memberRole ?? "founder";
  const sendMagicLink = opts.sendMagicLink ?? defaultSendMagicLink;
  const email = normalizeEmail(founder.email);
  const name = founder.name.trim();

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }
  if (isAllowlistedPartner(email)) {
    throw new Error("That email is a partner account.");
  }

  const [existing] = await executor
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing && INTERNAL_ROLES.has(existing.role)) {
    throw new Error("That email is a partner account.");
  }

  const [user] = await executor
    .insert(users)
    .values({
      email,
      name,
      initials: initialsFromName(name),
      role: "founder",
    })
    .onConflictDoUpdate({
      target: users.email,
      // Do not downgrade an existing internal user to "founder"; only refresh
      // display fields. Role stays founder for external members.
      set: { name, initials: initialsFromName(name) },
    })
    .returning();

  void actorId;

  const insertedMembership = await executor
    .insert(ventureMembers)
    .values({ ventureId, userId: user.id, role: memberRole })
    .onConflictDoNothing()
    .returning();

  const membership =
    insertedMembership[0] ??
    (
      await executor
        .select()
        .from(ventureMembers)
        .where(
          and(
            eq(ventureMembers.ventureId, ventureId),
            eq(ventureMembers.userId, user.id),
          ),
        )
        .limit(1)
    )[0];

  if (!membership) {
    throw new Error("Could not create membership.");
  }

  try {
    await sendMagicLink(email);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "email send failed";
    throw new Error(
      `Access was created but the invite email failed (${detail}). Use Resend link.`,
    );
  }

  return { user, membership };
}
