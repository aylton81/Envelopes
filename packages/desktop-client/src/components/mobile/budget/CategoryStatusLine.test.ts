import { describe, expect, it } from 'vitest';

import { getCategoryStatus } from './CategoryStatusLine';

const base = {
  spent: 0,
  balance: 0,
  budgeted: 0,
  goal: null,
  isLongGoal: false,
};

describe('getCategoryStatus', () => {
  it('reports overspending first', () => {
    expect(
      getCategoryStatus({ ...base, spent: -48381, balance: -3592 }),
    ).toEqual({ kind: 'overspent', amount: 3592 });
  });

  it('reports the money still needed for a monthly goal', () => {
    expect(
      getCategoryStatus({
        ...base,
        budgeted: 10000,
        balance: 10000,
        goal: 25000,
      }),
    ).toEqual({ kind: 'needs-money', amount: 15000 });
  });

  it('measures a long-term goal against the balance', () => {
    expect(
      getCategoryStatus({
        ...base,
        budgeted: 5000,
        balance: 40000,
        goal: 50000,
        isLongGoal: true,
      }),
    ).toEqual({ kind: 'needs-money', amount: 10000 });
  });

  it('shows spending against available money once the goal is met', () => {
    expect(
      getCategoryStatus({
        ...base,
        spent: -19468,
        balance: 68120,
        budgeted: 40000,
        goal: 40000,
      }),
    ).toEqual({ kind: 'spending', spent: 19468, available: 87588 });
  });

  it('distinguishes untouched money from an empty category', () => {
    expect(getCategoryStatus({ ...base, balance: 5000 })).toEqual({
      kind: 'untouched',
    });
    expect(getCategoryStatus(base)).toEqual({ kind: 'empty' });
  });
});
