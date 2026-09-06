import React from "react";
export function Tag({children,hot=false}){
  return (<span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".13em",textTransform:"uppercase",padding:"4px 9px",borderRadius:2,whiteSpace:"nowrap",
    border:"1px solid "+(hot?"var(--amber)":"var(--venture-tag-line)"),color:hot?"var(--amber-label-strong)":"var(--venture-tag-ink)",background:hot?"var(--amber-tint-strong)":"var(--venture-tag-bg)"}}>{children}</span>);
}
export function VentureHeader({name,sub,tags=[],stage,stageMeta,color}){
  const wash=color?`linear-gradient(97deg,${color} 0%,transparent 74%)`:"var(--venture-wash)";
  const rule=color?`linear-gradient(90deg,${color} 0%,${color} 52%,transparent 100%)`:"var(--venture-rule)";
  return (<div style={{padding:22,position:"relative",overflow:"hidden",borderBottom:"1px solid var(--line)"}}>
    <div style={{position:"absolute",inset:0,background:wash,opacity:"var(--venture-wash-opacity)"}}/>
    <div style={{position:"absolute",top:0,left:0,height:2,width:"100%",background:rule}}/>
    <div style={{position:"relative",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
      <div>
        <h3 style={{fontSize:31,fontWeight:600,letterSpacing:"-.03em",margin:0}}>{name}</h3>
        <div style={{fontSize:13.5,color:"var(--venture-sub)",marginTop:6}}>{sub}</div>
        <div style={{display:"flex",gap:7,marginTop:13}}>{tags.map((t,i)=><Tag key={i} hot={t.hot}>{t.label||t}</Tag>)}</div>
      </div>
      <div style={{textAlign:"right",fontFamily:"var(--font-mono)"}}>
        <b style={{display:"block",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"var(--venture-stage-ink)"}}>Stage</b>
        <em style={{fontStyle:"normal",display:"block",fontSize:34,color:"var(--venture-stage-strong)",letterSpacing:"-.02em",marginTop:6,fontWeight:500}}>{stage}</em>
        <span style={{fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--venture-stage-meta)",display:"block",marginTop:5}}>{stageMeta}</span>
      </div>
    </div>
  </div>);
}
export function GateRail({gates=[],onSelect}){
  return (<div style={{display:"flex",gap:1,background:"var(--line)",borderBottom:"1px solid var(--line)"}}>
    {gates.map(g=>(<div key={g.stage} onClick={()=>onSelect&&g.state!=="now"&&onSelect(g.stage)} style={{flex:1,background:g.state==="now"?"var(--active-row)":"var(--bg2)",padding:"11px 13px",position:"relative",cursor:onSelect&&g.state!=="now"?"pointer":undefined}}>
      <i style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",display:"block",whiteSpace:"nowrap",
        color:g.state==="done"?"var(--teal)":g.state==="now"?"var(--copper)":"var(--faint)"}}>{g.stage}</i>
      <b style={{fontSize:12.5,fontWeight:500,display:"block",marginTop:5,color:g.state?"var(--ink)":"var(--dim)"}}>{g.label}</b>
      {g.state&&<span style={{position:"absolute",bottom:0,left:0,height:2,width:g.state==="now"?"66%":"100%",background:g.state==="now"?"var(--copper)":"var(--teal)"}}/>}
    </div>))}
  </div>);
}
export function VentureTabs({tabs=[],active,onSelect,scope,accent="var(--magenta)"}){
  return (<div style={{display:"flex",gap:2,padding:"10px 22px 0",background:"var(--bg2)",borderBottom:"1px solid var(--line)"}}>
    {tabs.map(t=>{const on=t.label===active;return (
      <div key={t.label} onClick={()=>onSelect&&onSelect(t.label)} style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".13em",textTransform:"uppercase",
        color:on?"var(--ink)":"var(--faint)",padding:"9px 14px",cursor:"pointer",whiteSpace:"nowrap",border:"1px solid "+(on?"var(--line)":"transparent"),borderBottom:"none",
        background:on?"var(--bg)":undefined,position:"relative",top:on?1:0,transition:"color var(--dur-base),background var(--dur-base)"}}>
        {on&&<span style={{position:"absolute",top:-1,left:-1,right:-1,height:2,background:accent}}/>}
        {t.label}{t.count!=null&&<b style={{color:"var(--faint)",fontWeight:400,marginLeft:7}}>{t.count}</b>}
      </div>);})}
    <div style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"var(--faint)",padding:"9px 0",whiteSpace:"nowrap",flex:"none"}}>{scope}</div>
  </div>);
}
