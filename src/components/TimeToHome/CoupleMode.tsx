'use client';

import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateTimeToHome, convertToUsd } from '@/lib/inflation';
import type { CityWithMetrics } from '@/types/city';
import type { TimeToHomeResult } from '@/types/inflation';

interface CoupleModeProps {
  savings: number;
  currency: string;
  monthlyContribution: number;
  age: number;
  city: CityWithMetrics;
  baseResults: TimeToHomeResult[];
}

export function CoupleMode({ savings, currency, monthlyContribution, age, city, baseResults }: CoupleModeProps) {
  const { locale } = useLanguage();

  // Partner inputs
  const [partnerSavings, setPartnerSavings] = useState(30000);
  const [partnerMonthly, setPartnerMonthly] = useState(2000);
  const [partnerAge, setPartnerAge] = useState(27);

  // Background color animation
  const [bgHue, setBgHue] = useState(330);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgHue(prev => (prev + 0.5) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const t = locale === 'ru' ? {
    title: 'Режим для пары',
    subtitle: 'Вместе — быстрее! Рассчитай, как совместный бюджет ускорит покупку',
    you: 'Ты',
    partner: 'Партнёр',
    together: 'Вместе',
    savings: 'Накопления',
    monthly: 'В месяц',
    age: 'Возраст',
    combined: 'Совместный бюджет',
    totalSavings: 'Общие накопления',
    totalMonthly: 'Общий доход',
    results: 'Результаты',
    alone: 'Один/одна',
    withPartner: 'С партнёром',
    years: 'лет',
    faster: 'быстрее',
    yearsSaved: 'лет экономии',
    loveBonus: 'Бонус любви',
    heartEmoji: '💕',
    oneBed: '1-комн.',
    twoBed: '2-комн.',
    threeBed: '3-комн.',
    power: 'Сила в единстве',
    benefit: 'Выгода от совместной покупки',
    tip: 'Два дохода — это не просто x2, это экспоненциальное ускорение благодаря большему первоначальному взносу',
  } : {
    title: 'Couple Mode',
    subtitle: 'Together is faster! Calculate how combined budget speeds up purchase',
    you: 'You',
    partner: 'Partner',
    together: 'Together',
    savings: 'Savings',
    monthly: 'Monthly',
    age: 'Age',
    combined: 'Combined budget',
    totalSavings: 'Total savings',
    totalMonthly: 'Total monthly',
    results: 'Results',
    alone: 'Alone',
    withPartner: 'With partner',
    years: 'years',
    faster: 'faster',
    yearsSaved: 'years saved',
    loveBonus: 'Love bonus',
    heartEmoji: '💕',
    oneBed: '1-bed',
    twoBed: '2-bed',
    threeBed: '3-bed',
    power: 'Power in unity',
    benefit: 'Benefit from buying together',
    tip: 'Two incomes aren\'t just 2x, it\'s exponential acceleration thanks to larger down payment',
  };

  const propertyLabels = {
    '1bed': t.oneBed,
    '2bed': t.twoBed,
    '3bed': t.threeBed,
  };

  // Calculate combined results
  const combinedResults = useMemo(() => {
    const yourSavingsUsd = convertToUsd(savings, currency);
    const yourContributionUsd = convertToUsd(monthlyContribution, currency);
    const partnerSavingsUsd = convertToUsd(partnerSavings, currency);
    const partnerContributionUsd = convertToUsd(partnerMonthly, currency);

    const totalSavings = yourSavingsUsd + partnerSavingsUsd;
    const totalMonthly = yourContributionUsd + partnerContributionUsd;
    const youngerAge = Math.min(age, partnerAge);

    return calculateTimeToHome(city, totalSavings, totalMonthly, youngerAge);
  }, [savings, currency, monthlyContribution, partnerSavings, partnerMonthly, age, partnerAge, city]);

  const yourSavingsUsd = convertToUsd(savings, currency);
  const yourContributionUsd = convertToUsd(monthlyContribution, currency);
  const partnerSavingsUsd = convertToUsd(partnerSavings, currency);
  const partnerContributionUsd = convertToUsd(partnerMonthly, currency);
  const totalSavingsUsd = yourSavingsUsd + partnerSavingsUsd;
  const totalMonthlyUsd = yourContributionUsd + partnerContributionUsd;

  // Floating hearts
  const hearts = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '🩷', '🧡', '💛'];

  return (
    <div
      className="space-y-6 relative overflow-hidden rounded-xl p-1"
      style={{
        background: `linear-gradient(135deg, hsl(${bgHue}, 60%, 15%) 0%, hsl(${(bgHue + 30) % 360}, 50%, 10%) 50%, hsl(${(bgHue + 60) % 360}, 40%, 12%) 100%)`,
      }}
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {hearts.map((heart, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.5,
            }}
          >
            {heart}
          </span>
        ))}
      </div>

      <div className="relative z-10 p-5">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            💕 {t.title} 💕
          </h3>
          <p className="text-pink-200/70 text-sm">{t.subtitle}</p>
        </div>

        {/* Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* You */}
          <div className="p-4 bg-pink-950/40 rounded-xl border border-pink-800/50 backdrop-blur-sm">
            <h4 className="text-pink-300 font-semibold mb-4 flex items-center gap-2">
              <span>👤</span> {t.you}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-pink-200/60">{t.savings}</label>
                <p className="text-white font-bold">${yourSavingsUsd.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs text-pink-200/60">{t.monthly}</label>
                <p className="text-white font-bold">${yourContributionUsd.toLocaleString()}/mo</p>
              </div>
              <div>
                <label className="text-xs text-pink-200/60">{t.age}</label>
                <p className="text-white font-bold">{age}</p>
              </div>
            </div>
          </div>

          {/* Partner */}
          <div className="p-4 bg-rose-950/40 rounded-xl border border-rose-800/50 backdrop-blur-sm">
            <h4 className="text-rose-300 font-semibold mb-4 flex items-center gap-2">
              <span>💖</span> {t.partner}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-rose-200/60 block mb-1">{t.savings}</label>
                <input
                  type="number"
                  value={partnerSavings}
                  onChange={(e) => setPartnerSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-rose-900/50 border border-rose-700/50 rounded-lg text-white text-sm"
                  min={0}
                  step={1000}
                />
              </div>
              <div>
                <label className="text-xs text-rose-200/60 block mb-1">{t.monthly}</label>
                <input
                  type="number"
                  value={partnerMonthly}
                  onChange={(e) => setPartnerMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-rose-900/50 border border-rose-700/50 rounded-lg text-white text-sm"
                  min={0}
                  step={100}
                />
              </div>
              <div>
                <label className="text-xs text-rose-200/60 block mb-1">{t.age}</label>
                <input
                  type="number"
                  value={partnerAge}
                  onChange={(e) => setPartnerAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-rose-900/50 border border-rose-700/50 rounded-lg text-white text-sm"
                  min={18}
                  max={80}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="p-4 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-rose-900/40 rounded-xl border border-pink-700/50 backdrop-blur-sm mb-6">
          <h4 className="text-white font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <span>💑</span> {t.combined}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-pink-200/60">{t.totalSavings}</p>
              <p className="text-2xl font-bold text-pink-300">${totalSavingsUsd.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-pink-200/60">{t.totalMonthly}</p>
              <p className="text-2xl font-bold text-pink-300">${totalMonthlyUsd.toLocaleString()}/mo</p>
            </div>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-center">{t.results}</h4>

          {baseResults.map((base, index) => {
            const combined = combinedResults[index];
            const yearsSaved = base.yearsWithInflation - combined.yearsWithInflation;
            const percentFaster = Math.round((yearsSaved / base.yearsWithInflation) * 100);

            return (
              <div
                key={base.propertyType}
                className="p-4 bg-black/30 rounded-xl border border-pink-800/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{propertyLabels[base.propertyType]}</span>
                  {yearsSaved > 0.5 && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full animate-pulse">
                      💕 -{percentFaster}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  {/* Alone */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t.alone}</p>
                    <p className="text-lg font-bold text-gray-400">
                      {!isFinite(base.yearsWithInflation) ? '∞' : base.yearsWithInflation.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">{t.years}</p>
                  </div>

                  {/* Arrow with hearts */}
                  <div className="flex items-center justify-center">
                    <span className="text-2xl">💕</span>
                  </div>

                  {/* Together */}
                  <div>
                    <p className="text-xs text-pink-300 mb-1">{t.withPartner}</p>
                    <p className="text-lg font-bold text-pink-400">
                      {!isFinite(combined.yearsWithInflation) ? '∞' : combined.yearsWithInflation.toFixed(1)}
                    </p>
                    <p className="text-xs text-pink-300/70">{t.years}</p>
                  </div>
                </div>

                {/* Years Saved */}
                {yearsSaved > 0.5 && (
                  <div className="mt-3 pt-3 border-t border-pink-800/30 text-center">
                    <p className="text-green-400 text-sm">
                      🎉 {yearsSaved.toFixed(1)} {t.yearsSaved}!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Love Tip */}
        <div className="mt-6 p-4 bg-pink-950/30 border border-pink-700/30 rounded-xl text-center">
          <p className="text-pink-200/70 text-sm">
            💝 {t.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
