import type { ventureStage } from "@/db/schema";

export type Stage = (typeof ventureStage.enumValues)[number];

/* Stage order is fixed: Meet, Validate, Build, Form, Grow. Colour per column
   is the stage-track colour from the ui_kit (design-system/ui_kits/bench/data.jsx),
   distinct from a venture's own identity colour. */
export const STAGES: { stage: Stage; label: string; color: string }[] = [
  { stage: "meet", label: "Meet", color: "var(--copper)" },
  { stage: "validate", label: "Validate", color: "var(--magenta)" },
  { stage: "build", label: "Build", color: "var(--violet)" },
  { stage: "form", label: "Form", color: "var(--copper)" },
  { stage: "grow", label: "Grow", color: "var(--teal)" },
];

export const STALE_AFTER_DAYS = 14;

export function daysSince(date: Date, now: Date = new Date()): number {
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}

export function isStale(stageEnteredAt: Date, now: Date = new Date()): boolean {
  return daysSince(stageEnteredAt, now) > STALE_AFTER_DAYS;
}
