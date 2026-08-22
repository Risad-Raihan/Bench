One-line: the container, label, empty and loading primitives every AVLHub surface is assembled from.

```jsx
<Panel label="Facts" right="6">
  <FactRow k="Stage" v="Validate" />
</Panel>
<EmptyState hint="Drop a file above, or connect the venture's Drive folder." action="+ Upload">No docs yet</EmptyState>
<SkeletonRow cols={["1fr","150px","70px"]} />
```
Loading uses `Skeleton` bars at the real row geometry — never a spinner, never a shimmer sweep.
