import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { saveNote } from "@/lib/data/notes";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { content?: unknown; title?: string } = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.content == null) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const row = await saveNote(user, {
      noteId: id,
      content: body.content,
      title: body.title,
      reason: "flush",
    });
    if (!row) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (err) {
    console.error("[notes/flush] failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
