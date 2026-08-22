# Bench — UI kit

A click-through recreation of the five locked v1 screens. Open `index.html`.

| File | Surface |
|---|---|
| `PipelineScreen.jsx` | Level 1 home — five stage columns, six ventures, KPI header, stat strip |
| `VentureScreen.jsx` | Level 2 — dimmed app nav, back strip, gradient venture header, gate rail, tabs, four-lane task board |
| `NotesScreen.jsx` | Note editor — sidebar (Pinned / By venture / Unfiled), hover-revealed blocks, live task rows, slash menu, metadata rail |
| `MyWorkScreen.jsx` | Cross-venture task list, grouped by when, copper filter chips |
| `CalendarScreen.jsx` | Mon–Fri week, venture-coloured events, two-way Google sync bar |
| `App.jsx` | Router: Pipeline ⇄ venture, plus the four level-1 views, the ⌘K palette, the new-venture modal and the Tweaks panel |
| `data.jsx` | Single source: ventures + identity colours, docs, notes, stages |
| `OverviewTab.jsx` / `DocsTab.jsx` / `DecisionsTab.jsx` | The three venture tabs, each with Data / Empty / Loading states |
| `NewVentureModal.jsx` / `Palette.jsx` | Onboarding (name, one-liner, founder, colour, deck) and the ⌘K palette |

**What is interactive:** click a venture card to descend a level; back link returns. Venture tabs switch. Note task checkboxes tick (and are the same records the board renders). My work filters and checkboxes work. Calendar scope filters work, and "+ Create note" flips an event to "Note ready".

**Data sources:** every counted thing lives once in `data.jsx` — `ventures`, `docs`, `notes`, `stages`. Tab counts, the docs folder rail and the notes sidebar all derive from those arrays, so a number cannot drift from the rows beneath it.
