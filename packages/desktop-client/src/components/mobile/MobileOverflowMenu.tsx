import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { theme } from '@actual-app/components/theme';

import { useNavigate } from '#hooks/useNavigate';

type OverflowItem = 'settings' | 'help';

/**
 * Three-dots button for the top right of mobile pages. Holds the
 * destinations that do not earn a tab, starting with Settings.
 */
export function MobileOverflowMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onMenuSelect = (item: OverflowItem) => {
    setIsOpen(false);
    if (item === 'settings') {
      void navigate('/settings');
    } else {
      window.open('https://actualbudget.org/docs', '_blank', 'noopener');
    }
  };

  return (
    <>
      <Button
        ref={triggerRef}
        variant="bare"
        aria-label={t('More options')}
        onPress={() => setIsOpen(true)}
        style={{ margin: '10px 6px', color: theme.mobileHeaderText }}
      >
        <SvgDotsHorizontalTriple width={18} height={18} />
      </Button>
      <Popover
        triggerRef={triggerRef}
        placement="bottom end"
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        style={{ minWidth: 200 }}
      >
        <Menu<OverflowItem>
          onMenuSelect={onMenuSelect}
          items={[
            { name: 'settings', text: t('Settings') },
            { name: 'help', text: t('Help') },
          ]}
        />
      </Popover>
    </>
  );
}
