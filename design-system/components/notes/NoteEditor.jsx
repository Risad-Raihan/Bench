import React from "react";
export function NoteSidebar({groups=[],active,onSelect}){
  return (<div style={{background:"var(--bg2)",borderRight:"1px solid var(--line)",padding:"14px 0",minHeight:520}}>
    {groups.map(g=>(<div key={g.label}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"var(--faint)",padding:"12px 15px 7px"}}>{g.label}</div>
      {g.items.map(it=><SidebarLink key={it.label} {...it} on={it.label===active} onClick={()=>onSelect&&onSelect(it.label)}/>)}
    </div>))}
  </div>);
}
export function SidebarLink({label,color="var(--ash)",on=false,onClick}){
  const [h,setH]=React.useState(false);
  return (<a onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:8,padding:"6px 15px",fontSize:12.5,textDecoration:"none",cursor:"pointer",
      borderLeft:"2px solid "+(on?"var(--copper)":"transparent"),color:on||h?"var(--ink)":"var(--dim)",background:on?"var(--active-row)":h?"var(--hover-row)":undefined,
      transition:"color var(--dur-fast),background var(--dur-fast)"}}>
    <s style={{width:5,height:5,borderRadius:1,background:color,textDecoration:"none"}}/>{label}</a>);
}
export function NoteBlock({children,rise}){
  const [h,setH]=React.useState(false);
  return (<div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{position:"relative",padding:"5px 0 5px 26px",marginTop:4,borderRadius:2,background:h?"#100c0a":undefined,transition:"background var(--dur-instant)",
      animation:rise!=null?`avl-rise var(--dur-rise) var(--ease-rise) ${rise*0.05}s both`:undefined}}>
    <div style={{position:"absolute",left:0,top:5,display:"flex",gap:2,opacity:h?1:0,transition:"opacity var(--dur-instant)",fontFamily:"var(--font-mono)",fontSize:12,color:"#463b36"}}>⣿ +</div>
    {children}
  </div>);
}
export function NoteQuote({children}){
  return <div style={{borderLeft:"2px solid var(--magenta)",paddingLeft:14,color:"var(--quote-ink)",fontSize:14.5,lineHeight:1.7}}>{children}</div>;
}
export function TaskBlock({label,pill,pillColor="var(--teal)",done=false,onToggle}){
  const [h,setH]=React.useState(false);
  const tint=pillColor==="var(--magenta)"?"var(--magenta-tint)":pillColor==="var(--copper)"?"var(--copper-tint)":pillColor==="var(--amber)"?"var(--amber-tint)":"var(--teal-tint-strong)";
  const ink=pillColor==="var(--magenta)"?"var(--magenta-label)":pillColor==="var(--copper)"?"var(--copper-label)":pillColor==="var(--amber)"?"var(--amber-label)":"var(--teal-label)";
  return (<div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",gap:11,background:"var(--panel)",border:"1px solid var(--line)",borderLeft:"2px solid var(--teal)",padding:"9px 12px"}}>
    <div onClick={onToggle} style={{width:14,height:14,border:"1.5px solid "+(done||h?"var(--teal)":"var(--faint)"),borderRadius:2,flex:"none",display:"grid",placeItems:"center",
      background:done?"var(--teal)":undefined,transition:"border-color var(--dur-base),background var(--dur-base)",cursor:"pointer"}}>
      {done&&<span style={{fontSize:11,color:"var(--on-teal)",fontWeight:700}}>✓</span>}</div>
    <span style={{fontSize:13.5,color:done?"var(--faint)":undefined,textDecoration:done?"line-through":undefined}}>{label}</span>
    {pill&&<span style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",padding:"3px 8px",borderRadius:2,background:tint,color:ink}}>{pill}</span>}
  </div>);
}
export function SlashMenu({items=[],heading="Blocks"}){
  return (<div style={{marginTop:10,marginLeft:26,width:290,background:"var(--panel)",border:"1px solid var(--line2)",borderRadius:3,padding:5,boxShadow:"var(--shadow-menu)"}}>
    <em style={{fontStyle:"normal",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",display:"block",padding:"6px 9px 5px"}}>{heading}</em>
    {items.map(it=>(<div key={it.label} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 9px",fontSize:13,borderRadius:2,
      background:it.on?"#221814":undefined,color:it.on?"var(--ink)":"var(--dim)"}}>
      <s style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--copper)",textDecoration:"none",width:14}}>{it.glyph}</s>{it.label}
      {it.hint&&<b style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,color:"#463b36",fontWeight:400}}>{it.hint}</b>}
    </div>))}
  </div>);
}
export function MetaRail({sections=[]}){
  return (<div style={{borderLeft:"1px solid var(--line)",padding:"16px 15px",background:"var(--bg2)"}}>
    {sections.map((s,i)=>(<div key={s.label}>
      <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--faint)",margin:i===0?"0 0 6px":"16px 0 6px"}}>{s.label}</div>
      {s.links?s.links.map(l=><MetaLink key={l}>{l}</MetaLink>):<div style={{fontSize:12.5,color:s.color||"var(--meta-ink)"}}>{s.value}</div>}
    </div>))}
  </div>);
}
export function MetaLink({children}){
  const [h,setH]=React.useState(false);
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"block",fontSize:12,color:h?"var(--copper)":"var(--dim)",padding:"5px 0",borderBottom:"1px solid var(--line)",cursor:"pointer",transition:"color var(--dur-fast)"}}>{children}</div>;
}

export function NoteEditor({sidebarGroups=[],activeNote,crumbs,title,byline,children,meta=[],onSelectNote}){
  return (<div style={{display:"grid",gridTemplateColumns:"216px 1fr 200px"}}>
    <NoteSidebar groups={sidebarGroups} active={activeNote} onSelect={onSelectNote}/>
    <div style={{padding:"34px 44px 60px",minHeight:520}}>
      {crumbs&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"var(--faint)",marginBottom:16}}>{crumbs}</div>}
      {title&&<h3 style={{fontSize:33,fontWeight:600,letterSpacing:"-.035em",lineHeight:1.15,margin:0}}>{title}</h3>}
      {byline&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",color:"var(--faint)",marginTop:11,paddingBottom:20,borderBottom:"1px solid var(--line)"}}>{byline}</div>}
      {children}
    </div>
    <MetaRail sections={meta}/>
  </div>);
}
