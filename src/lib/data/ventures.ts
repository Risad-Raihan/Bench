/**
 * Founder-reachable venture reads. Pages never touch `db` for these rows
 * (ADR-0006). Partners see the full row; founders are scoped to
 * `ventureIds` and never receive partner-only fields.
 */
import { and, asc, count, eq, inArray, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  events,
  gateItems,
  stageTemplates,
  tasks,
  users,
  ventureStageEvents,
  ventures,
  type potential,
  type ventureStage,
  type ventureStatus,
} from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";
import { canSeeVenture } from "@/lib/data/scope";
import type { Lane, TaskStatus } from "@/lib/lanes";
import type { Stage } from "@/lib/pipeline-stages";

export type Executor = typeof db;

type Potential = (typeof potential.enumValues)[number];
type VentureStatus = (typeof ventureStatus.enumValues)[number];
type StageValue = (typeof ventureStage.enumValues)[number];

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
  id: string;
  ventureId: string;
  stage: Stage;
  label: string;
  doneAt: Date | null;
  doneByInitials: string | null;
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
  description: string | null;
  lane: Lane;
  status: TaskStatus;
  priority: "low" | "normal" | "high";
  position: number;
  dueDate: string | null;
  originNoteId: string | null;
  assigneeId: string | null;
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

const founderVentureColumns = {
  id: ventures.id,
  slug: ventures.slug,
  name: ventures.name,
  oneLiner: ventures.oneLiner,
  color: ventures.color,
  stage: ventures.stage,
  status: ventures.status,
  founderName: ventures.founderName,
  stageEnteredAt: ventures.stageEnteredAt,
  boardPosition: ventures.boardPosition,
};

export async function listVentures(
  user: InternalUser,
  executor?: Executor,
): Promise<PartnerVenture[]>;
export async function listVentures(
  user: CurrentUser,
  executor?: Executor,
): Promise<PartnerVenture[] | FounderVenture[]>;
export async function listVentures(
  user: CurrentUser,
  executor: Executor = db,
): Promise<PartnerVenture[] | FounderVenture[]> {
  if (!isInternalUser(user)) {
    // Founders have no pipeline. The page redirects; this stays empty.
    return [];
  }
  return executor
    .select(partnerVentureColumns)
    .from(ventures)
    .leftJoin(users, eq(ventures.ownerId, users.id))
    .where(eq(ventures.status, "active"));
}

export async function getVenture(
  user: InternalUser,
  slug: string,
  executor?: Executor,
): Promise<PartnerVenture | null>;
export async function getVenture(
  user: CurrentUser,
  slug: string,
  executor?: Executor,
): Promise<PartnerVenture | FounderVenture | null>;
export async function getVenture(
  user: CurrentUser,
  slug: string,
  executor: Executor = db,
): Promise<PartnerVenture | FounderVenture | null> {
  if (!isInternalUser(user)) {
    if (user.ventureIds.length === 0) return null;
    const [row] = await executor
      .select(founderVentureColumns)
      .from(ventures)
      .where(and(eq(ventures.slug, slug), inArray(ventures.id, user.ventureIds)))
      .limit(1);
    return row ?? null;
  }
  const [row] = await executor
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
      id: gateItems.id,
      ventureId: gateItems.ventureId,
      stage: gateItems.stage,
      label: gateItems.label,
      doneAt: gateItems.doneAt,
      doneByInitials: users.initials,
      sortOrder: gateItems.sortOrder,
    })
    .from(gateItems)
    .leftJoin(users, eq(gateItems.doneBy, users.id))
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
  if (!isInternalUser(user)) {
    if (!canSeeVenture(user, ventureId)) return [];
    return db
      .select({
        toStage: ventureStageEvents.toStage,
        createdAt: ventureStageEvents.createdAt,
      })
      .from(ventureStageEvents)
      .where(eq(ventureStageEvents.ventureId, ventureId))
      .orderBy(asc(ventureStageEvents.createdAt));
  }
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
      description: tasks.description,
      lane: tasks.lane,
      status: tasks.status,
      priority: tasks.priority,
      position: tasks.position,
      dueDate: tasks.dueDate,
      originNoteId: tasks.originNoteId,
      assigneeId: tasks.assigneeId,
      assigneeInitials: users.initials,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(and(eq(tasks.ventureId, ventureId), isNull(tasks.archivedAt)))
    .orderBy(asc(tasks.lane), asc(tasks.status), asc(tasks.position));
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

export async function listUsedVentureColors(
  executor: Executor = db,
): Promise<(string | null)[]> {
  const rows = await executor
    .select({ color: ventures.color })
    .from(ventures)
    .where(eq(ventures.status, "active"));
  return rows.map((row) => row.color);
}

export async function isSlugTaken(
  slug: string,
  executor: Executor = db,
): Promise<boolean> {
  const existing = await executor
    .select({ id: ventures.id })
    .from(ventures)
    .where(eq(ventures.slug, slug))
    .limit(1);
  return existing.length > 0;
}

export type InsertVentureValues = {
  slug: string;
  name: string;
  oneLiner: string | null;
  market: string | null;
  stage: StageValue;
  status: VentureStatus;
  color: string;
  founderName: string | null;
  founderEmail: string | null;
  potential: Potential | null;
  ownerId: string | null;
  createdBy: string | null;
};

export async function insertVenture(
  values: InsertVentureValues,
  executor: Executor = db,
) {
  const [row] = await executor.insert(ventures).values(values).returning();
  if (!row) throw new Error("venture insert returned no row");
  return row;
}

export async function insertBirthStageEvent(
  values: {
    ventureId: string;
    actorId: string | null;
  },
  executor: Executor = db,
) {
  await executor.insert(ventureStageEvents).values({
    ventureId: values.ventureId,
    fromStage: null,
    toStage: "meet",
    actorId: values.actorId,
  });
}

export async function listActiveGateTemplates(
  stage: StageValue,
  executor: Executor = db,
) {
  const rows = await executor
    .select()
    .from(stageTemplates)
    .where(
      and(
        eq(stageTemplates.stage, stage),
        eq(stageTemplates.kind, "gate"),
        eq(stageTemplates.isActive, true),
      ),
    );
  return rows.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function insertGateItemsForVenture(
  values: {
    ventureId: string;
    stage: StageValue;
    templates: { label: string; sortOrder: number }[];
  },
  executor: Executor = db,
) {
  if (values.templates.length === 0) return;
  await executor.insert(gateItems).values(
    values.templates.map((t) => ({
      ventureId: values.ventureId,
      stage: values.stage,
      label: t.label,
      sortOrder: t.sortOrder,
    })),
  );
}

export async function getVentureById(
  ventureId: string,
  executor?: Executor,
) {
  const run = executor ?? db;
  const [row] = await run
    .select()
    .from(ventures)
    .where(eq(ventures.id, ventureId))
    .limit(1);
  return row ?? null;
}

export async function countOpenGates(
  ventureId: string,
  stage: StageValue,
  executor?: Executor,
): Promise<number> {
  const run = executor ?? db;
  const [row] = await run
    .select({ n: count() })
    .from(gateItems)
    .where(
      and(
        eq(gateItems.ventureId, ventureId),
        eq(gateItems.stage, stage),
        isNull(gateItems.doneAt),
      ),
    );
  return row?.n ?? 0;
}

export async function hasGateItemsForStage(
  ventureId: string,
  stage: StageValue,
  executor?: Executor,
): Promise<boolean> {
  const run = executor ?? db;
  const [row] = await run
    .select({ id: gateItems.id })
    .from(gateItems)
    .where(and(eq(gateItems.ventureId, ventureId), eq(gateItems.stage, stage)))
    .limit(1);
  return row != null;
}

export async function insertStageEvent(
  values: {
    ventureId: string;
    fromStage: StageValue | null;
    toStage: StageValue;
    actorId: string | null;
    reason?: string | null;
  },
  executor?: Executor,
) {
  const run = executor ?? db;
  await run.insert(ventureStageEvents).values({
    ventureId: values.ventureId,
    fromStage: values.fromStage,
    toStage: values.toStage,
    actorId: values.actorId,
    reason: values.reason ?? null,
  });
}

export async function updateVentureStage(
  ventureId: string,
  values: { stage: StageValue; stageEnteredAt: Date },
  executor?: Executor,
) {
  const run = executor ?? db;
  await run
    .update(ventures)
    .set({
      stage: values.stage,
      stageEnteredAt: values.stageEnteredAt,
    })
    .where(eq(ventures.id, ventureId));
}

export async function getGateItem(id: string, executor?: Executor) {
  const run = executor ?? db;
  const [row] = await run
    .select()
    .from(gateItems)
    .where(eq(gateItems.id, id))
    .limit(1);
  return row ?? null;
}

export async function setGateCleared(
  id: string,
  values: { doneAt: Date | null; doneBy: string | null },
  executor?: Executor,
) {
  const run = executor ?? db;
  const [row] = await run
    .update(gateItems)
    .set({ doneAt: values.doneAt, doneBy: values.doneBy })
    .where(eq(gateItems.id, id))
    .returning();
  return row ?? null;
}
