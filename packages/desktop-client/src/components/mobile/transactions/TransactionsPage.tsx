import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { AllAccountTransactions } from '#components/mobile/accounts/AllAccountTransactions';
import { MobileOverflowMenu } from '#components/mobile/MobileOverflowMenu';
import { MobilePageHeader, Page } from '#components/Page';
import { useSyncedPref } from '#hooks/useSyncedPref';

/**
 * The "Transactions" tab: every account's money in and out in one list,
 * with upcoming scheduled payments shown at the top.
 */
export function TransactionsPage() {
  const { t } = useTranslation();
  const [numberFormat = 'comma-dot'] = useSyncedPref('numberFormat');
  const [hideFraction] = useSyncedPref('hideFraction');

  return (
    <Page
      header={
        <MobilePageHeader
          title={t('Transactions')}
          rightContent={<MobileOverflowMenu />}
        />
      }
      padding={0}
    >
      {/* Re-render the list when the number format changes. */}
      <Fragment key={`${numberFormat}${hideFraction}`}>
        <AllAccountTransactions />
      </Fragment>
    </Page>
  );
}
