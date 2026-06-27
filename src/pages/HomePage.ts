import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.url('/index.htm?ConnType=JDBC'), {
      waitUntil: 'domcontentloaded'
    });
    await expect(this.page).toHaveTitle(/ParaBank/);
  }

  async goToRegister(): Promise<void> {
    await this.page.getByRole('link', { name: 'Register' }).click();
    await expect(this.page).toHaveURL(/register\.htm/);
  }

  async login(username: string, password: string): Promise<void> {
    await expect(this.page.locator('input[name="username"]')).toBeVisible();
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('input[value="Log In"]').click();
  }

  async assertInvalidLoginError(): Promise<void> {
    await expect(this.page.locator('#rightPanel')).toContainText(
      'The username and password could not be verified.',
      { timeout: 30_000 }
    );
  }
}
