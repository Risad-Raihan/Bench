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
