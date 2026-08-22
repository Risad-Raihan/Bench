import React from "react";
export function SectionLabel({children,color,right}){
  return (<div style={{display:"flex",alignItems:"center",gap:10}}>
    <i style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:color||"var(--faint)"}}>{children}</i>
    <s style={{flex:1,height:1,background:"var(--line)",textDecoration:"none"}}/>
    {right!=null&&<b style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",fontWeight:400}}>{right}</b>}
  </div>);
}
export function Panel({label,right,children,pad=13,flush=false}){
  return (<div style={{background:"var(--panel)",border:"1px solid var(--line)",borderRadius:2,padding:flush?0:pad,marginBottom:8}}>
    {label&&<div style={{padding:flush?"11px 13px 0":0,marginBottom:11}}><SectionLabel right={right}>{label}</SectionLabel></div>}
    {children}
  </div>);
}
export function EmptyState({children,hint,action,onAction}){
  return (<div style={{border:"1px dashed var(--line)",borderRadius:2,padding:"26px 18px",textAlign:"center"}}>
    <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"var(--ink-ghost3)"}}>{children}</div>
    {hint&&<div style={{fontSize:12,color:"var(--faint)",marginTop:9,lineHeight:1.5}}>{hint}</div>}
    {action&&<div onClick={onAction} style={{display:"inline-block",marginTop:14,fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"var(--copper)",border:"1px solid var(--line)",padding:"6px 11px",cursor:"pointer"}}>{action}</div>}
  </div>);
}
export function Skeleton({w="100%",h=13,mb=0}){
  return <div style={{width:w,height:h,background:"var(--gate-empty)",borderRadius:2,marginBottom:mb,animation:"avl-glow var(--dur-glow) ease-in-out infinite"}}/>;
}
export function SkeletonRow({cols=["1fr","150px","70px"],pad="11px 22px"}){
  return (<div style={{display:"grid",gridTemplateColumns:cols.join(" "),gap:14,alignItems:"center",padding:pad,borderBottom:"1px solid var(--divider)"}}>
    {cols.map((c,i)=><Skeleton key={i} h={i===0?13:10}/>)}
  </div>);
}
