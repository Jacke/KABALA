'use client';

/**
 * Compare page for side-by-side city comparison.
 * Supports 2+ cities with optional home base for relative comparisons.
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCityById, getCityIndex } from '@/lib/data';
import { CitySelector, ComparisonTable } from '@/components/Compare';
import type { CityWithMetrics } from '@/types';

const MAX_CITIES = 5;

/**
 * City chip component for displaying selected cities.
 */
function CityChip({
  city,
  isHomeBase,
  onRemove,
  onSetHome,
}: {
  city: CityWithMetrics;
  isHomeBase: boolean;
  onRemove: () => void;
  onSetHome: () => void;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
        isHomeBase
          ? 'bg-blue-100 text-blue-800 border border-blue-300'
          : 'bg-gray-100 text-gray-800 border border-gray-200'
      }`}
    >
      <span className="font-medium">{city.name}</span>
      <span className="text-gray-500">{city.country}</span>
      {!isHomeBase && (
        <button
          type="button"
          onClick={onSetHome}
          className="text-gray-400 hover:text-blue-600 text-xs"
          title="Set as home base"
        >
          🏠
        </button>
      )}
      {isHomeBase && (
        <span className="text-xs text-blue-600" title="Home base">
          🏠
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-600"
        title="Remove city"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Inner component that uses useSearchParams.
 */
function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [homeBaseId, setHomeBaseId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const cityIndex = getCityIndex();
  const validCityIds = useMemo(
    () => new Set(cityIndex.map((c) => c.id)),
    [cityIndex]
  );

  // Initialize from URL on mount
  useEffect(() => {
    const citiesParam = searchParams.get('cities');
    const homeParam = searchParams.get('home');

    if (citiesParam) {
      const ids = citiesParam
        .split(',')
        .filter((id) => validCityIds.has(id))
        .slice(0, MAX_CITIES);
      setSelectedCityIds(ids);

      if (homeParam && ids.includes(homeParam)) {
        setHomeBaseId(homeParam);
      }
    }
    setIsInitialized(true);
  }, [searchParams, validCityIds]);

  // Update URL when state changes
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (selectedCityIds.length > 0) {
      params.set('cities', selectedCityIds.join(','));
    }
    if (homeBaseId && selectedCityIds.includes(homeBaseId)) {
      params.set('home', homeBaseId);
    }

    const newUrl = selectedCityIds.length > 0 ? `/compare?${params.toString()}` : '/compare';
    router.replace(newUrl, { scroll: false });
  }, [selectedCityIds, homeBaseId, isInitialized, router]);

  // Get full city data for selected cities
  const selectedCities = useMemo(() => {
    return selectedCityIds
      .map((id) => getCityById(id))
      .filter((city): city is CityWithMetrics => city !== undefined);
  }, [selectedCityIds]);

  const addCity = (cityId: string) => {
    if (cityId && !selectedCityIds.includes(cityId) && selectedCityIds.length < MAX_CITIES) {
      setSelectedCityIds([...selectedCityIds, cityId]);
    }
  };

  const removeCity = (cityId: string) => {
    setSelectedCityIds(selectedCityIds.filter((id) => id !== cityId));
    if (homeBaseId === cityId) {
      setHomeBaseId(null);
    }
  };

  const clearAll = () => {
    setSelectedCityIds([]);
    setHomeBaseId(null);
  };

  const availableCities = cityIndex.filter(
    (city) => !selectedCityIds.includes(city.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compare Cities</h1>
        <p className="text-gray-600 mt-2">
          Select cities to compare their cost of living metrics. Set a home base
          to see relative differences.
        </p>
      </div>

      {/* Selected cities chips */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedCities.map((city) => (
            <CityChip
              key={city.id}
              city={city}
              isHomeBase={city.id === homeBaseId}
              onRemove={() => removeCity(city.id)}
              onSetHome={() => setHomeBaseId(city.id)}
            />
          ))}
          {selectedCities.length > 1 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-600 ml-2"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Add city selector */}
      {selectedCityIds.length < MAX_CITIES && (
        <div className="max-w-xs">
          <CitySelector
            cities={availableCities}
            selectedId={null}
            onChange={addCity}
            label={
              selectedCities.length === 0
                ? 'Select first city'
                : 'Add another city'
            }
          />
        </div>
      )}

      {/* Info about max cities */}
      {selectedCityIds.length >= MAX_CITIES && (
        <p className="text-sm text-amber-600">
          Maximum of {MAX_CITIES} cities can be compared at once.
        </p>
      )}

      {/* Home base info */}
      {selectedCities.length >= 2 && !homeBaseId && (
        <p className="text-sm text-gray-500">
          Tip: Click 🏠 on a city to set it as your home base and see relative
          differences.
        </p>
      )}

      {/* Comparison table or empty state */}
      {selectedCities.length >= 2 ? (
        <ComparisonTable cities={selectedCities} homeBaseId={homeBaseId} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {selectedCities.length === 0
              ? 'Select cities above to start comparing'
              : 'Select at least one more city to compare'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compare page wrapper with Suspense for useSearchParams.
 */
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Cities</h1>
            <p className="text-gray-600 mt-2">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
