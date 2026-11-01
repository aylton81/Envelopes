import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import {
  SvgCheveronDown,
  SvgCheveronRight,
} from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type ScheduledToggleProps = {
  count: number;
  isCollapsed: boolean;
  onToggle: () => void;
};

/**
 * Header bar above a transaction list that folds the upcoming scheduled
 * payments away, so the list can open straight on what already happened.
 */
export function ScheduledToggle({
  count,
  isCollapsed,
  onToggle,
}: ScheduledToggleProps) {
  const { t } = useTranslation();
  const Chevron = isCollapsed ? SvgCheveronRight : SvgCheveronDown;

  return (
    <Button
      variant="bare"
      aria-expanded={!isCollapsed}
      aria-label={
        isCollapsed
          ? t('Show scheduled transactions')
          : t('Hide scheduled transactions')
      }
      onPress={onToggle}
      style={{
        width: '100%',
        justifyContent: 'flex-start',
        gap: 8,
        padding: '12px 16px',
        borderRadius: 0,
        borderBottom: `1px solid ${theme.tableBorder}`,
        backgroundColor: theme.tableBackground,
      }}
    >
      <Chevron width={14} height={14} style={{ color: theme.pageTextLight }} />
      <Text
        style={{
          fontFamily: styles.serifFont,
          fontSize: 17,
          fontWeight: 500,
          color: theme.pageText,
        }}
      >
        <Trans>Scheduled</Trans>
      </Text>
      <View
        style={{
          ...styles.tnum,
          minWidth: 20,
          padding: '0 6px',
          borderRadius: 2,
          fontSize: 12,
          lineHeight: '20px',
          textAlign: 'center',
          color: theme.pageText,
          backgroundColor: theme.pillBackground,
        }}
      >
        {count}
      </View>
    </Button>
  );
}
