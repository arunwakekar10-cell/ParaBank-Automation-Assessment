import { expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { BasePage } from './BasePage';

export interface AccountAmount {
  accountNumber: string;
  balance: string;
  availableAmount: string;
}

export class AccountOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible({
      timeout: 30_000
    });
    await expect(this.page.locator('#accountTable')).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('link', { name: 'Log Out' }).click();
    await expect(this.page.locator('input[name="username"]')).toBeVisible({ timeout: 30_000 });
  }

  async getDisplayedAmounts(): Promise<AccountAmount[]> {
    await this.waitForLoaded();
    await expect(this.page.locator('#accountTable')).toContainText('Available Amount');

    try {
      await this.waitForAmountRows();
    } catch {
      // ParaBank is a public demo application and can occasionally render the
      // account table before the account row arrives. Refreshing the overview
      // keeps the test deterministic without hiding real assertion failures.
      await this.page.getByRole('link', { name: 'Accounts Overview' }).click();
      await this.waitForLoaded();
      await this.waitForAmountRows();
    }

    const amounts = await this.extractAmountRows();

    if (amounts.length === 0) {
      const tableText = await this.page.locator('#accountTable').innerText();
      throw new Error(
        `No account amount rows were found in the account overview table. Table text: ${tableText}`
      );
    }

    return amounts;
  }

  private async waitForAmountRows(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const rows = Array.from(document.querySelectorAll('#accountTable tr'));

        return rows.some((row) => {
          const cells = Array.from(row.querySelectorAll('td')).map((cell) =>
            (cell.textContent ?? '').trim()
          );

          const isDataRow = cells.length >= 3 && cells[0] !== '' && cells[0] !== 'Total';
          const hasAmount = /\$\s*\d/.test(`${cells[1] ?? ''} ${cells[2] ?? ''}`);

          return isDataRow && hasAmount;
        });
      },
      undefined,
      { timeout: 30_000 }
    );
  }

  private async extractAmountRows(): Promise<AccountAmount[]> {
    return this.page.locator('#accountTable tr').evaluateAll((rows) => {
      return rows
        .map((row) =>
          Array.from(row.querySelectorAll('td')).map((cell) => (cell.textContent ?? '').trim())
        )
        .filter((cells) => cells.length >= 3)
        .filter((cells) => cells[0] !== 'Total' && cells[0] !== '')
        .map((cells) => ({
          accountNumber: cells[0],
          balance: cells[1],
          availableAmount: cells[2]
        }));
    });
  }

  async saveScreenshot(fileName: string): Promise<string> {
    const screenshotDirectory = path.resolve('reports', 'screenshots');
    fs.mkdirSync(screenshotDirectory, { recursive: true });

    const safeFileName = fileName.replace(/[^a-z0-9-_]/gi, '_');
    const screenshotPath = path.join(screenshotDirectory, `${safeFileName}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    return screenshotPath;
  }
}
