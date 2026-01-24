'use client';

/**
 * HistoricalCharts component for displaying historical trends on city pages.
 */

import { TrendChart, InflationChart } from '@/components/Charts';
import type { HistoricalMetrics } from '@/types';

export interface HistoricalChartsProps {
  /** Historical data for the city */
  historical: HistoricalMetrics;
  /** City name for display */
  cityName: string;
}

/**
 * Section displaying historical charts for a city.
 */
export function HistoricalCharts({
  historical,
  cityName,
}: HistoricalChartsProps) {
  const hasSalaryData = historical.averageSalary && historical.averageSalary.length > 0;
  const hasRentData = historical.rentOneBedroom && historical.rentOneBedroom.length > 0;
  const hasPropertyData = historical.propertyPrice && historical.propertyPrice.length > 0;
  const hasInflationData = historical.inflation && historical.inflation.length > 0;

  const hasAnyData = hasSalaryData || hasRentData || hasPropertyData || hasInflationData;

  if (!hasAnyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Historical Trends in {cityName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasSalaryData && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TrendChart
              data={historical.averageSalary!}
              title="Average Salary (USD)"
              color="#2563eb"
              height={180}
            />
          </div>
        )}

        {hasRentData && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TrendChart
              data={historical.rentOneBedroom!}
              title="1BR Rent (USD)"
              color="#7c3aed"
              height={180}
            />
          </div>
        )}

        {hasPropertyData && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <TrendChart
              data={historical.propertyPrice!}
              title="Property Price per sqm (USD)"
              color="#059669"
              height={180}
            />
          </div>
        )}

        {hasInflationData && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <InflationChart data={historical.inflation!} height={180} />
          </div>
        )}
      </div>
    </div>
  );
}
