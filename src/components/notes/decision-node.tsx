"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";
import {
  getDecisionBlockAction,
  updateDecisionTitleAction,
} from "@/lib/notes/actions";

function captureSlug(editor: ReactNodeViewProps["editor"]) {
  return (
    (editor.storage as { noteCapture?: { ventureSlug?: string | null } })
      .noteCapture?.ventureSlug ?? null
  );
}

function DecisionNodeView({ node, editor }: ReactNodeViewProps) {
  const decisionId = String(node.attrs.decisionId ?? "");
  const ventureSlug = captureSlug(editor);
  const [title, setTitle] = useState("Untitled");
  const [draft, setDraft] = useState("Untitled");

  useEffect(() => {
    if (!decisionId) return;
    let cancelled = false;
    getDecisionBlockAction(decisionId).then((row) => {
      if (cancelled) return;
      const next = row?.title || "Untitled";
      setTitle(next);
      setDraft(next);
    });
    return () => {
      cancelled = true;
    };
  }, [decisionId]);

  async function persist() {
    const next = draft.trim() || "Untitled";
    if (next === title) return;
    await updateDecisionTitleAction({
      decisionId,
      title: next,
      slug: ventureSlug,
    });
    setTitle(next);
    setDraft(next);
  }

  return (
    <NodeViewWrapper as="div" className="note-embed">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sp-11)",
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderLeft: "2px solid var(--magenta)",
          padding: "9px 12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-11)",
            letterSpacing: "var(--ls-mono-wide)",
            textTransform: "uppercase",
            color: "var(--magenta-label)",
            flex: "none",
          }}
        >
          Decision
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => void persist()}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--ink)",
            fontSize: "var(--fs-13-5)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>
    </NodeViewWrapper>
  );
}

export const DecisionNode = Node.create({
  name: "decision",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      decisionId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-decision-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-decision-id": HTMLAttributes.decisionId,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DecisionNodeView);
  },
});
