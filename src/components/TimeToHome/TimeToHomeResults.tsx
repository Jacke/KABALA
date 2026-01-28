'use client';

import type { TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';
import { getInflationSource } from '@/lib/inflation';
import { useLanguage } from '@/contexts/LanguageContext';

// Format price in local currency
function formatLocalPrice(amount: number, currencySymbol: string): string {
  // For currencies with large values (like RUB, JPY, KRW), don't show decimals
  const formatted = amount >= 1000
    ? Math.round(amount).toLocaleString()
    : amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${currencySymbol}${formatted}`;
}

interface TimeToHomeResultsProps {
  results: TimeToHomeResult[];
  city: CityWithMetrics;
  age: number;
}

export function TimeToHomeResults({ results, city, age }: TimeToHomeResultsProps) {
  const source = getInflationSource();
  const { t, locale } = useLanguage();

  const isUnreachable = (years: number): boolean => !isFinite(years);

  const formatYears = (years: number): string => {
    if (years < 1) return t.timeToHome.results.alreadyAffordable;
    if (isUnreachable(years)) return '∞';
    const y = Math.floor(years);
    const m = Math.round((years - y) * 12);
    if (m === 0) return `${y} ${y === 1 ? t.timeToHome.results.year_singular : t.timeToHome.results.years}`;
    return locale === 'ru' ? `${y}г ${m}м` : `${y}y ${m}m`;
  };

  const formatAge = (ageVal: number): string => {
    if (!isFinite(ageVal)) return '—';
    return Math.round(ageVal).toString();
  };

  const getStatusColor = (years: number): string => {
    if (isUnreachable(years)) return 'text-red-500';
    if (years >= 50) return 'text-red-400';
    if (years > 30) return 'text-orange-400';
    if (years > 15) return 'text-yellow-400';
    if (years > 5) return 'text-green-400';
    return 'text-emerald-400';
  };

  const getLifetimeMessage = (years: number, currentAge: number): string | null => {
    if (isUnreachable(years)) return null;
    const ageAtPurchase = currentAge + years;
    if (ageAtPurchase > 90) return `👴 ${t.timeToHome.results.liveVeryLong}`;
    if (ageAtPurchase > 70) return `🧓 ${t.timeToHome.results.retirementAge}`;
    return null;
  };

  const getDifferenceIndicator = (noInflation: number, withInflation: number) => {
    if (!isFinite(noInflation) || !isFinite(withInflation)) return null;
    const diff = withInflation - noInflation;
    if (diff <= 0.5) return null;
    const pct = noInflation > 0 ? Math.round((diff / noInflation) * 100) : 0;
    if (pct > 300) return null;
    return (
      <span className="text-orange-400 text-sm">
        +{diff.toFixed(1)}{locale === 'ru' ? 'г' : 'y'} ({pct}% {t.timeToHome.results.longer})
      </span>
    );
  };

  // Only show "hopeless" banner if 1-bedroom (first result) is unreachable
  const firstResult = results[0]?.yearsWithInflation ?? 0;
  const isHopeless = isUnreachable(firstResult);

  // Property type labels
  const propertyLabels: Record<string, string> = locale === 'ru' ? {
    '1bed': '1-комнатная квартира',
    '2bed': '2-комнатная квартира',
    '3bed': '3-комнатная квартира',
  } : {
    '1bed': '1-Bedroom Apartment',
    '2bed': '2-Bedroom Apartment',
    '3bed': '3-Bedroom Apartment',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {isHopeless ? '💀 ' : ''}{t.timeToHome.results.resultsFor} {city.name}, {city.country}
        </h3>
        <span className="text-sm text-gray-400">{t.timeToHome.results.yourAge}: {age}</span>
      </div>

      {/* Warning Banner for unreachable cases */}
      {isHopeless && (
        <div className="p-4 bg-gradient-to-r from-red-950 to-black border-2 border-red-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-3xl">☠️</div>
            <div>
              <p className="text-red-400 font-bold text-lg">{t.timeToHome.results.realityCheck}</p>
              <p className="text-red-300/80 text-sm">
                {locale === 'ru'
                  ? 'Цены на жильё растут быстрее, чем ваши накопления. При текущих условиях покупка невозможна.'
                  : 'Property prices grow faster than your savings. Under current conditions, buying is unreachable.'}
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
            <p className="text-red-300 font-medium">{t.timeToHome.results.cruelReality}</p>
            <p className="text-red-200/70 text-sm mt-1">
              {t.timeToHome.results.inflation}: <strong className="text-red-400">{results[0]?.inflationRate.toFixed(1)}%</strong>{t.timeToHome.results.year} |
              {t.timeToHome.results.propertyGrowth}: <strong className="text-red-400">{results[0]?.propertyGrowthRate.toFixed(1)}%</strong>{t.timeToHome.results.year}
            </p>
            <p className="text-red-200/40 text-xs mt-1">
              {t.timeToHome.results.source}: {source.source} ({t.timeToHome.results.updated}: {source.lastUpdated})
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => {
          const isExtreme = isUnreachable(result.yearsWithInflation);
          const lifetimeMsg = getLifetimeMessage(result.yearsWithInflation, age);
          const label = propertyLabels[result.propertyType] || result.propertyLabel;

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
                  {label}
                </h4>
                <p className="text-gray-400 text-sm">
                  {locale === 'ru' ? 'Сейчас' : 'Now'}: {formatLocalPrice(result.priceLocal, city.currency.symbol)}
                </p>
                {!isExtreme && result.yearsWithInflation > 1 && (
                  <p className="text-red-400 text-sm font-medium">
                    {locale === 'ru' ? 'Через' : 'In'} {Math.round(result.yearsWithInflation)} {locale === 'ru' ? 'лет' : 'years'}: <span className="text-red-500">{formatLocalPrice(result.priceWithInflationLocal, city.currency.symbol)}</span>
                    <span className="text-red-400/60 text-xs ml-1">
                      (+{Math.round((result.priceWithInflationLocal / result.priceLocal - 1) * 100)}%)
                    </span>
                  </p>
                )}
                {isExtreme && (
                  <p className="text-red-500 text-sm font-medium">
                    {locale === 'ru' ? 'Недостижимо — цены растут быстрее накоплений' : 'Unreachable — prices outpace your savings'}
                  </p>
                )}
              </div>

              {/* Time Scenarios */}
              <div className="flex gap-6 md:gap-10">
                {/* Without Inflation */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.timeToHome.results.dreamScenario}</p>
                  <p className={`text-2xl font-bold ${getStatusColor(result.yearsWithoutInflation)}`}>
                    {formatYears(result.yearsWithoutInflation)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.timeToHome.results.age}: {formatAge(result.ageAtPurchaseNoInflation)}
                  </p>
                </div>

                {/* With Inflation - THE REALITY */}
                <div className="text-center relative">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1 font-black">
                      <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                        {t.timeToHome.results.reality}
                      </span>
                    </p>
                    <p className={`text-3xl font-black ${getStatusColor(result.yearsWithInflation)}`}>
                      {formatYears(result.yearsWithInflation)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {t.timeToHome.results.age}: <span className={isExtreme ? 'text-red-400 font-bold' : ''}>{formatAge(result.ageAtPurchaseWithInflation)}</span>
                  </p>
                  {getDifferenceIndicator(result.yearsWithoutInflation, result.yearsWithInflation)}
                </div>
              </div>
            </div>

            {/* Unreachable explanation */}
            {isExtreme && (
              <div className="mt-4 pt-4 border-t border-red-900/50">
                <p className="text-red-200/70 text-sm">
                  {locale === 'ru'
                    ? `Цены растут на ${result.propertyGrowthRate.toFixed(1)}%/год — быстрее, чем ваши накопления. Математически недостижимо.`
                    : `Prices grow ${result.propertyGrowthRate.toFixed(1)}%/year — faster than your savings. Mathematically unreachable.`}
                </p>
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
                  {t.timeToHome.results.runningBackwards}
                </p>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Practical Tips */}
      <div className="p-5 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg">
        <h4 className="text-gray-300 font-bold mb-4 flex items-center gap-2">
          <span>💡</span> {t.timeToHome.tips.title}
        </h4>
        <ul className="text-gray-400 text-sm space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-lg">📈</span>
            <span>{t.timeToHome.tips.tip1}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">🌍</span>
            <span>{t.timeToHome.tips.tip2}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-pink-500 text-lg">👫</span>
            <span>{t.timeToHome.tips.tip3}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg">📊</span>
            <span>{t.timeToHome.tips.tip4}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-500 text-lg">🏛️</span>
            <span>{t.timeToHome.tips.tip5}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-500 text-lg">🏠</span>
            <span>{t.timeToHome.tips.tip6}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-cyan-500 text-lg">💻</span>
            <span>{t.timeToHome.tips.tip7}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 text-lg">👨‍👩‍👧</span>
            <span>{t.timeToHome.tips.tip8}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 text-lg">⏰</span>
            <span>{t.timeToHome.tips.tip9}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
