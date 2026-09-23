const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const externalScripts = ['data/curriculum.js','data/curriculum-content-02.js','data/curriculum-content.js','data/wfm-lab.js'];
for (const file of externalScripts) {
  const source = fs.readFileSync(file, 'utf8');
  new vm.Script(source, { filename: file });
}
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
if (scripts.length === 0) throw new Error('No inline script found in index.html');

for (const [i, source] of scripts.entries()) {
  new vm.Script(source, { filename: `index.html:inline-script-${i + 1}.js` });
}


const typographyAudit = [
  'Final typography, colour & rendering audit',
  'body{font-size:16px;line-height:1.55}',
  '.lesson-section p,.lesson-section li{',
  '.modal{',
  '.nf-copy p,.hero p,.learn-hero p{font-size:16px',
  '.nf-card-copy p,.nf-poster p,.nf-lab-copy p{font-size:12px',
  '4 learning tracks',
  '624 lessons'
];
for (const marker of typographyAudit) {
  if (!html.includes(marker)) throw new Error('Missing typography/rendering audit marker: ' + marker);
}
if (html.includes('13 learning areas') || html.includes('632 lessons') || html.includes('79 modules')) {
  throw new Error('Stale curriculum statistics remain in index.html; expected 4 tracks, 78 modules, 624 lessons.');
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
for (const marker of ['--font-ui','font-synthesis:none','prefers-reduced-motion','data-home-brand','app.classList.remove(\'active\')']) {
  if (!html.includes(marker)) throw new Error('Missing final UI quality marker: ' + marker);
}
if (!html.includes('<h3>Intraday Management</h3>') || !html.includes('<h3>Intraday Management</h3><p>Work through real-time changes and decisions.</p><button data-view-go="labs">Open Lab')) throw new Error('Landing Intraday Lab button does not route to Labs');
if (!html.includes('<article class="nf-poster" data-view-go="learn" role="button" tabindex="0"><div class="nf-poster-art"><b>NEW</b></div><h3>Workforce Planning</h3>')) throw new Error('Landing Workforce Planning card is not interactive');

// Static interaction audit for every button authored in index.html.
// Generated WFM Lab controls are validated separately by the WFM mount/engine checks below.
const buttonHtml = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/gi)].map(m => m[0]);
const handledButton = /data-(?:enter|view|view-go|lesson|decision|resource|more-view|search|content-lesson|domain-lesson|journey-domain|learn-open|search-path|row-dir)(?:=|\s|>)|id="(?:notifyBtn|decisionBtn|moreBtn|modalClose|modalAction|learnResume|learnExplore|lessonComplete|lessonChallenge)"/;
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
const contentSource = fs.readFileSync('data/curriculum-content.js', 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(curriculumSource, context, { filename: 'data/curriculum.js' });
vm.runInContext(contentSource, context, { filename: 'data/curriculum-content.js' });
const domains = context.window.WI_CURRICULUM?.domains || [];
if (domains.length !== 4) throw new Error(`Expected 4 curriculum domains, found ${domains.length}`);
const domain02 = domains.find(d => d.id === '02');
const content02 = context.window.WI_CURRICULUM_CONTENT?.['02'];
if (!domain02 || !content02) throw new Error('Domain 02 WFM content is missing');
const lessonCount = domain02.modules.reduce((n, m) => n + m.lessons.length, 0);
const contentLessonCount = content02.modules.reduce((n, m) => n + m.lessons.length, 0);
const totalLessons = domains.reduce((n,d) => n + d.modules.reduce((a,m) => a + m.lessons.length, 0), 0);
const contentDomains = context.window.WI_CURRICULUM_CONTENT || {};
const totalContentLessons = Object.values(contentDomains).reduce((n,d) => n + d.modules.reduce((a,m) => a + m.lessons.length, 0), 0);
if (totalLessons !== 624 || totalContentLessons !== 624) {
  throw new Error(`Curriculum total mismatch: curriculum=${totalLessons}, content=${totalContentLessons}`);
}
for (const domain of domains) {
  const contentDomain = contentDomains[domain.id];
  if (!contentDomain) throw new Error(`Missing content domain: ${domain.id}`);
  for (const module of domain.modules) {
    const contentModule = contentDomain.modules.find(m => m.id === module.id);
    if (!contentModule || contentModule.lessons.length !== module.lessons.length) {
      throw new Error(`Lesson mismatch: ${domain.id} ${module.id}`);
    }
    for (const lesson of contentModule.lessons) {
      if (!lesson.understanding || !lesson.notes?.length || !lesson.highlights?.length || !lesson.qa?.length || !lesson.practice || !lesson.workedExample || !lesson.assessment || !lesson.sources?.length || !lesson.depth?.zero || !lesson.depth?.mentalModel || lesson.depth?.buildSteps?.length < 5 || lesson.depth?.levelPlan?.length !== 6 || !lesson.depth?.mastery) {
        throw new Error(`Incomplete learning content: ${lesson.id}`);
      }
    }
  }
}
console.log(`Validated index.html, external curriculum scripts, 4 domains, 624 curriculum lessons, lesson structure, typography markers, and rendering safeguards.`);
