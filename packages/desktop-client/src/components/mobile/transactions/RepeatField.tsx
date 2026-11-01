import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import type { RepeatFrequency } from '#util/schedule-actions';

export type RepeatChoice = 'never' | RepeatFrequency;

type RepeatFieldProps = {
  value: RepeatChoice;
  onChange: (value: RepeatChoice) => void;
};

/**
 * Segmented choice on the new-transaction form: leave it at "No" for a
 * one-off, or pick how often it comes back to schedule the next ones.
 */
export function RepeatField({ value, onChange }: RepeatFieldProps) {
  const { t } = useTranslation();
  const options: Array<[RepeatChoice, string]> = [
    ['never', t('No')],
    ['weekly', t('Weekly')],
    ['monthly', t('Monthly')],
    ['yearly', t('Yearly')],
  ];

  return (
    <View
      role="group"
      aria-label={t('Repeat')}
      style={{
        flexDirection: 'row',
        border: `1px solid ${theme.formInputBorder}`,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {options.map(([choice, label], index) => {
        const isSelected = value === choice;
        return (
          <Button
            key={choice}
            variant="bare"
            aria-pressed={isSelected}
            onPress={() => onChange(choice)}
            style={{
              flex: 1,
              minHeight: 40,
              borderRadius: 0,
              borderLeft:
                index === 0 ? 'none' : `1px solid ${theme.formInputBorder}`,
              backgroundColor: isSelected
                ? theme.buttonPrimaryBackground
                : theme.formInputBackground,
              color: isSelected ? theme.buttonPrimaryText : theme.formInputText,
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {label}
          </Button>
        );
      })}
    </View>
  );
}
