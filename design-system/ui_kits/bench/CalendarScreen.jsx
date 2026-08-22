const AppBar=p=>window.AVLHubDesignSystem_5531ba.AppBar(p);
const FilterBar=p=>window.AVLHubDesignSystem_5531ba.FilterBar(p);
const WeekGrid=p=>window.AVLHubDesignSystem_5531ba.WeekGrid(p);
const DayColumn=p=>window.AVLHubDesignSystem_5531ba.DayColumn(p);
const EventCard=p=>window.AVLHubDesignSystem_5531ba.EventCard(p);
const SyncBar=p=>window.AVLHubDesignSystem_5531ba.SyncBar(p);

const WEEK=[
  {label:'Mon 17',events:[{time:'10:00',title:'Tunde intro call',flag:'Note ready',color:'var(--magenta)'}]},
  {label:'Tue 18',events:[{time:'14:30',title:'Dikkha release review',flag:'Note ready',color:'var(--violet)'},{time:'18:00',title:'Personal · gym',color:'var(--ash)'}]},
  {label:'Wed 19 · today',today:true,events:[{time:'09:30',title:'Partner sync, all four',flag:'Note ready'},{time:'16:00',title:'Buyer interview 3 of 6',flag:'+ Create note',color:'var(--magenta)'}]},
  {label:'Thu 20',events:[{time:'11:00',title:'Eloy Lab, regulatory update',flag:'+ Create note',color:'var(--amber)'}]},
  {label:'Fri 21',events:[{time:'15:00',title:'Term sheet walkthrough',flag:'+ Create note',color:'var(--teal)'}]}
];

function CalendarScreen({onNavigate,onNewVenture,onJump,onMenuSelect}){
  const [scope,setScope]=React.useState('Everyone');
  const [made,setMade]=React.useState({});
  const show=e=>scope==='Everyone'||(scope==='Venture calls'?!!e.flag:e.color!=='var(--ash)');
  return (<>
    <AppBar active="Calendar" onNavigate={onNavigate} onNewVenture={onNewVenture} onJump={onJump} onMenuSelect={onMenuSelect} />
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:22}}>
      <div><h3 style={{fontSize:25,fontWeight:600,letterSpacing:'-.025em',margin:0}}>Week of 17 August</h3>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--faint)',letterSpacing:'.08em',marginTop:6}}>9 MEETINGS · 4 LINKED TO VENTURES</div></div>
      <FilterBar filters={['Everyone','Just me','Venture calls']} active={scope} onSelect={setScope} />
    </div>
    <WeekGrid>
      {WEEK.map(d=>(<DayColumn key={d.label} label={d.label} today={d.today}>
        {d.events.filter(show).map(e=><EventCard key={e.title} {...e}
          flag={made[e.title]?'Note ready':e.flag}
          onClick={()=>e.flag==='+ Create note'&&setMade(m=>({...m,[e.title]:true}))} />)}
      </DayColumn>))}
    </WeekGrid>
    <SyncBar />
  </>);
}
Object.assign(window,{CalendarScreen});
