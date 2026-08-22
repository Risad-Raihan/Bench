const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const NoteEditor=p=>window.AVLHubDesignSystem_5531ba.NoteEditor(p);
const NoteBlock=p=>window.AVLHubDesignSystem_5531ba.NoteBlock(p);
const NoteQuote=p=>window.AVLHubDesignSystem_5531ba.NoteQuote(p);
const TaskBlock=p=>window.AVLHubDesignSystem_5531ba.TaskBlock(p);
const SlashMenu=p=>window.AVLHubDesignSystem_5531ba.SlashMenu(p);

const VENTURE_ORDER=['ImmiClaw','Dikkha AI','Chhar','Eloy Lab'];
const sidebar=()=>{
  const unfiled=AVL_DATA.notes.filter(n=>!n.venture&&!n.pinned);
  return [
    {label:'Pinned',items:AVL_DATA.notes.filter(n=>n.pinned||n.title==='Call with Tunde, 18 Aug')
      .map(n=>({label:n.title,color:n.venture?AVL_DATA.ventures[n.venture].color:'var(--copper)'}))},
    {label:'By venture',items:VENTURE_ORDER.map(v=>({
      label:v+' · '+AVL_DATA.notes.filter(n=>n.venture===v).length,color:AVL_DATA.ventures[v].color}))},
    {label:'Unfiled · '+unfiled.length,items:unfiled.map(n=>({label:n.title}))}
  ];
};

function NotesScreen({onNavigate,onNewVenture,onJump,onMenuSelect}){
  const [note,setNote]=React.useState('Call with Tunde');
  const [termsheet,setTermsheet]=React.useState(false);
  const [onePager,setOnePager]=React.useState(true);
  const [slash,setSlash]=React.useState(true);
  return (<>
    <AppBar active="Notes" onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <NoteEditor sidebarGroups={sidebar()} activeNote={note} onSelectNote={setNote}
      crumbs={<>Notes <span style={{color:'var(--ink-ghost)'}}>/</span> <em style={{fontStyle:'normal',color:'var(--magenta)'}}>ImmiClaw</em> <span style={{color:'var(--ink-ghost)'}}>/</span> {note}</>}
      title={note==='Call with Tunde'?'Call with Tunde, 18 Aug':note}
      byline="SAIF RASHID · EDITED 2H AGO · 3 LINKED TASKS"
      meta={[{label:'Venture',value:'ImmiClaw',color:'var(--magenta-label)'},{label:'Mentions',value:'Dikkha AI, Chhar'},
        {label:'Tasks created',links:['Draft term sheet','Send one pager','Agent shortlist']},
        {label:'From meeting',links:['Tunde intro call · 18 Aug']},{label:'History',value:'12 versions',color:'var(--faint)'}]}>
      <NoteBlock rise={0}><p style={{fontSize:14.5,lineHeight:1.75,color:'var(--body-ink)',margin:0}}>He has three agencies ready to pilot in Lagos, all currently doing document review by hand. Two of them already pay for a CRM, so budget exists.</p></NoteBlock>
      <NoteBlock rise={1}><NoteQuote>The exclusivity ask is the real negotiation. Six months Lagos-only would cap us before we know if the model works.</NoteQuote></NoteBlock>
      <NoteBlock rise={2}><div style={{fontSize:18,fontWeight:600,letterSpacing:'-.02em',marginTop:14}}>What we agreed</div></NoteBlock>
      <NoteBlock><TaskBlock label="Draft term sheet without the exclusivity clause" pill="Capital · SR" done={termsheet} onToggle={()=>setTermsheet(v=>!v)} /></NoteBlock>
      <NoteBlock><TaskBlock label="Send him the AVL one pager" pill="GTM · MS" pillColor="var(--magenta)" done={onePager} onToggle={()=>setOnePager(v=>!v)} /></NoteBlock>
      <NoteBlock><p onClick={()=>setSlash(s=>!s)} style={{color:'var(--ink-ghost)',fontSize:14.5,margin:0,cursor:'text'}}>/task</p></NoteBlock>
      {slash&&<SlashMenu items={[{glyph:'☑',label:'Task',hint:'creates a card',on:true},{glyph:'#',label:'Heading'},{glyph:'❝',label:'Quote'},{glyph:'@',label:'Mention a venture'},{glyph:'⧉',label:'Embed doc'},{glyph:'⚑',label:'Decision',hint:'logs it'}]} />}
    </NoteEditor>
  </>);
}
Object.assign(window,{NotesScreen});
