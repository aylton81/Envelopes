import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Saved, ToBudget } from '#components/mobile/budget/BudgetTable';
import {
  MOBILE_FAB_CLEARANCE,
  MOBILE_NAV_HEIGHT,
} from '#components/mobile/MobileNavTabs';
import { MobileOverflowMenu } from '#components/mobile/MobileOverflowMenu';
import { MobilePageHeader, Page } from '#components/Page';
import { CellValue, CellValueText } from '#components/spreadsheet/CellValue';
import { useNavigate } from '#hooks/useNavigate';
import { SheetNameProvider } from '#hooks/useSheetName';
import { useSyncedPref } from '#hooks/useSyncedPref';
import { allAccountBalance, envelopeBudget } from '#spreadsheet/bindings';

import { HomeMonthSummary } from './HomeMonthSummary';
import { HomeSection } from './HomeSection';
import { HomeSummaryRow } from './HomeSummaryRow';
import { HomeUpcomingSchedules } from './HomeUpcomingSchedules';

/**
 * The "Home" tab: what needs attention this month at a glance, each part
 * leading to the screen where it is handled.
 */
export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [budgetType = 'envelope'] = useSyncedPref('budgetType');
  const month = monthUtils.currentMonth();

  return (
    <Page
      header={
        <MobilePageHeader
          title={t('Home')}
          rightContent={<MobileOverflowMenu />}
        />
      }
      padding={0}
    >
      <View style={{ paddingBottom: MOBILE_NAV_HEIGHT + MOBILE_FAB_CLEARANCE }}>
        {/* Budget figures read from the current month's sheet. */}
        <SheetNameProvider name={monthUtils.sheetForMonth(month)}>
          {budgetType === 'tracking' ? (
            <Saved projected onPress={() => navigate('/budget')} />
          ) : (
            <ToBudget
              toBudget={envelopeBudget.toBudget}
              onPress={() => navigate('/budget')}
            />
          )}

          <HomeSection title={<Trans>This month</Trans>}>
            <HomeMonthSummary isTracking={budgetType === 'tracking'} />
          </HomeSection>
        </SheetNameProvider>

        <HomeSection
          title={<Trans>Upcoming</Trans>}
          onMore={() => navigate('/transactions')}
        >
          <HomeUpcomingSchedules />
        </HomeSection>

        <HomeSection
          title={<Trans>All accounts</Trans>}
          onMore={() => navigate('/accounts')}
        >
          <HomeSummaryRow label={t('Balance')}>
            <CellValue<'account', 'accounts-balance'>
              binding={allAccountBalance()}
              type="financial"
            >
              {props => (
                <CellValueText<'account', 'accounts-balance'>
                  {...props}
                  style={{ ...styles.tnum, fontWeight: 600 }}
                />
              )}
            </CellValue>
          </HomeSummaryRow>
        </HomeSection>
      </View>
    </Page>
  );
}
