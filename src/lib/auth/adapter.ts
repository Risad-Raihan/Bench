import { and, eq } from "drizzle-orm";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { accounts, users, verificationTokens } from "@/db/schema";
import { initialsFromName } from "@/lib/intake/initials";
import { isAllowlistedPartner, normalizeEmail } from "./partners";

function toAdapterUser(row: typeof users.$inferSelect): AdapterUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: row.emailVerified ?? null,
    image: row.avatarUrl,
  };
}

/**
 * DrizzleAdapter for accounts + verification tokens, with user CRUD mapped onto
 * our `users` table (required `initials` / `role`, `avatar_url` not `image`).
 */
export function createAuthAdapter(): Adapter {
  const base = DrizzleAdapter(db, {
    usersTable: users as never,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  });

  return {
    ...base,
    async createUser(data) {
      const email = normalizeEmail(data.email);
      // Magic-link has no open sign-up (ADR-0001). Google still creates
      // allowlisted partners who are not yet in `users`.
      if (!isAllowlistedPartner(email)) {
        throw new Error("No open sign-up");
      }
      const name = data.name?.trim() || email;
      const [row] = await db
        .insert(users)
        .values({
          email,
          name,
          initials: initialsFromName(name),
          avatarUrl: data.image ?? null,
          emailVerified: data.emailVerified,
          role: "partner",
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            name,
            avatarUrl: data.image ?? null,
            emailVerified: data.emailVerified,
          },
        })
        .returning();
      if (!row) throw new Error("Failed to create user");
      return toAdapterUser(row);
    },
    async getUser(id) {
      const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return row ? toAdapterUser(row) : null;
    },
    async getUserByEmail(email) {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizeEmail(email)))
        .limit(1);
      return row ? toAdapterUser(row) : null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const [row] = await db
        .select({ user: users })
        .from(accounts)
        .innerJoin(users, eq(accounts.userId, users.id))
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId),
          ),
        )
        .limit(1);
      return row ? toAdapterUser(row.user) : null;
    },
    async updateUser(data) {
      const patch: Partial<typeof users.$inferInsert> = {};
      if (data.name) patch.name = data.name;
      if (data.email) patch.email = normalizeEmail(data.email);
      if (data.image !== undefined) patch.avatarUrl = data.image ?? undefined;
      if (data.emailVerified !== undefined) patch.emailVerified = data.emailVerified;
      const [row] = await db
        .update(users)
        .set(patch)
        .where(eq(users.id, data.id))
        .returning();
      if (!row) throw new Error("No user found.");
      return toAdapterUser(row);
    },
  };
}
