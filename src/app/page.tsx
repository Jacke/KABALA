'use client';

import { WorldMap } from '@/components/Map';
import { getCityIndex } from '@/lib/data';

/**
 * Homepage displaying the interactive world map.
 * Users can hover markers for previews and click to navigate to city details.
 */
export default function HomePage() {
  const cities = getCityIndex();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Global Cost of Living
        </h1>
        <p className="mt-2 text-gray-600">
          Explore purchasing power across cities. Hover for a preview, click to
          view details.
        </p>
      </div>

      {/* Map container */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <WorldMap cities={cities} />

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#f59e0b' }}
            />
            <span className="text-gray-500">CIS</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#3b82f6' }}
            />
            <span className="text-gray-500">EU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
