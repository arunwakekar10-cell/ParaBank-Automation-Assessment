const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const allureResultsDir = path.resolve('allure-results');
const latestReportDir = path.resolve('allure-report');
const timestampReportsRoot = path.resolve('allure-reports');

function pad(value) {
  return String(value).padStart(2, '0');
}

function getTimestamp() {
  const now = new Date();

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('-') + '_' + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('-');
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: true
  });
}

if (!fs.existsSync(allureResultsDir)) {
  console.error('allure-results folder does not exist. Run tests first.');
  process.exit(1);
}

fs.mkdirSync(timestampReportsRoot, { recursive: true });

// Copy previous history into current allure-results.
// This is required for Allure historical trend graphs.
const previousHistoryDir = path.join(latestReportDir, 'history');
const currentResultsHistoryDir = path.join(allureResultsDir, 'history');

if (fs.existsSync(previousHistoryDir)) {
  console.log('Copying previous Allure history...');
  fs.rmSync(currentResultsHistoryDir, { recursive: true, force: true });
  copyDirectory(previousHistoryDir, currentResultsHistoryDir);
} else {
  console.log('No previous Allure history found. Trend graph will start from this run.');
}

const timestamp = getTimestamp();
const timestampReportDir = path.join(timestampReportsRoot, timestamp);

console.log(`Generating timestamped Allure report: ${timestampReportDir}`);

const generateResult = run('npx', [
  'allure',
  'generate',
  allureResultsDir,
  '-o',
  timestampReportDir,
  '--clean'
]);

if (generateResult.status !== 0) {
  console.error('Failed to generate Allure report.');
  process.exit(generateResult.status || 1);
}

// Keep a stable latest report folder for npm run allure:open
fs.rmSync(latestReportDir, { recursive: true, force: true });
copyDirectory(timestampReportDir, latestReportDir);

fs.writeFileSync(
  path.join(timestampReportsRoot, 'latest.txt'),
  timestampReportDir
);

console.log('\nAllure report generated successfully.');
console.log(`Timestamped report: ${timestampReportDir}`);
console.log(`Latest report: ${latestReportDir}`);
console.log('\nOpen using: npm run allure:open\n');