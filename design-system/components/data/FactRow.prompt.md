One-line: the small data primitives the Overview tab is assembled from — facts, link chips, gate checklist, lane bars, one-line rows, activity feed.

```jsx
<Panel label="Facts">
  <FactRow k="Stage" v="Validate" />
  <FactRow k="AVL stake" v="45%" mono />
</Panel>
<ChecklistRow label="Buyer interviews, 3 of 6" by="MS" />
<LaneBarRow lane="Tech" color="var(--copper)" open={4} />
<ActivityRow who="RN" text="Moved ImmiClaw to Validate" when="2H" color="var(--magenta)" />
```
Event dot colours follow the lane/venture colour, never a per-event-type palette.
