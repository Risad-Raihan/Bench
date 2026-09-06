/**
 * Founder-reachable activity reads and the activity/notification write path
 * (ADR-0005, ADR-0006). Founder feeds are an allow-list of verbs, scoped to
 * their venture, with payloads stripped.
 */
import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  activity,
  notifications,
  tasks,
  users,
  ventures,
  type entityType,
} from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";
import { canSeeVenture } from "@/lib/data/scope";
import {
  FOUNDER_ACTIVITY_VERBS,
  type FounderActivityVerb,
} from "@/lib/activity/founder-verbs";
import {
  recipientsFor,
  type ActivityVerb,
  type RecipientContext,
} from "@/lib/activity/recipients";

type Executor = typeof db;

type Entity = (typeof entityType.enumValues)[number];

export type PartnerActivity = {
  id: string;
  actorId: string | null;
  actorInitials: string | null;
  actorName: string | null;
  verb: string;
  entity: Entity;
  entityId: string;
  ventureId: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  ventureSlug: string | null;
  payload: Record<string, unknown> | null;
  createdAt: Date;
};

export type FounderActivity = Omit<PartnerActivity, "payload">;

export { FOUNDER_ACTIVITY_VERBS, type FounderActivityVerb };

export type PartnerNotification = {
  id: string;
  activityId: string;
  readAt: Date | null;
  createdAt: Date;
  actorId: string | null;
  actorInitials: string | null;
  actorName: string | null;
  verb: string;
  entity: Entity;
  entityId: string;
  ventureId: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  ventureSlug: string | null;
  payload: Record<string, unknown> | null;
};

const feedColumns = {
  id: activity.id,
  actorId: activity.actorId,
  actorInitials: users.initials,
  actorName: users.name,
  verb: activity.verb,
  entity: activity.entity,
  entityId: activity.entityId,
  ventureId: activity.ventureId,
  ventureName: ventures.name,
  ventureColor: ventures.color,
  ventureSlug: ventures.slug,
  payload: activity.payload,
  createdAt: activity.createdAt,
};

// Feeds and the inbox dropdown are recent-history surfaces, not archives.
const FEED_LIMIT = 100;
const INBOX_LIMIT = 50;

function withoutPayload(row: PartnerActivity): FounderActivity {
  const { payload, ...rest } = row;
  void payload;
  return rest;
}

export async function listVentureActivity(
  user: InternalUser,
  ventureId: string,
  executor?: Executor,
): Promise<PartnerActivity[]>;
export async function listVentureActivity(
  user: CurrentUser,
  ventureId: string,
  executor?: Executor,
): Promise<PartnerActivity[] | FounderActivity[]>;
export async function listVentureActivity(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<PartnerActivity[] | FounderActivity[]> {
  if (!isInternalUser(user)) {
    if (!canSeeVenture(user, ventureId)) return [];
    const rows = await executor
      .select(feedColumns)
      .from(activity)
      .leftJoin(users, eq(activity.actorId, users.id))
      .leftJoin(ventures, eq(activity.ventureId, ventures.id))
      .where(
        and(
          eq(activity.ventureId, ventureId),
          inArray(activity.verb, [...FOUNDER_ACTIVITY_VERBS]),
        ),
      )
      .orderBy(desc(activity.createdAt))
      .limit(FEED_LIMIT);
    return rows.map(withoutPayload);
  }
  return executor
    .select(feedColumns)
    .from(activity)
    .leftJoin(users, eq(activity.actorId, users.id))
    .leftJoin(ventures, eq(activity.ventureId, ventures.id))
    .where(eq(activity.ventureId, ventureId))
    .orderBy(desc(activity.createdAt))
    .limit(FEED_LIMIT);
}

export async function listActivity(
  user: InternalUser,
  executor?: Executor,
): Promise<PartnerActivity[]>;
export async function listActivity(
  user: CurrentUser,
  executor?: Executor,
): Promise<PartnerActivity[] | FounderActivity[]>;
export async function listActivity(
  user: CurrentUser,
  executor: Executor = db,
): Promise<PartnerActivity[] | FounderActivity[]> {
  if (!isInternalUser(user)) return [];
  return executor
    .select(feedColumns)
    .from(activity)
    .leftJoin(users, eq(activity.actorId, users.id))
    .leftJoin(ventures, eq(activity.ventureId, ventures.id))
    .orderBy(desc(activity.createdAt))
    .limit(FEED_LIMIT);
}

export async function listNotifications(
  user: CurrentUser,
  executor: Executor = db,
): Promise<PartnerNotification[]> {
  if (!isInternalUser(user)) return [];
  return executor
    .select({
      id: notifications.id,
      activityId: notifications.activityId,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
      actorId: activity.actorId,
      actorInitials: users.initials,
      actorName: users.name,
      verb: activity.verb,
      entity: activity.entity,
      entityId: activity.entityId,
      ventureId: activity.ventureId,
      ventureName: ventures.name,
      ventureColor: ventures.color,
      ventureSlug: ventures.slug,
      payload: activity.payload,
    })
    .from(notifications)
    .innerJoin(activity, eq(notifications.activityId, activity.id))
    .leftJoin(users, eq(activity.actorId, users.id))
    .leftJoin(ventures, eq(activity.ventureId, ventures.id))
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(INBOX_LIMIT);
}

export async function markRead(
  user: CurrentUser,
  notificationId: string,
  executor: Executor = db,
): Promise<void> {
  if (!isInternalUser(user)) return;
  await executor
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, user.id),
        isNull(notifications.readAt),
      ),
    );
}

export async function markAllRead(
  user: CurrentUser,
  executor: Executor = db,
): Promise<void> {
  if (!isInternalUser(user)) return;
  await executor
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.userId, user.id), isNull(notifications.readAt)),
    );
}

export type RecordActivityInput = {
  verb: ActivityVerb;
  entity: Entity;
  entityId: string;
  ventureId?: string | null;
  actorId: string | null;
  payload?: Record<string, unknown>;
};

async function recipientContext(
  input: RecordActivityInput,
  executor: Executor,
): Promise<RecipientContext> {
  const { verb, actorId, entityId, ventureId } = input;

  if (
    verb === "assigned" ||
    verb === "moved" ||
    verb === "completed" ||
    verb === "commented"
  ) {
    const [task] = await executor
      .select({
        assigneeId: tasks.assigneeId,
        createdBy: tasks.createdBy,
      })
      .from(tasks)
      .where(eq(tasks.id, entityId))
      .limit(1);
    return {
      actorId,
      assigneeId: task?.assigneeId,
      creatorId: task?.createdBy,
    };
  }

  if (
    verb === "mentioned" ||
    verb === "decided" ||
    verb === "cleared" ||
    verb === "uploaded"
  ) {
    if (!ventureId) return { actorId };
    const [venture] = await executor
      .select({ ownerId: ventures.ownerId })
      .from(ventures)
      .where(eq(ventures.id, ventureId))
      .limit(1);
    return { actorId, ownerId: venture?.ownerId };
  }

  if (verb === "engaged" || verb === "passed") {
    // ADR-0005: "all partners" — the deliberate fan-out. role="partner" only,
    // not every internal role.
    const rows = await executor
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.role, "partner"), isNull(users.disabledAt)));
    return { actorId, partnerIds: rows.map((row) => row.id) };
  }

  return { actorId };
}

export async function recordActivity(
  input: RecordActivityInput,
  executor?: Executor,
): Promise<{ id: string }> {
  const run = executor ?? db;
  const [row] = await run
    .insert(activity)
    .values({
      actorId: input.actorId,
      verb: input.verb,
      entity: input.entity,
      entityId: input.entityId,
      ventureId: input.ventureId ?? null,
      payload: input.payload ?? {},
    })
    .returning({ id: activity.id });

  if (!row) throw new Error("activity insert returned no row");

  const recipientIds = recipientsFor(
    input.verb,
    await recipientContext(input, run),
  );
  if (recipientIds.length > 0) {
    await run.insert(notifications).values(
      recipientIds.map((userId) => ({
        userId,
        activityId: row.id,
      })),
    );
  }

  return { id: row.id };
}

export async function unreadCount(
  userId: string,
  executor: Executor = db,
): Promise<number> {
  const [row] = await executor
    .select({ n: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), isNull(notifications.readAt)),
    );
  return row?.n ?? 0;
}
