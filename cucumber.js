module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/step-definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: 'allure-results'
    },
    retry: 0,
    timeout: 60_000
  }
};