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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900 to-blue-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Time to Your Home
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Calculate how long it will take to buy property in any city,
              with real inflation and property price growth data.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8">
            <TimeToHomeForm onCalculate={handleCalculate} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && selectedCity && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 sm:p-8">
            <TimeToHomeResults results={results} city={selectedCity} age={userAge} />
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enter Your Data</h3>
            <p className="text-gray-400 text-sm">
              Your age, current savings, and how much you can save monthly
            </p>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Choose Target City</h3>
            <p className="text-gray-400 text-sm">
              Select from 56 cities worldwide with real property prices
            </p>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">See Real Timeline</h3>
            <p className="text-gray-400 text-sm">
              Two scenarios: frozen prices vs. real inflation & property growth
            </p>
          </div>
        </div>

        {/* Data Source */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Inflation data from {source.source}
          </p>
          <p className="text-gray-600 text-xs">
            Last updated: {source.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
