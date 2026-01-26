'use client';

import { useState } from 'react';
import { getAllCities } from '@/lib/data';
import { getSupportedCurrencies } from '@/lib/inflation';
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
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [selectedCityId, setSelectedCityId] = useState('berlin');

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
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-24 px-2 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Contribution */}
        <div>
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-300 mb-2">
            Monthly Savings ({currency})
          </label>
          <input
            type="number"
            id="contribution"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            min={0}
            step={100}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">How much you can save each month</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Calculate Time to Home
      </button>
    </form>
  );
}
