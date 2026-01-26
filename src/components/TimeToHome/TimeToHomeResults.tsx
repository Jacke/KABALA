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
    if (years < 1) return 'Already affordable!';
    // Cap at 999 years for display but always show actual number
    const cappedYears = Math.min(years, 999);
    const y = Math.floor(cappedYears);
    if (y >= 100) return `${y} years`;
    const m = Math.round((cappedYears - y) * 12);
    if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
    return `${y}y ${m}m`;
  };

  const formatAge = (ageVal: number): string => {
    // Show actual age even if > 150 to be dramatic
    if (ageVal === Infinity) return '999+';
    return Math.round(Math.min(ageVal, 999)).toString();
  };

  const getStatusColor = (years: number): string => {
    if (years >= 200) return 'text-red-600 animate-pulse';
    if (years >= 100) return 'text-red-500';
    if (years >= 50) return 'text-red-400';
    if (years > 30) return 'text-orange-400';
    if (years > 15) return 'text-yellow-400';
    if (years > 5) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getLifetimeMessage = (years: number, currentAge: number): string | null => {
    const ageAtPurchase = currentAge + years;
    if (ageAtPurchase > 200) return '💀 Multiple lifetimes required';
    if (ageAtPurchase > 120) return '⚰️ You won\'t live to see this';
    if (ageAtPurchase > 90) return '👴 Only if you live very long';
    if (ageAtPurchase > 70) return '🧓 Retirement age purchase';
    return null;
  };

  const getExtremeExplanation = (years: number, monthlyContribution: number, inflationRate: number, propertyGrowthRate: number): string | null => {
    if (years < 100) return null;

    const effectiveGrowth = propertyGrowthRate - inflationRate;
    if (effectiveGrowth > 0 && monthlyContribution * 12 < effectiveGrowth * 10000) {
      return `Property prices grow ${propertyGrowthRate.toFixed(1)}%/year while inflation is ${inflationRate.toFixed(1)}%. Your savings are being outpaced — you're chasing a moving target that runs faster than you.`;
    }
    if (years >= 500) {
      return `At this rate, even your great-great-great-grandchildren wouldn't own this property. The math simply doesn't work.`;
    }
    if (years >= 200) {
      return `This timeline exceeds average human lifespan twice over. Without drastic changes, this property is mathematically impossible for you.`;
    }
    return `With current inflation trends, property prices will double every ${(72 / propertyGrowthRate).toFixed(0)} years while your savings struggle to keep up.`;
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

  const worstResult = Math.max(...results.map(r => r.yearsWithInflation));
  const isHopeless = worstResult > 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {isHopeless ? '💀 ' : ''}Results for {city.name}, {city.country}
        </h3>
        <span className="text-sm text-gray-400">Your age: {age}</span>
      </div>

      {/* Warning Banner for extreme cases */}
      {isHopeless && (
        <div className="p-4 bg-gradient-to-r from-red-950 to-black border-2 border-red-700 rounded-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="text-3xl">☠️</div>
            <div>
              <p className="text-red-400 font-bold text-lg">REALITY CHECK</p>
              <p className="text-red-300/80 text-sm">
                At your current savings rate, you would need {Math.round(worstResult)} years to afford property here.
                That&apos;s beyond a human lifetime. Consider different cities or drastically increasing income.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inflation Info Banner */}
      <div className="p-4 bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-red-400 text-xl">⚠️</div>
          <div>
            <p className="text-red-300 font-medium">The cruel reality of inflation</p>
            <p className="text-red-200/70 text-sm mt-1">
              Inflation: <strong className="text-red-400">{results[0]?.inflationRate.toFixed(1)}%</strong>/year |
              Property growth: <strong className="text-red-400">{results[0]?.propertyGrowthRate.toFixed(1)}%</strong>/year
            </p>
            <p className="text-red-200/40 text-xs mt-1">
              Source: {source.source} (Updated: {source.lastUpdated})
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => {
          const isExtreme = result.yearsWithInflation > 100;
          const lifetimeMsg = getLifetimeMessage(result.yearsWithInflation, age);

          return (
          <div
            key={result.propertyType}
            className={`p-6 rounded-xl border ${
              isExtreme
                ? 'bg-gradient-to-br from-red-950/80 to-black border-red-700'
                : result.affordable
                ? 'bg-gray-900/70 border-gray-700'
                : 'bg-red-950/40 border-red-800/50'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Property Info */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {isExtreme && '💸 '}{result.propertyLabel}
                </h4>
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
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dream scenario</p>
                  <p className={`text-2xl font-bold ${getStatusColor(result.yearsWithoutInflation)}`}>
                    {formatYears(result.yearsWithoutInflation)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Age: {formatAge(result.ageAtPurchaseNoInflation)}
                  </p>
                </div>

                {/* With Inflation - THE REALITY */}
                <div className="text-center relative">
                  <div className={`${isExtreme ? 'animate-pulse' : ''}`}>
                    <p className="text-xs uppercase tracking-wider mb-1 font-black">
                      <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                        ⚡ REALITY ⚡
                      </span>
                    </p>
                    <p className={`text-3xl font-black ${getStatusColor(result.yearsWithInflation)} ${isExtreme ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}>
                      {formatYears(result.yearsWithInflation)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Age: <span className={isExtreme ? 'text-red-400 font-bold' : ''}>{formatAge(result.ageAtPurchaseWithInflation)}</span>
                  </p>
                  {getDifferenceIndicator(result.yearsWithoutInflation, result.yearsWithInflation)}
                </div>
              </div>
            </div>

            {/* Extreme value explanation */}
            {isExtreme && (
              <div className="mt-4 pt-4 border-t border-red-900/50 bg-red-950/30 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔬</span>
                  <div>
                    <p className="text-red-300 font-semibold text-sm mb-1">Why so long?</p>
                    <p className="text-red-200/70 text-sm">
                      {getExtremeExplanation(result.yearsWithInflation, 2000, result.inflationRate, result.propertyGrowthRate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lifetime warning */}
            {lifetimeMsg && !isExtreme && (
              <div className="mt-4 pt-4 border-t border-red-800/50">
                <p className="text-red-400 font-medium">
                  {lifetimeMsg}
                </p>
              </div>
            )}

            {/* Warning for unaffordable */}
            {!result.affordable && !lifetimeMsg && !isExtreme && (
              <div className="mt-4 pt-4 border-t border-red-800/50">
                <p className="text-red-400 text-sm">
                  Property prices are growing faster than your savings. You&apos;re running backwards on a treadmill.
                </p>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Harsh Reality Tips */}
      <div className="p-5 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-bold mb-3 flex items-center gap-2">
          <span>🔥</span> Escape routes from this nightmare
        </h4>
        <ul className="text-gray-400 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-500">💰</span>
            <span>Double your income — cutting years in half sounds better than it looks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">🏃</span>
            <span>Move to a cheaper city — some places have 5x lower prices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">📉</span>
            <span>Wait for a housing crash — but don&apos;t hold your breath</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">🎰</span>
            <span>Win the lottery — statistically more likely than some of these timelines</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">👨‍👩‍👧‍👦</span>
            <span>Rich parents? Inheritance? That&apos;s how most people do it anyway</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
