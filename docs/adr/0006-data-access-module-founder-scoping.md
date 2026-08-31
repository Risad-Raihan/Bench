# Founder scoping lives in a data-access module, enforced by a lint rule

## Context

Founders are external users who may see exactly one venture and only its
`shared` rows (see `docs/founder-access.md`). The naive implementation —
a `role === "founder"` branch in every list query — spreads the security
boundary across 15+ call sites. One forgotten branch ships a leak.

## Decision

**All reads and writes of founder-reachable entities go through
`src/lib/data/{ventures,notes,docs,decisions,activity}.ts`.** Pages and server
actions never touch `db` directly for these entities.

- Every function takes `CurrentUser = { id, role, ventureIds: string[] }`,
  resolved once per request from the session. Partners bypass scoping; founders
  are restricted to `ventureIds`.
- Founder reads outside scope, or of a `studio` row, return **404, not 403** —
  never confirm a venture / note / doc exists.
- Founder-shaped return types **do not carry** `equityPct`, `potential`,
  `ownerId`, internal `lane` breakdowns, `venture_stage_events.reason`, or raw
  intake payload — a component physically cannot render them.
- **Mutations are gated the same way.** A founder may write only: comments on
  their venture, edits to `shared` notes on their venture, doc uploads to their
  venture. Every mutation re-checks `venture_members`. Everything else is
  read-only for founders.
- **System context** (`/api/intake`, `promote.ts`, `seed.ts`) has no user and
  keeps direct `db` access, explicitly allowlisted.

## Enforcement

A lint rule (`no-restricted-imports` on `@/db`) fails any import of `@/db`
outside `src/lib/data/**`, `src/db/**`, `drizzle/**`, `src/db/seed.ts`, and the
allowlisted system paths (`src/app/api/intake/**`, `src/lib/intake/**`). Without
the rule the module is theatre — someone writes a raw `db.select()` in a page in
six months and the leak is back.

## Verification

A real integration test, not a manual check: seeded founder → pipeline board
404, other venture 404, `equityPct` absent from the venture payload, `studio`
note 404, `shared` note 200.

## Considered alternatives

- **Postgres RLS** — rejected: fiddly with the Neon HTTP driver (per-query
  session vars, no connection affinity), and it wouldn't cover field stripping.
