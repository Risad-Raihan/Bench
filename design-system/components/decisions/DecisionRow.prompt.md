One-line: the decisions log, used both inside a venture and at app level (add `venture` + `ventureColor` for the app-level view, grouped by venture with `GroupHeader`).

```jsx
<ActionButton>+ Log a decision</ActionButton>
<DecisionRow decision="No exclusivity in the ImmiClaw term sheet" date="18 AUG" who="SR"
  source="Call with Tunde" rationale="Six months Lagos-only would cap us before we know if the model works."
  expanded onToggle={toggle} />
```
A decision with no note shows "Logged direct" in ghost ink, not an empty cell.
