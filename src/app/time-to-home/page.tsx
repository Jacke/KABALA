'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import {
  TimeToHomeForm,
  TimeToHomeResults,
  Tabs,
  LifeTimeline,
  AffordabilityMap,
  MortgageMode,
  RentVsBuy,
  WhatIfScenarios,
  CityRecommendations,
  CoupleMode,
} from '@/components/TimeToHome';
import { calculateTimeToHome, convertToUsd, getInflationSource } from '@/lib/inflation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';

export default function TimeToHomePage() {
  const [results, setResults] = useState<TimeToHomeResult[] | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityWithMetrics | null>(null);
  const [userAge, setUserAge] = useState<number>(25);
  const [userSavings, setUserSavings] = useState<number>(50000);
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const [userMonthly, setUserMonthly] = useState<number>(3000);
  const { t, locale } = useLanguage();

  const source = getInflationSource();

  // Force dark background on body and html for this page
  useEffect(() => {
    document.documentElement.style.backgroundColor = 'black';
    document.body.style.backgroundColor = 'black';

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleCalculate = useCallback((data: {
    age: number;
    savings: number;
    currency: string;
    monthlyContribution: number;
    city: CityWithMetrics;
  }) => {
    const savingsUsd = convertToUsd(data.savings, data.currency);
    const contributionUsd = convertToUsd(data.monthlyContribution, data.currency);

    const calculationResults = calculateTimeToHome(
      data.city,
      savingsUsd,
      contributionUsd,
      data.age
    );

    setResults(calculationResults);
    setSelectedCity(data.city);
    setUserAge(data.age);
    setUserSavings(data.savings);
    setUserCurrency(data.currency);
    setUserMonthly(data.monthlyContribution);
  }, []);

  // Tab labels
  const tabLabels = locale === 'ru' ? {
    results: 'Результаты',
    timeline: 'Линия жизни',
    map: 'Карта городов',
    mortgage: 'Ипотека',
    rentVsBuy: 'Аренда vs Покупка',
    whatIf: 'Что если...',
    recommend: 'Рекомендации',
    couple: 'Для пары',
  } : {
    results: 'Results',
    timeline: 'Life Timeline',
    map: 'City Map',
    mortgage: 'Mortgage',
    rentVsBuy: 'Rent vs Buy',
    whatIf: 'What if...',
    recommend: 'Recommendations',
    couple: 'Couple Mode',
  };

  // Build tabs array when we have results
  const tabs = useMemo(() => {
    if (!results || !selectedCity) return [];

    const savingsUsd = convertToUsd(userSavings, userCurrency);
    const contributionUsd = convertToUsd(userMonthly, userCurrency);

    return [
      {
        id: 'results',
        label: tabLabels.results,
        icon: '📊',
        content: <TimeToHomeResults results={results} city={selectedCity} age={userAge} />,
      },
      {
        id: 'timeline',
        label: tabLabels.timeline,
        icon: '⏳',
        content: <LifeTimeline age={userAge} results={results} cityName={selectedCity.name} />,
      },
      {
        id: 'map',
        label: tabLabels.map,
        icon: '🗺️',
        content: (
          <AffordabilityMap
            savings={userSavings}
            currency={userCurrency}
            monthlyContribution={userMonthly}
            age={userAge}
            currentCityId={selectedCity.id}
          />
        ),
      },
      {
        id: 'mortgage',
        label: tabLabels.mortgage,
        icon: '🏦',
        content: (
          <MortgageMode
            savings={userSavings}
            savingsUsd={savingsUsd}
            monthlyContribution={userMonthly}
            monthlyContributionUsd={contributionUsd}
            currency={userCurrency}
            age={userAge}
            city={selectedCity}
          />
        ),
      },
      {
        id: 'rent-vs-buy',
        label: tabLabels.rentVsBuy,
        icon: '🔥',
        content: <RentVsBuy results={results} city={selectedCity} age={userAge} />,
      },
      {
        id: 'what-if',
        label: tabLabels.whatIf,
        icon: '🔮',
        content: (
          <WhatIfScenarios
            savings={userSavings}
            currency={userCurrency}
            monthlyContribution={userMonthly}
            age={userAge}
            city={selectedCity}
            baseResults={results}
          />
        ),
      },
      {
        id: 'recommend',
        label: tabLabels.recommend,
        icon: '🎯',
        content: (
          <CityRecommendations
            savings={userSavings}
            currency={userCurrency}
            monthlyContribution={userMonthly}
            age={userAge}
            currentCityId={selectedCity.id}
          />
        ),
      },
      {
        id: 'couple',
        label: tabLabels.couple,
        icon: '💕',
        content: (
          <CoupleMode
            savings={userSavings}
            currency={userCurrency}
            monthlyContribution={userMonthly}
            age={userAge}
            city={selectedCity}
            baseResults={results}
          />
        ),
        bgClass: 'bg-transparent',
      },
    ];
  }, [results, selectedCity, userAge, userSavings, userCurrency, userMonthly, tabLabels]);

  return (
    <div className="time-to-home-page min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-black to-purple-950/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">
                {t.timeToHome.title}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t.timeToHome.subtitle}
            </p>
            <p className="text-sm text-red-500/70 mt-2">
              ⚠️ {t.timeToHome.warning}
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-gray-950/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-900/10">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-500">Loading...</div>}>
              <TimeToHomeForm onCalculate={handleCalculate} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Results Section with Tabs */}
      {results && selectedCity && tabs.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-red-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <Tabs tabs={tabs} defaultTab="results" />
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-300 mb-6 text-center">{t.timeToHome.howItWorks.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800">
              <span className="text-2xl text-red-500">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.timeToHome.howItWorks.step1Title}</h3>
            <p className="text-gray-500 text-sm">{t.timeToHome.howItWorks.step1Text}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-800">
              <span className="text-2xl text-orange-500">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.timeToHome.howItWorks.step2Title}</h3>
            <p className="text-gray-500 text-sm">{t.timeToHome.howItWorks.step2Text}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-800">
              <span className="text-2xl text-purple-500">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.timeToHome.howItWorks.step3Title}</h3>
            <p className="text-gray-500 text-sm">{t.timeToHome.howItWorks.step3Text}</p>
          </div>
        </div>

        {/* Data Source */}
        <div className="mt-12 text-center border-t border-gray-900 pt-8">
          <p className="text-gray-600 text-sm">
            {t.timeToHome.howItWorks.dataSource} {source.source}
          </p>
          <p className="text-gray-700 text-xs mt-1">
            {t.timeToHome.howItWorks.lastUpdated}: {source.lastUpdated}
          </p>
          <p className="text-gray-700 text-xs mt-4 max-w-md mx-auto">
            {t.timeToHome.howItWorks.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
