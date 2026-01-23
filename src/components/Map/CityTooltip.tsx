'use client';

/**
 * CityTooltip component for displaying city preview on map hover.
 * Shows city name, country, and average salary in a floating card.
 */

import type { CityWithMetrics, Region } from '@/types';
import { formatMoney } from '@/lib/currency';

/**
 * Props for the CityTooltip component.
 */
interface CityTooltipProps {
  /** City data to display in the tooltip */
  city: CityWithMetrics;
  /** Position for the tooltip (viewport coordinates) */
  position: { x: number; y: number };
}

/**
 * Get the marker color based on the city's region.
 * Matches the colors used in CityMarker component.
 */
function getRegionColor(region: Region): string {
  switch (region) {
    case 'cis':
      return '#f59e0b'; // amber-500
    case 'eu':
      return '#3b82f6'; // blue-500
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get the region display name.
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
 * Floating tooltip component for city preview on map hover.
 * Positioned near the cursor with city information.
 */
export function CityTooltip({ city, position }: CityTooltipProps) {
  const avgSalary = formatMoney(
    city.metrics.salary.average,
    city.currency.code
  );

  return (
    <div
      className="fixed z-50 pointer-events-none min-w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-3 transition-opacity duration-150"
      style={{
        left: position.x + 12,
        top: position.y + 12,
      }}
    >
      {/* City name */}
      <div className="font-semibold text-gray-900">{city.name}</div>

      {/* Country and region indicator */}
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
        <span>{city.country}</span>
        <span className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getRegionColor(city.region) }}
          />
          <span className="text-xs text-gray-500">
            {getRegionLabel(city.region)}
          </span>
        </span>
      </div>

      {/* Average salary */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">Avg. Salary</div>
        <div className="font-medium text-gray-900">{avgSalary}/mo</div>
      </div>
    </div>
  );
}
