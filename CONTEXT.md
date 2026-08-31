# Bench

Internal work management tool for Apon Venture Lab (AVL). A dense operator
tool for the four partners to run the venture pipeline, plus a narrow
read-mostly surface for the founders of individual ventures.

## Language

### People

**Partner**:
One of the four internal AVL staff. `users.role` in (`partner`, `admin`,
`viewer`). Signs in with a Google Workspace account on the `aponvlab.io`
domain. Sees everything: the whole pipeline, every venture, cross-venture
My Work.
_Avoid_: staff, team member, internal user (use "partner" for the person,
"internal" only as an adjective for data — e.g. "internal-only note")

**Founder**:
The external owner of a single venture's page. `users.role = "founder"`,
linked to exactly one **Venture** through `venture_members` with
`venture_member_role = "founder"`. Signs in with a magic link sent to any
email address. Sees only their own venture's **shared** content.
_Avoid_: client, customer, external user

**Collaborator**:
Someone a **Founder** invites onto their venture (co-founder, advisor).
`venture_member_role = "collaborator"`. Same access scope as the founder,
different label.
_Avoid_: guest, member

**Soft invariant — one founder, one venture**: a **Founder** is linked to
exactly one **Venture**. `venture_members` physically allows many-to-many;
this is enforced in application code only, as a deliberate simplification.
Relaxing it later is a UI change (founder-facing venture picker), not a
migration.

### Access

**Provision** (a founder):
The partner-initiated act of creating a **Founder** `users` row and its
`venture_members` link, then sending the first magic-link invite. Nothing
about a founder exists until a partner provisions them — there is no open
sign-up.

**Shared** vs **Studio**:
Row-level `visibility` on notes, docs and decisions. `studio` (the default)
means partners only. `shared` is an explicit opt-in that makes the row
visible to that venture's founder and collaborators.
_Avoid_: public/private, internal/external (for rows — say studio/shared)

### Pipeline

**Venture**:
The top-level object. A company AVL is building or backing. Moves through
five **Stages**.

**Hard invariant — ventures are never hard-deleted**: a **Venture** is only
ever soft-archived (`archived_at`, `status = "archived"`). No code path
issues `DELETE FROM ventures`. Several child tables (`decisions`,
`venture_stage_events`, `activity`) use `onDelete: "cascade"` and rely on
this — if a hard-delete path is ever added, those must move to `set null`
first.

**Stage**:
One of `meet`, `validate`, `build`, `form`, `grow`. Mirrors the public
process on aponvlab.io. A venture is in exactly one stage; changing it
inserts an immutable `venture_stage_events` row.
_Avoid_: phase, step, status (status is a separate axis: active/passed/paused/archived)

**Stale**:
One rule, 14 days, applied to two things: a **Venture**'s time in its current
**Stage** (`stage_entered_at`), and an unresolved **Application**'s age
(`created_at` while `status` in `new`/`reviewing`). Surfaces as a flag on the
board card. Not an error state — just "look at this".

**Gate**:
A checklist item (`gate_items`) that tracks a venture's readiness to leave a
**Stage**. Seeded from `stage_templates` on first entry to that stage (re-entry
reuses the existing rows, including any already cleared). Clearing gates is
**not system-enforced** — a partner can move a venture with gates open, but the
move `reason` becomes required. The board card shows "4/6 gates". Partner-only:
founders never see gates.
_Avoid_: criteria, requirement, milestone

**Lane**:
The functional area a task belongs to: `thesis`, `tech`, `gtm`, `capital`.
Roughly maps to partner function. Every task has one; it is required at
creation (no default). `ops` is a dead enum value — kept because dropping a
Postgres enum value means recreating the type, but nothing uses it and it
has no board column.
_Avoid_: category, swimlane, track

**Application**:
An inbound submission from the aponvlab.io Apply form, landing via
`POST /api/intake` as an `applications` row. It is **not** a **Venture** and
never sits in a **Stage**. It lives in the intake queue (`status` in
`new`, `reviewing`) which the board renders as a sixth column beside the
five real stage columns. The row is kept forever, engaged or passed.
_Avoid_: lead, submission, inquiry

**Engage** (an application):
The partner decision to take an **Application** forward. Runs
`createVentureFromApplication` — the one and only path that turns an
application into a **Venture** (born in `meet`). Sets
`applications.status = 'approved'` and links `applications.venture_id`.
_Avoid_: promote, approve, accept, convert

**Pass** (on an application):
The partner decision to decline an **Application**. Sets
`applications.status = 'passed'`; the card leaves the intake column. No
venture is ever created. Spam never becomes a venture.
_Avoid_: reject, decline, archive

**Decision**:
A `decisions` row — one line, optional rationale. Created via the `/decision`
slash command in a note (like `/task`, the row is created immediately, not on
save). `decided_by` / `decided_at` freeze at creation and record who made the
call, not who last edited. Freely editable by any partner, not versioned.
_Avoid_: choice, resolution, call

**Mention** (`@venture`):
A reference to a **Venture** placed inside any note. Diffed against
`note_mentions` on autosave. Makes the note appear on that venture's Notes
tab under a "Mentioned" grouping — distinct from notes *owned* by the venture
(`notes.venture_id`). A mention does not change the note's `visibility`.
_Avoid_: tag, link, reference

**Screen**:
The public (aponvlab.io) name for AVL's initial fit decision on inbound
interest. Internally this is the intake queue plus the `meet` stage — there
is no `screen` value in `venture_stage`.

## Flagged ambiguities

**Pinned note**: the UI term is **Pinned** everywhere. The schema column is
`notes.is_favorite` (not renamed — a rename is not worth a migration). Same
thing; say "Pinned".

**"Screen"**: public (aponvlab.io) vocabulary for the initial fit decision.
Has no `venture_stage` value. Internally = the intake queue + `meet` stage.

## Example dialogue

**Dev**: When a partner hits "New Venture", is that the same as promoting an application?

**Domain expert**: Same result — a venture in Meet with gates seeded — but two entry
points. Promotion starts from an Application row; New Venture is the manual
sibling with no Application behind it. Both must go through one code path.

**Dev**: And a founder can see that new venture straight away?

**Domain expert**: Only once a partner provisions them onto it, and only the shared
rows. A freshly created venture has no founder and nothing shared, so there's
nothing for a founder to see yet.
