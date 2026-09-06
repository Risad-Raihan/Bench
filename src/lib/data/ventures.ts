/**
 * Founder-reachable venture reads. Pages never touch `db` for these rows
 * (ADR-0006). Partner path matches the pre-choke-point queries. Founder
 * scoping and field-stripping land in S14.
 */
import { and, asc, count, eq, inArray, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  events,
  gateItems,
  tasks,
  users,
  ventureStageEvents,
  ventures,
  type potential,
  type ventureStatus,
} from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";
import type { Lane, TaskStatus } from "@/lib/lanes";
import type { Stage } from "@/lib/pipeline-stages";

type Potential = (typeof potential.enumValues)[number];
type VentureStatus = (typeof ventureStatus.enumValues)[number];

export type PartnerVenture = {
  id: string;
  slug: string;
  name: string;
  oneLiner: string | null;
  color: string | null;
  stage: Stage;
  status: VentureStatus;
  equityPct: number | null;
  potential: Potential | null;
  ownerId: string | null;
  ownerName: string | null;
  ownerInitials: string | null;
  founderName: string | null;
  stageEnteredAt: Date;
  boardPosition: number;
};

export type FounderVenture = Omit<
  PartnerVenture,
  "equityPct" | "potential" | "ownerId" | "ownerName" | "ownerInitials"
>;

export type SwitchTarget = {
  slug: string;
  name: string;
  color: string | null;
};

export type GateItemRow = {
  ventureId: string;
  stage: Stage;
  label: string;
  doneAt: Date | null;
  sortOrder: number;
};

export type PartnerStageEvent = {
  toStage: Stage;
  createdAt: Date;
  reason: string | null;
};

export type FounderStageEvent = Omit<PartnerStageEvent, "reason">;

export type PartnerVentureTask = {
  id: string;
  title: string;
  lane: Lane;
  status: TaskStatus;
  position: number;
  dueDate: string | null;
  originNoteId: string | null;
  assigneeInitials: string | null;
};

export type FounderVentureTask = Omit<PartnerVentureTask, "lane">;

export type PipelineTaskRow = {
  ventureId: string | null;
  status: TaskStatus;
  dueDate: string | null;
};

const partnerVentureColumns = {
  id: ventures.id,
  slug: ventures.slug,
  name: ventures.name,
  oneLiner: ventures.oneLiner,
  color: ventures.color,
  stage: ventures.stage,
  status: ventures.status,
  equityPct: ventures.equityPct,
  potential: ventures.potential,
  ownerId: ventures.ownerId,
  ownerName: users.name,
  ownerInitials: users.initials,
  founderName: ventures.founderName,
  stageEnteredAt: ventures.stageEnteredAt,
  boardPosition: ventures.boardPosition,
};

export async function listVentures(
  user: InternalUser,
): Promise<PartnerVenture[]>;
export async function listVentures(
  user: CurrentUser,
): Promise<PartnerVenture[] | FounderVenture[]>;
export async function listVentures(
  user: CurrentUser,
): Promise<PartnerVenture[] | FounderVenture[]> {
  if (!isInternalUser(user)) {
    // S14: founders have no pipeline; out-of-scope reads 404 at the page.
    return [];
  }
  return db
    .select(partnerVentureColumns)
    .from(ventures)
    .leftJoin(users, eq(ventures.ownerId, users.id))
    .where(eq(ventures.status, "active"));
}

export async function getVenture(
  user: InternalUser,
  slug: string,
): Promise<PartnerVenture | null>;
export async function getVenture(
  user: CurrentUser,
  slug: string,
): Promise<PartnerVenture | FounderVenture | null>;
export async function getVenture(
  user: CurrentUser,
  slug: string,
): Promise<PartnerVenture | FounderVenture | null> {
  if (!isInternalUser(user)) {
    // S14: restrict to user.ventureIds, strip partner-only fields, 404 out of scope.
    void slug;
    return null;
  }
  const [row] = await db
    .select(partnerVentureColumns)
    .from(ventures)
    .leftJoin(users, eq(ventures.ownerId, users.id))
    .where(eq(ventures.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function listSwitchTargets(
  user: CurrentUser,
  excludeVentureId: string,
): Promise<SwitchTarget[]> {
  if (!isInternalUser(user)) return [];
  return db
    .select({ slug: ventures.slug, name: ventures.name, color: ventures.color })
    .from(ventures)
    .where(and(eq(ventures.status, "active"), ne(ventures.id, excludeVentureId)))
    .orderBy(asc(ventures.name));
}

export async function listGateItems(
  user: CurrentUser,
  ventureIds: string[],
): Promise<GateItemRow[]> {
  if (!isInternalUser(user) || ventureIds.length === 0) return [];
  return db
    .select({
      ventureId: gateItems.ventureId,
      stage: gateItems.stage,
      label: gateItems.label,
      doneAt: gateItems.doneAt,
      sortOrder: gateItems.sortOrder,
    })
    .from(gateItems)
    .where(inArray(gateItems.ventureId, ventureIds))
    .orderBy(asc(gateItems.sortOrder));
}

export async function listStageEvents(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerStageEvent[]>;
export async function listStageEvents(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerStageEvent[] | FounderStageEvent[]>;
export async function listStageEvents(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerStageEvent[] | FounderStageEvent[]> {
  if (!isInternalUser(user)) return [];
  return db
    .select({
      toStage: ventureStageEvents.toStage,
      createdAt: ventureStageEvents.createdAt,
      reason: ventureStageEvents.reason,
    })
    .from(ventureStageEvents)
    .where(eq(ventureStageEvents.ventureId, ventureId))
    .orderBy(asc(ventureStageEvents.createdAt));
}

export async function listVentureTasks(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerVentureTask[]>;
export async function listVentureTasks(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerVentureTask[] | FounderVentureTask[]>;
export async function listVentureTasks(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerVentureTask[] | FounderVentureTask[]> {
  if (!isInternalUser(user)) return [];
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      lane: tasks.lane,
      status: tasks.status,
      position: tasks.position,
      dueDate: tasks.dueDate,
      originNoteId: tasks.originNoteId,
      assigneeInitials: users.initials,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(and(eq(tasks.ventureId, ventureId), isNull(tasks.archivedAt)))
    .orderBy(asc(tasks.lane), asc(tasks.position));
}

export async function listPipelineTasks(
  user: CurrentUser,
  ventureIds: string[],
): Promise<PipelineTaskRow[]> {
  if (!isInternalUser(user) || ventureIds.length === 0) return [];
  return db
    .select({
      ventureId: tasks.ventureId,
      status: tasks.status,
      dueDate: tasks.dueDate,
    })
    .from(tasks)
    .where(inArray(tasks.ventureId, ventureIds));
}

export async function countEvents(
  user: CurrentUser,
  ventureId: string,
): Promise<number> {
  if (!isInternalUser(user)) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(events)
    .where(and(eq(events.ventureId, ventureId), isNull(events.deletedAt)));
  return row?.n ?? 0;
}
