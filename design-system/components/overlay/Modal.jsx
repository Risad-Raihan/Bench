import React from "react";
export function Modal({title,eyebrow,children,footer,width=520,onClose}){
  return (<div style={{position:"fixed",inset:0,zIndex:40,display:"grid",placeItems:"center",background:"var(--scrim)"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{width,maxWidth:"92vw",background:"var(--panel)",border:"1px solid var(--line2)",borderRadius:3,boxShadow:"var(--shadow-menu)",overflow:"hidden"}}>
      <div style={{padding:"16px 18px 14px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14}}>
        <div>
          {eyebrow&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--copper)"}}>{eyebrow}</div>}
          <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.02em",marginTop:eyebrow?7:0}}>{title}</div>
        </div>
        <span onClick={onClose} style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",cursor:"pointer"}}>ESC</span>
      </div>
      <div style={{padding:"18px"}}>{children}</div>
      {footer&&<div style={{padding:"13px 18px",borderTop:"1px solid var(--line)",background:"var(--bg2)",display:"flex",alignItems:"center",gap:10}}>{footer}</div>}
    </div>
  </div>);
}
export function CommandPalette({query="",onQuery,groups=[],onRun,onClose,placeholder="Jump to a venture, note or action"}){
  return (<div style={{position:"fixed",inset:0,zIndex:40,display:"grid",placeItems:"start center",paddingTop:"12vh",background:"var(--scrim)"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{width:560,maxWidth:"92vw",background:"var(--panel)",border:"1px solid var(--line2)",borderRadius:3,boxShadow:"var(--shadow-menu)",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",borderBottom:"1px solid var(--line)"}}>
        <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--copper)"}}>⌘K</span>
        <input autoFocus value={query} placeholder={placeholder} onChange={e=>onQuery&&onQuery(e.target.value)}
          style={{flex:1,background:"transparent",border:"none",outline:"none",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:13.5}}/>
      </div>
      <div style={{padding:5,maxHeight:340,overflow:"auto"}}>
        {groups.map(g=>(<div key={g.label}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",padding:"9px 9px 5px"}}>{g.label}</div>
          {g.items.map(it=><CommandRow key={it.label} {...it} onClick={()=>onRun&&onRun(it)}/>)}
        </div>))}
      </div>
    </div>
  </div>);
}
export function CommandRow({glyph,label,hint,color,primary=false,on=false,onClick}){
  const [h,setH]=React.useState(false);
  const lit=on||h;
  return (<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:11,padding:"8px 9px",fontSize:13,borderRadius:2,cursor:"pointer",
      background:lit?"var(--active-row)":undefined,color:lit?"var(--ink)":"var(--dim)",transition:"background var(--dur-instant),color var(--dur-instant)"}}>
    <s style={{fontFamily:"var(--font-mono)",fontSize:11,color:primary?"var(--copper)":color||"var(--faint)",textDecoration:"none",width:14,textAlign:"center"}}>{glyph}</s>
    {label}
    {hint&&<b style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ink-ghost)",fontWeight:400}}>{hint}</b>}
  </div>);
}
