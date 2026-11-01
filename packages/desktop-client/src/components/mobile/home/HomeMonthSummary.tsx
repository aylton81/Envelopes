import React from 'react';
import { useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';

import { PrivacyFilter } from '#components/PrivacyFilter';
import { useFormat } from '#hooks/useFormat';
import { useSheetValue } from '#hooks/useSheetValue';
import { envelopeBudget, trackingBudget } from '#spreadsheet/bindings';

import { HomeSummaryRow } from './HomeSummaryRow';

/** Budgeted, spent and available totals for the current month. */
export function HomeMonthSummary({ isTracking }: { isTracking: boolean }) {
  const { t } = useTranslation();
  const format = useFormat();

  const budgeted =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'total-budgeted'>(
      isTracking
        ? trackingBudget.totalBudgetedExpense
        : envelopeBudget.totalBudgeted,
    ) ?? 0;
  const spent =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'total-spent'>(
      isTracking ? trackingBudget.totalSpent : envelopeBudget.totalSpent,
    ) ?? 0;
  const available =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'total-leftover'>(
      isTracking ? trackingBudget.totalLeftover : envelopeBudget.totalBalance,
    ) ?? 0;

  // Envelope stores budgeted totals as negative numbers.
  const budgetedShown = isTracking ? budgeted : -budgeted;
  const money = (value: number) => (
    <PrivacyFilter>
      <Text style={{ ...styles.tnum, fontWeight: 600 }}>
        {format(value, 'financial')}
      </Text>
    </PrivacyFilter>
  );

  return (
    <>
      <HomeSummaryRow label={t('Budgeted')}>
        {money(budgetedShown)}
      </HomeSummaryRow>
      <HomeSummaryRow label={t('Spent')}>{money(spent)}</HomeSummaryRow>
      <HomeSummaryRow label={t('Available')}>
        <PrivacyFilter>
          <Text
            style={{
              ...styles.tnum,
              fontWeight: 600,
              color:
                available < 0 ? theme.budgetNumberNegative : theme.pageText,
            }}
          >
            {format(available, 'financial')}
          </Text>
        </PrivacyFilter>
      </HomeSummaryRow>
    </>
  );
}
