const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const ActionButton=p=>window.AVLHubDesignSystem_5531ba.ActionButton(p);
const FilterBar=p=>window.AVLHubDesignSystem_5531ba.FilterBar(p);

function DecisionsScreen({onNavigate,onNewVenture,onJump,onMenuSelect}){
  const [state,setState]=React.useState('Data');
  return (<>
    <AppBar active="Decisions" onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:22}}>
      <div><h3 style={{fontSize:25,fontWeight:600,letterSpacing:'-.025em',margin:0}}>Decisions</h3>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--faint)',letterSpacing:'.08em',marginTop:6}}>6 LOGGED · 4 VENTURES · NEWEST FIRST</div></div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <FilterBar filters={['Data','Empty','Loading']} active={state} onSelect={setState} />
        <ActionButton>+ Log a decision</ActionButton>
      </div>
    </div>
    <DecisionsList items={DECISIONS} grouped state={state} />
  </>);
}
Object.assign(window,{DecisionsScreen});
