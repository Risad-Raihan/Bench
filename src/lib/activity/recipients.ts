/**
 * Pure verb → recipient mapping (ADR-0005). Always minus the actor.
 * System/unknown verbs return no one — those events are board badges, not
 * notifications.
 */
export const ACTIVITY_VERBS = [
  "assigned",
  "moved",
  "completed",
  "commented",
  "mentioned",
  "decided",
  "cleared",
  "uploaded",
  "engaged",
  "passed",
  "created",
  "updated",
  "stale",
] as const;

export type ActivityVerb = (typeof ACTIVITY_VERBS)[number];

export type RecipientContext = {
  actorId: string | null;
  assigneeId?: string | null;
  creatorId?: string | null;
  ownerId?: string | null;
  partnerIds?: string[];
};

function uniqueMinusActor(
  ids: (string | null | undefined)[],
  actorId: string | null,
): string[] {
  const seen = new Set<string>();
  for (const id of ids) {
    if (!id || id === actorId || seen.has(id)) continue;
    seen.add(id);
  }
  return [...seen];
}

const TASK_CHANGE_VERBS = new Set(["moved", "completed", "commented"]);
const OWNER_VERBS = new Set([
  "mentioned",
  "decided",
  "cleared",
  "uploaded",
]);
const SCREEN_VERBS = new Set(["engaged", "passed"]);

export function recipientsFor(
  verb: string,
  context: RecipientContext,
): string[] {
  if (verb === "assigned") {
    return uniqueMinusActor([context.assigneeId], context.actorId);
  }
  if (TASK_CHANGE_VERBS.has(verb)) {
    return uniqueMinusActor(
      [context.assigneeId, context.creatorId],
      context.actorId,
    );
  }
  if (OWNER_VERBS.has(verb)) {
    return uniqueMinusActor([context.ownerId], context.actorId);
  }
  if (SCREEN_VERBS.has(verb)) {
    return uniqueMinusActor(context.partnerIds ?? [], context.actorId);
  }
  return [];
}
