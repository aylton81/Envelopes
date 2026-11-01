import { describe, expect, it } from 'vitest';

import {
  getAccountTypeGroup,
  isAccountType,
  isCreditAccount,
  isOffBudgetByDefault,
} from './accountTypes';

describe('getAccountTypeGroup', () => {
  it('uses the account type when there is one', () => {
    expect(getAccountTypeGroup({ type: 'checking', offbudget: 0 })).toBe(
      'cash',
    );
    expect(getAccountTypeGroup({ type: 'credit', offbudget: 0 })).toBe(
      'credit',
    );
    expect(getAccountTypeGroup({ type: 'mortgage', offbudget: 1 })).toBe(
      'loans',
    );
    expect(getAccountTypeGroup({ type: 'investment', offbudget: 1 })).toBe(
      'tracking',
    );
  });

  it('maps the legacy "debt" type to loans', () => {
    expect(getAccountTypeGroup({ type: 'debt', offbudget: 1 })).toBe('loans');
  });

  it('falls back on budget status for untyped or unknown accounts', () => {
    expect(getAccountTypeGroup({ type: null, offbudget: 0 })).toBe('cash');
    expect(getAccountTypeGroup({ type: undefined, offbudget: 1 })).toBe(
      'tracking',
    );
    expect(getAccountTypeGroup({ type: 'depository', offbudget: 0 })).toBe(
      'cash',
    );
  });
});

describe('account type rules', () => {
  it('keeps loans and tracked assets off budget by default', () => {
    expect(isOffBudgetByDefault('checking')).toBe(false);
    expect(isOffBudgetByDefault('credit')).toBe(false);
    expect(isOffBudgetByDefault('mortgage')).toBe(true);
    expect(isOffBudgetByDefault('investment')).toBe(true);
  });

  it('recognises credit accounts', () => {
    expect(isCreditAccount({ type: 'credit' })).toBe(true);
    expect(isCreditAccount({ type: 'lineOfCredit' })).toBe(true);
    expect(isCreditAccount({ type: 'checking' })).toBe(false);
    expect(isCreditAccount(null)).toBe(false);
  });

  it('only accepts known types', () => {
    expect(isAccountType('savings')).toBe(true);
    expect(isAccountType('debt')).toBe(false);
  });
});
