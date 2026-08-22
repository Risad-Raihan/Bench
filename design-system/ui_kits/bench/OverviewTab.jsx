const Panel=p=>window.AVLHubDesignSystem_5531ba.Panel(p);
const SectionLabel=p=>window.AVLHubDesignSystem_5531ba.SectionLabel(p);
const EmptyState=p=>window.AVLHubDesignSystem_5531ba.EmptyState(p);
const Skeleton=p=>window.AVLHubDesignSystem_5531ba.Skeleton(p);
const FactRow=p=>window.AVLHubDesignSystem_5531ba.FactRow(p);
const LinkChip=p=>window.AVLHubDesignSystem_5531ba.LinkChip(p);
const ChecklistRow=p=>window.AVLHubDesignSystem_5531ba.ChecklistRow(p);
const LaneBarRow=p=>window.AVLHubDesignSystem_5531ba.LaneBarRow(p);
const LineRow=p=>window.AVLHubDesignSystem_5531ba.LineRow(p);
const ActivityRow=p=>window.AVLHubDesignSystem_5531ba.ActivityRow(p);

const ovNotes=v=>AVL_DATA.notes.filter(n=>n.venture===v).slice(0,3).map(n=>({label:n.title,meta:n.meta}));

function OverviewTab({state='Data',color='var(--magenta)',venture='ImmiClaw'}){
  const v=AVL_DATA.ventures[venture]||{};
  const ov=AVL_DATA.overview[venture]||{links:[],meetings:[],feed:[]};
  const checklist=AVL_DATA.gatesFor(venture);
  const notes=ovNotes(venture);
  const tasks=AVL_DATA.tasksFor(venture);
  const facts=[
    {k:'Stage',v:v.stage+' · '+(ov.days||'—')},
    {k:'Owner',v:AVL_DATA.owners[v.who]||v.who},
    {k:'AVL stake',v:v.stake||'Not set',mono:!!v.stake},
    {k:'Market',v:ov.market||'Not set'},
    {k:'Founder',v:v.founder||'Not set'},
    {k:'Contact',v:ov.contact||'Not set'}
  ];
  const [gates,setGates]=React.useState(()=>checklist.map(g=>g.done));
  React.useEffect(()=>{setGates(AVL_DATA.gatesFor(venture).map(g=>g.done));},[venture]);
  if(state==='Loading') return (<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,padding:'14px 22px 22px'}}>
    <Panel label="Facts">{[0,1,2,3,4,5].map(i=><div key={i} style={{padding:'8px 0',borderBottom:'1px solid var(--divider)'}}><Skeleton w={i%2?'62%':'44%'} /></div>)}</Panel>
    <div>
      <Panel label="Gate checklist">{[0,1,2,3].map(i=><div key={i} style={{padding:'8px 0',borderBottom:'1px solid var(--divider)'}}><Skeleton w="70%" /></div>)}</Panel>
      <Panel label="Open tasks">{[0,1,2,3].map(i=><div key={i} style={{padding:'7px 0'}}><Skeleton h={3} /></div>)}</Panel>
    </div>
  </div>);
  if(state==='Empty') return (<div style={{padding:'22px'}}>
    <EmptyState hint="Add the founder, the market and the stake, and this page starts filling itself from the work you do." action="+ Add venture facts">Nothing recorded yet</EmptyState>
  </div>);
  return (<div style={{padding:'14px 22px 22px'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,alignItems:'start'}}>
      <div>
        <Panel label="Facts">{facts.map(f=><FactRow key={f.k} k={f.k} v={f.v} mono={f.mono} />)}</Panel>
        <Panel label="Links">{ov.links.length
          ? <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{ov.links.map(l=><LinkChip key={l}>{l}</LinkChip>)}</div>
          : <div style={{fontSize:12,color:'var(--ink-ghost3)'}}>No links yet</div>}</Panel>
        <Panel label="Activity" right={ov.feed.length} flush>
          {ov.feed.map(a=><ActivityRow key={a.text} {...a} compact />)}
        </Panel>
      </div>
      <div>
        <Panel label={v.stage+' gates'} right={gates.filter(Boolean).length+'/'+checklist.length}>
          {checklist.map((g,i)=><ChecklistRow key={g.label} label={g.label} by={gates[i]?(g.by||v.who):''} done={gates[i]}
            onToggle={()=>setGates(s=>s.map((x,j)=>j===i?!x:x))} />)}
        </Panel>
        <Panel label="Open tasks" right={tasks.filter(t=>!t.done).length}>
          {AVL_DATA.lanes.map(l=><LaneBarRow key={l.name} lane={l.name} color={l.color}
            open={tasks.filter(t=>t.lane===l.name&&!t.done).length} />)}
        </Panel>
        <Panel label="Next meetings">{ov.meetings.length
          ? ov.meetings.map(m=><LineRow key={m.label} {...m} color={color} />)
          : <div style={{fontSize:12,color:'var(--ink-ghost3)'}}>Nothing scheduled</div>}</Panel>
        <Panel label="Recent notes" right={AVL_DATA.notes.filter(n=>n.venture===venture).length}>{notes.length
          ? notes.map(n=><LineRow key={n.label} {...n} color={color} />)
          : <div style={{fontSize:12,color:'var(--ink-ghost3)'}}>No notes yet</div>}</Panel>
      </div>
    </div>
  </div>);
}
Object.assign(window,{OverviewTab});
