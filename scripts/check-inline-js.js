const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const externalScripts = ['data/curriculum.js','data/curriculum-content-02.js'];
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
  'Curriculum',
  'Learning Path',
  'Practice Labs',
  'AI Mentor',
  'Projects',
  'Progress',
  'mobile-nav'
];

for (const marker of requiredMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing required UI marker: ${marker}`);
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
