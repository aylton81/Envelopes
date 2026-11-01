import type { Locator, Page } from '@playwright/test';

import { MobileAccountPage } from './mobile-account-page';
import { MobileAccountsPage } from './mobile-accounts-page';
import { MobileBankSyncPage } from './mobile-bank-sync-page';
import { MobileBudgetPage } from './mobile-budget-page';
import { MobilePayeesPage } from './mobile-payees-page';
import { MobileReportsPage } from './mobile-reports-page';
import { MobileRulesPage } from './mobile-rules-page';
import { MobileSchedulesPage } from './mobile-schedules-page';
import { MobileTransactionEntryPage } from './mobile-transaction-entry-page';
import { SettingsPage } from './settings-page';

// Pages reached directly from the fixed bottom tab bar.
const TAB_LINKS = ['Budget', 'Accounts', 'Reports', 'Transactions', 'Home'];
const ROUTES_BY_PAGE = {
  Home: '/home',
  Budget: '/budget',
  Transactions: '/transactions',
  Accounts: '/accounts',
  Transaction: '/transactions/new',
  Reports: '/reports',
  Schedules: '/settings/schedules',
  Settings: '/settings',
};

export class MobileNavigation {
  readonly page: Page;
  readonly heading: Locator;
  readonly navbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading');
    this.navbar = page.locator('[data-navbar-state]');
  }

  async navigateToPage<T extends { waitFor: Locator['waitFor'] }>(
    pageName: keyof typeof ROUTES_BY_PAGE,
    pageModelFactory: () => T,
  ): Promise<T> {
    const pageInstance = pageModelFactory();

    if (this.page.url().endsWith(ROUTES_BY_PAGE[pageName])) {
      // Already on the page.
      return pageInstance;
    }

    if (TAB_LINKS.includes(pageName)) {
      await this.navbar.getByRole('link', { name: pageName }).click();
    } else if (pageName === 'Transaction') {
      const addButton = this.page.getByRole('button', {
        name: 'Add transaction',
      });
      if (!(await addButton.isVisible())) {
        await this.navbar.getByRole('link', { name: 'Budget' }).click();
      }
      await addButton.click();
    } else if (pageName === 'Settings') {
      await this.openSettingsFromOverflowMenu();
    } else {
      throw new Error(`No navigation path to ${pageName}`);
    }

    await pageInstance.waitFor();
    return pageInstance;
  }

  async openSettingsFromOverflowMenu() {
    if (
      !(await this.page
        .getByRole('button', { name: 'More options' })
        .isVisible())
    ) {
      await this.navbar.getByRole('link', { name: 'Budget' }).click();
    }
    await this.page.getByRole('button', { name: 'More options' }).click();
    await this.page.getByRole('button', { name: 'Settings' }).click();
  }

  async goToBudgetPage() {
    return await this.navigateToPage(
      'Budget',
      () => new MobileBudgetPage(this.page),
    );
  }

  async goToAccountsPage() {
    return await this.navigateToPage(
      'Accounts',
      () => new MobileAccountsPage(this.page),
    );
  }

  async goToUncategorizedPage() {
    const button = this.page.getByRole('button', { name: 'Categorize' });
    await button.click();

    return new MobileAccountPage(this.page);
  }

  async goToTransactionEntryPage() {
    return await this.navigateToPage(
      'Transaction',
      () => new MobileTransactionEntryPage(this.page),
    );
  }

  async goToReportsPage() {
    return await this.navigateToPage(
      'Reports',
      () => new MobileReportsPage(this.page),
    );
  }

  async goToPayeesPage() {
    const settingsPage = await this.goToSettingsPage();
    await settingsPage.goToSection('Payees');

    const payeesPage = new MobilePayeesPage(this.page);
    await payeesPage.waitFor();
    return payeesPage;
  }

  async goToSchedulesPage() {
    const settingsPage = await this.goToSettingsPage();
    await settingsPage.goToSection('Schedules');

    const schedulesPage = new MobileSchedulesPage(this.page);
    await schedulesPage.waitFor();
    return schedulesPage;
  }

  async goToRulesPage() {
    const settingsPage = await this.goToSettingsPage();
    await settingsPage.goToSection('Rules');

    const rulesPage = new MobileRulesPage(this.page);
    await rulesPage.waitFor();
    return rulesPage;
  }

  async goToBankSyncPage() {
    const settingsPage = await this.goToSettingsPage();
    await settingsPage.goToSection('Bank Sync');

    const bankSyncPage = new MobileBankSyncPage(this.page);
    await bankSyncPage.waitFor();
    return bankSyncPage;
  }

  async goToSettingsPage() {
    return await this.navigateToPage(
      'Settings',
      () => new SettingsPage(this.page),
    );
  }
}
