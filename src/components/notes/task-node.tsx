"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";
import { TaskBlock } from "../../../design-system/components/notes/NoteEditor.jsx";
import {
  getTaskBlockAction,
  toggleNoteTaskAction,
} from "@/lib/notes/actions";
import type { TaskBlockData } from "@/lib/data/tasks";
import { BOARD_LANES } from "@/lib/lanes";

function pillFor(task: TaskBlockData): { pill: string; pillColor: string } {
  const lane = BOARD_LANES.find((l) => l.key === task.lane);
  const laneLabel = lane?.label ?? task.lane;
  const pill = task.assigneeInitials
    ? `${laneLabel} · ${task.assigneeInitials}`
    : laneLabel;
  return { pill, pillColor: lane?.color ?? "var(--teal)" };
}

function captureSlug(editor: ReactNodeViewProps["editor"]) {
  return (
    (editor.storage as { noteCapture?: { ventureSlug?: string | null } })
      .noteCapture?.ventureSlug ?? null
  );
}

function TaskNodeView({ node, editor }: ReactNodeViewProps) {
  const taskId = String(node.attrs.taskId ?? "");
  const ventureSlug = captureSlug(editor);
  const [task, setTask] = useState<TaskBlockData | null>(null);

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;
    getTaskBlockAction(taskId).then((row) => {
      if (!cancelled) setTask(row);
    });
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  async function onToggle() {
    if (!task) return;
    const done = task.status !== "done";
    await toggleNoteTaskAction({
      taskId: task.id,
      done,
      slug: ventureSlug,
    });
    const row = await getTaskBlockAction(task.id);
    setTask(row);
  }

  const title = task?.title ?? "Untitled";
  const done = task?.status === "done";
  const { pill, pillColor } = task
    ? pillFor(task)
    : { pill: undefined, pillColor: "var(--teal)" };

  return (
    <NodeViewWrapper as="div" className="note-embed">
      <TaskBlock
        label={title}
        pill={pill}
        pillColor={pillColor}
        done={done}
        onToggle={() => void onToggle()}
      />
    </NodeViewWrapper>
  );
}

export const TaskNode = Node.create({
  name: "task",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      taskId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-task-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-task-id": HTMLAttributes.taskId,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaskNodeView);
  },
});
