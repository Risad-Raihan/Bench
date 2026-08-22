import React from "react";
export function EventCard({time,title,flag,color="var(--copper)",onClick}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{padding:"8px 9px",marginBottom:6,borderLeft:"2px solid "+color,background:h?"var(--panel2)":"var(--panel)",cursor:"pointer",
      transition:"background var(--dur-fast),transform var(--dur-fast)",transform:h?"translateX(2px)":"none"}}>
    <b style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",display:"block",letterSpacing:".08em",fontVariantNumeric:"tabular-nums",fontWeight:400}}>{time}</b>
    <h5 style={{fontSize:12,fontWeight:500,marginTop:4,lineHeight:1.35,margin:"4px 0 0"}}>{title}</h5>
    {flag&&<s style={{display:"inline-block",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--violet)",textDecoration:"none",marginTop:6}}>{flag}</s>}
  </div>);
}
export function DayColumn({label,today=false,children}){
  return (<div style={{background:"var(--bg)",minHeight:270,padding:10}}>
    <em style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:today?"var(--copper)":"var(--faint)",display:"block",marginBottom:9}}>{label}</em>
    {children}
  </div>);
}
export function WeekGrid({children}){
  return <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:1,background:"var(--line)"}}>{children}</div>;
}
export function SyncBar({children="GOOGLE CALENDAR · SYNCED 14:22 +06 · TWO WAY",live=true}){
  return (<div style={{display:"flex",alignItems:"center",gap:8,padding:"11px 22px",borderTop:"1px solid var(--line)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",color:"var(--faint)",background:"var(--bg2)"}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:"var(--teal)",animation:live?"avl-glow var(--dur-glow) ease-in-out infinite":undefined}}/>{children}
  </div>);
}
