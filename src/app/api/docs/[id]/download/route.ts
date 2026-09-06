import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getDocForDownload } from "@/lib/data/docs";
import { signedDownloadUrl } from "@/lib/docs/signed-url";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const doc = await getDocForDownload(user, id);
  if (!doc) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const download = new URL(request.url).searchParams.get("dl") === "1";
  try {
    const url = await signedDownloadUrl(doc.storageKey, { download });
    return NextResponse.redirect(url, 302);
  } catch (err) {
    console.error("[docs/download] failed", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
