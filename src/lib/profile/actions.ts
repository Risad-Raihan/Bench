"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/current-user";
import { isAvatarKey } from "@/lib/avatars";
import { getProfile, updateProfile, type Profile } from "@/lib/data/profile";

export type ProfileActionResult =
  | { ok: true; profile: Profile }
  | { ok: false; error: string };

export async function updateProfileAction(input: {
  name: string;
  avatar: string;
}): Promise<ProfileActionResult> {
  const user = await requireUser();

  const name = input.name.trim();
  if (!name) return { ok: false, error: "A name is required." };
  if (!isAvatarKey(input.avatar)) {
    return { ok: false, error: "Pick an avatar from the set." };
  }

  try {
    const profile =
      (await updateProfile(user.id, { name, avatar: input.avatar })) ??
      (await getProfile(user.id));
    if (!profile) return { ok: false, error: "Could not save your profile." };
    // The avatar shows on the board (owner chip) and across the app bar.
    revalidatePath("/", "layout");
    return { ok: true, profile };
  } catch (err) {
    console.error("[updateProfile] failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save your profile.",
    };
  }
}
