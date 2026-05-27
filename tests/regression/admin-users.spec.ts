import { test, expect } from '../../src/fixtures/pages';
import { aNewUser } from '../../src/data/userBuilder';

test.describe('Admin > User Management @regression', () => {
  test('create, search, then delete a system user (full lifecycle)', async ({
    userManagementPage,
    addUserPage,
    page,
  }) => {
    const user = aNewUser();

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
