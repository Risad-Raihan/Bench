const AVL_DATA = {
  ventures:{
    ImmiClaw:{color:'var(--magenta)',caption:'Study abroad, Africa',sub:'Study abroad automation for agents across West Africa',stage:'Validate',stageMeta:'4 of 6 gates cleared',gates:4,who:'RN',founder:'Tunde Adeyemi',stake:'45%'},
    'Dikkha AI':{color:'var(--violet)',caption:'SSC study companion',sub:'SSC study companion for Bangladeshi students',stage:'Build',stageMeta:'3 of 6 gates cleared',gates:3,who:'MS',founder:'Nusrat Jahan',stake:'30%'},
    Chhar:{color:'var(--teal)',caption:'Deals app, live on Play',sub:'Deals and coupons app, live on Play',stage:'Grow',stageMeta:'5 of 6 gates cleared',gates:5,who:'MS',founder:'Arif Hossain',stake:'25%'},
    'Eloy Lab':{color:'var(--amber)',caption:'Bank reporting agent, BD',sub:'Bank reporting agent for Bangladeshi banks',stage:'Meet',stageMeta:'2 of 6 gates cleared',gates:2,who:'RM',founder:'Shahriar Kabir',flag:'STALE 14D'},
    'Medical BOT':{color:'var(--venture-clay)',caption:'FCPS admission prep',sub:'FCPS admission prep companion',stage:'Meet',stageMeta:'1 of 6 gates cleared',gates:1,who:'SR',founder:'Dr. Farhana Islam'},
    Berai:{color:'var(--venture-steel)',caption:'Private beta',sub:'Private beta, invite only',stage:'Build',stageMeta:'2 of 6 gates cleared',gates:2,who:'RM',founder:'Imran Chowdhury',stake:'15%'}
  },
  docs:[
    {name:'Lagos market memo.pdf',venture:'ImmiClaw',type:'PDF',size:'1.2 MB',who:'RN',date:'18 AUG',folder:'Diligence',preview:'PDF preview · page 1 of 9',
     versions:[{version:2,who:'RN',date:'16 AUG',note:'Added agent interview quotes'},{version:1,who:'RN',date:'14 AUG',note:'First draft'}]},
    {name:'Agent workflow screens.png',venture:'ImmiClaw',type:'PNG',size:'840 KB',who:'MS',date:'17 AUG',folder:'Product',preview:'Image preview · 2400 × 1600',versions:[]},
    {name:'Term sheet draft.docx',venture:'ImmiClaw',type:'DOCX',size:'96 KB',who:'SR',date:'15 AUG',folder:'Legal',
     versions:[{version:1,who:'SR',date:'13 AUG',note:'From the Capital lane task'}]},
    {name:'Buyer interview notes.pdf',venture:'ImmiClaw',type:'PDF',size:'340 KB',who:'MS',date:'14 AUG',folder:'Diligence',preview:'PDF preview · page 1 of 3',versions:[]},
    {name:'Pricing model.xlsx',venture:'ImmiClaw',type:'XLSX',size:'58 KB',who:'RN',date:'12 AUG',folder:'Diligence',
     versions:[{version:3,who:'RN',date:'12 AUG',note:'Per-agent tier'},{version:2,who:'RN',date:'11 AUG',note:'Flat fee scenario'},{version:1,who:'RN',date:'09 AUG',note:'First cut'}]},
    {name:'Cap table, pre-seed.xlsx',venture:'ImmiClaw',type:'XLSX',size:'44 KB',who:'SR',date:'11 AUG',folder:'Legal',versions:[]},
    {name:'Applicant file schema.png',venture:'ImmiClaw',type:'PNG',size:'210 KB',who:'RM',date:'10 AUG',folder:'Product',preview:'Image preview · 1600 × 900',versions:[]}
  ],
  overview:{
    ImmiClaw:{market:'West Africa, Nigeria first',contact:'tunde@immiclaw.co',days:'19 days',
      links:['Repo','Figma','Granola','Drive'],
      meetings:[{label:'Buyer interview 3 of 6',meta:'TODAY 16:00'},{label:'Term sheet walkthrough',meta:'FRI 15:00'}],
      feed:[{who:'RN',text:'Moved ImmiClaw from Meet to Validate',when:'2H',color:'var(--magenta)'},
        {who:'MS',text:'Completed Send the AVL one pager',when:'6H',color:'var(--teal)'},
        {who:'SR',text:'Added note Call with Tunde, 18 Aug',when:'1D',color:'var(--violet)'},
        {who:'RN',text:'Uploaded Lagos market memo.pdf, v3',when:'2D',color:'var(--copper)'},
        {who:'MS',text:'Cleared gate Competitor scan',when:'3D',color:'var(--teal)'},
        {who:'SR',text:'Logged decision No exclusivity in the term sheet',when:'4D',color:'var(--amber)'}]},
    'Dikkha AI':{market:'Bangladesh, SSC cohort',contact:'nusrat@dikkha.ai',days:'34 days',
      links:['Repo','Play Store','Drive'],
      meetings:[{label:'Release review, 2.4',meta:'TUE 14:30'}],
      feed:[{who:'RM',text:'Logged decision Ship 2.4 without the offline pack',when:'5D',color:'var(--amber)'},
        {who:'MS',text:'Added note SSC syllabus coverage',when:'7D',color:'var(--violet)'},
        {who:'RM',text:'Cleared gate MVP shipped internally',when:'9D',color:'var(--teal)'}]},
    Chhar:{market:'Bangladesh, urban deals',contact:'arif@chhar.app',days:'62 days',
      links:['Repo','Play Store','Drive'],
      meetings:[{label:'Merchant pricing review',meta:'THU 12:00'}],
      feed:[{who:'MS',text:'Added note Deals feed reliability',when:'1D',color:'var(--violet)'},
        {who:'MS',text:'Cleared gate Retention cohort positive',when:'11D',color:'var(--teal)'},
        {who:'MS',text:'Logged decision Play only until 5K installs',when:'17D',color:'var(--amber)'}]},
    'Eloy Lab':{market:'Bangladesh, tier-1 banks',contact:'shahriar@eloylab.co',days:'14 days',
      links:['Granola'],
      meetings:[{label:'Regulatory update',meta:'THU 11:00'}],
      feed:[{who:'RM',text:'Added note Regulatory timeline, BB',when:'3D',color:'var(--violet)'},
        {who:'RM',text:'Cleared gate Thesis fit written up',when:'14D',color:'var(--teal)'}]},
    'Medical BOT':{market:'Bangladesh, FCPS candidates',contact:'farhana@medicalbot.co',days:'6 days',
      links:['Granola'],
      meetings:[],
      feed:[{who:'SR',text:'Cleared gate Founder call logged',when:'6D',color:'var(--teal)'}]},
    Berai:{market:'Bangladesh, invite only',contact:'imran@berai.co',days:'21 days',
      links:['Repo','Figma'],
      meetings:[{label:'Beta cohort check-in',meta:'WED 17:00'}],
      feed:[{who:'RM',text:'Cleared gate Scope locked',when:'8D',color:'var(--teal)'},
        {who:'RM',text:'Added note Supabase or Neon',when:'12D',color:'var(--violet)'}]}
  },
  lanes:[{name:'Thesis',color:'var(--amber)'},{name:'Tech',color:'var(--copper)'},{name:'GTM',color:'var(--magenta)'},{name:'Capital',color:'var(--teal)'}],
  columns:['To do','Doing','Blocked','Done'],
  tasks:[
    {venture:'ImmiClaw',lane:'Thesis',col:'To do',title:'Write the Lagos market memo',who:'RN',due:'26 AUG'},
    {venture:'ImmiClaw',lane:'Thesis',col:'Done',title:'Check against our AI thesis',who:'RN',note:'15 AUG',done:true},
    {venture:'ImmiClaw',lane:'Tech',col:'To do',title:'Scope MVP auth and agent roles',who:'RM',due:'24 AUG'},
    {venture:'ImmiClaw',lane:'Tech',col:'To do',title:'Doc parser benchmark, 3 options',who:'RM'},
    {venture:'ImmiClaw',lane:'Tech',col:'Doing',title:'Data model for applicant files',who:'RM',fromNote:true},
    {venture:'ImmiClaw',lane:'Tech',col:'Blocked',title:'Sandbox access from agency',who:'RM',due:'2D LATE',late:true,color:'var(--amber)'},
    {venture:'ImmiClaw',lane:'GTM',col:'To do',title:'Shortlist 10 Nigerian agents',who:'MS'},
    {venture:'ImmiClaw',lane:'GTM',col:'Doing',title:'Buyer interview 3 of 6',who:'MS',due:'TODAY'},
    {venture:'ImmiClaw',lane:'GTM',col:'Done',title:'Send the AVL one pager',who:'MS',fromNote:true,done:true},
    {venture:'ImmiClaw',lane:'Capital',col:'To do',title:'Draft term sheet, no exclusivity',who:'SR',fromNote:true},
    {venture:'ImmiClaw',lane:'Capital',col:'Done',title:'Agree 45% split in principle',who:'SR',note:'11 AUG',done:true},
    {venture:'Dikkha AI',lane:'Tech',col:'To do',title:'Cut the Play Store release for 2.4',who:'RM',due:'25 AUG'},
    {venture:'Dikkha AI',lane:'Tech',col:'Doing',title:'Offline pack behind a flag',who:'RM'},
    {venture:'Dikkha AI',lane:'GTM',col:'To do',title:'Tutor outreach, Khulna',who:'MS'},
    {venture:'Dikkha AI',lane:'Thesis',col:'Done',title:'SSC syllabus coverage check',who:'MS',note:'12 AUG',done:true},
    {venture:'Chhar',lane:'Tech',col:'Doing',title:'Deals feed reliability fix',who:'RM',due:'28 AUG'},
    {venture:'Chhar',lane:'GTM',col:'To do',title:'Merchant pricing tiers',who:'MS'},
    {venture:'Chhar',lane:'Capital',col:'To do',title:'Model unit economics at 5K',who:'SR'},
    {venture:'Eloy Lab',lane:'Thesis',col:'To do',title:"Review Eloy Lab's regulatory timeline",who:'RM'},
    {venture:'Eloy Lab',lane:'GTM',col:'Blocked',title:'Waiting on bank intro',who:'MS',due:'9D WAIT',color:'var(--amber)'},
    {venture:'Berai',lane:'Tech',col:'To do',title:'Decide Supabase or Neon for scale up',who:'RM',due:'27 AUG'},
    {venture:'Berai',lane:'Tech',col:'Doing',title:'Invite flow for the private beta',who:'RM'},
    {venture:'Medical BOT',lane:'Thesis',col:'To do',title:'FCPS question bank licensing',who:'SR'}
  ],
  owners:{RN:'Rashedun Nabi',MS:'Mufassal Siddique',SR:'Saif Rashid',RM:'Risad Mahmud'},
  gateChecklists:{
    Meet:['Founder call logged','Thesis fit written up','Reference check','Founding team mapped','Cap table reviewed','Studio fit agreed'],
    Validate:['Market memo drafted','Competitor scan','Buyer interviews','Pricing validated','Willingness to pay tested','Design partner signed'],
    Build:['Scope locked','MVP shipped internally','First pilot live','Instrumentation in place','Support loop defined','Pilot feedback reviewed'],
    Form:['Entity registered','Cap table executed','IP assigned','Bank account open','Founder agreements signed','Board cadence set'],
    Grow:['Paid acquisition tested','Retention cohort positive','Unit economics modelled','Hiring plan agreed','Next round narrative','Ops handover done']
  },
  docFolders:['Diligence','Legal','Product','Unfiled'],
  notes:[
    {title:'Call with Tunde, 18 Aug',venture:'ImmiClaw',meta:'2H'},
    {title:'Lagos pricing scratch',venture:'ImmiClaw',meta:'3D'},
    {title:'Competitor scan, 6 agents',venture:'ImmiClaw',meta:'6D'},
    {title:'Agency onboarding checklist',venture:'ImmiClaw',meta:'8D'},
    {title:'Parser options, three vendors',venture:'ImmiClaw',meta:'11D'},
    {title:'Founder background notes',venture:'ImmiClaw',meta:'14D'},
    {title:'Release review, 2.4',venture:'Dikkha AI',meta:'4D'},
    {title:'SSC syllabus coverage',venture:'Dikkha AI',meta:'7D'},
    {title:'Offline pack scoping',venture:'Dikkha AI',meta:'9D'},
    {title:'Tutor interview, Khulna',venture:'Dikkha AI',meta:'12D'},
    {title:'Deals feed reliability',venture:'Chhar',meta:'1D'},
    {title:'Play Store listing copy',venture:'Chhar',meta:'5D'},
    {title:'Merchant pricing tiers',venture:'Chhar',meta:'6D'},
    {title:'iOS decision, revisit at 5K',venture:'Chhar',meta:'17D'},
    {title:'Regulatory timeline, BB',venture:'Eloy Lab',meta:'3D'},
    {title:'Bank reporting formats',venture:'Eloy Lab',meta:'10D'},
    {title:'AVL thesis, 2026',venture:null,meta:'2D',pinned:true},
    {title:'Agent pricing ideas',venture:null,meta:'6D'},
    {title:'Who we should not back',venture:null,meta:'9D'},
    {title:'Random: BD fintech gap',venture:null,meta:'13D'}
  ]
};
AVL_DATA.tasksFor=v=>AVL_DATA.tasks.filter(t=>t.venture===v);
AVL_DATA.countFor=(venture,key)=>{
  if(key==='Docs')return AVL_DATA.docs.filter(f=>f.venture===venture).length;
  if(key==='Notes')return AVL_DATA.notes.filter(n=>n.venture===venture).length;
  if(key==='Tasks')return AVL_DATA.tasksFor(venture).length;
  if(key==='Calendar')return (AVL_DATA.overview[venture]||{meetings:[]}).meetings.length;
  if(key==='Decisions')return (window.DECISIONS||[]).filter(x=>x.venture===venture).length;
  return 0;
};
AVL_DATA.gatesFor=venture=>{
  const v=AVL_DATA.ventures[venture];
  return (AVL_DATA.gateChecklists[v.stage]||[]).map((label,i)=>({label,done:i<v.gates,by:i<v.gates?v.who:''}));
};
AVL_DATA.stages=[
    {stage:'Meet',count:'02',progress:1,color:'var(--copper)',items:['Eloy Lab','Medical BOT']},
    {stage:'Validate',count:'01',progress:2,color:'var(--magenta)',items:['ImmiClaw']},
    {stage:'Build',count:'02',progress:3,color:'var(--violet)',items:['Dikkha AI','Berai']},
    {stage:'Form',count:'00',progress:0,color:'var(--copper)',items:[],add:'Nothing here yet'},
    {stage:'Grow',count:'01',progress:5,color:'var(--teal)',items:['Chhar']}
];
Object.assign(window,{AVL_DATA});
