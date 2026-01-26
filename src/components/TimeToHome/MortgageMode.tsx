'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPropertyGrowth } from '@/lib/inflation';
import type { CityWithMetrics } from '@/types/city';

interface MortgageModeProps {
  savings: number;
  savingsUsd: number;
  monthlyContribution: number;
  monthlyContributionUsd: number;
  currency: string;
  age: number;
  city: CityWithMetrics;
}

interface MortgageResult {
  propertyType: '1bed' | '2bed' | '3bed';
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  yearsToDownPayment: number;
  totalInterestPaid: number;
  mortgageTerm: number;
  totalCost: number;
  ageAtPurchase: number;
  ageAtPayoff: number;
  affordable: boolean;
}

export function MortgageMode({ savings, savingsUsd, monthlyContribution, monthlyContributionUsd, currency, age, city }: MortgageModeProps) {
  const { locale } = useLanguage();
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(8);
  const [mortgageYears, setMortgageYears] = useState(25);

  const t = locale === 'ru' ? {
    title: 'Режим ипотеки',
    subtitle: 'Расчёт с первоначальным взносом и ипотекой',
    downPayment: 'Первоначальный взнос',
    mortgageRate: 'Ставка по ипотеке',
    mortgageTerm: 'Срок ипотеки',
    years: 'лет',
    yearShort: 'г',
    propertyPrice: 'Цена квартиры',
    downPaymentAmount: 'Первоначальный взнос',
    loanAmount: 'Сумма кредита',
    monthlyPayment: 'Ежемесячный платёж',
    yearsToSave: 'Копить на взнос',
    totalInterest: 'Переплата по процентам',
    totalCost: 'Итого заплатишь',
    ageAtPurchase: 'Возраст при покупке',
    ageAtPayoff: 'Возраст при закрытии',
    oneBed: '1-комнатная',
    twoBed: '2-комнатная',
    threeBed: '3-комнатная',
    canAfford: 'Можешь позволить',
    cantAfford: 'Не потянешь платёж',
    paymentTooHigh: 'Ежемесячный платёж выше твоих сбережений',
    warning: 'Это упрощённый расчёт. Реальные условия зависят от банка, кредитной истории и страны.',
    comparison: 'Сравнение с накоплением',
    mortgageWay: 'С ипотекой',
    savingsWay: 'Копить 100%',
    faster: 'быстрее',
    slower: 'дольше',
    butPayMore: 'но заплатишь больше на',
  } : {
    title: 'Mortgage Mode',
    subtitle: 'Calculate with down payment and mortgage',
    downPayment: 'Down payment',
    mortgageRate: 'Mortgage rate',
    mortgageTerm: 'Mortgage term',
    years: 'years',
    yearShort: 'y',
    propertyPrice: 'Property price',
    downPaymentAmount: 'Down payment',
    loanAmount: 'Loan amount',
    monthlyPayment: 'Monthly payment',
    yearsToSave: 'Years to save down payment',
    totalInterest: 'Total interest paid',
    totalCost: 'Total cost',
    ageAtPurchase: 'Age at purchase',
    ageAtPayoff: 'Age at payoff',
    oneBed: '1-Bedroom',
    twoBed: '2-Bedroom',
    threeBed: '3-Bedroom',
    canAfford: 'Can afford',
    cantAfford: 'Payment too high',
    paymentTooHigh: 'Monthly payment exceeds your savings capacity',
    warning: 'This is a simplified calculation. Actual terms depend on bank, credit history, and country.',
    comparison: 'Comparison with saving',
    mortgageWay: 'With mortgage',
    savingsWay: 'Save 100%',
    faster: 'faster',
    slower: 'slower',
    butPayMore: 'but pay more by',
  };

  const propertyLabels = {
    '1bed': t.oneBed,
    '2bed': t.twoBed,
    '3bed': t.threeBed,
  };

  const results = useMemo((): MortgageResult[] => {
    const pricePerSqm = city.metrics.property.cityCenter.usd;
    const buyPrices = city.metrics.property.buyCityCenter;
    const propertyGrowth = getPropertyGrowth(city.countryCode);

    const getPrice = (bedrooms: 1 | 2 | 3) => {
      const sizes = { 1: 50, 2: 75, 3: 110 };
      const size = sizes[bedrooms];
      if (buyPrices) {
        const key = bedrooms === 1 ? 'oneBedroom' : bedrooms === 2 ? 'twoBedroom' : 'threeBedroom';
        return buyPrices[key].usd;
      }
      return pricePerSqm * size;
    };

    const properties: { type: '1bed' | '2bed' | '3bed'; bedrooms: 1 | 2 | 3 }[] = [
      { type: '1bed', bedrooms: 1 },
      { type: '2bed', bedrooms: 2 },
      { type: '3bed', bedrooms: 3 },
    ];

    return properties.map(({ type, bedrooms }) => {
      const propertyPrice = getPrice(bedrooms);
      const downPayment = propertyPrice * (downPaymentPercent / 100);
      const loanAmount = propertyPrice - downPayment;

      // Calculate years to save down payment (with property growth)
      const monthlyGrowth = propertyGrowth / 100 / 12;
      const savingsGrowthRate = 0.04 / 12; // 4% annual savings growth

      let currentSavings = savingsUsd;
      let currentDownPayment = downPayment;
      let months = 0;
      const maxMonths = 50 * 12;

      while (currentSavings < currentDownPayment && months < maxMonths) {
        currentSavings += monthlyContributionUsd;
        currentSavings *= (1 + savingsGrowthRate);
        currentDownPayment *= (1 + monthlyGrowth);
        months++;
      }

      const yearsToDownPayment = months / 12;

      // Property price at time of purchase (grown)
      const futurePriceMultiplier = Math.pow(1 + propertyGrowth / 100, yearsToDownPayment);
      const futurePropertyPrice = propertyPrice * futurePriceMultiplier;
      const futureDownPayment = futurePropertyPrice * (downPaymentPercent / 100);
      const futureLoanAmount = futurePropertyPrice - futureDownPayment;

      // Calculate monthly mortgage payment (PMT formula)
      const monthlyRate = mortgageRate / 100 / 12;
      const numPayments = mortgageYears * 12;
      const monthlyPayment = monthlyRate > 0
        ? (futureLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
        : futureLoanAmount / numPayments;

      const totalPaid = monthlyPayment * numPayments;
      const totalInterestPaid = totalPaid - futureLoanAmount;
      const totalCost = futureDownPayment + totalPaid;

      const ageAtPurchase = age + yearsToDownPayment;
      const ageAtPayoff = ageAtPurchase + mortgageYears;

      // Can afford if monthly payment is less than monthly contribution
      const affordable = monthlyPayment <= monthlyContributionUsd * 1.2; // Allow 20% buffer

      return {
        propertyType: type,
        propertyPrice: futurePropertyPrice,
        downPayment: futureDownPayment,
        loanAmount: futureLoanAmount,
        monthlyPayment,
        yearsToDownPayment,
        totalInterestPaid,
        mortgageTerm: mortgageYears,
        totalCost,
        ageAtPurchase,
        ageAtPayoff,
        affordable,
      };
    });
  }, [city, savingsUsd, monthlyContributionUsd, age, downPaymentPercent, mortgageRate, mortgageYears]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-900/50 rounded-xl">
        {/* Down Payment */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.downPayment}: {downPaymentPercent}%</label>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Mortgage Rate */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.mortgageRate}: {mortgageRate}%</label>
          <input
            type="range"
            min={3}
            max={20}
            step={0.5}
            value={mortgageRate}
            onChange={(e) => setMortgageRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>3%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Mortgage Term */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.mortgageTerm}: {mortgageYears} {t.years}</label>
          <input
            type="range"
            min={10}
            max={30}
            step={5}
            value={mortgageYears}
            onChange={(e) => setMortgageYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>10</span>
            <span>30</span>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => (
          <div
            key={result.propertyType}
            className={`p-5 rounded-xl border ${
              result.affordable
                ? 'bg-gray-900/50 border-gray-700'
                : 'bg-red-950/30 border-red-800/50'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Property Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-white">{propertyLabels[result.propertyType]}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.affordable
                      ? 'bg-green-900/50 text-green-400'
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {result.affordable ? t.canAfford : t.cantAfford}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {t.propertyPrice}: ${Math.round(result.propertyPrice).toLocaleString()}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase">{t.downPaymentAmount}</p>
                  <p className="text-lg font-bold text-orange-400">${Math.round(result.downPayment).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{result.yearsToDownPayment.toFixed(1)} {t.years}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">{t.monthlyPayment}</p>
                  <p className={`text-lg font-bold ${result.affordable ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.round(result.monthlyPayment).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{mortgageYears} {t.years}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">{t.totalInterest}</p>
                  <p className="text-lg font-bold text-red-400">${Math.round(result.totalInterestPaid).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">{t.ageAtPayoff}</p>
                  <p className={`text-lg font-bold ${result.ageAtPayoff > 66 ? 'text-red-400' : 'text-white'}`}>
                    {Math.round(result.ageAtPayoff)}
                  </p>
                  <p className="text-xs text-gray-500">{t.yearShort}</p>
                </div>
              </div>
            </div>

            {/* Warning for unaffordable */}
            {!result.affordable && (
              <div className="mt-4 pt-4 border-t border-red-800/50">
                <p className="text-red-400 text-sm">
                  ⚠️ {t.paymentTooHigh} (${Math.round(result.monthlyPayment).toLocaleString()} &gt; ${Math.round(monthlyContributionUsd).toLocaleString()})
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center">
        ⚠️ {t.warning}
      </p>
    </div>
  );
}
