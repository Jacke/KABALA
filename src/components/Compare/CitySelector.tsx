'use client';

/**
 * CitySelector component for choosing a city from a dropdown.
 * Used in the comparison page to select cities to compare.
 */

import type { CityIndex } from '@/types';

export interface CitySelectorProps {
  /** List of cities to show in dropdown */
  cities: CityIndex[];
  /** Currently selected city ID */
  selectedId: string | null;
  /** Callback when selection changes */
  onChange: (cityId: string) => void;
  /** Label for the selector */
  label: string;
  /** City ID to exclude from options (prevents selecting same city twice) */
  excludeId?: string | null;
}

/**
 * Dropdown selector for choosing a city.
 */
export function CitySelector({
  cities,
  selectedId,
  onChange,
  label,
  excludeId,
}: CitySelectorProps) {
  const availableCities = excludeId
    ? cities.filter((city) => city.id !== excludeId)
    : cities;

  return (
    <div>
      <label
        htmlFor={`city-select-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={`city-select-${label.toLowerCase().replace(/\s+/g, '-')}`}
        value={selectedId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a city...</option>
        {availableCities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
    </div>
  );
}
