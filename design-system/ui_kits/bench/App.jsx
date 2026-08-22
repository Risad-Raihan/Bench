const TWEAK_DEFAULTS=/*EDITMODE-BEGIN*/{
  "cardStyle": "full",
  "stagger": true
}/*EDITMODE-END*/;

function App(){
  const [t,setTweak]=useTweaks(TWEAK_DEFAULTS);
  const [accountMsg,setAccountMsg]=React.useState(null);
  React.useEffect(()=>{if(!accountMsg)return;const id=setTimeout(()=>setAccountMsg(null),2200);return()=>clearTimeout(id);},[accountMsg]);
  const [view,setView]=React.useState('Pipeline');
  const [venture,setVenture]=React.useState(null);
  const [modal,setModal]=React.useState(false);
  const [palette,setPalette]=React.useState(false);
  const nav=v=>{if(venture)return;setView(v);};
  const openNew=()=>{setPalette(false);setModal(true);};
  React.useEffect(()=>{
    const h=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(p=>!p);}
      else if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='n'){e.preventDefault();openNew();}
      else if(e.key==='Escape'){setPalette(false);setModal(false);}
    };
    window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);
  },[]);
  const runCommand=it=>{
    setPalette(false);
    if(it.action==='new-venture')return setModal(true);
    if(it.action==='venture')return setVenture(it.name);
    if(it.action==='notes'){setVenture(null);return setView('Notes');}
    if(it.action==='view'){setVenture(null);return setView(it.view);}
  };
  const bar={onNewVenture:openNew,onJump:()=>setPalette(true),onMenuSelect:it=>setAccountMsg(it)};
  const overlays=<>
    {accountMsg&&<div style={{position:'fixed',left:16,top:52,zIndex:80,fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--faint)',background:'var(--bg2)',border:'1px solid var(--line)',borderRadius:3,padding:'7px 11px'}}>{accountMsg} — not wired yet</div>}
    {palette&&<Palette onClose={()=>setPalette(false)} onRun={runCommand} />}
    {modal&&<NewVentureModal onClose={()=>setModal(false)} onCreate={v=>{
      AVL_DATA.ventures[v.name]={color:v.color,caption:v.line||'No one-liner yet',sub:v.line||'No one-liner yet',
        stage:'Meet',stageMeta:'0 of 6 gates cleared',gates:0,who:'RM',founder:v.founder||'Founder not set',
        days:'Added today',fresh:true};
      if(!AVL_DATA.stages[0].items.includes(v.name))AVL_DATA.stages[0].items.push(v.name);
      AVL_DATA.stages[0].count=String(AVL_DATA.stages[0].items.length).padStart(2,'0');
      setModal(false);setVenture(v.name);
    }} />}
  </>;
  const screen=venture
    ? <VentureScreen name={venture} onBack={()=>setVenture(null)} onNavigate={nav} {...bar} />
    : view==='Notes' ? <NotesScreen onNavigate={nav} {...bar} />
    : view==='My work' ? <MyWorkScreen onNavigate={nav} {...bar} />
    : view==='Calendar' ? <CalendarScreen onNavigate={nav} {...bar} />
    : view==='Decisions' ? <DecisionsScreen onNavigate={nav} {...bar} />
    : <PipelineScreen onOpenVenture={setVenture} onNavigate={nav} {...bar}
        cardStyle={t.cardStyle} stagger={t.stagger} />;
  return <>{screen}{overlays}
    <TweaksPanel>
      <TweakSection label="Pipeline card" />
      <TweakRadio label="Detail" value={t.cardStyle} options={['full','clean']} onChange={v=>setTweak('cardStyle',v)} />
      <TweakSection label="Board" />
      <TweakToggle label="Staggered entrance" value={t.stagger} onChange={v=>setTweak('stagger',v)} />
    </TweaksPanel>
  </>;
}
Object.assign(window,{App});
