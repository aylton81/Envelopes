import { useTranslation } from 'react-i18next';

import type { Theme } from '@actual-app/core/types/prefs';

import { MobileSheet } from '#components/mobile/MobileSheet';
import { MobileSheetRow } from '#components/mobile/MobileSheetRow';
import { MobileSheetSection } from '#components/mobile/MobileSheetSection';
import { useLocalPref } from '#hooks/useLocalPref';
import type { Modal as ModalType } from '#modals/modalsSlice';
import { useTheme } from '#style';

type BudgetPageMenuModalProps = Extract<
  ModalType,
  { name: 'budget-page-menu' }
>['options'];

export function BudgetPageMenuModal({
  onAddCategoryGroup,
  onToggleHiddenCategories,
  onSwitchBudgetFile,
}: BudgetPageMenuModalProps) {
  const { t } = useTranslation();
  const [showHiddenCategories] = useLocalPref('budget.showHiddenCategories');
  const [currentTheme, switchTheme] = useTheme();

  const themeChoices: Array<[Theme, string]> = [
    ['dark', t('Dark')],
    ['light', t('Light')],
    ['midnight', t('Midnight')],
    ['auto', t('System default')],
  ];

  return (
    <MobileSheet name="budget-page-menu" title={t('Budget')}>
      {({ close }) => (
        <>
          <MobileSheetSection title={t('Actions')}>
            <MobileSheetRow
              label={t('Add category group')}
              onPress={onAddCategoryGroup}
            />
            <MobileSheetRow
              label={
                showHiddenCategories
                  ? t('Hide hidden categories')
                  : t('Show hidden categories')
              }
              onPress={onToggleHiddenCategories}
            />
            <MobileSheetRow
              label={t('Switch budget file')}
              onPress={() => {
                close();
                onSwitchBudgetFile();
              }}
            />
          </MobileSheetSection>
          <MobileSheetSection title={t('Theme')}>
            {themeChoices.map(([value, label]) => (
              <MobileSheetRow
                key={value}
                label={label}
                isSelected={currentTheme === value}
                onPress={() => switchTheme(value)}
              />
            ))}
          </MobileSheetSection>
        </>
      )}
    </MobileSheet>
  );
}
