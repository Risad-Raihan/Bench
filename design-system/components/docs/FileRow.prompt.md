One-line: the Docs tab — flat folder filter on the left, file rows in the middle, inline preview on the right.

```jsx
<div style={{display:"grid",gridTemplateColumns:"172px 1fr 260px"}}>
  <FolderFilter folders={[{label:"All",count:14},{label:"Diligence",count:5}]} active="All" />
  <div>
    <DropZone />
    <DocsHeaderRow />
    <FileRow name="Lagos market memo.pdf" type="PDF" size="1.2 MB" who="RN" date="18 AUG" versions={3} />
    <VersionRow version={2} who="RN" date="16 AUG" note="Added agent interview quotes" />
  </div>
  <PreviewPanel name="Lagos market memo.pdf" type="PDF" />
</div>
```
Folders are a flat string filter, never a nested tree. Preview only for PDFs and images; everything else shows the file's facts.
