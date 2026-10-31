import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { SvgInformationCircle } from '@actual-app/components/icons/v2';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';

type HelpHintProps = {
  /** Short explanation shown in the tooltip (hover) and popover (click/tap). */
  children: ReactNode;
  /** Optional bold heading inside the popover. */
  title?: ReactNode;
  /** Accessible name for the trigger. Defaults to "Help". */
  label?: string;
};

// Hover only exists on pointer devices; on touch the tap opens the popover.
const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover)').matches === true;

/**
 * Small (i) button that explains the thing next to it.
 *
 * - Mouse: hovering shows a tooltip, clicking pins a popover.
 * - Keyboard: focusable, Enter/Space opens the popover.
 * - Touch: tapping opens the popover; tap outside or Escape closes it.
 */
export function HelpHint({ children, title, label }: HelpHintProps) {
  const { t } = useTranslation();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const trigger = (
    <Button
      ref={triggerRef}
      variant="bare"
      aria-label={label ?? t('Help')}
      aria-expanded={isOpen}
      onPress={() => setIsOpen(open => !open)}
      style={{
        color: theme.pageTextSubdued,
        padding: 2,
        minHeight: 'auto',
      }}
    >
      <SvgInformationCircle style={{ width: 12, height: 12 }} />
    </Button>
  );

  return (
    <>
      {canHover() ? (
        <Tooltip
          content={
            <View style={{ maxWidth: 260, lineHeight: 1.4 }}>{children}</View>
          }
          placement="top"
          triggerProps={{ isDisabled: isOpen }}
        >
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}

      <Popover
        triggerRef={triggerRef}
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        style={{ maxWidth: 260, padding: 12 }}
      >
        <View style={{ gap: 4, userSelect: 'text' }}>
          {title && <Text style={{ fontWeight: 600 }}>{title}</Text>}
          <View style={{ lineHeight: 1.4 }}>{children}</View>
        </View>
      </Popover>
    </>
  );
}
