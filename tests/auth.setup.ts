import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from '../src/pages/LoginPage';
import { env } from '../src/config/env';
import { STORAGE_STATE } from '../playwright.config';

setup('authenticate as admin', async ({ page }) => {
  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.admin.username, env.admin.password);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('banner').getByText('Dashboard')).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
