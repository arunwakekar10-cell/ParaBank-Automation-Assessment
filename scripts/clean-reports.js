const fs = require('node:fs');
const path = require('node:path');

const pathsToRemove = [
  'reports/cucumber-report.html',
  'reports/cucumber-report.json',
  'reports/screenshots',
  'allure-results'
];

// Important:
// Do NOT delete allure-report or allure-reports here.
// We need previous allure-report/history for Allure trend graphs.

for (const item of pathsToRemove) {
  fs.rmSync(path.resolve(item), { recursive: true, force: true });
}

fs.mkdirSync(path.resolve('reports', 'screenshots'), { recursive: true });
fs.writeFileSync(path.resolve('reports', 'screenshots', '.gitkeep'), '');

fs.mkdirSync(path.resolve('allure-results'), { recursive: true });