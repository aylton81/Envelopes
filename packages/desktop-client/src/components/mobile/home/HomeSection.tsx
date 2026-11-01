import React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { SvgCheveronRight } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type HomeSectionProps = {
  title: ReactNode;
  onMore?: () => void;
  children: ReactNode;
};

/** A titled, edge-to-edge block on the Home screen. */
export function HomeSection({ title, onMore, children }: HomeSectionProps) {
  const { t } = useTranslation();
  return (
    <View style={{ marginTop: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px 8px',
        }}
      >
        <Text
          role="heading"
          aria-level={2}
          style={{
            fontFamily: styles.serifFont,
            fontSize: 19,
            fontWeight: 500,
            color: theme.pageText,
          }}
        >
          {title}
        </Text>
        {onMore && (
          <Button
            variant="bare"
            aria-label={t('See all')}
            onPress={onMore}
            style={{ color: theme.pageTextLight, padding: 4 }}
          >
            <SvgCheveronRight width={14} height={14} />
          </Button>
        )}
      </View>
      <View
        style={{
          backgroundColor: theme.tableBackground,
          borderTop: `1px solid ${theme.tableBorder}`,
          borderBottom: `1px solid ${theme.tableBorder}`,
        }}
      >
        {children}
      </View>
    </View>
  );
}
