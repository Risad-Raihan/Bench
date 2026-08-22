import React from "react";
export const VENTURE_COLORS=[
  {label:"Copper",value:"var(--copper)"},
  {label:"Ember",value:"var(--venture-ember)"},
  {label:"Clay",value:"var(--venture-clay)"},
  {label:"Amber",value:"var(--amber)"},
  {label:"Moss",value:"var(--venture-moss)"},
  {label:"Fern",value:"var(--venture-fern)"},
  {label:"Teal",value:"var(--teal)"},
  {label:"Steel",value:"var(--venture-steel)"},
  {label:"Indigo",value:"var(--venture-indigo)"},
  {label:"Violet",value:"var(--violet)"},
  {label:"Plum",value:"var(--venture-plum)"},
  {label:"Magenta",value:"var(--magenta)"}
];
export function SwatchPicker({label="Colour",value,onChange,options=VENTURE_COLORS,note}){
  return (<div style={{marginBottom:14}}>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:7}}>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)"}}>{label}</span>
      {note&&<span style={{fontSize:11.5,color:"var(--ink-ghost3)"}}>{note}</span>}
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {options.map(o=><Swatch key={o.value} {...o} on={o.value===value} onClick={()=>onChange&&onChange(o.value)}/>)}
    </div>
  </div>);
}
export function Swatch({label,value,on=false,onClick}){
  const [h,setH]=React.useState(false);
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} title={label}
    style={{width:34,height:26,borderRadius:2,cursor:"pointer",position:"relative",overflow:"hidden",
      border:"1px solid "+(on?value:h?"var(--line2)":"var(--line)"),transition:"border-color var(--dur-fast)"}}>
    <div style={{position:"absolute",inset:0,background:`linear-gradient(97deg,${value} 0%,transparent 74%)`,opacity:on?1:.55}}/>
    <div style={{position:"absolute",top:0,left:0,height:2,width:"100%",background:value,opacity:on?1:.6}}/>
  </div>);
}
