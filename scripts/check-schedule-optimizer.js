const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('schedule-optimizer.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(source => source.trim());

if (scripts.length !== 1) throw new Error('Expected one inline Schedule Intelligence application script.');
scripts.forEach((source, index) => new vm.Script(source, { filename: 'schedule-optimizer.html:inline-' + (index + 1) }));

const required = [
  'Agent schedule',
  'Agent schedule Data',
  'Intraday Dump',
  'HC',
  'Interval coverage',
  'Roster explorer',
  'Activities & breaks',
  'People & teams',
  'Data quality',
  'Action queue',
  'Export findings CSV',
  'downloadCsv',
  'buildQA',
  'buildActions',
  'renderCoverage',
  'renderRoster',
  'renderActivities',
  'renderPeople',
  'renderQuality'
];
for (const marker of required) {
  if (!html.includes(marker)) throw new Error('Missing Schedule Intelligence feature marker: ' + marker);
}

const requiredIds = [
  'fileInput', 'lobFilter', 'dateFilter', 'teamFilter', 'agentSearch',
  'coverageTable', 'rosterTable', 'activityTable', 'peopleTable',
  'qualityFindings', 'actionQueue', 'heatmap'
];
for (const id of requiredIds) {
  if (!html.includes('id="' + id + '"')) throw new Error('Missing UI element: ' + id);
}

if (/fetch\s*\(|XMLHttpRequest|sendBeacon\s*\(/.test(scripts.join('\n'))) {
  throw new Error('Workbook analysis should not send data to a remote endpoint.');
}
if (!html.includes('cdn.jsdelivr.net/npm/xlsx')) {
  throw new Error('Expected documented SheetJS browser parser dependency.');
}
console.log('Schedule Intelligence checks passed: inline JS syntax, import sheets, core screens, exports and local-only analysis.');
