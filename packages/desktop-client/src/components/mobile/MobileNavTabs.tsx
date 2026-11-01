import React from 'react';
import type { ComponentType, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';

import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import {
  SvgAdd,
  SvgCreditCard,
  SvgHome,
  SvgPiggyBank,
  SvgReports,
  SvgWallet,
} from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { useNavigate } from '#hooks/useNavigate';

const BAR_HEIGHT = 64;

/** Height the fixed tab bar takes at the bottom of mobile pages. */
export const MOBILE_NAV_HEIGHT = BAR_HEIGHT;

/**
 * Extra bottom space for scrolling lists on pages with the floating add
 * button, so the last row can scroll clear of it.
 */
export const MOBILE_FAB_CLEARANCE = 84;

// Pages where the floating "add transaction" button is offered.
const ADD_BUTTON_PATHS = ['/home', '/budget', '/transactions', '/accounts'];

/**
 * Fixed bottom tab bar: five destinations, always visible, no drag sheet.
 * Settings live in each page's overflow (three dots) menu instead.
 */
export function MobileNavTabs() {
  const { t } = useTranslation();
  const { isNarrowWidth } = useResponsive();
  const location = useLocation();

  if (!isNarrowWidth) {
    return null;
  }

  const navTabs = [
    { name: t('Home'), path: '/home', Icon: SvgHome },
    { name: t('Budget'), path: '/budget', Icon: SvgWallet },
    { name: t('Transactions'), path: '/transactions', Icon: SvgCreditCard },
    { name: t('Accounts'), path: '/accounts', Icon: SvgPiggyBank },
    { name: t('Reports'), path: '/reports', Icon: SvgReports },
  ];

  const showAddButton = ADD_BUTTON_PATHS.includes(location.pathname);

  return (
    <>
      {showAddButton && <AddTransactionFab />}
      <nav
        data-navbar-state="default"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'row',
          height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom))`,
          paddingBottom: 'env(safe-area-inset-bottom)',
          backgroundColor: theme.mobileNavBackground,
          borderTop: `1px solid ${theme.tableBorder}`,
        }}
      >
        {navTabs.map(tab => (
          <NavTab key={tab.path} {...tab} />
        ))}
      </nav>
    </>
  );
}

function AddTransactionFab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      variant="primary"
      aria-label={t('Add transaction')}
      onPress={() => navigate('/transactions/new')}
      style={{
        position: 'fixed',
        right: 16,
        bottom: `calc(${BAR_HEIGHT + 16}px + env(safe-area-inset-bottom))`,
        zIndex: 101,
        width: 52,
        height: 52,
        padding: 0,
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <SvgAdd width={20} height={20} />
    </Button>
  );
}

type NavTabIconProps = {
  width: number;
  height: number;
  style?: CSSProperties;
};

type NavTabProps = {
  name: string;
  path: string;
  Icon: ComponentType<NavTabIconProps>;
};

function NavTab({ Icon: TabIcon, name, path }: NavTabProps) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        ...styles.noTapHighlight,
        flex: '1 1 20%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        fontSize: 12,
        textDecoration: 'none',
        userSelect: 'none',
        color: isActive ? theme.mobileNavItemSelected : theme.mobileNavItem,
      })}
    >
      <TabIcon width={20} height={20} style={{ flexShrink: 0 }} />
      <View
        style={{
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </View>
    </NavLink>
  );
}
