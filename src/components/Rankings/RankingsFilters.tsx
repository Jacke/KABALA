'use client';

/**
 * RankingsFilters component for filtering the rankings table.
 * Provides region filter buttons and displays city count.
 */

import type { Region } from '@/types';

export interface RankingsFiltersProps {
  /** Currently selected region filter */
  selectedRegion: Region | 'all';
  /** Callback when region filter changes */
  onRegionChange: (region: Region | 'all') => void;
  /** Number of cities currently displayed */
  cityCount: number;
}

interface FilterButtonProps {
  label: string;
  value: Region | 'all';
  selectedValue: Region | 'all';
  onClick: (value: Region | 'all') => void;
  colorClass: string;
}

function FilterButton({
  label,
  value,
  selectedValue,
  onClick,
  colorClass,
}: FilterButtonProps) {
  const isActive = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-pressed={isActive}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? colorClass
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * Filter controls for the rankings table.
 */
export function RankingsFilters({
  selectedRegion,
  onRegionChange,
  cityCount,
}: RankingsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-1">Filter:</span>
        <FilterButton
          label="All"
          value="all"
          selectedValue={selectedRegion}
          onClick={onRegionChange}
          colorClass="bg-gray-800 text-white"
        />
        <FilterButton
          label="CIS"
          value="cis"
          selectedValue={selectedRegion}
          onClick={onRegionChange}
          colorClass="bg-amber-500 text-white"
        />
        <FilterButton
          label="EU"
          value="eu"
          selectedValue={selectedRegion}
          onClick={onRegionChange}
          colorClass="bg-blue-500 text-white"
        />
      </div>
      <span className="text-sm text-gray-500">
        Showing {cityCount} {cityCount === 1 ? 'city' : 'cities'}
      </span>
    </div>
  );
}
