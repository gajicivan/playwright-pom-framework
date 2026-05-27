import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly fieldErrors: Locator;
  readonly forgotPasswordLink: Locator;


  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: /login/i });
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.fieldErrors = page.locator('.oxd-input-field-error-message');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.errorAlert).toHaveText(/invalid credentials/i);
  }
}
