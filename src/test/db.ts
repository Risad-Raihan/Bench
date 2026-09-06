/**
 * Test-database helpers. Import only from tests that actually need Postgres.
 *
 * Isolation is truncate-then-seed, not transaction rollback: the Neon HTTP
 * driver has no interactive transactions (see src/test/setup.ts).
 */
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { applyForceIpv4 } from "@/db/force-ipv4";

export function getTestDb() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Never fall back to DATABASE_URL.",
    );
  }
  applyForceIpv4();
  return drizzle(neon(url), { schema });
}

/**
 * Wipe every app table. The DB tests share one Neon branch and each starts
 * with a clean slate — the per-feature helper names below all call this so
 * no test file can leave rows that collide with another's fixtures.
 */
export async function truncateAll(executor: ReturnType<typeof getTestDb>) {
  await executor.execute(
    sql`TRUNCATE TABLE
      notifications, activity, task_comments, tasks,
      note_mentions, note_versions, notes,
      decisions, docs,
      gate_items, venture_stage_events, venture_members,
      calendar_sync_state, events,
      applications, ventures, stage_templates,
      accounts, verification_tokens, users
    RESTART IDENTITY CASCADE`,
  );
}

export const truncateActivityGraph = truncateAll;
export const truncateNoteCaptureGraph = truncateAll;
export const truncateVentureBirthGraph = truncateAll;
export const truncateFounderAccessGraph = truncateAll;
