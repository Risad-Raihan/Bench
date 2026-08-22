One-line: the notes surface — sidebar (Pinned / By venture / Unfiled), hover-revealed blocks, live task rows, slash menu, metadata rail.

```jsx
<div style={{display:"grid",gridTemplateColumns:"216px 1fr 200px"}}>
  <NoteSidebar groups={[{label:"Pinned",items:[{label:"Call with Tunde",color:"var(--magenta)"}]}]} active="Call with Tunde" />
  <div style={{padding:"34px 44px 60px"}}>
    <NoteBlock><p style={{fontSize:14.5,lineHeight:1.75,color:"var(--body-ink)"}}>…</p></NoteBlock>
    <NoteBlock><NoteQuote>The exclusivity ask is the real negotiation.</NoteQuote></NoteBlock>
    <NoteBlock><TaskBlock label="Draft term sheet" pill="Capital · SR" /></NoteBlock>
    <SlashMenu items={[{glyph:"☑",label:"Task",hint:"creates a card",on:true},{glyph:"#",label:"Heading"}]} />
  </div>
  <MetaRail sections={[{label:"Venture",value:"ImmiClaw",color:"var(--magenta-label)"}]} />
</div>
```
Unfiled notes are a first-class sidebar group with ash dots, not an afterthought.
