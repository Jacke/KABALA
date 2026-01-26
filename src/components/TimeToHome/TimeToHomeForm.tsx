'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { getAllCities } from '@/lib/data';
import { getSupportedCurrencies, convertToUsd, getAverageInflation, getPropertyGrowth, calculateMinimumMonthlySavings } from '@/lib/inflation';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t, locale } = useLanguage();

  const [age, setAge] = useState(25);
  const [savings, setSavings] = useState(50000);
  const [currency, setCurrency] = useState('USD');
  const [monthlyContribution, setMonthlyContribution] = useState(3000);
  const [selectedCityId, setSelectedCityId] = useState('berlin');

  // Calculate minimum required savings for selected city
  const selectedCity = useMemo(() => cities.find((c) => c.id === selectedCityId), [cities, selectedCityId]);

  // Get city's monthly expenses for zone calculation
  const cityMonthlyExpenses = useMemo(() => {
    if (!selectedCity) return { min: 1000, comfortable: 2000, good: 4000 };

    const rent = selectedCity.metrics.rent.oneBedroom.usd;
    const food = selectedCity.metrics.food.groceries.usd; // monthly groceries
    const transport = selectedCity.metrics.transport.monthlyPass.usd;
    const utilities = selectedCity.metrics.utilities.basic.usd + selectedCity.metrics.utilities.internet.usd;

    const baseExpenses = rent + food + transport + utilities;

    return {
      min: Math.round(baseExpenses * 0.3), // 30% of expenses = barely saving
      comfortable: Math.round(baseExpenses * 0.5), // 50% = decent savings
      good: Math.round(baseExpenses * 1.0), // 100% = aggressive saving
    };
  }, [selectedCity]);

  const minimumMonthlySavings = useMemo(() => {
    if (!selectedCity) return 0;

    const pricePerSqm = selectedCity.metrics.property.cityCenter.usd;
    const oneBedPrice = selectedCity.metrics.property.buyCityCenter?.oneBedroom.usd || pricePerSqm * 50;

    const inflation = getAverageInflation(selectedCity.countryCode);
    const propertyGrowth = getPropertyGrowth(selectedCity.countryCode);
    const savingsUsd = convertToUsd(savings, currency);

    return calculateMinimumMonthlySavings(oneBedPrice, savingsUsd, propertyGrowth, inflation);
  }, [selectedCity, savings, currency]);

  const contributionUsd = convertToUsd(monthlyContribution, currency);
  const isBelowMinimum = contributionUsd < minimumMonthlySavings;

  // Calculate slider zone (red/yellow/green)
  const sliderZone = useMemo(() => {
    if (contributionUsd < minimumMonthlySavings) return 'red';
    if (contributionUsd < cityMonthlyExpenses.comfortable) return 'red';
    if (contributionUsd < cityMonthlyExpenses.good) return 'yellow';
    return 'green';
  }, [contributionUsd, minimumMonthlySavings, cityMonthlyExpenses]);

  // Auto-calculate on any change
  const triggerCalculation = useCallback(() => {
    if (!selectedCity) return;

    onCalculate({
      age,
      savings,
      currency,
      monthlyContribution,
      city: selectedCity,
    });
  }, [age, savings, currency, monthlyContribution, selectedCity, onCalculate]);

  // Auto-trigger calculation when values change
  useEffect(() => {
    triggerCalculation();
  }, [triggerCalculation]);

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
    eu: t.regions.eu,
    cis: t.regions.cis,
    other: t.regions.other,
  };

  // Slider gradient based on zones
  const sliderBackground = useMemo(() => {
    const max = 20000;
    const redEnd = Math.min((minimumMonthlySavings / max) * 100, 100);
    const yellowEnd = Math.min((cityMonthlyExpenses.good / max) * 100, 100);

    return `linear-gradient(to right,
      #dc2626 0%,
      #dc2626 ${redEnd}%,
      #eab308 ${redEnd}%,
      #eab308 ${yellowEnd}%,
      #22c55e ${yellowEnd}%,
      #22c55e 100%)`;
  }, [minimumMonthlySavings, cityMonthlyExpenses.good]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
            {t.timeToHome.form.yourAge}
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
            {t.timeToHome.form.targetCity}
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
            {t.timeToHome.form.currentSavings}
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

        {/* Monthly Contribution with Dynamic Slider */}
        <div className="md:col-span-2">
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-300 mb-2">
            {t.timeToHome.form.monthlySavings} ({currency})
          </label>

          <div className="flex items-center gap-4 mb-3">
            <input
              type="number"
              id="contribution"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              min={100}
              step={100}
              className={`w-32 px-4 py-3 bg-gray-950 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-lg ${
                sliderZone === 'red' ? 'border-red-600 text-red-400' :
                sliderZone === 'yellow' ? 'border-yellow-600 text-yellow-400' :
                'border-green-600 text-green-400'
              }`}
            />
            <div className="flex-1 relative">
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{ background: sliderBackground }}
              />
              {/* Zone markers */}
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span className="text-red-500">$100</span>
                <span className="text-yellow-500">${cityMonthlyExpenses.comfortable.toLocaleString()}</span>
                <span className="text-green-500">${cityMonthlyExpenses.good.toLocaleString()}+</span>
              </div>
            </div>
          </div>

          {/* Zone indicator */}
          <div className={`p-3 rounded-lg mb-2 ${
            sliderZone === 'red' ? 'bg-red-950/50 border border-red-800/50' :
            sliderZone === 'yellow' ? 'bg-yellow-950/50 border border-yellow-800/50' :
            'bg-green-950/50 border border-green-800/50'
          }`}>
            <p className={`text-sm flex items-center gap-2 ${
              sliderZone === 'red' ? 'text-red-400' :
              sliderZone === 'yellow' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              <span>{sliderZone === 'red' ? '🔴' : sliderZone === 'yellow' ? '🟡' : '🟢'}</span>
              <span>
                {sliderZone === 'red' && (
                  <>
                    {isBelowMinimum
                      ? `⚠️ ${locale === 'ru' ? 'Минимум' : 'Minimum'} ~$${minimumMonthlySavings.toLocaleString()}/мес ${locale === 'ru' ? 'нужно чтобы угнаться за ростом цен' : 'needed to keep up with price growth'}`
                      : locale === 'ru' ? 'Низкие сбережения — копить придётся очень долго' : 'Low savings — will take a very long time'
                    }
                  </>
                )}
                {sliderZone === 'yellow' && (locale === 'ru' ? 'Умеренные сбережения — реалистичный срок' : 'Moderate savings — realistic timeline')}
                {sliderZone === 'green' && (locale === 'ru' ? 'Агрессивные сбережения — отличный темп!' : 'Aggressive savings — great pace!')}
              </span>
            </p>
          </div>

          <p className="text-xs text-gray-500">
            {t.timeToHome.form.monthlySavingsHint}
          </p>
        </div>
      </div>
    </div>
  );
}
