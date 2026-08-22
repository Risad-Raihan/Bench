One-line: the persistent Bench top bar — use it on every level-1 screen, and with `dimmed` on every venture screen.

```jsx
<AppBar active="My work" onNavigate={setView} onNewVenture={openModal} onJump={openPalette} />
<AppBar dimmed />           {/* inside a venture */}
```
Nav labels are mono uppercase 11px / .1em. The lit item gets a 1px copper underline 13px below the baseline — that underline is the only nav affordance.

`+ New venture` is a copper-outlined primary action in the bar, present on every page. Never put venture creation inside a pipeline column.
