import React from "react";
import { Avatar } from "../media/Avatar.jsx";
export function GateBar({total=6,filled=0,color="var(--copper)",height=3,gap=2.5}){
  return (<div style={{display:"flex",gap,marginTop:11}}>
    {Array.from({length:total}).map((_,i)=><s key={i} style={{flex:1,height,background:i<filled?color:"var(--gate-empty)",textDecoration:"none"}}/>)}
  </div>);
}
export function WhoChip({initials,size=19}){
  return (<div style={{width:size,height:size,border:"1px solid var(--line2)",borderRadius:2,display:"grid",placeItems:"center",fontSize:11,color:"var(--dim)",fontFamily:"var(--font-mono)",flex:"none"}}>{initials}</div>);
}
export function VentureCard({name,caption,color="var(--copper)",gates=0,gateTotal=6,who,ownerAvatar,founderAvatar,founder,flag,onClick,rise,showGates=true,showMeta=true}){
  const [h,setH]=React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h?"var(--panel2)":"var(--panel)",border:"1px solid "+(h?"var(--line2)":"var(--line)"),borderLeft:"3px solid "+color,padding:"12px 13px",marginBottom:8,cursor:"pointer",
        transition:"background var(--dur-base),border-color var(--dur-base),transform var(--dur-base)",transform:h?"translateX(2px)":"none",
        animation:rise!=null?`avl-rise var(--dur-rise) var(--ease-rise) ${rise*0.05}s both`:undefined}}>
      <h4 style={{fontSize:14.5,fontWeight:600,letterSpacing:"-.015em",margin:0}}>{name}</h4>
      <p style={{fontSize:11.5,color:"var(--dim)",marginTop:3,lineHeight:1.4}}>{caption}</p>
      {showGates&&<GateBar total={gateTotal} filled={gates} color={color}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginTop:showGates?10:11}}>
        {ownerAvatar?<Avatar avatar={ownerAvatar} name={who} size={19}/>:<WhoChip initials={who}/>}
        {showMeta&&(flag
          ? <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".06em",color:"var(--amber)",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>{flag}</span>
          : (founder||founderAvatar)&&<span style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
              <Avatar avatar={founderAvatar} name={founder} size={16} dim/>
              <span style={{fontSize:11.5,color:"var(--dim)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{founder}</span>
            </span>)}
      </div>
    </div>);
}
export function AddButton({children="+ Venture",onClick}){
  const [h,setH]=React.useState(false);
  return (<button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{width:"100%",border:"1px dashed "+(h?"var(--line2)":"var(--line)"),background:"transparent",color:h?"var(--dim)":"var(--ink-ghost3)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",padding:9,cursor:"pointer",transition:"var(--dur-fast)"}}>{children}</button>);
}
export function StageColumn({stage,count,progress=0,color="var(--copper)",steps=5,children}){
  return (<div style={{background:"var(--bg2)",minHeight:290}}>
    <div style={{padding:"12px 13px 10px",borderBottom:"1px solid var(--grid)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",fontFamily:"var(--font-mono)"}}>
        <i style={{fontStyle:"normal",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--dim)"}}>{stage}</i>
        <b style={{fontSize:14,fontWeight:400,color:"var(--faint)",fontVariantNumeric:"tabular-nums"}}>{count}</b>
      </div>
      <div style={{display:"flex",gap:2,marginTop:9}}>
        {Array.from({length:steps}).map((_,i)=><s key={i} style={{flex:1,height:2,background:i<progress?color:"var(--line)",textDecoration:"none"}}/>)}
      </div>
    </div>
    <div style={{padding:10}}>{children}</div>
  </div>);
}
export function PipelineBoard({children, columns=5}){
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${columns},1fr)`,gap:1,background:"var(--line)"}}>{children}</div>;
}
