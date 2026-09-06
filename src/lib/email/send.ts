/**
 * Thin Resend wrapper. Auth.js `sendVerificationRequest` and any later
 * transactional mail (intake notify) go through here so the from-address
 * and API key live in one place.
 *
 * Setup: verified sending domain `mail.aponvlab.io` + `AUTH_RESEND_KEY`.
 * See docs/founder-access.md.
 */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.AUTH_RESEND_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Bench <noreply@mail.aponvlab.io>";
  if (!apiKey) {
    throw new Error("Email is not configured.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    throw new Error("Resend error: " + JSON.stringify(await res.json()));
  }
}
