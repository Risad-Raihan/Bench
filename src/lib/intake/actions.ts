"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { passApplication } from "@/lib/intake/pass";
import { createVentureFromApplication } from "@/lib/intake/promote";

export type EngageResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type PassResult = { ok: true } | { ok: false; error: string };

export async function engageApplicationAction(
  applicationId: string,
): Promise<EngageResult> {
  const user = await requirePartner();
  try {
    const venture = await createVentureFromApplication(applicationId, {
      actorId: user.id,
    });
    revalidatePath("/");
    revalidatePath(`/v/${venture.slug}`);
    return { ok: true, slug: venture.slug };
  } catch (err) {
    console.error("[engage] failed", err);
    return { ok: false, error: "Could not engage this application." };
  }
}

export async function passApplicationAction(
  applicationId: string,
): Promise<PassResult> {
  const user = await requirePartner();
  try {
    await passApplication(applicationId, { actorId: user.id });
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[pass] failed", err);
    return { ok: false, error: "Could not pass this application." };
  }
}
