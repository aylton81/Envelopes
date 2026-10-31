import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

import { theme } from './theme';
import { View } from './View';

type CardProps = ComponentProps<typeof View>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <View
        {...props}
        ref={ref}
        style={{
          marginTop: 15,
          marginLeft: 5,
          marginRight: 5,
          borderRadius: 4,
          backgroundColor: theme.cardBackground,
          borderColor: theme.cardBorder,
          boxShadow: `0 0 0 1px ${theme.tableBorder}`,
          ...props.style,
        }}
      >
        <View
          style={{
            borderRadius: props.style?.borderRadius ?? 4,
            overflow: 'hidden',
          }}
        >
          {children}
        </View>
      </View>
    );
  },
);

Card.displayName = 'Card';
