const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const FilterBar=p=>window.AVLHubDesignSystem_5531ba.FilterBar(p);
const GroupHeader=p=>window.AVLHubDesignSystem_5531ba.GroupHeader(p);
const TaskRow=p=>window.AVLHubDesignSystem_5531ba.TaskRow(p);
const EmptyState=p=>window.AVLHubDesignSystem_5531ba.EmptyState(p);

const LANE_COLOR=n=>(AVL_DATA.lanes.find(l=>l.name===n)||{}).color||'var(--copper)';
const rowsFor=who=>{
  const mine=AVL_DATA.tasks.filter(t=>t.who===who&&!t.done).map(t=>({
    title:t.title,venture:t.venture,ventureColor:(AVL_DATA.ventures[t.venture]||{}).color,
    lane:t.lane,laneColor:LANE_COLOR(t.lane),date:t.due||'—',late:!!t.late}));
  return [
    {group:'Overdue',hot:true,items:mine.filter(r=>r.late)},
    {group:'This week',items:mine.filter(r=>!r.late&&r.date!=='—')},
    {group:'No date',items:mine.filter(r=>!r.late&&r.date==='—')}
  ];
};

function MyWorkScreen({onNavigate,onNewVenture,onJump,onMenuSelect,who='RM'}){
  const ROWS=rowsFor(who);
  const open=ROWS.reduce((n,g)=>n+g.items.length,0);
  const [filter,setFilter]=React.useState('All');
  const [done,setDone]=React.useState({});
  const match=r=>filter==='All'||(filter==='No date'&&r.date==='—')||(filter==='Blocked'&&r.late)||r.lane===filter;
  const shown=ROWS.reduce((n,g)=>n+g.items.filter(match).length,0);
  const firstName=(AVL_DATA.owners[who]||who).split(' ')[0];
  return (<>
    <AppBar active="My work" onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:22}}>
      <div><h3 style={{fontSize:25,fontWeight:600,letterSpacing:'-.025em',margin:0}}>{(AVL_DATA.owners[who]||who).split(' ')[0]}'s work</h3>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--faint)',letterSpacing:'.08em',marginTop:6}}>
          {open} OPEN · {ROWS[1].items.length} DUE THIS WEEK · {ROWS[0].items.length} OVERDUE</div></div>
      <FilterBar filters={['All','Tech','Capital','Blocked','No date']} active={filter} onSelect={setFilter} />
    </div>
    {!shown&&<div style={{padding:22}}>
      <EmptyState hint={open?'Clear the filter to see the other '+open+' open across every venture.':'Nothing is assigned to you right now.'} action={filter==='All'?undefined:'Show all'} onAction={()=>setFilter('All')}>
        {filter==='All'?'No open tasks':filter==='Blocked'?'Nothing overdue or blocked':filter==='No date'?'Everything you own has a date':'No '+filter+' tasks assigned to '+firstName}
      </EmptyState></div>}
    {ROWS.map(g=>{const items=g.items.filter(match);if(!items.length)return null;return (<React.Fragment key={g.group}>
      <GroupHeader label={g.group} count={items.length} hot={g.hot} />
      {items.map(r=><TaskRow key={r.title} {...r} done={!!done[r.title]} onToggle={()=>setDone(d=>({...d,[r.title]:!d[r.title]}))} />)}
    </React.Fragment>);})}
  </>);
}
Object.assign(window,{MyWorkScreen});
