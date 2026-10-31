import type { ReactNode } from 'react';

import { Button } from '@actual-app/components/button';
import { SvgCheckmark } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { spacing } from '@actual-app/components/tokens';

type MobileSheetRowProps = {
  label: ReactNode;
  onPress: () => void;
  isDestructive?: boolean;
  /** Marks the row as the current choice in a single-select group. */
  isSelected?: boolean;
};

export function MobileSheetRow({
  label,
  onPress,
  isDestructive = false,
  isSelected,
}: MobileSheetRowProps) {
  return (
    <Button
      variant="bare"
      onPress={onPress}
      aria-pressed={isSelected}
      style={{
        ...styles.mediumText,
        width: '100%',
        minHeight: styles.mobileMinHeight,
        justifyContent: 'space-between',
        gap: spacing.sm,
        padding: `${spacing.sm}px ${spacing.lg}px`,
        borderRadius: 0,
        borderTop: `1px solid ${theme.tooltipBorder}`,
        color: isDestructive ? theme.errorText : theme.pageText,
      }}
    >
      <Text style={{ ...styles.ellipsisText, textAlign: 'left' }}>{label}</Text>
      {isSelected && (
        <SvgCheckmark
          aria-hidden
          style={{
            width: 14,
            height: 14,
            flexShrink: 0,
            color: theme.pageTextPositive,
          }}
        />
      )}
    </Button>
  );
}
