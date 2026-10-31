import { describe, expect, it } from 'vitest';

import { getSpendingProgress } from './SpendingProgressBar';

describe('getSpendingProgress', () => {
  it('returns null when nothing was spent', () => {
    expect(getSpendingProgress(0, 10000)).toBeNull();
  });

  it('returns null for refunds (positive sum-amount)', () => {
    expect(getSpendingProgress(2500, 12500)).toBeNull();
  });

  it('is on track below 85% of the available money', () => {
    // budgeted 400.00, spent 194.68 -> 205.32 left
    expect(getSpendingProgress(-19468, 20532)).toEqual({
      ratio: 19468 / 40000,
      status: 'on-track',
    });
  });

  it('counts carryover as available money', () => {
    // 100 budgeted + 100 carried over, 150 spent -> 50 left of 200
    expect(getSpendingProgress(-15000, 5000)).toEqual({
      ratio: 0.75,
      status: 'on-track',
    });
  });

  it('is near the limit from 85% on', () => {
    expect(getSpendingProgress(-8500, 1500)?.status).toBe('near-limit');
    expect(getSpendingProgress(-9900, 100)).toEqual({
      ratio: 0.99,
      status: 'near-limit',
    });
  });

  it('treats spending exactly to plan as done, not a warning', () => {
    expect(getSpendingProgress(-10000, 0)).toEqual({
      ratio: 1,
      status: 'on-track',
    });
  });

  it('is overspent and full when the balance is negative', () => {
    expect(getSpendingProgress(-48381, -3592)).toEqual({
      ratio: 1,
      status: 'overspent',
    });
  });

  it('is full when there was no money available at all', () => {
    expect(getSpendingProgress(-5000, -5000)).toEqual({
      ratio: 1,
      status: 'overspent',
    });
  });
});
