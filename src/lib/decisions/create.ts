/**
 * Create a decision row. `decided_by` / `decided_at` freeze here — later
 * title edits must not touch them (CONTEXT.md).
 */
import { recordActivity } from "@/lib/data/activity";
import {
  insertDecision,
  type Executor,
} from "@/lib/data/decisions";

export type CreateDecisionInput = {
  ventureId?: string | null;
  title?: string;
  rationale?: string | null;
  sourceNoteId?: string | null;
};

export async function createDecision(
  input: CreateDecisionInput,
  opts: { actorId: string; executor?: Executor },
) {
  const title = input.title?.trim() || "Untitled";
  const row = await insertDecision(
    {
      ventureId: input.ventureId ?? null,
      title,
      rationale: input.rationale ?? null,
      decidedBy: opts.actorId,
      sourceNoteId: input.sourceNoteId ?? null,
    },
    opts.executor,
  );

  await recordActivity(
    {
      verb: "decided",
      entity: "decision",
      entityId: row.id,
      ventureId: input.ventureId ?? null,
      actorId: opts.actorId,
    },
    opts.executor,
  );

  return row;
}
