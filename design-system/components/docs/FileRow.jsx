import React from "react";
export function TypeGlyph({type="PDF",color}){
  return (<span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:color||"var(--dim)",
    border:"1px solid var(--line2)",borderRadius:2,padding:"3px 5px",display:"inline-block",minWidth:36,textAlign:"center"}}>{type}</span>);
}
export function FileRow({name,type="PDF",typeColor,size,who,date,versions=1,on=false,expanded=false,onClick,onExpand}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"grid",gridTemplateColumns:"48px 1fr 74px 120px 74px 58px",gap:14,alignItems:"center",padding:"10px 16px",borderBottom:"1px solid var(--divider)",cursor:"pointer",
      borderLeft:"2px solid "+(on?"var(--copper)":"transparent"),background:on?"var(--active-row)":h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
    <TypeGlyph type={type} color={typeColor}/>
    <div style={{fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",fontVariantNumeric:"tabular-nums"}}>{size}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--dim)"}}>{who}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{date}</div>
    <div onClick={e=>{e.stopPropagation();onExpand&&onExpand();}}
      style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",textAlign:"right",
        color:versions>1?(h||expanded?"var(--copper)":"var(--dim)"):"var(--ink-ghost)",transition:"color var(--dur-fast)"}}>
      {versions>1?`V${versions} ▾`:"V1"}</div>
  </div>);
}
export function VersionRow({version,who,date,note}){
  const [h,setH]=React.useState(false);
  return (<div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"grid",gridTemplateColumns:"48px 1fr 120px 74px",gap:14,alignItems:"center",padding:"7px 16px 7px 62px",borderBottom:"1px solid var(--divider)",
      background:h?"var(--hover-row)":"var(--bg2)",transition:"background var(--dur-instant)",borderLeft:"2px solid var(--line2)"}}>
    <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",color:"var(--dim)"}}>V{version}</span>
    <span style={{fontSize:12,color:"var(--faint)"}}>{note}</span>
    <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--dim)"}}>{who}</span>
    <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{date}</span>
  </div>);
}
export function DocsHeaderRow(){
  const c={fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)"};
  return (<div style={{display:"grid",gridTemplateColumns:"48px 1fr 74px 120px 74px 58px",gap:14,padding:"9px 16px",background:"var(--bg2)",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
    <span style={c}>Type</span><span style={c}>Name</span><span style={c}>Size</span><span style={c}>Uploaded by</span>
    <span style={{...c,textAlign:"right"}}>Date</span><span style={{...c,textAlign:"right"}}>Ver</span>
  </div>);
}
export function DropZone({label="Drop files here",hint="or click to browse · PDF, PNG, XLSX, DOCX up to 50MB",active=false,onClick}){
  const [h,setH]=React.useState(false);
  const on=active||h;
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{border:"1px dashed "+(on?"var(--copper)":"var(--line)"),borderRadius:2,padding:"18px",textAlign:"center",cursor:"pointer",margin:"14px 16px",
      background:on?"var(--copper-wash)":"transparent",transition:"border-color var(--dur-base),background var(--dur-base)"}}>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:on?"var(--copper)":"var(--ink-ghost3)"}}>{label}</div>
    <div style={{fontSize:11.5,color:"var(--faint)",marginTop:7}}>{hint}</div>
  </div>);
}
export function FolderFilter({folders=[],active,onSelect}){
  return (<div style={{background:"var(--bg2)",borderRight:"1px solid var(--line)",padding:"14px 0",minHeight:420}}>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--faint)",padding:"0 15px 9px"}}>Folders</div>
    {folders.map(f=><FolderItem key={f.label} {...f} on={f.label===active} onClick={()=>onSelect&&onSelect(f.label)}/>)}
  </div>);
}
export function FolderItem({label,count,on=false,onClick}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:8,padding:"6px 15px",fontSize:12.5,cursor:"pointer",borderLeft:"2px solid "+(on?"var(--copper)":"transparent"),
      color:on||h?"var(--ink)":"var(--dim)",background:on?"var(--active-row)":h?"var(--hover-row)":undefined,transition:"color var(--dur-fast),background var(--dur-fast)"}}>
    {label}<b style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",fontWeight:400,fontVariantNumeric:"tabular-nums"}}>{count}</b>
  </div>);
}
export function PreviewPanel({name,type,meta,children,onClose}){
  return (<div style={{borderLeft:"1px solid var(--line)",background:"var(--bg2)",padding:"14px 15px",minHeight:420}}>
    <div style={{display:"flex",alignItems:"center",gap:9,paddingBottom:11,borderBottom:"1px solid var(--line)"}}>
      <TypeGlyph type={type}/>
      <span style={{fontSize:12.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</span>
      <span onClick={onClose} style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",cursor:"pointer"}}>✕</span>
    </div>
    <div style={{marginTop:12,border:"1px solid var(--line)",borderRadius:2,background:"var(--panel)",minHeight:210,display:"grid",placeItems:"center",
      fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--ink-ghost)"}}>{children||"Preview"}</div>
    {meta}
  </div>);
}
