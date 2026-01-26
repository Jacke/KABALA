'use client';

import { useMemo, useState } from 'react';
import { getAllCities } from '@/lib/data';
import { calculateTimeToHome, convertToUsd } from '@/lib/inflation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CityWithMetrics } from '@/types/city';

interface CityRecommendationsProps {
  savings: number;
  currency: string;
  monthlyContribution: number;
  age: number;
  currentCityId: string;
}

interface CityScore {
  city: CityWithMetrics;
  years1bed: number;
  price1bed: number;
  monthlyRent: number;
  qualityScore: number; // Higher is better (inverse of price + quality factors)
  valueScore: number; // Years to buy + quality
  recommendation: 'perfect' | 'great' | 'good' | 'okay' | 'skip';
}

// Convert country code to flag emoji
const countryToFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function CityRecommendations({ savings, currency, monthlyContribution, age, currentCityId }: CityRecommendationsProps) {
  const { locale } = useLanguage();
  const cities = getAllCities();
  const [maxYears, setMaxYears] = useState(10);
  const [showAll, setShowAll] = useState(false);

  const t = locale === 'ru' ? {
    title: 'Рекомендации городов',
    subtitle: 'Где ты реально можешь купить жильё за выбранный срок',
    maxYears: 'Максимум лет на покупку',
    years: 'лет',
    yourChoice: 'Твой выбор',
    perfect: 'Идеально',
    great: 'Отлично',
    good: 'Хорошо',
    okay: 'Нормально',
    skip: 'Не советую',
    yearsTo1bed: 'Лет на 1-комн.',
    price: 'Цена 1-комн.',
    rent: 'Аренда',
    perMonth: '/мес',
    noCities: 'Нет городов, где можно купить за {years} лет',
    tryIncrease: 'Попробуй увеличить срок или ежемесячные сбережения',
    found: 'Найдено',
    citiesInBudget: 'городов в бюджете',
    showAll: 'Показать все',
    showLess: 'Скрыть',
    topPick: 'Лучший выбор',
    whyGood: 'Почему хорошо',
    affordable: 'Доступно',
    fastTrack: 'Быстрый путь',
    balanced: 'Баланс цена/качество',
    compared: 'Сравнение с',
    fasterBy: 'быстрее на',
    samePace: 'примерно так же',
  } : {
    title: 'City Recommendations',
    subtitle: 'Where you can realistically buy property within your timeline',
    maxYears: 'Max years to purchase',
    years: 'years',
    yourChoice: 'Your choice',
    perfect: 'Perfect',
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    skip: 'Skip',
    yearsTo1bed: 'Years to 1-bed',
    price: '1-bed price',
    rent: 'Rent',
    perMonth: '/mo',
    noCities: 'No cities where you can buy within {years} years',
    tryIncrease: 'Try increasing the timeline or monthly savings',
    found: 'Found',
    citiesInBudget: 'cities within budget',
    showAll: 'Show all',
    showLess: 'Show less',
    topPick: 'Top pick',
    whyGood: 'Why it\'s good',
    affordable: 'Affordable',
    fastTrack: 'Fast track',
    balanced: 'Price/quality balance',
    compared: 'Compared to',
    fasterBy: 'faster by',
    samePace: 'about the same',
  };

  const currentCity = cities.find(c => c.id === currentCityId);

  const scoredCities = useMemo((): CityScore[] => {
    const savingsUsd = convertToUsd(savings, currency);
    const contributionUsd = convertToUsd(monthlyContribution, currency);

    return cities.map((city): CityScore => {
      const results = calculateTimeToHome(city, savingsUsd, contributionUsd, age);
      const years1bed = results[0].yearsWithInflation;
      const price1bed = results[0].priceUsd;
      const monthlyRent = city.metrics.rent.oneBedroom.usd;

      // Quality score based on various factors (0-100)
      // Lower rent relative to income = better
      // Lower crime (if available) = better
      // For now, use inverse of property price as proxy for affordability
      const affordabilityScore = Math.max(0, 100 - (price1bed / 5000));

      // Value score: combination of time to buy and quality
      const timeScore = Math.max(0, 100 - years1bed * 5);
      const valueScore = (timeScore + affordabilityScore) / 2;

      // Recommendation based on years
      let recommendation: 'perfect' | 'great' | 'good' | 'okay' | 'skip';
      if (years1bed <= 5) recommendation = 'perfect';
      else if (years1bed <= 10) recommendation = 'great';
      else if (years1bed <= 15) recommendation = 'good';
      else if (years1bed <= 25) recommendation = 'okay';
      else recommendation = 'skip';

      return {
        city,
        years1bed,
        price1bed,
        monthlyRent,
        qualityScore: affordabilityScore,
        valueScore,
        recommendation,
      };
    }).sort((a, b) => a.years1bed - b.years1bed);
  }, [cities, savings, currency, monthlyContribution, age]);

  const filteredCities = scoredCities.filter(c => c.years1bed <= maxYears);
  const displayCities = showAll ? filteredCities : filteredCities.slice(0, 6);
  const currentCityScore = scoredCities.find(c => c.city.id === currentCityId);

  const getRecommendationBadge = (rec: string) => {
    const styles = {
      perfect: 'bg-green-600 text-white',
      great: 'bg-emerald-600 text-white',
      good: 'bg-blue-600 text-white',
      okay: 'bg-yellow-600 text-black',
      skip: 'bg-red-600 text-white',
    };
    const labels = {
      perfect: t.perfect,
      great: t.great,
      good: t.good,
      okay: t.okay,
      skip: t.skip,
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[rec as keyof typeof styles]}`}>
        {labels[rec as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🎯 {t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Filter Control */}
      <div className="p-4 bg-gray-900/50 rounded-xl">
        <label className="block text-sm text-gray-400 mb-3">
          ⏱️ {t.maxYears}: <span className="text-white font-bold">{maxYears} {t.years}</span>
        </label>
        <input
          type="range"
          min={5}
          max={30}
          step={5}
          value={maxYears}
          onChange={(e) => setMaxYears(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>5</span>
          <span>15</span>
          <span>30</span>
        </div>
      </div>

      {/* Current City Comparison */}
      {currentCityScore && (
        <div className="p-4 bg-blue-950/30 border border-blue-800/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{countryToFlag(currentCityScore.city.countryCode)}</span>
              <div>
                <p className="text-white font-medium">{currentCityScore.city.name}</p>
                <p className="text-xs text-blue-400">{t.yourChoice}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400">{currentCityScore.years1bed.toFixed(1)} {t.years}</p>
              {getRecommendationBadge(currentCityScore.recommendation)}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredCities.length === 0 ? (
        <div className="p-8 bg-red-950/30 border border-red-800/50 rounded-xl text-center">
          <p className="text-red-400 mb-2">😔 {t.noCities.replace('{years}', maxYears.toString())}</p>
          <p className="text-gray-500 text-sm">{t.tryIncrease}</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm">
            {t.found} <span className="text-green-400 font-bold">{filteredCities.length}</span> {t.citiesInBudget}
          </p>

          {/* City Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCities.map((score, index) => {
              const isCurrentCity = score.city.id === currentCityId;
              const isBetterThanCurrent = currentCityScore && score.years1bed < currentCityScore.years1bed;
              const yearsDiff = currentCityScore ? currentCityScore.years1bed - score.years1bed : 0;

              return (
                <div
                  key={score.city.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrentCity
                      ? 'bg-blue-950/30 border-blue-600 ring-2 ring-blue-500'
                      : index === 0
                      ? 'bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-green-700'
                      : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{countryToFlag(score.city.countryCode)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{score.city.name}</p>
                          {index === 0 && !isCurrentCity && (
                            <span className="text-xs bg-yellow-600 text-black px-2 py-0.5 rounded-full">
                              ⭐ {t.topPick}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{score.city.country}</p>
                      </div>
                    </div>
                    {getRecommendationBadge(score.recommendation)}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-500">{t.yearsTo1bed}</p>
                      <p className={`font-bold ${score.years1bed <= 5 ? 'text-green-400' : score.years1bed <= 10 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {score.years1bed.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.price}</p>
                      <p className="text-white font-medium">${Math.round(score.price1bed / 1000)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.rent}</p>
                      <p className="text-gray-400">${Math.round(score.monthlyRent)}{t.perMonth}</p>
                    </div>
                  </div>

                  {/* Comparison with current city */}
                  {!isCurrentCity && currentCityScore && yearsDiff > 0.5 && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-xs text-green-400">
                        ✓ {t.fasterBy} {yearsDiff.toFixed(1)} {t.years} {t.compared.toLowerCase()} {currentCityScore.city.name}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          {filteredCities.length > 6 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                {showAll ? t.showLess : `${t.showAll} (${filteredCities.length - 6} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
