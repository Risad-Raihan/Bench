import React from "react";
export function FactRow({k,v,color,mono=false}){
  return (<div style={{display:"grid",gridTemplateColumns:"104px 1fr",gap:12,alignItems:"baseline",padding:"7px 0",borderBottom:"1px solid var(--divider)"}}>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)"}}>{k}</div>
    <div style={{fontSize:12.5,color:color||"var(--meta-ink)",fontFamily:mono?"var(--font-mono)":undefined,fontVariantNumeric:mono?"tabular-nums":undefined}}>{v}</div>
  </div>);
}
export function LinkChip({children,onClick}){
  const [h,setH]=React.useState(false);
  return (<span onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"inline-flex",alignItems:"center",gap:7,fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".13em",textTransform:"uppercase",padding:"4px 9px",borderRadius:2,
      border:"1px solid "+(h?"var(--line2)":"var(--line)"),color:h?"var(--copper)":"var(--dim)",cursor:"pointer",transition:"color var(--dur-fast),border-color var(--dur-fast)"}}>{children}</span>);
}
export function ChecklistRow({label,by,done=false,onToggle}){
  const [h,setH]=React.useState(false);
  return (<div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:11,padding:"8px 0",borderBottom:"1px solid var(--divider)",background:h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
    <div onClick={onToggle} style={{width:14,height:14,border:"1.5px solid "+(done||h?"var(--teal)":"var(--ink-ghost)"),borderRadius:2,flex:"none",display:"grid",placeItems:"center",
      background:done?"var(--teal)":undefined,cursor:"pointer",transition:"border-color var(--dur-base),background var(--dur-base)"}}>
      {done&&<span style={{fontSize:11,color:"var(--on-teal)",fontWeight:700}}>✓</span>}</div>
    <span style={{fontSize:13,color:done?"var(--dim)":undefined}}>{label}</span>
    <span style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:done?"var(--teal)":"var(--ink-ghost3)"}}>{by||"—"}</span>
  </div>);
}
export function LaneBarRow({lane,color,open,max=8}){
  return (<div style={{display:"grid",gridTemplateColumns:"64px 1fr 24px",gap:11,alignItems:"center",padding:"6px 0"}}>
    <i style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--dim)"}}>{lane}</i>
    <div style={{display:"flex",gap:2}}>{Array.from({length:max}).map((_,i)=><s key={i} style={{flex:1,height:3,background:i<open?color:"var(--gate-empty)",textDecoration:"none"}}/>)}</div>
    <b style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--dim)",fontWeight:400,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{open}</b>
  </div>);
}
export function LineRow({label,meta,color,onClick}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:"1px solid var(--divider)",cursor:"pointer",background:h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
    {color&&<span style={{width:5,height:5,borderRadius:1,background:color,flex:"none"}}/>}
    <span style={{fontSize:12.5,color:h?"var(--ink)":"var(--meta-ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
    <span style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--faint)",flex:"none",fontVariantNumeric:"tabular-nums"}}>{meta}</span>
  </div>);
}
export function ActivityRow({who,text,when,color="var(--ash)",compact=false}){
  const [h,setH]=React.useState(false);
  return (<div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"grid",gridTemplateColumns:(compact?"17px":"19px")+" 1fr 44px",gap:compact?9:12,alignItems:"center",padding:compact?"6px 11px":"9px 13px",borderBottom:"1px solid var(--divider)",background:h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
    <span style={{width:compact?17:19,height:compact?17:19,border:"1px solid var(--line2)",borderRadius:2,display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontSize:11,color:"#a89890"}}>{who}</span>
    <span style={{fontSize:compact?12:12.5,color:"var(--meta-ink)",display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>
      <s style={{width:5,height:5,borderRadius:1,background:color,textDecoration:"none",flex:"none"}}/>
      <em style={{fontStyle:"normal",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{text}</em></span>
    <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--faint)",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{when}</span>
  </div>);
}
