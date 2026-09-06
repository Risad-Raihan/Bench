/**
 * Pure. True when moving backward, or leaving the current stage with gates
 * still open. A clean forward move does not need a reason.
 */
import { stageIndex, type Stage } from "@/lib/pipeline-stages";

export function reasonRequired(
  fromStage: Stage,
  toStage: Stage,
  openGateCount: number,
): boolean {
  if (fromStage === toStage) return false;
  const from = stageIndex(fromStage);
  const to = stageIndex(toStage);
  if (from < 0 || to < 0) return true;
  if (to < from) return true;
  return openGateCount > 0;
}
