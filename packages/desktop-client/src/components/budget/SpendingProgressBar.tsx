import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { useSheetValue } from '#hooks/useSheetValue';
import type { Binding } from '#spreadsheet';

type SpendingProgressBarProps = {
  spent: Binding<'envelope-budget' | 'tracking-budget', 'sum-amount'>;
  balance: Binding<'envelope-budget' | 'tracking-budget', 'leftover'>;
  /**
   * `overlay` (default) pins the bar to the bottom of a table cell and hides
   * it until money is spent. `inline` flows in the layout as a full-width
   * meter and always shows its track, as in the mobile budget list.
   */
  variant?: 'overlay' | 'inline';
};

/**
 * Thin bar showing how much of a category's available money (balance +
 * spent, i.e. budgeted plus carryover) has been used.
 */
export function SpendingProgressBar({
  spent,
  balance,
  variant = 'overlay',
}: SpendingProgressBarProps) {
  const spentValue = useSheetValue(spent) ?? 0;
  const balanceValue = useSheetValue(balance) ?? 0;

  const progress = getSpendingProgress(spentValue, balanceValue);
  const isInline = variant === 'inline';
  if (!progress && !isInline) {
    return null;
  }
  const ratio = progress?.ratio ?? 0;
  const status = progress?.status ?? 'on-track';

  return (
    <View
      aria-hidden
      style={{
        ...(isInline
          ? { width: '100%' }
          : {
              position: 'absolute',
              left: 8,
              right: 8,
              bottom: 4,
              pointerEvents: 'none',
            }),
        height: 3,
        backgroundColor: `color-mix(in srgb, ${theme.tableBorder} 60%, transparent)`,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${Math.round(ratio * 100)}%`,
          backgroundColor:
            status === 'overspent'
              ? theme.budgetNumberNegative
              : status === 'near-limit'
                ? theme.warningText
                : theme.pageTextLight,
        }}
      />
    </View>
  );
}

export const NEAR_LIMIT_RATIO = 0.85;

export type SpendingProgress = {
  /** Share of the available money already used, clamped to 0..1. */
  ratio: number;
  status: 'on-track' | 'near-limit' | 'overspent';
};

/**
 * `spent` is the category's sum-amount (negative when money went out) and
 * `balance` its leftover. Available money is balance + amount spent, i.e.
 * budgeted plus carryover. Returns null when nothing has been spent.
 */
export function getSpendingProgress(
  spent: number,
  balance: number,
): SpendingProgress | null {
  const used = -spent;
  if (used <= 0) {
    return null;
  }

  const available = balance + used;
  const ratio = available > 0 ? Math.min(used / available, 1) : 1;

  if (balance < 0) {
    return { ratio, status: 'overspent' };
  }
  // Spent exactly to plan (a paid bill, say) is done, not a warning.
  if (balance === 0) {
    return { ratio, status: 'on-track' };
  }
  if (ratio >= NEAR_LIMIT_RATIO) {
    return { ratio, status: 'near-limit' };
  }
  return { ratio, status: 'on-track' };
}
