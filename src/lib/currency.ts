/**
 * Currency formatting utilities for displaying monetary values.
 * Uses Intl.NumberFormat for proper locale-aware formatting.
 */

import type { MoneyAmount } from '@/types';

/**
 * Currency code to locale mapping for proper formatting.
 * Uses locales where the currency is native for best formatting.
 */
const currencyLocales: Record<string, string> = {
  EUR: 'de-DE',
  USD: 'en-US',
  RUB: 'ru-RU',
  GEL: 'ka-GE',
};

/**
 * Get the appropriate locale for a currency code.
 * Falls back to en-US if currency not mapped.
 */
function getLocaleForCurrency(currencyCode: string): string {
  return currencyLocales[currencyCode] || 'en-US';
}

/**
 * Format a MoneyAmount for display.
 * @param amount - The MoneyAmount to format (local + USD)
 * @param currencyCode - ISO 4217 currency code (e.g., "EUR", "RUB")
 * @param showBoth - If true, shows both local and USD values
 * @returns Formatted string (e.g., "€3,500" or "€3,500 ($3,800)")
 */
export function formatMoney(
  amount: MoneyAmount,
  currencyCode: string,
  showBoth = false
): string {
  const locale = getLocaleForCurrency(currencyCode);
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const localFormatted = formatter.format(amount.local);

  if (!showBoth) {
    return localFormatted;
  }

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${localFormatted} (${usdFormatter.format(amount.usd)})`;
}

/**
 * Format a number with currency symbol.
 * @param value - The numeric value to format
 * @param currencyCode - ISO 4217 currency code (e.g., "EUR", "USD")
 * @returns Formatted currency string (e.g., "€1,500", "$2,000")
 */
export function formatCurrency(value: number, currencyCode: string): string {
  const locale = getLocaleForCurrency(currencyCode);
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });

  return formatter.format(value);
}

/**
 * Format a decimal value as a percentage with sign.
 * @param value - The value as a decimal or percentage (0.054 or 5.4)
 * @returns Formatted percentage string with sign (e.g., "+5.4%", "-2.1%")
 */
export function formatPercent(value: number): string {
  // Assume values >= 1 or <= -1 are already percentages, otherwise multiply by 100
  const percentValue = Math.abs(value) < 1 ? value * 100 : value;
  const sign = percentValue >= 0 ? '+' : '';
  return `${sign}${percentValue.toFixed(1)}%`;
}
