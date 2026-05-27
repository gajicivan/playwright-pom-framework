import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { AddUserPage } from '../pages/admin/AddUserPage';
import { EmployeeListPage } from '../pages/pim/EmployeeListPage';
import { AddEmployeePage } from '../pages/pim/AddEmployeePage';

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  userManagementPage: UserManagementPage;
  addUserPage: AddUserPage;
  employeeListPage: EmployeeListPage;
  addEmployeePage: AddEmployeePage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  userManagementPage: async ({ page }, use) => {
    await use(new UserManagementPage(page));
  },
  addUserPage: async ({ page }, use) => {
    await use(new AddUserPage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
});

export { expect } from '@playwright/test';
