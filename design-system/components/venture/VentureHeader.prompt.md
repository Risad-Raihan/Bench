One-line: level-2 venture chrome — header, gate rail, tabs; always below an `AppBar dimmed` + `BackStrip`.

```jsx
<VentureHeader name="ImmiClaw" color="var(--magenta)" sub="Study abroad automation for agents across West Africa"
  tags={[{label:"45% AVL stake"},{label:"Rashedun Nabi"},{label:"19 days in stage",hot:true}]}
  stage="Validate" stageMeta="4 of 6 gates cleared" />
<GateRail gates={[{stage:"Meet",label:"Cleared 11 Aug",state:"done"},{stage:"Validate",label:"Buyer interviews, 3 of 6",state:"now"},{stage:"Build",label:"Locked"}]} />
<VentureTabs tabs={[{label:"Overview"},{label:"Docs",count:14},{label:"Tasks",count:11}]} active="Tasks" scope="ImmiClaw only" />
```
Never use the gradient anywhere else. The header wash is derived from the single identity colour the venture was given at onboarding — pass that same colour to `BackStrip`, `VentureTabs`, its `VentureCard` and its events, so one venture reads as one colour everywhere.
