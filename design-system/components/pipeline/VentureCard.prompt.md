One-line: the pipeline board and its cards — the Bench home screen, level 1.

```jsx
<PipelineBoard>
  <StageColumn stage="Validate" count="01" progress={2} color="var(--magenta)">
    <VentureCard name="ImmiClaw" caption="Study abroad, Africa" color="var(--magenta)" gates={4} who="RN" founder="Tunde Adeyemi" rise={0} />
    <AddButton />
  </StageColumn>
</PipelineBoard>
```
Stage order is fixed: Meet, Validate, Build, Form, Grow. An empty column shows `<AddButton>Nothing here yet</AddButton>`.

The footer pairs the AVL owner chip with the founder's name. Stats — stake percentages, gate ratios, install counts — do not belong on the card; the gate rail and the column header track carry progress, and the figures live on the venture Overview. A `flag` replaces the founder line when something needs attention.

For a quieter board pass `showGates={false} showMeta={false}`: name, one-liner and owner only.
