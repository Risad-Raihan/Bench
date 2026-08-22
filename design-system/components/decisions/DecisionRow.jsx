import React from "react";
export function ActionButton({children,onClick,accent=true}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",padding:"6px 11px",cursor:"pointer",borderRadius:2,
      border:"1px solid "+(accent?"var(--copper)":h?"var(--line2)":"var(--line)"),color:accent?"var(--copper)":h?"var(--dim)":"var(--faint)",
      background:accent&&h?"var(--copper-tint)":accent?"var(--copper-wash)":"transparent",transition:"var(--dur-fast)",
      whiteSpace:"nowrap",flex:"none"}}>{children}</div>);
}
export function DecisionRow({decision,date,who,venture,ventureColor,source,rationale,expanded=false,onToggle,onOpenSource}){
  const [h,setH]=React.useState(false);
  return (<div>
    <div onClick={onToggle} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:"grid",gridTemplateColumns:"14px 1fr 150px 130px 70px",gap:14,alignItems:"center",padding:"11px 22px",borderBottom:"1px solid var(--divider)",cursor:"pointer",
        background:expanded?"var(--active-row)":h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:expanded?"var(--copper)":"var(--ink-ghost)",transition:"color var(--dur-fast)"}}>{expanded?"▾":"▸"}</span>
      <span style={{fontSize:13.5}}>{decision}</span>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--dim)",display:"flex",alignItems:"center",gap:7}}>
        {venture&&<s style={{width:7,height:7,borderRadius:1,background:ventureColor||"var(--ash)",textDecoration:"none"}}/>}{venture||who}</span>
      <span style={{justifySelf:"start"}}>{source
        ? <SourceChip onClick={e=>{e&&e.stopPropagation&&e.stopPropagation();onOpenSource&&onOpenSource();}}>{source}</SourceChip>
        : <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-ghost)"}}>Logged direct</span>}</span>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{date}</span>
    </div>
    {expanded&&<div style={{padding:"14px 22px 18px 50px",borderBottom:"1px solid var(--divider)",background:"var(--bg2)"}}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",marginBottom:8}}>Rationale · decided by {who}</div>
      <p style={{fontSize:13.5,lineHeight:1.7,color:"var(--body-ink)",maxWidth:720,margin:0}}>{rationale}</p>
    </div>}
  </div>);
}
export function SourceChip({children,onClick}){
  const [h,setH]=React.useState(false);
  return (<span onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",padding:"3px 8px",borderRadius:2,cursor:"pointer",
      background:"var(--magenta-tint)",color:h?"var(--ink)":"var(--magenta-label)",transition:"color var(--dur-fast)"}}>{children}</span>);
}
