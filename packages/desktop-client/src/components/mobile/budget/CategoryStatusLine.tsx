import { useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import type { CategoryEntity } from '@actual-app/core/types/models';

import { PrivacyFilter } from '#components/PrivacyFilter';
import { useFeatureFlag } from '#hooks/useFeatureFlag';
import { useFormat } from '#hooks/useFormat';
import { useSheetValue } from '#hooks/useSheetValue';
import { useSyncedPref } from '#hooks/useSyncedPref';
import { envelopeBudget, trackingBudget } from '#spreadsheet/bindings';

type CategoryStatusLineProps = {
  category: CategoryEntity;
};

/**
 * One muted line under a category's meter that says, in words, where the
 * category stands this month: overspent, short of its goal, or how much of
 * the available money has been spent.
 */
export function CategoryStatusLine({ category }: CategoryStatusLineProps) {
  const { t } = useTranslation();
  const format = useFormat();
  const [budgetType = 'envelope'] = useSyncedPref('budgetType');
  const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
  const isTracking = budgetType === 'tracking';
  const id = category.id;

  const spent =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'sum-amount'>(
      isTracking
        ? trackingBudget.catSumAmount(id)
        : envelopeBudget.catSumAmount(id),
    ) ?? 0;
  const balance =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'leftover'>(
      isTracking
        ? trackingBudget.catBalance(id)
        : envelopeBudget.catBalance(id),
    ) ?? 0;
  const budgeted =
    useSheetValue<'envelope-budget' | 'tracking-budget', 'budget'>(
      isTracking
        ? trackingBudget.catBudgeted(id)
        : envelopeBudget.catBudgeted(id),
    ) ?? 0;
  const goal = useSheetValue<'envelope-budget' | 'tracking-budget', 'goal'>(
    isTracking ? trackingBudget.catGoal(id) : envelopeBudget.catGoal(id),
  );
  const longGoal = useSheetValue<
    'envelope-budget' | 'tracking-budget',
    'long-goal'
  >(
    isTracking
      ? trackingBudget.catLongGoal(id)
      : envelopeBudget.catLongGoal(id),
  );

  const status = getCategoryStatus({
    spent,
    balance,
    budgeted,
    goal: isGoalTemplatesEnabled ? goal : null,
    isLongGoal: longGoal === 1,
  });

  const money = (value: number) => format(value, 'financial');
  let text: string;
  let color: string = theme.pageTextLight;
  switch (status.kind) {
    case 'overspent':
      text = t('Overspent by {{amount}}', { amount: money(status.amount) });
      color = theme.budgetNumberNegative;
      break;
    case 'needs-money':
      text = t('{{amount}} more needed', { amount: money(status.amount) });
      color = theme.warningText;
      break;
    case 'spending':
      text = t('Spent {{spent}} of {{available}}', {
        spent: money(status.spent),
        available: money(status.available),
      });
      break;
    case 'untouched':
      text = t('Nothing spent yet');
      break;
    default:
      text = t('No money assigned');
  }

  return (
    <PrivacyFilter>
      <Text
        style={{
          ...styles.verySmallText,
          ...styles.tnum,
          color,
        }}
      >
        {text}
      </Text>
    </PrivacyFilter>
  );
}

export type CategoryStatus =
  | { kind: 'overspent'; amount: number }
  | { kind: 'needs-money'; amount: number }
  | { kind: 'spending'; spent: number; available: number }
  | { kind: 'untouched' }
  | { kind: 'empty' };

/**
 * Amounts are integer sheet values. `spent` is the category's sum-amount
 * (negative when money went out); `balance` is its leftover.
 */
export function getCategoryStatus({
  spent,
  balance,
  budgeted,
  goal,
  isLongGoal,
}: {
  spent: number;
  balance: number;
  budgeted: number;
  goal: number | null | undefined;
  isLongGoal: boolean;
}): CategoryStatus {
  if (balance < 0) {
    return { kind: 'overspent', amount: -balance };
  }

  if (goal != null && goal > 0) {
    const funded = isLongGoal ? balance : budgeted;
    if (funded < goal) {
      return { kind: 'needs-money', amount: goal - funded };
    }
  }

  const used = -spent;
  if (used > 0) {
    return { kind: 'spending', spent: used, available: balance + used };
  }

  return balance > 0 ? { kind: 'untouched' } : { kind: 'empty' };
}
