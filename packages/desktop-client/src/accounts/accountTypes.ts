import type { AccountEntity, AccountType } from '@actual-app/core/types/models';
import type { TFunction } from 'i18next';

export type AccountTypeGroup = 'cash' | 'credit' | 'loans' | 'tracking';

/** Account types in the order they are offered, grouped like the picker. */
export const ACCOUNT_TYPE_GROUPS: ReadonlyArray<{
  group: AccountTypeGroup;
  types: readonly AccountType[];
}> = [
  { group: 'cash', types: ['checking', 'savings', 'cash'] },
  { group: 'credit', types: ['credit', 'lineOfCredit'] },
  { group: 'loans', types: ['mortgage', 'loan'] },
  { group: 'tracking', types: ['investment', 'other'] },
];

const GROUP_BY_TYPE: Record<string, AccountTypeGroup> = {
  checking: 'cash',
  savings: 'cash',
  cash: 'cash',
  credit: 'credit',
  lineOfCredit: 'credit',
  mortgage: 'loans',
  loan: 'loans',
  // Legacy value from older budgets.
  debt: 'loans',
  investment: 'tracking',
  other: 'tracking',
};

export function isAccountType(value: unknown): value is AccountType {
  return ACCOUNT_TYPE_GROUPS.some(({ types }) =>
    types.some(type => type === value),
  );
}

/**
 * Which section an account belongs to. Accounts created before types
 * existed fall back on their budget status.
 */
export function getAccountTypeGroup(
  account: Pick<AccountEntity, 'type' | 'offbudget'>,
): AccountTypeGroup {
  const fromType = account.type ? GROUP_BY_TYPE[account.type] : undefined;
  return fromType ?? (account.offbudget ? 'tracking' : 'cash');
}

/** Loans and tracked assets usually live outside the spending budget. */
export function isOffBudgetByDefault(type: AccountType): boolean {
  const group = GROUP_BY_TYPE[type];
  return group === 'loans' || group === 'tracking';
}

export function isCreditAccount(
  account: Pick<AccountEntity, 'type'> | null | undefined,
): boolean {
  return account?.type === 'credit' || account?.type === 'lineOfCredit';
}

export function getAccountTypeLabel(t: TFunction, type: AccountType): string {
  switch (type) {
    case 'checking':
      return t('Checking');
    case 'savings':
      return t('Savings');
    case 'cash':
      return t('Cash');
    case 'credit':
      return t('Credit card');
    case 'lineOfCredit':
      return t('Line of credit');
    case 'mortgage':
      return t('Mortgage');
    case 'loan':
      return t('Loan');
    case 'investment':
      return t('Investment');
    default:
      return t('Other asset or debt');
  }
}

export function getAccountTypeGroupLabel(
  t: TFunction,
  group: AccountTypeGroup,
): string {
  switch (group) {
    case 'cash':
      return t('Cash accounts');
    case 'credit':
      return t('Credit');
    case 'loans':
      return t('Mortgages and loans');
    default:
      return t('Tracking');
  }
}
