import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { AccountAmount } from '../pages/AccountOverviewPage';
import { ParaBankUser } from '../utils/test-data';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  user?: ParaBankUser;
  accountAmounts: AccountAmount[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
