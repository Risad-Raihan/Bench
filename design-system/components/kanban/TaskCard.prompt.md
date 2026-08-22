One-line: the venture Tasks tab — a lane per workstream, each lane a four-column mini board.

```jsx
<Lane name="Tech" color="var(--copper)" count={4} rise={1}>
  <KanbanColumn label="To do"><TaskCard title="Scope MVP auth and agent roles" who="RM" due="24 AUG" /></KanbanColumn>
  <KanbanColumn label="Doing"><TaskCard title="Data model for applicant files" who="RM" fromNote /></KanbanColumn>
  <KanbanColumn label="Blocked" /><KanbanColumn label="Done" />
</Lane>
```
Lane colours are fixed: Thesis amber, Tech copper, GTM magenta, Capital teal.
