# Directed-only notifications; activity feed for the rest

## Context

Every mutation writes one `activity` row. `notifications` are fan-out rows per
user with a `read_at`. With four partners, notifying everyone-except-actor on
every action produces ~3 notifications per action and trains everyone to ignore
the badge within a week.

## Decision

**A `notifications` row is written only when an action targets a specific
person.** Broad awareness lives in the **activity feed** (a per-venture tab and a
global feed page), which is a pull surface filtered from `activity` — no
per-user rows.

### Verb → recipient mapping (authoritative — do not re-decide per feature)

| Verb | Recipients (always minus the actor) |
|---|---|
| `assigned` | the new assignee |
| task `moved` / `completed` / `commented` | task assignee + task creator |
| `mentioned` (a venture) | `ventures.owner_id` |
| `decided` on a venture | `ventures.owner_id` |
| gate `cleared` on a venture | `ventures.owner_id` |
| doc `uploaded` on a venture | `ventures.owner_id` |
| application `engaged` / `passed` | **all partners** (the one deliberate fan-out — screening is a consensus action) |

- **Never notify the actor** of their own action.
- **System/derived events** (a venture going stale) write **no** notification —
  that is a board badge, and maybe a future digest.
- `activity.verb` stays `text`; the allowed set is a TypeScript union enforced in
  the write helper. Adding a verb is a code change, no migration.

## Out of scope for v1

- **Email.** In-app badge only, consistent with email wiring being deferred
  everywhere.
- **Founder notifications.** `notifications` is not founder-scoped yet; handled in
  the founder-access work (see `docs/founder-access.md`).
- Auto-mark-read on viewing the target. v1: click a notification marks that one
  read; plus "mark all read".
