import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class EmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly noRecords: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.locator('.orangehrm-header-container').getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.tableRows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('span.oxd-text--span', { hasText: 'No Records Found' });
  }

  async searchByEmployeeId(id: string): Promise<void> {
    await this.fieldByLabel('Employee Id').fill(id);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  rowContaining(text: string): Locator {
    return this.tableRows.filter({ hasText: text });
  }
}
