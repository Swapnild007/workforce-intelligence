/* Workforce Intelligence — Call Centre Helper inspired WFM project suite.
 * Re-implemented from documented tool concepts as original, offline-first web functionality.
 * No third-party code, workbook, branding or proprietary assets are copied.
 */
(() => {
  'use strict';
  const rootState = { tab:'erlang', adherence:[
    {name:'Agent 001',scheduled:420,adherent:405},
    {name:'Agent 002',scheduled:420,adherent:392},
    {name:'Agent 003',scheduled:450,adherent:438},
    {name:'Agent 004',scheduled:420,adherent:414},
    {name:'Agent 005',scheduled:450,adherent:430}
  ]};
  const n=v=>Number(v)||0, pct=v=>(n(v)*100).toFixed(1)+'%', fmt=(v,d=1)=>n(v).toLocaleString(undefined,{maximumFractionDigits:d});
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,n(v)));

  function erlangC(a,c){
    a=Math.max(0,n(a)); c=Math.max(1,Math.floor(n(c)));
    if(a>=c)return 1;
    let term=1,sum=1;
    for(let k=1;k<c;k++){term*=a/k;sum+=term;}
    const last=term*a/c;
    return last/(sum+last*(c/(c-a)));
  }

  // Erlang-A M/M/c+M using the stationary birth-death distribution.
  function erlangA({volume,period,aht,agents,patience,threshold=20}){
    const seconds=Math.max(1,n(aht)), periodSec=Math.max(1,n(period)*60);
    const lambda=Math.max(0,n(volume))/periodSec;
    const mu=1/seconds, theta=1/Math.max(1,n(patience)), c=Math.max(1,Math.floor(n(agents)));
    const maxStates=Math.max(c+200,Math.ceil(lambda/mu+c+10*lambda/theta));
    const weights=[1];
    for(let k=1;k<=maxStates;k++){
      const death=k<=c?k*mu:c*mu+(k-c)*theta;
      weights[k]=weights[k-1]*lambda/Math.max(death,1e-12);
      if(!Number.isFinite(weights[k])||weights[k]>1e250){for(let j=1;j<weights.length;j++)weights[j]/=1e250;weights[0]/=1e250;}
    }
    const sum=weights.reduce((a,b)=>a+b,0);
    const p=weights.map(w=>w/sum);
    const pWait=p.slice(c).reduce((a,b)=>a+b,0);
    let lq=0; for(let k=c+1;k<p.length;k++)lq+=(k-c)*p[k];
    const abandonRate=theta*lq;
    const abandonPct=lambda?clamp(abandonRate/lambda,0,1):0;
    const asa=lambda?lq/lambda:0;
    const offered=lambda/mu;
    const occupancy=clamp(offered/c,0,1);
    const servedRate=Math.max(0,lambda-abandonRate);
    const servedWithin= p.slice(0,c).reduce((a,b)=>a+b,0) + pWait*Math.max(0,1-Math.exp(-(c-offered)*Math.max(0,n(threshold))/seconds));
    return {offered,c,pWait,lq,abandonRate,abandonPct,asa,occupancy,servedRate,sl:clamp(servedWithin,0,1)};
  }

  function requiredC(q){
    const base=Math.max(1,Math.ceil(n(q.volume)*n(q.aht)/(Math.max(1,n(q.period))*60)));
    for(let c=base;c<=500;c++){
      const m=erlangA({...q,agents:c});
      if(m.sl>=n(q.sl)/100 && m.occupancy<=n(q.occ)/100)return c;
    }
    return 500;
  }

  function holtWinters(data,season,alpha=.35,beta=.15,gamma=.25,horizon=12){
    const y=data.map(n), s=Math.max(1,Math.floor(season));
    if(y.length<Math.max(2,s*2)) return {forecast:Array.from({length:horizon},(_,i)=>Math.max(0,y[y.length-1]||0)),fitted:[],mae:0,mape:0};
    let level=y[0], trend=(y[s]-y[0])/s, seasonal=[];
    for(let i=0;i<s;i++) seasonal[i]=y[i]-level;
    const fitted=[];
    for(let t=0;t<y.length;t++){
      const idx=t%s, prevLevel=level, prevTrend=trend, oldS=seasonal[idx]||0;
      if(t===0){fitted.push(y[0]);continue;}
      const pred=prevLevel+prevTrend+oldS; fitted.push(pred);
      level=alpha*(y[t]-oldS)+(1-alpha)*(prevLevel+prevTrend);
      trend=beta*(level-prevLevel)+(1-beta)*prevTrend;
      seasonal[idx]=gamma*(y[t]-level)+(1-gamma)*oldS;
    }
    const start=Math.max(1,y.length-s*2), errors=y.slice(start).map((v,i)=>v-fitted[start+i]);
    const mae=errors.reduce((a,e)=>a+Math.abs(e),0)/Math.max(1,errors.length);
    const mape=errors.reduce((a,e,i)=>a+Math.abs(e)/Math.max(1,y[start+i]),0)/Math.max(1,errors.length);
    const forecast=[];
    for(let h=1;h<=horizon;h++) forecast.push(Math.max(0,level+h*trend+(seasonal[(y.length+h-1)%s]||0)));
    return {forecast,fitted,mae,mape};
  }

  function parseSeries(text){
    const values=String(text).split(/[\s,;\n\r]+/).map(Number).filter(Number.isFinite).map(Math.round);
    return values;
  }

  function input(label,key,value,step='1',min='0',max='1000000'){
    return '<label class="wfm-field"><span>'+label+'</span><input data-wfp-input="'+key+'" type="number" value="'+value+'" step="'+step+'" min="'+min+'" max="'+max+'"></label>';
  }
  function projectHead(title,desc,badge){
    return '<div class="wfp-head"><div><span class="eyebrow">'+badge+'</span><h2>'+title+'</h2><p>'+desc+'</p></div></div>';
  }
  function kpi(label,value,sub=''){return '<article class="wfp-kpi"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></article>';}
  function note(text){return '<div class="wfm-note">'+text+'</div>';}

  function erlangProject(){
    const q=state.erlang, req=requiredC(q), c=erlangA({...q,agents:q.agents});
    const cC=window.WFM_LAB?.engine?.queueMetrics ? window.WFM_LAB.engine.queueMetrics({volume:q.volume*60/q.period,aht:q.aht,sl:q.sl/100,threshold:q.threshold,agents:q.agents,maxOcc:q.occ/100}) : null;
    const rawReq=Math.max(1,Math.ceil(n(q.volume)*n(q.aht)/(Math.max(1,n(q.period))*60)));
    const fte=Math.ceil(req/Math.max(.01,1-q.shrinkage/100));
    return projectHead('Erlang Staffing Calculator','A browser-native version of the core Erlang staffing workflow: interval demand → workload → staffing → service level → occupancy → shrinkage. Includes an abandonment-aware Erlang-A view.','PROJECT 01 · QUEUEING')+
      '<div class="wfp-form">'+input('Contacts / interval','e.volume',q.volume,'1','1','100000')+input('Interval minutes','e.period',q.period,'1','1','120')+input('AHT seconds','e.aht',q.aht,'1','1','3600')+input('Service level %','e.sl',q.sl,'0.1','1','99.9')+input('Answer threshold sec','e.threshold',q.threshold,'1','1','600')+input('Max occupancy %','e.occ',q.occ,'0.1','1','99')+input('Shrinkage %','e.shrinkage',q.shrinkage,'0.5','0','80')+input('Mean patience sec','e.patience',q.patience,'1','1','3600')+input('Agents to test','e.agents',q.agents,'1','1','500')+'</div>'+
      '<div class="wfp-kpis">'+kpi('Traffic',fmt(c.offered,2),'Erlangs')+kpi('Erlang-C req.',fmt(rawReq,0),'raw workload floor')+kpi('Erlang-A req.',fmt(req,0),'meets SL + occupancy')+kpi('FTE incl. shrinkage',fmt(fte,0),'planning headcount')+kpi('Erlang-A abandon',pct(c.abandonPct),'patience model')+kpi('Erlang-A ASA',fmt(c.asa,1)+' s','queue wait')+'</div>'+
      '<div class="wfp-grid2"><article class="wfp-panel"><b>Model comparison</b><table class="wfm-table"><thead><tr><th>Metric</th><th>Erlang-C</th><th>Erlang-A</th></tr></thead><tbody><tr><td>Service level</td><td>'+(cC?pct(cC.sl):'—')+'</td><td>'+pct(c.sl)+'</td></tr><tr><td>Occupancy</td><td>'+(cC?pct(cC.occupancy):'—')+'</td><td>'+pct(c.occupancy)+'</td></tr><tr><td>ASA</td><td>'+(cC&&isFinite(cC.asa)?fmt(cC.asa,1)+' s':'—')+'</td><td>'+fmt(c.asa,1)+' s</td></tr><tr><td>Abandonment</td><td>0% by model</td><td>'+pct(c.abandonPct)+'</td></tr></tbody></table></article><article class="wfp-panel"><b>What this teaches</b><p class="wfp-copy">The Excel-style inputs remain transparent, but the web project exposes the model boundary. Erlang-C assumes infinite patience; Erlang-A adds an exponential patience parameter and estimates abandonment.</p></article></div>'+
      note('Reference concept: Call Centre Helper’s staffing calculators expose calls, interval, AHT, service level, answer time, shrinkage and maximum occupancy; its staffing calculator also describes Erlang-A abandonment using average patience. We re-implemented those ideas independently for this learning product. <a href="https://www.callcentrehelper.com/online-call-centre-staffing-calculator-77780.htm" target="_blank" rel="noreferrer">Reference</a>');
  }

  function capacityProject(){
    const q=state.capacity, workload=q.volume*q.aht/3600, productive=q.paid*(1-q.shrinkage/100), fte=productive?workload/productive:Infinity;
    const rows=[0,10,20,25,30,35,40].map(x=>{const p=q.paid*(1-x/100);return '<tr><td>'+x+'%</td><td>'+fmt(p,1)+'</td><td>'+fmt(workload/Math.max(.01,p),1)+'</td></tr>';}).join('');
    return projectHead('Capacity Planning Workbook','Convert weekly demand and AHT into workload hours, productive capacity and FTE. Then stress-test shrinkage instead of hiding it in one number.','PROJECT 02 · CAPACITY')+
      '<div class="wfp-form">'+input('Weekly contacts','c.volume',q.volume,'1','1','1000000')+input('AHT seconds','c.aht',q.aht,'1','1','3600')+input('Shrinkage %','c.shrinkage',q.shrinkage,'0.5','0','80')+input('Paid hours / FTE / week','c.paid',q.paid,'0.5','1','80')+input('Target occupancy %','c.occ',q.occ,'0.5','1','99')+'</div>'+
      '<div class="wfp-kpis">'+kpi('Workload',fmt(workload,1)+' h','weekly handling time')+kpi('Productive capacity',fmt(productive,1)+' h','per FTE')+kpi('Required FTE',fmt(fte,1),'workload ÷ productive capacity')+kpi('Shrinkage',q.shrinkage+'%','capacity assumption')+'</div>'+
      '<article class="wfp-panel"><b>Shrinkage sensitivity</b><table class="wfm-table"><thead><tr><th>Shrinkage</th><th>Productive h/FTE</th><th>FTE required</th></tr></thead><tbody>'+rows+'</tbody></table></article>'+
      note('This is a capacity model, not an interval staffing model. For service-level staffing, combine it with the Erlang project and interval requirement logic.');
  }

  function forecastProject(){
    const d=parseSeries(state.forecast.data), series=d.length>=24?d:syntheticSeries();
    const r=holtWinters(series,state.forecast.season,state.forecast.alpha,state.forecast.beta,state.forecast.gamma,state.forecast.horizon);
    const actual=series.slice(-Math.min(12,series.length));
    const max=Math.max(...series,...r.forecast,1);
    const points=series.slice(-36).map((v,i)=>((i/Math.max(1,series.slice(-36).length-1))*760)+','+(180-145*v/max)).join(' ');
    const fp=r.forecast.map((v,i)=>((760+(i/(Math.max(1,r.forecast.length-1)))*240))+','+(180-145*v/max)).join(' ');
    return projectHead('Forecasting Studio','Convert the monthly forecasting spreadsheet idea into an interactive, data-driven browser project. Paste a series or use the built-in example, then inspect level, trend, seasonality and forecast error.','PROJECT 03 · FORECASTING')+
      '<div class="wfp-form">'+input('Season length','f.season',state.forecast.season,'1','1','24')+input('Alpha / level','f.alpha',state.forecast.alpha,'0.05','0.01','0.99')+input('Beta / trend','f.beta',state.forecast.beta,'0.05','0.01','0.99')+input('Gamma / seasonality','f.gamma',state.forecast.gamma,'0.05','0.01','0.99')+input('Forecast periods','f.horizon',state.forecast.horizon,'1','1','24')+'</div>'+
      '<label class="wfp-textarea"><span>Historical values (comma, space or newline separated)</span><textarea data-wfp-series="forecast">'+esc(state.forecast.data)+'</textarea></label>'+
      '<div class="wfp-actions"><button class="wfm-primary" data-wfp-action="example">Load 24-month example</button><button class="wfm-actions-btn" data-wfp-action="clear">Clear</button></div>'+
      '<div class="wfp-kpis">'+kpi('Observations',fmt(series.length,0),'input series')+kpi('MAE',fmt(r.mae,1),'in-sample diagnostic')+kpi('MAPE',pct(r.mape),'in-sample diagnostic')+kpi('Horizon',fmt(r.forecast.length,0),'future periods')+'</div>'+
      '<article class="wfp-panel"><b>Level · trend · seasonality forecast</b><div class="wfp-chart"><svg viewBox="0 0 1000 190" preserveAspectRatio="none"><polyline class="wfp-line" points="'+points+'"></polyline><polyline class="wfp-forecast" points="'+fp+'"></polyline></svg></div></article>'+
      note('Call Centre Helper’s spreadsheet uses Holt-Winters/triple exponential smoothing with level, trend and seasonality and expects 24 months of historical data for a 12-month forecast. This project teaches the same modelling workflow with an original browser implementation. <a href="https://www.callcentrehelper.com/forecasting-excel-template-73193.htm" target="_blank" rel="noreferrer">Reference</a>');
  }

  function syntheticSeries(){
    return Array.from({length:24},(_,i)=>Math.round(12000*(1+i*.012)*(1+[.92,.96,1.02,1.08,1.14,1.05,.9,.94,1.0,1.06,1.12,1.18][i%12])));
  }

  function adherenceProject(){
    const total=rootState.adherence.reduce((a,x)=>a+x.scheduled,0), adherent=rootState.adherence.reduce((a,x)=>a+x.adherent,0);
    return projectHead('Schedule Adherence Workbook','A web version of the scheduled-vs-actual adherence workflow. Edit individual agent minutes and see team and individual adherence immediately.','PROJECT 04 · ADHERENCE')+
      '<article class="wfp-panel"><div class="wfp-panel-head"><b>Agent adherence table</b><span>minutes</span></div><div class="wfm-table-wrap"><table class="wfm-table"><thead><tr><th>Agent</th><th>Scheduled min</th><th>Minutes in adherence</th><th>Adherence</th></tr></thead><tbody>'+rootState.adherence.map((x,i)=>'<tr><td>'+x.name+'</td><td><input class="wfp-mini-input" data-adherence="'+i+'.scheduled" type="number" value="'+x.scheduled+'"></td><td><input class="wfp-mini-input" data-adherence="'+i+'.adherent" type="number" value="'+x.adherent+'"></td><td>'+pct(x.scheduled?x.adherent/x.scheduled:0)+'</td></tr>').join('')+'</tbody></table></div></article>'+
      '<div class="wfp-kpis">'+kpi('Team adherence',pct(total?adherent/total:0),'minutes in adherence ÷ scheduled minutes')+kpi('Scheduled minutes',fmt(total,0),'team')+kpi('Adherent minutes',fmt(adherent,0),'team')+kpi('Gap',fmt(total-adherent,0),'minutes outside schedule')+'</div>'+
      note('The source template describes scheduled and actual sections, including login/logout and lunch data, then calculates team and individual adherence. Our browser version keeps the core formula visible and is ready to expand to interval-level activity timelines. <a href="https://www.callcentrehelper.com/excel-schedule-adherence-tool-164323.htm" target="_blank" rel="noreferrer">Reference</a>');
  }

  function dashboardProject(){
    const d=state.dashboard;
    const items=[
      ['Service level',d.sl,85,'%','higher'],
      ['Abandon rate',d.abandon,3,'%','lower'],
      ['AHT',d.aht,300,' sec','lower'],
      ['ASA',d.asa,30,' sec','lower'],
      ['Occupancy',d.occ,85,'%','lower'],
      ['Customer satisfaction',d.csat,90,'%','higher']
    ];
    const status=(value,target,direction)=>direction==='higher'?value>=target:value<=target;
    return projectHead('Contact Centre KPI Dashboard','A browser-native balanced scorecard inspired by the dashboard template: enter operational KPIs, compare them with targets and surface exceptions.','PROJECT 05 · EXECUTIVE DASHBOARD')+
      '<div class="wfp-form">'+input('Service level %','d.sl',d.sl,'0.1','0','100')+input('Abandon rate %','d.abandon',d.abandon,'0.1','0','100')+input('AHT sec','d.aht',d.aht,'1','1','3600')+input('ASA sec','d.asa',d.asa,'1','0','3600')+input('Occupancy %','d.occ',d.occ,'0.1','0','100')+input('Customer satisfaction %','d.csat',d.csat,'0.1','0','100')+'</div>'+
      '<div class="wfp-dashboard">'+items.map(([label,val,target,unit,dir])=>'<article class="wfp-score '+(status(val,target,dir)?'good':'risk')+'"><span>'+label+'</span><strong>'+fmt(val,1)+unit+'</strong><small>Target '+fmt(target,1)+unit+' · '+(status(val,target,dir)?'On target':'Review')+'</small><div><i style="width:'+clamp(val/(target||1)*100,0,100)+'%"></i></div></article>').join('')+'</div>'+
      note('The referenced dashboard template combines contact volumes, complaints, sales, customer experience, survey feedback, service level and abandonment into an editable KPI scorecard. Our version focuses the project on WFM-operational KPIs while keeping the scorecard extensible. <a href="https://www.callcentrehelper.com/dashboard-excel-template-171330.htm" target="_blank" rel="noreferrer">Reference</a>');
  }

  function multiChannelProject(){
    const d=state.multi, voiceLoad=d.voice*d.voiceAht/3600, chatLoad=d.chat*d.chatAht/(3600*Math.max(1,d.chatConcurrency)), emailLoad=d.email*d.emailAht/3600;
    const total=voiceLoad+chatLoad+emailLoad, need=Math.ceil(total/Math.max(.01,d.occupancy/100));
    const available=d.agents, coverage=available?clamp(available/Math.max(1,need),0,1):0;
    const intervals=Array.from({length:12},(_,i)=>{const shape=.72+.28*Math.sin((i/11)*Math.PI);return Math.round(total*shape);});
    return projectHead('Multi-Channel Contact Centre Simulator','Blend voice, webchat and email workload in one scenario. The original source tool uses simulated traffic and shows traffic/queue over time; this version keeps the learning model deterministic and exposes the workload trade-off.','PROJECT 06 · MULTICHANNEL')+
      '<div class="wfp-form">'+input('Voice contacts / hour','m.voice',d.voice,'1','0','100000')+input('Voice AHT sec','m.voiceAht',d.voiceAht,'1','1','3600')+input('Chat contacts / hour','m.chat',d.chat,'1','0','100000')+input('Chat AHT sec','m.chatAht',d.chatAht,'1','1','3600')+input('Chat concurrency','m.chatConcurrency',d.chatConcurrency,'0.1','1','10')+input('Email contacts / hour','m.email',d.email,'1','0','100000')+input('Email handling sec','m.emailAht',d.emailAht,'1','1','86400')+input('Blended occupancy %','m.occupancy',d.occupancy,'0.5','1','99')+input('Available agents','m.agents',d.agents,'1','1','500')+'</div>'+
      '<div class="wfp-kpis">'+kpi('Voice Erlangs',fmt(voiceLoad,1),'voice workload')+kpi('Chat load',fmt(chatLoad,1),'concurrency-adjusted')+kpi('Email load',fmt(emailLoad,1),'deferred workload')+kpi('Blended load',fmt(total,1),'combined workload')+kpi('Estimated agents',fmt(need,0),'at target occupancy')+kpi('Coverage',pct(coverage),'available ÷ estimated need')+'</div>'+
      '<article class="wfp-panel"><b>Traffic shape over time</b><div class="wfp-bars">'+intervals.map((v,i)=>'<div class="wfp-bar"><span>'+String(i+1).padStart(2,'0')+'</span><div><i style="width:'+clamp(v/Math.max(...intervals)*100,0,100)+'%"></i></div><b>'+v+'</b></div>').join('')+'</div></article>'+
      note('The source multi-channel simulator covers calls, email and webchat and visualizes traffic and queue build-up. It also notes limitations such as email non-interruption and chat concurrency. This project intentionally labels those assumptions rather than pretending the blended model is a production routing engine. <a href="https://www.callcentrehelper.com/multi-channel-contact-centre-calculator-96321.htm" target="_blank" rel="noreferrer">Reference</a>');
  }

  const state={
    erlang:{volume:400,period:30,aht:257,sl:80,threshold:20,occ:85,shrinkage:30,patience:90,agents:97},
    capacity:{volume:18000,aht:300,shrinkage:28,paid:40,occ:85},
    forecast:{season:12,alpha:.35,beta:.15,gamma:.25,horizon:12,data:syntheticSeries().join(',')},
    dashboard:{sl:87,abandon:2.8,aht:295,asa:27,occ:83,csat:91},
    multi:{voice:500,voiceAht:300,chat:180,chatAht:420,chatConcurrency:2,email:80,emailAht:900,occupancy:85,agents:42}
  };

  function ensureStyles(){
    if(document.getElementById('wfpStyles')) return;
    const s=document.createElement('style'); s.id='wfpStyles';
    s.textContent=`
      .wfp-shell{display:grid;gap:14px}
      .wfp-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}
      .wfp-head h2{font-size:28px;letter-spacing:-1px;margin:7px 0}
      .wfp-head p{max-width:900px;color:var(--muted);font-size:11px;line-height:1.65;margin:0}
      .wfp-tabs{display:flex;gap:7px;overflow:auto;padding:5px;border-radius:18px;background:rgba(255,255,255,.55);border:1px solid var(--line)}
      .wfp-tabs button{flex:0 0 auto;padding:10px 13px;border-radius:13px;background:transparent;color:#63708e;font-size:10px;font-weight:800}
      .wfp-tabs button.active{color:var(--blue);background:#edf3ff;box-shadow:0 5px 16px rgba(42,94,220,.1)}
      .wfp-content{display:grid;gap:12px}
      .wfp-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:16px;border-radius:20px;background:rgba(255,255,255,.68);border:1px solid rgba(255,255,255,.9);box-shadow:0 10px 28px rgba(44,70,140,.06)}
      .wfp-grid2{display:grid;grid-template-columns:1.3fr 1fr;gap:12px}
      .wfp-panel{padding:18px;border-radius:20px;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);box-shadow:0 10px 28px rgba(44,70,140,.06);overflow:hidden}
      .wfp-panel>b{font-size:12px}
      .wfp-copy{font-size:10px;color:var(--muted);line-height:1.65}
      .wfp-kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
      .wfp-kpi{padding:15px;border-radius:18px;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);box-shadow:0 10px 28px rgba(44,70,140,.06)}
      .wfp-kpi span{display:block;color:var(--muted);font-size:9px}.wfp-kpi strong{display:block;font-size:22px;letter-spacing:-1px;margin:8px 0 3px}.wfp-kpi small{font-size:8px;color:var(--muted)}
      .wfp-textarea{display:grid;gap:6px;padding:16px;border-radius:20px;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9)}
      .wfp-textarea span{font-size:9px;color:var(--muted);font-weight:700}.wfp-textarea textarea{min-height:120px;width:100%;resize:vertical;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.8);padding:11px;outline:0;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--text)}
      .wfp-actions{display:flex;gap:8px;flex-wrap:wrap}.wfp-actions-btn{padding:10px 13px;border:1px solid var(--line);border-radius:13px;background:white;color:#435174;font-size:9px;font-weight:800}
      .wfp-chart{height:230px;margin-top:12px}.wfp-chart svg{width:100%;height:100%}.wfp-line{fill:none;stroke:#2868ff;stroke-width:3;stroke-linecap:round}.wfp-forecast{fill:none;stroke:#7658ff;stroke-width:3;stroke-dasharray:7 6;stroke-linecap:round}
      .wfp-mini-input{width:110px;height:31px;border:1px solid var(--line);border-radius:9px;padding:0 8px;background:white;font-size:10px;color:var(--text)}
      .wfp-dashboard{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.wfp-score{padding:16px;border-radius:18px;background:#f5f8ff;border:1px solid var(--line)}.wfp-score.good{background:#eefbf6}.wfp-score.risk{background:#fff1f1}
      .wfp-score span,.wfp-score small{display:block;color:var(--muted);font-size:9px}.wfp-score strong{display:block;font-size:25px;margin:8px 0}.wfp-score>div{height:7px;background:#e5eaf5;border-radius:99px;overflow:hidden;margin-top:12px}.wfp-score i{display:block;height:100%;background:linear-gradient(90deg,#2868ff,#7658ff);border-radius:inherit}
      .wfp-bars{display:grid;gap:8px;margin-top:14px}.wfp-bar{display:grid;grid-template-columns:30px 1fr 45px;align-items:center;gap:8px;font-size:8px;color:var(--muted)}.wfp-bar>div{height:12px;border-radius:99px;background:#e9eef8;overflow:hidden}.wfp-bar i{display:block;height:100%;background:linear-gradient(90deg,#9ebaff,#7658ff);border-radius:inherit}.wfp-bar b{text-align:right;color:var(--text);font-size:8px}
      .wfp-footer{display:flex;justify-content:space-between;gap:12px;padding:12px 2px;color:var(--muted);font-size:8px}
      @media(max-width:1000px){.wfp-kpis{grid-template-columns:repeat(3,1fr)}.wfp-form{grid-template-columns:repeat(2,1fr)}.wfp-grid2{grid-template-columns:1fr}.wfp-dashboard{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:600px){.wfp-head h2{font-size:23px}.wfp-form{grid-template-columns:1fr}.wfp-kpis{grid-template-columns:repeat(2,1fr)}.wfp-dashboard{grid-template-columns:1fr}.wfp-footer{display:grid}.wfp-mini-input{width:90px}}
    `;
    document.head.appendChild(s);
  }
\n  function render(root){
    ensureStyles();
    const tabs=[
      ['erlang','Erlang Staffing'],['capacity','Capacity Planner'],['forecast','Forecasting Studio'],
      ['adherence','Schedule Adherence'],['dashboard','KPI Dashboard'],['multi','Multichannel Simulator']
    ];
    const views={erlang:erlangProject,capacity:capacityProject,forecast:forecastProject,adherence:adherenceProject,dashboard:dashboardProject,multi:multiChannelProject};
    root.innerHTML='<div class="wfp-shell">'+projectHead('WFM Project Studio','Interactive web conversions of the core forecasting, staffing, capacity, adherence, dashboard and multichannel tools in the Call Centre Helper ecosystem. Excel is the reference workflow; Workforce Intelligence is the implementation.','WFM PROJECT SUITE')+
      '<div class="wfp-tabs">'+tabs.map(([id,label])=>'<button class="'+(rootState.tab===id?'active':'')+'" data-wfp-tab="'+id+'">'+label+'</button>').join('')+'</div>'+
      '<div class="wfp-content">'+views[rootState.tab]()+'</div>'+
      '<div class="wfp-footer"><span>Original implementation · synthetic/local data · no external runtime dependency</span><span>Use for learning and portfolio projects, not production staffing decisions.</span></div></div>';
    root.querySelectorAll('[data-wfp-tab]').forEach(b=>b.addEventListener('click',()=>{rootState.tab=b.dataset.wfpTab;render(root);}));
    root.querySelectorAll('[data-wfp-input]').forEach(el=>el.addEventListener('change',()=>{setValue(el.dataset.wfpInput,el.value);render(root);}));
    root.querySelectorAll('[data-wfp-series]').forEach(el=>el.addEventListener('change',()=>{state.forecast.data=el.value;render(root);}));
    root.querySelectorAll('[data-wfp-action="example"]').forEach(b=>b.addEventListener('click',()=>{state.forecast.data=syntheticSeries().join(',');render(root);}));
    root.querySelectorAll('[data-wfp-action="clear"]').forEach(b=>b.addEventListener('click',()=>{state.forecast.data='';render(root);}));
    root.querySelectorAll('[data-adherence]').forEach(el=>el.addEventListener('change',()=>{const [i,k]=el.dataset.adherence.split('.');rootState.adherence[Number(i)][k]=Math.max(0,n(el.value));render(root);}));
  }
  function setValue(key,value){
    const [group,name]=key.split('.');
    if(!state[group])return;
    state[group][name]=n(value);
  }
  window.WFM_PROJECTS={mount:render,state,engine:{erlangA,requiredC,holtWinters,parseSeries}};
})();
