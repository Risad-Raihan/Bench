import type { lane, taskStatus } from "@/db/schema";

export type Lane = (typeof lane.enumValues)[number];
export type TaskStatus = (typeof taskStatus.enumValues)[number];

/* The venture Tasks board always shows these four lanes, in this order,
   regardless of whether a lane has any tasks yet — see
   design-system/components/kanban/TaskCard.prompt.md. "ops" is a real lane
   in the schema but has no board column of its own. */
export const BOARD_LANES: { key: Lane; label: string; color: string }[] = [
  { key: "thesis", label: "Thesis", color: "var(--amber)" },
  { key: "tech", label: "Tech", color: "var(--copper)" },
  { key: "gtm", label: "GTM", color: "var(--magenta)" },
  { key: "capital", label: "Capital", color: "var(--teal)" },
];

export const BOARD_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "Doing" },
  { key: "blocked", label: "Blocked" },
  { key: "done", label: "Done" },
];

const BOARD_LANE_KEYS = new Set<Lane>(BOARD_LANES.map((l) => l.key));
const BOARD_STATUS_KEYS = new Set<TaskStatus>(
  BOARD_COLUMNS.map((c) => c.key),
);

export function isBoardLane(value: string): value is Lane {
  return BOARD_LANE_KEYS.has(value as Lane) && value !== "ops";
}

export function isBoardStatus(value: string): value is TaskStatus {
  return BOARD_STATUS_KEYS.has(value as TaskStatus);
}
