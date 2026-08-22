const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const BackStrip=p=>window.AVLHubDesignSystem_5531ba.BackStrip(p);
const VentureHeader=p=>window.AVLHubDesignSystem_5531ba.VentureHeader(p);
const GateRail=p=>window.AVLHubDesignSystem_5531ba.GateRail(p);
const VentureTabs=p=>window.AVLHubDesignSystem_5531ba.VentureTabs(p);
const Lane=p=>window.AVLHubDesignSystem_5531ba.Lane(p);
const KanbanColumn=p=>window.AVLHubDesignSystem_5531ba.KanbanColumn(p);
const TaskCard=p=>window.AVLHubDesignSystem_5531ba.TaskCard(p);

const STAGE_ORDER=['Meet','Validate','Build','Form','Grow'];

function VentureScreen({name,onBack,onNavigate,onNewVenture,onJump,onMenuSelect}){
  const v=AVL_DATA.ventures[name];
  const [tab,setTab]=React.useState('Overview');
  const [dstate,setDstate]=React.useState('Data');
  const nowIdx=STAGE_ORDER.indexOf(v.stage);
  const checklist=AVL_DATA.gatesFor(name);
  const nextGate=checklist.find(g=>!g.done);
  const gates=STAGE_ORDER.map((st,i)=>({stage:st,
    label:i<nowIdx?'Cleared'
      :i===nowIdx?(v.fresh?'No gates cleared yet':nextGate?nextGate.label:'All gates cleared')
      :'Locked',
    state:i<nowIdx?'done':i===nowIdx?'now':undefined}));
  const tasks=AVL_DATA.tasksFor(name);
  const counts={Docs:AVL_DATA.countFor(name,'Docs'),Notes:AVL_DATA.countFor(name,'Notes'),
    Tasks:AVL_DATA.countFor(name,'Tasks'),Calendar:AVL_DATA.countFor(name,'Calendar'),
    Decisions:AVL_DATA.countFor(name,'Decisions')};
  return (<>
    <AppBar dimmed onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <BackStrip current={name} color={v.color} onBack={onBack} />
    <VentureHeader name={name} color={v.color} sub={v.sub} stage={v.stage} stageMeta={v.stageMeta}
      tags={[{label:v.stake?v.stake+' AVL stake':'AVL venture'},{label:v.founder},{label:v.days||'19 days in stage',hot:!v.fresh}]} />
    <GateRail gates={gates} />
    <VentureTabs accent={v.color} active={tab} onSelect={setTab} scope={name+' only'}
      tabs={[{label:'Overview'},{label:'Docs',count:counts.Docs},{label:'Notes',count:counts.Notes},{label:'Tasks',count:counts.Tasks},{label:'Calendar',count:counts.Calendar},{label:'Decisions',count:counts.Decisions}]} />
    {(tab==='Overview'||tab==='Docs'||tab==='Decisions')&&!v.fresh&&
      <StateSwitch label={tab+' · '+name} state={dstate} onChange={setDstate} />}
    {tab==='Tasks'&&!tasks.length&&<div style={{padding:22}}>
      <div style={{border:'1px dashed var(--line)',borderRadius:2,padding:'26px 18px',textAlign:'center'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-ghost3)'}}>No tasks yet</div>
        <div style={{fontSize:12,color:'var(--faint)',marginTop:9}}>Tasks appear here as you create them, from a lane or from a /task block in a note.</div>
      </div></div>}
    {tab==='Tasks'&&!!tasks.length&&<div style={{padding:14}}>
      {AVL_DATA.lanes.filter(l=>tasks.some(t=>t.lane===l.name)).map((l,li)=>(
        <Lane key={l.name} name={l.name} color={l.color} count={tasks.filter(t=>t.lane===l.name).length} rise={li}>
          {AVL_DATA.columns.map(cn=>(<KanbanColumn key={cn} label={cn}>
            {tasks.filter(t=>t.lane===l.name&&t.col===cn).map(t=>
              <TaskCard key={t.title} title={t.title} who={t.who} note={t.note} due={t.due}
                fromNote={t.fromNote} done={t.done} color={t.color||l.color} />)}
          </KanbanColumn>))}
        </Lane>))}</div>}
    {tab==='Overview'&&<OverviewTab state={v.fresh?'Empty':dstate} color={v.color} venture={name} />}
    {tab==='Docs'&&<div style={{paddingTop:14}}><DocsTab state={v.fresh?'Empty':dstate} venture={name} /></div>}
    {tab==='Decisions'&&<DecisionsTab state={v.fresh?'Empty':dstate} venture={name} />}
    {(tab==='Notes'||tab==='Calendar')&&
      <div style={{padding:'60px 22px',fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-ghost)'}}>
        {tab} — filtered view of the level-1 pile, see the {tab} screen</div>}
  </>);
}
Object.assign(window,{VentureScreen});
