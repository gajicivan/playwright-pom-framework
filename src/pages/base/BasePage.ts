import { Locator, Page, expect } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.escapeRegex(this.path)));
  }

  protected fieldByLabel(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('label', { hasText: new RegExp(`^${label}$`, 'i') }) })
      .locator('input, textarea')
      .first();
  }

  protected selectByLabel(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('label', { hasText: new RegExp(`^${label}$`, 'i') }) })
      .locator('.oxd-select-text');
  }

  protected async chooseFromDropdown(label: string, option: string): Promise<void> {
    await this.selectByLabel(label).click();
    await this.page
      .getByRole('option', { name: new RegExp(`^${option}$`, 'i') })
      .first()
      .click();
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
