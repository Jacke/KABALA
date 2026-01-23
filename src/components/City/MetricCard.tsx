/**
 * MetricCard component for displaying a single metric value.
 * Used in city detail pages to show cost of living data.
 */

import { formatMoney } from '@/lib/currency';
import type { MoneyAmount } from '@/types';

export interface MetricCardProps {
  /** Label for the metric (e.g., "1 Bedroom Apartment") */
  label: string;
  /** The monetary value to display */
  value: MoneyAmount;
  /** ISO 4217 currency code (e.g., "EUR", "USD") */
  currencyCode: string;
  /** If true, shows both local currency and USD */
  showBoth?: boolean;
  /** Additional context (e.g., "per month", "per sqm") */
  subtitle?: string;
  /** Size variant for different use cases */
  variant?: 'default' | 'large';
}

/**
 * Displays a single metric with label, formatted value, and optional subtitle.
 * Supports both compact list layout and large highlighted display.
 */
export function MetricCard({
  label,
  value,
  currencyCode,
  showBoth = false,
  subtitle,
  variant = 'default',
}: MetricCardProps) {
  const formattedValue = formatMoney(value, currencyCode, showBoth);

  if (variant === 'large') {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <span className="text-sm text-gray-600 mb-1">{label}</span>
        <span className="text-2xl font-semibold text-gray-900">
          {formattedValue}
        </span>
        {subtitle && (
          <span className="text-sm text-gray-500 mt-1">{subtitle}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <div className="text-right">
        <span className="font-semibold text-gray-900">{formattedValue}</span>
        {subtitle && (
          <span className="block text-sm text-gray-500">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
