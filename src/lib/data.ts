/**
 * Data loading utilities for city data.
 * Provides typed access to the city data stored in JSON format.
 */

import type { CityWithMetrics, CityIndex, Region } from '@/types';
import citiesData from '@/data/cities.json';

/**
 * All cities with full metrics.
 * Typed cast from JSON import.
 */
const cities = citiesData as CityWithMetrics[];

/**
 * Get all cities with their complete metrics data.
 * @returns Array of all cities with metrics
 */
export function getAllCities(): CityWithMetrics[] {
  return cities;
}

/**
 * Find a city by its unique ID (slug).
 * @param id - City ID (e.g., "berlin", "moscow")
 * @returns City with metrics if found, undefined otherwise
 */
export function getCityById(id: string): CityWithMetrics | undefined {
  return cities.find((city) => city.id === id);
}

/**
 * Get a lightweight index of all cities for navigation and maps.
 * Contains only essential display data: id, name, country, countryCode, region, coordinates.
 * @returns Array of city index entries
 */
export function getCityIndex(): CityIndex[] {
  return cities.map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    region: city.region,
    coordinates: city.coordinates,
  }));
}

/**
 * Get cities filtered by geographic region.
 * @param region - Region to filter by ('cis', 'eu', or 'other')
 * @returns Array of cities in the specified region
 */
export function getCitiesByRegion(region: Region): CityWithMetrics[] {
  return cities.filter((city) => city.region === region);
}
