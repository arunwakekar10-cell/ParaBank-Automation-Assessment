import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * Playwright configuration kept in the repository for standard tooling support.
 *
 * Note: This project executes tests through Cucumber (`cucumber-js`) because the
 * assignment asks for BDD. The Cucumber hooks import the same env/config values
 * and create the Playwright browser/context manually.
 */
export default defineConfig({
  testDir: './features',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: env.baseUrl,
    headless: false,
    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
