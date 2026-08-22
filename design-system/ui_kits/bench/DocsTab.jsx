const FolderFilter=p=>window.AVLHubDesignSystem_5531ba.FolderFilter(p);
const DropZone=p=>window.AVLHubDesignSystem_5531ba.DropZone(p);
const DocsHeaderRow=p=>window.AVLHubDesignSystem_5531ba.DocsHeaderRow(p);
const FileRow=p=>window.AVLHubDesignSystem_5531ba.FileRow(p);
const VersionRow=p=>window.AVLHubDesignSystem_5531ba.VersionRow(p);
const PreviewPanel=p=>window.AVLHubDesignSystem_5531ba.PreviewPanel(p);
const EmptyState=p=>window.AVLHubDesignSystem_5531ba.EmptyState(p);
const SkeletonRow=p=>window.AVLHubDesignSystem_5531ba.SkeletonRow(p);
const FactRow=p=>window.AVLHubDesignSystem_5531ba.FactRow(p);

const foldersFrom=files=>[{label:'All',count:files.length},
  ...AVL_DATA.docFolders.map(f=>({label:f,count:files.filter(x=>x.folder===f).length}))];

function DocsTab({state='Data',venture='ImmiClaw'}){
  const files=state==='Data'?AVL_DATA.docs.filter(f=>f.venture===venture):[];
  const folders=state==='Loading'
    ? [{label:'All'},...AVL_DATA.docFolders.map(f=>({label:f}))]
    : foldersFrom(files);
  const [folder,setFolder]=React.useState('All');
  const [sel,setSel]=React.useState(null);
  const [open,setOpen]=React.useState(null);
  React.useEffect(()=>{setSel(files.length?files[0].name:null);setOpen(files.length?files[0].name:null);},[venture,state]);
  const [drag,setDrag]=React.useState(false);
  const rows=files.filter(f=>folder==='All'||f.folder===folder);
  const file=files.find(f=>f.name===sel);
  const body=state==='Loading'
    ? <div><DropZone /><DocsHeaderRow />{[0,1,2,3,4].map(i=><SkeletonRow key={i} cols={['48px','1fr','74px','120px','74px','58px']} pad="10px 16px" />)}</div>
    : state==='Empty'
      ? <div><DropZone active={drag} onClick={()=>setDrag(d=>!d)} /><div style={{padding:'8px 16px 16px'}}>
          <EmptyState hint="Drop a file above, or connect the venture's Drive folder. Docs uploaded from a note land here automatically." action="+ Connect Drive">No docs in this venture yet</EmptyState></div></div>
      : <div><DropZone active={drag} onClick={()=>setDrag(d=>!d)} /><DocsHeaderRow />
          {rows.map(f=>(<React.Fragment key={f.name}>
            <FileRow {...f} versions={(f.versions||[]).length+1} on={f.name===sel} expanded={open===f.name}
              onClick={()=>setSel(f.name)} onExpand={()=>setOpen(o=>o===f.name?null:f.name)} />
            {open===f.name&&(f.versions||[]).map(v=><VersionRow key={v.version} {...v} />)}
          </React.Fragment>))}
        </div>;
  return (<div style={{display:'grid',gridTemplateColumns:'172px 1fr 260px'}}>
    <FolderFilter folders={folders} active={folder} onSelect={setFolder} />
    {body}
    {state==='Data'&&file
      ? <PreviewPanel name={file.name} type={file.type} onClose={()=>setSel(null)}
          meta={<div style={{marginTop:12}}>
            <FactRow k="Size" v={file.size} mono />
            <FactRow k="Uploaded" v={file.who+' · '+file.date} />
            <FactRow k="Versions" v={(file.versions||[]).length+1} mono />
            <FactRow k="Folder" v={file.folder} />
          </div>}>
          {file.preview||'No inline preview for this type'}
        </PreviewPanel>
      : <div style={{borderLeft:'1px solid var(--line)',background:'var(--bg2)',minHeight:420,display:'grid',placeItems:'center',
          fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-ghost)'}}>Select a file</div>}
  </div>);
}
Object.assign(window,{DocsTab});
