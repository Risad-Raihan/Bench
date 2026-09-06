import type { Lane, TaskStatus } from "@/lib/lanes";

export const DUE_GROUPS = [
  "Overdue",
  "Today",
  "This week",
  "Later",
  "No due date",
] as const;

export type DueGroupLabel = (typeof DUE_GROUPS)[number];

export type MyWorkTask = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  position: number;
  ventureId: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  ventureSlug: string | null;
  lane: Lane;
};

export type GroupedMyWorkTask = MyWorkTask & { ventureLabel: string };

export type MyWorkGroup = {
  label: DueGroupLabel;
  items: GroupedMyWorkTask[];
};

const STATUS_RANK: Record<TaskStatus, number> = {
  doing: 0,
  blocked: 1,
  todo: 2,
  done: 3,
};

const THIS_WEEK_DAYS = 7;

/** YYYY-MM-DD in the local calendar of `date`. */
export function calendarKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addCalendarDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return calendarKey(new Date(y, m - 1, d + days));
}

function dueGroup(dueDate: string | null, today: string): DueGroupLabel {
  if (dueDate == null) return "No due date";
  if (dueDate < today) return "Overdue";
  if (dueDate === today) return "Today";
  if (dueDate <= addCalendarDays(today, THIS_WEEK_DAYS)) return "This week";
  return "Later";
}

function ventureLabel(task: MyWorkTask): string {
  return task.ventureId == null ? "Personal" : (task.ventureName ?? "");
}

function compareWithinGroup(a: GroupedMyWorkTask, b: GroupedMyWorkTask): number {
  const status = STATUS_RANK[a.status] - STATUS_RANK[b.status];
  if (status !== 0) return status;
  if (a.dueDate == null && b.dueDate == null) return a.position - b.position;
  if (a.dueDate == null) return 1;
  if (b.dueDate == null) return -1;
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  return a.position - b.position;
}

export function groupByDueDate(tasks: MyWorkTask[], now: Date): MyWorkGroup[] {
  const today = calendarKey(now);
  const buckets = new Map<DueGroupLabel, GroupedMyWorkTask[]>(
    DUE_GROUPS.map((label) => [label, []]),
  );

  for (const task of tasks) {
    if (task.status === "done") continue;
    buckets.get(dueGroup(task.dueDate, today))!.push({
      ...task,
      ventureLabel: ventureLabel(task),
    });
  }

  return DUE_GROUPS.map((label) => ({
    label,
    items: buckets.get(label)!.sort(compareWithinGroup),
  }));
}
