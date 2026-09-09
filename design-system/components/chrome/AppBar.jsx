import React from "react";
import { Avatar } from "../media/Avatar.jsx";
export function AppBar({items=["Pipeline","My work","Notes","Calendar","Decisions"],active="Pipeline",dimmed=false,mark="B",avatar,accountName,onNavigate,onNewVenture,onJump,newLabel="+ New venture",jumpLabel="Jump to",jumpKey="⌘K",menuItems=["Profile","Settings","Log out"],onMenuSelect,unreadCount,unreadMenu}){
  const [nh,setNh]=React.useState(false);
  const [open,setOpen]=React.useState(false);
  const [inbox,setInbox]=React.useState(false);
  const [hov,setHov]=React.useState(null);
  const wrap=React.useRef(null);
  const unreadWrap=React.useRef(null);
  React.useEffect(()=>{if(!open)return;
    const away=e=>{if(wrap.current&&!wrap.current.contains(e.target))setOpen(false)};
    const esc=e=>{if(e.key==="Escape")setOpen(false)};
    document.addEventListener("mousedown",away);document.addEventListener("keydown",esc);
    return()=>{document.removeEventListener("mousedown",away);document.removeEventListener("keydown",esc)};},[open]);
  React.useEffect(()=>{if(!inbox)return;
    const away=e=>{if(unreadWrap.current&&!unreadWrap.current.contains(e.target))setInbox(false)};
    const esc=e=>{if(e.key==="Escape")setInbox(false)};
    document.addEventListener("mousedown",away);document.addEventListener("keydown",esc);
    return()=>{document.removeEventListener("mousedown",away);document.removeEventListener("keydown",esc)};},[inbox]);
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"11px 16px",borderBottom:"1px solid var(--line)",background:"var(--bg2)"}}>
      <div ref={wrap} style={{position:"relative",flex:"none"}}>
        <div onClick={()=>setOpen(o=>!o)} title={accountName||"Account"}
          style={{borderRadius:2,cursor:"pointer",display:"grid",placeItems:"center",boxShadow:open?"0 0 0 3px var(--copper-wash)":"none",transition:"box-shadow var(--dur-fast)"}}>
          {avatar
            ?<Avatar avatar={avatar} name={accountName} size={20}/>
            :<span style={{width:19,height:19,background:"var(--copper)",borderRadius:2,display:"grid",placeItems:"center",fontSize:11,fontWeight:700,color:"var(--on-copper)",fontFamily:"var(--font-mono)"}}>{mark}</span>}
        </div>
        {open&&<div style={{position:"absolute",top:"calc(100% + 10px)",left:0,minWidth:158,background:"var(--bg2)",border:"1px solid var(--line)",borderRadius:3,boxShadow:"var(--shadow-menu)",padding:"4px 0",zIndex:60}}>
          {menuItems.map((mi,i)=><div key={mi}
            onMouseEnter={()=>setHov(mi)} onMouseLeave={()=>setHov(null)}
            onClick={()=>{setOpen(false);onMenuSelect&&onMenuSelect(mi)}}
            style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",padding:"8px 13px",cursor:"pointer",whiteSpace:"nowrap",
              borderTop:i===menuItems.length-1&&menuItems.length>1?"1px solid var(--line)":"none",marginTop:i===menuItems.length-1&&menuItems.length>1?4:0,paddingTop:i===menuItems.length-1&&menuItems.length>1?12:8,
              color:hov===mi?"var(--ink)":"var(--faint)",background:hov===mi?"var(--copper-wash)":"transparent",transition:"color var(--dur-fast),background var(--dur-fast)"}}>{mi}</div>)}
        </div>}
      </div>
      <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--faint)",display:"flex",gap:20}}>
        {items.map(it=>{const on=!dimmed&&it===active;return (
          <span key={it} onClick={()=>onNavigate&&onNavigate(it)} style={{cursor:"pointer",transition:"color var(--dur-base)",position:"relative",whiteSpace:"nowrap",color:on?"var(--ink)":undefined,fontWeight:on?500:undefined}}>
            {it}{on&&<span style={{position:"absolute",left:0,right:0,bottom:-13,height:1,background:"var(--copper)"}}/>}
          </span>);})}
      </div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
        {onNewVenture&&<div onClick={onNewVenture} onMouseEnter={()=>setNh(true)} onMouseLeave={()=>setNh(false)}
          style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",padding:"5px 11px",borderRadius:2,cursor:"pointer",
            border:"1px solid var(--copper)",color:"var(--copper)",background:nh?"var(--copper-tint)":"var(--copper-wash)",transition:"background var(--dur-fast)",
            whiteSpace:"nowrap",flex:"none"}}>{newLabel}</div>}
        {unreadCount!=null&&<div ref={unreadWrap} style={{position:"relative",flex:"none"}}>
          <div title="Unread" aria-label={`${unreadCount} unread`}
            onClick={()=>unreadMenu&&setInbox(o=>!o)}
            style={{fontFamily:"var(--font-mono)",fontSize:11,fontVariantNumeric:"tabular-nums",padding:"5px 10px",borderRadius:2,
              border:"1px solid var(--line)",color:unreadCount>0?"var(--amber)":"var(--faint)",cursor:unreadMenu?"pointer":undefined}}>{unreadCount}</div>
          {inbox&&unreadMenu}
        </div>}
        <div onClick={onJump} style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--faint)",border:"1px solid var(--line)",padding:"5px 10px",borderRadius:2,display:"flex",gap:26,cursor:"pointer",whiteSpace:"nowrap",flex:"none"}}><span>{jumpLabel}</span><kbd>{jumpKey}</kbd></div>
      </div>
    </div>);
}
