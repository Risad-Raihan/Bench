import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getCurrentUser, isInternalUser } from "@/lib/auth/current-user";
import {
  authorizeDocUpload,
  parseUploadPayload,
  recordUploadedBlob,
} from "@/lib/data/docs";
import { head } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.ms-excel",
  "text/plain",
  "text/csv",
];

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user || !isInternalUser(user)) {
          throw new Error("Only a partner can upload a doc.");
        }
        let requested: {
          ventureId?: string;
          folder?: string | null;
          visibility?: string | null;
          supersedesId?: string | null;
          name?: string;
        } = {};
        try {
          requested = clientPayload
            ? (JSON.parse(clientPayload) as typeof requested)
            : {};
        } catch {
          throw new Error("Invalid upload payload.");
        }
        const authorized = await authorizeDocUpload(user, {
          ventureId: requested.ventureId ?? "",
          folder: requested.folder,
          visibility: requested.visibility,
          supersedesId: requested.supersedesId,
          name: requested.name ?? "Untitled",
        });
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            ventureId: authorized.ventureId,
            folder: authorized.folder ?? null,
            visibility: authorized.visibility ?? "studio",
            uploaderId: authorized.uploaderId,
            supersedesId: authorized.supersedesId ?? null,
            name: authorized.name,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parseUploadPayload(tokenPayload);
        let sizeBytes = 0;
        try {
          const info = await head(blob.url);
          sizeBytes = info.size;
        } catch (err) {
          console.error("[docs/upload] blob head failed", err);
        }
        await recordUploadedBlob(
          payload,
          { url: blob.url, contentType: blob.contentType },
          sizeBytes,
        );
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    console.error("[docs/upload] failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload rejected." },
      { status: 400 },
    );
  }
}
