"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { markAllRead, markRead } from "@/lib/data/activity";

function revalidateFeeds() {
  revalidatePath("/", "layout");
  revalidatePath("/activity");
  revalidatePath("/my-work");
}

export async function markReadAction(
  notificationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requirePartner();
  try {
    await markRead(user, notificationId);
    revalidateFeeds();
    return { ok: true };
  } catch (err) {
    console.error("[markRead] failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not mark as read.",
    };
  }
}

export async function markAllReadAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const user = await requirePartner();
  try {
    await markAllRead(user);
    revalidateFeeds();
    return { ok: true };
  } catch (err) {
    console.error("[markAllRead] failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not mark all as read.",
    };
  }
}
