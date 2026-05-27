import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export interface NewEmployeeInput {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export class AddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';

  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ has: page.locator('label', { hasText: /employee id/i }) })
      .locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fill(input: NewEmployeeInput): Promise<void> {
    await this.firstNameInput.fill(input.firstName);
    if (input.middleName) {
      await this.middleNameInput.fill(input.middleName);
    }
    await this.lastNameInput.fill(input.lastName);
  }

  async getEmployeeId(): Promise<string> {
    return (await this.employeeIdInput.inputValue()).trim();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
