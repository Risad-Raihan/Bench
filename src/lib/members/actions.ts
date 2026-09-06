"use server";

import { revalidatePath } from "next/cache";
import { requirePartner } from "@/lib/auth/current-user";
import { requestMagicLink } from "@/lib/auth/send-magic-link";
import {
  disableVentureMember,
  listVentureAccess,
} from "@/lib/data/members";
import { provisionFounderAccess } from "@/lib/intake/provision-founder";

export type MemberActionResult =
  | { ok: true }
  | { ok: false; error: string };

function fail(err: unknown, label: string): MemberActionResult {
  console.error(`[${label}] failed`, err);
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Could not update access.",
  };
}

export async function inviteMemberAction(input: {
  ventureId: string;
  slug: string;
  name: string;
  email: string;
  memberRole: "founder" | "collaborator";
}): Promise<MemberActionResult> {
  const user = await requirePartner();
  const name = input.name.trim();
  const email = input.email.trim();
  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }
  try {
    await provisionFounderAccess(
      input.ventureId,
      { name, email },
      user.id,
      { memberRole: input.memberRole },
    );
    revalidatePath(`/v/${input.slug}`);
    return { ok: true };
  } catch (err) {
    return fail(err, "inviteMember");
  }
}

export async function resendMemberLinkAction(input: {
  ventureId: string;
  slug: string;
  userId: string;
}): Promise<MemberActionResult> {
  const user = await requirePartner();
  try {
    const members = await listVentureAccess(user, input.ventureId);
    const member = members.find((m) => m.userId === input.userId);
    if (!member) return { ok: false, error: "Member not found." };
    if (member.status === "disabled") {
      return { ok: false, error: "This access is disabled." };
    }
    await requestMagicLink(member.email);
    revalidatePath(`/v/${input.slug}`);
    return { ok: true };
  } catch (err) {
    return fail(err, "resendMemberLink");
  }
}

export async function disableMemberAction(input: {
  ventureId: string;
  slug: string;
  userId: string;
}): Promise<MemberActionResult> {
  const user = await requirePartner();
  try {
    const row = await disableVentureMember(user, {
      ventureId: input.ventureId,
      userId: input.userId,
    });
    if (!row) return { ok: false, error: "Member not found." };
    revalidatePath(`/v/${input.slug}`);
    return { ok: true };
  } catch (err) {
    return fail(err, "disableMember");
  }
}
