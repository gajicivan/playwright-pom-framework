import { test, expect } from '../../src/fixtures/pages';
import { aNewUser } from '../../src/data/userBuilder';

test.describe('Admin > User Management @regression', () => {
  // Track usernames each test creates, so afterEach can clean them up
  // even if the test failed before its own delete step.
  const createdUsernames: string[] = [];

  test.afterEach(async ({ userManagementPage }) => {
    if (createdUsernames.length === 0) return;

    for (const username of createdUsernames) {
      try {
        await userManagementPage.goto();
        await userManagementPage.searchByUsername(username);
        const row = userManagementPage.rowByUsername(username);
        const stillExists = await row.isVisible({ timeout: 2_000 }).catch(() => false);
        if (stillExists) {
          await userManagementPage.deleteUser(username);
        }
      } catch (error) {
        // Best-effort cleanup — never fail the test result on cleanup error.
        console.warn(`[cleanup] could not delete user "${username}":`, (error as Error).message);
      }
    }
    createdUsernames.length = 0;
  });

  test('create, search, then delete a system user (full lifecycle)', async ({
    userManagementPage,
    addUserPage,
    page,
  }) => {
    const user = aNewUser();
    createdUsernames.push(user.username);

    await userManagementPage.goto();
    await userManagementPage.addButton.click();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);

    await addUserPage.fill(user);
    await addUserPage.save();
    await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);

    await userManagementPage.searchByUsername(user.username);
    await expect(userManagementPage.rowByUsername(user.username)).toBeVisible();

    await userManagementPage.deleteUser(user.username);
    await userManagementPage.searchByUsername(user.username);
    await expect(userManagementPage.noRecords).toBeVisible();
  });

  test('created user appears in the user list', async ({
    userManagementPage,
    addUserPage,
    page,
  }) => {
    const user = aNewUser();
    createdUsernames.push(user.username);

    await userManagementPage.goto();
    await userManagementPage.addButton.click();
    await addUserPage.fill(user);
    await addUserPage.save();

    await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);
    await userManagementPage.searchByUsername(user.username);
    await expect(userManagementPage.rowByUsername(user.username)).toBeVisible();
    // No inline delete — afterEach hook cleans up.
  });

  test('searching for a non-existent username returns no records', async ({
    userManagementPage,
  }) => {
    await userManagementPage.goto();
    await userManagementPage.searchByUsername(`ghost_${Date.now()}`);
    await expect(userManagementPage.noRecords).toBeVisible();
  });

  test('cancel on add user form returns to the user list without saving', async ({
    userManagementPage,
    addUserPage,
    page,
  }) => {
    await userManagementPage.goto();
    await userManagementPage.addButton.click();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);

    await addUserPage.cancelButton.click();
    await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);
  });
});
