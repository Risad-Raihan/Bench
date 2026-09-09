import type { ventureStage } from "@/db/schema";

export type Stage = (typeof ventureStage.enumValues)[number];

/* Stage order is fixed: Meet, Validate, Build, Form, Grow. Colour per column
   is the stage-track colour from the ui_kit (design-system/ui_kits/bench/data.jsx),
   distinct from a venture's own identity colour. */
export const STAGES: { stage: Stage; label: string; color: string }[] = [
  { stage: "meet", label: "Meet", color: "var(--copper)" },
  { stage: "validate", label: "Validate", color: "var(--magenta)" },
  { stage: "build", label: "Build", color: "var(--violet)" },
  { stage: "form", label: "Form", color: "var(--amber)" },
  { stage: "grow", label: "Grow", color: "var(--teal)" },
];

const STAGE_KEYS = new Set<string>(STAGES.map((s) => s.stage));

export function isStage(value: string): value is Stage {
  return STAGE_KEYS.has(value);
}

export function stageIndex(stage: Stage): number {
  return STAGES.findIndex((s) => s.stage === stage);
}

export function stageLabel(stage: Stage): string {
  return STAGES.find((s) => s.stage === stage)?.label ?? stage;
}

export const STALE_AFTER_DAYS = 14;

export function daysSince(date: Date, now: Date = new Date()): number {
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}

/** True when a venture has sat in its stage, or an application has sat in the inbox, longer than 14 days. */
export function isStale(since: Date, now: Date = new Date()): boolean {
  return daysSince(since, now) > STALE_AFTER_DAYS;
}
