const fs=require('fs');
const vm=require('vm');

const source=fs.readFileSync('data/wfm-lab.js','utf8');
const context={window:{}};
vm.createContext(context);
vm.runInContext(source,context,{filename:'data/wfm-lab.js'});
const lab=context.window.WFM_LAB;
if(!lab?.engine) throw new Error('WFM_LAB engine missing');

const q={volume:600,period:60,aht:300,sl:80,threshold:20,occupancy:85,agents:30};
const qm=lab.engine.queue(q);
const req=lab.engine.requiredAgents(q);
if(!(qm.erlangs>0 && qm.sl>=0 && qm.sl<=1 && req>=1 && req<10000)) throw new Error('Queueing engine failed');

const f=lab.engine.forecastModel(undefined,12);
if(f.history.length!==24 || f.future.length!==12 || !Number.isFinite(f.mae)) throw new Error('Forecast engine failed');

const c=lab.engine.capacity({weeklyVolume:18000,aht:300,shrinkage:28,paidHours:40});
if(!(c.workload>0 && c.productive>0 && c.fte>0)) throw new Error('Capacity engine failed');

const s=lab.engine.schedulePlan();
if(s.rows.length!==48 || s.coverage.length!==48 || s.assigned.length!==lab.state.inputs.currentAgents) throw new Error('Schedule engine failed');

const i=lab.engine.intervalPlan();
if(i.length!==48 || i.some(row=>!Number.isFinite(row.required)||!Number.isFinite(row.gap))) throw new Error('Intraday interval engine failed');

const a=lab.engine.adherenceSummary();
if(!a.length || a.some(row=>!Number.isFinite(row.adherence))) throw new Error('Adherence engine failed');

console.log('WFM Lab engine validated: queueing, forecasting, capacity, scheduling, interval planning and adherence modules.');
