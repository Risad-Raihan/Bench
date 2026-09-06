import type { PartnerNoteIndexItem } from "@/lib/data/notes";
import { ventureColor } from "@/lib/venture-colors";

export type NoteSidebarItem = {
  id: string;
  label: string;
  color: string;
  depth: number;
};

export type NoteIndexGroups = {
  pinned: NoteSidebarItem[];
  byVenture: NoteSidebarItem[];
  unfiled: NoteSidebarItem[];
};

function colorOf(note: PartnerNoteIndexItem): string {
  if (note.ventureId == null) return "var(--ash)";
  return ventureColor(note.ventureColor);
}

function item(note: PartnerNoteIndexItem, depth: number): NoteSidebarItem {
  return {
    id: note.id,
    label: note.title || "Untitled",
    color: colorOf(note),
    depth,
  };
}

/**
 * `/notes` sidebar: Pinned / By venture / Unfiled.
 * By venture shows top-level owned notes (`parent_note_id IS NULL`) with
 * nested children inline. Unfiled is `venture_id IS NULL`.
 */
export function groupNotesIndex(
  notes: PartnerNoteIndexItem[],
): NoteIndexGroups {
  const byParent = new Map<string, PartnerNoteIndexItem[]>();
  for (const note of notes) {
    if (!note.parentNoteId) continue;
    const siblings = byParent.get(note.parentNoteId) ?? [];
    siblings.push(note);
    byParent.set(note.parentNoteId, siblings);
  }

  function withChildren(
    note: PartnerNoteIndexItem,
    depth: number,
  ): NoteSidebarItem[] {
    const kids = byParent.get(note.id) ?? [];
    return [item(note, depth), ...kids.flatMap((k) => withChildren(k, depth + 1))];
  }

  const pinned = notes.filter((n) => n.isFavorite).map((n) => item(n, 0));
  const byVenture = notes
    .filter((n) => n.ventureId != null && n.parentNoteId == null)
    .flatMap((n) => withChildren(n, 0));
  const unfiled = notes
    .filter((n) => n.ventureId == null && n.parentNoteId == null)
    .flatMap((n) => withChildren(n, 0));

  return { pinned, byVenture, unfiled };
}

export type VentureNoteListItem = {
  id: string;
  title: string;
};

/**
 * Venture Notes tab: owned notes vs notes that `@`-mention this venture.
 * A note owned by the venture never appears under Mentioned, even if it
 * also mentions itself.
 */
export function groupVentureNotes(args: {
  owned: VentureNoteListItem[];
  mentioned: VentureNoteListItem[];
}): { owned: VentureNoteListItem[]; mentioned: VentureNoteListItem[] } {
  const ownedIds = new Set(args.owned.map((n) => n.id));
  return {
    owned: args.owned,
    mentioned: args.mentioned.filter((n) => !ownedIds.has(n.id)),
  };
}

