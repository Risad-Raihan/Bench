# The pipeline board's intake column is backed by `applications`, not `ventures`

## Context

Partners want a single place to review inbound website submissions and either
engage or pass — ideally as a column on the pipeline board, not a separate
screen. The obvious implementation is to add an `application` value to the
`venture_stage` enum and make every submission a venture.

That is rejected. `venture_stage` is documented (`schema.ts`) as mirroring the
public aponvlab.io process exactly ("the site and the tool must agree"), and the
public process has no "Application" step — it starts at the fit decision
("Screen"). The design-system pipeline component also fixes the stage list at
five. And making every submission a `ventures` row lets spam consume slugs and
identity colors.

## Decision

The board renders **six columns**: the five real `venture_stage` columns
(backed by `ventures`) plus one **intake column backed by the `applications`
table** (`status in ('new','reviewing')`).

- `POST /api/intake` only writes the `applications` row. It no longer creates a
  venture.
- **"+ New Venture"** (a partner adding a lead by hand) also writes only an
  `applications` row (`source = 'manual'`, `founder_name` / `founder_email`
  optional, an optional chosen `color` stashed for engage-time). It lands in the
  Application column exactly like a website submission — there is no direct
  partner path to a `ventures` row.
- **Engage** — the Engage button *or* dragging the card onto a real stage
  column — runs `createVentureFromApplication` (still the one and only
  application→venture path) with the engaging partner as `actorId`; venture is
  born in `meet`; `applications.status = 'approved'`, `applications.venture_id`
  linked.
- **Pass** sets `applications.status = 'passed'`; the card leaves the column. No
  venture created.
- Applications have no gates, no `stage_templates` rows, no stage events. "Stale"
  is a computed property of the application row (days since submission while
  unreviewed).

## Consequences

- The board component reads from two sources and must special-case one column.
  This is a deliberate deviation from the design-system pipeline prompt (five
  `ventures`-backed columns) and should be reflected in a design-system note.
- `venture_stage` stays honest — no venture ever sits in a stage the public site
  doesn't show.
