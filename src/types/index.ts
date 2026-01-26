/**
 * KABALA Type Definitions
 *
 * Central export point for all TypeScript types.
 * Import types from '@/types' for consistent access throughout the application.
 *
 * @example
 * import { City, CityMetrics, MoneyAmount } from '@/types';
 */

// City types
export type {
  Currency,
  Coordinates,
  Region,
  City,
  CityIndex,
  CityWithMetrics,
} from './city';

// Metrics types
export type {
  MoneyAmount,
  RentMetrics,
  ApartmentPrices,
  PropertyMetrics,
  FoodMetrics,
  TransportMetrics,
  UtilitiesMetrics,
  LifestyleMetrics,
  EducationMetrics,
  HealthcareMetrics,
  SalaryMetrics,
  CityMetrics,
  HistoricalDataPoint,
  InflationDataPoint,
  HistoricalMetrics,
} from './metrics';

// Tax types
export type {
  TaxBracket,
  IncomeTaxConfig,
  SocialContributionsConfig,
  VatConfig,
  PropertyTaxConfig,
  TaxMetrics,
  TaxCalculationResult,
} from './tax';

// Inflation types
export type {
  CountryInflation,
  InflationData,
  TimeToHomeInput,
  TimeToHomeResult,
} from './inflation';
