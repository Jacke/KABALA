'use client';

/**
 * BudgetResults component for displaying budget conversion results.
 */

import type { CityWithMetrics } from '@/types';
import type { ExpenseState } from './ExpenseForm';

export interface BudgetResultsProps {
  /** Source city (user's current city) */
  sourceCity: CityWithMetrics;
  /** Target city to convert budget to */
  targetCity: CityWithMetrics;
  /** User's expenses in source city */
  expenses: ExpenseState;
}

interface CategoryResult {
  label: string;
  source: number;
  target: number;
  diff: number;
  diffPercent: number;
}

/**
 * Convert an expense based on the ratio between source and target metrics.
 */
function convertExpense(
  amount: number,
  sourceMetric: number,
  targetMetric: number
): number {
  if (sourceMetric === 0 || amount === 0) return amount;
  const ratio = targetMetric / sourceMetric;
  return Math.round(amount * ratio);
}

/**
 * Get color class based on difference (lower is better for expenses).
 */
function getDiffColor(diffPercent: number): string {
  if (Math.abs(diffPercent) < 5) return 'text-gray-500';
  return diffPercent < 0 ? 'text-green-600' : 'text-red-600';
}

/**
 * Format difference with sign and percentage.
 */
function formatDiff(diffPercent: number): string {
  if (Math.abs(diffPercent) < 1) return '~0%';
  const sign = diffPercent > 0 ? '+' : '';
  return `${sign}${diffPercent.toFixed(0)}%`;
}

/**
 * Calculate all category conversions.
 */
function calculateResults(
  sourceCity: CityWithMetrics,
  targetCity: CityWithMetrics,
  expenses: ExpenseState
): CategoryResult[] {
  const s = sourceCity.metrics;
  const t = targetCity.metrics;

  const categories: {
    key: keyof ExpenseState;
    label: string;
    sourceMetric: number;
    targetMetric: number;
  }[] = [
    {
      key: 'rent',
      label: 'Rent',
      sourceMetric: s.rent.oneBedroom.usd,
      targetMetric: t.rent.oneBedroom.usd,
    },
    {
      key: 'groceries',
      label: 'Groceries',
      sourceMetric: s.food.groceries.usd,
      targetMetric: t.food.groceries.usd,
    },
    {
      key: 'diningOut',
      label: 'Dining Out',
      sourceMetric: s.food.restaurantMeal.usd,
      targetMetric: t.food.restaurantMeal.usd,
    },
    {
      key: 'transport',
      label: 'Transport',
      sourceMetric: s.transport.monthlyPass.usd,
      targetMetric: t.transport.monthlyPass.usd,
    },
    {
      key: 'utilities',
      label: 'Utilities',
      sourceMetric: s.utilities.basic.usd,
      targetMetric: t.utilities.basic.usd,
    },
    {
      key: 'internet',
      label: 'Internet',
      sourceMetric: s.utilities.internet.usd,
      targetMetric: t.utilities.internet.usd,
    },
    {
      key: 'mobile',
      label: 'Mobile',
      sourceMetric: s.utilities.mobile.usd,
      targetMetric: t.utilities.mobile.usd,
    },
    {
      key: 'gym',
      label: 'Gym',
      sourceMetric: s.lifestyle.gymMembership.usd,
      targetMetric: t.lifestyle.gymMembership.usd,
    },
    {
      key: 'entertainment',
      label: 'Entertainment',
      sourceMetric: s.lifestyle.cinema.usd,
      targetMetric: t.lifestyle.cinema.usd,
    },
    {
      key: 'healthcare',
      label: 'Healthcare',
      sourceMetric: s.healthcare.medicationBasic.usd,
      targetMetric: t.healthcare.medicationBasic.usd,
    },
  ];

  return categories.map(({ key, label, sourceMetric, targetMetric }) => {
    const source = expenses[key];
    const target = convertExpense(source, sourceMetric, targetMetric);
    const diff = target - source;
    const diffPercent = source > 0 ? ((target - source) / source) * 100 : 0;

    return { label, source, target, diff, diffPercent };
  });
}

/**
 * Display budget conversion results with category breakdown.
 */
export function BudgetResults({
  sourceCity,
  targetCity,
  expenses,
}: BudgetResultsProps) {
  const results = calculateResults(sourceCity, targetCity, expenses);

  const sourceTotal = results.reduce((sum, r) => sum + r.source, 0);
  const targetTotal = results.reduce((sum, r) => sum + r.target, 0);
  const totalDiff = targetTotal - sourceTotal;
  const totalDiffPercent =
    sourceTotal > 0 ? ((targetTotal - sourceTotal) / sourceTotal) * 100 : 0;

  // Find biggest savings and biggest increase
  const sortedByDiff = [...results].sort((a, b) => a.diff - b.diff);
  const biggestSaving = sortedByDiff.find((r) => r.diff < -10);
  const biggestIncrease = sortedByDiff.reverse().find((r) => r.diff > 10);

  // Calculate salary comparison
  const sourceSalary = sourceCity.metrics.salary.average.usd;
  const targetSalary = targetCity.metrics.salary.average.usd;
  const salaryDiffPercent =
    sourceSalary > 0 ? ((targetSalary - sourceSalary) / sourceSalary) * 100 : 0;

  // Purchasing power: how much of salary goes to these expenses
  const sourcePPRatio = sourceTotal / sourceSalary;
  const targetPPRatio = targetTotal / targetSalary;
  const ppImprovement = ((sourcePPRatio - targetPPRatio) / sourcePPRatio) * 100;

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100">
              In {targetCity.name}, you would need
            </p>
            <p className="text-4xl font-bold">
              ${targetTotal.toLocaleString()}
              <span className="text-lg font-normal text-blue-200">/month</span>
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-2xl font-bold ${totalDiffPercent > 0 ? 'text-red-200' : 'text-green-200'}`}
            >
              {totalDiffPercent > 0 ? '↑' : '↓'}{' '}
              {Math.abs(totalDiffPercent).toFixed(0)}%
            </p>
            <p className="text-blue-200">vs {sourceCity.name}</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {biggestSaving && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">Biggest Saving</p>
            <p className="font-semibold text-green-900">
              {biggestSaving.label}
            </p>
            <p className="text-green-700">
              -${Math.abs(biggestSaving.diff).toLocaleString()}/mo
            </p>
          </div>
        )}
        {biggestIncrease && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">Biggest Increase</p>
            <p className="font-semibold text-red-900">
              {biggestIncrease.label}
            </p>
            <p className="text-red-700">
              +${biggestIncrease.diff.toLocaleString()}/mo
            </p>
          </div>
        )}
        <div
          className={`${ppImprovement > 0 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}
        >
          <p
            className={`text-sm ${ppImprovement > 0 ? 'text-blue-700' : 'text-amber-700'}`}
          >
            Purchasing Power
          </p>
          <p
            className={`font-semibold ${ppImprovement > 0 ? 'text-blue-900' : 'text-amber-900'}`}
          >
            {ppImprovement > 0 ? 'Better' : 'Worse'} by{' '}
            {Math.abs(ppImprovement).toFixed(0)}%
          </p>
          <p
            className={`text-sm ${ppImprovement > 0 ? 'text-blue-600' : 'text-amber-600'}`}
          >
            Salary: {salaryDiffPercent > 0 ? '+' : ''}
            {salaryDiffPercent.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {sourceCity.name}
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {targetCity.name}
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.label} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{result.label}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                    ${result.source.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    ${result.target.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-medium ${getDiffColor(result.diffPercent)}`}
                  >
                    {formatDiff(result.diffPercent)}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-3 text-gray-900">Total</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  ${sourceTotal.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  ${targetTotal.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${getDiffColor(totalDiffPercent)}`}
                >
                  {formatDiff(totalDiffPercent)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
