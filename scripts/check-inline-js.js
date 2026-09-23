const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
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

console.log(`Validated index.html: ${scripts.length} inline script(s), required UI markers present.`);
