const fs=require('fs');
const vm=require('vm');

const source=fs.readFileSync('data/wfm-lab.js','utf8');
const context={window:{}};
vm.createContext(context);
vm.runInContext(source,context,{filename:'data/wfm-lab.js'});
const lab=context.window.WFM_LAB;
if(!lab?.engine) throw new Error('WFM_LAB engine missing');

const q={volume:600,aht:300,sl:0.8,threshold:20,agents:30,maxOcc:0.85};
const qm=lab.engine.queueMetrics(q);
const req=lab.engine.requiredAgents(q);
if(!(qm.a>0 && qm.sl>=0 && qm.sl<=1 && req>=1)) throw new Error('Queueing engine failed');

const f=lab.engine.forecastSeries({base:520,trend:4,seasonality:12,aht:300});
if(f.actual.length!==21 || f.forecast.length!==7 || !Number.isFinite(f.mae)) throw new Error('Forecast engine failed');

const c=lab.engine.capacityMetrics({weeklyVolume:18000,aht:300,shrinkage:.28,paidHours:40});
if(!(c.workload>0 && c.productive>0 && c.fte>0)) throw new Error('Capacity engine failed');

const s=lab.engine.schedulePlan({agents:42,target:30,shiftLength:8,lunch:1,breaks:.5});
if(s.required.length!==24 || s.coverage.length!==24) throw new Error('Schedule engine failed');

const i=lab.engine.intradayMetrics({forecast:100,actual:128,ahtPlan:300,ahtActual:345,scheduled:28,available:25});
if(!Number.isFinite(i.volumeVar) || !Number.isFinite(i.ahtVar)) throw new Error('Intraday engine failed');

console.log('WFM Lab engine validated: queueing, forecasting, capacity, scheduling and intraday modules.');
