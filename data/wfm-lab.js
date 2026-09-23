/* Workforce Intelligence — WFM Lab
 * Rebuilt as one integrated, Call Centre Helper-inspired WFM workspace.
 * Uses original browser-native implementations and synthetic data.
 * Reference model: staffing calculator, day planner, forecasting, capacity,
 * schedule adherence, dashboard and multichannel workflows.
 */
(() => {
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const num = v => Number(v) || 0;
  const clamp = (v,a,b) => Math.max(a,Math.min(b,Number(v)));
  const pct = v => (Number(v)*100).toFixed(1)+'%';
  const fmt = (v,d=1) => Number(v).toLocaleString(undefined,{maximumFractionDigits:d});
  const esc = s => String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const generic = window.WFM_GENERIC_DATA || {};
  const state = {
    tab:'dashboard',
    interval:30,
    organization:generic.organization || {name:"Generic Contact Centre",timezone:"UTC",intervalMinutes:30},
    lobs:generic.lobs || [],
    skills:generic.skills || [],
    agents:generic.agents || [],
    staffing:{volume:400,aht:257,period:30,sl:80,threshold:20,shrinkage:30,occupancy:85,patience:90,agents:97},
    forecast:{months:24,horizon:12,level:.35,trend:.15,seasonality:.25},
    capacity:{weeklyVolume:18000,aht:300,shrinkage:28,paidHours:40,efficiency:100},
    schedule:{agents:42,target:30,shiftLength:8,lunch:1,breaks:.5,start:8},
    adherence:{scheduled:450,actual:420,breaks:30,training:0,meeting:0},
    intraday:{forecast:100,actual:128,ahtPlan:300,ahtActual:345,scheduled:28,available:25},
    dataset:{dailyDemand:generic.dailyDemand || {},historicalMonthly:generic.historicalMonthly || []},
    channels:{
      voice:{volume:400,aht:257,period:30,sl:80,threshold:20,shrinkage:30,occupancy:85},
      email:{volume:80,aht:600,period:60,sl:90,threshold:1440,shrinkage:30,occupancy:75},
      chat:{volume:55,aht:600,period:60,sl:90,threshold:60,shrinkage:30,occupancy:80,concurrency:2.5}
    }
  };

  function erlangC(a,agents){
    a=Math.max(0,num(a)); agents=Math.max(1,Math.floor(num(agents)));
    if(a>=agents)return 1;
    let term=1,sum=1;
    for(let k=1;k<agents;k++){term*=a/k;sum+=term;}
    const last=term*a/agents;
    return last/(sum+last*(agents/(agents-a)));
  }

  function queueMetrics(q=state.staffing){
    const period=Math.max(1,num(q.period)||60);
    const a=num(q.volume)*num(q.aht)/(60*period);
    const agents=Math.max(1,Math.floor(num(q.agents)));
    const rho=a/agents;
    if(rho>=1)return {a,agents,rho,pw:1,sl:0,asa:Infinity,occupancy:1,abandon:1};
    const pw=erlangC(a,agents);
    const sl=1-pw*Math.exp(-(agents-a)*(num(q.threshold)/num(q.aht)));
    const asa=pw*num(q.aht)/(agents-a);
    const patience=Math.max(1,num(q.patience));
    const abandon=Math.min(1,(pw*(1-Math.exp(-patience*(agents-a)/(agents*Math.max(1,num(q.aht)))))));
    return {a,agents,rho,pw,sl:clamp(sl,0,1),asa,occupancy:Math.min(1,rho),abandon};
  }

  function requiredAgents(q=state.staffing){
    const period=Math.max(1,num(q.period)||60);
    const raw=Math.max(1,Math.ceil(num(q.volume)*num(q.aht)/(60*period)));
    for(let agents=raw;agents<=10000;agents++){
      const m=queueMetrics({...q,agents});
      const targetSL=num(q.sl)>1?num(q.sl)/100:num(q.sl); const occInput=q.occupancy!=null?q.occupancy:q.maxOcc; const maxOcc=num(occInput)>1?num(occInput)/100:num(occInput||1); if(m.sl >= targetSL && m.occupancy <= maxOcc)return agents;
    }
    return 10000;
  }

  function fteRequired(q=state.staffing){
    const raw=requiredAgents(q);
    const shrinkRaw=num(q.shrinkage); const shrink=Math.max(0,Math.min(.95,shrinkRaw>1?shrinkRaw/100:shrinkRaw));
    return raw/(1-shrink);
  }

  function staffingTable(q=state.staffing){
    const req=requiredAgents(q), start=Math.max(1,req-4), rows=[];
    for(let agents=start;agents<=req+6;agents++){
      const m=queueMetrics({...q,agents});
      rows.push({agents,sl:m.sl,occ:m.occupancy,asa:m.asa,pw:m.pw,abandon:m.abandon});
    }
    return rows;
  }

  function dayPlan(q=state.staffing,interval=30){
    const slots=Math.round(24*60/interval), rows=[];
    for(let i=0;i<slots;i++){
      const h=i*interval/60;
      const peak=Math.exp(-Math.pow((h-13)/4.2,2));
      const volume=Math.max(1,Math.round(num(q.volume)*(0.52+0.56*peak)*(1+0.06*Math.sin(i*.55))));
      const req=requiredAgents({...q,volume});
      const m=queueMetrics({...q,volume,agents:req});
      rows.push({time:String(Math.floor(h)).padStart(2,'0')+':'+(i%2?'30':'00'),volume,agents:req,sl:m.sl,occ:m.occupancy});
    }
    return rows;
  }

  function holdoutForecast(f=state.forecast){
    const nMonths=Math.max(24,Math.floor(num(f.months)||24)), horizon=Math.max(1,Math.floor(num(f.horizon)||12));
    const actual=[];
    for(let i=0;i<nMonths;i++){
      const season=[.88,.91,.97,1.02,1.06,1.10,1.08,1.03,.99,.96,.93,.90][i%12];
      const trend=1+i*.012;
      actual.push(Math.round(8500*season*trend*(1+.045*Math.sin(i*1.7))));
    }
    const alpha=num(f.level)||.35,beta=num(f.trend)||.15,gamma=num(f.seasonality)||.25;
    const seasonLen=12;
    let level=actual[0],trend=actual[1]-actual[0], seasons=[];
    for(let i=0;i<seasonLen;i++)seasons[i]=actual[i]/Math.max(1,level);
    for(let i=1;i<actual.length;i++){
      const prev=level;
      const s=seasons[i%seasonLen]||1;
      level=alpha*(actual[i]/s)+(1-alpha)*(level+trend);
      trend=beta*(level-prev)+(1-beta)*trend;
      seasons[i%seasonLen]=gamma*(actual[i]/Math.max(1,level))+(1-gamma)*s;
    }
    const forecast=[];
    for(let h=1;h<=horizon;h++)forecast.push(Math.max(0,Math.round((level+h*trend)*(seasons[(actual.length+h-1)%seasonLen]||1))));
    const holdStart=Math.max(12,actual.length-6), base=actual.slice(0,holdStart), hold=actual.slice(holdStart);
    let l=base[0],t=base[1]-base[0],ss=[];
    for(let i=0;i<12;i++)ss[i]=base[i]/Math.max(1,l);
    for(let i=1;i<base.length;i++){const p=l,s=ss[i%12]||1;l=alpha*(base[i]/s)+(1-alpha)*(l+t);t=beta*(l-p)+(1-beta)*t;ss[i%12]=gamma*(base[i]/Math.max(1,l))+(1-gamma)*s;}
    const pred=hold.map((_,j)=>Math.max(0,Math.round((l+(j+1)*t)*(ss[(base.length+j)%12]||1))));
    const err=hold.map((v,i)=>v-pred[i]);
    const mae=err.reduce((a,e)=>a+Math.abs(e),0)/Math.max(1,err.length);
    const mape=err.reduce((a,e,i)=>a+Math.abs(e)/Math.max(1,hold[i]),0)/Math.max(1,err.length);
    const bias=err.reduce((a,e)=>a+e,0)/Math.max(1,err.length);
    return {actual,forecast,hold,pred,mae,mape,bias};
  }

  function forecastSeries(f=state.forecast){
    const r=holdoutForecast(f);
    return {actual:r.actual.slice(0,21),future:r.actual.slice(21,33),forecast:r.forecast.slice(0,12),mae:r.mae,mape:r.mape,bias:r.bias};
  }

  function capacityMetrics(c=state.capacity){
    const workload=num(c.weeklyVolume)*num(c.aht)/3600;
    const shrinkRaw=num(c.shrinkage); const shrink=shrinkRaw>1?shrinkRaw/100:shrinkRaw; const efficiencyRaw=num(c.efficiency)||100; const efficiency=efficiencyRaw>1?efficiencyRaw/100:efficiencyRaw; const productive=num(c.paidHours)*(1-shrink)*efficiency;
    return {workload,productive,fte:productive?workload/productive:Infinity};
  }

  function schedulePlan(s=state.schedule){
    const interval=30,slots=48,required=[],coverage=Array(slots).fill(0);
    for(let i=0;i<slots;i++){const h=i*.5+num(s.start);const peak=Math.exp(-Math.pow((h-13)/4,2));required.push(Math.max(0,Math.round(num(s.target)*(.58+.42*peak))));}
    const shifts=[
      {name:'Early',start:num(s.start),end:num(s.start)+8},
      {name:'Core',start:num(s.start)+1,end:num(s.start)+9},
      {name:'Mid',start:num(s.start)+2,end:num(s.start)+10},
      {name:'Peak',start:num(s.start)+3,end:num(s.start)+11},
      {name:'Late',start:num(s.start)+4,end:num(s.start)+12},
      {name:'Swing',start:num(s.start)+5,end:num(s.start)+13}
    ];
    const counts=Object.fromEntries(shifts.map(x=>[x.name,0]));
    for(let a=0;a<num(s.agents);a++){
      let best=shifts[0],bestScore=Infinity;
      for(const sh of shifts){
        let score=0;
        for(let i=0;i<slots;i++){const h=i*.5+num(s.start);if(h>=sh.start&&h<sh.end)score+=Math.max(0,required[i]-coverage[i]);}
        score+=Math.abs(a%6-shifts.indexOf(sh))*.01;
        if(score<bestScore){best=sh;bestScore=score;}
      }
      counts[best.name]++;
      for(let i=0;i<slots;i++){const h=i*.5+num(s.start);if(h>=best.start&&h<best.end)coverage[i]++;}
    }
    const gaps=coverage.map((v,i)=>v-required[i]);
    const over=gaps.reduce((a,v)=>a+Math.max(0,v),0),under=gaps.reduce((a,v)=>a+Math.max(0,-v),0);
    const ineff=(over+under)/Math.max(1,required.reduce((a,v)=>a+v,0));
    return {required,coverage,gaps,counts,shifts,ineff};
  }

  function adherenceMetrics(a=state.adherence){
    const scheduled=Math.max(0,num(a.scheduled));
    const offSchedule=Math.max(0,num(a.actual)-num(a.breaks)-num(a.training)-num(a.meeting));
    const adherence=scheduled?clamp(offSchedule/scheduled,0,1):0;
    const conformance=scheduled?num(a.actual)/scheduled:0;
    return {scheduled,adherent:offSchedule,adherence,conformance,variance:num(a.actual)-scheduled};
  }

  function intradayMetrics(i=state.intraday){
    const volumeVar=num(i.actual)/Math.max(1,num(i.forecast))-1;
    const ahtVar=num(i.ahtActual)/Math.max(1,num(i.ahtPlan))-1;
    const workloadHours=num(i.actual)*num(i.ahtActual)/3600;
    const required=Math.max(1,Math.ceil(workloadHours));
    const net=num(i.available)-required;
    return {volumeVar,ahtVar,workloadHours,required,net,scheduled:num(i.scheduled),available:num(i.available)};
  }

  function channelNeed(c){
    let aht=num(c.aht);
    if(c===state.channels.chat)aht=aht/Math.max(.5,num(c.concurrency));
    return requiredAgents({...c,aht,sl:num(c.sl),occupancy:num(c.occupancy)});
  }

  function multichannelMetrics(){
    const voice=channelNeed(state.channels.voice),email=channelNeed(state.channels.email),chat=channelNeed(state.channels.chat);
    return {voice,email,chat,total:voice+email+chat};
  }

  function kpi(label,value,sub=''){return '<article class="wfm-kpi"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></article>';}
  function field(label,key,value,step='1',min='0',max='1000000'){return '<label class="wfm-field"><span>'+label+'</span><input data-wfm-input="'+key+'" type="number" value="'+value+'" step="'+step+'" min="'+min+'" max="'+max+'"></label>';}
  function selectField(label,key,value,opts){return '<label class="wfm-field"><span>'+label+'</span><select data-wfm-input="'+key+'">'+opts.map(o=>'<option value="'+o[0]+'" '+(String(o[0])===String(value)?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></label>';}
  function intro(title,copy,source){return '<div class="wfm-head"><div><span class="eyebrow">WFM TOOL</span><h2>'+title+'</h2><p>'+copy+'</p></div><div class="wfm-source">Synthetic · Offline'+(source?' · <a href="'+source+'" target="_blank" rel="noreferrer">method reference</a>':'')+'</div></div>';}
  function panel(title,sub,body){return '<article class="wfm-panel"><div class="wfm-panel-head"><b>'+title+'</b><span>'+sub+'</span></div>'+body+'</article>';}

  function nav(){
    const items=[['dashboard','Command Center'],['setup','Operations Setup'],['staffing','Erlang Staffing'],['forecast','Forecasting'],['capacity','Capacity'],['schedule','Scheduling'],['adherence','Adherence'],['intraday','Intraday'],['multichannel','Multichannel']];
    return '<div class="wfm-tabs wfm-tools-nav">'+items.map(x=>'<button class="'+(state.tab===x[0]?'active':'')+'" data-wfm-tab="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
  }

  function setup(){
    const o=state.organization;
    return intro('Operations Setup','Generic operating model used by the WFM Lab. Everything here is synthetic and can be replaced later with imported interval, roster and skill data.')+
      '<div class="wfm-kpis">'+kpi('Business unit',esc(o.name),'generic dataset')+kpi('LOBs',state.lobs.length,'planning queues')+kpi('Skills',state.skills.length,'skill groups')+kpi('Agents',state.agents.length,'sample roster')+kpi('Interval',o.intervalMinutes+' min','planning grain')+'</div>'+ 
      panel('LOB catalogue','service and workload assumptions','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>LOB</th><th>Channel</th><th>SL target</th><th>AHT</th><th>Shrinkage</th></tr></thead><tbody>'+state.lobs.map(x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+esc(x.channel)+'</td><td>'+pct(x.targetSL)+'</td><td>'+fmt(x.aht,0)+' s</td><td>'+pct(x.shrinkage)+'</td></tr>').join('')+'</tbody></table></div>')+
      panel('Skill model','generic skill-to-LOB mapping','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Skill</th><th>Supported LOBs</th></tr></thead><tbody>'+state.skills.map(x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+x.lobs.map(id=>{const l=state.lobs.find(z=>z.id===id);return l?esc(l.name):id;}).join(', ')+'</td></tr>').join('')+'</tbody></table></div>')+
      panel('Roster sample','synthetic agents and skills','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agent</th><th>Skills</th></tr></thead><tbody>'+state.agents.map(x=>'<tr><td><b>'+esc(x.id)+'</b></td><td>'+x.skills.map(id=>{const s=state.skills.find(z=>z.id===id);return s?esc(s.name):id;}).join(', ')+'</td></tr>').join('')+'</tbody></table></div>')+
      '<div class="wfm-note">This dataset is deliberately generic. It contains no client names, employee PII, credentials or proprietary operational data.</div>';
  }

  function chartBars(rows,maxKey='agents'){
    const max=Math.max(1,...rows.map(r=>r[maxKey]));
    return '<div class="wfm-bars">'+rows.map(r=>'<div class="wfm-bar-row"><span>'+r.time+'</span><div><i style="width:'+r[maxKey]/max*100+'%"></i></div><em>'+fmt(r[maxKey],0)+'</em></div>').join('')+'</div>';
  }

  function dayTable(rows){
    return '<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Interval</th><th>Contacts</th><th>Required</th><th>SL</th><th>Occupancy</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r.time+'</td><td>'+fmt(r.volume,0)+'</td><td><b>'+fmt(r.agents,0)+'</b></td><td>'+pct(r.sl)+'</td><td>'+pct(r.occ)+'</td></tr>').join('')+'</tbody></table></div>';
  }

  function dashboard(){
    const q=queueMetrics(),req=requiredAgents(),fte=fteRequired(),c=capacityMetrics(),s=schedulePlan(),a=adherenceMetrics(),i=intradayMetrics(),m=multichannelMetrics();
    const day=dayPlan(state.staffing,state.interval);
    return intro('WFM Command Center','A single operating workspace linking demand → forecast → staffing → capacity → schedule → adherence → intraday → channel decisions. Built around the practical workflows found in Call Centre Helper’s tool collection.','https://www.callcentrehelper.com/articles/contact-centre-tools')+
      '<div class="wfm-kpis">'+kpi('Agents required',fmt(req,0),'Erlang C + max occupancy')+kpi('FTE incl. shrinkage',fmt(fte,1),'planning headcount')+kpi('Current service level',pct(q.sl),'current scenario')+kpi('Schedule inefficiency',pct(s.ineff),'coverage profile')+kpi('Adherence',pct(a.adherence),'sample team')+'</div>'+
      panel('LOB portfolio','generic planning queues','<div class="wfm-kpis wfm-mini-kpis">'+state.lobs.map(x=>{const demand=(state.dataset.dailyDemand[x.id]||[]).reduce((a,v)=>a+v,0);return kpi(x.name,fmt(demand,0),'synthetic daily contacts · '+pct(x.targetSL)+' SL');}).join('')+'</div>')+
      '<div class="wfm-command-grid">'+
      panel('1 · Staffing snapshot','Erlang C / A assumptions','<div class="wfm-mini-grid">'+kpi('Erlangs',fmt(q.a,2),'offered workload')+kpi('Wait probability',pct(q.pw),'probability a call waits')+kpi('ASA',isFinite(q.asa)?fmt(q.asa,1)+' s':'∞','predicted')+kpi('Abandon signal',pct(q.abandon),'patience model')+'</div>')+
      panel('2 · Day Planner','interval staffing profile',chartBars(day))+
      '</div>'+
      '<div class="wfm-command-grid">'+
      panel('3 · Forecast → Capacity','planning chain','<div class="wfm-flow"><div>Historical demand<small>24 months</small></div><i>→</i><div>Forecast<small>12 months</small></div><i>→</i><div>Workload<small>AHT × volume</small></div><i>→</i><div>FTE<small>shrinkage</small></div></div>')+
      panel('4 · Intraday signal','live scenario','<div class="wfm-diagnosis"><div class="'+(i.volumeVar>.05?'risk':'good')+'"><b>Volume</b><span>'+pct(i.volumeVar)+'</span><small>actual vs forecast</small></div><div class="'+(i.ahtVar>.05?'risk':'good')+'"><b>AHT</b><span>'+pct(i.ahtVar)+'</span><small>actual vs plan</small></div><div class="'+(i.net<0?'risk':'good')+'"><b>Net</b><span>'+fmt(i.net,0)+'</span><small>available − need</small></div></div>')+
      '</div>'+
      '<div class="wfm-command-grid">'+
      panel('5 · Multichannel','voice + email + chat','<div class="wfm-kpis wfm-mini-kpis">'+kpi('Voice',m.voice,'agents')+kpi('Email',m.email,'agents')+kpi('Chat',m.chat,'agents')+kpi('Blended',m.total,'simple sum')+'</div>')+
      panel('6 · Schedule adherence','team control','<div class="wfm-action"><b>Scheduled:</b> '+fmt(a.scheduled,0)+' min · <b>Adherent:</b> '+fmt(a.adherent,0)+' min · <b>Variance:</b> '+fmt(a.variance,0)+' min<br><small>Use adherence to diagnose the execution gap before changing the forecast.</small></div>')+
      '</div>'+
      panel('Operational chain','The lab is connected, not a collection of unrelated calculators.','<div class="wfm-actions"><button data-wfm-tab="staffing">① Calculate staffing</button><button data-wfm-tab="forecast">② Forecast demand</button><button data-wfm-tab="capacity">③ Convert to capacity</button><button data-wfm-tab="schedule">④ Test shifts</button><button data-wfm-tab="adherence">⑤ Measure adherence</button><button data-wfm-tab="intraday">⑥ Manage the day</button><button data-wfm-tab="multichannel">⑦ Blend channels</button></div>');
  }

  function staffing(){
    const q=state.staffing,m=queueMetrics(q),req=requiredAgents(q),fte=fteRequired(q),rows=staffingTable(q),day=dayPlan(q,state.interval);
    return intro('Erlang Staffing Calculator','Calculate raw agents, FTE with shrinkage, service level, ASA, occupancy, wait probability and an interval day planner. This follows the practical input/output pattern of the Call Centre Helper staffing calculator.','https://www.callcentrehelper.com/online-call-centre-staffing-calculator-77780-htm')+
      '<div class="wfm-tool-layout"><div>'+panel('Inputs','enter the interval assumptions','<div class="wfm-form-grid">'+field('Call volume','s.volume',q.volume,'1','1','100000')+field('Time period minutes','s.period',q.period,'1','5','1440')+field('Average handling time (sec)','s.aht',q.aht,'1','1','7200')+field('Required service level %','s.sl',q.sl,'1','1','99.9')+field('Target answer time (sec)','s.threshold',q.threshold,'1','1','3600')+field('Shrinkage %','s.shrinkage',q.shrinkage,'1','0','90')+field('Maximum occupancy %','s.occupancy',q.occupancy,'1','1','99')+field('Average patience / ATA sec','s.patience',q.patience,'1','1','3600')+field('Current agents','s.agents',q.agents,'1','1','10000')+'</div>')+
      panel('Result','what the assumptions imply','<div class="wfm-kpis">'+kpi('Erlangs',fmt(m.a,2),'volume × AHT / period')+kpi('Agents required',fmt(req,0),'raw service requirement')+kpi('FTE required',fmt(fte,1),'after shrinkage')+kpi('Service level',pct(m.sl),'with current agents')+kpi('ASA',isFinite(m.asa)?fmt(m.asa,1)+' s':'∞','average speed of answer')+'</div>')+'</div>'+
      '<div>'+panel('Staffing sensitivity','change agents and watch the curve','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agents</th><th>Service level</th><th>Occupancy</th><th>ASA</th><th>Wait</th><th>Abandon signal</th></tr></thead><tbody>'+rows.map(r=>'<tr class="'+(r.agents===req?'wfm-highlight':'')+'"><td><b>'+r.agents+'</b></td><td>'+pct(r.sl)+'</td><td>'+pct(r.occ)+'</td><td>'+fmt(r.asa,1)+' s</td><td>'+pct(r.pw)+'</td><td>'+pct(r.abandon)+'</td></tr>').join('')+'</tbody></table></div>')+
      panel('Day Planner','interval-by-interval requirement',dayTable(day))+'</div></div>'+
      '<div class="wfm-note warn">Model note: Erlang C assumes queued contacts wait for service. The abandonment figure here is a transparent Erlang-A-style learning signal, not a claim of parity with a commercial WFM engine.</div>';
  }

  function forecast(){
    const f=state.forecast,r=holdoutForecast(f);
    const max=Math.max(...r.actual,...r.forecast,1), pts=r.actual.map((v,i)=>i/(r.actual.length-1)*100+','+(100-v/max*85)).join(' ');
    return intro('Forecasting Workbench','Start with a minimum 24-month history, expose level/trend/seasonality, generate a 12-month planning horizon and inspect error before feeding demand into staffing.','https://www.callcentrehelper.com/forecasting-excel-template-73193.htm')+
      panel('Forecast controls','Holt-Winters style learning model','<div class="wfm-form-grid">'+field('History months','f.months',f.months,'1','24','120')+field('Forecast horizon','f.horizon',f.horizon,'1','1','24')+field('Level alpha','f.level',f.level,'0.05','0.05','1')+field('Trend beta','f.trend',f.trend,'0.05','0.01','1')+field('Seasonality gamma','f.seasonality',f.seasonality,'0.05','0.01','1')+'</div>')+
      '<div class="wfm-kpis">'+kpi('MAE',fmt(r.mae,0),'holdout error')+kpi('MAPE',pct(r.mape),'holdout error')+kpi('Bias',fmt(r.bias,0),'actual − forecast')+kpi('Forecast horizon',r.forecast.length+' months','planning output')+kpi('History',r.actual.length+' months','synthetic')+'</div>'+
      panel('Demand history','observed synthetic demand','<div class="wfm-chart wfm-chart-tall"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="'+pts+'" class="wfm-line"></polyline></svg></div>')+
      panel('Forecast output','next planning periods','<div class="wfm-forecast-grid">'+r.forecast.map((v,i)=>'<div><span>M+'+(i+1)+'</span><b>'+fmt(v,0)+'</b><small>contacts</small></div>').join('')+'</div>')+
      '<div class="wfm-note">Call Centre Helper’s spreadsheet workflow uses historical monthly demand and Holt-Winters-style components, then notes that workforce scheduling requires breaking the forecast down to daily and interval demand before staffing. This lab preserves that relationship.</div>';
  }

  function capacity(){
    const c=capacityMetrics(state.capacity), rows=[15,20,25,28,30,35,40].map(x=>{const p=num(state.capacity.paidHours)*(1-x/100)*(num(state.capacity.efficiency)/100);return {x,fte:c.workload/Math.max(1,p)};});
    return intro('Capacity Planner','Convert demand and AHT into workload hours, productive hours and FTE. Keep shrinkage and efficiency explicit so they can be challenged separately.','https://www.callcentrehelper.com/shrinkage-90353.htm')+
      panel('Inputs','weekly capacity assumptions','<div class="wfm-form-grid">'+field('Weekly contacts','c.weeklyVolume',state.capacity.weeklyVolume,'1','1','1000000')+field('AHT seconds','c.aht',state.capacity.aht,'1','1','7200')+field('Shrinkage %','c.shrinkage',state.capacity.shrinkage,'1','0','90')+field('Paid hours / week','c.paidHours',state.capacity.paidHours,'.5','1','80')+field('Efficiency %','c.efficiency',state.capacity.efficiency,'1','1','100')+'</div>')+
      '<div class="wfm-kpis">'+kpi('Workload',fmt(c.workload,1)+' h','weekly handling workload')+kpi('Productive hours',fmt(c.productive,1),'per FTE')+kpi('Capacity FTE',fmt(c.fte,1),'workload ÷ productive hours')+kpi('Shrinkage',state.capacity.shrinkage+'%','planning assumption')+'</div>'+
      panel('Shrinkage sensitivity','same workload, different headcount','<div class="wfm-sensitivity-grid">'+rows.map(r=>'<div><span>'+r.x+'%</span><div><i style="width:'+Math.min(100,r.fte/Math.max(c.fte,1)*70)+'%"></i></div><b>'+fmt(r.fte,1)+' FTE</b></div>').join('')+'</div>')+
      '<div class="wfm-note warn">Capacity planning is not interval staffing. Use this view for long-range workload/FTE thinking, then use the Staffing and Schedule tools for interval-level requirements.</div>';
  }

  function schedule(){
    const s=state.schedule,p=schedulePlan(s);
    return intro('Schedule & Shift Planner','Test shift patterns against a demand profile and make schedule inefficiency visible. The goal is not to hide gaps—it is to show where the pattern creates under/over coverage.','https://www.callcentrehelper.com/shift-planning-faqs-167924.htm')+
      panel('Schedule assumptions','simple shift-pattern model','<div class="wfm-form-grid">'+field('Agents','sch.agents',s.agents,'1','1','1000')+field('Peak requirement','sch.target',s.target,'1','1','500')+field('Shift length hours','sch.shiftLength',s.shiftLength,'.5','4','12')+field('Lunch hours','sch.lunch',s.lunch,'.25','0','2')+field('Break hours','sch.breaks',s.breaks,'.25','0','2')+field('Operating start hour','sch.start',s.start,'.5','0','23.5')+'</div>')+
      '<div class="wfm-kpis">'+kpi('Inefficiency',pct(p.ineff),'over + under coverage')+kpi('Agents',fmt(s.agents,0),'schedule pool')+kpi('Peak required',fmt(Math.max(...p.required),0),'demand curve')+kpi('Peak coverage',fmt(Math.max(...p.coverage),0),'shift pattern')+'</div>'+
      panel('Shift mix','generated pattern','<div class="wfm-shifts">'+Object.entries(p.counts).map(([k,v])=>'<div><b>'+k+'</b><span>'+v+' agents</span></div>').join('')+'</div>')+
      panel('Coverage by 30-minute interval','required vs scheduled','<div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Interval</th><th>Required</th><th>Scheduled</th><th>Gap</th></tr></thead><tbody>'+p.required.map((v,i)=>'<tr><td>'+String(Math.floor(i/2)+s.start).padStart(2,'0')+':'+(i%2?'30':'00')+'</td><td>'+v+'</td><td>'+p.coverage[i]+'</td><td class="'+(p.gaps[i]<0?'wfm-negative':'')+'">'+(p.gaps[i]>0?'+':'')+p.gaps[i]+'</td></tr>').join('')+'</tbody></table></div>');
  }

  function adherence(){
    const a=state.adherence,m=adherenceMetrics(a);
    return intro('Schedule Adherence','Compare scheduled time with actual activity and make the individual/team adherence calculation explicit. The workbook-style workflow is preserved, but the calculation runs in the browser.','https://www.callcentrehelper.com/excel-schedule-adherence-tool-164323.htm')+
      panel('Inputs','sample agent/team record','<div class="wfm-form-grid">'+field('Scheduled minutes','a.scheduled',a.scheduled,'1','0','1440')+field('Actual minutes','a.actual',a.actual,'1','0','1440')+field('Break minutes','a.breaks',a.breaks,'1','0','240')+field('Training minutes','a.training',a.training,'1','0','480')+field('Meeting minutes','a.meeting',a.meeting,'1','0','480')+'</div>')+
      '<div class="wfm-kpis">'+kpi('Schedule adherence',pct(m.adherence),'aligned activity ÷ scheduled')+kpi('Conformance',pct(m.conformance),'actual ÷ scheduled')+kpi('Scheduled',fmt(m.scheduled,0)+' min','baseline')+kpi('Adherent',fmt(m.adherent,0)+' min','aligned activity')+kpi('Variance',fmt(m.variance,0)+' min','actual − scheduled')+'</div>'+
      panel('Interpretation','do not confuse adherence with conformance','<div class="wfm-action"><b>Adherence:</b> '+pct(m.adherence)+'<br><small>Use the activity breakdown to understand whether time away from the planned state was a scheduled activity or an execution gap. The Call Centre Helper template also distinguishes scheduled and actual time and can be extended for multiple breaks.</small></div>')+
      '<div class="wfm-note">Formula used: schedule adherence = minutes in adherence ÷ total scheduled minutes × 100. The exact definition of “in adherence” should be agreed with the operation and data source.</div>';
  }

  function intraday(){
    const i=state.intraday,m=intradayMetrics(i);
    const action=m.net<0?'Coverage gap: validate adherence, skills and AHT; move flexible activities/breaks before escalating.':'Coverage positive: keep monitoring drift and reforecast if the variance persists.';
    return intro('Intraday Control','Compare forecast vs actual, planned vs actual AHT and scheduled vs available staffing. Then use the signal to drive a controlled intervention.','https://www.nice.com/products/workforce-management/nice-iex-wfm/managing')+
      panel('Live inputs','one interval scenario','<div class="wfm-form-grid">'+field('Forecast contacts','i.forecast',i.forecast,'1','0','100000')+field('Actual contacts','i.actual',i.actual,'1','0','100000')+field('Plan AHT sec','i.ahtPlan',i.ahtPlan,'1','1','7200')+field('Actual AHT sec','i.ahtActual',i.ahtActual,'1','1','7200')+field('Scheduled agents','i.scheduled',i.scheduled,'1','0','1000')+field('Available agents','i.available',i.available,'1','0','1000')+'</div>')+
      '<div class="wfm-kpis">'+kpi('Volume variance',pct(m.volumeVar),'actual vs forecast')+kpi('AHT variance',pct(m.ahtVar),'actual vs plan')+kpi('Workload',fmt(m.workloadHours,2)+' h','interval workload')+kpi('Required now',fmt(m.required,0),'simplified workload signal')+kpi('Net staffing',fmt(m.net,0),m.net<0?'gap':'surplus')+'</div>'+
      panel('Intraday diagnosis','evidence before intervention','<div class="wfm-diagnosis"><div class="'+(m.volumeVar>.05?'risk':'good')+'"><b>Demand</b><span>'+pct(m.volumeVar)+'</span><small>volume variance</small></div><div class="'+(m.ahtVar>.05?'risk':'good')+'"><b>AHT</b><span>'+pct(m.ahtVar)+'</span><small>AHT variance</small></div><div class="'+(m.net<0?'risk':'good')+'"><b>Coverage</b><span>'+m.net+'</span><small>net agents</small></div></div><p class="wfm-action">'+action+'</p>')+
      '<div class="wfm-note warn">A simplified workload signal is intentionally used here. A production intraday engine would also incorporate interval queueing, shrinkage, skill routing, adherence, offline work, reforecasting and real-time platform data.</div>';
  }

  function multichannel(){
    const c=state.channels,m=multichannelMetrics();
    return intro('Multichannel Staffing Simulator','Model voice, email and web chat in one workspace. Chat uses an explicit concurrency factor so the effective AHT assumption is visible.','https://www.callcentrehelper.com/multi-channel-contact-centre-calculator-96321.htm')+
      '<div class="wfm-channel-grid">'+
      panel('Voice','queueing input','<div class="wfm-form-grid">'+field('Contacts / period','v.volume',c.voice.volume,'1','0','100000')+field('AHT sec','v.aht',c.voice.aht,'1','1','7200')+field('Period min','v.period',c.voice.period,'1','1','1440')+field('Service level %','v.sl',c.voice.sl,'1','1','99.9')+field('Answer sec','v.threshold',c.voice.threshold,'1','1','3600')+field('Shrinkage %','v.shrinkage',c.voice.shrinkage,'1','0','90')+field('Max occupancy %','v.occupancy',c.voice.occupancy,'1','1','99')+'</div>')+
      panel('Email','asynchronous workload','<div class="wfm-form-grid">'+field('Contacts / period','e.volume',c.email.volume,'1','0','100000')+field('AHT sec','e.aht',c.email.aht,'1','1','7200')+field('Period min','e.period',c.email.period,'1','1','1440')+field('Service level %','e.sl',c.email.sl,'1','1','99.9')+field('Answer sec','e.threshold',c.email.threshold,'1','1','86400')+field('Shrinkage %','e.shrinkage',c.email.shrinkage,'1','0','90')+field('Max occupancy %','e.occupancy',c.email.occupancy,'1','1','99')+'</div>')+
      panel('Web chat','concurrency-aware approximation','<div class="wfm-form-grid">'+field('Chats / period','h.volume',c.chat.volume,'1','0','100000')+field('AHT sec','h.aht',c.chat.aht,'1','1','7200')+field('Period min','h.period',c.chat.period,'1','1','1440')+field('Service level %','h.sl',c.chat.sl,'1','1','99.9')+field('Answer sec','h.threshold',c.chat.threshold,'1','1','3600')+field('Shrinkage %','h.shrinkage',c.chat.shrinkage,'1','0','90')+field('Max occupancy %','h.occupancy',c.chat.occupancy,'1','1','99')+field('Concurrency','h.concurrency',c.chat.concurrency,'.1','.5','10')+'</div>')+
      '</div>'+
      '<div class="wfm-kpis">'+kpi('Voice',m.voice,'agents')+kpi('Email',m.email,'agents')+kpi('Chat',m.chat,'agents')+kpi('Blended total',m.total,'simple additive planning view')+'</div>'+
      panel('Channel planning note','what this simulator does not hide','<div class="wfm-note">The multichannel tool is intentionally transparent. Email and chat have different operational characteristics; chat concurrency changes effective workload, and a simple Erlang approximation is not a full omnichannel optimizer. Use the result as a scenario signal, not a production commitment.</div>');
  }

  function render(){
    const root=$('#wfmLabRoot'); if(!root)return;
    const views={dashboard,setup,staffing,forecast,capacity,schedule,adherence,intraday,multichannel};
    root.innerHTML=nav()+'<div class="wfm-content">'+views[state.tab]()+'</div>';
    $$('.wfm-tabs button[data-wfm-tab]',root).forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.wfmTab;render();}));
    $$('.wfm-content [data-wfm-tab]',root).forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.wfmTab;render();}));
    $$('.wfm-field input[data-wfm-input],.wfm-field select[data-wfm-input]',root).forEach(el=>el.addEventListener('change',()=>{
      const k=el.dataset.wfmInput.split('.');
      if(k[0]==='s')state.staffing[k[1]]=num(el.value);
      else if(k[0]==='f')state.forecast[k[1]]=num(el.value);
      else if(k[0]==='c')state.capacity[k[1]]=num(el.value);
      else if(k[0]==='sch')state.schedule[k[1]]=num(el.value);
      else if(k[0]==='a')state.adherence[k[1]]=num(el.value);
      else if(k[0]==='i')state.intraday[k[1]]=num(el.value);
      else if(k[0]==='v')state.channels.voice[k[1]]=num(el.value);
      else if(k[0]==='e')state.channels.email[k[1]]=num(el.value);
      else if(k[0]==='h')state.channels.chat[k[1]]=num(el.value);
      render();
    }));
  }

  window.WFM_LAB={
    mount(root){ if(root){render();} },
    engine:{erlangC,queueMetrics,requiredAgents,fteRequired,dayPlan,forecastSeries,holdoutForecast,capacityMetrics,schedulePlan,adherenceMetrics,intradayMetrics,multichannel:multichannelMetrics}
  };
})();