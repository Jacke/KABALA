'use client';

/**
 * RankingsTable component for displaying sortable city rankings.
 * Shows key metrics: salary, rent, and property prices.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatMoney } from '@/lib/currency';
import type { CityWithMetrics, Region } from '@/types';
import { RankingsFilters } from './RankingsFilters';

export interface RankingsTableProps {
  /** Array of cities to display in the table */
  cities: CityWithMetrics[];
}

type SortField = 'name' | 'salary' | 'rent' | 'property';
type SortDirection = 'asc' | 'desc';

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
 * Sort indicator component.
 */
function SortIndicator({
  field,
  currentField,
  direction,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}) {
  if (field !== currentField) {
    return <span className="ml-1 text-gray-300">↕</span>;
  }
  return (
    <span className="ml-1 text-blue-600">
      {direction === 'asc' ? '▲' : '▼'}
    </span>
  );
}

/**
 * Sortable rankings table showing cities with key metrics.
 */
export function RankingsTable({ cities }: RankingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('salary');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredCities = useMemo(() => {
    if (selectedRegion === 'all') return cities;
    return cities.filter((city) => city.region === selectedRegion);
  }, [cities, selectedRegion]);

  const sortedCities = useMemo(() => {
    const sorted = [...filteredCities].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'salary':
          comparison =
            a.metrics.salary.average.usd - b.metrics.salary.average.usd;
          break;
        case 'rent':
          comparison =
            a.metrics.rent.oneBedroom.usd - b.metrics.rent.oneBedroom.usd;
          break;
        case 'property':
          comparison =
            a.metrics.property.cityCenter.usd -
            b.metrics.property.cityCenter.usd;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredCities, sortField, sortDirection]);

  if (cities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No cities to display</div>
    );
  }

  return (
    <div className="space-y-4">
      <RankingsFilters
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        cityCount={filteredCities.length}
      />

      {filteredCities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No cities match the selected filter
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('name')}
            >
              <span className="flex items-center">
                City
                <SortIndicator
                  field="name"
                  currentField={sortField}
                  direction={sortDirection}
                />
              </span>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('salary')}
            >
              <span className="flex items-center justify-end">
                Avg. Salary
                <SortIndicator
                  field="salary"
                  currentField={sortField}
                  direction={sortDirection}
                />
              </span>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('rent')}
            >
              <span className="flex items-center justify-end">
                1BR Rent
                <SortIndicator
                  field="rent"
                  currentField={sortField}
                  direction={sortDirection}
                />
              </span>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('property')}
            >
              <span className="flex items-center justify-end">
                Property/sqm
                <SortIndicator
                  field="property"
                  currentField={sortField}
                  direction={sortDirection}
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedCities.map((city) => (
            <tr
              key={city.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div>
                    <Link
                      href={`/city/${city.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {city.name}
                    </Link>
                    <span className="text-gray-500 text-sm ml-1">
                      {city.country}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-xs font-medium rounded ${getRegionBadgeStyles(city.region)}`}
                  >
                    {getRegionLabel(city.region)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatMoney(city.metrics.salary.average, city.currency.code, true)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatMoney(city.metrics.rent.oneBedroom, city.currency.code, true)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatMoney(city.metrics.property.cityCenter, city.currency.code, true)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
}
