import React from "react";
export function TaskCard({title,who,note,due,fromNote=false,done=false,color="var(--copper)",onClick}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{background:h?"var(--panel2)":"var(--panel)",border:"1px solid "+(h?"var(--line2)":"var(--line)"),borderLeft:"2px solid "+color,padding:"9px 10px",marginBottom:6,cursor:"grab",
      transition:"transform var(--dur-fast),background var(--dur-fast),border-color var(--dur-fast)",transform:h?"translateX(2px)":"none"}}>
    <h5 style={{fontSize:12.5,fontWeight:500,lineHeight:1.35,margin:0,color:done?"var(--faint)":undefined,textDecoration:done?"line-through":undefined}}>{title}</h5>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".06em",color:"var(--dim)"}}>
      <span style={{width:19,height:19,border:"1px solid var(--line2)",borderRadius:2,display:"grid",placeItems:"center",fontSize:11,color:"#a89890"}}>{who}</span>
      <span style={{color:fromNote?"var(--violet)":due?"var(--amber)":undefined,fontVariantNumeric:"tabular-nums"}}>{fromNote?"FROM NOTE":(due||note||"—")}</span>
    </div>
  </div>);
}
export function KanbanColumn({label,children}){
  return (<div style={{background:"var(--bg2)",border:"1px solid var(--line)",minHeight:92,padding:7}}>
    <em style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",display:"block",margin:"2px 0 7px 2px"}}>{label}</em>
    {children}
  </div>);
}
export function Lane({name,color,count,children,rise}){
  return (<div style={{marginBottom:12,animation:rise!=null?`avl-rise var(--dur-rise) var(--ease-rise) ${rise*0.05}s both`:undefined}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
      <span style={{width:7,height:7,borderRadius:1,background:color}}/>
      <i style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--dim)"}}>{name}</i>
      <s style={{flex:1,height:1,background:"var(--line)",textDecoration:"none"}}/>
      <b style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",fontWeight:400}}>{count}</b>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{children}</div>
  </div>);
}
