'use client';

import { useMemo } from 'react';
import type { TimeToHomeResult } from '@/types/inflation';
import { useLanguage } from '@/contexts/LanguageContext';

interface LifeTimelineProps {
  age: number;
  results: TimeToHomeResult[];
  cityName: string;
}

export function LifeTimeline({ age, results, cityName }: LifeTimelineProps) {
  const { locale } = useLanguage();
  const MAX_AGE = 66;

  const t = locale === 'ru' ? {
    title: 'Линия твоей жизни',
    subtitle: 'От рождения до 66 лет — средняя продолжительность жизни мужчины в СНГ',
    birth: 'Рождение',
    now: 'Сейчас',
    retirement: 'Пенсия',
    end: 'Конец',
    yearsLeft: 'лет осталось',
    buy1bed: '1-комн.',
    buy2bed: '2-комн.',
    buy3bed: '3-комн.',
    neverInLifetime: 'Не успеешь за жизнь',
    willBuyAt: 'Купишь в',
    years: 'лет',
    lifeUsed: 'жизни потрачено на накопление',
    freeYears: 'свободных лет после покупки',
    noFreeYears: 'Не останется времени пожить в своей квартире',
    alreadyPast: 'Уже за пределами жизни',
  } : {
    title: 'Your Life Timeline',
    subtitle: 'From birth to 66 years — average male life expectancy in CIS',
    birth: 'Birth',
    now: 'Now',
    retirement: 'Retirement',
    end: 'End',
    yearsLeft: 'years left',
    buy1bed: '1-bed',
    buy2bed: '2-bed',
    buy3bed: '3-bed',
    neverInLifetime: 'Won\'t make it in lifetime',
    willBuyAt: 'Buy at age',
    years: 'years',
    lifeUsed: 'of life spent saving',
    freeYears: 'free years after purchase',
    noFreeYears: 'No time left to enjoy your apartment',
    alreadyPast: 'Already beyond lifetime',
  };

  const milestones = useMemo(() => {
    const items: { age: number; label: string; color: string; icon: string; type: string }[] = [
      { age: 0, label: t.birth, color: 'bg-blue-500', icon: '👶', type: 'life' },
      { age, label: t.now, color: 'bg-green-500', icon: '📍', type: 'life' },
      { age: 60, label: t.retirement, color: 'bg-yellow-500', icon: '🧓', type: 'life' },
      { age: MAX_AGE, label: t.end, color: 'bg-gray-500', icon: '⚰️', type: 'life' },
    ];

    // Add property purchase milestones
    const propertyLabels = { '1bed': t.buy1bed, '2bed': t.buy2bed, '3bed': t.buy3bed };
    const propertyColors = { '1bed': 'bg-emerald-500', '2bed': 'bg-cyan-500', '3bed': 'bg-purple-500' };

    results.forEach((result) => {
      const purchaseAge = result.ageAtPurchaseWithInflation;
      if (purchaseAge <= MAX_AGE && purchaseAge > age) {
        items.push({
          age: purchaseAge,
          label: propertyLabels[result.propertyType],
          color: propertyColors[result.propertyType],
          icon: '🏠',
          type: 'property',
        });
      }
    });

    return items.sort((a, b) => a.age - b.age);
  }, [age, results, t]);

  const yearsRemaining = MAX_AGE - age;

  // Calculate property stats
  const propertyStats = useMemo(() => {
    return results.map((result) => {
      const purchaseAge = result.ageAtPurchaseWithInflation;
      const yearsToSave = result.yearsWithInflation;
      const withinLifetime = purchaseAge <= MAX_AGE;
      const freeYearsAfter = withinLifetime ? MAX_AGE - purchaseAge : 0;
      const percentLifeUsed = withinLifetime ? Math.round((yearsToSave / (MAX_AGE - age)) * 100) : 100;

      return {
        ...result,
        purchaseAge,
        withinLifetime,
        freeYearsAfter,
        percentLifeUsed,
      };
    });
  }, [results, age]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
        <p className="text-gray-500 text-xs mt-1">
          {t.now}: {age} {t.years} | {yearsRemaining} {t.yearsLeft}
        </p>
      </div>

      {/* Visual Timeline */}
      <div className="relative py-8">
        {/* Timeline bar */}
        <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-800 rounded-full transform -translate-y-1/2">
          {/* Life lived portion */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 via-green-500 to-green-600 rounded-l-full"
            style={{ width: `${(age / MAX_AGE) * 100}%` }}
          />
          {/* Remaining life */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-green-600 via-yellow-600 to-gray-600 rounded-r-full"
            style={{ left: `${(age / MAX_AGE) * 100}%`, width: `${((MAX_AGE - age) / MAX_AGE) * 100}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="relative h-24">
          {milestones.map((milestone, index) => {
            const position = (milestone.age / MAX_AGE) * 100;
            const isTop = index % 2 === 0;

            return (
              <div
                key={`${milestone.type}-${milestone.age}-${milestone.label}`}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${position}%`, top: isTop ? '0' : 'auto', bottom: isTop ? 'auto' : '0' }}
              >
                <div className={`flex flex-col items-center ${isTop ? '' : 'flex-col-reverse'}`}>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{milestone.label}</span>
                  <span className="text-lg my-1">{milestone.icon}</span>
                  <div className={`w-3 h-3 rounded-full ${milestone.color} ring-2 ring-gray-900`} />
                  <span className="text-xs text-gray-500">{Math.round(milestone.age)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Purchase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {propertyStats.map((stat) => {
          const propertyLabels = { '1bed': t.buy1bed, '2bed': t.buy2bed, '3bed': t.buy3bed };

          return (
            <div
              key={stat.propertyType}
              className={`p-4 rounded-xl border ${
                stat.withinLifetime
                  ? 'bg-gray-900/50 border-gray-700'
                  : 'bg-red-950/30 border-red-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">{propertyLabels[stat.propertyType]}</span>
                <span className={`text-sm ${stat.withinLifetime ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.withinLifetime ? `${t.willBuyAt} ${Math.round(stat.purchaseAge)}` : t.neverInLifetime}
                </span>
              </div>

              {/* Progress bar showing life used */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${stat.withinLifetime ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-red-600'}`}
                  style={{ width: `${Math.min(stat.percentLifeUsed, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  {stat.percentLifeUsed}% {t.lifeUsed}
                </span>
                <span className={stat.freeYearsAfter > 5 ? 'text-green-400' : stat.freeYearsAfter > 0 ? 'text-yellow-400' : 'text-red-400'}>
                  {stat.withinLifetime
                    ? `${Math.round(stat.freeYearsAfter)} ${t.freeYears}`
                    : t.alreadyPast
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stark Reality Message */}
      {propertyStats.some(s => !s.withinLifetime) && (
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-center">
          <p className="text-red-400 font-medium">
            {locale === 'ru'
              ? `В ${cityName} некоторые квартиры недостижимы за одну человеческую жизнь`
              : `In ${cityName}, some properties are unreachable within a single human lifetime`
            }
          </p>
        </div>
      )}
    </div>
  );
}
