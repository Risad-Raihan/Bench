/**
 * Partner-facing venture membership (Access section). Founders never see
 * this; pages go through here so they do not import the DB client.
 */
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, ventureMembers, type ventureMemberRole } from "@/db/schema";
import {
  deriveAccessStatus,
  type AccessStatus,
} from "@/lib/auth/status";
import { isInternalUser, type CurrentUser } from "@/lib/auth/resolve";

export type Executor = typeof db;

type MemberRole = (typeof ventureMemberRole.enumValues)[number];

export type VentureAccessRow = {
  userId: string;
  name: string;
  email: string;
  initials: string;
  memberRole: MemberRole;
  lastSignInAt: Date | null;
  disabledAt: Date | null;
  status: AccessStatus;
};

export async function listVentureAccess(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<VentureAccessRow[]> {
  if (!isInternalUser(user)) return [];

  const rows = await executor
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      initials: users.initials,
      memberRole: ventureMembers.role,
      lastSignInAt: users.lastSignInAt,
      disabledAt: users.disabledAt,
    })
    .from(ventureMembers)
    .innerJoin(users, eq(users.id, ventureMembers.userId))
    .where(eq(ventureMembers.ventureId, ventureId))
    .orderBy(asc(ventureMembers.createdAt));

  return rows.map((row) => ({
    ...row,
    status: deriveAccessStatus(row),
  }));
}

export async function disableVentureMember(
  user: CurrentUser,
  input: { ventureId: string; userId: string },
  executor: Executor = db,
): Promise<{ id: string; disabledAt: Date | null } | null> {
  if (!isInternalUser(user)) return null;

  const [membership] = await executor
    .select({ userId: ventureMembers.userId })
    .from(ventureMembers)
    .where(
      and(
        eq(ventureMembers.ventureId, input.ventureId),
        eq(ventureMembers.userId, input.userId),
      ),
    )
    .limit(1);
  if (!membership) return null;

  const [row] = await executor
    .update(users)
    .set({ disabledAt: new Date() })
    .where(eq(users.id, input.userId))
    .returning({ id: users.id, disabledAt: users.disabledAt });

  return row ?? null;
}
