import React, { useCallback, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgCheveronRight } from '@actual-app/components/icons/v1';
import { SvgViewShow } from '@actual-app/components/icons/v2';
import { Label } from '@actual-app/components/label';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';
import type {
  CategoryEntity,
  CategoryGroupEntity,
} from '@actual-app/core/types/models';
import { AutoTextSize } from 'auto-text-size';

import { BalanceChipLegend } from '#components/budget/BalanceChipLegend';
import { HelpHint } from '#components/common/HelpHint';
import {
  MOBILE_FAB_CLEARANCE,
  MOBILE_NAV_HEIGHT,
} from '#components/mobile/MobileNavTabs';
import { PullToRefresh } from '#components/mobile/PullToRefresh';
import { PrivacyFilter } from '#components/PrivacyFilter';
import { CellValue } from '#components/spreadsheet/CellValue';
import { SchedulesProvider } from '#hooks/useCachedSchedules';
import { useFormat } from '#hooks/useFormat';
import { useLocalPref } from '#hooks/useLocalPref';
import { useSheetValue } from '#hooks/useSheetValue';
import { useSyncedPref } from '#hooks/useSyncedPref';
import type { Binding } from '#spreadsheet';
import { envelopeBudget, trackingBudget } from '#spreadsheet/bindings';

import { ExpenseGroupList } from './ExpenseGroupList';
import { IncomeGroup } from './IncomeGroup';

export const ROW_HEIGHT = 50;

export const PILL_STYLE: CSSProperties = {
  borderRadius: 2,
  color: theme.pillText,
  // Amounts read as plain figures; only the balance carries a tinted chip.
  backgroundColor: 'transparent',
};

export function getColumnWidth({
  show3Columns = false,
  isSidebar = false,
  offset = 0,
}: {
  show3Columns?: boolean;
  isSidebar?: boolean;
  offset?: number;
} = {}) {
  // If show3Columns = 35vw | 20vw | 20vw | 20vw,
  // Else = 45vw | 25vw | 25vw,
  if (!isSidebar) {
    return show3Columns ? `${20 + offset}vw` : `${25 + offset}vw`;
  }
  return show3Columns ? `${35 + offset}vw` : `${45 + offset}vw`;
}

type BandProps = {
  label: string;
  amount: ReactNode;
  tone: 'positive' | 'neutral' | 'negative' | 'warning';
  onPress: () => void;
};

/**
 * Full-width band at the top of the mobile budget that answers the first
 * question of every visit: how much money still needs a job.
 */
function SummaryBand({ label, amount, tone, onPress }: BandProps) {
  const toneColor = {
    positive: theme.toBudgetPositive,
    neutral: theme.budgetNumberNeutral,
    negative: theme.toBudgetNegative,
    warning: theme.warningText,
  }[tone];

  return (
    <Button
      variant="bare"
      onPress={onPress}
      style={{
        width: '100%',
        borderRadius: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        backgroundColor:
          tone === 'neutral'
            ? theme.pageBackground
            : `color-mix(in srgb, ${toneColor} 12%, ${theme.pageBackground})`,
        borderTop: `1px solid ${theme.tableBorder}`,
        borderBottom: `1px solid ${theme.tableBorder}`,
      }}
    >
      <PrivacyFilter>
        <Text
          style={{
            ...styles.tnum,
            fontFamily: styles.serifFont,
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.1,
            color: toneColor,
          }}
        >
          {amount}
        </Text>
      </PrivacyFilter>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 14, color: theme.pageText }}>{label}</Text>
        <SvgCheveronRight
          style={{ flexShrink: 0, color: theme.pageTextSubdued }}
          width={14}
          height={14}
        />
      </View>
    </Button>
  );
}

type ToBudgetProps = {
  toBudget: Binding<'envelope-budget', 'to-budget'>;
  onPress: () => void;
};

export function ToBudget({ toBudget, onPress }: ToBudgetProps) {
  const { t } = useTranslation();
  const amount = useSheetValue(toBudget) ?? 0;
  const format = useFormat();

  return (
    <SummaryBand
      label={amount < 0 ? t('Overbudgeted') : t('To Budget')}
      amount={format(amount, 'financial')}
      tone={amount < 0 ? 'negative' : amount > 0 ? 'positive' : 'neutral'}
      onPress={onPress}
    />
  );
}

type SavedProps = {
  projected: boolean;
  onPress: () => void;
};

export function Saved({ projected, onPress }: SavedProps) {
  const { t } = useTranslation();
  const binding = projected
    ? trackingBudget.totalBudgetedSaved
    : trackingBudget.totalSaved;

  const saved = useSheetValue<'tracking-budget', typeof binding>(binding) || 0;
  const format = useFormat();
  const isNegative = saved < 0;

  return (
    <SummaryBand
      label={
        projected
          ? t('Projected savings')
          : isNegative
            ? t('Overspent')
            : t('Saved')
      }
      amount={format(saved, 'financial')}
      tone={projected ? 'warning' : isNegative ? 'negative' : 'neutral'}
      onPress={onPress}
    />
  );
}

type BudgetGroupsProps = {
  type: string;
  categoryGroups: CategoryGroupEntity[];
  onEditCategoryGroup: (id: CategoryGroupEntity['id']) => void;
  onEditCategory: (id: CategoryEntity['id']) => void;
  month: string;
  onBudgetAction: (month: string, action: string, args: unknown) => void;
  showBudgetedColumn: boolean;
  show3Columns: boolean;
  showHiddenCategories: boolean;
};

function BudgetGroups({
  categoryGroups,
  onEditCategoryGroup,
  onEditCategory,
  month,
  onBudgetAction,
  showBudgetedColumn,
  show3Columns,
  showHiddenCategories,
}: BudgetGroupsProps) {
  const { incomeGroup, expenseGroups } = useMemo(() => {
    const categoryGroupsToDisplay = categoryGroups.filter(
      group => !group.hidden || showHiddenCategories,
    );
    return {
      incomeGroup: categoryGroupsToDisplay.find(group => group.is_income),
      expenseGroups: categoryGroupsToDisplay.filter(group => !group.is_income),
    };
  }, [categoryGroups, showHiddenCategories]);

  const [collapsedGroupIds = [], setCollapsedGroupIdsPref] =
    useLocalPref('budget.collapsed');

  const onToggleCollapse = useCallback(
    (id: CategoryGroupEntity['id']) => {
      setCollapsedGroupIdsPref(
        collapsedGroupIds.includes(id)
          ? collapsedGroupIds.filter(collapsedId => collapsedId !== id)
          : [...collapsedGroupIds, id],
      );
    },
    [collapsedGroupIds, setCollapsedGroupIdsPref],
  );

  const isCollapsed = useCallback(
    (id: CategoryGroupEntity['id']) => {
      return collapsedGroupIds.includes(id);
    },
    [collapsedGroupIds],
  );

  return (
    <View
      data-testid="budget-groups"
      style={{ flex: '1 0 auto', overflowY: 'auto', paddingBottom: 15 }}
    >
      <ExpenseGroupList
        categoryGroups={expenseGroups}
        showBudgetedColumn={showBudgetedColumn}
        month={month}
        onEditCategoryGroup={onEditCategoryGroup}
        onEditCategory={onEditCategory}
        onBudgetAction={onBudgetAction}
        show3Columns={show3Columns}
        showHiddenCategories={showHiddenCategories}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {incomeGroup && (
        <IncomeGroup
          categoryGroup={incomeGroup}
          month={month}
          showHiddenCategories={showHiddenCategories}
          onEditCategoryGroup={onEditCategoryGroup}
          onEditCategory={onEditCategory}
          onBudgetAction={onBudgetAction}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}
    </View>
  );
}

type BudgetTableProps = {
  categoryGroups: CategoryGroupEntity[];
  month: string;
  onShowBudgetSummary: () => void;
  onBudgetAction: (month: string, action: string, args: unknown) => void;
  onRefresh: () => Promise<void>;
  onEditCategoryGroup: (id: CategoryGroupEntity['id']) => void;
  onEditCategory: (id: CategoryEntity['id']) => void;
};

export function BudgetTable({
  categoryGroups,
  month,
  onShowBudgetSummary,
  onBudgetAction,
  onRefresh,
  onEditCategoryGroup,
  onEditCategory,
}: BudgetTableProps) {
  const { width } = useResponsive();
  // Phones show one figure (Budgeted or Spent, toggled) plus the balance.
  const show3Columns = width >= 480;

  // let editMode = false; // neuter editMode -- sorry, not rewriting drag-n-drop right now

  const [showSpentColumn = false, setShowSpentColumnPref] = useLocalPref(
    'mobile.showSpentColumn',
  );

  function toggleSpentColumn() {
    setShowSpentColumnPref(!showSpentColumn);
  }

  const [showHiddenCategories = false] = useLocalPref(
    'budget.showHiddenCategories',
  );

  const [budgetType = 'envelope'] = useSyncedPref('budgetType');

  const schedulesQuery = useMemo(() => q('schedules').select('*'), []);

  return (
    <>
      {budgetType === 'tracking' ? (
        <Saved
          projected={month >= monthUtils.currentMonth()}
          onPress={onShowBudgetSummary}
        />
      ) : (
        <ToBudget
          toBudget={envelopeBudget.toBudget}
          onPress={onShowBudgetSummary}
        />
      )}
      <BudgetTableHeader
        month={month}
        show3Columns={show3Columns}
        showSpentColumn={showSpentColumn}
        toggleSpentColumn={toggleSpentColumn}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <View
          data-testid="budget-table"
          style={{
            backgroundColor: theme.pageBackground,
            minHeight: '100vh',
            paddingBottom: MOBILE_NAV_HEIGHT + MOBILE_FAB_CLEARANCE,
          }}
        >
          <SchedulesProvider query={schedulesQuery}>
            <BudgetGroups
              type={budgetType}
              categoryGroups={categoryGroups}
              showBudgetedColumn={!showSpentColumn}
              show3Columns={show3Columns}
              showHiddenCategories={showHiddenCategories}
              month={month}
              onEditCategoryGroup={onEditCategoryGroup}
              onEditCategory={onEditCategory}
              onBudgetAction={onBudgetAction}
            />
          </SchedulesProvider>
        </View>
      </PullToRefresh>
    </>
  );
}

type BudgetTableHeaderProps = {
  show3Columns: boolean;
  month: string;
  showSpentColumn: boolean;
  toggleSpentColumn: () => void;
};

function BudgetTableHeader({
  show3Columns,
  month,
  showSpentColumn,
  toggleSpentColumn,
}: BudgetTableHeaderProps) {
  const { t } = useTranslation();
  const format = useFormat();
  const [budgetType = 'envelope'] = useSyncedPref('budgetType');
  const buttonStyle = {
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 'unset',
  };
  const sidebarColumnWidth = getColumnWidth({ show3Columns, isSidebar: true });
  const columnWidth = getColumnWidth({ show3Columns });

  const amountStyle: CSSProperties = {
    ...styles.tnum,
    color: theme.budgetNumberNeutral,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '500',
  };

  return (
    <View
      data-testid="budget-table-header"
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        padding: '10px 15px',
        paddingLeft: 10,
        backgroundColor: monthUtils.isCurrentMonth(month)
          ? theme.budgetHeaderCurrentMonth
          : theme.budgetHeaderOtherMonth,
        borderBottomWidth: 1,
        borderColor: theme.tableBorder,
      }}
    >
      <View
        style={{
          width: sidebarColumnWidth,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, color: theme.formInputText }}>
          <Trans>Categories</Trans>
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {(show3Columns || !showSpentColumn) && (
          <CellValue<'envelope-budget' | 'tracking-budget', 'total-budgeted'>
            binding={
              budgetType === 'tracking'
                ? trackingBudget.totalBudgetedExpense
                : envelopeBudget.totalBudgeted
            }
            type="financial"
          >
            {({ type: formatType, value }) => (
              <Button
                variant="bare"
                isDisabled={show3Columns}
                onPress={toggleSpentColumn}
                style={{
                  ...buttonStyle,
                  width: columnWidth,
                }}
              >
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {!show3Columns && (
                      <SvgViewShow
                        width={12}
                        height={12}
                        style={{
                          flexShrink: 0,
                          color: theme.pageTextSubdued,
                          marginRight: 5,
                        }}
                      />
                    )}
                    <View>
                      <AutoTextSize
                        as={Label}
                        minFontSizePx={8}
                        maxFontSizePx={12}
                        mode="multiline"
                        title={t('Budgeted')}
                        style={{ color: theme.formInputText, paddingRight: 4 }}
                      />
                    </View>
                  </View>
                  <View>
                    <PrivacyFilter>
                      <AutoTextSize
                        key={value}
                        as={Text}
                        minFontSizePx={6}
                        maxFontSizePx={12}
                        mode="oneline"
                        style={{
                          ...amountStyle,
                          paddingRight: 4,
                        }}
                      >
                        {format(
                          budgetType === 'tracking' ? value : -value,
                          formatType,
                        )}
                      </AutoTextSize>
                    </PrivacyFilter>
                  </View>
                </View>
              </Button>
            )}
          </CellValue>
        )}
        {(show3Columns || showSpentColumn) && (
          <CellValue<'envelope-budget' | 'tracking-budget', 'total-spent'>
            binding={
              budgetType === 'tracking'
                ? trackingBudget.totalSpent
                : envelopeBudget.totalSpent
            }
            type="financial"
          >
            {({ type, value }) => (
              <Button
                variant="bare"
                isDisabled={show3Columns}
                onPress={toggleSpentColumn}
                style={{
                  ...buttonStyle,
                  width: columnWidth,
                }}
              >
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {!show3Columns && (
                      <SvgViewShow
                        width={12}
                        height={12}
                        style={{
                          flexShrink: 0,
                          color: theme.pageTextSubdued,
                          marginRight: 5,
                        }}
                      />
                    )}
                    <View>
                      <AutoTextSize
                        as={Label}
                        minFontSizePx={6}
                        maxFontSizePx={12}
                        mode="oneline"
                        title={t('Spent')}
                        style={{ color: theme.formInputText, paddingRight: 4 }}
                      />
                    </View>
                  </View>
                  <View>
                    <PrivacyFilter>
                      <AutoTextSize
                        key={value}
                        as={Text}
                        minFontSizePx={6}
                        maxFontSizePx={12}
                        mode="oneline"
                        style={{
                          ...amountStyle,
                          paddingRight: 4,
                        }}
                      >
                        {format(value, type)}
                      </AutoTextSize>
                    </PrivacyFilter>
                  </View>
                </View>
              </Button>
            )}
          </CellValue>
        )}
        <CellValue<'envelope-budget' | 'tracking-budget', 'total-leftover'>
          binding={
            budgetType === 'tracking'
              ? trackingBudget.totalLeftover
              : envelopeBudget.totalBalance
          }
          type="financial"
        >
          {({ type, value }) => (
            <View style={{ width: columnWidth }}>
              <View style={{ flex: 1, alignItems: 'flex-end !important' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AutoTextSize
                    as={Label}
                    minFontSizePx={6}
                    maxFontSizePx={12}
                    mode="oneline"
                    title={t('Balance')}
                    style={{ color: theme.formInputText }}
                  />
                  <HelpHint label={t('Budget table help')}>
                    <BalanceChipLegend
                      intro={
                        <View style={{ gap: 6 }}>
                          <Text>
                            {budgetType === 'tracking' ? (
                              <Trans>
                                Budgeted: your spending target for the month.
                              </Trans>
                            ) : (
                              <Trans>
                                Budgeted: money assigned to the category this
                                month.
                              </Trans>
                            )}
                          </Text>
                          <Text>
                            <Trans>
                              Spent: what you spent this month. The thin bar
                              under each category shows how much is used: gray
                              is on track, yellow is above 85%, red is
                              overspent. Tap the Budgeted or Spent header to
                              switch columns.
                            </Trans>
                          </Text>
                          <Text>
                            <Trans>
                              Balance: what is left to spend. The chip color
                              shows the status:
                            </Trans>
                          </Text>
                        </View>
                      }
                    />
                  </HelpHint>
                </View>
                <View>
                  <PrivacyFilter>
                    <AutoTextSize
                      key={value}
                      as={Text}
                      minFontSizePx={6}
                      maxFontSizePx={12}
                      mode="oneline"
                      style={amountStyle}
                    >
                      {format(value, type)}
                    </AutoTextSize>
                  </PrivacyFilter>
                </View>
              </View>
            </View>
          )}
        </CellValue>
      </View>
    </View>
  );
}
