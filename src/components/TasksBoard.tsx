"use client";

import { useState, useTransition } from "react";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import {
  KanbanColumn,
  Lane,
  TaskCard,
} from "../../design-system/components/kanban/TaskCard.jsx";
import { Modal } from "../../design-system/components/overlay/Modal.jsx";
import { AddButton } from "../../design-system/components/pipeline/VentureCard.jsx";
import { FilterBar } from "../../design-system/components/work/TaskRow.jsx";
import { Check, Plus } from "lucide-react";
import { BOARD_COLUMNS, BOARD_LANES } from "@/lib/lanes";
import type { Lane as LaneKey, TaskStatus } from "@/lib/lanes";
import type { Priority } from "@/lib/data/tasks";
import {
  assignTaskAction,
  createTaskAction,
  editTaskAction,
  reorderTaskAction,
  setTaskDueDateAction,
} from "@/lib/tasks/actions";
import type { VentureLaneData, VentureTaskCardData } from "./VentureView";

export type AssignablePartner = {
  id: string;
  name: string;
  initials: string;
};

const PRIORITIES: Priority[] = ["low", "normal", "high"];

const DRAG_TYPE = "text/plain";

type Draft = {
  taskId: string | null;
  title: string;
  description: string;
  lane: LaneKey;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  dueDate: string;
};

function emptyDraft(lane: LaneKey, status: TaskStatus): Draft {
  return {
    taskId: null,
    title: "",
    description: "",
    lane,
    status,
    priority: "normal",
    assigneeId: null,
    dueDate: "",
  };
}

function draftFromTask(task: VentureTaskCardData): Draft {
  return {
    taskId: task.id,
    title: task.title,
    description: task.description ?? "",
    lane: task.lane,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate ?? "",
  };
}

export function TasksBoard({
  slug,
  ventureId,
  lanes,
  partners,
}: {
  slug: string;
  ventureId: string;
  lanes: VentureLaneData[];
  partners: AssignablePartner[];
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const original =
    draft?.taskId != null
      ? lanes
          .flatMap((l) => l.columns.flatMap((c) => c.tasks))
          .find((t) => t.id === draft.taskId)
      : null;

  const save = () => {
    if (!draft || pending) return;
    const title = draft.title.trim();
    if (!title) {
      setError("Title is required.");
      return;
    }
    setError(null);
    const dueDate = draft.dueDate.trim() || null;
    startTransition(async () => {
      if (!draft.taskId) {
        const result = await createTaskAction({
          slug,
          ventureId,
          title,
          lane: draft.lane,
          status: draft.status,
          priority: draft.priority,
          assigneeId: draft.assigneeId,
          dueDate,
          description: draft.description.trim() || null,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setDraft(null);
        return;
      }

      const taskId = draft.taskId;
      const results = [];
      results.push(
        await editTaskAction({
          slug,
          taskId,
          title,
          description: draft.description.trim() || null,
          priority: draft.priority,
        }),
      );
      if ((original?.assigneeId ?? null) !== draft.assigneeId) {
        results.push(
          await assignTaskAction({
            slug,
            taskId,
            assigneeId: draft.assigneeId,
          }),
        );
      }
      if ((original?.dueDate ?? null) !== dueDate) {
        results.push(await setTaskDueDateAction({ slug, taskId, dueDate }));
      }
      if (
        original &&
        (original.lane !== draft.lane || original.status !== draft.status)
      ) {
        results.push(
          await reorderTaskAction({
            slug,
            taskId,
            lane: draft.lane,
            status: draft.status,
          }),
        );
      }
      const failed = results.find((r) => !r.ok);
      if (failed && !failed.ok) {
        setError(failed.error);
        return;
      }
      setDraft(null);
    });
  };

  const dropOn = (
    taskId: string,
    lane: LaneKey,
    status: TaskStatus,
    beforeId?: string,
    afterId?: string,
  ) => {
    if (!taskId || pending) return;
    if (taskId === afterId) return;
    startTransition(async () => {
      await reorderTaskAction({
        slug,
        taskId,
        lane,
        status,
        beforeId: beforeId ?? null,
        afterId: afterId ?? null,
      });
      setDraggingId(null);
    });
  };

  return (
    <div style={{ padding: 14 }}>
      {lanes.map((lane, i) => (
        <Lane
          key={lane.key}
          name={lane.label}
          color={lane.color}
          count={lane.count}
          rise={i}
        >
          {lane.columns.map((col) => (
            <BoardColumn
              key={col.key}
              label={col.label}
              color={lane.color}
              tasks={col.tasks}
              draggingId={draggingId}
              onAdd={() => {
                setError(null);
                setDraft(emptyDraft(lane.key, col.key));
              }}
              onOpen={(task) => {
                setError(null);
                setDraft(draftFromTask(task));
              }}
              onDragStart={setDraggingId}
              onDrop={(taskId, beforeId, afterId) =>
                dropOn(taskId, lane.key, col.key, beforeId, afterId)
              }
            />
          ))}
        </Lane>
      ))}
      {draft ? (
        <TaskModal
          draft={draft}
          partners={partners}
          pending={pending}
          error={error}
          onChange={setDraft}
          onClose={() => setDraft(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function BoardColumn({
  label,
  color,
  tasks,
  draggingId,
  onAdd,
  onOpen,
  onDragStart,
  onDrop,
}: {
  label: string;
  color: string;
  tasks: VentureTaskCardData[];
  draggingId: string | null;
  onAdd: () => void;
  onOpen: (task: VentureTaskCardData) => void;
  onDragStart: (id: string | null) => void;
  onDrop: (taskId: string, beforeId?: string, afterId?: string) => void;
}) {
  const [hov, setHov] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData(DRAG_TYPE) || draggingId;
        if (id) onDrop(id);
      }}
      style={{
        outline: over ? "1px solid var(--line2)" : "1px solid transparent",
        outlineOffset: -1,
        transition: "outline-color var(--dur-fast)",
      }}
    >
      <KanbanColumn label={label}>
        {tasks.map((t) => (
          <div
            key={t.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(DRAG_TYPE, t.id);
              e.dataTransfer.effectAllowed = "move";
              onDragStart(t.id);
            }}
            onDragEnd={() => onDragStart(null)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const id = e.dataTransfer.getData(DRAG_TYPE) || draggingId;
              if (!id) return;
              const others = tasks.filter((x) => x.id !== id);
              const afterIndex = others.findIndex((x) => x.id === t.id);
              const beforeId =
                afterIndex > 0 ? others[afterIndex - 1]?.id : undefined;
              onDrop(id, beforeId, t.id);
            }}
            style={{ opacity: draggingId === t.id ? 0.45 : 1 }}
          >
            <TaskCard
              title={t.title}
              who={t.who}
              due={t.due}
              note={t.note}
              fromNote={t.fromNote}
              done={t.done}
              color={color}
              onClick={() => onOpen(t)}
            />
          </div>
        ))}
        <div
          style={{
            opacity: hov ? 1 : 0,
            transition: "opacity var(--dur-fast)",
            marginTop: 2,
          }}
        >
          <AddButton icon={Plus} onClick={onAdd}>Task</AddButton>
        </div>
      </KanbanColumn>
    </div>
  );
}

function TaskModal({
  draft,
  partners,
  pending,
  error,
  onChange,
  onClose,
  onSave,
}: {
  draft: Draft;
  partners: AssignablePartner[];
  pending: boolean;
  error: string | null;
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const creating = draft.taskId == null;
  const assigneeFilters = ["—", ...partners.map((p) => p.initials)];
  const assigneeActive =
    partners.find((p) => p.id === draft.assigneeId)?.initials ?? "—";

  return (
    <Modal
      eyebrow={creating ? "New task" : "Task"}
      title={creating ? "Add a task to this venture" : "Edit task"}
      onClose={onClose}
      width={520}
      footer={
        <>
          <ActionButton icon={Check} onClick={onSave}>
            {pending ? "Saving" : creating ? "Create task" : "Save"}
          </ActionButton>
          <span
            style={{
              fontSize: 11.5,
              color: error ? "var(--amber)" : "var(--faint)",
            }}
          >
            {error ??
              (pending
                ? "Writing…"
                : creating
                  ? "Lands in the cell you opened from."
                  : "Esc to close.")}
          </span>
        </>
      }
    >
      <TextField
        label="Title"
        value={draft.title}
        onChange={(title: string) => onChange({ ...draft, title })}
        autoFocus
      />
      <TextField
        label="Notes"
        value={draft.description}
        onChange={(description: string) => onChange({ ...draft, description })}
        multiline
        optional
      />
      <FieldLabel>Lane</FieldLabel>
      <div style={{ marginBottom: 14 }}>
        <FilterBar
          filters={BOARD_LANES.map((l) => l.label)}
          active={BOARD_LANES.find((l) => l.key === draft.lane)?.label}
          onSelect={(label: string) => {
            const lane = BOARD_LANES.find((l) => l.label === label);
            if (lane) onChange({ ...draft, lane: lane.key });
          }}
        />
      </div>
      <FieldLabel>Status</FieldLabel>
      <div style={{ marginBottom: 14 }}>
        <FilterBar
          filters={BOARD_COLUMNS.map((c) => c.label)}
          active={BOARD_COLUMNS.find((c) => c.key === draft.status)?.label}
          onSelect={(label: string) => {
            const col = BOARD_COLUMNS.map((c) => c).find(
              (c) => c.label === label,
            );
            if (col) onChange({ ...draft, status: col.key });
          }}
        />
      </div>
      <FieldLabel>Priority</FieldLabel>
      <div style={{ marginBottom: 14 }}>
        <FilterBar
          filters={PRIORITIES}
          active={draft.priority}
          onSelect={(priority: string) =>
            onChange({ ...draft, priority: priority as Priority })
          }
        />
      </div>
      <FieldLabel>Assignee</FieldLabel>
      <div style={{ marginBottom: 14 }}>
        <FilterBar
          filters={assigneeFilters}
          active={assigneeActive}
          onSelect={(initials: string) => {
            const partner = partners.find((p) => p.initials === initials);
            onChange({ ...draft, assigneeId: partner?.id ?? null });
          }}
        />
      </div>
      <TextField
        label="Due"
        value={draft.dueDate}
        onChange={(dueDate: string) => onChange({ ...draft, dueDate })}
        placeholder="YYYY-MM-DD"
        optional
      />
    </Modal>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        color: "var(--faint)",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
