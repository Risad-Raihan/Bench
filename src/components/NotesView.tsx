"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { EmptyState } from "../../design-system/components/layout/Panel.jsx";
import {
  MetaRail,
  NoteSidebar,
} from "../../design-system/components/notes/NoteEditor.jsx";
import { formatEditedAgo } from "@/lib/format";
import { createNoteAction } from "@/lib/notes/actions";
import { groupNotesIndex } from "@/lib/notes/groups";
import { ventureColor } from "@/lib/venture-colors";
import {
  NoteBodyEditor,
  type NoteBodyHandle,
} from "@/components/notes/NoteBodyEditor";

export type NotesViewItem = {
  id: string;
  title: string;
  ventureId: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  isFavorite: boolean;
  parentNoteId: string | null;
  updatedAt: string;
};

export type NotesViewActive = {
  id: string;
  title: string;
  content: unknown;
  ventureId: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  lastEditedByName: string | null;
  updatedAt: string;
  versionCount: number;
};

export function NotesView({
  notes,
  active,
}: {
  notes: NotesViewItem[];
  active: NotesViewActive | null;
}) {
  const router = useRouter();
  const editorRef = useRef<NoteBodyHandle>(null);
  // Optimistic title edits, keyed by note id — the sidebar label updates while
  // you type, before autosave revalidates `notes` from the server. Stale
  // entries just match reality once the real title comes back.
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>(
    {},
  );
  const localNotes = notes.map((n) =>
    titleOverrides[n.id] != null ? { ...n, title: titleOverrides[n.id] } : n,
  );

  const sidebarGroups = useMemo(() => {
    const grouped = groupNotesIndex(
      localNotes.map((n) => ({
        ...n,
        visibility: "studio" as const,
        updatedAt: new Date(n.updatedAt),
      })),
    );
    const toItems = (items: (typeof grouped)["pinned"]) =>
      items.map((it) => ({
        id: it.id,
        label: it.label,
        color: it.color,
        depth: it.depth,
      }));
    return [
      { label: "Pinned", items: toItems(grouped.pinned) },
      { label: "By venture", items: toItems(grouped.byVenture) },
      {
        label:
          grouped.unfiled.length > 0
            ? `Unfiled · ${grouped.unfiled.length}`
            : "Unfiled",
        items: toItems(grouped.unfiled),
      },
    ];
  }, [localNotes]);

  async function selectNote(id: string) {
    await editorRef.current?.flush("interval");
    router.push(`/notes?n=${id}`);
  }

  async function onCreate() {
    await editorRef.current?.flush("interval");
    const result = await createNoteAction({});
    if (result.ok) router.push(`/notes?n=${result.id}`);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "var(--w-side) 1fr var(--w-meta)",
      }}
    >
      <div
        style={{
          background: "var(--bg2)",
          borderRight: "1px solid var(--line)",
        }}
      >
        <div style={{ padding: "14px 15px 0" }}>
          <ActionButton onClick={() => void onCreate()}>+ New note</ActionButton>
        </div>
        <NoteSidebar
          groups={sidebarGroups}
          active={active?.id}
          onSelect={(id) => void selectNote(id)}
        />
      </div>
      {active ? (
        <ActiveNote
          key={active.id}
          active={active}
          editorRef={editorRef}
          onTitle={(title) =>
            setTitleOverrides((o) => ({ ...o, [active.id]: title }))
          }
        />
      ) : (
        <div
          style={{
            padding: "var(--sp-34) var(--sp-44) var(--sp-60)",
            minHeight: 520,
          }}
        >
          <EmptyState
            hint="Capture a meeting, a decision, or a loose thought."
            action="+ New note"
            onAction={() => void onCreate()}
          >
            No notes yet
          </EmptyState>
        </div>
      )}
      <MetaRail
        sections={
          active
            ? [
                {
                  label: "Venture",
                  value: active.ventureName ?? "Unfiled",
                  color: active.ventureId
                    ? ventureColor(active.ventureColor)
                    : "var(--faint)",
                },
                {
                  label: "History",
                  value: `${active.versionCount} version${active.versionCount === 1 ? "" : "s"}`,
                  color: "var(--faint)",
                },
              ]
            : []
        }
      />
    </div>
  );
}

function ActiveNote({
  active,
  editorRef,
  onTitle,
}: {
  active: NotesViewActive;
  editorRef: RefObject<NoteBodyHandle | null>;
  onTitle: (title: string) => void;
}) {
  const [title, setTitle] = useState(active.title);
  const [bylineName, setBylineName] = useState(active.lastEditedByName);
  const [bylineAt, setBylineAt] = useState(active.updatedAt);
  const ventureLabel = active.ventureName ?? "Unfiled";
  const ventureTint = active.ventureId
    ? ventureColor(active.ventureColor)
    : "var(--ash)";
  const byline = `${(bylineName ?? "Unknown").toUpperCase()} · EDITED ${formatEditedAgo(new Date(bylineAt), new Date())}`;

  return (
    <div
      style={{
        padding: "var(--sp-34) var(--sp-44) var(--sp-60)",
        minHeight: 520,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-11)",
          letterSpacing: "var(--ls-mono-wider)",
          textTransform: "uppercase",
          color: "var(--faint)",
          marginBottom: "var(--sp-16)",
        }}
      >
        Notes <span style={{ color: "var(--ink-ghost)" }}>/</span>{" "}
        <em style={{ fontStyle: "normal", color: ventureTint }}>{ventureLabel}</em>{" "}
        <span style={{ color: "var(--ink-ghost)" }}>/</span> {title || "Untitled"}
      </div>
      <input
        value={title}
        onChange={(e) => {
          const next = e.target.value;
          setTitle(next);
          onTitle(next);
        }}
        onBlur={() => void editorRef.current?.flush("blur")}
        style={{
          display: "block",
          width: "100%",
          fontSize: "var(--fs-33)",
          fontWeight: 600,
          letterSpacing: "var(--ls-display-xl)",
          lineHeight: "var(--lh-tight)",
          margin: 0,
          padding: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--ink)",
          fontFamily: "var(--font-sans)",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-11)",
          letterSpacing: "var(--ls-mono-wide)",
          color: "var(--faint)",
          marginTop: "var(--sp-11)",
          paddingBottom: "var(--sp-20)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {byline}
      </div>
      <div style={{ marginTop: "var(--sp-16)" }}>
        <NoteBodyEditor
          ref={editorRef}
          noteId={active.id}
          content={active.content}
          title={title}
          onSaved={({ lastEditedByName }) => {
            if (lastEditedByName) setBylineName(lastEditedByName);
            setBylineAt(new Date().toISOString());
          }}
        />
      </div>
    </div>
  );
}
