/**
 * City data types for the KABALA purchasing power dashboard.
 * These types define the structure for city information used throughout the application.
 */

import type { CityMetrics, HistoricalMetrics } from './metrics';

/**
 * Currency information following ISO 4217 standard.
 */
export interface Currency {
  /** ISO 4217 currency code (e.g., "USD", "EUR", "RUB") */
  code: string;
  /** Currency symbol for display (e.g., "$", "€", "₽") */
  symbol: string;
  /** Full currency name (e.g., "US Dollar", "Euro", "Russian Ruble") */
  name: string;
}

/**
 * Geographic coordinates for map positioning.
 */
export interface Coordinates {
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
}

/**
 * Geographic region classification for filtering and grouping cities.
 */
export type Region = 'cis' | 'eu' | 'other';

/**
 * Core city data without metrics.
 * Contains all identifying and geographic information about a city.
 */
export interface City {
  /** Unique identifier (URL-safe slug, e.g., "berlin", "moscow") */
  id: string;
  /** Display name of the city */
  name: string;
  /** Country name */
  country: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "DE", "RU") */
  countryCode: string;
  /** Geographic region for filtering */
  region: Region;
  /** Geographic coordinates for map positioning */
  coordinates: Coordinates;
  /** Local currency used in this city */
  currency: Currency;
  /** City population (optional) */
  population?: number;
  /** IANA timezone identifier (e.g., "Europe/Berlin") */
  timezone?: string;
}

/**
 * Lightweight city reference for lists, maps, and quick lookups.
 * Contains minimal data needed for display in lists and map markers.
 */
export interface CityIndex {
  /** Unique identifier (URL-safe slug) */
  id: string;
  /** Display name of the city */
  name: string;
  /** Country name */
  country: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "DE", "RU") */
  countryCode: string;
  /** Geographic region for filtering */
  region: Region;
  /** Geographic coordinates for map positioning */
  coordinates: Coordinates;
}

/**
 * Complete city data including current metrics and optional historical data.
 * Used for detailed city views and comparisons.
 */
export interface CityWithMetrics extends City {
  /** Current cost of living metrics */
  metrics: CityMetrics;
  /** Historical data for trend analysis (optional) */
  historical?: HistoricalMetrics;
}
