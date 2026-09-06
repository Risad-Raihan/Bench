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

export function getTestDb() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Never fall back to DATABASE_URL.",
    );
  }
  return drizzle(neon(url), { schema });
}

export async function truncateActivityGraph(
  executor: ReturnType<typeof getTestDb>,
) {
  await executor.execute(
    sql`TRUNCATE TABLE notifications, activity, tasks, ventures, users RESTART IDENTITY CASCADE`,
  );
}

export async function truncateNoteCaptureGraph(
  executor: ReturnType<typeof getTestDb>,
) {
  await executor.execute(
    sql`TRUNCATE TABLE notifications, activity, note_mentions, note_versions, decisions, tasks, notes, ventures, users RESTART IDENTITY CASCADE`,
  );
}

export async function truncateVentureBirthGraph(
  executor: ReturnType<typeof getTestDb>,
) {
  await executor.execute(
    sql`TRUNCATE TABLE notifications, activity, docs, gate_items, venture_stage_events, applications, tasks, ventures, users, stage_templates RESTART IDENTITY CASCADE`,
  );
}

export async function truncateFounderAccessGraph(
  executor: ReturnType<typeof getTestDb>,
) {
  await executor.execute(
    sql`TRUNCATE TABLE notifications, activity, note_mentions, note_versions, task_comments, decisions, docs, notes, tasks, gate_items, venture_stage_events, venture_members, applications, ventures, users RESTART IDENTITY CASCADE`,
  );
}
