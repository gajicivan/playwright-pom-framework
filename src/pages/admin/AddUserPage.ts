import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export interface NewUserInput {
  userRole: UserRole;
  employeeName: string;
  status: UserStatus;
  username: string;
  password: string;
}

export class AddUserPage extends BasePage {
  readonly path = '/web/index.php/admin/saveSystemUser';

  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async fill(input: NewUserInput): Promise<void> {
    await this.chooseFromDropdown('User Role', input.userRole);
    await this.pickEmployee(input.employeeName);
    await this.chooseFromDropdown('Status', input.status);
    await this.fieldByLabel('Username').fill(input.username);
    await this.fieldByLabel('Password').fill(input.password);
    await this.fieldByLabel('Confirm Password').fill(input.password);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  private async pickEmployee(query: string): Promise<void> {
    const input = this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('label', { hasText: /employee name/i }) })
      .locator('input');
    await input.fill(query);
    await this.page
      .getByRole('option', { name: new RegExp(query, 'i') })
      .first()
      .click();
  }
}
