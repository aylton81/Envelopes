import { send } from '@actual-app/core/platform/client/connection';
import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';
import { getUpcomingDays } from '@actual-app/core/shared/schedules';
import type {
  RuleActionEntity,
  RuleConditionEntity,
  ScheduleEntity,
  TransactionEntity,
} from '@actual-app/core/types/models';
import {
  addMonths,
  addWeeks,
  addYears,
  format as formatDate,
  parseISO,
} from 'date-fns';

export function isFutureTransaction(transaction: TransactionEntity): boolean {
  const today = monthUtils.currentDay();
  return transaction.date > today;
}

export function calculateFutureTransactionInfo(
  transaction: TransactionEntity,
  upcomingLength: string,
) {
  const today = monthUtils.currentDay();
  const upcomingDays = getUpcomingDays(upcomingLength, today);
  const daysUntilTransaction = monthUtils.differenceInCalendarDays(
    transaction.date,
    today,
  );
  const isBeyondWindow = daysUntilTransaction > upcomingDays;

  return { isBeyondWindow, daysUntilTransaction, upcomingDays };
}

export async function createSingleTimeScheduleFromTransaction(
  transaction: TransactionEntity,
): Promise<ScheduleEntity['id']> {
  const formattedDate = monthUtils.format(transaction.date, 'MMM dd, yyyy');
  const timestamp = Date.now();
  return createScheduleFromTransaction(
    transaction,
    { op: 'is', field: 'date', value: transaction.date },
    `Auto-created future transaction (${formattedDate}) - ${timestamp}`,
  );
}

export type RepeatFrequency = 'weekly' | 'monthly' | 'yearly';

/** The date one period after `date` (yyyy-MM-dd). */
export function nextOccurrence(date: string, frequency: RepeatFrequency) {
  const parsed = parseISO(date);
  const next =
    frequency === 'weekly'
      ? addWeeks(parsed, 1)
      : frequency === 'monthly'
        ? addMonths(parsed, 1)
        : addYears(parsed, 1);
  return formatDate(next, 'yyyy-MM-dd');
}

/**
 * Turns a transaction the user just entered into a repeating schedule that
 * starts with the next occurrence, so today's transaction is not doubled.
 * The schedule keeps the transaction's payee, account, amount, category
 * and notes, and is named after the payee.
 */
export async function createRecurringScheduleFromTransaction(
  transaction: TransactionEntity,
  frequency: RepeatFrequency,
  name: string | undefined,
): Promise<ScheduleEntity['id']> {
  return createScheduleFromTransaction(
    transaction,
    {
      op: 'isapprox',
      field: 'date',
      value: {
        start: nextOccurrence(transaction.date, frequency),
        frequency,
        interval: 1,
        patterns: [],
        skipWeekend: false,
        weekendSolveMode: 'after',
        endMode: 'never',
      },
    },
    name,
  );
}

async function createScheduleFromTransaction(
  transaction: TransactionEntity,
  dateCondition: RuleConditionEntity,
  name: string | undefined,
): Promise<ScheduleEntity['id']> {
  const conditions: RuleConditionEntity[] = [dateCondition];

  const actions: RuleActionEntity[] = [];

  if (transaction.amount != null) {
    conditions.push({ op: 'is', field: 'amount', value: transaction.amount });
  }
  if (transaction.payee != null && transaction.payee !== '') {
    conditions.push({ op: 'is', field: 'payee', value: transaction.payee });
  }
  if (transaction.account != null && transaction.account !== '') {
    conditions.push({ op: 'is', field: 'account', value: transaction.account });
  }

  if (transaction.is_parent && transaction.subtransactions) {
    if (transaction.notes) {
      actions.push({
        op: 'set',
        field: 'notes',
        value: transaction.notes,
        options: {
          splitIndex: 0,
        },
      });
    }

    transaction.subtransactions.forEach((split, index) => {
      const splitIndex = index + 1;

      actions.push({
        op: 'set',
        field: 'payee',
        value: split.payee || null,
        options: {
          splitIndex,
        },
      });

      if (split.amount != null) {
        actions.push({
          op: 'set-split-amount',
          value: split.amount,
          options: {
            splitIndex,
            method: 'fixed-amount',
          },
        });
      }

      if (split.category) {
        actions.push({
          op: 'set',
          field: 'category',
          value: split.category,
          options: {
            splitIndex,
          },
        });
      }

      if (split.notes) {
        actions.push({
          op: 'set',
          field: 'notes',
          value: split.notes,
          options: {
            splitIndex,
          },
        });
      }
    });
  } else {
    if (transaction.category) {
      actions.push({
        op: 'set',
        field: 'category',
        value: transaction.category,
      });
    }

    if (transaction.notes) {
      actions.push({
        op: 'set',
        field: 'notes',
        value: transaction.notes,
      });
    }
  }

  const scheduleId = await send('schedule/create', {
    conditions,
    schedule: {
      posts_transaction: dateCondition.op === 'is',
      ...(name ? { name } : {}),
    },
  });

  if (actions.length > 0) {
    const schedules = await send(
      'query',
      q('schedules').filter({ id: scheduleId }).select('rule').serialize(),
    );

    const ruleId = schedules?.data?.[0]?.rule;

    if (ruleId) {
      const rule = await send('rule-get', { id: ruleId });

      if (rule) {
        const linkScheduleActions = rule.actions.filter(
          (a: RuleActionEntity) => a.op === 'link-schedule',
        );

        await send('rule-update', {
          ...rule,
          actions: [...linkScheduleActions, ...actions],
        });
      }
    }
  }

  return scheduleId;
}
