/**
 * Cost of living metrics types for the KABALA purchasing power dashboard.
 * These types define all the metric categories used to measure living costs.
 */

import type { TaxMetrics } from './tax';

/**
 * Monetary amount with dual currency representation.
 * Allows displaying values in both local currency and USD for comparison.
 */
export interface MoneyAmount {
  /** Value in local currency */
  local: number;
  /** Equivalent value in USD for comparison */
  usd: number;
}

/**
 * Monthly rent costs by apartment size.
 * All values represent monthly rent in city center.
 */
export interface RentMetrics {
  /** Monthly rent for a studio apartment (optional) */
  studio?: MoneyAmount;
  /** Monthly rent for a 1-bedroom apartment */
  oneBedroom: MoneyAmount;
  /** Monthly rent for a 2-bedroom apartment */
  twoBedroom: MoneyAmount;
  /** Monthly rent for a 3-bedroom apartment */
  threeBedroom: MoneyAmount;
}

/**
 * Apartment purchase prices by bedroom count.
 */
export interface ApartmentPrices {
  /** 1-bedroom apartment price */
  oneBedroom: MoneyAmount;
  /** 2-bedroom apartment price */
  twoBedroom: MoneyAmount;
  /** 3-bedroom apartment price */
  threeBedroom: MoneyAmount;
}

/**
 * Real estate purchase prices.
 */
export interface PropertyMetrics {
  /** Price per sqm in city center */
  cityCenter: MoneyAmount;
  /** Price per sqm outside city center */
  outside: MoneyAmount;
  /** Apartment prices in city center (optional) */
  buyCityCenter?: ApartmentPrices;
  /** Apartment prices outside city center (optional) */
  buyOutside?: ApartmentPrices;
}

/**
 * Food and dining costs.
 */
export interface FoodMetrics {
  /** Average monthly grocery basket */
  groceries: MoneyAmount;
  /** Mid-range restaurant meal (per meal) */
  restaurantMeal: MoneyAmount;
  /** Fast food meal (per meal) */
  fastFood: MoneyAmount;
}

/**
 * Transportation costs.
 */
export interface TransportMetrics {
  /** Monthly public transport pass */
  monthlyPass: MoneyAmount;
  /** Taxi fare per kilometer */
  taxiPerKm: MoneyAmount;
  /** Gasoline price per liter */
  gasoline: MoneyAmount;
}

/**
 * Monthly utility costs for a typical 85sqm apartment.
 */
export interface UtilitiesMetrics {
  /** Basic utilities (electricity, heating, water, garbage) */
  basic: MoneyAmount;
  /** Internet service */
  internet: MoneyAmount;
  /** Mobile phone plan */
  mobile: MoneyAmount;
}

/**
 * Lifestyle and entertainment costs.
 */
export interface LifestyleMetrics {
  /** Monthly gym membership */
  gymMembership: MoneyAmount;
  /** Cinema ticket price */
  cinema: MoneyAmount;
  /** Cappuccino at a cafe */
  cappuccino: MoneyAmount;
}

/**
 * Education costs.
 * All fields optional as not all cities have comparable data.
 */
export interface EducationMetrics {
  /** Monthly preschool/daycare cost */
  preschool?: MoneyAmount;
  /** Yearly international school tuition */
  internationalSchool?: MoneyAmount;
}

/**
 * Healthcare costs.
 */
export interface HealthcareMetrics {
  /** General doctor visit cost */
  doctorVisit: MoneyAmount;
  /** Average monthly cost for basic medications */
  medicationBasic: MoneyAmount;
}

/**
 * Salary and income metrics.
 * All values represent monthly net income.
 */
export interface SalaryMetrics {
  /** Average monthly net salary */
  average: MoneyAmount;
  /** Median monthly net salary (optional) */
  median?: MoneyAmount;
  /** Minimum monthly net salary (optional) */
  minimum?: MoneyAmount;
}

/**
 * Complete set of cost of living metrics for a city.
 */
export interface CityMetrics {
  /** Salary and income data */
  salary: SalaryMetrics;
  /** Rental costs */
  rent: RentMetrics;
  /** Property purchase prices */
  property: PropertyMetrics;
  /** Food and dining costs */
  food: FoodMetrics;
  /** Transportation costs */
  transport: TransportMetrics;
  /** Utility costs */
  utilities: UtilitiesMetrics;
  /** Lifestyle and entertainment costs */
  lifestyle: LifestyleMetrics;
  /** Education costs (optional) */
  education?: EducationMetrics;
  /** Healthcare costs */
  healthcare: HealthcareMetrics;
  /** Tax information (optional) */
  tax?: TaxMetrics;
  /** ISO date string when data was last updated */
  updatedAt: string;
  /** Data source attributions (optional) */
  sources?: string[];
}

/**
 * Single data point in historical time series.
 */
export interface HistoricalDataPoint {
  /** Year of the data point */
  year: number;
  /** Value at this point in time */
  value: MoneyAmount;
}

/**
 * Inflation rate data point.
 */
export interface InflationDataPoint {
  /** Year of the inflation rate */
  year: number;
  /** Annual inflation rate as a percentage */
  rate: number;
}

/**
 * Historical metrics for trend analysis.
 * Contains yearly snapshots of key metrics.
 */
export interface HistoricalMetrics {
  /** Historical average salary data */
  averageSalary?: HistoricalDataPoint[];
  /** Historical 1-bedroom rent data */
  rentOneBedroom?: HistoricalDataPoint[];
  /** Historical property price data */
  propertyPrice?: HistoricalDataPoint[];
  /** Historical inflation rates */
  inflation?: InflationDataPoint[];
}
