/**
 * CityHeader component for city detail page header.
 * Displays city identification info and salary as hero metric.
 */

import Link from 'next/link';
import { formatMoney } from '@/lib/currency';
import type { CityWithMetrics, Region } from '@/types';

export interface CityHeaderProps {
  /** City data with metrics */
  city: CityWithMetrics;
}

/**
 * Returns the appropriate badge styles for a region.
 */
function getRegionBadgeStyles(region: Region): string {
  switch (region) {
    case 'cis':
      return 'bg-amber-100 text-amber-800';
    case 'eu':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Returns the display name for a region.
 */
function getRegionLabel(region: Region): string {
  switch (region) {
    case 'cis':
      return 'CIS';
    case 'eu':
      return 'EU';
    default:
      return 'Other';
  }
}

/**
 * Header component for city detail pages.
 * Shows city name, country, region badge, and average salary as a hero metric.
 */
export function CityHeader({ city }: CityHeaderProps) {
  const formattedSalary = formatMoney(
    city.metrics.salary.average,
    city.currency.code,
    true
  );

  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
      >
        <span className="mr-1">←</span> Back to map
      </Link>

      {/* Header content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* City identification */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{city.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg text-gray-600">{city.country}</span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRegionBadgeStyles(city.region)}`}
            >
              {getRegionLabel(city.region)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Prices in {city.currency.name} ({city.currency.symbol})
          </p>
        </div>

        {/* Salary hero metric */}
        <div className="text-center md:text-right">
          <span className="text-sm text-gray-600">Average Net Salary</span>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {formattedSalary}
          </p>
          <span className="text-sm text-gray-500">per month</span>
        </div>
      </div>
    </div>
  );
}
