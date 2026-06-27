import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ParaBankUser } from '../utils/test-data';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async register(user: ParaBankUser, repeatedPassword = user.password): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();

    await this.page.locator('input[name="customer.firstName"]').fill(user.firstName);
    await this.page.locator('input[name="customer.lastName"]').fill(user.lastName);
    await this.page.locator('input[name="customer.address.street"]').fill(user.street);
    await this.page.locator('input[name="customer.address.city"]').fill(user.city);
    await this.page.locator('input[name="customer.address.state"]').fill(user.state);
    await this.page.locator('input[name="customer.address.zipCode"]').fill(user.zipCode);
    await this.page.locator('input[name="customer.phoneNumber"]').fill(user.phoneNumber);
    await this.page.locator('input[name="customer.ssn"]').fill(user.ssn);
    await this.page.locator('input[name="customer.username"]').fill(user.username);
    await this.page.locator('input[name="customer.password"]').fill(user.password);
    await this.page.locator('input[name="repeatedPassword"]').fill(repeatedPassword);

    await this.submit();
  }

  async submitBlankRegistration(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Signing up is easy!' })).toBeVisible();
    await this.submit();
  }

  async assertAccountCreated(username: string): Promise<void> {
    await expect(this.page.locator('#rightPanel')).toContainText(`Welcome ${username}`, {
      timeout: 30_000
    });
    await expect(this.page.locator('#rightPanel')).toContainText(
      'Your account was created successfully. You are now logged in.'
    );
  }

  async assertRequiredFieldValidationMessages(): Promise<void> {
    const rightPanel = this.page.locator('#rightPanel');
    const expectedMessages = [
      'First name is required.',
      'Last name is required.',
      'Address is required.',
      'City is required.',
      'State is required.',
      'Zip Code is required.',
      'Social Security Number is required.',
      'Username is required.',
      'Password is required.',
      'Password confirmation is required.'
    ];

    for (const message of expectedMessages) {
      await expect(rightPanel).toContainText(message);
    }
  }

  async assertPasswordMismatchValidation(): Promise<void> {
    await expect(this.page.locator('#rightPanel')).toContainText('Passwords did not match.', {
      timeout: 30_000
    });
  }

  async assertDuplicateUsernameValidation(): Promise<void> {
    await expect(this.page.locator('#rightPanel')).toContainText('This username already exists.', {
      timeout: 30_000
    });
  }

  private async submit(): Promise<void> {
    await this.page.locator('input[value="Register"]').click();
  }
}
