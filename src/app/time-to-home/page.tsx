'use client';

import { useState } from 'react';
import { TimeToHomeForm, TimeToHomeResults } from '@/components/TimeToHome';
import { calculateTimeToHome, convertToUsd, getInflationSource } from '@/lib/inflation';
import type { TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';

export default function TimeToHomePage() {
  const [results, setResults] = useState<TimeToHomeResult[] | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityWithMetrics | null>(null);
  const [userAge, setUserAge] = useState<number>(30);

  const source = getInflationSource();

  const handleCalculate = (data: {
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
  };

  return (
    // Break out of the layout container with negative margins
    // time-to-home-page class triggers dark background in globals.css
    <div className="time-to-home-page -mx-4 sm:-mx-6 lg:-mx-8 -my-8 min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Darker, more ominous gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-black to-purple-950/30" />
        <div className="absolute inset-0">
          {/* Red glow for drama */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
          {/* Extra dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">
                TIME TO YOUR HOME
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Face the brutal reality. See how long it <em>really</em> takes to buy property,
              with inflation destroying your dreams every year.
            </p>
            <p className="text-sm text-red-500/70 mt-2">
              ⚠️ Warning: Results may cause existential dread
            </p>
          </div>

          {/* Calculator Card - darker */}
          <div className="bg-gray-950/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-900/10">
            <TimeToHomeForm onCalculate={handleCalculate} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && selectedCity && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-red-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <TimeToHomeResults results={results} city={selectedCity} age={userAge} />
          </div>
        </div>
      )}

      {/* How It Works - More ominous */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-300 mb-6 text-center">How This Calculator Crushes Your Dreams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800">
              <span className="text-2xl text-red-500">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enter Your Sad Reality</h3>
            <p className="text-gray-500 text-sm">
              Your age, pathetic savings, and the pittance you can save monthly
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-800">
              <span className="text-2xl text-orange-500">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pick Your Dream City</h3>
            <p className="text-gray-500 text-sm">
              56 cities with brutally honest real property prices
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-800">
              <span className="text-2xl text-purple-500">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Face The Truth</h3>
            <p className="text-gray-500 text-sm">
              Dream scenario vs harsh reality with inflation eating your future
            </p>
          </div>
        </div>

        {/* Data Source - subdued */}
        <div className="mt-12 text-center border-t border-gray-900 pt-8">
          <p className="text-gray-600 text-sm">
            Inflation data from {source.source}
          </p>
          <p className="text-gray-700 text-xs mt-1">
            Last updated: {source.lastUpdated}
          </p>
          <p className="text-gray-700 text-xs mt-4 max-w-md mx-auto">
            This calculator uses real economic forecasts. The painful numbers you see are not exaggerations —
            they&apos;re what happens when inflation compounds year after year.
          </p>
        </div>
      </div>
    </div>
  );
}
