import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class UserManagementPage extends BasePage {
  readonly path = '/web/index.php/admin/viewSystemUsers';

  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly noRecords: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.locator('.orangehrm-header-container').getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.tableRows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('span.oxd-text--span', { hasText: 'No Records Found' });
    this.confirmDeleteButton = page.getByRole('button', { name: /yes, delete/i });
  }

  async searchByUsername(username: string): Promise<void> {
    await this.fieldByLabel('Username').fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  rowByUsername(username: string): Locator {
    return this.tableRows.filter({ hasText: username });
  }

  async deleteUser(username: string): Promise<void> {
    const row = this.rowByUsername(username);
    await row.locator('button.oxd-icon-button').last().click();
    await this.confirmDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
