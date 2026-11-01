import type { AccountGroupEntity } from './account-group';
import type { BankSyncProviders } from './bank-sync';

export type AccountEntity = {
  id: string;
  name: string;
  offbudget: 0 | 1;
  closed: 0 | 1;
  sort_order: number;
  last_reconciled: string | null;
  tombstone: 0 | 1;
  account_group_id: AccountGroupEntity['id'] | null;
  /**
   * What kind of account this is (see AccountType). Older budgets may hold
   * legacy values such as 'debt' or 'other', or nothing at all.
   */
  type?: string | null;

  // Sync fields
  account_id: string | null;
  bank: string | null;
  bankName: string | null;
  bankId: string | null;
  mask: string | null; // end of bank account number
  official_name: string | null;
  balance_current: number | null;
  balance_available: number | null;
  balance_limit: number | null;
  account_sync_source: AccountSyncSource | null;
  last_sync: string | null;
  bank_sync_status: BankSyncStatus | null;
};

export type AccountSyncSource = BankSyncProviders;

export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'credit'
  | 'lineOfCredit'
  | 'mortgage'
  | 'loan'
  | 'investment'
  | 'other';

export type BankSyncStatus =
  | 'ok'
  | 'pending'
  | 'sync-requested'
  | 'failed'
  | 'reauth-required'
  | 'attention-required'
  | 'rate-limit-exceeded'
  | 'timed-out'
  | 'server-down'
  | 'account-missing'
  | 'not-configured';
