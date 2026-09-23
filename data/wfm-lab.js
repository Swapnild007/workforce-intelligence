/* Workforce Intelligence — Integrated WFM Lab
 * v2.1 — operational core
 * Offline-first, synthetic/public-safe data only.
 * Model chain: demand → forecast → staffing → capacity → schedule → adherence → intraday → decision.
 */
(() => {
  'use strict';

  const state = {
    view:'command',
    interval:30,
    selectedLob:'voice',
    inputs:{
      volume:600, period:60, aht:300, sl:80, threshold:20,
      shrinkage:28, occupancy:85, currentAgents:30,
      weeklyVolume:18000, paidHours:40, forecastHorizon:12
    },
    lobs:[
      {id:'voice',name:'Customer Support',channel:'Voice',aht:300,sl:.80,threshold:20,shrinkage:.28},
      {id:'billing',name:'Billing Support',channel:'Voice',aht:360,sl:.85,threshold:20,shrinkage:.30},
      {id:'chat',name:'Digital Chat',channel:'Chat',aht:420,sl:.90,threshold:60,shrinkage:.25},
      {id:'email',name:'Service Requests',channel:'Email',aht:600,sl:.90,threshold:1440,shrinkage:.27}
    ],
    history:[8200,8050,8300,8550,8720,8900,9150,9020,9280,9460,9700,9920,10150,10080,10320,10640,10920,11180,11450,11320,11760,12040,12380,12620],
    intervals:Array.from({length:48},(_,i)=>({
      index:i,time:String(Math.floor(i/2)).padStart(2,'0')+(i%2?':30':':00'),
      forecast:Math.round(18+42*Math.exp(-Math.pow((i-26)/13,2))),
      actual:null,aht:300,scheduled:35,available:32
    })),
    agents:Array.from({length:20},(_,i)=>({
      id:'AG'+String(i+1).padStart(3,'0'),
      name:'Agent '+String(i+1).padStart(3,'0'),
      skills:i%5===0?['voice','chat']:['voice']
    })),
    adherence:Array.from({length:8},(_,i)=>({
      id:'AG'+String(i+1).padStart(3,'0'),
      scheduled:480,
      actual:i%3===0?455:470,
      break:30,training:i===2?30:0,meeting:i===5?30:0
    }))
  };

  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>Number(v)||0;
  const frac=v=>num(v)>1?num(v)/100:num(v);
  const pct=v=>(num(v)*100).toFixed(1)+'%';
  const fmt=(v,d=0)=>Number.isFinite(Number(v))?Number(v).toLocaleString(undefined,{maximumFractionDigits:d}):'—';

  function erlangC(a,c){
    a=Math.max(0,num(a)); c=Math.max(1,Math.floor(num(c)));
    if(a>=c)return 1;
    let term=1,sum=1;
    for(let k=1;k<c;k++){term*=a/k;sum+=term;}
    const last=term*a/c;
    return last/(sum+last*(c/(c-a)));
  }

  function queue(q){
    const period=Math.max(1,num(q.period)||60), aht=Math.max(1,num(q.aht));
    const erlangs=Math.max(0,num(q.volume))*aht/(period*60);
    const agents=Math.max(1,Math.floor(num(q.agents)));
    const occ=erlangs/agents;
    if(occ>=1)return {erlangs,agents,occupancy:1,pw:1,sl:0,asa:Infinity};
    const pw=erlangC(erlangs,agents);
    const sl=Math.max(0,Math.min(1,1-pw*Math.exp(-(agents-erlangs)*num(q.threshold)/aht)));
    const asa=pw*aht/(agents-erlangs);
    return {erlangs,agents,occupancy:occ,pw,sl,asa};
  }

  function requiredAgents(q){
    const target=frac(q.sl), maxOcc=frac(q.occupancy);
    const base=Math.max(1,Math.ceil(num(q.volume)*num(q.aht)/(Math.max(1,num(q.period))*60)));
    for(let c=base;c<=10000;c++){
      const m=queue({...q,agents:c});
      if(m.sl>=target && m.occupancy<=maxOcc)return c;
    }
    return 10000;
  }

  function staffing(q=state.inputs){
    const required=requiredAgents(q), current=Math.max(1,Math.floor(num(q.currentAgents)));
    const currentM=queue({...q,agents:current});
    const shrink=frac(q.shrinkage);
    return {
      required,current,gap:required-current,
      erlangs:queue({...q,agents:required}).erlangs,
      serviceLevel:currentM.sl,currentOccupancy:currentM.occupancy,
      occupancy:queue({...q,agents:required}).occupancy,
      asa:currentM.asa,pw:currentM.pw,
      fte:required/Math.max(.01,1-shrink),target:frac(q.sl)
    };
  }

  function capacity(q=state.inputs){
    const workload=num(q.weeklyVolume)*num(q.aht)/3600;
    const productive=num(q.paidHours)*Math.max(.01,1-frac(q.shrinkage));
    return {workload,productive,fte:workload/productive};
  }

  /* Multiplicative Holt-Winters with a 12-period seasonal cycle. */
  function forecastModel(history=state.history,horizon=state.inputs.forecastHorizon){
    const y=history.map(num).filter(v=>v>0);
    const h=Math.max(1,Math.floor(num(horizon)||12)), s=12;
    if(y.length<2)return {history:y,future:Array(h).fill(y[0]||0),holdout:[],predicted:[],mae:0,mape:0,bias:0};
    const seasonLen=Math.min(s,Math.max(2,Math.floor(y.length/2)));
    const split=Math.max(seasonLen+2,y.length-Math.min(6,Math.floor(y.length/4)));
    const train=y.slice(0,split), hold=y.slice(split);
    const fit=(data,steps)=>{
      const n=data.length, L=.35,T=.18,S=.25;
      let level=data[0],trend=(data[Math.min(1,n-1)]-data[0])/Math.max(1,data[0]), seas=Array(seasonLen).fill(1);
      const avg=data.slice(0,seasonLen).reduce((a,v)=>a+v,0)/seasonLen;
      for(let i=0;i<seasonLen;i++)seas[i]=data[i]/Math.max(1,avg);
      for(let t=1;t<n;t++){
        const si=(t-seasonLen)%seasonLen;
        const oldL=level, oldS=seas[si];
        level=L*(data[t]/Math.max(.01,oldS))+(1-L)*(level+trend);
        trend=T*(level-oldL)+(1-T)*trend;
        seas[si]=S*(data[t]/Math.max(.01,level))+(1-S)*oldS;
      }
      return Array.from({length:steps},(_,j)=>Math.max(0,(level+(j+1)*trend)*seas[(n+j)%seasonLen]));
    };
    const predicted=hold.length?fit(train,hold.length):[];
    const errors=hold.map((v,i)=>v-(predicted[i]||0));
    const mae=errors.length?errors.reduce((a,e)=>a+Math.abs(e),0)/errors.length:0;
    const mape=errors.length?errors.reduce((a,e,i)=>a+Math.abs(e)/Math.max(1,hold[i]),0)/errors.length:0;
    const bias=errors.length?errors.reduce((a,e)=>a+e,0)/errors.length:0;
    return {history:y,future:fit(y,h).map(Math.round),holdout:hold,predicted:predicted.map(Math.round),mae,mape,bias};
  }

  function intervalPlan(){
    return state.intervals.map(r=>{
      const actual=r.actual==null?r.forecast:r.actual;
      const workload=actual*r.aht/3600;
      const base=Math.max(1,Math.ceil(workload));
      const q={volume:actual,period:state.interval,aht:r.aht,sl:state.inputs.sl,threshold:state.inputs.threshold,occupancy:state.inputs.occupancy};
      const required=requiredAgents(q);
      return {...r,actual,required,gap:r.available-required,workload,variance:actual/Math.max(1,r.forecast)-1};
    });
  }

  function schedulePlan(){
    const rows=intervalPlan(), coverage=Array(rows.length).fill(0);
    const shifts=[
      {name:'Early',start:6,end:14},{name:'Core',start:8,end:16},
      {name:'Mid',start:10,end:18},{name:'Peak',start:12,end:20},
      {name:'Late',start:14,end:22},{name:'Close',start:16,end:24}
    ];
    const count=state.inputs.currentAgents;
    const assigned=[];
    for(let a=0;a<count;a++){
      let best=shifts[0],bestScore=-Infinity;
      for(const sh of shifts){
        let score=0;
        for(let i=0;i<rows.length;i++){
          const h=i*.5;
          if(h>=sh.start&&h<sh.end)score+=Math.max(0,rows[i].required-coverage[i]);
        }
        if(score>bestScore){bestScore=score;best=sh;}
      }
      assigned.push({agent:'AG'+String(a+1).padStart(3,'0'),shift:best.name,start:best.start,end:best.end});
      for(let i=0;i<rows.length;i++){const h=i*.5;if(h>=best.start&&h<best.end)coverage[i]++;}
    }
    const gaps=rows.map((r,i)=>coverage[i]-r.required);
    return {rows,coverage,gaps,assigned,shifts};
  }

  function adherenceSummary(){
    return state.adherence.map(a=>{
      const productive=Math.max(0,num(a.actual)-num(a.break)-num(a.training)-num(a.meeting));
      const adherence=num(a.scheduled)?productive/num(a.scheduled):0;
      const conformance=num(a.scheduled)?num(a.actual)/num(a.scheduled):0;
      return {...a,productive,adherence,conformance,variance:num(a.actual)-num(a.scheduled)};
    });
  }

  function multichannel(){
    const voice=requiredAgents({volume:400,period:30,aht:300,sl:80,threshold:20,occupancy:85});
    const chat=requiredAgents({volume:55,period:60,aht:420/2.5,sl:90,threshold:60,occupancy:80});
    return {voice,chat,email:Math.ceil(80*600/3600)};
  }

  function intro(title,copy){return '<div class="wfm-head"><div><span class="eyebrow">INTEGRATED WFM LAB · V2.1</span><h2>'+title+'</h2><p>'+copy+'</p></div><div class="wfm-source">Synthetic · Offline-first</div></div>';}
  function panel(title,sub,body){return '<article class="wfm-panel"><div class="wfm-panel-head"><b>'+title+'</b><span>'+sub+'</span></div>'+body+'</article>';}
  function kpi(label,value,sub=''){return '<article class="wfm-kpi"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></article>';}
  function field(label,key,value,step='1'){return '<label class="wfm-field"><span>'+label+'</span><input type="number" data-wfm-input="'+key+'" value="'+value+'" step="'+step+'"></label>';}

  function nav(){
    const items=[
      ['command','Command Center'],['setup','Operations Setup'],['data','Data Hub'],
      ['forecast','Forecasting'],['staffing','Staffing'],['capacity','Capacity'],
      ['schedule','Scheduling'],['adherence','Adherence'],['intraday','Intraday'],
      ['multichannel','Multichannel'],['scenario','Scenarios'],['reporting','Reporting'],
      ['validation','Validation'],['decision','Decision Engine']
    ];
    return '<div class="wfm-tabs wfm-tools-nav">'+items.map(x=>'<button class="'+(state.view===x[0]?'active':'')+'" data-wfm-view="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
  }

  function command(){
    const s=staffing(),c=capacity(),r=intervalPlan(),risk=r.filter(x=>x.gap<0).length;
    return intro('Command Center','The operating cockpit. Every headline metric traces back to a model or input inside the lab.')+
      '<div class="wfm-kpis">'+kpi('Required agents',fmt(s.required),'Erlang C')+kpi('Current agents',fmt(s.current),s.gap>0?fmt(s.gap)+' gap':'covered')+kpi('Service level',pct(s.serviceLevel),'current staffing')+kpi('Capacity FTE',fmt(c.fte,1),'weekly workload')+kpi('Risk intervals',risk,'below requirement')+'</div>'+
      panel('Operating chain','Demand → Forecast → Staffing → Capacity → Schedule → Intraday','<div class="wfm-command-grid">'+
      [['Demand','24 monthly + 48 interval records'],['Forecast',fmt(forecastModel().future[0])+' first projected period'],['Staffing',fmt(s.required)+' agents'],['Capacity',fmt(c.fte,1)+' FTE'],['Schedule',fmt(schedulePlan().assigned.length)+' assignments'],['Intraday',risk+' intervals below need']].map(x=>'<div class="wfm-highlight"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('')+'</div>')+
      panel('Intraday snapshot','30-minute operating grain','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Time</th><th>Forecast</th><th>Actual</th><th>Required</th><th>Available</th><th>Gap</th></tr></thead><tbody>'+r.slice(0,16).map(x=>'<tr><td>'+x.time+'</td><td>'+x.forecast+'</td><td>'+x.actual+'</td><td>'+x.required+'</td><td>'+x.available+'</td><td class="'+(x.gap<0?'wfm-negative':'')+'">'+x.gap+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function setup(){
    return intro('Operations Setup','The control plane for LOBs, service targets, shrinkage and planning grain.')+
      '<div class="wfm-kpis">'+kpi('LOBs',state.lobs.length,'configured')+kpi('Agents',state.agents.length,'synthetic roster')+kpi('Interval',state.interval+' min','planning grain')+kpi('History',state.history.length+' mo','forecast history')+'</div>'+
      panel('LOB catalogue','model assumptions','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>LOB</th><th>Channel</th><th>AHT</th><th>SL</th><th>Shrinkage</th></tr></thead><tbody>'+state.lobs.map(x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+x.channel+'</td><td>'+x.aht+' s</td><td>'+pct(x.sl)+'</td><td>'+pct(x.shrinkage)+'</td></tr>').join('')+'</tbody></table></div>')+
      panel('Roster','synthetic IDs only','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agent</th><th>Skills</th></tr></thead><tbody>'+state.agents.slice(0,10).map(x=>'<tr><td>'+x.id+'</td><td>'+x.skills.join(', ')+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function dataHub(){
    return intro('Data Hub','Keep data ingestion, validation and calculation concerns separate. Import interval CSVs later without changing the engine.')+
      panel('Data contract','minimum entities','<div class="wfm-command-grid">'+['LOB master','Skill matrix','Agent roster','Interval demand','Historical demand','Adherence activity'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>validated schema boundary</span></div>').join('')+'</div>')+
      panel('Local CSV tools','browser-only · no upload','<div class="wfm-mini-grid"><label class="wfm-field"><span>Import interval CSV</span><input id="wfmCsv" type="file" accept=".csv,text/csv"></label><div><button class="secondary" data-wfm-action="export">Export interval CSV</button></div></div><div class="wfm-note">Expected columns: time, forecast, actual, aht, scheduled, available. Imported data stays in this browser session.</div>');
  }

  function forecastView(){
    const f=forecastModel();
    return intro('Forecasting Workbench','Forecast at the planning grain you actually staff. The model exposes holdout error and bias before forecast values are passed downstream.')+
      panel('Configuration','monthly synthetic history','<div class="wfm-mini-grid">'+field('Forecast horizon','forecastHorizon',state.inputs.forecastHorizon)+'</div>')+
      '<div class="wfm-kpis">'+kpi('MAE',fmt(f.mae,0),'holdout')+kpi('MAPE',pct(f.mape),'holdout')+kpi('Bias',fmt(f.bias,0),'positive = under-forecast')+kpi('Next period',fmt(f.future[0]),'forecast')+'</div>'+
      panel('Forecast output','actual history + holdout validation + future','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Period</th><th>Demand</th><th>Role</th></tr></thead><tbody>'+f.history.slice(-12).map((v,i)=>'<tr><td>M-'+(12-i)+'</td><td>'+fmt(v)+'</td><td>Actual</td></tr>').join('')+f.future.map((v,i)=>'<tr><td>F+'+(i+1)+'</td><td>'+fmt(v)+'</td><td>Forecast</td></tr>').join('')+'</tbody></table></div>');
  }

  function staffingView(){
    const s=staffing();
    const rows=[];
    for(let c=Math.max(1,s.required-4);c<=s.required+5;c++){const m=queue({...state.inputs,agents:c});rows.push('<tr><td>'+c+'</td><td>'+pct(m.sl)+'</td><td>'+pct(m.occupancy)+'</td><td>'+fmt(m.asa,1)+' s</td></tr>');}
    return intro('Erlang Staffing','Production-style staffing inputs: volume, interval, AHT, service target, answer target, shrinkage and occupancy.')+
      '<div class="wfm-tool-layout"><div class="wfm-panel"><div class="wfm-panel-head"><b>Inputs</b><span>change and recalculate</span></div><div class="wfm-mini-grid">'+field('Volume','volume',state.inputs.volume)+field('Period (min)','period',state.inputs.period)+field('AHT (sec)','aht',state.inputs.aht)+field('Service level %','sl',state.inputs.sl)+field('Answer target (sec)','threshold',state.inputs.threshold)+field('Shrinkage %','shrinkage',state.inputs.shrinkage)+field('Max occupancy %','occupancy',state.inputs.occupancy)+field('Current agents','currentAgents',state.inputs.currentAgents)+'</div><button class="primary" data-wfm-action="recalc">Recalculate</button></div>'+
      panel('Result','Erlang C + shrinkage','<div class="wfm-kpis">'+kpi('Erlangs',fmt(s.erlangs,2),'traffic intensity')+kpi('Required',fmt(s.required),'service + occupancy')+kpi('FTE',fmt(s.fte,1),'after shrinkage')+kpi('Current SL',pct(s.serviceLevel),'at current agents')+kpi('ASA',fmt(s.asa,1)+' s','current agents')+'</div>')+'</div>'+
      panel('Sensitivity','agents vs service / occupancy / ASA','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agents</th><th>SL</th><th>Occupancy</th><th>ASA</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div>');
  }

  function capacityView(){
    const c=capacity();
    return intro('Capacity Planning','Convert workload into productive hours and FTE while keeping shrinkage visible as an explicit assumption.')+
      '<div class="wfm-tool-layout">'+panel('Inputs','weekly planning','<div class="wfm-mini-grid">'+field('Weekly volume','weeklyVolume',state.inputs.weeklyVolume)+field('AHT (sec)','aht',state.inputs.aht)+field('Shrinkage %','shrinkage',state.inputs.shrinkage)+field('Paid hours / FTE','paidHours',state.inputs.paidHours)+'</div>')+
      panel('Result','workload capacity','<div class="wfm-kpis">'+kpi('Workload',fmt(c.workload,1)+' h','gross')+kpi('Productive',fmt(c.productive,1)+' h','per FTE')+kpi('Required FTE',fmt(c.fte,1),'planning requirement')+'</div></div>');
  }

  function scheduleView(){
    const p=schedulePlan();
    const gap=p.gaps.reduce((a,v)=>a+Math.min(0,v),0);
    return intro('Schedule Planning','A schedule is a coverage decision, not a static list of shifts. The planner assigns agents to shift templates against interval need.')+
      '<div class="wfm-kpis">'+kpi('Assignments',p.assigned.length,'generated')+kpi('Under-coverage',fmt(Math.abs(gap)),'agent-intervals')+kpi('Shift templates',p.shifts.length,'available')+kpi('Planning grain',state.interval+' min','48 intervals')+'</div>'+
      panel('Generated assignments','greedy coverage heuristic — transparent, not an optimizer','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agent</th><th>Shift</th><th>Start</th><th>End</th></tr></thead><tbody>'+p.assigned.slice(0,20).map(x=>'<tr><td>'+x.agent+'</td><td>'+x.shift+'</td><td>'+x.start+':00</td><td>'+x.end+':00</td></tr>').join('')+'</tbody></table></div>')+
      panel('Coverage','required vs generated','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Time</th><th>Required</th><th>Coverage</th><th>Gap</th></tr></thead><tbody>'+p.rows.map((x,i)=>'<tr><td>'+x.time+'</td><td>'+x.required+'</td><td>'+p.coverage[i]+'</td><td class="'+(p.gaps[i]<0?'wfm-negative':'')+'">'+p.gaps[i]+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function adherenceView(){
    const a=adherenceSummary();
    return intro('Schedule Adherence','Measure whether people are where the schedule says they should be. Keep adherence and conformance distinct.')+
      panel('Agent adherence','scheduled, actual and non-production activity','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agent</th><th>Scheduled</th><th>Actual</th><th>Productive</th><th>Adherence</th><th>Conformance</th></tr></thead><tbody>'+a.map(x=>'<tr><td>'+x.id+'</td><td>'+x.scheduled+'</td><td>'+x.actual+'</td><td>'+x.productive+'</td><td>'+pct(x.adherence)+'</td><td>'+pct(x.conformance)+'</td></tr>').join('')+'</tbody></table></div>')+
      panel('Interpretation','why the distinction matters','<div class="wfm-note">Adherence measures alignment to scheduled productive activity after defined exclusions. Conformance compares actual elapsed time with scheduled time; values above 100% can indicate over-working rather than a positive operational outcome.</div>');
  }

  function intradayView(){
    const r=intervalPlan(),risk=r.filter(x=>x.gap<0);
    return intro('Intraday Control','Use actual demand, AHT and available staffing to diagnose the current day. The risk list is derived from interval-level gaps.')+
      '<div class="wfm-kpis">'+kpi('Risk intervals',risk.length,'below requirement')+kpi('Avg volume variance',pct(r.reduce((a,x)=>a+x.variance,0)/r.length),'vs forecast')+kpi('Peak required',fmt(Math.max(...r.map(x=>x.required))),'agents')+kpi('Current available',fmt(r[0].available),'first interval')+'</div>'+
      panel('Intraday timeline','48 × 30-minute records','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Time</th><th>Fcst</th><th>Actual</th><th>AHT</th><th>Req</th><th>Avail</th><th>Gap</th></tr></thead><tbody>'+r.map(x=>'<tr><td>'+x.time+'</td><td>'+x.forecast+'</td><td>'+x.actual+'</td><td>'+x.aht+'</td><td>'+x.required+'</td><td>'+x.available+'</td><td class="'+(x.gap<0?'wfm-negative':'')+'">'+x.gap+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function multichannelView(){
    const m=multichannel();
    return intro('Multichannel WFM','Different channels require different workload assumptions. Voice queueing, chat concurrency and asynchronous work are intentionally not treated as identical models.')+
      '<div class="wfm-kpis">'+kpi('Voice',m.voice,'Erlang C')+kpi('Chat',m.chat,'concurrency-adjusted')+kpi('Email',m.email,'workload proxy')+kpi('Combined',m.voice+m.chat+m.email,'illustrative')+'</div>'+
      panel('Model boundaries','do not hide assumptions','<div class="wfm-channel-grid"><div class="wfm-highlight"><b>Voice</b><span>Erlang C service-level queue</span></div><div class="wfm-highlight"><b>Chat</b><span>AHT adjusted by concurrency assumption</span></div><div class="wfm-highlight"><b>Email</b><span>backlog / turnaround model boundary</span></div></div>');
  }

  function scenarioView(){
    const base=staffing();
    const tests=[{name:'Base',aht:state.inputs.aht,volume:state.inputs.volume,shrinkage:state.inputs.shrinkage},
      {name:'+10% demand',aht:state.inputs.aht,volume:state.inputs.volume*1.1,shrinkage:state.inputs.shrinkage},
      {name:'+10% AHT',aht:state.inputs.aht*1.1,volume:state.inputs.volume,shrinkage:state.inputs.shrinkage},
      {name:'+5 pts shrinkage',aht:state.inputs.aht,volume:state.inputs.volume,shrinkage:state.inputs.shrinkage+5}];
    return intro('Scenario Lab','Compare operational levers using the same staffing engine. No hidden score: inspect service, requirement and FTE effects.')+
      panel('Scenario comparison','base vs controlled changes','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Scenario</th><th>Required</th><th>FTE</th><th>Gap vs base</th></tr></thead><tbody>'+tests.map(x=>{const s=staffing({...state.inputs,...x});return '<tr><td>'+x.name+'</td><td>'+s.required+'</td><td>'+fmt(s.fte,1)+'</td><td>'+((s.required-base.required)>=0?'+':'')+(s.required-base.required)+'</td></tr>';}).join('')+'</tbody></table></div>');
  }

  function reportingView(){
    const s=staffing(),c=capacity(),f=forecastModel(),r=intervalPlan();
    return intro('Reporting','A compact management layer built from the same calculations used by the operating views.')+
      '<div class="wfm-kpis">'+kpi('Service',pct(s.serviceLevel),'current')+kpi('Required FTE',fmt(s.fte,1),'staffing')+kpi('Forecast MAPE',pct(f.mape),'holdout')+kpi('Intraday risk',r.filter(x=>x.gap<0).length,'intervals')+'</div>'+
      panel('Executive narrative','evidence, assumptions, action','<div class="wfm-note"><b>Situation:</b> '+(s.gap>0?'current staffing is below calculated requirement.':'current staffing meets calculated requirement.')+' <b>Evidence:</b> '+fmt(s.required)+' required agents at '+pct(s.target)+' target with '+fmt(c.fte,1)+' capacity FTE. <b>Forecast:</b> holdout MAPE '+pct(f.mape)+'. <b>Next review:</b> inspect interval gaps, AHT and adherence before changing headcount.</div>');
  }

  function validationView(){
    const s=staffing(),c=capacity(),f=forecastModel(),r=intervalPlan();
    const checks=[
      ['Erlang calculation',Number.isFinite(s.erlangs)&&s.erlangs>0],
      ['Required staffing',s.required>0&&s.required<10000],
      ['Capacity FTE',Number.isFinite(c.fte)&&c.fte>0],
      ['Forecast horizon',f.future.length===Math.floor(state.inputs.forecastHorizon)],
      ['Interval records',r.length===48],
      ['LOB configuration',state.lobs.length>=4],
      ['Roster',state.agents.length>=10]
    ];
    return intro('Validation & Data Quality','The lab should expose invalid assumptions rather than silently producing plausible-looking numbers.')+
      panel('Runtime validation','calculation health','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Check</th><th>Status</th></tr></thead><tbody>'+checks.map(x=>'<tr><td>'+x[0]+'</td><td>'+(x[1]?'<b>PASS</b>':'<span class="wfm-negative">FAIL</span>')+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function decisionView(){
    const s=staffing(),r=intervalPlan(),f=forecastModel();
    return intro('WFM Decision Engine','Decision support must remain explainable: evidence first, assumptions second, action third.')+
      '<div class="wfm-kpis">'+kpi('Agent gap',fmt(s.gap),s.gap>0?'shortfall':'surplus')+kpi('Current SL',pct(s.serviceLevel),'observed model')+kpi('Forecast MAPE',pct(f.mape),'holdout')+kpi('Risk intervals',r.filter(x=>x.gap<0).length,'today')+'</div>'+
      panel('Decision evidence','inspect before intervention','<div class="wfm-command-grid">'+['Volume vs forecast','AHT vs plan','Shrinkage vs assumption','Skill coverage','Schedule coverage','Adherence','Intraday gap'].map(x=>'<div class="wfm-highlight"><b>'+x+'</b><span>evidence required</span></div>').join('')+'</div>');
  }

  function renderView(){
    switch(state.view){
      case 'setup':return setup();case 'data':return dataHub();case 'forecast':return forecastView();
      case 'staffing':return staffingView();case 'capacity':return capacityView();case 'schedule':return scheduleView();
      case 'adherence':return adherenceView();case 'intraday':return intradayView();case 'multichannel':return multichannelView();
      case 'scenario':return scenarioView();case 'reporting':return reportingView();case 'validation':return validationView();
      case 'decision':return decisionView();default:return command();
    }
  }

  function exportCsv(){
    const rows=state.intervals.map(x=>[x.time,x.forecast,x.actual==null?'':x.actual,x.aht,x.scheduled,x.available]);
    const csv=['time,forecast,actual,aht,scheduled,available',...rows.map(r=>r.join(','))].join('\n');
    const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='wfm-interval-plan.csv';a.click();URL.revokeObjectURL(url);
  }

  function importCsv(file,render){
    const reader=new FileReader();
    reader.onload=()=>{
      const lines=String(reader.result).split(/\r?\n/).filter(Boolean);
      if(lines.length<2)return;
      const header=lines.shift().split(',').map(x=>x.trim().toLowerCase());
      const ix=k=>header.indexOf(k);
      const rows=lines.map((line,i)=>{
        const p=line.split(',');
        return {index:i,time:p[ix('time')]||String(Math.floor(i/2)).padStart(2,'0')+(i%2?':30':':00'),
          forecast:num(p[ix('forecast')]),actual:p[ix('actual')]===''||p[ix('actual')]==null?null:num(p[ix('actual')]),
          aht:num(p[ix('aht')])||300,scheduled:num(p[ix('scheduled')])||0,available:num(p[ix('available')])||0};
      }).slice(0,96);
      if(rows.length)state.intervals=rows;
      render();
    };
    reader.readAsText(file);
  }

  function mount(el){
    if(!el)return;
    const render=()=>{el.innerHTML=nav()+renderView();bind();};
    const bind=()=>{
      el.querySelectorAll('[data-wfm-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.wfmView;render();}));
      el.querySelectorAll('[data-wfm-input]').forEach(i=>i.addEventListener('change',()=>{const k=i.dataset.wfmInput;if(k in state.inputs)state.inputs[k]=num(i.value);render();}));
      const file=$('#wfmCsv',el); if(file)file.addEventListener('change',()=>file.files[0]&&importCsv(file.files[0],render));
      el.querySelectorAll('[data-wfm-action="export"]').forEach(b=>b.addEventListener('click',exportCsv));
      el.querySelectorAll('[data-wfm-action="recalc"]').forEach(b=>b.addEventListener('click',render));
    };
    render();
  }

  window.WFM_LAB={version:'2.1.0',mount,state,engine:{erlangC,queue,requiredAgents,staffing,capacity,forecastModel,intervalPlan,schedulePlan,adherenceSummary,multichannel}};
})();
