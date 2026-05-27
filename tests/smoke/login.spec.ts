import { test, expect } from '../../src/fixtures/pages';
import { env } from '../../src/config/env';

test.describe('Login @smoke', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid admin credentials land on the dashboard', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.admin.username, env.admin.password);
    await dashboardPage.expectLoaded();
  });

  test('invalid credentials show an alert and keep the user on the login page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.login('not-a-user', 'definitely-wrong');
    await loginPage.expectInvalidCredentialsError();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('submitting empty form shows required-field errors on both inputs', async ({
    loginPage,
  }) => {
    await loginPage.submitButton.click();
    await expect(loginPage.fieldErrors).toHaveCount(2);
  });

  test('logging out returns the user to the login screen', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(env.admin.username, env.admin.password);
    await dashboardPage.expectLoaded();
    await dashboardPage.topBar.logout();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
