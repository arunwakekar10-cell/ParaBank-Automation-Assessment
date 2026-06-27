# ParaBank Automation Assessment

This repository automates ParaBank using **Playwright + Cucumber BDD + TypeScript + Page Object Model (POM)**.

The project covers the required positive end-to-end assignment flow and additional negative validation scenarios.

## Automated coverage

### Positive / smoke

1. Open ParaBank.
2. Navigate to Register.
3. Create a unique new customer account.
4. Validate successful account creation.
5. Sign out.
6. Sign in with the newly created credentials.
7. Read and print the amount displayed on the Accounts Overview page.
8. Save a proof-of-execution screenshot.

### Negative / validation

1. Blank registration form shows required-field validation messages.
2. Password and confirm-password mismatch shows validation message.
3. Duplicate username registration is rejected.
4. Invalid login credentials are rejected.

## Tech stack

- TypeScript
- Playwright
- Cucumber BDD
- Page Object Model
- Allure Report
- Cucumber HTML/JSON reports

## Project structure

```text
.
├── features/
│   ├── login-validation.feature
│   ├── registration-validation.feature
│   └── signup-login.feature
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── pages/
│   │   ├── AccountOverviewPage.ts
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   └── RegisterPage.ts
│   ├── step-definitions/
│   │   └── signup-login.steps.ts
│   ├── support/
│   │   ├── hooks.ts
│   │   └── world.ts
│   └── utils/
│       └── test-data.ts
├── test-cases/
│   └── ParaBank_SignUp_Login_TestCases.xlsx
├── reports/
│   └── screenshots/
├── allure-results/
├── allure-report/
├── proof-of-execution/
├── cucumber.js
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## About `playwright.config.ts`

This repository includes `playwright.config.ts` for standard Playwright tooling and browser configuration visibility.

The tests are executed through **Cucumber** because the assessment asks for BDD. Therefore, `cucumber.js` is the main runner configuration, and Playwright browser/context creation happens in `src/support/hooks.ts`.

## Prerequisites

- Node.js 20+ recommended
- npm

## Setup

```bash
npm install
npm run install:browsers
```

Optional environment configuration:

```bash
cp .env.example .env
```

## Run tests

Headless execution:

```bash
npm test
```

Clean reports and run:

```bash
npm run test:clean
```

Headed execution:

```bash
npm run test:headed
```

Do **not** run `npx test --headed`; that installs an unrelated npm package named `test`. This project uses Cucumber, so use the npm scripts above.

Debug mode:

```bash
npm run test:debug
```

## Allure reporting

Run tests and generate the Allure report:

```bash
npm run test:allure
```

Open the generated report:

```bash
npm run allure:open
```

Allure artifacts:

- Raw Allure results: `allure-results/`
- Generated Allure HTML report: `allure-report/`

## Expected console output

The positive E2E test prints the account amount after login, for example:

```text
Displayed amount after login for u7648e71b:
Account 13899 | Balance: $515.50 | Available Amount: $515.50
```

## Reports and proof of execution

After execution, check:

- Allure report: `allure-report/index.html`
- Allure raw results: `allure-results/`
- Cucumber HTML report: `reports/cucumber-report.html`
- Cucumber JSON report: `reports/cucumber-report.json`
- Success screenshot: `reports/screenshots/account-overview-<username>.png`
- Stable proof screenshot copy: `proof-of-execution/account-overview-proof.png`
- Execution console output: `proof-of-execution/execution-output.txt`
- Failure screenshot, if any: `reports/screenshots/failed-<scenario-name>.png`

## Test cases

The Excel test-case document is available here:

```text
test-cases/ParaBank_SignUp_Login_TestCases.xlsx
```

## Latest local execution summary

```text
Features: 3
Scenarios: 5 passed
Steps: 28 passed
```

## Commit recommendation before pushing to GitHub

The assignment asks for multiple commits. Suggested commit sequence:

```bash
git init

git add README.md package.json package-lock.json tsconfig.json cucumber.js playwright.config.ts .gitignore .env.example scripts
git commit -m "Initial Playwright Cucumber TypeScript setup"

git add features
git commit -m "Add positive and negative BDD scenarios"

git add src/support src/config src/utils
git commit -m "Add Cucumber Playwright support and test data"

git add src/pages src/step-definitions
git commit -m "Implement ParaBank POM pages and step definitions"

git add test-cases/ParaBank_SignUp_Login_TestCases.xlsx
git commit -m "Add ParaBank signup login validation test cases"

git add allure-results allure-report reports proof-of-execution
git commit -m "Add Allure report and proof of execution artifacts"
```

Then create an empty repository on GitHub and push:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
