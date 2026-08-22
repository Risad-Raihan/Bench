const DecisionRow=p=>window.AVLHubDesignSystem_5531ba.DecisionRow(p);
const ActionButton=p=>window.AVLHubDesignSystem_5531ba.ActionButton(p);
const EmptyState=p=>window.AVLHubDesignSystem_5531ba.EmptyState(p);
const SkeletonRow=p=>window.AVLHubDesignSystem_5531ba.SkeletonRow(p);
const GroupHeader=p=>window.AVLHubDesignSystem_5531ba.GroupHeader(p);

const DECISIONS=[
  {decision:'No exclusivity in the ImmiClaw term sheet',date:'18 AUG',who:'Saif Rashid',venture:'ImmiClaw',ventureColor:'var(--magenta)',source:'Call with Tunde',
   rationale:'Six months Lagos-only would cap us before we know if the model works. We keep the pilot, we lose the guarantee, and we revisit the question at ten paying agencies.'},
  {decision:'45% AVL stake, agreed in principle',date:'11 AUG',who:'Saif Rashid',venture:'ImmiClaw',ventureColor:'var(--magenta)',source:'Founder call',
   rationale:'Founder keeps operational control, AVL carries build and GTM for the first two quarters. Standard for a Validate-stage venture we are staffing ourselves.'},
  {decision:'Nigeria before Ghana',date:'09 AUG',who:'Mufassal Siddique',venture:'ImmiClaw',ventureColor:'var(--magenta)',
   rationale:'Three warm agencies in Lagos against none in Accra. Ghana stays on the map for Q1 once the parser handles two document standards.'},
  {decision:'Ship Dikkha 2.4 without the offline pack',date:'15 AUG',who:'Risad Mahmud',venture:'Dikkha AI',ventureColor:'var(--violet)',source:'Release review',
   rationale:'Offline caching adds two weeks and the SSC season starts in September. It goes into 2.5, behind a flag, once the release is out.'},
  {decision:'Pass on the logistics venture',date:'09 AUG',who:'Risad Mahmud',venture:'Unfiled',
   rationale:'No AI leverage in the workflow and the margin sits with the fleet owner, not the software. Good business, wrong studio.'},
  {decision:'Chhar stays on Play only until 5K installs',date:'04 AUG',who:'Mufassal Siddique',venture:'Chhar',ventureColor:'var(--teal)',
   rationale:'iOS review overhead is not worth it below five thousand installs. Revisit when the deals feed is stable for a full month.'}
];

function DecisionsList({items,grouped=false,state='Data',title,onLog}){
  const [open,setOpen]=React.useState(items[0]&&items[0].decision);
  if(state==='Loading') return (<div>{[0,1,2,3,4].map(i=><SkeletonRow key={i} cols={['14px','1fr','150px','130px','70px']} pad="11px 22px" />)}</div>);
  if(state==='Empty') return (<div style={{padding:22}}>
    <EmptyState hint="A decision is logged from the /decision block in a note, or straight from this page. Every one keeps its rationale." action="+ Log a decision">No decisions logged yet</EmptyState></div>);
  const row=d=><DecisionRow key={d.decision} {...d} venture={grouped?undefined:d.venture} expanded={open===d.decision} onToggle={()=>setOpen(o=>o===d.decision?null:d.decision)} />;
  if(!grouped) return <div>{items.map(row)}</div>;
  const groups=[...new Set(items.map(d=>d.venture))];
  return (<div>{groups.map(g=>(<React.Fragment key={g}>
    <GroupHeader label={g} count={items.filter(d=>d.venture===g).length} />
    {items.filter(d=>d.venture===g).map(row)}
  </React.Fragment>))}</div>);
}

function DecisionsTab({state='Data',venture='ImmiClaw'}){
  const items=DECISIONS.filter(d=>d.venture===venture);
  return (<div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 22px'}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--faint)'}}>
        {state==='Empty'?'0':items.length} decisions logged · newest first</div>
      <ActionButton>+ Log a decision</ActionButton>
    </div>
    <DecisionsList items={items} state={items.length?state:'Empty'} />
  </div>);
}
Object.assign(window,{DecisionsTab,DecisionsList,DECISIONS});
