/**
 * Verbs a founder may see on their venture feed. Allow-list, not a deny-list
 * (docs/founder-access.md). Excludes equity/potential/pass/gate/task-internal.
 */
export const FOUNDER_ACTIVITY_VERBS = [
  "created",
  "uploaded",
  "decided",
  "commented",
  "moved",
] as const;

export type FounderActivityVerb = (typeof FOUNDER_ACTIVITY_VERBS)[number];
