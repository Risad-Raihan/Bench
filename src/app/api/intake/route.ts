/**
 * POST /api/intake — the single endpoint the marketing site (apon-venture-lab,
 * aponvlab.io) calls when someone submits the Apply form. It:
 *   1. authenticates with a shared secret (x-intake-key header)
 *   2. parses the multipart body (text fields + one "deck" file)
 *   3. uploads the deck to Vercel Blob
 *   4. writes one `applications` row
 *
 * It does not create a venture. Partners Engage from the Application column
 * (see lib/intake/promote.ts). The marketing site must NEVER touch Bench's
 * database directly — this is the only door in.
 */
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { applications } from "@/db/schema";

export const runtime = "nodejs";
// 15 MB deck upload + the applications insert.
export const maxDuration = 120;

const MAX_FIELD_LEN = 5000;
const MAX_DECK_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_DECK_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-powerpoint", // .ppt
]);
const ALLOWED_DECK_EXT = /\.(pdf|pptx|ppt)$/i;

// Text field names accepted from the site's forwarder. Do not rename — these
// match what the site sends. `currentRole` maps to column `applicant_role`.
const TEXT_FIELDS = [
  "companyName", "founderName", "founderEmail", "linkedin", "location",
  "currentRole", "domain", "domainExperience", "domainInsight", "problem",
  "customer", "currentSolution", "evidence", "customerIntros", "marketSize",
  "competition", "whyNow", "whyAi", "commitment", "priorProgress",
  "studioNeed", "notes", "source",
] as const;

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}

function keyOk(provided: string | null): boolean {
  const expected = process.env.INTAKE_API_KEY;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function clean(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_FIELD_LEN);
}

export async function POST(req: Request) {
  if (!keyOk(req.headers.get("x-intake-key"))) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "expected multipart/form-data" }, 422);
  }

  const fields: Record<string, string | null> = {};
  for (const name of TEXT_FIELDS) fields[name] = clean(form.get(name));

  if (!fields.companyName || !fields.founderName || !fields.founderEmail) {
    return json(
      { ok: false, error: "companyName, founderName and founderEmail are required" },
      422,
    );
  }

  // Deck: optional at the storage layer, but if present it must be a valid type
  // and within the size limit.
  const deck = form.get("deck");
  let deckUpload:
    | { storageKey: string; name: string; mimeType: string; sizeBytes: number }
    | null = null;

  if (deck && typeof deck !== "string" && deck.size > 0) {
    const file = deck as File;
    const typeOk =
      ALLOWED_DECK_TYPES.has(file.type) || ALLOWED_DECK_EXT.test(file.name);
    if (!typeOk) {
      return json(
        { ok: false, error: "deck must be a PDF, PPTX or PPT file" },
        422,
      );
    }
    if (file.size > MAX_DECK_BYTES) {
      return json({ ok: false, error: "deck must be 15 MB or smaller" }, 422);
    }
    try {
      const safeName =
        file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "deck";
      const key = `applications/${crypto.randomUUID()}/${safeName}`;
      // access: "public" is fine for now; a signed-URL scheme is the eventual
      // right answer for founder-uploaded decks.
      const blob = await put(key, file, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });
      deckUpload = {
        storageKey: blob.url,
        name: file.name.slice(0, 200),
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      };
    } catch (err) {
      // Store the application anyway — a failed upload is not a lost applicant.
      console.error("[intake] deck upload failed", err);
    }
  }

  const rawPayload: Record<string, unknown> = {};
  for (const name of TEXT_FIELDS) {
    if (fields[name] != null) rawPayload[name] = fields[name];
  }

  let application;
  try {
    [application] = await db
      .insert(applications)
      .values({
        status: "new",
        companyName: fields.companyName,
        founderName: fields.founderName,
        founderEmail: fields.founderEmail,
        linkedin: fields.linkedin,
        location: fields.location,
        applicantRole: fields.currentRole,
        domain: fields.domain,
        domainExperience: fields.domainExperience,
        domainInsight: fields.domainInsight,
        problem: fields.problem,
        customer: fields.customer,
        currentSolution: fields.currentSolution,
        evidence: fields.evidence,
        customerIntros: fields.customerIntros,
        marketSize: fields.marketSize,
        competition: fields.competition,
        whyNow: fields.whyNow,
        whyAi: fields.whyAi,
        commitment: fields.commitment,
        priorProgress: fields.priorProgress,
        studioNeed: fields.studioNeed,
        notes: fields.notes,
        source: fields.source,
        rawPayload,
        deckStorageKey: deckUpload?.storageKey ?? null,
        deckName: deckUpload?.name ?? null,
        deckMimeType: deckUpload?.mimeType ?? null,
        deckSizeBytes: deckUpload?.sizeBytes ?? null,
      })
      .returning();
  } catch (err) {
    // Only a failed applications insert is a real 500 — the submission is lost.
    console.error("[intake] failed to record application", err);
    return json({ ok: false, error: "internal error" }, 500);
  }

  return json({ ok: true, applicationId: application.id }, 200);
}
