# Bench

Internal work management tool for Apon Venture Lab. Four users, all
partners. Next.js App Router, TypeScript, Postgres, Drizzle,
NextAuth, deployed on Vercel.

## Design rules — non-negotiable

The design system is in /design-system. Read design-system/SKILL.md
and design-system/readme.md before writing any UI. Each component
has a .prompt.md with usage examples — read it before using that
component.

- NEVER invent a colour, font size, spacing value, radius or shadow.
  Every value comes from /design-system/tokens.
- NEVER install a UI library. Use the components in
  /design-system/components. If one is missing, ask before creating it.
- design-system/ui_kits/bench is the visual ground truth. When unsure
  how something should look, open it and match it.
- Base text is 13-14px. Dense operator tool, not a marketing site.
- Hairline borders, no shadows. No gradients except the venture header.
- All numbers use mono tabular figures.
- Row and card actions appear on hover only.
- Motion under 150ms ease-out. Nothing bounces.

## Model rules

- A task is always a row in `tasks`. Notes store
  {type:"task", attrs:{taskId}} and resolve the live row at render.
  Never store task text inside note JSON.
- venture_id is nullable on notes, tasks and docs. Unfiled is a real
  state, not an error.
- Task `position` is a double. Reorder by averaging neighbours.
- Stage changes insert a row into venture_stage_events and update
  stage_entered_at. Never update history rows.
- Two nav levels only: Pipeline, then a venture. Anything deeper
  opens in a panel, not a page.

## Naming

The product is Bench. The company is Apon Venture Lab (AVL). The
older name AVLHub appears in some design-system files; it means
Bench.

## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues in the Bench repo, managed via
the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical role names used verbatim (`needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`). See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See
`docs/agents/domain.md`.
