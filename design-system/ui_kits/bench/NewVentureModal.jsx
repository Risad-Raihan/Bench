const Modal=p=>window.AVLHubDesignSystem_5531ba.Modal(p);
const TextField=p=>window.AVLHubDesignSystem_5531ba.TextField(p);
const DropZone=p=>window.AVLHubDesignSystem_5531ba.DropZone(p);
const ActionButton=p=>window.AVLHubDesignSystem_5531ba.ActionButton(p);
const SwatchPicker=p=>window.AVLHubDesignSystem_5531ba.SwatchPicker(p);

function NewVentureModal({onClose,onCreate}){
  const [name,setName]=React.useState('');
  const [line,setLine]=React.useState('');
  const [founder,setFounder]=React.useState('');
  const [color,setColor]=React.useState('var(--copper)');
  const [deck,setDeck]=React.useState(false);
  return (<Modal eyebrow="New venture" title="Add a venture to the pipeline" onClose={onClose} width={520}
    footer={<>
      <ActionButton onClick={()=>onCreate&&onCreate({name:name||'Untitled venture',line,founder,color})}>Create and open</ActionButton>
      <span style={{fontSize:11.5,color:'var(--faint)'}}>Lands in Meet. Everything else is editable later.</span>
    </>}>
    <TextField label="Name" value={name} onChange={setName} placeholder="ImmiClaw" autoFocus />
    <TextField label="One-liner" value={line} onChange={setLine} multiline optional
      placeholder="Study abroad automation for agents across West Africa" />
    <TextField label="Founder" value={founder} onChange={setFounder} placeholder="Tunde Adeyemi" optional />
    <SwatchPicker value={color} onChange={setColor} note="Themes this venture everywhere" />
    <DropZone active={deck} onClick={()=>setDeck(d=>!d)}
      label={deck?'deck.pdf · 2.4 MB':'Drop the deck'}
      hint={deck?'Click to remove · lands in Docs / Diligence':'or click to browse · PDF or PPTX · optional'} />
  </Modal>);
}
Object.assign(window,{NewVentureModal});
