# TipTap (headless) for the note editor

## Context

Notes need a block editor with a slash menu, an embedded task block, and
`@venture` mentions. The two candidates were BlockNote and TipTap. `CLAUDE.md`
forbids installing a UI library, and the design system ships its own note chrome
(`SlashMenu`, `NoteBlock`, `TaskBlock`, `MetaRail`) as the visual ground truth.

## Decision

Use **TipTap** (headless ProseMirror). BlockNote bundles a Mantine-based UI and
its own CSS — installing it violates the no-UI-library rule and would mean
fighting its styles to match Bench.

- The `/task` block is a custom TipTap node `{ type: "task", attrs: { taskId } }`
  with a React NodeView that renders the design-system `<TaskBlock>` and resolves
  the live `tasks` row at render time. The note JSON never stores task text
  (model rule).
- `notes.plain_text` = `editor.getText()`, written in the same transaction as
  `notes.content`.
- The slash menu is the design-system `<SlashMenu>` wired to a ProseMirror
  suggestion plugin.

## Consequences

- **Lock-in on the document JSON.** `notes.content` and every `note_versions`
  snapshot are ProseMirror/TipTap JSON. Pin the TipTap major version. A future
  editor swap, or a breaking ProseMirror schema change (e.g. renaming the task
  node), requires a document-migration pass over `notes` **and** `note_versions`.
- All editor UI (drag handles, toolbar, slash menu, mention popup) is hand-built
  on design-system primitives. More wiring up front; zero style conflict.

## Out of scope

**Real-time collaborative editing (Yjs/CRDT) is not built.** Autosave is
last-write-wins on `notes.content` (2s debounce + blur flush + a
`navigator.sendBeacon` flush to `/api/notes/[id]/flush` on tab close). Two
partners editing one note during a call can clobber each other; `note_versions`
snapshots ("blur OR every 5 min") are the recovery path, and a "last edited by X
· just now" indicator makes a clobber visible. Revisit only if this actually
bites.
