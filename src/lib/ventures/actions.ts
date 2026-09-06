"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/current-user";
import { isInternalUser } from "@/lib/auth/resolve";
import { createManualApplication } from "@/lib/data/applications";

const MAX_DECK_BYTES = 15 * 1024 * 1024;
const ALLOWED_DECK_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
]);
const ALLOWED_DECK_EXT = /\.(pdf|pptx|ppt)$/i;

export type CreateVentureResult = { ok: true } | { ok: false; error: string };

function deckAllowed(file: File): boolean {
  return ALLOWED_DECK_TYPES.has(file.type) || ALLOWED_DECK_EXT.test(file.name);
}

/**
 * "+ New Venture" — a partner adding a lead by hand. Creates an `applications`
 * row that lands in the Application column; Engage (button or drag to Meet)
 * turns it into a venture (ADR-0002).
 */
export async function createVentureAction(
  formData: FormData,
): Promise<CreateVentureResult> {
  const user = await requireUser();
  if (!isInternalUser(user)) {
    return { ok: false, error: "Only a partner can add a venture." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "A name is required." };
  const oneLiner = String(formData.get("oneLiner") ?? "").trim() || null;
  const founderName = String(formData.get("founderName") ?? "").trim() || null;
  const founderEmail = String(formData.get("founderEmail") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;

  const deck = formData.get("deck");
  const file =
    deck && typeof deck !== "string" && deck.size > 0 ? (deck as File) : null;
  if (file && !deckAllowed(file)) {
    return { ok: false, error: "Deck must be a PDF or PPTX." };
  }
  if (file && file.size > MAX_DECK_BYTES) {
    return { ok: false, error: "Deck must be 15 MB or smaller." };
  }

  let deckInfo: Parameters<typeof createManualApplication>[1]["deck"] = null;
  if (file) {
    try {
      const safeName =
        file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "deck";
      const blob = await put(
        `applications/manual/${Date.now()}-${safeName}`,
        file,
        {
          access: "private",
          contentType: file.type || "application/octet-stream",
        },
      );
      deckInfo = {
        storageKey: blob.url,
        name: file.name.slice(0, 200),
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      };
    } catch (err) {
      console.error("[addApplication] deck upload failed", err);
    }
  }

  try {
    const row = await createManualApplication(user, {
      companyName: name,
      problem: oneLiner,
      founderName,
      founderEmail,
      color,
      deck: deckInfo,
    });
    if (!row) return { ok: false, error: "Could not add the venture." };
  } catch (err) {
    console.error("[addApplication] insert failed", err);
    return { ok: false, error: "Could not add the venture." };
  }

  revalidatePath("/");
  return { ok: true };
}
