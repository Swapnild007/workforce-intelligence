const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const externalScripts = ['data/curriculum.js','data/curriculum-content-02.js','data/wfm-lab.js','data/wfm-projects.js'];
for (const file of externalScripts) {
  const source = fs.readFileSync(file, 'utf8');
  new vm.Script(source, { filename: file });
}
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
if (scripts.length === 0) throw new Error('No inline script found in index.html');

for (const [i, source] of scripts.entries()) {
  new vm.Script(source, { filename: `index.html:inline-script-${i + 1}.js` });
}

const requiredMarkers = [
  'Workforce Intelligence Academy',
  'Learn',
  'WFM Lab',
  'Decision Lab',
  'Curriculum',
  'Projects',
  'WFM Toolbox',
  'mobile-nav'
];

for (const marker of requiredMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing required UI marker: ${marker}`);
}

const wfmSource = fs.readFileSync('data/wfm-lab.js', 'utf8');
const wfmContext = { window: {} };
vm.createContext(wfmContext);
vm.runInContext(wfmSource, wfmContext, { filename: 'data/wfm-lab.js' });
if (!wfmContext.window.WFM_LAB?.engine) throw new Error('WFM Lab engine missing');
const wfm = wfmContext.window.WFM_LAB.engine;
const q = { volume: 600, aht: 300, sl: 0.80, threshold: 20, agents: 30, maxOcc: 0.85 };
if (!(wfm.queueMetrics(q).sl >= 0 && wfm.requiredAgents(q) >= 1)) throw new Error('WFM queueing engine failed');
const f = wfm.forecastSeries({ base: 520, trend: 4, seasonality: 12, aht: 300 });
if (f.actual.length !== 21 || f.forecast.length !== 12) throw new Error('WFM forecast engine failed');
if (!(wfm.capacityMetrics({weeklyVolume:18000,aht:300,shrinkage:.28,paidHours:40}).fte > 0)) throw new Error('WFM capacity engine failed');
if (wfm.schedulePlan({agents:42,target:30,shiftLength:8,lunch:1,breaks:.5}).coverage.length !== 48) throw new Error('WFM scheduling engine failed');
if (!Number.isFinite(wfm.intradayMetrics({forecast:100,actual:128,ahtPlan:300,ahtActual:345,scheduled:28,available:25}).volumeVar)) throw new Error('WFM intraday engine failed');

const curriculumSource = fs.readFileSync('data/curriculum.js', 'utf8');
const contentSource = fs.readFileSync('data/curriculum-content-02.js', 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(curriculumSource, context, { filename: 'data/curriculum.js' });
vm.runInContext(contentSource, context, { filename: 'data/curriculum-content-02.js' });
const domains = context.window.WI_CURRICULUM?.domains || [];
if (domains.length !== 13) throw new Error(`Expected 13 curriculum domains, found ${domains.length}`);
const domain02 = domains.find(d => d.id === '02');
const content02 = context.window.WI_CURRICULUM_CONTENT?.['02'];
if (!domain02 || !content02) throw new Error('Domain 02 WFM content is missing');
const lessonCount = domain02.modules.reduce((n, m) => n + m.lessons.length, 0);
const contentLessonCount = content02.modules.reduce((n, m) => n + m.lessons.length, 0);
if (lessonCount !== 64 || contentLessonCount !== 64) {
  throw new Error(`Domain 02 lesson mismatch: curriculum=${lessonCount}, content=${contentLessonCount}`);
}
for (const module of content02.modules) {
  for (const lesson of module.lessons) {
    if (!lesson.understanding || !lesson.notes?.length || !lesson.highlights?.length || !lesson.qa?.length) {
      throw new Error(`Incomplete learning content: ${lesson.id}`);
    }
  }
}
const projectsSource = fs.readFileSync('data/wfm-projects.js', 'utf8');
const projectsContext = { window: {}, document: { getElementById: () => null, createElement: () => ({}) } };
vm.createContext(projectsContext);
vm.runInContext(projectsSource, projectsContext, { filename: 'data/wfm-projects.js' });
if (!projectsContext.window.WFM_PROJECTS?.engine) throw new Error('WFM Projects engine missing');
const projects = projectsContext.window.WFM_PROJECTS.engine;
const ea = projects.erlangA({volume:400,period:30,aht:257,agents:97,patience:90,threshold:20});
if (!(Number.isFinite(ea.sl) && ea.sl >= 0 && ea.sl <= 1 && Number.isFinite(ea.abandonPct))) throw new Error('Erlang-A project engine failed');
if (!(projects.requiredC({volume:400,period:30,aht:257,sl:80,occ:85,patience:90,threshold:20}) >= 1)) throw new Error('Project staffing engine failed');
const hw = projects.holtWinters(Array.from({length:24}, (_,i)=>1000+i*20+(i%12)*40),12,.35,.15,.25,12);
if (hw.forecast.length !== 12 || !Number.isFinite(hw.mae)) throw new Error('Forecast project engine failed');

console.log(`Validated index.html, external curriculum scripts, 13 domains, and 64 complete Domain 02 lessons.`);
