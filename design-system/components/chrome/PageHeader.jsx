import React from "react";
export function PageHeader({title,meta,right,children}){
  return (
    <div style={{padding:"24px 22px 20px",display:"flex",alignItems:"flex-end",justifyContent:"space-between",borderBottom:"1px solid var(--line)"}}>
      <div>
        <h3 style={{fontSize:25,fontWeight:600,letterSpacing:"-.025em",margin:0}}>{title}</h3>
        {meta&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",letterSpacing:".08em",marginTop:7}}>{meta}</div>}
      </div>
      <div style={{display:"flex",gap:34,alignItems:"center",textAlign:"right",fontFamily:"var(--font-mono)"}}>{right||children}</div>
    </div>);
}
export function Kpi({value,label,hot=false}){
  return (<div><b style={{display:"block",fontSize:27,fontWeight:400,letterSpacing:"-.02em",lineHeight:1,fontVariantNumeric:"tabular-nums",color:hot?"var(--copper)":undefined}}>{value}</b>
  <span style={{fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--faint)",display:"block",marginTop:7}}>{label}</span></div>);
}
export function StatStrip({stats=[]}){
  return (<div style={{display:"flex",gap:1,background:"var(--grid)",borderTop:"1px solid var(--line)",fontFamily:"var(--font-mono)"}}>
    {stats.map(s=><div key={s.label} style={{flex:1,background:"var(--bg2)",padding:"13px 16px"}}>
      <b style={{fontSize:16,fontWeight:400,display:"block",fontVariantNumeric:"tabular-nums"}}>{s.value}</b>
      <span style={{fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",display:"block",marginTop:5}}>{s.label}</span></div>)}
  </div>);
}
