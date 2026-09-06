"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { asEditorDoc } from "@/lib/notes/save";
import { saveNoteAction } from "@/lib/notes/actions";
import { DecisionNode } from "./decision-node";
import { VentureMention } from "./mention";
import { SlashCommand } from "./slash-command";
import { TaskNode } from "./task-node";
import type { MentionableVenture } from "./capture-context";

const NoteCaptureStorage = Extension.create({
  name: "noteCapture",
  addOptions() {
    return {
      noteId: "",
      ventureId: null as string | null,
      ventureSlug: null as string | null,
    };
  },
  addStorage() {
    return {
      noteId: this.options.noteId,
      ventureId: this.options.ventureId,
      ventureSlug: this.options.ventureSlug,
    };
  },
});

const AUTOSAVE_MS = 2000;

export type NoteBodyHandle = {
  flush: (reason: "blur" | "interval" | "flush") => Promise<void>;
};

export const NoteBodyEditor = forwardRef<
  NoteBodyHandle,
  {
    noteId: string;
    content: unknown;
    title: string;
    ventureId?: string | null;
    ventureSlug?: string | null;
    ventures?: MentionableVenture[];
    onSaved?: (info: { lastEditedByName: string | null }) => void;
  }
>(function NoteBodyEditor(
  { noteId, content, title, ventureId = null, ventureSlug = null, ventures = [], onSaved },
  ref,
) {
  const titleRef = useRef(title);
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  const titleReady = useRef(false);
  useEffect(() => {
    titleRef.current = title;
    if (!titleReady.current) {
      titleReady.current = true;
      return;
    }
    dirtyRef.current = true;
  }, [title]);

  const persist = useCallback(
    async (reason: "blur" | "interval" | "flush", json: unknown) => {
      if (savingRef.current && reason !== "flush") return;
      savingRef.current = true;
      try {
        const result = await saveNoteAction({
          noteId,
          content: json,
          title: titleRef.current,
          reason,
        });
        if (result.ok) {
          dirtyRef.current = false;
          onSaved?.({ lastEditedByName: result.lastEditedByName ?? null });
        }
      } finally {
        savingRef.current = false;
      }
    },
    [noteId, onSaved],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      NoteCaptureStorage.configure({ noteId, ventureId, ventureSlug }),
      TaskNode,
      DecisionNode,
      VentureMention.configure({ ventures }),
      SlashCommand.configure({ noteId }),
    ],
    content: asEditorDoc(content),
    editorProps: {
      attributes: { class: "note-prose" },
    },
    onUpdate: ({ editor: current }) => {
      dirtyRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void persist("interval", current.getJSON());
      }, AUTOSAVE_MS);
    },
    onBlur: ({ editor: current, event }) => {
      const next = event.relatedTarget as Node | null;
      if (next && current.view.dom.contains(next)) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!dirtyRef.current) return;
      void persist("blur", current.getJSON());
    },
  });

  const flush = useCallback(
    async (reason: "blur" | "interval" | "flush") => {
      if (!editor) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!dirtyRef.current && reason !== "flush") return;
      if (reason === "flush") {
        const payload = JSON.stringify({
          content: editor.getJSON(),
          title: titleRef.current,
        });
        const blob = new Blob([payload], { type: "application/json" });
        const sent = navigator.sendBeacon(`/api/notes/${noteId}/flush`, blob);
        if (!sent) {
          await persist("flush", editor.getJSON());
        }
        dirtyRef.current = false;
        return;
      }
      await persist(reason, editor.getJSON());
    },
    [editor, noteId, persist],
  );

  useImperativeHandle(ref, () => ({ flush }), [flush]);

  useEffect(() => {
    const onHide = () => {
      void flush("flush");
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flush]);

  if (!editor) return null;
  return <EditorContent editor={editor} />;
});
