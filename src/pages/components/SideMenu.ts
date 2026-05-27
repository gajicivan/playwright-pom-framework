import { Locator, Page, expect } from '@playwright/test';

export type MenuItem =
  | 'Admin'
  | 'PIM'
  | 'Leave'
  | 'Time'
  | 'Recruitment'
  | 'My Info'
  | 'Performance'
  | 'Dashboard'
  | 'Directory'
  | 'Maintenance'
  | 'Claim'
  | 'Buzz';

export class SideMenu {
  readonly searchInput: Locator;
  private readonly menu: Locator;

  constructor(private readonly page: Page) {
    this.menu = page.locator('aside.oxd-sidepanel');
    this.searchInput = this.menu.getByPlaceholder('Search');
  }

  item(name: MenuItem): Locator {
    return this.menu.locator('a.oxd-main-menu-item', { hasText: name });
  }

  async open(name: MenuItem): Promise<void> {
    await this.item(name).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectVisible(items: MenuItem[]): Promise<void> {
    for (const name of items) {
      await expect(this.item(name)).toBeVisible();
    }
  }
}
