import { test, expect } from '../../src/fixtures/pages';
import { aNewEmployee } from '../../src/data/employeeBuilder';

test.describe('PIM > Employee List @regression', () => {
  test('add a new employee and find them in the list by employee id', async ({
    employeeListPage,
    addEmployeePage,
    page,
  }) => {
    const emp = aNewEmployee();

    await employeeListPage.goto();
    await employeeListPage.addButton.click();
    await expect(page).toHaveURL(/\/pim\/addEmployee/);

    await addEmployeePage.fill(emp);
    const employeeId = await addEmployeePage.getEmployeeId();
    await addEmployeePage.save();

    await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);

    await employeeListPage.goto();
    await employeeListPage.searchByEmployeeId(employeeId);
    await expect(employeeListPage.rowContaining(employeeId)).toBeVisible();
    await expect(employeeListPage.rowContaining(emp.lastName)).toBeVisible();
  });
});
