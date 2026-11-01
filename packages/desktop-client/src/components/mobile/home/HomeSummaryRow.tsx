import React from 'react';
import type { ReactNode } from 'react';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

/** Label on the left, figure on the right, hairline below. */
export function HomeSummaryRow({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
        padding: '0 16px',
        borderBottom: `1px solid ${theme.tableBorder}`,
      }}
    >
      <Text style={{ fontSize: 15, color: theme.pageText }}>{label}</Text>
      <View style={{ fontSize: 15 }}>{children}</View>
    </View>
  );
}
