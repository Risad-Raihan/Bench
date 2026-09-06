"use client";

import { Extension, type Editor, type Range } from "@tiptap/core";
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
import {
  createDecisionFromNoteAction,
  createTaskFromNoteAction,
} from "@/lib/notes/actions";
import { BOARD_LANES, type Lane } from "@/lib/lanes";

export type SlashItem = {
  glyph: string;
  label: string;
  hint?: string;
  apply: (opts: { editor: Editor; range: Range }) => void;
};

type CaptureOpts = {
  noteId: string;
};

function captureItems(opts: CaptureOpts): SlashItem[] {
  const taskItems: SlashItem[] = BOARD_LANES.map((lane) => ({
    glyph: "☑",
    label: `Task · ${lane.label}`,
    hint: "creates a card",
    apply: ({ editor, range }) => {
      void (async () => {
        editor.chain().focus().deleteRange(range).run();
        const result = await createTaskFromNoteAction({
          noteId: opts.noteId,
          lane: lane.key as Lane,
        });
        if (!result.ok) return;
        editor
          .chain()
          .focus()
          .insertContent([
            { type: "task", attrs: { taskId: result.id } },
            { type: "paragraph" },
          ])
          .run();
      })();
    },
  }));

  return [
    ...taskItems,
    {
      glyph: "⚑",
      label: "Decision",
      hint: "logs it",
      apply: ({ editor, range }) => {
        void (async () => {
          editor.chain().focus().deleteRange(range).run();
          const result = await createDecisionFromNoteAction({
            noteId: opts.noteId,
          });
          if (!result.ok) return;
          editor
            .chain()
            .focus()
            .insertContent([
              { type: "decision", attrs: { decisionId: result.id } },
              { type: "paragraph" },
            ])
            .run();
        })();
      },
    },
    {
      glyph: "#",
      label: "Heading",
      apply: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
      },
    },
    {
      glyph: "❝",
      label: "Quote",
      apply: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
  ];
}

type MenuHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

const SlashCommandMenu = forwardRef<
  MenuHandle,
  { items: SlashItem[]; command: (item: SlashItem) => void }
>(function SlashCommandMenu({ items, command }, ref) {
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
      items={items.map((it, i) => ({
        glyph: it.glyph,
        label: it.label,
        hint: it.hint,
        on: i === selected,
        onClick: () => command(it),
      }))}
    />
  );
});

function renderSlashMenu(): ReturnType<
  NonNullable<SuggestionOptions<SlashItem, SlashItem>["render"]>
> {
  let component: ReactRenderer<MenuHandle> | null = null;
  let unmount: (() => void) | null = null;

  return {
    onStart(props: SuggestionProps<SlashItem, SlashItem>) {
      component = new ReactRenderer(SlashCommandMenu, {
        editor: props.editor,
        props: { items: props.items, command: props.command },
      });
      unmount = props.mount(component.element);
    },
    onUpdate(props: SuggestionProps<SlashItem, SlashItem>) {
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

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      noteId: "",
    };
  },

  addProseMirrorPlugins() {
    const noteId = this.options.noteId as string;
    const items = captureItems({ noteId });
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase();
          return items.filter((item) => item.label.toLowerCase().includes(q));
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: SlashItem;
        }) => {
          props.apply({ editor, range });
        },
        render: renderSlashMenu,
      }),
    ];
  },
});
