import { requirePartner } from "@/lib/auth/current-user";
import { listMyWorkTasks } from "@/lib/data/tasks";
import { formatDueDate } from "@/lib/format";
import { BOARD_LANES } from "@/lib/lanes";
import {
  calendarKey,
  groupByDueDate,
  type DueGroupLabel,
  type GroupedMyWorkTask,
} from "@/lib/my-work";
import { ventureColor } from "@/lib/venture-colors";
import {
  MyWorkView,
  type MyWorkGroupView,
  type MyWorkRowView,
} from "@/components/MyWorkView";

function daysBetween(fromKey: string, toKey: string): number {
  const [y1, m1, d1] = fromKey.split("-").map(Number);
  const [y2, m2, d2] = toKey.split("-").map(Number);
  return Math.round(
    (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000,
  );
}

function formatWorkDate(
  dueDate: string | null,
  group: DueGroupLabel,
  today: string,
): { date: string; late: boolean } {
  if (group === "No due date" || dueDate == null) {
    return { date: "—", late: false };
  }
  if (group === "Today") return { date: "TODAY", late: false };
  if (group === "Overdue") {
    return { date: `${daysBetween(dueDate, today)}D LATE`, late: true };
  }
  const [y, m, d] = dueDate.split("-").map(Number);
  return { date: formatDueDate(new Date(y, m - 1, d)), late: false };
}

function toRow(task: GroupedMyWorkTask, group: DueGroupLabel, today: string): MyWorkRowView {
  const laneMeta = BOARD_LANES.find((l) => l.key === task.lane);
  const { date, late } = formatWorkDate(task.dueDate, group, today);
  const personal = task.ventureId == null;
  return {
    id: task.id,
    title: task.title,
    venture: task.ventureLabel,
    ventureColor: personal ? "var(--ash)" : ventureColor(task.ventureColor),
    ventureSlug: task.ventureSlug,
    lane: laneMeta?.label ?? task.lane,
    laneKey: task.lane,
    laneColor: laneMeta?.color ?? "var(--copper)",
    date,
    late,
    status: task.status,
    hasDueDate: task.dueDate != null,
  };
}

export default async function MyWorkPage() {
  const user = await requirePartner();
  const now = new Date();
  const today = calendarKey(now);
  const tasks = await listMyWorkTasks(user);
  const groups = groupByDueDate(tasks, now);

  const views: MyWorkGroupView[] = groups.map((g) => ({
    label: g.label,
    hot: g.label === "Overdue",
    items: g.items.map((t) => toRow(t, g.label, today)),
  }));

  const open = views.reduce((n, g) => n + g.items.length, 0);
  const overdue = views.find((g) => g.label === "Overdue")?.items.length ?? 0;
  const dueThisWeek =
    (views.find((g) => g.label === "Today")?.items.length ?? 0) +
    (views.find((g) => g.label === "This week")?.items.length ?? 0);

  return (
    <MyWorkView
      title="My work"
      meta={`${open} OPEN · ${dueThisWeek} DUE THIS WEEK · ${overdue} OVERDUE`}
      groups={views}
    />
  );
}
