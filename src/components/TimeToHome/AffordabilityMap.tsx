'use client';

import { useMemo } from 'react';
import { getAllCities } from '@/lib/data';
import { calculateTimeToHome, convertToUsd } from '@/lib/inflation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CityWithMetrics } from '@/types/city';

interface AffordabilityMapProps {
  savings: number;
  currency: string;
  monthlyContribution: number;
  age: number;
  currentCityId: string;
}

interface CityAffordability {
  city: CityWithMetrics;
  years1bed: number;
  years2bed: number;
  years3bed: number;
  status: 'green' | 'yellow' | 'red';
  ageAt1bed: number;
}

// Convert country code to flag emoji
const countryToFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function AffordabilityMap({ savings, currency, monthlyContribution, age, currentCityId }: AffordabilityMapProps) {
  const { locale } = useLanguage();
  const cities = getAllCities();

  const t = locale === 'ru' ? {
    title: 'Карта доступности',
    subtitle: 'Где ты реально можешь купить жильё с твоим бюджетом',
    green: 'Реально (до 10 лет)',
    yellow: 'Сложно (10-25 лет)',
    red: 'Нереально (25+ лет)',
    yourCity: 'Твой выбор',
    years: 'лет',
    oneBed: '1-комн',
    ageAtPurchase: 'Возраст при покупке',
    affordable: 'Доступные города',
    challenging: 'Сложные города',
    impossible: 'Недоступные города',
    noCities: 'Нет городов в этой категории',
    consider: 'Рассмотри эти города — они реальнее',
    currentChoice: 'текущий выбор',
  } : {
    title: 'Affordability Map',
    subtitle: 'Where you can actually buy property with your budget',
    green: 'Realistic (under 10 years)',
    yellow: 'Challenging (10-25 years)',
    red: 'Unrealistic (25+ years)',
    yourCity: 'Your choice',
    years: 'years',
    oneBed: '1-bed',
    ageAtPurchase: 'Age at purchase',
    affordable: 'Affordable Cities',
    challenging: 'Challenging Cities',
    impossible: 'Impossible Cities',
    noCities: 'No cities in this category',
    consider: 'Consider these cities — they\'re more realistic',
    currentChoice: 'current choice',
  };

  const cityAffordability = useMemo(() => {
    const savingsUsd = convertToUsd(savings, currency);
    const contributionUsd = convertToUsd(monthlyContribution, currency);

    return cities.map((city): CityAffordability => {
      const results = calculateTimeToHome(city, savingsUsd, contributionUsd, age);
      const years1bed = results[0].yearsWithInflation;
      const years2bed = results[1].yearsWithInflation;
      const years3bed = results[2].yearsWithInflation;

      let status: 'green' | 'yellow' | 'red';
      if (years1bed <= 10) {
        status = 'green';
      } else if (years1bed <= 25) {
        status = 'yellow';
      } else {
        status = 'red';
      }

      return {
        city,
        years1bed,
        years2bed,
        years3bed,
        status,
        ageAt1bed: results[0].ageAtPurchaseWithInflation,
      };
    }).sort((a, b) => a.years1bed - b.years1bed);
  }, [cities, savings, currency, monthlyContribution, age]);

  const greenCities = cityAffordability.filter(c => c.status === 'green');
  const yellowCities = cityAffordability.filter(c => c.status === 'yellow');
  const redCities = cityAffordability.filter(c => c.status === 'red');

  const CityCard = ({ data, showBadge = false }: { data: CityAffordability; showBadge?: boolean }) => {
    const isCurrentCity = data.city.id === currentCityId;
    const statusColors = {
      green: 'border-green-600 bg-green-950/30',
      yellow: 'border-yellow-600 bg-yellow-950/30',
      red: 'border-red-600 bg-red-950/30',
    };
    const textColors = {
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400',
    };

    return (
      <div className={`p-3 rounded-lg border ${statusColors[data.status]} ${isCurrentCity ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{countryToFlag(data.city.countryCode)}</span>
            <span className="text-white font-medium text-sm">{data.city.name}</span>
            {isCurrentCity && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {t.currentChoice}
              </span>
            )}
          </div>
          <span className={`font-bold ${textColors[data.status]}`}>
            {data.years1bed > 100 ? '100+' : Math.round(data.years1bed)} {t.years}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t.oneBed}</span>
          <span>{t.ageAtPurchase}: {data.ageAt1bed > 100 ? '100+' : Math.round(data.ageAt1bed)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-green-400">{t.green}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-yellow-400">{t.yellow}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-red-400">{t.red}</span>
        </div>
      </div>

      {/* Recommendation banner if current city is not green */}
      {cityAffordability.find(c => c.city.id === currentCityId)?.status !== 'green' && greenCities.length > 0 && (
        <div className="p-4 bg-green-950/30 border border-green-800/50 rounded-xl">
          <p className="text-green-400 text-sm text-center">
            💡 {t.consider}: {greenCities.slice(0, 5).map(c => c.city.name).join(', ')}
          </p>
        </div>
      )}

      {/* City Categories */}
      <div className="space-y-6">
        {/* Green Cities */}
        {greenCities.length > 0 && (
          <div>
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <span>🟢</span> {t.affordable} ({greenCities.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {greenCities.map((data) => (
                <CityCard key={data.city.id} data={data} />
              ))}
            </div>
          </div>
        )}

        {/* Yellow Cities */}
        {yellowCities.length > 0 && (
          <div>
            <h4 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              <span>🟡</span> {t.challenging} ({yellowCities.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {yellowCities.map((data) => (
                <CityCard key={data.city.id} data={data} />
              ))}
            </div>
          </div>
        )}

        {/* Red Cities */}
        {redCities.length > 0 && (
          <div>
            <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <span>🔴</span> {t.impossible} ({redCities.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {redCities.slice(0, 12).map((data) => (
                <CityCard key={data.city.id} data={data} />
              ))}
              {redCities.length > 12 && (
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-900/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">+{redCities.length - 12} more...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
