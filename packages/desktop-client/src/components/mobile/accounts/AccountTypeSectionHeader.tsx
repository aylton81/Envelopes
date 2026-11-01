import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  SvgCreditCard,
  SvgHome,
  SvgReports,
  SvgWallet,
} from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import type { AccountEntity } from '@actual-app/core/types/models';

import { getAccountTypeGroupLabel } from '#accounts/accountTypes';
import type { AccountTypeGroup } from '#accounts/accountTypes';
import { CellValue, CellValueText } from '#components/spreadsheet/CellValue';
import { accountTypeGroupBalance } from '#spreadsheet/bindings';

const GROUP_ICONS = {
  cash: SvgWallet,
  credit: SvgCreditCard,
  loans: SvgHome,
  tracking: SvgReports,
} as const;

type AccountTypeSectionHeaderProps = {
  group: AccountTypeGroup;
  accountIds: ReadonlyArray<AccountEntity['id']>;
};

/** Section label for one kind of account, with the section's total. */
export function AccountTypeSectionHeader({
  group,
  accountIds,
}: AccountTypeSectionHeaderProps) {
  const { t } = useTranslation();
  const Icon = GROUP_ICONS[group];

  return (
    <View
      role="heading"
      aria-level={2}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: '20px 16px 8px',
        color: theme.pageTextLight,
      }}
    >
      <Icon width={14} height={14} style={{ flexShrink: 0 }} />
      <Text style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
        {getAccountTypeGroupLabel(t, group)}
      </Text>
      <CellValue<'account', `account-group-balance-${string}`>
        binding={accountTypeGroupBalance(group, accountIds)}
        type="financial"
      >
        {props => (
          <CellValueText<'account', `account-group-balance-${string}`>
            {...props}
            style={{ ...styles.tnum, fontSize: 13, fontWeight: 600 }}
          />
        )}
      </CellValue>
    </View>
  );
}
