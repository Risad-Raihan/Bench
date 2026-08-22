import React from "react";
export function TextField({label,value,onChange,placeholder,optional=false,multiline=false,autoFocus=false}){
  const [f,setF]=React.useState(false);
  const s={width:"100%",background:"var(--bg2)",border:"1px solid "+(f?"var(--copper)":"var(--line)"),borderRadius:2,color:"var(--ink)",
    fontFamily:"var(--font-sans)",fontSize:13.5,padding:"9px 11px",outline:"none",transition:"border-color var(--dur-base)",resize:"none"};
  return (<label style={{display:"block",marginBottom:14}}>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:f?"var(--copper)":"var(--faint)",transition:"color var(--dur-base)"}}>{label}</span>
      {optional&&<span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-ghost)"}}>Optional</span>}
    </div>
    {multiline
      ? <textarea rows={2} value={value} placeholder={placeholder} autoFocus={autoFocus} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onChange={e=>onChange&&onChange(e.target.value)} style={s}/>
      : <input value={value} placeholder={placeholder} autoFocus={autoFocus} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onChange={e=>onChange&&onChange(e.target.value)} style={s}/>}
  </label>);
}
