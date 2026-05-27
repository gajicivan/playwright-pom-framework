import { test, expect } from '../../src/fixtures/pages';
import type { MenuItem } from '../../src/pages/components/SideMenu';

const modules: { name: MenuItem; urlPart: RegExp; moduleTitle: RegExp }[] = [
  { name: 'Admin', urlPart: /\/admin\//, moduleTitle: /^Admin$/ },
  { name: 'PIM', urlPart: /\/pim\//, moduleTitle: /^PIM$/ },
  { name: 'Leave', urlPart: /\/leave\//, moduleTitle: /^Leave$/ },
  { name: 'Time', urlPart: /\/time\//, moduleTitle: /^Time$/ },
  { name: 'Recruitment', urlPart: /\/recruitment\//, moduleTitle: /^Recruitment$/ },
  { name: 'My Info', urlPart: /\/pim\/viewPersonalDetails/, moduleTitle: /^PIM$/ },
];

test.describe('Module navigation @smoke', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  for (const mod of modules) {
    test(`opening ${mod.name} from the side menu navigates to the right URL`, async ({
      page,
      dashboardPage,
    }) => {
      await dashboardPage.sideMenu.open(mod.name);
      await expect(page).toHaveURL(mod.urlPart);
      await dashboardPage.topBar.expectTitle(mod.moduleTitle);
    });
  }
});
