'use client';

import type { TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';
import { getInflationSource } from '@/lib/inflation';

interface TimeToHomeResultsProps {
  results: TimeToHomeResult[];
  city: CityWithMetrics;
  age: number;
}

export function TimeToHomeResults({ results, city, age }: TimeToHomeResultsProps) {
  const source = getInflationSource();

  const formatYears = (years: number): string => {
    if (years === Infinity || years > 99) return 'Never';
    if (years < 1) return 'Already affordable!';
    const y = Math.floor(years);
    const m = Math.round((years - y) * 12);
    if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
    return `${y}y ${m}m`;
  };

  const formatAge = (ageVal: number): string => {
    if (ageVal === Infinity || ageVal > 150) return '-';
    return Math.round(ageVal).toString();
  };

  const getStatusColor = (years: number): string => {
    if (years === Infinity || years > 99) return 'text-red-400';
    if (years > 30) return 'text-orange-400';
    if (years > 15) return 'text-yellow-400';
    if (years > 5) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getDifferenceIndicator = (noInflation: number, withInflation: number) => {
    if (noInflation === Infinity || withInflation === Infinity) return null;
    const diff = withInflation - noInflation;
    const pct = noInflation > 0 ? ((diff / noInflation) * 100).toFixed(0) : 0;
    if (diff <= 0) return null;
    return (
      <span className="text-orange-400 text-sm">
        +{diff.toFixed(1)}y ({pct}% longer)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          Results for {city.name}, {city.country}
        </h3>
        <span className="text-sm text-gray-400">Your age: {age}</span>
      </div>

      {/* Inflation Info Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-amber-400 text-xl">⚠️</div>
          <div>
            <p className="text-amber-200 font-medium">Real-world inflation impact</p>
            <p className="text-amber-200/70 text-sm mt-1">
              Inflation: <strong>{results[0]?.inflationRate.toFixed(1)}%</strong>/year |
              Property growth: <strong>{results[0]?.propertyGrowthRate.toFixed(1)}%</strong>/year
            </p>
            <p className="text-amber-200/50 text-xs mt-1">
              Source: {source.source} (Updated: {source.lastUpdated})
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div
            key={result.propertyType}
            className={`p-6 rounded-xl border ${
              result.affordable
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-red-900/20 border-red-800/50'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Property Info */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">{result.propertyLabel}</h4>
                <p className="text-gray-400 text-sm">
                  {city.currency.symbol}
                  {result.priceLocal.toLocaleString()} ({' '}
                  <span className="text-gray-500">${result.priceUsd.toLocaleString()}</span>)
                </p>
              </div>

              {/* Time Scenarios */}
              <div className="flex gap-6 md:gap-10">
                {/* Without Inflation */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">If prices freeze</p>
                  <p className={`text-2xl font-bold ${getStatusColor(result.yearsWithoutInflation)}`}>
                    {formatYears(result.yearsWithoutInflation)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Age: {formatAge(result.ageAtPurchaseNoInflation)}
                  </p>
                </div>

                {/* With Inflation */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">With inflation</p>
                  <p className={`text-2xl font-bold ${getStatusColor(result.yearsWithInflation)}`}>
                    {formatYears(result.yearsWithInflation)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Age: {formatAge(result.ageAtPurchaseWithInflation)}
                  </p>
                  {getDifferenceIndicator(result.yearsWithoutInflation, result.yearsWithInflation)}
                </div>
              </div>
            </div>

            {/* Warning for unaffordable */}
            {!result.affordable && (
              <div className="mt-4 pt-4 border-t border-red-800/50">
                <p className="text-red-400 text-sm">
                  At current savings rate, this property may never be affordable due to price growth outpacing savings.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <h4 className="text-blue-300 font-medium mb-2">How to reach your goal faster</h4>
        <ul className="text-blue-200/70 text-sm space-y-1">
          <li>• Increase monthly savings by 20% to cut years significantly</li>
          <li>• Consider suburbs — prices can be 30-40% lower</li>
          <li>• Look at cities with lower property growth rates</li>
          <li>• Invest savings to beat inflation (stocks, bonds, index funds)</li>
        </ul>
      </div>
    </div>
  );
}
