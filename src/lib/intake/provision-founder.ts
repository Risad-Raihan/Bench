/**
 * Provision a founder login scoped to a single venture.
 *
 * Callable but NOT yet wired to any UI — a partner-facing "invite founder"
 * button is a separate piece of work. It also does NOT set up founder-scoped
 * query filtering across the app; see docs/founder-access.md for what still
 * needs doing before a founder account is safe to hand out.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, ventureMembers } from "@/db/schema";
import { initialsFromName } from "./initials";

type Executor = typeof db;

export async function provisionFounderAccess(
  ventureId: string,
  founder: { name: string; email: string },
  actorId: string | null,
  executor: Executor = db,
) {
  const email = founder.email.trim().toLowerCase();
  const name = founder.name.trim();

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
      // display fields.
      set: { name },
    })
    .returning();

  await executor
    .insert(ventureMembers)
    .values({ ventureId, userId: user.id, role: "founder" })
    .onConflictDoNothing();

  // TODO: send invite email (set-password link). Email wiring is out of scope.
  void actorId;

  const [membership] = await executor
    .select()
    .from(ventureMembers)
    .where(
      and(
        eq(ventureMembers.ventureId, ventureId),
        eq(ventureMembers.userId, user.id),
      ),
    )
    .limit(1);

  return { user, membership };
}
