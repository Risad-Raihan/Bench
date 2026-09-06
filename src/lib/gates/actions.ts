"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { toggleGate } from "@/lib/gates/toggle";

export type GateActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function toggleGateAction(input: {
  gateItemId: string;
  slug: string;
}): Promise<GateActionResult> {
  const user = await requirePartner();
  try {
    await toggleGate(input.gateItemId, user);
    revalidatePath("/");
    revalidatePath(`/v/${input.slug}`);
    return { ok: true };
  } catch (err) {
    console.error("[toggleGate] failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update the gate.",
    };
  }
}
