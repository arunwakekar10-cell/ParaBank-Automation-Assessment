import { Given, Then, When } from '@cucumber/cucumber';
import fs from 'node:fs';
import { AccountOverviewPage } from '../pages/AccountOverviewPage';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { CustomWorld } from '../support/world';
import { createUniqueUser } from '../utils/test-data';

Given('I am on the ParaBank registration page', async function (this: CustomWorld) {
  this.user = createUniqueUser();

  const homePage = new HomePage(this.page);
  await homePage.open();
  await homePage.goToRegister();
});

Given('I am on the ParaBank login page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.open();
});

When('I register with valid customer details', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before registration.');
  }

  const registerPage = new RegisterPage(this.page);
  await registerPage.register(this.user);
});

When('I submit the registration form without entering mandatory details', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.submitBlankRegistration();
});

When('I submit the registration form with mismatched passwords', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before password mismatch validation.');
  }

  const registerPage = new RegisterPage(this.page);
  await registerPage.register(this.user, `${this.user.password}Mismatch`);
});

When('I create a customer and try to register again with the same username', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before duplicate username validation.');
  }

  const registerPage = new RegisterPage(this.page);
  await registerPage.register(this.user);
  await registerPage.assertAccountCreated(this.user.username);

  const accountOverviewPage = new AccountOverviewPage(this.page);
  await accountOverviewPage.logout();

  const homePage = new HomePage(this.page);
  await homePage.goToRegister();
  await registerPage.register(this.user);
});

When('I sign out from ParaBank', async function (this: CustomWorld) {
  const accountOverviewPage = new AccountOverviewPage(this.page);
  await accountOverviewPage.logout();
});

When('I sign in with the newly created account', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before login.');
  }

  const homePage = new HomePage(this.page);
  await homePage.login(this.user.username, this.user.password);
});

When('I sign in with invalid credentials', async function (this: CustomWorld) {
  const invalidUser = createUniqueUser();
  const homePage = new HomePage(this.page);
  await homePage.login(invalidUser.username, 'InvalidPassword!');
});

Then('the account should be created successfully', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before assertion.');
  }

  const registerPage = new RegisterPage(this.page);
  await registerPage.assertAccountCreated(this.user.username);
});

Then('registration required field validation messages should be displayed', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.assertRequiredFieldValidationMessages();
});

Then('a password mismatch validation message should be displayed', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.assertPasswordMismatchValidation();
});

Then('a duplicate username validation message should be displayed', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.assertDuplicateUsernameValidation();
});

Then('an invalid login error should be displayed', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page);
  await homePage.assertInvalidLoginError();
});

Then('I should see the account overview and print the displayed amount', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('Test user was not created before amount validation.');
  }

  const accountOverviewPage = new AccountOverviewPage(this.page);
  this.accountAmounts = await accountOverviewPage.getDisplayedAmounts();

  const amountLog = this.accountAmounts
    .map(
      (amount) =>
        `Account ${amount.accountNumber} | Balance: ${amount.balance} | Available Amount: ${amount.availableAmount}`
    )
    .join('\n');

  console.log(`\nDisplayed amount after login for ${this.user.username}:\n${amountLog}\n`);
  await this.attach(`Displayed amount after login for ${this.user.username}:\n${amountLog}`, 'text/plain');

  const screenshotPath = await accountOverviewPage.saveScreenshot(
    `account-overview-${this.user.username}`
  );
  const screenshotBuffer = fs.readFileSync(screenshotPath);
  await this.attach(screenshotBuffer, 'image/png');
});
