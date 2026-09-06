/**
 * Magic-link eligibility and email copy (ADR-0001).
 *
 * No open sign-up: a `users` row + `venture_members` link must already exist,
 * created by a partner. `sendVerificationRequest` picks welcome vs plain
 * copy from `last_sign_in_at`.
 */
export type MagicLinkAudience = {
  disabledAt: Date | null;
  hasMembership: boolean;
  ventureName: string | null;
  lastSignInAt: Date | null;
};

export function canAcceptMagicLink(
  audience: MagicLinkAudience | null,
): boolean {
  if (!audience) return false;
  if (audience.disabledAt) return false;
  return audience.hasMembership;
}

export function magicLinkEmail(input: {
  lastSignInAt: Date | null;
  ventureName: string | null;
  url: string;
}): { subject: string; html: string; text: string } {
  const welcome = input.lastSignInAt == null;
  const venture = input.ventureName?.trim() || "your venture";
  if (welcome) {
    const text = `Welcome to Bench. ${venture} is set up.\n\nSign in: ${input.url}`;
    return {
      subject: "Welcome to Bench",
      text,
      html: `<p>Welcome to Bench. ${escapeHtml(venture)} is set up.</p><p><a href="${escapeHtml(input.url)}">Sign in</a></p>`,
    };
  }
  const text = `Sign in to Bench: ${input.url}`;
  return {
    subject: "Sign in to Bench",
    text,
    html: `<p><a href="${escapeHtml(input.url)}">Sign in to Bench</a></p>`,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
