import { requirePartner } from "@/lib/auth/current-user";
import { getNoteById, listAllNotes } from "@/lib/data/notes";
import { listVentures } from "@/lib/data/ventures";
import { NotesView } from "@/components/NotesView";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const user = await requirePartner();
  const { n } = await searchParams;
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
