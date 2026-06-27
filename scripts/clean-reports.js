const fs = require('node:fs');
const path = require('node:path');

const pathsToRemove = [
  'reports/cucumber-report.html',
  'reports/cucumber-report.json',
  'reports/screenshots',
  'allure-results',
  'allure-report'
];

for (const item of pathsToRemove) {
  fs.rmSync(path.resolve(item), { recursive: true, force: true });
}

fs.mkdirSync(path.resolve('reports', 'screenshots'), { recursive: true });
fs.writeFileSync(path.resolve('reports', 'screenshots', '.gitkeep'), '');
