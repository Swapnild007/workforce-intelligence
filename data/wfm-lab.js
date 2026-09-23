/* Workforce Intelligence — integrated WFM Lab
 * Offline-first, dependency-free training simulator.
 * The lab intentionally uses synthetic data and transparent formulas.
 */
(() => {
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v)));
  const n = v => Number(v) || 0;
  const fmt = (v, d=1) => Number(v).toLocaleString(undefined,{maximumFractionDigits:d});
  const pct = v => (Number(v)*100).toFixed(1)+'%';

  const state = {
    tab: 'overview',
    queue: { volume: 600, aht: 300, sl: 0.80, threshold: 20, agents: 30, maxOcc: 0.85 },
    forecast: { base: 520, trend: 4, seasonality: 12, aht: 300 },
    capacity: { weeklyVolume: 18000, aht: 300, shrinkage: 0.28, paidHours: 40 },
    schedule: { agents: 42, target: 30, shiftLength: 8, lunch: 1, breaks: 0.5 },
    intraday: { forecast: 100, actual: 128, ahtPlan: 300, ahtActual: 345, scheduled: 28, available: 25 }
  };

  // Erlang-C implementation using a recurrence rather than factorials.
  function erlangC(a, servers) {
    a = Math.max(0, n(a)); servers = Math.max(1, Math.floor(n(servers)));
    if (a >= servers) return 1;
    let term = 1, sum = 1;
    for (let k=1;k<servers;k++) { term *= a/k; sum += term; }
    const last = term * a / servers;
    return last / (sum + last * (servers/(servers-a)));
  }

  function queueMetrics(q=state.queue) {
    const a = n(q.volume) * n(q.aht) / 3600;
    const agents = Math.max(1, Math.floor(n(q.agents)));
    const rho = a / agents;
    if (rho >= 1) return { a, agents, rho, pw: 1, sl: 0, asa: Infinity, occupancy: 1 };
    const pw = erlangC(a, agents);
    const sl = 1 - pw * Math.exp(-(agents-a) * (n(q.threshold)/n(q.aht)));
    const asa = pw * n(q.aht) / (agents-a);
    return { a, agents, rho, pw, sl: Math.max(0,Math.min(1,sl)), asa, occupancy: Math.min(1,rho) };
  }

  function requiredAgents(q=state.queue) {
    for (let agents=Math.max(1,Math.ceil(q.volume*q.aht/3600)); agents<=500; agents++) {
      const m=queueMetrics({...q,agents});
      if(m.sl >= q.sl && m.occupancy <= q.maxOcc) return agents;
    }
    return 500;
  }

  function forecastSeries(f=state.forecast) {
    const values=[];
    for(let i=0;i<28;i++){
      const dow=i%7;
      const seasonal=[-0.06,-0.02,0.03,0.08,0.12,0.06,-0.09][dow];
      const trend=(1+n(f.trend)/100*i/28);
      const wave=Math.sin(i*0.8)*n(f.seasonality)/100;
      values.push(Math.max(0,Math.round(n(f.base)*trend*(1+seasonal+wave))));
    }
    const actual=values.slice(0,21).map((v,i)=>Math.max(0,Math.round(v*(1+Math.sin(i*1.37)*0.06+(i%5===0?0.08:0)))));
    const future=values.slice(21);
    const train=actual.slice(-7);
    const avg=train.reduce((a,b)=>a+b,0)/train.length;
    const forecast=future.map((v,i)=>Math.round(avg*(1+n(f.trend)/100*(i+1)/7)));
    const errors=future.map((v,i)=>v-forecast[i]);
    const mae=errors.reduce((a,e)=>a+Math.abs(e),0)/errors.length;
    const mape=errors.reduce((a,e,i)=>a+(vSafe(v=>Math.abs(e)/Math.max(1,v),future[i])),0)/errors.length;
    const bias=errors.reduce((a,e)=>a+e,0)/errors.length;
    return {actual, future, forecast, mae, mape, bias};
  }
  function vSafe(fn,v){try{return fn(v)}catch{return 0}}

  function capacityMetrics(c=state.capacity) {
    const workload=n(c.weeklyVolume)*n(c.aht)/3600;
    const productive=Math.max(0,n(c.paidHours)*(1-n(c.shrinkage)));
    const fte=productive?workload/productive:Infinity;
    return {workload, productive, fte};
  }

  function schedulePlan(s=state.schedule) {
    const interval=30, slots=24;
    const required=[];
    for(let i=0;i<slots;i++){
      const hour=8+i*0.5;
      const peak=Math.max(0,1-Math.abs(hour-13)/6);
      required.push(Math.round(n(s.target)*(0.72+0.28*peak)));
    }
    const shifts=[
      {name:'Early',start:8,end:16},{name:'Core',start:9,end:17},
      {name:'Mid',start:10,end:18},{name:'Late',start:11,end:19},
      {name:'Peak',start:12,end:20},{name:'Swing',start:13,end:21}
    ];
    const counts=Object.fromEntries(shifts.map(x=>[x.name,0]));
    const coverage=Array(slots).fill(0);
    for(let a=0;a<n(s.agents);a++){
      let best=null;
      for(const sh of shifts){
        let score=0;
        for(let i=0;i<slots;i++){
          const hour=8+i*.5;
          if(hour>=sh.start && hour<sh.end) score += Math.abs(Math.max(0,coverage[i]-required[i]));
        }
        score += a*.0001;
        if(!best || score<best.score) best={sh,score};
      }
      counts[best.sh.name]++;
      for(let i=0;i<slots;i++){
        const hour=8+i*.5;
        if(hour>=best.sh.start && hour<best.sh.end) coverage[i]++;
      }
    }
    const gaps=coverage.map((v,i)=>v-required[i]);
    return {required,coverage,gaps,counts,shifts};
  }

  function intradayMetrics(i=state.intraday) {
    const volumeVar=n(i.actual)/Math.max(1,n(i.forecast))-1;
    const ahtVar=n(i.ahtActual)/Math.max(1,n(i.ahtPlan))-1;
    const demand=n(i.actual)*n(i.ahtActual)/3600/1;
    const scheduled=n(i.scheduled);
    const available=n(i.available);
    const workloadFte=demand/1;
    const net=available-Math.ceil(workloadFte/300);
    return {volumeVar,ahtVar,demand,scheduled,available,net};
  }

  function input(label,key,value,step='1',min='0',max='100000') {
    return '<label class="wfm-field"><span>'+label+'</span><input data-wfm-input="'+key+'" type="number" value="'+value+'" step="'+step+'" min="'+min+'" max="'+max+'"></label>';
  }
  function kpi(label,value,sub='') {
    return '<article class="wfm-kpi"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></article>';
  }

  function tabs() {
    const items=[
      ['overview','Control Room'],['queue','Queueing'],['forecast','Forecast'],['capacity','Capacity'],
      ['schedule','Scheduling'],['intraday','Intraday'],['scenario','What-if']
    ];
    return '<div class="wfm-tabs">'+items.map(([id,label])=>'<button class="'+(state.tab===id?'active':'')+'" data-wfm-tab="'+id+'">'+label+'</button>').join('')+'</div>';
  }

  function overview() {
    const q=queueMetrics(), req=requiredAgents(), c=capacityMetrics(), sch=schedulePlan(), intr=intradayMetrics();
    const status=q.sl>=state.queue.sl && q.occupancy<=state.queue.maxOcc ? 'On target' : 'At risk';
    return '<div class="wfm-head"><div><span class="eyebrow">INTEGRATED WFM SIMULATOR</span><h2>Workforce Intelligence · WFM Lab</h2><p>One workspace for queueing, forecasting, capacity, scheduling, intraday control and what-if decisions. All calculations run locally.</p></div><div class="wfm-status '+(status==='On target'?'good':'risk')+'">'+status+'</div></div>'+
      '<div class="wfm-kpis">'+
      kpi('Required agents',fmt(req,0),'Erlang-C / target SLA')+
      kpi('Current SLA',pct(q.sl),'at current agent count')+
      kpi('Occupancy',pct(q.occupancy),'queueing model')+
      kpi('Weekly FTE',fmt(c.fte,1),'productive capacity')+
      kpi('Intraday net',fmt(intr.net,0),'available minus estimated need')+
      '</div>'+
      '<div class="wfm-grid2">'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Operating model</b><span>Plan → Execute → Learn</span></div><div class="wfm-flow"><div>Demand<small>Volume · AHT</small></div><i>→</i><div>Requirement<small>Erlang / workload</small></div><i>→</i><div>Schedule<small>Skills · rules</small></div><i>→</i><div>Intraday<small>Actual vs plan</small></div></div><div class="wfm-note">The lab deliberately separates forecast, required staffing, scheduled staffing and actual available staffing. They are different states of the operating system.</div></article>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Coverage snapshot</b><span>synthetic scenario</span></div>'+miniCoverage(sch)+'</article>'+
      '</div>'+
      '<div class="wfm-panel"><div class="wfm-panel-head"><b>Start with a controlled experiment</b><span>recommended sequence</span></div><div class="wfm-actions"><button data-wfm-tab="queue">① Size the queue</button><button data-wfm-tab="forecast">② Test the forecast</button><button data-wfm-tab="capacity">③ Plan capacity</button><button data-wfm-tab="schedule">④ Build coverage</button><button data-wfm-tab="intraday">⑤ Run intraday</button><button data-wfm-tab="scenario">⑥ Challenge the plan</button></div></div>';
  }

  function miniCoverage(sch) {
    const max=Math.max(...sch.required,...sch.coverage,1);
    return '<div class="wfm-bars">'+sch.required.map((r,i)=>'<div class="wfm-bar-row"><span>'+String(8+Math.floor(i/2)).padStart(2,'0')+':'+(i%2?'30':'00')+'</span><div><i style="width:'+(r/max*100)+'%"></i><b style="left:'+(Math.min(100,sch.coverage[i]/max*100))+'%"></b></div><em>'+((sch.coverage[i]-r)>0?'+':'')+(sch.coverage[i]-r)+'</em></div>').join('')+'</div>';
  }

  function queue() {
    const q=queueMetrics(), req=requiredAgents();
    const rows=[];
    for(let a=Math.max(1,req-3);a<=req+4;a++){const m=queueMetrics({...state.queue,agents:a});rows.push('<tr><td>'+a+'</td><td>'+pct(m.sl)+'</td><td>'+pct(m.occupancy)+'</td><td>'+ (isFinite(m.asa)?fmt(m.asa,1):'∞')+' s</td><td>'+pct(m.pw)+'</td></tr>')}
    return panelIntro('Queueing & Erlang-C','Understand the relationship between offered workload, staffing, service level, ASA and occupancy.','Classic Erlang-C assumes queued contacts wait until answered; abandonment/patience requires an abandonment-aware model. This lab labels that limitation instead of hiding it.','https://help.calabrio.com/doc/Content/user-guides/schedules/about-erlang-formula.htm')+
      '<div class="wfm-form-grid">'+input('Contacts / hour','q.volume',state.queue.volume,'1','1','100000')+input('AHT seconds','q.aht',state.queue.aht,'1','1','3600')+input('Service target %','q.slPct',state.queue.sl*100,'1','1','99.9')+input('Answer threshold seconds','q.threshold',state.queue.threshold,'1','1','600')+input('Agents','q.agents',state.queue.agents,'1','1','500')+input('Max occupancy %','q.maxOccPct',state.queue.maxOcc*100,'1','1','99')+'</div>'+
      '<div class="wfm-kpis">'+kpi('Traffic intensity',fmt(q.a,2),'Erlangs')+kpi('Required agents',fmt(req,0),'for target SLA + occupancy')+kpi('Current SLA',pct(q.sl),'predicted')+kpi('ASA',isFinite(q.asa)?fmt(q.asa,1)+' s':'∞','predicted')+kpi('Wait probability',pct(q.pw),'probability of waiting')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Staffing sensitivity</b><span>agents vs predicted performance</span></div><div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agents</th><th>SLA</th><th>Occupancy</th><th>ASA</th><th>Wait probability</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div></article>'+
      '<div class="wfm-note warn">Training model: Erlang-C is a transparent learning model, not a production staffing engine. Real WFM may incorporate abandonment/patience, multi-skill routing, non-voice work, shrinkage and platform-specific algorithms.</div>';
  }

  function forecast() {
    const f=forecastSeries();
    const svgW=900, svgH=230, max=Math.max(...f.actual,...f.future,...f.forecast,1);
    const all=f.actual.concat(f.forecast);
    const points=all.map((v,i)=>(i/(all.length-1))*svgW+','+(svgH-20-(v/max)*(svgH-45))).join(' ');
    const split=f.actual.length/(all.length-1)*svgW;
    return panelIntro('Forecast Studio','Create a transparent baseline, inspect error and bias, then test how trend and seasonality change the planning signal.','Forecasting is an input to staffing decisions—not the staffing decision itself.','https://all.docs.genesys.com/PEC-WFM/Current/Administrator/Forecasting')+
      '<div class="wfm-form-grid">'+input('Baseline volume','f.base',state.forecast.base,'1','1','100000')+input('Trend %','f.trend',state.forecast.trend,'0.5','-50','100')+input('Seasonality %','f.seasonality',state.forecast.seasonality,'0.5','0','50')+input('Planning AHT sec','f.aht',state.forecast.aht,'1','1','3600')+'</div>'+
      '<div class="wfm-kpis">'+kpi('MAE',fmt(f.mae,1),'synthetic holdout')+kpi('MAPE',pct(f.mape),'synthetic holdout')+kpi('Bias',fmt(f.bias,1),'actual − forecast')+kpi('Forecast horizon','7 days','simulated')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Forecast vs synthetic actual</b><span>blue = observed · violet = forecast</span></div><div class="wfm-chart"><svg viewBox="0 0 '+svgW+' '+svgH+'" preserveAspectRatio="none"><line x1="'+split+'" y1="0" x2="'+split+'" y2="'+svgH+'" class="wfm-split"></line><polyline points="'+points.slice(0, f.actual.length*2-1)+'" class="wfm-line"></polyline><polyline points="'+f.forecast.map((v,i)=>(((f.actual.length+i)/(all.length-1))*svgW)+','+(svgH-20-(v/max)*(svgH-45))).join(' ')+'" class="wfm-forecast"></polyline></svg></div></article>'+
      '<div class="wfm-note">The dataset is synthetic and intentionally deterministic so the same inputs produce the same result. In a real implementation, historical data quality, calendar events, trend, seasonality, interval patterns and overrides would all be governed explicitly.</div>';
  }

  function capacity() {
    const c=capacityMetrics();
    return panelIntro('Capacity Planner','Translate workload into productive hours and FTE while keeping shrinkage visible.','This is a capacity model; it is not a substitute for interval-level queueing or skill-level staffing requirements.','https://www.nice.com/products/workforce-management/nice-iex-wfm/planning')+
      '<div class="wfm-form-grid">'+input('Weekly contacts','c.weeklyVolume',state.capacity.weeklyVolume,'1','1','1000000')+input('AHT seconds','c.aht',state.capacity.aht,'1','1','3600')+input('Shrinkage %','c.shrinkagePct',state.capacity.shrinkage*100,'1','0','80')+input('Paid hours / agent / week','c.paidHours',state.capacity.paidHours,'0.5','1','80')+'</div>'+
      '<div class="wfm-kpis">'+kpi('Workload',fmt(c.workload,1)+' h','weekly handling workload')+kpi('Productive hours',fmt(c.productive,1),'per scheduled FTE')+kpi('Capacity FTE',fmt(c.fte,1),'workload ÷ productive hours')+kpi('Shrinkage',pct(state.capacity.shrinkage),'capacity lost to non-productive time')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Sensitivity to shrinkage</b><span>same demand · different productive capacity</span></div>'+[0.15,0.20,0.25,0.28,0.30,0.35,0.40].map(x=>{const f=n(state.capacity.paidHours)*(1-x),fte=c.workload/f;return '<div class="wfm-sensitivity"><span>'+pct(x)+'</span><div><i style="width:'+Math.min(100,fte/Math.max(c.fte,1)*70)+'%"></i></div><b>'+fmt(fte,1)+' FTE</b></div>'}).join('')+'</article>'+
      '<div class="wfm-note warn">Do not double-count shrinkage. The model exposes it as a capacity assumption so you can see how non-productive time changes the required headcount.</div>';
  }

  function schedule() {
    const p=schedulePlan();
    const avgGap=p.gaps.reduce((a,b)=>a+b,0)/p.gaps.length;
    return panelIntro('Schedule Builder','Generate a transparent heuristic schedule from shift templates, then inspect interval coverage.','Production schedulers may use many more rules—skills, contracts, availability, preferences, breaks, activities, labor constraints and optimization objectives.','https://help.calabrio.com/doc/Content/quick-start-guides/wfm-scheduling/six-steps-of-scheduling.htm')+
      '<div class="wfm-form-grid">'+input('Agents','s.agents',state.schedule.agents,'1','1','500')+input('Peak target agents','s.target',state.schedule.target,'1','1','500')+input('Shift length hours','s.shiftLength',state.schedule.shiftLength,'0.5','4','12')+input('Lunch hours','s.lunch',state.schedule.lunch,'0.25','0','2')+input('Break hours','s.breaks',state.schedule.breaks,'0.25','0','2')+'</div>'+
      '<div class="wfm-kpis">'+kpi('Agents scheduled',fmt(state.schedule.agents,0),'synthetic pool')+kpi('Average gap',fmt(avgGap,1),'coverage − requirement')+kpi('Peak requirement',fmt(Math.max(...p.required),0),'interval requirement')+kpi('Peak coverage',fmt(Math.max(...p.coverage),0),'generated schedule')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Generated shift mix</b><span>greedy coverage heuristic</span></div><div class="wfm-shifts">'+Object.entries(p.counts).map(([name,count])=>'<div><b>'+name+'</b><span>'+count+' agents</span></div>').join('')+'</div></article>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Interval coverage</b><span>requirement vs scheduled</span></div>'+miniCoverage(p)+'</article>'+
      '<button class="wfm-primary" data-wfm-action="rebuild-schedule">Re-run schedule optimization</button>'+
      '<div class="wfm-note">The schedule engine is deliberately transparent and heuristic. It teaches the mechanics of coverage and trade-offs without pretending a small browser algorithm is equivalent to an enterprise multi-skill optimizer.</div>';
  }

  function intraday() {
    const m=intradayMetrics();
    const coverageNeed=Math.max(1,Math.ceil(n(state.intraday.actual)*n(state.intraday.ahtActual)/3600/1/300));
    const net=n(state.intraday.available)-coverageNeed;
    const action=net<0?'Protect service: reallocate skills, move flexible activities/breaks, consider OT and escalate the gap.':'Coverage is currently positive; continue monitoring adherence and actual-vs-forecast drift.';
    return panelIntro('Intraday Control Room','Run the day: compare forecast with actual demand, AHT and available staffing, then choose an operational response.','Intraday management is where the plan meets reality: forecast vs actual, adherence, reforecasting and net staffing are central signals.','https://www.nice.com/products/workforce-management/nice-iex-wfm/managing')+
      '<div class="wfm-form-grid">'+input('Forecast contacts','i.forecast',state.intraday.forecast,'1','0','100000')+input('Actual contacts','i.actual',state.intraday.actual,'1','0','100000')+input('Plan AHT sec','i.ahtPlan',state.intraday.ahtPlan,'1','1','3600')+input('Actual AHT sec','i.ahtActual',state.intraday.ahtActual,'1','1','3600')+input('Scheduled agents','i.scheduled',state.intraday.scheduled,'1','0','500')+input('Available now','i.available',state.intraday.available,'1','0','500')+'</div>'+
      '<div class="wfm-kpis">'+kpi('Volume variance',pct(m.volumeVar),'actual vs forecast')+kpi('AHT variance',pct(m.ahtVar),'actual vs plan')+kpi('Estimated need',fmt(coverageNeed,0),'simple workload signal')+kpi('Net staffing',fmt(net,0),net<0?'understaffed':'overstaffed')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Intraday diagnosis</b><span>decision support</span></div><div class="wfm-diagnosis"><div class="'+(m.volumeVar>0.05?'risk':'good')+'"><b>Volume</b><span>'+pct(m.volumeVar)+'</span><small>'+ (m.volumeVar>0.05?'Above plan':'Near plan')+'</small></div><div class="'+(m.ahtVar>0.05?'risk':'good')+'"><b>AHT</b><span>'+pct(m.ahtVar)+'</span><small>'+ (m.ahtVar>0.05?'Above plan':'Near plan')+'</small></div><div class="'+(net<0?'risk':'good')+'"><b>Coverage</b><span>'+net+'</span><small>'+ (net<0?'Gap':'Positive')+'</small></div></div><p class="wfm-action">'+action+'</p></article>'+
      '<div class="wfm-note">A negative net staffing signal is not automatically a hiring decision. Diagnose whether the cause is demand, AHT, shrinkage, schedule coverage, adherence or skills before escalating.</div>';
  }

  function scenario() {
    const base=queueMetrics(), req=requiredAgents();
    const scenarios=[-20,-10,0,10,20].map(delta=>{
      const q={...state.queue,volume:state.queue.volume*(1+delta/100)};
      const r=requiredAgents(q), m=queueMetrics({...q,agents:Math.max(r,state.queue.agents)});
      return {delta,r,sl:m.sl,occ:m.occupancy};
    });
    return panelIntro('What-if Decision Studio','Stress-test volume, AHT and staffing assumptions before turning a scenario into an operational decision.','Use scenarios to understand sensitivity. A scenario is not a forecast and an optimization cannot manufacture missing capacity.','https://www.nice.com/resources/the-nice-iex-wfm-suite')+
      '<div class="wfm-form-grid">'+input('Base volume / hour','q.volume',state.queue.volume,'1','1','100000')+input('Base AHT sec','q.aht',state.queue.aht,'1','1','3600')+input('Available agents','q.agents',state.queue.agents,'1','1','500')+'</div>'+
      '<div class="wfm-kpis">'+kpi('Base requirement',fmt(req,0),'agents')+kpi('Base SLA',pct(base.sl),'at available agents')+kpi('Base occupancy',pct(base.occupancy),'queueing model')+'</div>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Volume stress test</b><span>required staffing response</span></div><div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Volume change</th><th>Required agents</th><th>Predicted SLA</th><th>Occupancy</th></tr></thead><tbody>'+scenarios.map(x=>'<tr><td>'+(x.delta>0?'+':'')+x.delta+'%</td><td>'+x.r+'</td><td>'+pct(x.sl)+'</td><td>'+pct(x.occ)+'</td></tr>').join('')+'</tbody></table></div></article>'+
      '<article class="wfm-panel"><div class="wfm-panel-head"><b>Decision prompt</b><span>VP-level thinking</span></div><div class="wfm-prompt">If demand rises 20% but the available workforce does not change, what would you investigate before recommending hiring? Record your assumptions, evidence and operational actions in Decision Lab.</div></article>';
  }

  function panelIntro(title,desc,note,url) {
    return '<div class="wfm-head"><div><span class="eyebrow">WFM LAB MODULE</span><h2>'+title+'</h2><p>'+desc+'</p></div></div><div class="wfm-note"><b>Model boundary:</b> '+note+' <a href="'+url+'" target="_blank" rel="noreferrer">Reference ↗</a></div>';
  }

  function render(root) {
    if(!root) return;
    const views={overview,queue,forecast,capacity,schedule,intraday,scenario};
    root.innerHTML=tabs()+'<div class="wfm-content">'+views[state.tab]()+'</div>';
    $$('.wfm-tabs [data-wfm-tab], [data-wfm-tab]',root).forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.wfmTab;render(root);}));
    $$('[data-wfm-input]',root).forEach(el=>el.addEventListener('input',()=>{
      const key=el.dataset.wfmInput.split('.');
      if(key[0]==='q'){ if(key[1]==='slPct') state.queue.sl=clamp(el.value/100,.01,.999); else if(key[1]==='maxOccPct') state.queue.maxOcc=clamp(el.value/100,.01,.999); else state.queue[key[1]]=n(el.value); }
      if(key[0]==='f') state.forecast[key[1]]=n(el.value);
      if(key[0]==='c'){ if(key[1]==='shrinkagePct') state.capacity.shrinkage=clamp(el.value/100,0,.8); else state.capacity[key[1]]=n(el.value); }
      if(key[0]==='s') state.schedule[key[1]]=n(el.value);
      if(key[0]==='i') state.intraday[key[1]]=n(el.value);
      if(key[0]==='q' || key[0]==='f' || key[0]==='c' || key[0]==='s' || key[0]==='i') render(root);
    }));
    $$('[data-wfm-action="rebuild-schedule"]',root).forEach(b=>b.addEventListener('click',()=>{render(root);}));
  }

  window.WFM_LAB = {
    mount(root){ render(root); },
    engine:{erlangC,queueMetrics,requiredAgents,forecastSeries,capacityMetrics,schedulePlan,intradayMetrics},
    state
  };
})();
