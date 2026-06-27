const { spawnSync } = require('node:child_process');

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: true
  });
}

console.log('\nCleaning previous Cucumber and Allure result files...\n');
run('node', ['scripts/clean-reports.js']);

console.log('\nRunning Cucumber tests...\n');
const testResult = run('npx', ['cucumber-js', '--config', 'cucumber.js']);

console.log('\nGenerating Allure report...\n');
const reportResult = run('node', ['scripts/generate-allure-report.js']);

if (reportResult.status !== 0) {
  process.exit(reportResult.status || 1);
}

process.exit(testResult.status || 0);