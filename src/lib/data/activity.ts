/**
 * Founder-reachable activity reads. Partner path is unfiltered.
 * Founder verb allow-list lands in S14. Writes (`recordActivity`) land in S4.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activity, type entityType } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

type Entity = (typeof entityType.enumValues)[number];

export type PartnerActivity = {
  id: string;
  actorId: string | null;
  verb: string;
  entity: Entity;
  entityId: string;
  ventureId: string | null;
  payload: Record<string, unknown> | null;
  createdAt: Date;
};

export type FounderActivity = Omit<PartnerActivity, "payload">;

export async function listVentureActivity(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerActivity[]>;
export async function listVentureActivity(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerActivity[] | FounderActivity[]>;
export async function listVentureActivity(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerActivity[] | FounderActivity[]> {
  if (!isInternalUser(user)) {
    // S14: allow-listed verbs only, scoped to user.ventureIds.
    void ventureId;
    return [];
  }
  return db
    .select({
      id: activity.id,
      actorId: activity.actorId,
      verb: activity.verb,
      entity: activity.entity,
      entityId: activity.entityId,
      ventureId: activity.ventureId,
      payload: activity.payload,
      createdAt: activity.createdAt,
    })
    .from(activity)
    .where(eq(activity.ventureId, ventureId))
    .orderBy(desc(activity.createdAt));
}

export async function listActivity(
  user: InternalUser,
): Promise<PartnerActivity[]>;
export async function listActivity(
  user: CurrentUser,
): Promise<PartnerActivity[] | FounderActivity[]>;
export async function listActivity(
  user: CurrentUser,
): Promise<PartnerActivity[] | FounderActivity[]> {
  if (!isInternalUser(user)) return [];
  return db
    .select({
      id: activity.id,
      actorId: activity.actorId,
      verb: activity.verb,
      entity: activity.entity,
      entityId: activity.entityId,
      ventureId: activity.ventureId,
      payload: activity.payload,
      createdAt: activity.createdAt,
    })
    .from(activity)
    .orderBy(desc(activity.createdAt));
}
