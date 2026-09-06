import { notFound, redirect } from "next/navigation";
import {
  founderHomePath,
  isInternalUser,
  requireUser,
} from "@/lib/auth/current-user";
import { getNoteById, listAllNotes } from "@/lib/data/notes";
import { listVentures } from "@/lib/data/ventures";
import { NotesView } from "@/components/NotesView";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const user = await requireUser();
  const { n } = await searchParams;

  if (!isInternalUser(user)) {
    if (!n) redirect(await founderHomePath(user));
    const active = await getNoteById(user, n);
    if (!active || !("content" in active)) notFound();
    return (
      <NotesView
        canCreate={false}
        ventures={
          active.ventureId
            ? [
                {
                  id: active.ventureId,
                  name: active.ventureName ?? "",
                  color: active.ventureColor,
                },
              ]
            : []
        }
        notes={[
          {
            id: active.id,
            title: active.title,
            ventureId: active.ventureId,
            ventureName: active.ventureName,
            ventureColor: active.ventureColor,
            isFavorite: active.isFavorite,
            parentNoteId: active.parentNoteId,
            updatedAt: active.updatedAt.toISOString(),
          },
        ]}
        active={{
          id: active.id,
          title: active.title,
          content: active.content,
          ventureId: active.ventureId,
          ventureSlug: active.ventureSlug,
          ventureName: active.ventureName,
          ventureColor: active.ventureColor,
          lastEditedByName: active.lastEditedByName,
          updatedAt: active.updatedAt.toISOString(),
          versionCount: active.versionCount,
        }}
      />
    );
  }

  const notes = await listAllNotes(user);
  const ventures = await listVentures(user);
  const selectedId = n ?? notes[0]?.id ?? null;
  const active =
    selectedId == null ? null : await getNoteById(user, selectedId);

  return (
    <NotesView
      ventures={ventures.map((v) => ({
        id: v.id,
        name: v.name,
        color: v.color,
      }))}
      notes={notes.map((note) => ({
        id: note.id,
        title: note.title,
        ventureId: note.ventureId,
        ventureName: note.ventureName,
        ventureColor: note.ventureColor,
        isFavorite: note.isFavorite,
        parentNoteId: note.parentNoteId,
        updatedAt: note.updatedAt.toISOString(),
      }))}
      active={
        active && "content" in active
          ? {
              id: active.id,
              title: active.title,
              content: active.content,
              ventureId: active.ventureId,
              ventureSlug: active.ventureSlug,
              ventureName: active.ventureName,
              ventureColor: active.ventureColor,
              lastEditedByName: active.lastEditedByName,
              updatedAt: active.updatedAt.toISOString(),
              versionCount: active.versionCount,
            }
          : null
      }
    />
  );
}
