One-line: the calendar surface — Mon–Fri columns, venture-coloured events, teal sync pulse in the footer.

```jsx
<WeekGrid>
  <DayColumn label="Wed 19 · today" today>
    <EventCard time="09:30" title="Partner sync, all four" flag="Note ready" />
    <EventCard time="16:00" title="Buyer interview 3 of 6" flag="+ Create note" color="var(--magenta)" />
  </DayColumn>
</WeekGrid>
<SyncBar />
```
Personal events use `color="var(--ash)"` and carry no note flag.
