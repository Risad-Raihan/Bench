"use client";

import { Node, mergeAttributes, type Editor, type Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, {
  type SuggestionKeyDownProps,
  type SuggestionOptions,
  type SuggestionProps,
} from "@tiptap/suggestion";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { SlashMenu } from "../../../design-system/components/notes/NoteEditor.jsx";
import type { MentionableVenture } from "./capture-context";

type MentionItem = MentionableVenture;

type MenuHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

const MentionMenu = forwardRef<
  MenuHandle,
  { items: MentionItem[]; command: (item: MentionItem) => void }
>(function MentionMenu({ items, command }, ref) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }: SuggestionKeyDownProps) {
      if (event.key === "ArrowUp") {
        setSelected((i) => (i + items.length - 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelected((i) => (i + 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "Enter") {
        const item = items[selected];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) return null;

  return (
    <SlashMenu
      flush
      heading="Ventures"
      items={items.map((it, i) => ({
        glyph: "@",
        label: it.name,
        on: i === selected,
        onClick: () => command(it),
      }))}
    />
  );
});

function renderMentionMenu(): ReturnType<
  NonNullable<SuggestionOptions<MentionItem, MentionItem>["render"]>
> {
  let component: ReactRenderer<MenuHandle> | null = null;
  let unmount: (() => void) | null = null;

  return {
    onStart(props: SuggestionProps<MentionItem, MentionItem>) {
      component = new ReactRenderer(MentionMenu, {
        editor: props.editor,
        props: { items: props.items, command: props.command },
      });
      unmount = props.mount(component.element);
    },
    onUpdate(props: SuggestionProps<MentionItem, MentionItem>) {
      component?.updateProps({ items: props.items, command: props.command });
    },
    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === "Escape") {
        unmount?.();
        component?.destroy();
        return true;
      }
      return component?.ref?.onKeyDown(props) ?? false;
    },
    onExit() {
      unmount?.();
      unmount = null;
      component?.destroy();
      component = null;
    },
  };
}

export const VentureMention = Node.create({
  name: "mention",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addOptions() {
    return {
      ventures: [] as MentionableVenture[],
    };
  },

  addAttributes() {
    return {
      ventureId: { default: null },
      label: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-venture-id]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const label = String(node.attrs.label ?? "");
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-venture-id": node.attrs.ventureId,
        class: "note-mention",
      }),
      `@${label}`,
    ];
  },

  renderText({ node }) {
    const label = String(node.attrs.label ?? "");
    return label;
  },

  addProseMirrorPlugins() {
    const ventures = this.options.ventures as MentionableVenture[];
    return [
      Suggestion({
        // Distinct key so this doesn't collide with the slash-command
        // suggestion plugin (both use @tiptap/suggestion).
        pluginKey: new PluginKey("ventureMention"),
        editor: this.editor,
        char: "@",
        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase();
          return ventures.filter((v) => v.name.toLowerCase().includes(q));
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: MentionItem;
        }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent([
              {
                type: "mention",
                attrs: { ventureId: props.id, label: props.name },
              },
              { type: "text", text: " " },
            ])
            .run();
        },
        render: renderMentionMenu,
      }),
    ];
  },
});
