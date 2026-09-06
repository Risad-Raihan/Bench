/**
 * Stage moves with immutable history. Inserts a venture_stage_events
 * row, never updates one. Re-entry reuses existing gate items.
 */
import { recordActivity } from "@/lib/data/activity";
import {
  countOpenGates,
  getVentureById,
  hasGateItemsForStage,
  insertGateItemsForVenture,
  insertStageEvent,
  listActiveGateTemplates,
  updateVentureStage,
  type Executor,
} from "@/lib/data/ventures";
import {
  isStage,
  type Stage,
} from "@/lib/pipeline-stages";
import { reasonRequired } from "@/lib/stages/reason";

export type MoveStageInput = {
  ventureId: string;
  toStage: Stage;
  reason?: string | null;
  actorId: string;
};

export { reasonRequired } from "@/lib/stages/reason";

export async function seedGatesForStage(
  ventureId: string,
  stage: Stage,
  executor?: Executor,
): Promise<void> {
  if (await hasGateItemsForStage(ventureId, stage, executor)) return;
  const templates = await listActiveGateTemplates(stage, executor);
  await insertGateItemsForVenture(
    { ventureId, stage, templates },
    executor,
  );
}

export async function moveStage(
  input: MoveStageInput,
  executor?: Executor,
) {
  if (!isStage(input.toStage)) {
    throw new Error("invalid stage");
  }

  const venture = await getVentureById(input.ventureId, executor);
  if (!venture) throw new Error("venture not found");
  if (venture.stage === input.toStage) return venture;

  const openGateCount = await countOpenGates(
    input.ventureId,
    venture.stage,
    executor,
  );
  const reason = input.reason?.trim() || null;
  if (reasonRequired(venture.stage, input.toStage, openGateCount) && !reason) {
    throw new Error("reason is required");
  }

  const stageEnteredAt = new Date();

  await insertStageEvent(
    {
      ventureId: input.ventureId,
      fromStage: venture.stage,
      toStage: input.toStage,
      actorId: input.actorId,
      reason,
    },
    executor,
  );

  await updateVentureStage(
    input.ventureId,
    { stage: input.toStage, stageEnteredAt },
    executor,
  );

  await seedGatesForStage(input.ventureId, input.toStage, executor);

  await recordActivity(
    {
      verb: "updated",
      entity: "venture",
      entityId: input.ventureId,
      ventureId: input.ventureId,
      actorId: input.actorId,
      payload: {
        fromStage: venture.stage,
        toStage: input.toStage,
        reason,
      },
    },
    executor,
  );

  return { ...venture, stage: input.toStage, stageEnteredAt };
}
