# Split auth: Google for partners, magic link for founders

## Context

Bench has two user populations with nothing in common. **Partners** (4) are on
the `aponvlab.io` Google Workspace and need Google OAuth regardless of login
preference, because partner calendars sync from Google (`users.google_refresh_token`,
`events`, `calendar_sync_state`). **Founders** are external, on arbitrary email
domains, and must not be forced to have a Google account.

## Decision

Two Auth.js v5 providers, gated by population:

- **Partners** sign in with **Google** (`access_type: "offline"` + calendar
  scopes), restricted by `hd=aponvlab.io` *and* a hardcoded 4-email allowlist
  (`src/lib/auth/partners.ts`) checked in the `signIn` callback. `hd` alone is
  spoofable.
- **Founders** sign in with a **magic link** (Resend). No open sign-up — a
  `users` row + `venture_members` link must already exist, created by a partner
  (see [[provision]] / `provisionFounderAccess`). The step-9 invite email is
  just the first magic link.
- **Sessions are JWT** (`strategy: "jwt"`, `{ userId, role }` only). The Drizzle
  adapter persists `users` / `accounts` / `verification_tokens` (needed for
  magic-link tokens and OAuth account linking) but there is **no `sessions`
  table**.
- `getCurrentUser()` resolves `ventureIds` per-request from `venture_members`
  (not baked into the token, so membership changes take effect immediately) and
  checks `users.disabled_at` as a kill switch — rejected per request, so
  disabling a founder mid-session logs them out, not just blocks new links.
- **Magic-link TTL stays at the Auth.js default (~24h), global to the provider.**
  No per-role TTL (that needs a second provider config for little gain). The
  self-serve "enter email → get a link" form on the sign-in page is the
  **primary** path; the invite email is just the nudge.
- New columns on `users`: `disabled_at timestamptz`, `last_sign_in_at
  timestamptz`. Founder access status is derived: **Invited** = row exists,
  `last_sign_in_at IS NULL`, not disabled; **Active** = `last_sign_in_at` set;
  **Disabled** = `disabled_at` set.
- `sendVerificationRequest` branches copy on `last_sign_in_at IS NULL`
  (first invite: "Welcome to Bench, your venture X is set up") vs a plain
  sign-in link.

## Considered alternatives

- **Magic link for everyone** — rejected: partners need Google OAuth for
  calendar sync anyway, so this would mean two providers for partners.
- **Password + set-password flow for founders** — rejected: strictly more code
  (hashing, reset flow, token table) than magic link for no benefit. The
  "set-password link" comment in `provision-founder.ts` predates this decision.
- **Full Auth.js DB adapter with `sessions` table** — rejected: instant
  server-side revocation isn't worth the per-request session lookup for this
  user count; `disabled_at` covers the one case that matters.

## Consequences

- A disabled founder's existing JWT works until `getCurrentUser()` next runs
  (every request) — effectively immediate given the `disabled_at` check.
- `venture_members` is queried on every authenticated request. It is indexed
  (`venture_members_user_idx`).
