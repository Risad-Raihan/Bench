import React from "react";
export function FilterBar({filters=[],active,onSelect}){
  return (<div style={{display:"flex",gap:6}}>
    {filters.map(f=>{const on=f===active;return (
      <div key={f} onClick={()=>onSelect&&onSelect(f)} style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",padding:"6px 11px",cursor:"pointer",transition:"var(--dur-fast)",
        border:"1px solid "+(on?"var(--copper)":"var(--line)"),color:on?"var(--copper)":"var(--faint)",background:on?"var(--copper-wash)":undefined}}>{f}</div>);})}
  </div>);
}
export function GroupHeader({label,count,hot=false}){
  return (<div style={{display:"flex",alignItems:"center",gap:11,padding:"9px 22px",background:"var(--bg2)",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
    <i style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:hot?"var(--amber)":"var(--dim)"}}>{label}</i>
    <b style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",marginLeft:"auto",fontWeight:400}}>{count}</b>
  </div>);
}
export function TaskRow({title,venture,ventureColor="var(--ash)",lane,laneColor="var(--copper)",date,late=false,done=false,onToggle,onClick}){
  const [h,setH]=React.useState(false);
  const tint=laneColor==="var(--amber)"?"var(--amber-tint)":laneColor==="var(--teal)"?"var(--teal-tint)":laneColor==="var(--magenta)"?"var(--magenta-tint)":"var(--copper-tint)";
  const ink=laneColor==="var(--amber)"?"var(--amber-label)":laneColor==="var(--teal)"?"var(--teal-label)":laneColor==="var(--magenta)"?"var(--magenta-label)":"var(--copper-label)";
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"grid",gridTemplateColumns:"20px 1fr 150px 96px 70px",gap:14,alignItems:"center",padding:"11px 22px",borderBottom:"1px solid var(--divider)",cursor:"pointer",
      background:h?"var(--hover-row)":undefined,transition:"background var(--dur-instant)"}}>
    <div onClick={e=>{e.stopPropagation();onToggle&&onToggle();}} style={{width:14,height:14,border:"1.5px solid "+(done?"var(--teal)":h?"var(--teal)":"var(--ink-ghost)"),borderRadius:2,background:done?"var(--teal)":undefined,transition:"border-color var(--dur-base)",display:"grid",placeItems:"center"}}>
      {done&&<span style={{fontSize:11,color:"var(--on-teal)",fontWeight:700}}>✓</span>}</div>
    <div style={{fontSize:13.5,color:done?"var(--faint)":undefined,textDecoration:done?"line-through":undefined}}>{title}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:7,color:"var(--dim)"}}>
      <span style={{width:7,height:7,borderRadius:1,background:ventureColor}}/>{venture}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".13em",textTransform:"uppercase",padding:"3px 7px",borderRadius:2,justifySelf:"start",background:tint,color:ink}}>{lane}</div>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:late?"var(--amber)":"var(--faint)",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{date}</div>
  </div>);
}
