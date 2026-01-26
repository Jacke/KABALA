'use client';

import { useState, useMemo } from 'react';
import { getAllCities } from '@/lib/data';
import { getSupportedCurrencies, convertToUsd, getAverageInflation, getPropertyGrowth, calculateMinimumMonthlySavings } from '@/lib/inflation';
import type { CityWithMetrics } from '@/types/city';

interface TimeToHomeFormProps {
  onCalculate: (data: {
    age: number;
    savings: number;
    currency: string;
    monthlyContribution: number;
    city: CityWithMetrics;
  }) => void;
}

export function TimeToHomeForm({ onCalculate }: TimeToHomeFormProps) {
  const cities = getAllCities();
  const currencies = getSupportedCurrencies();

  const [age, setAge] = useState(30);
  const [savings, setSavings] = useState(50000);
  const [currency, setCurrency] = useState('USD');
  const [monthlyContribution, setMonthlyContribution] = useState(3000);
  const [selectedCityId, setSelectedCityId] = useState('berlin');

  // Calculate minimum required savings for selected city
  const selectedCity = useMemo(() => cities.find((c) => c.id === selectedCityId), [cities, selectedCityId]);

  const minimumMonthlySavings = useMemo(() => {
    if (!selectedCity) return 0;

    const pricePerSqm = selectedCity.metrics.property.cityCenter.usd;
    const oneBedPrice = selectedCity.metrics.property.buyCityCenter?.oneBedroom.usd || pricePerSqm * 50;

    const inflation = getAverageInflation(selectedCity.countryCode);
    const propertyGrowth = getPropertyGrowth(selectedCity.countryCode);
    const savingsUsd = convertToUsd(savings, currency);

    return calculateMinimumMonthlySavings(oneBedPrice, savingsUsd, propertyGrowth, inflation);
  }, [selectedCity, savings, currency]);

  const isBelowMinimum = convertToUsd(monthlyContribution, currency) < minimumMonthlySavings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = cities.find((c) => c.id === selectedCityId);
    if (!city) return;

    onCalculate({
      age,
      savings,
      currency,
      monthlyContribution,
      city,
    });
  };

  const groupedCities = cities.reduce(
    (acc, city) => {
      const region = city.region;
      if (!acc[region]) acc[region] = [];
      acc[region].push(city);
      return acc;
    },
    {} as Record<string, CityWithMetrics[]>
  );

  const regionLabels: Record<string, string> = {
    eu: 'Europe',
    cis: 'CIS Countries',
    other: 'Asia & Americas',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
            Your Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={18}
            max={80}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Target City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
            Target City
          </label>
          <select
            id="city"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(groupedCities).map(([region, regionCities]) => (
              <optgroup key={region} label={regionLabels[region] || region}>
                {regionCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Current Savings */}
        <div>
          <label htmlFor="savings" className="block text-sm font-medium text-gray-300 mb-2">
            Current Savings
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              id="savings"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              min={0}
              step={1000}
              className="flex-1 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-24 px-2 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Contribution with Slider */}
        <div className="md:col-span-2">
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-300 mb-2">
            Monthly Savings ({currency})
          </label>

          <div className="flex items-center gap-4 mb-3">
            <input
              type="number"
              id="contribution"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              min={100}
              step={100}
              className={`w-32 px-4 py-3 bg-gray-950 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isBelowMinimum ? 'border-red-600' : 'border-gray-800'
              }`}
            />
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Minimum savings warning */}
          {isBelowMinimum && (
            <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-lg mb-2">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  Minimum ~<strong>${minimumMonthlySavings.toLocaleString()}</strong>/month needed to keep up with property price growth in this city.
                  Below this, you&apos;ll never catch up.
                </span>
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Drag the slider to see how savings amount affects your timeline
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-red-900/30"
      >
        ⚡ Calculate My Doom
      </button>
    </form>
  );
}
