export type AccessStatus = "invited" | "active" | "disabled";

/**
 * Derived founder/partner access label (ADR-0001).
 * Disabled wins even if they have signed in before.
 */
export function deriveAccessStatus(user: {
  lastSignInAt: Date | null;
  disabledAt: Date | null;
}): AccessStatus {
  if (user.disabledAt) return "disabled";
  if (user.lastSignInAt) return "active";
  return "invited";
}
