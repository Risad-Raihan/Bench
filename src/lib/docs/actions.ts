"use server";

import { revalidatePath } from "next/cache";
import { requirePartner, requireUser } from "@/lib/auth/current-user";
import {
  archiveDoc,
  authorizeDocUpload,
  recordUploadedBlob,
} from "@/lib/data/docs";

export type DocActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function fail(err: unknown, label: string): DocActionResult {
  console.error(`[${label}] failed`, err);
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Could not update the doc.",
  };
}

export async function archiveDocAction(input: {
  docId: string;
  slug: string;
}): Promise<DocActionResult> {
  const user = await requirePartner();
  try {
    const row = await archiveDoc(user, input.docId);
    if (!row) return { ok: false, error: "Doc not found." };
    revalidatePath(`/v/${input.slug}`);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "archiveDoc");
  }
}

/**
 * Localhost fallback: `onUploadCompleted` does not fire when Vercel cannot
 * reach the dev machine. Re-checks the session and authorizes the same
 * fields the token-mint path trusted, then writes the row. Idempotent on
 * blob URL so a tunneled callback plus this fallback cannot double-insert.
 */
export async function completeDocUploadAction(input: {
  url: string;
  contentType?: string;
  sizeBytes?: number;
  ventureId: string;
  folder?: string | null;
  visibility?: string | null;
  supersedesId?: string | null;
  name: string;
  slug: string;
}): Promise<DocActionResult> {
  const user = await requireUser();
  try {
    const authorized = await authorizeDocUpload(user, {
      ventureId: input.ventureId,
      folder: input.folder,
      visibility: input.visibility,
      supersedesId: input.supersedesId,
      name: input.name,
    });
    const row = await recordUploadedBlob(
      {
        ventureId: authorized.ventureId,
        folder: authorized.folder ?? null,
        visibility: authorized.visibility ?? "studio",
        uploaderId: authorized.uploaderId,
        supersedesId: authorized.supersedesId ?? null,
        name: authorized.name,
      },
      { url: input.url, contentType: input.contentType },
      input.sizeBytes ?? 0,
    );
    revalidatePath(`/v/${input.slug}`);
    return { ok: true, id: row.id };
  } catch (err) {
    return fail(err, "completeDocUpload");
  }
}
