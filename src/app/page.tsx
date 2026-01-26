'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getCityIndex, getAllCities } from '@/lib/data';

// Dynamic import to avoid SSR hydration mismatch with map coordinates
const WorldMap = dynamic(
  () => import('@/components/Map').then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] bg-blue-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    ),
  }
);

/**
 * Homepage displaying the interactive world map.
 * Users can hover markers for previews and click to navigate to city details.
 */
export default function HomePage() {
  const cityIndex = getCityIndex();
  const cities = getAllCities();
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);

  // Sort cities by rent (cheapest first)
  const sortedByRent = [...cities].sort(
    (a, b) => a.metrics.rent.oneBedroom.usd - b.metrics.rent.oneBedroom.usd
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Global Cost of Living
        </h1>
        <p className="mt-2 text-gray-600">
          Explore purchasing power across {cities.length} cities. Hover on table rows to see location on map.
        </p>
      </div>

      {/* Two-column layout: sticky map + scrollable content */}
      <div className="flex gap-6">
        {/* Sticky Map Section */}
        <div className="w-[400px] flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <WorldMap cities={cityIndex} hoveredCityId={hoveredCityId} height={320} />

              {/* Legend */}
              <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#f59e0b' }}
                  />
                  <span className="text-gray-500 text-xs">CIS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#3b82f6' }}
                  />
                  <span className="text-gray-500 text-xs">EU</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#6b7280' }}
                  />
                  <span className="text-gray-500 text-xs">Other</span>
                </div>
              </div>
            </div>

            {/* Quick Stats under the map */}
            <div className="mt-4 space-y-4">
              {/* Cheapest Rent */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Cheapest Rent (1BR)
                </h3>
                <div className="space-y-1.5">
                  {sortedByRent.slice(0, 5).map((city, i) => (
                    <Link
                      key={city.id}
                      href={`/city/${city.id}`}
                      onMouseEnter={() => setHoveredCityId(city.id)}
                      onMouseLeave={() => setHoveredCityId(null)}
                      className={`flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                        hoveredCityId === city.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-xs w-3">{i + 1}.</span>
                        <span className={hoveredCityId === city.id ? 'text-blue-700' : 'text-gray-900'}>
                          {city.name}
                        </span>
                      </span>
                      <span className="font-medium text-green-600 text-xs">
                        ${city.metrics.rent.oneBedroom.usd}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Highest Salaries */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Highest Salaries
                </h3>
                <div className="space-y-1.5">
                  {[...cities]
                    .sort((a, b) => b.metrics.salary.average.usd - a.metrics.salary.average.usd)
                    .slice(0, 5)
                    .map((city, i) => (
                      <Link
                        key={city.id}
                        href={`/city/${city.id}`}
                        onMouseEnter={() => setHoveredCityId(city.id)}
                        onMouseLeave={() => setHoveredCityId(null)}
                        className={`flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                          hoveredCityId === city.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-xs w-3">{i + 1}.</span>
                          <span className={hoveredCityId === city.id ? 'text-blue-700' : 'text-gray-900'}>
                            {city.name}
                          </span>
                        </span>
                        <span className="font-medium text-blue-600 text-xs">
                          ${city.metrics.salary.average.usd.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-w-0">
          {/* Cost Comparison Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cost Comparison</h2>
          <p className="text-sm text-gray-500 mt-1">Monthly costs in USD (sorted by rent)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1BR Rent
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2BR Rent
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groceries
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fast Food
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Salary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedByRent.map((city, index) => (
                <tr
                  key={city.id}
                  onMouseEnter={() => setHoveredCityId(city.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                  className={`transition-colors cursor-pointer ${
                    hoveredCityId === city.id
                      ? 'bg-blue-50'
                      : index % 2 === 0
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50/50 hover:bg-gray-100'
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/city/${city.id}`}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <span className={`font-medium ${hoveredCityId === city.id ? 'text-blue-700' : 'text-gray-900'}`}>
                        {city.name}
                      </span>
                      <span className="text-gray-500 text-sm">{city.country}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-900 font-medium">
                      ${city.metrics.rent.oneBedroom.usd.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-700">
                      ${city.metrics.rent.twoBedroom.usd.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-700">
                      ${city.metrics.food.groceries.usd.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-700">
                      ${city.metrics.food.restaurantMeal.usd}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-700">
                      ${city.metrics.food.fastFood.usd}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${
                      city.metrics.salary.average.usd >= 3000
                        ? 'text-green-600'
                        : city.metrics.salary.average.usd >= 1500
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}>
                      ${city.metrics.salary.average.usd.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
