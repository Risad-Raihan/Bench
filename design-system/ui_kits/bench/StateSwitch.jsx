const FilterBar=p=>window.AVLHubDesignSystem_5531ba.FilterBar(p);
function StateSwitch({state,onChange,label}){
  return (<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 22px 0'}}>
    <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--faint)'}}>{label}</div>
    <FilterBar filters={['Data','Empty','Loading']} active={state} onSelect={onChange} />
  </div>);
}
Object.assign(window,{StateSwitch});
