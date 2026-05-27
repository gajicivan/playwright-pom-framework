import { Locator, Page, expect } from '@playwright/test';

export class TopBar {
  readonly title: Locator;
  readonly userMenuToggle: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.userMenuToggle = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.title).toHaveText(title);
  }

  async logout(): Promise<void> {
    await this.userMenuToggle.click();
    await this.page.getByText('Logout', { exact: true }).click();
  }
}
