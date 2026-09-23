/* Workforce Intelligence — WFM Lab v2
 * Fresh architecture. One integrated WFM application, not a toolbox of calculators.
 * Offline-first, synthetic data only. No client/company/PII data.
 */
(() => {
  'use strict';

  const rootState = {
    view: 'command',
    interval: 30,
    selectedLob: 'voice',
    data: {
      lobs: [
        {id:'voice', name:'Customer Support', channel:'Voice', aht:300, sl:.80, threshold:20, shrinkage:.28},
        {id:'billing', name:'Billing Support', channel:'Voice', aht:360, sl:.85, threshold:20, shrinkage:.30},
        {id:'chat', name:'Digital Chat', channel:'Chat', aht:420, sl:.90, threshold:60, shrinkage:.25},
        {id:'email', name:'Service Requests', channel:'Email', aht:600, sl:.90, threshold:1440, shrinkage:.27}
      ],
      roster: Array.from({length:20},(_,i)=>({id:'AG'+String(i+1).padStart(3,'0'), skills:['voice']})),
      history: Array.from({length:24},(_,i)=>Math.round(7800 + i*170 + 520*Math.sin(i*Math.PI/3))),
      intervals: Array.from({length:48},(_,i)=>({
        index:i,
        time:String(Math.floor(i/2)).padStart(2,'0')+(i%2?':30':':00'),
        forecast:Math.round(18 + 25*Math.exp(-Math.pow((i-26)/13,2))),
        actual:null,
        aht:300,
        scheduled:35,
        available:32
      }))
    },
    inputs: {
      volume: 600, period: 60, aht: 300, sl: 80, threshold: 20,
      shrinkage: 28, occupancy: 85, currentAgents: 30,
      weeklyVolume: 18000, paidHours: 40,
      forecastHorizon: 12
    }
  };

  const $ = (s,r=document) => r.querySelector(s);
  const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n = v => Number(v)||0;
  const pct = v => (n(v)*100).toFixed(1)+'%';
  const fmt = (v,d=0) => n(v).toLocaleString(undefined,{maximumFractionDigits:d});
  const fraction = v => n(v)>1?n(v)/100:n(v);

  function erlangC(a,c){
    a=Math.max(0,n(a)); c=Math.max(1,Math.floor(n(c)));
    if(a>=c) return 1;
    let term=1,sum=1;
    for(let k=1;k<c;k++){term*=a/k;sum+=term;}
    const last=term*a/c;
    return last/(sum+last*(c/(c-a)));
  }

  function staffing(q=rootState.inputs){
    const period=Math.max(1,n(q.period)||60);
    const offered=n(q.volume);
    const aht=n(q.aht);
    const erlangs=offered*aht/(period*60);
    const target=fraction(q.sl);
    const maxOcc=fraction(q.occupancy);
    let required=1;
    for(;required<10000;required++){
      const occ=erlangs/required;
      if(occ>=1) continue;
      const pw=erlangC(erlangs,required);
      const service=1-pw*Math.exp(-(required-erlangs)*(n(q.threshold)/Math.max(1,aht)));
      if(service>=target && occ<=maxOcc) break;
    }
    const current=Math.max(1,Math.floor(n(q.currentAgents)));
    const currentOcc=erlangs/current;
    const currentPw=currentOcc>=1?1:erlangC(erlangs,current);
    const currentSl=currentOcc>=1?0:1-currentPw*Math.exp(-(current-required+required-erlangs)*(n(q.threshold)/Math.max(1,aht)));
    const shrink=fraction(q.shrinkage);
    return {
      erlangs, required, current, gap:required-current,
      fte:required/Math.max(.01,1-shrink),
      occupancy:Math.min(1,erlangs/required),
      currentOccupancy:Math.min(1,currentOcc),
      serviceLevel:Math.max(0,Math.min(1,currentSl)),
      target,
      asa: currentOcc>=1 ? Infinity : currentPw*aht/Math.max(.001,current-erlangs)
    };
  }

  function capacity(q=rootState.inputs){
    const workload=n(q.weeklyVolume)*n(q.aht)/3600;
    const productive=n(q.paidHours)*Math.max(.01,1-fraction(q.shrinkage));
    return {workload,productive,fte:workload/productive};
  }

  function forecast(){
    const h=rootState.data.history;
    const last=Math.max(1,n(h[h.length-1]));
    const prev=Math.max(1,n(h[h.length-2]));
    const trend=last-prev;
    const future=[];
    for(let i=1;i<=Math.max(1,Math.floor(n(rootState.inputs.forecastHorizon)||12));i++){
      const seasonal=[.96,.98,1,1.03,1.05,1.08,1.06,1.03,1,.98,.97,.95][(h.length+i-1)%12];
      future.push(Math.max(0,Math.round((last+trend*i)*seasonal)));
    }
    return {history:h,future};
  }

  function intervals(){
    const q=rootState.data.intervals;
    return q.map(x=>{
      const actual=x.actual==null?x.forecast:x.actual;
      const workload=actual*x.aht/3600;
      const required=Math.max(1,Math.ceil(workload));
      return {...x,actual,required,gap:x.available-required,volumeVariance:actual/Math.max(1,x.forecast)-1};
    });
  }

  function shellNav(){
    const items=[
      ['command','Command Center'],['setup','Operations Setup'],['data','Data Hub'],
      ['forecast','Forecasting'],['staffing','Staffing'],['capacity','Capacity'],
      ['schedule','Scheduling'],['adherence','Adherence'],['intraday','Intraday'],
      ['multichannel','Multichannel'],['scenario','Scenarios'],['reporting','Reporting'],
      ['validation','Validation'],['decision','Decision Engine']
    ];
    return '<div class="wfm-tabs wfm-tools-nav">'+items.map(([id,label])=>
      '<button class="'+(rootState.view===id?'active':'')+'" data-wfm-view="'+id+'">'+label+'</button>'
    ).join('')+'</div>';
  }

  function intro(title,copy){
    return '<div class="wfm-head"><div><span class="eyebrow">INTEGRATED WFM LAB · V2</span><h2>'+title+'</h2><p>'+copy+'</p></div><div class="wfm-source">Synthetic · Offline-first</div></div>';
  }

  function panel(title,sub,body){
    return '<article class="wfm-panel"><div class="wfm-panel-head"><b>'+title+'</b><span>'+sub+'</span></div>'+body+'</article>';
  }

  function kpi(label,value,sub=''){
    return '<article class="wfm-kpi"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></article>';
  }

  function field(label,key,value,step='1'){
    return '<label class="wfm-field"><span>'+label+'</span><input type="number" data-wfm-input="'+key+'" value="'+value+'" step="'+step+'"></label>';
  }

  function command(){
    const s=staffing(),c=capacity(),f=forecast(),rows=intervals();
    const gap=rows.reduce((a,x)=>a+Math.min(0,x.gap),0);
    return intro('Command Center','A single operational view connecting demand, forecast, staffing, capacity, schedule and intraday control.')+
      '<div class="wfm-kpis">'+
        kpi('Required agents',fmt(s.required),'queueing model')+
        kpi('Current agents',fmt(s.current),s.gap>0?fmt(s.gap)+' gap':'within requirement')+
        kpi('Service level',pct(s.serviceLevel),'current staffing')+
        kpi('Capacity FTE',fmt(c.fte,1),'weekly workload')+
        kpi('Intraday gap',fmt(gap),'negative slots')+
      '</div>'+
      panel('Operating chain','Demand → Forecast → Staffing → Capacity → Schedule → Intraday',
        '<div class="wfm-command-grid">'+
          ['Demand','Forecast','Staffing','Capacity','Schedule','Intraday'].map((x,i)=>
            '<div class="wfm-highlight"><b>'+x+'</b><span>'+['historical + interval inputs','12-month planning horizon',fmt(s.required)+' required',''+fmt(c.fte,1)+' FTE','coverage plan',''+fmt(rows.filter(r=>r.gap<0).length)+' risk intervals'][i]+'</span></div>'
          ).join('')+
        '</div>')+
      panel('Today at a glance','30-minute operating grain',
        '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Time</th><th>Forecast</th><th>Actual</th><th>Required</th><th>Available</th><th>Gap</th></tr></thead><tbody>'+
        rows.slice(0,16).map(r=>'<tr><td>'+r.time+'</td><td>'+r.forecast+'</td><td>'+r.actual+'</td><td>'+r.required+'</td><td>'+r.available+'</td><td class="'+(r.gap<0?'wfm-negative':'')+'">'+r.gap+'</td></tr>').join('')+
        '</tbody></table></div>');
  }

  function setup(){
    return intro('Operations Setup','Define the operating model before calculating anything: LOBs, service targets, skills, interval grain and roster.')+
      '<div class="wfm-kpis">'+kpi('LOBs',rootState.data.lobs.length,'planning queues')+kpi('Agents',rootState.data.roster.length,'synthetic roster')+kpi('Interval',rootState.interval+' min','planning grain')+kpi('History',rootState.data.history.length+' mo','forecast input')+'</div>'+
      panel('LOB catalogue','editable model will be added in the next build layer',
        '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>LOB</th><th>Channel</th><th>AHT</th><th>SL</th><th>Shrinkage</th></tr></thead><tbody>'+
        rootState.data.lobs.map(x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+x.channel+'</td><td>'+x.aht+' s</td><td>'+pct(x.sl)+'</td><td>'+pct(x.shrinkage)+'</td></tr>').join('')+
        '</tbody></table></div>');
  }

  function dataHub(){
    return intro('Data Hub','One place for historical, interval, roster and configuration data. Import/export is intentionally isolated from calculation logic.')+
      panel('Data contract','required WFM entities',
        '<div class="wfm-command-grid">'+
        ['LOB master','Skill matrix','Agent roster','Interval demand','Historical demand','Activity / adherence'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>schema defined · validation gate</span></div>').join('')+
        '</div>')+
      panel('Current synthetic interval feed','48 × 30-minute records',
        '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Interval</th><th>Forecast</th><th>Actual</th><th>Scheduled</th><th>Available</th></tr></thead><tbody>'+
        rootState.data.intervals.slice(0,20).map(r=>'<tr><td>'+r.time+'</td><td>'+r.forecast+'</td><td>'+(r.actual==null?'—':r.actual)+'</td><td>'+r.scheduled+'</td><td>'+r.available+'</td></tr>').join('')+
        '</tbody></table></div>');
  }

  function staffingView(){
    const q=rootState.inputs,s=staffing();
    return intro('Erlang Staffing','Queueing is the staffing engine. Inputs are explicit, units are visible, and results feed the rest of the lab.')+
      '<div class="wfm-tool-layout"><div class="wfm-panel"><div class="wfm-panel-head"><b>Inputs</b><span>edit then recalculate</span></div><div class="wfm-mini-grid">'+
      field('Volume / period','volume',q.volume)+field('Period (min)','period',q.period)+field('AHT (sec)','aht',q.aht)+field('Service level %','sl',q.sl)+field('Answer target (sec)','threshold',q.threshold)+field('Shrinkage %','shrinkage',q.shrinkage)+field('Max occupancy %','occupancy',q.occupancy)+field('Current agents','currentAgents',q.currentAgents)+
      '</div><button class="primary" data-wfm-action="recalc">Recalculate →</button></div>'+
      panel('Staffing result','Erlang C',
        '<div class="wfm-kpis">'+kpi('Erlangs',fmt(s.erlangs,2),'offered workload')+kpi('Required',fmt(s.required),'service + occupancy')+kpi('FTE',fmt(s.fte,1),'after shrinkage')+kpi('Occupancy',pct(s.occupancy),'at requirement')+kpi('ASA',isFinite(s.asa)?fmt(s.asa,1)+' s':'—','current staffing')+'</div>');
  }

  function capacityView(){
    const c=capacity();
    return intro('Capacity Planning','Translate workload hours into productive capacity and FTE requirements.')+
      '<div class="wfm-tool-layout">'+panel('Capacity inputs','weekly planning', '<div class="wfm-mini-grid">'+field('Weekly volume','weeklyVolume',rootState.inputs.weeklyVolume)+field('AHT (sec)','aht',rootState.inputs.aht)+field('Shrinkage %','shrinkage',rootState.inputs.shrinkage)+field('Paid hours / FTE','paidHours',rootState.inputs.paidHours)+'</div>')+
      panel('Capacity result','weekly workload', '<div class="wfm-kpis">'+kpi('Workload',fmt(c.workload,1)+' h','gross')+kpi('Productive',fmt(c.productive,1)+' h','per FTE')+kpi('Required FTE',fmt(c.fte,1),'planning requirement')+'</div>')+'</div>';
  }

  function forecastView(){
    const f=forecast();
    return intro('Forecasting Workbench','Start with historical demand, expose trend and seasonality, then hand the forecast into capacity and staffing.')+
      panel('Forecast configuration','12-month horizon', '<div class="wfm-mini-grid">'+field('History points','historyPoints',rootState.data.history.length)+field('Forecast horizon','forecastHorizon',rootState.inputs.forecastHorizon)+'</div>')+
      panel('Historical → future','synthetic monthly demand', '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Period</th><th>Demand</th><th>Type</th></tr></thead><tbody>'+
      f.history.slice(-12).map((v,i)=>'<tr><td>M-'+(12-i)+'</td><td>'+fmt(v)+'</td><td>Actual</td></tr>').join('')+
      f.future.map((v,i)=>'<tr><td>F+'+(i+1)+'</td><td>'+fmt(v)+'</td><td>Forecast</td></tr>').join('')+
      '</tbody></table></div>');
  }

  function scheduleView(){
    const required=staffing().required;
    return intro('Schedule Planning','Build coverage against interval requirements. Shift construction, breaks and agent-level assignment will consume this requirement model.')+
      panel('Coverage target','current staffing requirement', '<div class="wfm-kpis">'+kpi('Peak requirement',fmt(Math.round(required*1.35)),'illustrative interval peak')+kpi('Base requirement',fmt(required),'current Erlang result')+kpi('Planning grain',rootState.interval+' min','48 daily intervals')+'</div>')+
      panel('Schedule architecture','shift patterns are data, not hard-coded UI', '<div class="wfm-command-grid">'+
        ['Shift templates','Break placement','Skill assignment','Coverage optimizer','Agent constraints','Published schedule'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>module boundary</span></div>').join('')+'</div>');
  }

  function adherenceView(){
    return intro('Schedule Adherence','Compare scheduled activity with actual activity at agent and interval level; adherence is evidence for intraday action, not a decorative KPI.')+
      panel('Adherence model','planned vs actual activities','<div class="wfm-command-grid">'+
      ['Scheduled state','Actual state','Break / meeting','Training','Exceptions','Interval adherence'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>data contract</span></div>').join('')+'</div>');
  }

  function intradayView(){
    const rows=intervals(),risk=rows.filter(r=>r.gap<0).length;
    return intro('Intraday Control','Monitor forecast vs actual demand, AHT, available staffing and interval gaps. Every alert should trace back to a measurable driver.')+
      '<div class="wfm-kpis">'+kpi('Risk intervals',risk,'below required staffing')+kpi('Volume variance',pct(rows.reduce((a,r)=>a+r.volumeVariance,0)/rows.length),'average')+kpi('Available now',fmt(rows[0].available),'synthetic snapshot')+kpi('Required now',fmt(rows[0].required),'workload proxy')+'</div>'+
      panel('Intraday timeline','48 × 30-minute intervals','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Time</th><th>Forecast</th><th>Actual</th><th>Required</th><th>Available</th><th>Gap</th></tr></thead><tbody>'+
      rows.map(r=>'<tr><td>'+r.time+'</td><td>'+r.forecast+'</td><td>'+r.actual+'</td><td>'+r.required+'</td><td>'+r.available+'</td><td class="'+(r.gap<0?'wfm-negative':'')+'">'+r.gap+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function multichannelView(){
    return intro('Multichannel WFM','Voice, chat and asynchronous work need different workload assumptions. The lab keeps channel logic separate before combining capacity.')+
      panel('Channel model','voice / chat / email','<div class="wfm-channel-grid">'+
      [['Voice','Queueing + SL + AHT'],['Chat','AHT + concurrency'],['Email','Backlog + response target']].map(x=>'<div class="wfm-highlight"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('')+'</div>')+
      panel('Decision boundary','avoid false precision','<div class="wfm-note">Channel calculations remain explicit about their assumptions. A chat concurrency approximation must not be presented as equivalent to voice Erlang C.</div>');
  }

  function scenarioView(){
    return intro('Scenario Lab','Change assumptions and compare the operational consequences before making a planning decision.')+
      panel('Scenario dimensions','all major levers', '<div class="wfm-command-grid">'+
      ['Demand growth','AHT change','Shrinkage','Occupancy','Service target','Overtime','Hiring','Skill availability'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>scenario variable</span></div>').join('')+'</div>');
  }

  function reportingView(){
    return intro('Reporting','Convert operational calculations into reusable management outputs without mixing presentation logic with the engine.')+
      panel('Report layers','audience-specific outputs','<div class="wfm-command-grid">'+
      ['Operations dashboard','WFM analyst pack','Intraday summary','Executive brief','Forecast pack','Audit trail'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>report contract</span></div>').join('')+'</div>');
  }

  function validationView(){
    const s=staffing(),c=capacity();
    const checks=[
      ['Queueing engine',Number.isFinite(s.erlangs)&&s.required>0],
      ['Capacity engine',Number.isFinite(c.fte)&&c.fte>0],
      ['Interval model',rootState.data.intervals.length===48],
      ['LOB model',rootState.data.lobs.length>=4],
      ['Roster model',rootState.data.roster.length>=10]
    ];
    return intro('Validation & Data Quality','The lab should fail loudly when inputs are invalid. These checks are the first gate before scenario or executive outputs.')+
      panel('Current checks','runtime health', '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Check</th><th>Status</th></tr></thead><tbody>'+
      checks.map(([name,ok])=>'<tr><td>'+name+'</td><td>'+(ok?'PASS':'FAIL')+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function decisionView(){
    const s=staffing();
    return intro('WFM Decision Engine','Turn model outputs into explainable operational decisions. The engine shows evidence, assumptions and trade-offs rather than hiding them behind a score.')+
      panel('Current decision context','synthetic scenario','<div class="wfm-kpis">'+kpi('Service',pct(s.serviceLevel),'current staffing')+kpi('Target',pct(s.target),'configured')+kpi('Agent gap',fmt(s.gap),s.gap>0?'shortfall':'surplus')+kpi('FTE',fmt(s.fte,1),'capacity requirement')+'</div>')+
      panel('Decision evidence','what the planner must inspect','<div class="wfm-command-grid">'+
      ['Volume vs forecast','AHT vs plan','Shrinkage vs assumption','Skill coverage','Schedule gap','Intraday state'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>evidence before action</span></div>').join('')+'</div>');
  }

  function view(){
    switch(rootState.view){
      case 'setup':return setup();
      case 'data':return dataHub();
      case 'forecast':return forecastView();
      case 'staffing':return staffingView();
      case 'capacity':return capacityView();
      case 'schedule':return scheduleView();
      case 'adherence':return adherenceView();
      case 'intraday':return intradayView();
      case 'multichannel':return multichannelView();
      case 'scenario':return scenarioView();
      case 'reporting':return reportingView();
      case 'validation':return validationView();
      case 'decision':return decisionView();
      default:return command();
    }
  }

  function mount(el){
    if(!el) return;
    function render(){ el.innerHTML=shellNav()+view(); bind(); }
    function bind(){
      el.querySelectorAll('[data-wfm-view]').forEach(b=>b.addEventListener('click',()=>{rootState.view=b.dataset.wfmView;render();}));
      el.querySelectorAll('[data-wfm-input]').forEach(input=>input.addEventListener('change',()=>{
        const key=input.dataset.wfmInput;
        if(key in rootState.inputs) rootState.inputs[key]=n(input.value);
        render();
      }));
      el.querySelectorAll('[data-wfm-action="recalc"]').forEach(b=>b.addEventListener('click',render));
    }
    render();
  }

  window.WFM_LAB = {
    version:'2.0.0',
    mount,
    state:rootState,
    engine:{erlangC,staffing,capacity,forecast,intervals}
  };
})();
