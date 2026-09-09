/**
 * The signed-in person's own record — read for the app bar and the profile
 * page, written from the profile form. Every user has one (partners and
 * founders both); there is nothing role-gated here.
 */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { resolveAvatar } from "@/lib/avatars";

export type Profile = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  avatar: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      initials: users.initials,
      role: users.role,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials: row.initials,
    role: row.role,
    avatar: resolveAvatar(row.avatarUrl),
  };
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function updateProfile(
  userId: string,
  input: { name: string; avatar: string },
): Promise<Profile | null> {
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new Error("A name is required.");
  await db
    .update(users)
    .set({
      name,
      initials: toInitials(name),
      avatarUrl: resolveAvatar(input.avatar),
    })
    .where(eq(users.id, userId));
  return getProfile(userId);
}
