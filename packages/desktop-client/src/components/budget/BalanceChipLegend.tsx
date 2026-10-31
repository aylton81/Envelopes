import type { ReactNode } from 'react';
import { Trans } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { radius } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';

import { useFeatureFlag } from '#hooks/useFeatureFlag';

function ChipSample({ color }: { color: string }) {
  return (
    <View
      aria-hidden
      style={{
        width: 28,
        height: 14,
        flexShrink: 0,
        borderRadius: radius.pill,
        backgroundColor: `color-mix(in srgb, ${color} 30%, transparent)`,
        border: `1px solid ${color}`,
      }}
    />
  );
}

function LegendRow({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <ChipSample color={color} />
      <Text>{children}</Text>
    </View>
  );
}

/** Explains what the colored pill around a category balance means. */
export function BalanceChipLegend({ intro }: { intro: ReactNode }) {
  const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');

  return (
    <View style={{ gap: 6 }}>
      <Text>{intro}</Text>
      <LegendRow color={theme.budgetNumberNegative}>
        <Trans>Red: overspent</Trans>
      </LegendRow>
      <LegendRow color={theme.budgetNumberPositive}>
        <Trans>Gray: money left to spend</Trans>
      </LegendRow>
      {isGoalTemplatesEnabled && (
        <>
          <LegendRow color={theme.templateNumberFunded}>
            <Trans>Green: goal funded</Trans>
          </LegendRow>
          <LegendRow color={theme.templateNumberUnderFunded}>
            <Trans>Yellow: goal not fully funded</Trans>
          </LegendRow>
        </>
      )}
    </View>
  );
}
