/**
 * Auth.js magic-link send path. Looks up the provisioned audience, then
 * either asks Auth.js to mint a token (`requestMagicLink`) or delivers
 * the email Auth.js already minted (`sendVerificationRequest`).
 */
import { eq } from "drizzle-orm";
import type { EmailConfig } from "next-auth/providers/email";
import { db } from "@/db";
import { users, ventureMembers, ventures } from "@/db/schema";
import { sendEmail } from "@/lib/email/send";
import { normalizeEmail } from "./partners";
import {
  canAcceptMagicLink,
  magicLinkEmail,
  type MagicLinkAudience,
} from "./magic-link";

export async function getMagicLinkAudience(
  email: string,
): Promise<MagicLinkAudience | null> {
  const [user] = await db
    .select({
      id: users.id,
      disabledAt: users.disabledAt,
      lastSignInAt: users.lastSignInAt,
    })
    .from(users)
    .where(eq(users.email, normalizeEmail(email)))
    .limit(1);
  if (!user) return null;

  const [membership] = await db
    .select({ name: ventures.name })
    .from(ventureMembers)
    .innerJoin(ventures, eq(ventures.id, ventureMembers.ventureId))
    .where(eq(ventureMembers.userId, user.id))
    .limit(1);

  return {
    disabledAt: user.disabledAt,
    lastSignInAt: user.lastSignInAt,
    hasMembership: membership != null,
    ventureName: membership?.name ?? null,
  };
}

/**
 * Mint a verification token and send the email via the Resend provider.
 * Safe to call while a partner is signed in — the email type does not
 * swap the current session until the recipient clicks the link.
 */
export async function requestMagicLink(email: string): Promise<void> {
  const audience = await getMagicLinkAudience(email);
  if (!canAcceptMagicLink(audience)) return;
  const { signIn } = await import("@/auth");
  await signIn("resend", { email: normalizeEmail(email), redirect: false });
}

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url }) => {
    const audience = await getMagicLinkAudience(identifier);
    if (!audience || !canAcceptMagicLink(audience)) return;
    const mail = magicLinkEmail({
      lastSignInAt: audience.lastSignInAt,
      ventureName: audience.ventureName,
      url,
    });
    await sendEmail({
      to: normalizeEmail(identifier),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
  };
