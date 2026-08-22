One-line: the single text input primitive — used in the new-venture modal and anywhere else copy is typed outside a note.

```jsx
<TextField label="Name" value={name} onChange={setName} placeholder="ImmiClaw" autoFocus />
<TextField label="One-liner" value={line} onChange={setLine} multiline optional />
```
Focus is the only state that changes the border. There is no error styling in the source — validate on submit and say it in the footer.
