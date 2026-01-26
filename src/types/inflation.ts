export interface CountryInflation {
  name: string;
  inflation2025: number;
  inflation2026: number;
  inflation2027: number;
  propertyGrowth2026: number;
  notes: string;
}

export interface InflationData {
  lastUpdated: string;
  source: string;
  countries: Record<string, CountryInflation>;
}

export interface TimeToHomeInput {
  age: number;
  savings: number;
  savingsCurrency: string;
  monthlySalary: number;
  monthlyContribution: number;
  targetCityId: string;
}

export interface TimeToHomeResult {
  propertyType: '1bed' | '2bed' | '3bed';
  propertyLabel: string;
  priceLocal: number;
  priceUsd: number;
  yearsWithoutInflation: number;
  yearsWithInflation: number;
  ageAtPurchaseNoInflation: number;
  ageAtPurchaseWithInflation: number;
  totalSavedNoInflation: number;
  totalSavedWithInflation: number;
  inflationRate: number;
  propertyGrowthRate: number;
  affordable: boolean;
}
