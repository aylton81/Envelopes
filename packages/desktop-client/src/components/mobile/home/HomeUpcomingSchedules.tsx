import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';
import type { ScheduleEntity } from '@actual-app/core/types/models';

import { PrivacyFilter } from '#components/PrivacyFilter';
import { StatusBadge } from '#components/schedules/StatusBadge';
import { useFormat } from '#hooks/useFormat';
import { useLocale } from '#hooks/useLocale';
import { usePayees } from '#hooks/usePayees';
import { useSchedules } from '#hooks/useSchedules';

const UPCOMING_LIMIT = 3;

export function scheduleAmount(amount: ScheduleEntity['_amount']) {
  return typeof amount === 'number'
    ? amount
    : Math.round((amount.num1 + amount.num2) / 2);
}

/** The next few scheduled payments, soonest first. */
export function HomeUpcomingSchedules() {
  const { t } = useTranslation();
  const format = useFormat();
  const locale = useLocale();
  const { data: payees = [] } = usePayees();
  const { schedules = [], statuses } = useSchedules({
    query: useMemo(() => q('schedules').select('*'), []),
  });

  const upcoming = schedules
    .filter(schedule => !schedule.completed && schedule.next_date)
    .sort((a, b) => a.next_date.localeCompare(b.next_date))
    .slice(0, UPCOMING_LIMIT);

  if (upcoming.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.pageTextLight }}>
          <Trans>Nothing scheduled</Trans>
        </Text>
      </View>
    );
  }

  return (
    <>
      {upcoming.map(schedule => {
        const payeeName = payees.find(p => p.id === schedule._payee)?.name;
        const status = statuses.get(schedule.id);
        return (
          <View
            key={schedule.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              minHeight: 56,
              padding: '8px 16px',
              borderBottom: `1px solid ${theme.tableBorder}`,
            }}
          >
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text style={{ ...styles.ellipsisText, fontSize: 15 }}>
                {schedule.name || payeeName || t('Unnamed schedule')}
              </Text>
              <Text style={{ fontSize: 12, color: theme.pageTextLight }}>
                {monthUtils.format(schedule.next_date, 'd MMM', locale)}
              </Text>
            </View>
            {status && status !== 'scheduled' && (
              <StatusBadge status={status} />
            )}
            <PrivacyFilter>
              <Text style={{ ...styles.tnum, fontWeight: 600 }}>
                {format(scheduleAmount(schedule._amount), 'financial')}
              </Text>
            </PrivacyFilter>
          </View>
        );
      })}
    </>
  );
}
