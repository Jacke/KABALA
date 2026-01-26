'use client';

/**
 * WorldMap component for displaying an interactive world map with city markers.
 * Uses react-simple-maps for SVG-based rendering.
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import type { CityIndex, CityWithMetrics } from '@/types';
import { getCityById } from '@/lib/data';
import { CityMarker } from './CityMarker';
import { CityTooltip } from './CityTooltip';

/**
 * Natural Earth world TopoJSON for map data (110m resolution).
 * Hosted on jsDelivr CDN for reliable access.
 */
const WORLD_GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * State for the hovered city tooltip.
 */
interface HoveredCity {
  /** Full city data for tooltip display */
  city: CityWithMetrics;
  /** Mouse position for tooltip positioning */
  position: { x: number; y: number };
}

/**
 * Props for the WorldMap component.
 */
interface WorldMapProps {
  /** Array of cities to display as markers */
  cities: CityIndex[];
  /** ID of the currently selected city (for highlighting) */
  selectedCityId?: string;
  /** ID of the externally hovered city (from table, etc.) */
  hoveredCityId?: string | null;
  /** Map height */
  height?: number;
}

/** Default map center and zoom */
const DEFAULT_CENTER: [number, number] = [20, 45];
const DEFAULT_ZOOM = 1;
const HOVER_ZOOM = 3;

/**
 * Interactive world map component with city markers.
 * Renders a Mercator projection map with pan/zoom support and clickable city markers.
 * Shows tooltips on hover and navigates to city page on click.
 */
export function WorldMap({
  cities,
  selectedCityId,
  hoveredCityId: externalHoveredCityId,
  height = 280,
}: WorldMapProps) {
  const router = useRouter();
  const [hoveredCity, setHoveredCity] = useState<HoveredCity | null>(null);
  const [internalHoveredCityId, setInternalHoveredCityId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Use external hover if provided, otherwise use internal
  const hoveredCityId = externalHoveredCityId ?? internalHoveredCityId;

  // React to external hover changes - zoom to city
  useEffect(() => {
    if (externalHoveredCityId) {
      const city = cities.find((c) => c.id === externalHoveredCityId);
      if (city) {
        setMapCenter([city.coordinates.lng, city.coordinates.lat]);
        setMapZoom(HOVER_ZOOM);
      }
    } else if (externalHoveredCityId === null) {
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    }
  }, [externalHoveredCityId, cities]);

  /**
   * Handle mouse entering a city marker.
   */
  const handleCityMouseEnter = useCallback(
    (cityId: string, event: React.MouseEvent) => {
      const cityData = getCityById(cityId);
      if (cityData) {
        setHoveredCity({
          city: cityData,
          position: { x: event.clientX, y: event.clientY },
        });
      }
      setInternalHoveredCityId(cityId);
    },
    []
  );

  /**
   * Handle mouse leaving a city marker.
   */
  const handleCityMouseLeave = useCallback(() => {
    setHoveredCity(null);
    setInternalHoveredCityId(null);
  }, []);

  /**
   * Handle clicking a city marker.
   */
  const handleCityClick = useCallback(
    (cityId: string) => {
      router.push(`/city/${cityId}`);
    },
    [router]
  );

  return (
    <div className="relative w-full bg-blue-50 rounded-lg overflow-hidden" style={{ height }}>
      <ComposableMap
        projectionConfig={{
          center: [20, 45],
          scale: 220,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          center={mapCenter}
          zoom={mapZoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={({ coordinates, zoom }) => {
            setMapCenter(coordinates);
            setMapZoom(zoom);
          }}
        >
          <Geographies geography={WORLD_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#f3f4f6"
                  stroke="#d1d5db"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#e5e7eb' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {cities.map((city) => (
            <CityMarker
              key={city.id}
              city={city}
              isSelected={city.id === selectedCityId}
              isHovered={city.id === hoveredCityId}
              onClick={() => handleCityClick(city.id)}
              onMouseEnter={(e) => handleCityMouseEnter(city.id, e)}
              onMouseLeave={handleCityMouseLeave}
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip for hovered city */}
      {hoveredCity && (
        <CityTooltip city={hoveredCity.city} position={hoveredCity.position} />
      )}
    </div>
  );
}
