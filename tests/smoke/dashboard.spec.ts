import { test, expect } from '../../src/fixtures/pages';

test.describe('Dashboard @smoke', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('dashboard loads with header and at least one widget', async ({ dashboardPage }) => {
    await dashboardPage.expectLoaded();
    await expect(dashboardPage.widgets.first()).toBeVisible();
  });

  test('side menu exposes the core modules', async ({ dashboardPage }) => {
    await dashboardPage.sideMenu.expectVisible([
      'Admin',
      'PIM',
      'Leave',
      'Time',
      'Recruitment',
      'My Info',
      'Dashboard',
    ]);
  });
});
