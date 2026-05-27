import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { SideMenu } from './components/SideMenu';
import { TopBar } from './components/TopBar';

export class DashboardPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';

  readonly topBar: TopBar;
  readonly sideMenu: SideMenu;
  readonly widgets: Locator;

  constructor(page: Page) {
    super(page);
    this.topBar = new TopBar(page);
    this.sideMenu = new SideMenu(page);
    this.widgets = page.locator('.orangehrm-dashboard-widget');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await this.topBar.expectTitle(/dashboard/i);
  }
}
