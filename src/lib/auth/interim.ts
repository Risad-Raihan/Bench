import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { PARTNERS, isAllowlistedPartner, normalizeEmail } from "./partners";

/**
 * INTERIM sign-in — email + password for the four partners, until the Google
 * OAuth client is available (ADR-0001, S2). This is a stopgap: delete this
 * file, the branch in `src/auth.ts`, and the `INTERIM_*` env vars once Google
 * login is verified.
 *
 * Enabled only when `INTERIM_AUTH=1` and `INTERIM_PARTNER_HASHES` is set.
 * `INTERIM_PARTNER_HASHES` is JSON: `{ "<email>": "<saltHex>:<scryptHex>" }`,
 * one entry per partner. Each value is produced by `hashInterimPassword()`.
 */

const KEY_LEN = 32;

export function interimAuthEnabled(): boolean {
  return (
    process.env.INTERIM_AUTH === "1" && Boolean(process.env.INTERIM_PARTNER_HASHES)
  );
}

/** `saltHex:scryptHex` for a plaintext password. Used by the generator script. */
export function hashInterimPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

function verifyInterimPassword(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LEN) return false;
  const actual = scryptSync(password, salt, KEY_LEN);
  return timingSafeEqual(expected, actual);
}

function loadHashes(): Record<string, string> {
  try {
    const parsed = JSON.parse(process.env.INTERIM_PARTNER_HASHES ?? "{}");
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // fall through
  }
  return {};
}

export function interimCredentialsProvider() {
  const hashes = loadHashes();

  return Credentials({
    id: "interim",
    name: "Partner password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const email = normalizeEmail(String(raw?.email ?? ""));
      const password = String(raw?.password ?? "");
      if (!email || !password) return null;
      if (!isAllowlistedPartner(email)) return null;

      const stored = hashes[email];
      if (!stored || !verifyInterimPassword(password, stored)) return null;

      // Link onto the seeded users row by email, the same way the Google
      // sign-in callback does. A disabled partner is rejected here too.
      const partner = PARTNERS.find((p) => p.email === email)!;
      const [row] = await db
        .insert(users)
        .values({
          email,
          name: partner.name,
          initials: partner.initials,
          role: "partner",
          lastSignInAt: new Date(),
        })
        .onConflictDoUpdate({
          target: users.email,
          set: { lastSignInAt: new Date() },
        })
        .returning({ id: users.id, disabledAt: users.disabledAt });

      if (!row || row.disabledAt) return null;
      return { id: row.id, email };
    },
  });
}
