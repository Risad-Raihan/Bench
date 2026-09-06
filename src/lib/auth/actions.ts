"use server";

import { redirect } from "next/navigation";
import { requestMagicLink } from "@/lib/auth/send-magic-link";

/** Public sign-in form. Always lands on the check-your-email state. */
export async function requestSignInLinkAction(
  formData: FormData,
): Promise<void> {
  const email = String(formData.get("email") ?? "");
  try {
    await requestMagicLink(email);
  } catch (err) {
    console.error("[magic-link] send failed", err);
  }
  redirect("/signin?check=1");
}
