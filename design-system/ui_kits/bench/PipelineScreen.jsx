const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const PageHeader=p=>window.AVLHubDesignSystem_5531ba.PageHeader(p);
const PipelineBoard=p=>window.AVLHubDesignSystem_5531ba.PipelineBoard(p);
const StageColumn=p=>window.AVLHubDesignSystem_5531ba.StageColumn(p);
const VentureCard=p=>window.AVLHubDesignSystem_5531ba.VentureCard(p);
const ActionButton=p=>window.AVLHubDesignSystem_5531ba.ActionButton(p);

function PipelineScreen({onOpenVenture,onNavigate,onNewVenture,onJump,onMenuSelect,cardStyle="full",stagger=true}){
  const clean=cardStyle==="clean";
  return (<>
    <AppBar active="Pipeline" onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <PageHeader title="Pipeline" right={<ActionButton onClick={onNewVenture}>+ New venture</ActionButton>} />
    <PipelineBoard>
      {AVL_DATA.stages.map(col=>(
        <StageColumn key={col.stage} stage={col.stage} count={col.count} progress={col.progress} color={col.color}>
          {col.items.map((name,i)=>{const v=AVL_DATA.ventures[name];return (
            <VentureCard key={name} name={name} caption={v.caption} color={v.color} gates={v.gates} who={v.who}
              founder={v.founder} flag={v.flag} rise={stagger?i:undefined} showGates={!clean} showMeta={!clean}
              onClick={()=>onOpenVenture(name)} />);})}
          {col.add&&<div style={{border:'1px dashed var(--line)',padding:9,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-ghost3)'}}>{col.add}</div>}
        </StageColumn>))}
    </PipelineBoard>
  </>);
}
Object.assign(window,{PipelineScreen});
