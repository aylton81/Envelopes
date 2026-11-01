import React from 'react';
import { Trans } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import type { AccountEntity } from '@actual-app/core/types/models';

import { getAccountTypeGroup, isCreditAccount } from '#accounts/accountTypes';
import { useAccounts } from '#hooks/useAccounts';
import { useNavigate } from '#hooks/useNavigate';
import { usePayees } from '#hooks/usePayees';
import { useSheetValue } from '#hooks/useSheetValue';
import { accountBalance } from '#spreadsheet/bindings';

type PayBillButtonProps = {
  account: AccountEntity;
};

/**
 * Starts a new transaction that pays a credit card bill: a transfer of the
 * amount owed from a cash account (checking first) into the card.
 */
export function PayBillButton({ account }: PayBillButtonProps) {
  const navigate = useNavigate();
  const { data: accounts = [] } = useAccounts();
  const { data: payees = [] } = usePayees();
  const balance =
    useSheetValue<'account', 'balance'>(accountBalance(account.id)) ?? 0;

  const bill = -balance;
  const transferPayee = payees.find(
    payee => payee.transfer_acct === account.id,
  );
  const openCashAccounts = accounts.filter(
    candidate =>
      candidate.closed === 0 &&
      candidate.id !== account.id &&
      !isCreditAccount(candidate) &&
      getAccountTypeGroup(candidate) === 'cash',
  );
  const fromAccount =
    openCashAccounts.find(candidate => candidate.type === 'checking') ??
    openCashAccounts[0];

  return (
    <Button
      variant="primary"
      isDisabled={bill <= 0 || !transferPayee}
      onPress={() =>
        navigate('/transactions/new', {
          state: {
            accountId: fromAccount?.id,
            payeeId: transferPayee?.id,
            // Money leaves the paying account.
            amount: -bill,
          },
        })
      }
      style={{ minWidth: 160 }}
    >
      <Trans>Pay bill</Trans>
    </Button>
  );
}
