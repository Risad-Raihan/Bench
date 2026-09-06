/**
 * Founder venture-scope checks (ADR-0006). Reads may use the per-request
 * `ventureIds` snapshot; every founder mutation re-checks `venture_members`.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { ventureMembers } from "@/db/schema";
import { isInternalUser, type CurrentUser } from "@/lib/auth/resolve";

export type Executor = typeof db;

export function canSeeVenture(
  user: CurrentUser,
  ventureId: string | null | undefined,
): boolean {
  if (isInternalUser(user)) return true;
  return Boolean(ventureId && user.ventureIds.includes(ventureId));
}

export async function hasLiveMembership(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<boolean> {
  if (isInternalUser(user)) return true;
  const [row] = await executor
    .select({ userId: ventureMembers.userId })
    .from(ventureMembers)
    .where(
      and(
        eq(ventureMembers.userId, user.id),
        eq(ventureMembers.ventureId, ventureId),
      ),
    )
    .limit(1);
  return row != null;
}
