'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';

// Format price in local currency
function formatLocalPrice(amount: number, currencySymbol: string): string {
  const formatted = amount >= 1000
    ? Math.round(amount).toLocaleString()
    : amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${currencySymbol}${formatted}`;
}

interface RentVsBuyProps {
  results: TimeToHomeResult[];
  city: CityWithMetrics;
  age: number;
}

export function RentVsBuy({ results, city, age }: RentVsBuyProps) {
  const { locale } = useLanguage();

  const t = locale === 'ru' ? {
    title: 'Сколько сгорит на аренде',
    subtitle: 'Пока копишь на квартиру, ты платишь арендодателю',
    monthlyRent: 'Аренда в месяц',
    yearsToSave: 'Копить на квартиру',
    totalRentPaid: 'Всего отдашь за аренду',
    propertyPrice: 'Цена квартиры',
    rentAsPercent: 'Аренда = % от цены квартиры',
    oneBed: '1-комнатная',
    twoBed: '2-комнатная',
    threeBed: '3-комнатная',
    years: 'лет',
    perMonth: '/мес',
    burned: 'сгорит',
    equivalentTo: 'Это эквивалентно',
    apartments: 'квартир(ы)',
    insight: 'Пока копишь на одну квартиру, ты отдашь в никуда стоимость',
    landlordGift: 'Подарок арендодателю',
    couldBuy: 'На эти деньги можно было бы купить',
    inCheaperCity: 'квартиру в более дешёвом городе',
    yearlyRent: 'Аренда за год',
    overYears: 'За {years} лет',
    rentGrowth: 'С учётом роста аренды ~3%/год',
  } : {
    title: 'How much burns on rent',
    subtitle: 'While saving for property, you\'re paying a landlord',
    monthlyRent: 'Monthly rent',
    yearsToSave: 'Years to save',
    totalRentPaid: 'Total rent paid',
    propertyPrice: 'Property price',
    rentAsPercent: 'Rent = % of property price',
    oneBed: '1-Bedroom',
    twoBed: '2-Bedroom',
    threeBed: '3-Bedroom',
    years: 'years',
    perMonth: '/mo',
    burned: 'burned',
    equivalentTo: 'This is equivalent to',
    apartments: 'apartment(s)',
    insight: 'While saving for one apartment, you\'ll throw away the cost of',
    landlordGift: 'Gift to landlord',
    couldBuy: 'With this money you could buy',
    inCheaperCity: 'an apartment in a cheaper city',
    yearlyRent: 'Yearly rent',
    overYears: 'Over {years} years',
    rentGrowth: 'Accounting for ~3%/year rent growth',
  };

  const propertyLabels = {
    '1bed': t.oneBed,
    '2bed': t.twoBed,
    '3bed': t.threeBed,
  };

  const rentData = useMemo(() => {
    // Get current monthly rent from city data
    const rentPrices = {
      '1bed': city.metrics.rent.oneBedroom.usd,
      '2bed': city.metrics.rent.threeBedroom?.usd || city.metrics.rent.oneBedroom.usd * 1.6,
      '3bed': city.metrics.rent.threeBedroom?.usd || city.metrics.rent.oneBedroom.usd * 2.2,
    };

    const annualRentGrowth = 0.03; // 3% rent growth per year

    return results.map((result) => {
      const monthlyRent = rentPrices[result.propertyType];
      const yearsToSave = result.yearsWithInflation;

      // Calculate total rent paid over the saving period with rent growth
      let totalRentPaid = 0;
      let currentRent = monthlyRent;

      for (let year = 0; year < Math.min(yearsToSave, 100); year++) {
        totalRentPaid += currentRent * 12;
        currentRent *= (1 + annualRentGrowth);
      }

      // How many apartments this rent money could buy
      const apartmentEquivalent = totalRentPaid / result.priceUsd;

      // Rent as percentage of property price (annual)
      const yearlyRent = monthlyRent * 12;
      const rentYield = (yearlyRent / result.priceUsd) * 100;

      return {
        ...result,
        monthlyRent,
        totalRentPaid,
        apartmentEquivalent,
        rentYield,
        yearlyRent,
      };
    });
  }, [results, city]);

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔥 {t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Visual comparison cards */}
      <div className="grid grid-cols-1 gap-6">
        {rentData.map((data) => (
          <div
            key={data.propertyType}
            className="p-6 rounded-xl border border-orange-800/50 bg-gradient-to-br from-orange-950/30 to-red-950/30"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Property Info */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-4">{propertyLabels[data.propertyType]}</h4>

                {/* Rent Flow Visualization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-gray-400">{t.monthlyRent}</span>
                    <span className="text-orange-400 font-bold">${Math.round(data.monthlyRent).toLocaleString()}{t.perMonth}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-gray-400">{t.yearlyRent}</span>
                    <span className="text-orange-400 font-bold">${Math.round(data.yearlyRent).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-gray-400">{t.yearsToSave}</span>
                    <span className="text-white font-bold">{!isFinite(data.yearsWithInflation) ? '∞' : data.yearsWithInflation.toFixed(1)} {t.years}</span>
                  </div>
                </div>
              </div>

              {/* Burning Money Visual */}
              <div className="flex-1 text-center">
                <div className="p-6 bg-gradient-to-b from-red-900/40 to-orange-900/40 rounded-xl border border-red-700/30">
                  <div className="text-5xl mb-3">🔥💸🔥</div>
                  <p className="text-gray-400 text-sm mb-2">{t.totalRentPaid}</p>
                  <p className="text-4xl font-black text-red-400 mb-2">
                    {formatMoney(data.totalRentPaid)}
                  </p>
                  <p className="text-xs text-gray-500">{t.rentGrowth}</p>
                </div>

                {/* Comparison */}
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">{t.equivalentTo}</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {data.apartmentEquivalent.toFixed(1)} {t.apartments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.propertyPrice}: {formatLocalPrice(data.priceLocal, city.currency.symbol)}
                  </p>
                </div>
              </div>
            </div>

            {/* Insight */}
            {data.apartmentEquivalent >= 0.5 && (
              <div className="mt-4 pt-4 border-t border-orange-800/30">
                <p className="text-orange-300 text-sm text-center">
                  💡 {t.insight} <span className="font-bold text-orange-400">{data.apartmentEquivalent.toFixed(1)}</span> {t.apartments}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Banner */}
      <div className="p-5 bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-800/50 rounded-xl text-center">
        <p className="text-red-300 font-medium mb-2">
          {locale === 'ru'
            ? '💰 Аренда — это не "выбрасывание денег", это плата за жильё здесь и сейчас'
            : '💰 Rent isn\'t "throwing money away", it\'s paying for housing here and now'
          }
        </p>
        <p className="text-red-200/60 text-sm">
          {locale === 'ru'
            ? 'Но знать масштаб полезно для принятия решений о переезде или инвестициях'
            : 'But knowing the scale helps with relocation and investment decisions'
          }
        </p>
      </div>
    </div>
  );
}
