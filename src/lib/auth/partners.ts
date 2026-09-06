/**
 * The four partners. Hardcoded — hd=aponvlab.io is spoofable, so the sign-in
 * callback checks this list as well (ADR-0001).
 */
export const PARTNERS = [
  { email: "risad@aponvlab.io", name: "Risad Mahmud", initials: "RM" },
  { email: "rashedun@aponvlab.io", name: "Rashedun Nabi", initials: "RN" },
  { email: "saif@aponvlab.io", name: "Saif Rashid", initials: "SR" },
  { email: "mufassal@aponvlab.io", name: "Mufassal Saif", initials: "MS" },
] as const;

export const PARTNER_HD = "aponvlab.io";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowlistedPartner(email: string): boolean {
  const normalized = normalizeEmail(email);
  return PARTNERS.some((p) => p.email === normalized);
}

/** Both gates from ADR-0001: Workspace `hd` and the hardcoded allowlist. */
export function isPartnerGoogleSignIn(input: {
  email: string | null | undefined;
  emailVerified: boolean | undefined;
  hd: string | undefined;
}): boolean {
  if (!input.email || !input.emailVerified) return false;
  if (input.hd !== PARTNER_HD) return false;
  return isAllowlistedPartner(input.email);
}
