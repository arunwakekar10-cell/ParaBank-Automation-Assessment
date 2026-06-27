import { After, AfterAll, Before, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { CustomWorld } from './world';

let browser: Browser;

setDefaultTimeout(60_000);

BeforeAll(async function () {
  fs.mkdirSync(path.resolve('reports', 'screenshots'), { recursive: true });
  browser = await chromium.launch({ headless: env.headless, slowMo: env.slowMo });
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true
  });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const fileName = scenario.pickle.name.replace(/[^a-z0-9-_]/gi, '_');
    const screenshotBuffer = await this.page.screenshot({
      path: path.resolve('reports', 'screenshots', `failed-${fileName}.png`),
      fullPage: true
    });
    await this.attach(screenshotBuffer, 'image/png');
  }

  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
