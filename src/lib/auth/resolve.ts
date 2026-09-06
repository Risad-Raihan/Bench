import { type userRole } from "@/db/schema";

export type UserRole = (typeof userRole.enumValues)[number];

export type CurrentUser = {
  id: string;
  role: UserRole;
  ventureIds: string[];
};

export type InternalUser = CurrentUser & {
  role: Exclude<UserRole, "founder">;
};

export type AuthSession = {
  userId: string;
  role: UserRole;
};

export type MembershipRow = {
  ventureId: string;
};

export const INTERNAL_ROLES = new Set<UserRole>(["partner", "admin", "viewer"]);

export function isInternalUser(user: CurrentUser): user is InternalUser {
  return INTERNAL_ROLES.has(user.role);
}

/**
 * Pure. Partners bypass venture scoping (`ventureIds` is empty — callers treat
 * that as "all"). Founders get the venture ids from `venture_members`.
 */
export function resolveCurrentUser(
  session: AuthSession,
  memberships: MembershipRow[],
): CurrentUser {
  return {
    id: session.userId,
    role: session.role,
    ventureIds: INTERNAL_ROLES.has(session.role)
      ? []
      : memberships.map((m) => m.ventureId),
  };
}
