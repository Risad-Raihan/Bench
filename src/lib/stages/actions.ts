"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { isStage, type Stage } from "@/lib/pipeline-stages";
import { moveStage } from "@/lib/stages/move";

export type StageActionResult =
  | { ok: true }
  | { ok: false; error: string };

function fail(err: unknown, label: string): StageActionResult {
  console.error(`[${label}] failed`, err);
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Could not move the venture.",
  };
}

export async function moveStageAction(input: {
  ventureId: string;
  slug: string;
  toStage: Stage;
  reason?: string | null;
}): Promise<StageActionResult> {
  const user = await requirePartner();
  if (!isStage(input.toStage)) {
    return { ok: false, error: "invalid stage" };
  }
  try {
    await moveStage({
      ventureId: input.ventureId,
      toStage: input.toStage,
      reason: input.reason,
      actorId: user.id,
    });
    revalidatePath("/");
    revalidatePath(`/v/${input.slug}`);
    return { ok: true };
  } catch (err) {
    return fail(err, "moveStage");
  }
}
