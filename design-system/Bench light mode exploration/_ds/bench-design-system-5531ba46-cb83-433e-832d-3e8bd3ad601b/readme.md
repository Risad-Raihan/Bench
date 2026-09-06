# Bench Design System

**Bench** is the internal work management tool for **Apon Venture Lab (AVL)**, an AI-first venture studio. (It was called AVLHub through v1; the design system is unchanged, only the product name.) Four partners run a pipeline of ventures through five stages — **Meet → Validate → Build → Form → Grow** — and each venture carries its own docs, Notion-style notes, kanban tasks, decisions and a Google-synced calendar.

It is a dense dark operator UI, not a marketing site. Every screen is designed to be read fast by four people who already know the context.

## Sources

| Source | Path | Notes |
|---|---|---|
| v1 design reference | `uploads/avlhub-v1-reference.html` (pre-rename filename) | **Ground truth.** Five locked screens in the "Instrument" direction plus a legend stating the colour meanings and the six system rules. Every token in this system is lifted verbatim from it — no colour, size, spacing value or radius here was invented. |
| Logo | `uploads/avl-logo-final.png` → `assets/avl-logo.png` | Copper **A** / amber **V** / copper **L** wordmark, transparent PNG, 855×293. |

No codebase, Figma file or deck was provided. Nothing outside those two files informed this system.

## Products / surfaces

One product, one surface: **Bench**, a desktop web app at two navigation levels.

1. **Level 1 — the studio.** Pipeline (home), My work, Notes, Calendar, Decisions.
2. **Level 2 — one venture.** Overview, Docs, Notes, Tasks, Calendar, Decisions — each a *filter* on the level-1 pile, never a copy.

## The six system rules

From the reference legend. These govern every screen and every component here.

1. **Two levels, never three.** Pipeline, then a venture. Anything deeper opens in a panel, not a new page.
2. **One pile, filtered views.** A venture's Notes tab is a filter on all notes. Nothing is copied or moved.
3. **Tasks are rows, not text.** A note stores a task id. The board and the note render the same record.
4. **Numbers are mono.** Every figure uses tabular numerals so columns align and nothing jitters.
5. **Hover reveals, never clutters.** Drag handles, add buttons and row actions appear on hover only.
6. **Motion under 150ms.** Staggered entrance on load, small nudges on hover. Nothing bounces.

---

## CONTENT FUNDAMENTALS

**Voice.** Flat, factual, operator-to-operator. It states what is true and stops. No encouragement, no exclamation, no product-marketing verbs ("streamline", "empower", "unlock"). The reference's own prose is the model: *"The screen Rashed and Mufassal open first, and the only one that must load in under a second."*

**Person.** Second person, possessive, for anything belonging to the reader — "**My work**", "**need you**", "Every task assigned to **you** across every venture". Third person with a real first name when it is someone else's view — "**Risad's work**". First-person plural only for studio decisions — "**What we agreed**", "**Who we should not back**", "why **we** passed on the logistics one". Never "we" as the software.

**Casing.** Two registers, and they never mix:
- **Sentence case** for content — titles, task names, note prose, card captions: "Write the Lagos market memo", "Study abroad, Africa".
- **UPPERCASE mono** for every label, status and figure: `6 ACTIVE · 1 STALLED · SYNCED 14:22 +06`, `2D LATE`, `FROM NOTE`, `45% · 4/6`, `GOOGLE CALENDAR · SYNCED 14:22 +06 · TWO WAY`.

Section headings in the app chrome are Title case single words: Pipeline, Docs, Notes, Tasks, Decisions.

**Punctuation.** The middot `·` is the universal separator in mono strings — never a pipe, never a slash, never a comma. The em dash `—` means "no value". The arrow `←` prefixes a back link. `▾` suffixes a switcher. Commas, not colons, in prose subtitles: "Bank reporting agent, BD"; "Deals app, live on Play". Dates are day-month, no year, no ordinal: `24 AUG`, `Cleared 11 Aug`, `Week of 17 August`.

**Brevity.** Captions are 2–5 words. Card titles are a verb phrase under 40 characters: "Scope MVP auth and agent roles", "Draft term sheet, no exclusivity". Counts are bare numerals with a mono lowercase caption underneath: `14` / `open tasks`.

**Empty states carry information, not apology.** "Nothing here yet" in the empty Form column. "Locked" on an unreached gate. Never "No items to display", never an illustration, never a suggestion.

**Numbers and units.** Percentages are bare — `45%`, `31.6`. Durations are compact mono — `19 days in stage`, `STALE 14D`, `9D WAIT`, `2D LATE`. Ratios use a slash — `4/6`, `3 of 6 gates cleared`. Times are 24-hour with the offset — `14:22 +06`, `09:30`.

**Emoji: never.** Not in labels, not in empty states, not in the readme. The only non-alphanumeric glyphs in the product are a small fixed set of unicode marks (see ICONOGRAPHY).

**Vibe.** An instrument, not an assistant. The interface reports; the partners decide.

---

## VISUAL FOUNDATIONS

**Colour.** Warm near-black surfaces — every neutral is red-shifted, never a cool grey. Seven surface steps from `#070605` (page) through `#0d0a09` (app canvas) to `#1b1411` (card hover). Secondary and label ink sit at `--dim` `#9b8d85` and `--faint` `#7d716a` — both raised from their original values so 11px mono labels hold up against the warm black. Five accents, each with exactly one job, per the legend: **copper** `#F26430` primary action / Tech lane / brand mark; **magenta** `#D63A8F` GTM lane / quotes / ImmiClaw; **teal** `#2E9E8F` Capital lane / anything cleared or done; **amber** `#F2A93B` the *only* warning colour, always meaning "look here"; **violet** `#8B5CF6` a task born inside a note / Dikkha; **ash** `#463b36` unfiled, personal, unassigned. Accent is never decorative — if a thing is coloured, the colour is telling you something. Max two background colours per screen.

**Type.** IBM Plex Sans for everything readable, IBM Plex Mono for everything labelled or counted. Display sizes are 600 weight with negative tracking (44 / 33 / 31 / 25 px at −.025 to −.035em). Body is **13–14px, never 16** — note prose 14.5/1.75, rows 13.5, captions 11.5–12.5. **Mono floors at 11px** — no label, tag, filter, micro-figure or event flag goes below it. Hierarchy inside the mono voice is carried by *tracking*, not size: .22em eyebrow, .2em stage label, .18em column head, .16em micro-label, .14em filter, .13em control. All figures are mono with `font-variant-numeric: tabular-nums`.

**Spacing.** Not a 4pt grid — the odd values are intentional and taken from the source: 1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 34, 44, 64. Page headers pad 22px. Cards pad `12px 13px`. Card gap 8px, stack gutter 10px. Document max width 1340px; prose measure 720px; notes sidebar 216px, metadata rail 200px.

**Backgrounds.** Flat colour only. No imagery, no photography, no illustration, no pattern, no texture, no noise. Grid separation is done with 1px gaps, not with borders.

**Separation is a surface step, never a gradient.** Where a region needs to read as distinct — pipeline stage columns, kanban columns, the notes sidebar, the metadata rail, the stat strip — it drops to `--bg2` so every card on it sits one step above at `--panel`. Stage columns follow this rule. A gradient background was considered for the pipeline board and rejected: it would spend the one gradient the system reserves for the venture header, and it does not fix contrast — ink levels and the 11px mono floor do.

**Gradients — exactly one, and it belongs to the venture.** The venture header is the only gradient in Bench. It is **derived from the venture's own identity colour**, not fixed: `linear-gradient(97deg, <colour> 0%, transparent 74%)` at **17% opacity**, with a 2px top rule running `<colour> → transparent`. One hue fading into the warm black, so ImmiClaw's header is magenta, Dikkha's violet, Chhar's teal — the same colour as that venture's card edge, sidebar dot, tabs and events. Two signals in one: *you are inside a venture*, and *which one*. The four-colour studio wash (`--venture-wash`) remains as the fallback when a venture has no colour set. Using either anywhere else breaks the level signal.

**Identity colour is chosen once, at onboarding.** The new-venture modal offers the system's **twelve** identity colours, ordered warm to cool — copper, ember, clay, amber, moss, fern, teal, steel, indigo, violet, plum, magenta — each swatch previewing the real header wash rather than a flat chip. Five of the twelve (`--venture-ember`, `--venture-moss`, `--venture-fern`, `--venture-indigo`, `--venture-plum`) were **added after v1** so twelve concurrent ventures can each read distinctly; they sit in the same mid-saturation band as the originals so none outshouts the amber warning, and they are spaced far enough around the wheel to be told apart at a 3px card edge. A venture never carries a colour outside that set; two ventures sharing one is allowed.

Semantic colour is untouched by the choice: teal still means cleared, amber still means look here, and the gate rail keeps those meanings even on a teal or amber venture. This is the one place where a colour wears two hats, and identity always loses to meaning.

**Borders.** Hairlines only: `1px solid #241a17` at rest, `#33251f` on hover or when raised. Cards additionally carry a **left accent edge** — 3px on a venture card, 2px on a task card, event or quote — in the venture or lane colour. That edge is the identity mechanism; it replaces badges.

**Shadows.** None. The system has exactly one shadow, on the floating slash menu: `0 14px 34px rgba(0,0,0,.6)`. No inner shadows, no glows, no protection gradients. Elevation is expressed by surface step and hairline weight, not by shade.

**Corner radii.** 1px for a lane dot, **2px for essentially everything** (chips, tags, cards, buttons, swatches, checkboxes), 3px for the app frame and the slash menu, 50% only for the sync pulse dot. Nothing is pill-shaped. Nothing is squared off.

**Transparency and blur.** Almost never. Blur appears once — the sticky table of contents in the reference document (`backdrop-filter: blur(10px)` over `rgba(7,6,5,.93)`). Transparency is used only for accent tints (14–17% over the surface) and for the venture-header tags (`rgba(0,0,0,.3)` over the gradient, with a `rgba(255,255,255,.2)` hairline). No frosted panels, no glass.

**Animation.** Entrance: `avl-rise` — 9px up, opacity 0→1, 420ms `cubic-bezier(.2,.7,.3,1)`, staggered +50ms per sibling, load only. State: 130–150ms, and that is a hard ceiling. One infinite animation exists — the 2.2s teal opacity pulse on the live Google-sync dot. **Nothing bounces, nothing scales, nothing springs.**

**Hover states.** Three moves, used in combination: surface steps up (`--panel` → `--panel2`, or transparent → `#120d0b` for rows and note blocks), hairline steps up (`--line` → `--line2`), and a **2px `translateX` nudge** — the only positional motion in the system. Text hovers lift ink one level (`--dim` → `--ink`) or turn copper for links and back-links. Hover also *reveals*: block drag handles, add buttons and row actions are `opacity: 0` at rest.

**Press states.** No dedicated press treatment — no shrink, no darken. Selection is the state that matters, and it is shown structurally: a 2px copper left border plus `--active-row` background on a sidebar item; a copper outline plus `--copper-wash` fill on an active filter chip; a raised box with a 2px accent top edge on an active venture tab; a 1px copper underline on the lit nav item.

**Cards.** Hairline box on `--panel`, 2px radius, accent left edge, no shadow, no gradient. Content order is fixed: title (14.5/600/−.015em) → caption (11.5, `--dim`) → progress rail → footer row pairing the AVL owner chip on the left with the founder's name on the right. **Figures do not go on the pipeline card** — no stake percentage, gate ratio or install count. Progress is carried by the gate rail and the column header track; the numbers live on the venture Overview. An amber `flag` replaces the founder line when something needs attention, since amber always means look here.

**Layout rules.** Fixed 1340px document width, centred. Columns are equal-fraction grids with 1px gaps. The app bar and the level-2 back strip are full-bleed and pinned to the top of the frame; the stat strip and sync bar are full-bleed at the bottom. The notes screen is a fixed three-column grid `216px 1fr 200px`. Nothing floats except the slash menu.

**Imagery vibe.** There is none, by design. The only image asset in the brand is the wordmark, which is warm (copper/amber) on warm black. If imagery is ever added, it must be warm and low-key — no cool blues, no bright whites.

---

## ICONOGRAPHY

**There is no icon set.** The v1 reference ships zero SVGs, zero icon fonts and zero PNG icons, and this system does not add one — inventing a set would put glyphs in consumers' hands that no AVL screen actually uses.

What the product uses instead:

- **Coloured squares as identity.** A 5px, 7px or 8px rounded-1–2px square carries venture identity (sidebar dots, task-row dots, lane dots, breadcrumb dot). This is the workhorse "icon" of the system.
- **Rails and segments.** Progress is drawn as flex rows of 2–3px bars — the five-step stage track, the six-segment gate rail. Never a ring, never a percentage arc.
- **Initial chips.** People are a 19px hairline square holding two mono initials (`RN`, `MS`, `SR`, `RM`) — no avatars, no photos, no generated shapes.
- **The brand mark.** A 19px copper square with a mono bold `A` in `--on-copper`. The full wordmark (`assets/avl-logo.png`) is used at document scale, not in chrome.
- **A small fixed set of unicode glyphs**, and only these: `←` back, `▾` switcher, `✓` completed checkbox, `⌘K` jump, `/` breadcrumb separator, `·` mono separator, `—` no value, `+` add, `⣿` block drag handle, and the slash-menu command glyphs `☑ # ❝ @ ⧉ ⚑`.
- **Emoji: never.**

If a consuming project genuinely needs a line-icon set, use **Lucide** from CDN at 1.5px stroke in `--dim`, sized 14px, and flag it as an addition — it is *not* in the source.

---

## VISUAL ASSETS

- `assets/avl-logo.png` — the AVL wordmark, transparent PNG. Place on `--bg`/`--root` or on solid copper. Never on a light surface.

No other imagery was provided; none was generated.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import` lines only.
- `thumbnail.html` — project tile.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills wrapper.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `borders.css`, `motion.css`, `base.css`.

**`guidelines/`** — 17 specimen cards: Colors (accents, surfaces, ink & hairlines, tints, venture identity), Type (display, body, mono caps, numerals), Spacing (scale, radii, density in use), Brand (logo, app mark, the one gradient, motion, six rules).

> **Note on the runtime namespace.** Components are exposed as `window.AVLHubDesignSystem_5531ba.<Name>` — that string is generated from the project's name and predates the rename to Bench. It is an internal identifier only; nothing user-facing carries it. Renaming the project would re-key it and break every card, so it is deliberately left alone.

**`components/`** — grouped by concern. Every family below has a counterpart in the v1 reference; nothing was added.

| Directory | Components |
|---|---|
| `chrome/` | **AppBar**, **BackStrip**, **PageHeader**, **Kpi**, **StatStrip** |
| `pipeline/` | **VentureCard**, **StageColumn**, **PipelineBoard**, **GateBar**, **WhoChip**, **AddButton** |
| `venture/` | **VentureHeader**, **Tag**, **GateRail**, **VentureTabs** |
| `kanban/` | **Lane**, **KanbanColumn**, **TaskCard** |
| `notes/` | **NoteEditor**, **NoteSidebar**, **SidebarLink**, **NoteBlock**, **NoteQuote**, **TaskBlock**, **SlashMenu**, **MetaRail**, **MetaLink** |
| `work/` | **TaskRow**, **FilterBar**, **GroupHeader** |
| `calendar/` | **EventCard**, **DayColumn**, **WeekGrid**, **SyncBar** |
| `layout/` | **Panel**, **SectionLabel**, **EmptyState**, **Skeleton**, **SkeletonRow** |
| `data/` | **FactRow**, **LinkChip**, **ChecklistRow**, **LaneBarRow**, **LineRow**, **ActivityRow** |
| `docs/` | **FileRow**, **TypeGlyph**, **VersionRow**, **DocsHeaderRow**, **DropZone**, **FolderFilter**, **FolderItem**, **PreviewPanel** |
| `decisions/` | **DecisionRow**, **SourceChip**, **ActionButton** |
| `forms/` | **TextField**, **SwatchPicker**, **Swatch** (+ `VENTURE_COLORS`) |
| `overlay/` | **Modal**, **CommandPalette**, **CommandRow** |

**`explorations/`** — `board-background.html`, the six-option comparison behind the decision above. Option B (column surface step) shipped; the four coloured options were rejected on the one-gradient rule. Kept as the record, not as guidance.

Each directory holds `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one `@dsCard` HTML showing its states.

**`ui_kits/bench/`** — click-through recreation of all five locked screens. See its `README.md`. Open `index.html`.

### Intentional additions

- **`NoteEditor`** — a thin wrapper that assembles the three-column notes layout from `NoteSidebar` + document body + `MetaRail`. The reference defines the layout but not a named component; this saves every consumer re-deriving `216px 1fr 200px`.
- **`TextField`, `Modal`, `CommandPalette`** — required by the new-venture flow AVL specified; the v1 reference has the ⌘K box but no palette, modal or input. All three reuse the slash-menu treatment (`--panel`, `--line2`, `--shadow-menu`) rather than introducing an overlay style.
- **`PipelineBoard` / `WeekGrid`** — named grid wrappers for the 1px-gap column grids, so the gap colour `--grid` is applied consistently.

### Known gaps

- **Five venture identity colours are additions, not v1 values.** `--venture-ember`, `--venture-moss`, `--venture-fern`, `--venture-indigo` and `--venture-plum` do not appear in the reference; they were added on request to bring the identity palette to twelve. Everything else in `tokens/` is lifted verbatim.
- **Founder names in the UI kit are placeholder data** apart from Tunde Adeyemi (ImmiClaw), which came from the reference. Send the real names and they swap in at `ui_kits/bench/data.jsx`.
- **Fonts are loaded from Google Fonts**, not from local binaries — no font files were provided, and the reference itself links Google Fonts. If AVL has licensed IBM Plex binaries, drop them in and replace the `@import` in `tokens/fonts.css` with `@font-face` rules.
- **Overview, Docs and Decisions were specified separately by AVL**, not by the v1 reference. They are built from the same token set — no new colour, size, spacing value or radius — but their layouts are the only part of this system without a v1 counterpart.
- **Notes and Calendar tabs inside a venture** stay pointers to the level-1 screens, per rule 2 (one pile, filtered views).

### Pipeline header

Pipeline carries only its title and `+ New venture`. The KPI cluster, the mono meta line and the closing five-counter `StatStrip` were removed — the board is the content, and the figures repeated what the cards already say. `Kpi` and `StatStrip` remain in the system for surfaces that genuinely need them.

### Venture creation

Creating a venture is a **top-level action, never a column affordance**. It appears in three places, all reachable from every page: the copper `+ New venture` in the app bar, the same action beside the KPI cluster in the Pipeline header, and `⌘K → Actions → New venture` (`⌘N`). The Meet column no longer carries an add button. The modal asks for name, one-liner, founder and an optional deck drop, and has exactly one primary action — **Create and open**.

### States

Every surface without a v1 counterpart ships three states, switchable in the UI kit via the Data / Empty / Loading control: real data, an empty state for a brand-new venture, and a loading state built from `Skeleton` bars at the real row geometry — no spinners, no shimmer sweeps.
