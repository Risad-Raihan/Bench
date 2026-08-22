One-line: the two overlays in Bench — a dialog and the ⌘K palette. Both use the slash-menu treatment (--panel, --line2, --shadow-menu); nothing else in the system floats.

```jsx
<Modal eyebrow="New venture" title="Add a venture to the pipeline" onClose={close}
  footer={<><ActionButton onClick={create}>Create and open</ActionButton>
    <span style={{marginLeft:"auto",fontSize:11.5,color:"var(--faint)"}}>Everything else is editable later.</span></>}>
  <TextField label="Name" autoFocus />
</Modal>

<CommandPalette groups={[{label:"Actions",items:[{glyph:"+",label:"New venture",hint:"⌘N",primary:true}]}]} onRun={run} />
```
A modal has exactly one primary action. Cancel is Esc or clicking the scrim, not a second button.
