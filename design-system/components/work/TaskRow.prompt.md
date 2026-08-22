One-line: the cross-venture task list; grid columns are fixed at `20px 1fr 150px 96px 70px`.

```jsx
<FilterBar filters={["All","Tech","Capital","Blocked","No date"]} active="All" />
<GroupHeader label="Overdue" count={1} hot />
<TaskRow title="Sandbox access follow up" venture="ImmiClaw" ventureColor="var(--magenta)" lane="Tech" date="2D LATE" late />
```
The venture dot is how a partner knows where a task came from without reading.
