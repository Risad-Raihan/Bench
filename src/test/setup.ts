/**
 * Vitest setup — loaded before every test file (see vitest.config.ts).
 *
 * ## Test database strategy
 *
 * Pure helpers (the default) never touch the database. Modules that write
 * rows are tested against a **real** Postgres database — the same way
 * `createVentureFromApplication` is meant to be exercised end to end — not
 * against a mocked Drizzle client.
 *
 * Isolation is **seeded + truncated per test**, not transaction rollback:
 * the Neon HTTP driver has no interactive transactions (each query is its
 * own round-trip; see `src/lib/intake/promote.ts`). A rollback strategy
 * would silently do nothing.
 *
 * When a DB test lands:
 *
 * 1. Point it at a dedicated database via `TEST_DATABASE_URL`. Never fall
 *    back to `DATABASE_URL` — that is the studio's live/dev instance.
 *    A Neon branch named `test`, or a local Postgres with the same schema,
 *    is the intended backend. Apply migrations the same way as prod
 *    (`db:generate` then the SQL via Neon MCP); do not `db:push`.
 * 2. At the start of each DB test (or in a `beforeEach` the test file
 *    opts into), `TRUNCATE … RESTART IDENTITY CASCADE` every app table,
 *    then insert only the rows that test needs. Do not reuse
 *    `src/db/seed.ts` — that script is the six-venture studio demo, not a
 *    test fixture.
 * 3. Assert through the module's public interface (returned value, or a
 *    follow-up read of the rows that module is responsible for). Do not
 *    spy on internal helpers or assert call sequences.
 *
 * Helpers for (2) belong in `src/test/db.ts` next to this file, imported
 * only by tests that actually need a database. They are not here yet
 * because no DB test exists.
 */

export {};
