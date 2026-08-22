One-line: the header for Pipeline / My work / Calendar. The right slot is optional — pass `Kpi` children where figures earn their place, or just an action.

```jsx
<PageHeader title="Pipeline" meta={<>6 ACTIVE · <em style={{fontStyle:"normal",color:"var(--amber)"}}>1 STALLED</em> · SYNCED 14:22 +06</>}>
  <Kpi value="3" label="need you" hot /><Kpi value="31.6" label="avg stake %" />
</PageHeader>
<StatStrip stats={[{value:"14",label:"open tasks"},{value:"3",label:"due this week"}]} />
```

Pipeline is deliberately bare — title plus `+ New venture`, no meta line, no KPI cluster, no closing `StatStrip`. The board is the content.
