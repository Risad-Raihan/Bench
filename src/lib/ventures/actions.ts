"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { insertDoc } from "@/lib/data/docs";
import { createVenture } from "@/lib/ventures/create";

const MAX_DECK_BYTES = 15 * 1024 * 1024;
const ALLOWED_DECK_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
]);
const ALLOWED_DECK_EXT = /\.(pdf|pptx|ppt)$/i;

export type CreateVentureResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

function deckAllowed(file: File): boolean {
  return ALLOWED_DECK_TYPES.has(file.type) || ALLOWED_DECK_EXT.test(file.name);
}

export async function createVentureAction(
  formData: FormData,
): Promise<CreateVentureResult> {
  const user = await requirePartner();

  const name = String(formData.get("name") ?? "").trim() || "Untitled venture";
  const oneLiner = String(formData.get("oneLiner") ?? "").trim() || null;
  const founderName = String(formData.get("founderName") ?? "").trim() || null;
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

  let venture;
  try {
    venture = await createVenture(
      { name, oneLiner, founderName, color },
      { actorId: user.id },
    );
  } catch (err) {
    console.error("[createVenture] insert failed", err);
    return { ok: false, error: "Could not create the venture." };
  }

  if (file) {
    try {
      const safeName =
        file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "deck";
      const key = `ventures/${venture.id}/${safeName}`;
      const blob = await put(key, file, {
        access: "private",
        contentType: file.type || "application/octet-stream",
      });
      await insertDoc({
        ventureId: venture.id,
        name: file.name.slice(0, 200),
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        storageKey: blob.url,
        folder: "Diligence",
        uploadedBy: user.id,
        visibility: "studio",
      });
    } catch (err) {
      console.error("[createVenture] deck upload failed", err);
    }
  }

  revalidatePath("/");
  revalidatePath(`/v/${venture.slug}`);
  return { ok: true, slug: venture.slug };
}
