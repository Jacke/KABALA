import inflationData from '@/data/inflation.json';
import type { CountryInflation, InflationData, TimeToHomeResult } from '@/types/inflation';
import type { CityWithMetrics } from '@/types/city';

const data = inflationData as InflationData;

export function getInflationData(countryCode: string): CountryInflation | null {
  return data.countries[countryCode] || null;
}

export function getAverageInflation(countryCode: string): number {
  const country = getInflationData(countryCode);
  if (!country) return 2.5; // Default global average
  return (country.inflation2025 + country.inflation2026 + country.inflation2027) / 3;
}

export function getPropertyGrowth(countryCode: string): number {
  const country = getInflationData(countryCode);
  if (!country) return 3.0; // Default
  return country.propertyGrowth2026;
}

export function getInflationSource(): { lastUpdated: string; source: string } {
  return {
    lastUpdated: data.lastUpdated,
    source: data.source,
  };
}

interface CalculationParams {
  currentSavings: number;
  monthlyContribution: number;
  propertyPrice: number;
  annualInflationRate: number;
  annualPropertyGrowth: number;
}

function calculateYearsToProperty(params: CalculationParams, withInflation: boolean): number {
  const { currentSavings, monthlyContribution, propertyPrice, annualInflationRate, annualPropertyGrowth } = params;

  if (currentSavings >= propertyPrice) return 0;
  if (monthlyContribution <= 0) return Infinity;

  const monthlyInflation = withInflation ? annualInflationRate / 100 / 12 : 0;
  const monthlyPropertyGrowth = withInflation ? annualPropertyGrowth / 100 / 12 : 0;

  let savings = currentSavings;
  let price = propertyPrice;
  let months = 0;
  const maxMonths = 100 * 12; // 100 years max

  while (savings < price && months < maxMonths) {
    // Savings grow by monthly contribution
    // With inflation scenario: savings lose value relative to property
    savings += monthlyContribution;

    // Property price grows
    price *= (1 + monthlyPropertyGrowth);

    // Adjust savings for real purchasing power loss (inflation > savings interest assumed)
    if (withInflation && monthlyInflation > 0) {
      // Assume savings earn ~2% annually (below inflation in most cases)
      const savingsGrowth = 0.02 / 12;
      const realLoss = monthlyInflation - savingsGrowth;
      if (realLoss > 0) {
        savings *= (1 - realLoss);
      }
    }

    months++;
  }

  if (months >= maxMonths) return Infinity;
  return months / 12;
}

export function calculateTimeToHome(
  city: CityWithMetrics,
  savingsUsd: number,
  monthlyContributionUsd: number,
  age: number
): TimeToHomeResult[] {
  const inflationRate = getAverageInflation(city.countryCode);
  const propertyGrowthRate = getPropertyGrowth(city.countryCode);

  // Calculate apartment prices - either from buyCityCenter or estimate from price per sqm
  const pricePerSqm = city.metrics.property.cityCenter;
  const buyPrices = city.metrics.property.buyCityCenter;

  const getPrice = (bedrooms: 1 | 2 | 3) => {
    // Average apartment sizes in sqm
    const sizes = { 1: 50, 2: 75, 3: 110 };
    const size = sizes[bedrooms];

    if (buyPrices) {
      const key = bedrooms === 1 ? 'oneBedroom' : bedrooms === 2 ? 'twoBedroom' : 'threeBedroom';
      return buyPrices[key];
    }

    // Estimate from price per sqm
    return {
      local: pricePerSqm.local * size,
      usd: pricePerSqm.usd * size,
    };
  };

  const properties = [
    {
      type: '1bed' as const,
      label: '1-Bedroom Apartment',
      price: getPrice(1),
    },
    {
      type: '2bed' as const,
      label: '2-Bedroom Apartment',
      price: getPrice(2),
    },
    {
      type: '3bed' as const,
      label: '3-Bedroom Apartment',
      price: getPrice(3),
    },
  ];

  return properties.map((prop) => {
    const priceUsd = prop.price.usd;
    const priceLocal = prop.price.local;

    const params: CalculationParams = {
      currentSavings: savingsUsd,
      monthlyContribution: monthlyContributionUsd,
      propertyPrice: priceUsd,
      annualInflationRate: inflationRate,
      annualPropertyGrowth: propertyGrowthRate,
    };

    const yearsNoInflation = calculateYearsToProperty(params, false);
    const yearsWithInflation = calculateYearsToProperty(params, true);

    const affordable = yearsWithInflation < 50;

    return {
      propertyType: prop.type,
      propertyLabel: prop.label,
      priceLocal,
      priceUsd,
      yearsWithoutInflation: Math.round(yearsNoInflation * 10) / 10,
      yearsWithInflation: Math.round(yearsWithInflation * 10) / 10,
      ageAtPurchaseNoInflation: Math.round((age + yearsNoInflation) * 10) / 10,
      ageAtPurchaseWithInflation: Math.round((age + yearsWithInflation) * 10) / 10,
      totalSavedNoInflation: Math.round(savingsUsd + monthlyContributionUsd * 12 * yearsNoInflation),
      totalSavedWithInflation: Math.round(savingsUsd + monthlyContributionUsd * 12 * yearsWithInflation),
      inflationRate,
      propertyGrowthRate,
      affordable,
    };
  });
}

// Currency conversion rates to USD (approximate)
export const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  RUB: 0.011,
  UAH: 0.024,
  BYN: 0.31,
  KZT: 0.002,
  GEL: 0.37,
  AZN: 0.59,
  AMD: 0.0025,
  UZS: 0.000078,
  PLN: 0.25,
  CZK: 0.044,
  HUF: 0.0027,
  THB: 0.029,
  JPY: 0.0067,
  SGD: 0.75,
  HKD: 0.13,
  KRW: 0.00072,
  CNY: 0.14,
  INR: 0.012,
  MYR: 0.22,
  VND: 0.00004,
  TWD: 0.031,
  IDR: 0.000063,
  PHP: 0.017,
  AED: 0.27,
};

export function convertToUsd(amount: number, currency: string): number {
  const rate = currencyRates[currency] || 1;
  return amount * rate;
}

export function getSupportedCurrencies(): { code: string; name: string }[] {
  return [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'KZT', name: 'Kazakh Tenge' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'TWD', name: 'Taiwan Dollar' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'AED', name: 'UAE Dirham' },
  ];
}

/**
 * Calculate minimum monthly savings needed to ever afford property
 * This is the breakeven point where savings growth matches price growth
 */
export function calculateMinimumMonthlySavings(
  propertyPriceUsd: number,
  currentSavingsUsd: number,
  annualPropertyGrowth: number,
  annualInflation: number
): number {
  // Monthly rates
  const monthlyPropertyGrowth = annualPropertyGrowth / 100 / 12;
  const monthlyInflation = annualInflation / 100 / 12;
  const savingsGrowth = 0.02 / 12; // Assume 2% annual savings interest
  const realLoss = Math.max(0, monthlyInflation - savingsGrowth);

  // To make progress, monthly contribution must exceed:
  // price growth + savings value loss
  // contribution > price * monthlyPropertyGrowth + savings * realLoss

  // At the start, minimum needed:
  const priceGrowthPerMonth = propertyPriceUsd * monthlyPropertyGrowth;
  const savingsLossPerMonth = currentSavingsUsd * realLoss;

  // Add 20% buffer to actually make meaningful progress
  const minimum = (priceGrowthPerMonth + savingsLossPerMonth) * 1.2;

  return Math.ceil(minimum / 100) * 100; // Round up to nearest 100
}
