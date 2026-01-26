'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateTimeToHome, convertToUsd } from '@/lib/inflation';
import type { CityWithMetrics } from '@/types/city';
import type { TimeToHomeResult } from '@/types/inflation';

interface WhatIfScenariosProps {
  savings: number;
  currency: string;
  monthlyContribution: number;
  age: number;
  city: CityWithMetrics;
  baseResults: TimeToHomeResult[];
}

export function WhatIfScenarios({ savings, currency, monthlyContribution, age, city, baseResults }: WhatIfScenariosProps) {
  const { locale } = useLanguage();

  // Scenario adjustments
  const [incomeMultiplier, setIncomeMultiplier] = useState(1.0);
  const [marketCrash, setMarketCrash] = useState(0);
  const [windfall, setWindfall] = useState(0);

  const t = locale === 'ru' ? {
    title: 'Что если...',
    subtitle: 'Смоделируй разные сценарии и посмотри, как они влияют на срок',
    incomeChange: 'Изменение дохода',
    currentIncome: 'Текущий доход',
    newIncome: 'Новый доход',
    marketCrash: 'Обвал рынка',
    noCrash: 'Без обвала',
    crash: 'падение',
    windfall: 'Единоразовый доход',
    noWindfall: 'Нет',
    inheritance: 'наследство/бонус',
    scenario: 'Сценарий',
    current: 'Сейчас',
    adjusted: 'После изменений',
    years: 'лет',
    yearsSaved: 'лет сэкономлено',
    oneBed: '1-комн.',
    twoBed: '2-комн.',
    threeBed: '3-комн.',
    impact: 'Влияние',
    faster: 'быстрее',
    slower: 'медленнее',
    noChange: 'без изменений',
    summary: 'Итого',
    combinedEffect: 'Комбинированный эффект',
    resetAll: 'Сбросить всё',
  } : {
    title: 'What if...',
    subtitle: 'Model different scenarios and see how they affect timeline',
    incomeChange: 'Income change',
    currentIncome: 'Current income',
    newIncome: 'New income',
    marketCrash: 'Market crash',
    noCrash: 'No crash',
    crash: 'drop',
    windfall: 'One-time windfall',
    noWindfall: 'None',
    inheritance: 'inheritance/bonus',
    scenario: 'Scenario',
    current: 'Current',
    adjusted: 'Adjusted',
    years: 'years',
    yearsSaved: 'years saved',
    oneBed: '1-bed',
    twoBed: '2-bed',
    threeBed: '3-bed',
    impact: 'Impact',
    faster: 'faster',
    slower: 'slower',
    noChange: 'no change',
    summary: 'Summary',
    combinedEffect: 'Combined effect',
    resetAll: 'Reset all',
  };

  const propertyLabels = {
    '1bed': t.oneBed,
    '2bed': t.twoBed,
    '3bed': t.threeBed,
  };

  // Calculate adjusted scenario
  const adjustedResults = useMemo(() => {
    const adjustedSavings = convertToUsd(savings, currency) + windfall;
    const adjustedContribution = convertToUsd(monthlyContribution, currency) * incomeMultiplier;

    // Create adjusted city with reduced prices if market crash
    const adjustedCity = {
      ...city,
      metrics: {
        ...city.metrics,
        property: {
          ...city.metrics.property,
          cityCenter: {
            ...city.metrics.property.cityCenter,
            usd: city.metrics.property.cityCenter.usd * (1 - marketCrash / 100),
          },
          buyCityCenter: city.metrics.property.buyCityCenter ? {
            oneBedroom: {
              ...city.metrics.property.buyCityCenter.oneBedroom,
              usd: city.metrics.property.buyCityCenter.oneBedroom.usd * (1 - marketCrash / 100),
            },
            twoBedroom: {
              ...city.metrics.property.buyCityCenter.twoBedroom,
              usd: city.metrics.property.buyCityCenter.twoBedroom.usd * (1 - marketCrash / 100),
            },
            threeBedroom: {
              ...city.metrics.property.buyCityCenter.threeBedroom,
              usd: city.metrics.property.buyCityCenter.threeBedroom.usd * (1 - marketCrash / 100),
            },
          } : undefined,
        },
      },
    };

    return calculateTimeToHome(adjustedCity, adjustedSavings, adjustedContribution, age);
  }, [savings, currency, monthlyContribution, age, city, incomeMultiplier, marketCrash, windfall]);

  const hasChanges = incomeMultiplier !== 1.0 || marketCrash !== 0 || windfall !== 0;

  const resetAll = () => {
    setIncomeMultiplier(1.0);
    setMarketCrash(0);
    setWindfall(0);
  };

  const getChangeColor = (diff: number) => {
    if (diff < -5) return 'text-green-400';
    if (diff < 0) return 'text-green-300';
    if (diff > 5) return 'text-red-400';
    if (diff > 0) return 'text-red-300';
    return 'text-gray-400';
  };

  const formatDiff = (base: number, adjusted: number) => {
    const diff = adjusted - base;
    if (Math.abs(diff) < 0.1) return t.noChange;
    const years = Math.abs(diff).toFixed(1);
    return diff < 0 ? `${years} ${t.years} ${t.faster}` : `${years} ${t.years} ${t.slower}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔮 {t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Scenario Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Multiplier */}
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <label className="block text-sm text-gray-400 mb-3">
            📈 {t.incomeChange}: <span className={incomeMultiplier > 1 ? 'text-green-400' : incomeMultiplier < 1 ? 'text-red-400' : 'text-white'}>{Math.round((incomeMultiplier - 1) * 100)}%</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={incomeMultiplier}
            onChange={(e) => setIncomeMultiplier(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>-50%</span>
            <span className="text-white">0%</span>
            <span>+200%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t.newIncome}: ${Math.round(convertToUsd(monthlyContribution, currency) * incomeMultiplier).toLocaleString()}/mo
          </p>
        </div>

        {/* Market Crash */}
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <label className="block text-sm text-gray-400 mb-3">
            📉 {t.marketCrash}: <span className={marketCrash > 0 ? 'text-green-400' : 'text-white'}>{marketCrash > 0 ? `-${marketCrash}%` : t.noCrash}</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={marketCrash}
            onChange={(e) => setMarketCrash(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>0%</span>
            <span>-25%</span>
            <span>-50%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {locale === 'ru' ? 'Подобно 2008 году' : 'Similar to 2008 crisis'}
          </p>
        </div>

        {/* Windfall */}
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <label className="block text-sm text-gray-400 mb-3">
            🎁 {t.windfall}: <span className={windfall > 0 ? 'text-green-400' : 'text-white'}>{windfall > 0 ? `+$${windfall.toLocaleString()}` : t.noWindfall}</span>
          </label>
          <input
            type="range"
            min={0}
            max={200000}
            step={10000}
            value={windfall}
            onChange={(e) => setWindfall(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>$0</span>
            <span>$100k</span>
            <span>$200k</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t.inheritance}
          </p>
        </div>
      </div>

      {/* Reset Button */}
      {hasChanges && (
        <div className="flex justify-center">
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
          >
            ↩️ {t.resetAll}
          </button>
        </div>
      )}

      {/* Results Comparison */}
      <div className="space-y-4">
        {baseResults.map((base, index) => {
          const adjusted = adjustedResults[index];
          const diff = adjusted.yearsWithInflation - base.yearsWithInflation;

          return (
            <div
              key={base.propertyType}
              className={`p-5 rounded-xl border ${
                hasChanges && diff < -1
                  ? 'bg-green-950/20 border-green-800/50'
                  : hasChanges && diff > 1
                  ? 'bg-red-950/20 border-red-800/50'
                  : 'bg-gray-900/50 border-gray-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{propertyLabels[base.propertyType]}</h4>
                </div>

                <div className="flex items-center gap-8">
                  {/* Current */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase mb-1">{t.current}</p>
                    <p className="text-xl font-bold text-gray-400">
                      {base.yearsWithInflation > 100 ? '100+' : base.yearsWithInflation.toFixed(1)} {t.years}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-2xl text-gray-600">→</div>

                  {/* Adjusted */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase mb-1">{t.adjusted}</p>
                    <p className={`text-xl font-bold ${getChangeColor(diff)}`}>
                      {adjusted.yearsWithInflation > 100 ? '100+' : adjusted.yearsWithInflation.toFixed(1)} {t.years}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="text-center min-w-[120px]">
                    <p className="text-xs text-gray-500 uppercase mb-1">{t.impact}</p>
                    <p className={`text-sm font-medium ${getChangeColor(diff)}`}>
                      {hasChanges ? formatDiff(base.yearsWithInflation, adjusted.yearsWithInflation) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {hasChanges && (
        <div className="p-4 bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-800/50 rounded-xl text-center">
          <p className="text-purple-300 font-medium">
            {t.combinedEffect}: {(() => {
              const baseBest = baseResults[0].yearsWithInflation;
              const adjustedBest = adjustedResults[0].yearsWithInflation;
              const diff = adjustedBest - baseBest;
              if (diff < -1) return `🎉 ${Math.abs(diff).toFixed(1)} ${t.years} ${t.faster}!`;
              if (diff > 1) return `😰 ${diff.toFixed(1)} ${t.years} ${t.slower}`;
              return `≈ ${t.noChange}`;
            })()}
          </p>
        </div>
      )}
    </div>
  );
}
