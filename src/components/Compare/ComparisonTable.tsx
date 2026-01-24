'use client';

/**
 * ComparisonTable component for side-by-side city metric comparison.
 * Supports 2+ cities with optional home base for relative comparisons.
 */

import { formatMoney } from '@/lib/currency';
import type { CityWithMetrics, MoneyAmount } from '@/types';

export interface ComparisonTableProps {
  /** Cities to compare (2 or more) */
  cities: CityWithMetrics[];
  /** Optional home base city ID for relative comparisons */
  homeBaseId?: string | null;
}

/**
 * Calculate the difference between two values.
 */
function calculateDiff(base: number, compare: number): { diff: number; percent: number } {
  const diff = compare - base;
  const percent = base !== 0 ? ((compare - base) / base) * 100 : 0;
  return { diff, percent };
}

/**
 * Get styling for difference based on whether lower or higher is better.
 */
function getDiffStyle(percent: number, lowerIsBetter: boolean): string {
  if (Math.abs(percent) < 1) return 'text-gray-400';
  const isGood = lowerIsBetter ? percent < 0 : percent > 0;
  return isGood ? 'text-green-600' : 'text-red-600';
}

/**
 * Format the difference display with arrow and percentage.
 */
function formatDiff(percent: number): string {
  if (Math.abs(percent) < 1) return '~0%';
  const arrow = percent > 0 ? '↑' : '↓';
  return `${arrow}${Math.abs(percent).toFixed(0)}%`;
}

interface MetricRowProps {
  label: string;
  subtitle?: string;
  cities: CityWithMetrics[];
  getValue: (city: CityWithMetrics) => MoneyAmount;
  lowerIsBetter?: boolean;
  homeBaseId?: string | null;
}

/**
 * Single row in the comparison table.
 */
function MetricRow({
  label,
  subtitle,
  cities,
  getValue,
  lowerIsBetter = true,
  homeBaseId,
}: MetricRowProps) {
  const homeBase = homeBaseId ? cities.find((c) => c.id === homeBaseId) : null;
  const homeValue = homeBase ? getValue(homeBase).usd : null;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
        <span>{label}</span>
        {subtitle && (
          <span className="block text-xs text-gray-500">{subtitle}</span>
        )}
      </td>
      {cities.map((city) => {
        const value = getValue(city);
        const showDiff = homeValue !== null && city.id !== homeBaseId;
        const { percent } = showDiff
          ? calculateDiff(homeValue, value.usd)
          : { percent: 0 };
        const diffStyle = getDiffStyle(percent, lowerIsBetter);

        return (
          <td key={city.id} className="px-4 py-3 text-right tabular-nums">
            <span>{formatMoney(value, city.currency.code, true)}</span>
            {showDiff && (
              <span className={`block text-xs ${diffStyle}`}>
                {formatDiff(percent)}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

/**
 * Section header row in the comparison table.
 */
function SectionHeader({
  title,
  colSpan,
}: {
  title: string;
  colSpan: number;
}) {
  return (
    <tr className="bg-gray-100">
      <td colSpan={colSpan} className="px-4 py-2 font-semibold text-gray-700">
        {title}
      </td>
    </tr>
  );
}

/**
 * Multi-city comparison table.
 */
export function ComparisonTable({ cities, homeBaseId }: ComparisonTableProps) {
  if (cities.length < 2) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select at least two cities to compare
      </div>
    );
  }

  const colSpan = cities.length + 1;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
            >
              Metric
            </th>
            {cities.map((city) => (
              <th
                key={city.id}
                scope="col"
                className={`px-4 py-3 text-right text-sm font-semibold ${
                  city.id === homeBaseId
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-900'
                }`}
              >
                {city.name}
                {city.id === homeBaseId && (
                  <span className="block text-xs font-normal text-blue-600">
                    Home Base
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {/* Income Section */}
          <SectionHeader title="Income" colSpan={colSpan} />
          <MetricRow
            label="Average Salary"
            subtitle="net monthly"
            cities={cities}
            getValue={(c) => c.metrics.salary.average}
            lowerIsBetter={false}
            homeBaseId={homeBaseId}
          />

          {/* Rent Section */}
          <SectionHeader title="Rent (Monthly)" colSpan={colSpan} />
          <MetricRow
            label="1 Bedroom"
            cities={cities}
            getValue={(c) => c.metrics.rent.oneBedroom}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="2 Bedroom"
            cities={cities}
            getValue={(c) => c.metrics.rent.twoBedroom}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="3 Bedroom"
            cities={cities}
            getValue={(c) => c.metrics.rent.threeBedroom}
            homeBaseId={homeBaseId}
          />

          {/* Property Section */}
          <SectionHeader title="Property (per sqm)" colSpan={colSpan} />
          <MetricRow
            label="City Center"
            cities={cities}
            getValue={(c) => c.metrics.property.cityCenter}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Outside Center"
            cities={cities}
            getValue={(c) => c.metrics.property.outside}
            homeBaseId={homeBaseId}
          />

          {/* Food Section */}
          <SectionHeader title="Food" colSpan={colSpan} />
          <MetricRow
            label="Groceries"
            subtitle="monthly"
            cities={cities}
            getValue={(c) => c.metrics.food.groceries}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Restaurant Meal"
            subtitle="mid-range"
            cities={cities}
            getValue={(c) => c.metrics.food.restaurantMeal}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Fast Food"
            subtitle="combo meal"
            cities={cities}
            getValue={(c) => c.metrics.food.fastFood}
            homeBaseId={homeBaseId}
          />

          {/* Transport Section */}
          <SectionHeader title="Transport" colSpan={colSpan} />
          <MetricRow
            label="Monthly Pass"
            subtitle="public transit"
            cities={cities}
            getValue={(c) => c.metrics.transport.monthlyPass}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Gasoline"
            subtitle="per liter"
            cities={cities}
            getValue={(c) => c.metrics.transport.gasoline}
            homeBaseId={homeBaseId}
          />

          {/* Utilities Section */}
          <SectionHeader title="Utilities" colSpan={colSpan} />
          <MetricRow
            label="Basic"
            subtitle="electricity, heating, water"
            cities={cities}
            getValue={(c) => c.metrics.utilities.basic}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Internet"
            subtitle="60+ Mbps"
            cities={cities}
            getValue={(c) => c.metrics.utilities.internet}
            homeBaseId={homeBaseId}
          />

          {/* Lifestyle Section */}
          <SectionHeader title="Lifestyle" colSpan={colSpan} />
          <MetricRow
            label="Gym Membership"
            subtitle="monthly"
            cities={cities}
            getValue={(c) => c.metrics.lifestyle.gymMembership}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Cinema"
            subtitle="one ticket"
            cities={cities}
            getValue={(c) => c.metrics.lifestyle.cinema}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Cappuccino"
            cities={cities}
            getValue={(c) => c.metrics.lifestyle.cappuccino}
            homeBaseId={homeBaseId}
          />

          {/* Healthcare Section */}
          <SectionHeader title="Healthcare" colSpan={colSpan} />
          <MetricRow
            label="Doctor Visit"
            subtitle="general practitioner"
            cities={cities}
            getValue={(c) => c.metrics.healthcare.doctorVisit}
            homeBaseId={homeBaseId}
          />
          <MetricRow
            label="Medications"
            subtitle="basic monthly"
            cities={cities}
            getValue={(c) => c.metrics.healthcare.medicationBasic}
            homeBaseId={homeBaseId}
          />
        </tbody>
      </table>
    </div>
  );
}
