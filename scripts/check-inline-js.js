const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const externalScripts = ['data/curriculum.js','data/curriculum-content-02.js','data/wfm-lab.js'];
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

// Static interaction audit for every button authored in index.html.
// Generated WFM Lab controls are validated separately by the WFM mount/engine checks below.
const buttonHtml = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/gi)].map(m => m[0]);
const handledButton = /data-(?:enter|view|view-go|lesson|decision|resource|more-view|search|content-lesson)(?:=|\\s|>)|id="(?:notifyBtn|decisionBtn|moreBtn|modalClose|modalAction)"/;
const deadButtons = buttonHtml.filter(button => !handledButton.test(button));
if (deadButtons.length) throw new Error('Unwired button(s) in index.html: ' + deadButtons.join(' | '));

const viewIds = [...html.matchAll(/<section[^>]+id="([^"]+)"[^>]*class="[^"]*\bview\b/gi)].map(m => m[1]);
for (const m of html.matchAll(/data-view="([^"]+)"/g)) {
  if (!viewIds.includes(m[1])) throw new Error('Invalid data-view target: ' + m[1]);
}
for (const m of html.matchAll(/data-view-go="([^"]+)"/g)) {
  if (!viewIds.includes(m[1])) throw new Error('Invalid data-view-go target: ' + m[1]);
}
if ((html.match(/data-demo/g) || []).length) throw new Error('Legacy data-demo control remains; use an explicit route/action.');
if (!html.includes("document.querySelectorAll('[data-resource]'")) throw new Error('Resource controls are missing their handler.');
if (!html.includes("getElementById('modalAction').addEventListener")) throw new Error('Modal challenge action is not wired.');
if (!html.includes("closest('[data-content-lesson]')")) throw new Error('Dynamic curriculum lesson controls are missing their delegated handler.');

const wfmSource = fs.readFileSync('data/wfm-lab.js', 'utf8');
const wfmContext = { window: {} };
vm.createContext(wfmContext);
vm.runInContext(wfmSource, wfmContext, { filename: 'data/wfm-lab.js' });
if (!wfmContext.window.WFM_LAB?.engine) throw new Error('WFM Lab engine missing');
const wfm = wfmContext.window.WFM_LAB.engine;
const s = wfm.staffing({volume:600,period:60,aht:300,sl:80,threshold:20,shrinkage:28,occupancy:85,currentAgents:30});
if (!(s.required > 0 && Number.isFinite(s.erlangs) && Number.isFinite(s.fte) && Number.isFinite(s.serviceLevel) && Number.isFinite(s.occupancy))) throw new Error('WFM staffing engine failed');
const c = wfm.capacity({weeklyVolume:18000,aht:300,shrinkage:28,paidHours:40});
if (!(c.fte > 0 && Number.isFinite(c.fte))) throw new Error('WFM capacity engine failed');
const f = wfm.forecastModel();
if (f.future.length !== 12 || f.history.length !== 24 || !Number.isFinite(f.mape)) throw new Error('WFM forecast engine failed');
if (wfm.intervalPlan().length !== 48) throw new Error('WFM interval engine failed');
if (!(wfm.schedulePlan().assigned.length >= 1)) throw new Error('WFM schedule engine failed');
if (!(wfm.adherenceSummary().length >= 1)) throw new Error('WFM adherence engine failed');

const screenRoot = {
  innerHTML: '',
  querySelector: () => null,
  querySelectorAll: () => []
};
wfmContext.window.WFM_LAB.mount(screenRoot);
if (!screenRoot.innerHTML.includes('Command Center')) throw new Error('WFM Screen 01 title missing');
if (!screenRoot.innerHTML.includes('Required agents')) throw new Error('WFM Screen 01 KPI missing');
if (!screenRoot.innerHTML.includes('Intraday snapshot')) throw new Error('WFM Screen 01 intraday panel missing');
if (screenRoot.innerHTML.includes('null first projected')) throw new Error('WFM Screen 01 contains invalid forecast output');
wfmContext.window.WFM_LAB.state.view='setup';
wfmContext.window.WFM_LAB.mount(screenRoot);
const setupHtml = screenRoot.innerHTML;
for (const marker of ['Operations Setup','Planning controls','Active LOB','LOB catalogue','Skill coverage','Downstream model chain']) {
  if (!setupHtml.includes(marker)) throw new Error(`WFM Screen 02 marker missing: ${marker}`);
}
for (const marker of ['data-wfm-lob-select','data-wfm-input="planningGrain"','data-wfm-input="lobAht"','data-wfm-input="lobSl"']) {
  if (!setupHtml.includes(marker)) throw new Error(`WFM Screen 02 control missing: ${marker}`);
}
if (wfmContext.window.WFM_LAB.state.operation?.planningGrain !== undefined && wfmContext.window.WFM_LAB.state.interval !== 30) {
  throw new Error('WFM Screen 02 default planning grain changed unexpectedly');
}

const allWfmViews = ['command','setup','data','forecast','staffing','capacity','schedule','adherence','intraday','multichannel','scenario','reporting','validation','decision'];
for (const view of allWfmViews) {
  wfmContext.window.WFM_LAB.state.view = view;
  wfmContext.window.WFM_LAB.mount(screenRoot);
  if (!screenRoot.innerHTML.trim() || /\\bundefined\\b|\\bnull first projected\\b/.test(screenRoot.innerHTML)) {
    throw new Error('WFM view failed to render cleanly: ' + view);
  }
}


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
console.log(`Validated index.html, external curriculum scripts, 13 domains, and 64 complete Domain 02 lessons.`);
