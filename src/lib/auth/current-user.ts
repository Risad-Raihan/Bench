import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, ventureMembers, ventures } from "@/db/schema";
import {
  isInternalUser,
  resolveCurrentUser,
  type CurrentUser,
  type InternalUser,
} from "./resolve";

export type {
  CurrentUser,
  InternalUser,
  UserRole,
  AuthSession,
  MembershipRow,
} from "./resolve";
export { resolveCurrentUser, INTERNAL_ROLES, isInternalUser } from "./resolve";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.userId) return null;

  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      disabledAt: users.disabledAt,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user || user.disabledAt) return null;

  const memberships = await db
    .select({ ventureId: ventureMembers.ventureId })
    .from(ventureMembers)
    .where(eq(ventureMembers.userId, user.id));

  return resolveCurrentUser({ userId: user.id, role: user.role }, memberships);
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}

export async function requirePartner(): Promise<InternalUser> {
  const user = await requireUser();
  if (!isInternalUser(user)) {
    redirect(await founderHomePath(user));
  }
  return user;
}

export async function founderHomePath(user: CurrentUser): Promise<string> {
  const ventureId = user.ventureIds[0];
  if (!ventureId) return "/signin";
  const [venture] = await db
    .select({ slug: ventures.slug })
    .from(ventures)
    .where(eq(ventures.id, ventureId))
    .limit(1);
  return venture ? `/v/${venture.slug}` : "/signin";
}
