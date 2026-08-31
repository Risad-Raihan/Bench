# All docs are private Blob, served through one authorized download route

## Context

Docs (`docs` table) carry a row-level `visibility` (`studio` | `shared`) that
gates founder access. If a doc's bytes live at a public Vercel Blob URL, that
gate is meaningless — a `studio` doc is one forwarded link away from a founder or
anyone else. Pitch decks and data-room files are confidential.

## Decision

- **Every doc blob is `access: "private"`** — the in-app uploads and the intake
  pitch deck alike. No exceptions, so there is exactly one code path to reason
  about.
- **Download** goes through a route that checks session role + the doc's
  `visibility` + venture membership, then issues a short-lived signed URL. No
  blob URL is ever handed to the client directly.
- **In-app upload** uses `@vercel/blob/client` `upload()`. The token-mint route's
  `onBeforeGenerateToken` checks the caller is a partner who may write to the
  target venture. `ventureId`, `folder`, `visibility`, `uploaderId` go into
  `tokenPayload` at mint time; `onUploadCompleted` reads them back to write the
  `docs` row. Client-supplied metadata in the completion callback is not trusted.
- **Intake deck** (`/api/intake`) stays a server-side multipart write (it is a
  machine-to-machine POST with no browser), but writes a private blob.

## Consequences

- `onUploadCompleted` does not fire on `localhost` (Vercel can't call back to a
  dev machine), so local dev needs a tunnel or a dev-only client-side fallback
  that writes the `docs` row after upload. Known gotcha, not a bug.
- Orphan blobs (tab closed before the callback writes the row) are accepted for
  now; a reconciliation sweep is future work.
