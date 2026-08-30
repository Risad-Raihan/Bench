# Founder-scoped access — what still needs building

A **founder** is an external `users` row (`role = "founder"`) linked to exactly
one venture through `venture_members`. The schema and two helpers now exist:

- `src/lib/intake/provision-founder.ts` — `provisionFounderAccess(ventureId, {name, email}, actorId)`
  creates the user + membership. **Not wired to any UI.**
- `venture_members` join table, `visibility` enum (`studio` | `shared`) on
  `notes`, `docs` and `decisions`.

What does **not** exist yet: any enforcement. Today every query assumes an
internal partner. Before a founder login is safe to hand out, all of the
following must be done.

## 1. Real session

`src/lib/current-user.ts` is a hardcoded email constant. It must become a real
session (NextAuth) that resolves `{ id, role }`. Every access decision below
branches on `role === "founder"`.

## 2. Which venture(s) can this user see

For a founder, the visible venture set is
`SELECT venture_id FROM venture_members WHERE user_id = $me`.
A founder hitting any other venture's page or API must get 404 (not 403 — do
not confirm the venture exists).

## 3. Screens to hide entirely from founders

- **Pipeline board** (`/`, `PipelineView`) — the cross-venture board. Founders
  have no pipeline; redirect them straight to their venture page.
- **My Work** (`/my-work`) — cross-venture task aggregation.
- **Notes / Docs / Decisions / Calendar** index pages (`/notes`, `/docs`,
  `/decisions`, `/calendar`) — all cross-venture. A founder only ever sees
  content scoped to their venture page.
- Any "all ventures" navigation, search, or picker.

## 4. Fields to strip from the venture page for founders

On `VentureView` and its API:

- `equityPct` — never show a founder the studio's equity number.
- `potential` (`low`/`medium`/`high`) — internal assessment.
- `ownerId` / internal partner assignment, internal `lane` breakdowns if they
  leak partner workload.
- Internal-only stage reasoning in `venture_stage_events.reason`.
- `applications` data / the raw intake payload.

## 5. Row-level `visibility` filtering

Every read of `notes`, `docs` and `decisions` for a founder must add
`WHERE visibility = 'shared'`. Default is `'studio'`, so nothing leaks unless a
partner explicitly shares it. Places to patch:

- venture page notes list, doc list, decision list
- note-by-id and doc-by-id fetches (a founder guessing an id must get 404)
- full-text note search
- gate item `evidence` links that point at a studio-only note/doc

## 6. Tasks

Decide the product rule: do founders see the venture task board at all? If yes,
it likely needs its own `visibility`-style gate (not in schema yet) or a
"founder-visible" lane filter. If no, hide the Tasks tab for founders.

## 7. Activity & notifications

- `activity` and `notifications` queries must be scoped to the founder's
  venture and must exclude verbs/entities that reveal internal action
  (equity changes, potential changes, pass decisions, internal notes).
- Founder-facing activity should probably be an allow-list of verbs, not a
  deny-list.

## 8. Writes

Define what a founder may create/edit (probably: shared notes on their own
venture, comments, doc uploads). Everything else is read-only. Every mutation
endpoint needs the same venture-scope + role check.

## 9. Provisioning UI

A partner-facing "Invite founder" button on the venture page that calls
`provisionFounderAccess` and triggers the invite email (email wiring is also
still a TODO in that helper).
