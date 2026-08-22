const CommandPalette=p=>window.AVLHubDesignSystem_5531ba.CommandPalette(p);

function Palette({onClose,onRun}){
  const [q,setQ]=React.useState('');
  const groups=[
    {label:'Actions',items:[
      {glyph:'+',label:'New venture',hint:'⌘N',primary:true,action:'new-venture'},
      {glyph:'☑',label:'New task',hint:'⌘T',action:'noop'},
      {glyph:'⚑',label:'Log a decision',action:'noop'},
      {glyph:'✎',label:'New note',action:'notes'}]},
    {label:'Ventures',items:Object.keys(AVL_DATA.ventures).map(n=>({glyph:'●',label:n,color:AVL_DATA.ventures[n].color,hint:AVL_DATA.ventures[n].stage,action:'venture',name:n}))},
    {label:'Go to',items:[
      {glyph:'▤',label:'Pipeline',action:'view',view:'Pipeline'},
      {glyph:'▤',label:'My work',action:'view',view:'My work'},
      {glyph:'▤',label:'Notes',action:'view',view:'Notes'},
      {glyph:'▤',label:'Calendar',action:'view',view:'Calendar'},
      {glyph:'▤',label:'Decisions',action:'view',view:'Decisions'}]}
  ].map(g=>({...g,items:g.items.filter(i=>!q||i.label.toLowerCase().includes(q.toLowerCase()))})).filter(g=>g.items.length);
  return <CommandPalette query={q} onQuery={setQ} groups={groups} onRun={onRun} onClose={onClose} />;
}
Object.assign(window,{Palette});
