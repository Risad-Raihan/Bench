import React from "react";
export function BackStrip({parent="Pipeline",current,color="var(--magenta)",onBack,switchLabel="Switch venture ▾",onSwitch}){
  const t={fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".13em",textTransform:"uppercase"};
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 16px",background:"var(--back-strip)",borderBottom:"1px solid var(--line)",...t}}>
      <div onClick={onBack} style={{color:"var(--dim)",cursor:"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"color var(--dur-base)"}}>← {parent}</div>
      <div style={{color:"var(--ink-ghost2)"}}>/</div>
      <div style={{color:"var(--ink)",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap"}}><span style={{width:8,height:8,borderRadius:2,background:color,flex:"none"}}/>{current}</div>
      <div onClick={onSwitch} style={{marginLeft:"auto",color:"var(--faint)",border:"1px solid var(--line)",padding:"4px 9px",cursor:"pointer",whiteSpace:"nowrap",flex:"none"}}>{switchLabel}</div>
    </div>);
}
