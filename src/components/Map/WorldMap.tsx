'use client';

/**
 * WorldMap component for displaying an interactive world map with city markers.
 * Uses react-simple-maps for SVG-based rendering.
 */

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import type { CityIndex } from '@/types';
import { CityMarker } from './CityMarker';

/**
 * Natural Earth world TopoJSON for map data (110m resolution).
 * Hosted on jsDelivr CDN for reliable access.
 */
const WORLD_GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * Props for the WorldMap component.
 */
interface WorldMapProps {
  /** Array of cities to display as markers */
  cities: CityIndex[];
  /** Callback when a city marker is clicked */
  onCityClick?: (cityId: string) => void;
  /** ID of the currently selected city (for highlighting) */
  selectedCityId?: string;
}

/**
 * Interactive world map component with city markers.
 * Renders a Mercator projection map with pan/zoom support and clickable city markers.
 */
export function WorldMap({
  cities,
  onCityClick,
  selectedCityId,
}: WorldMapProps) {
  return (
    <div className="relative w-full bg-blue-50 rounded-lg overflow-hidden aspect-[2/1]">
      <ComposableMap
        projectionConfig={{
          center: [10, 50],
          scale: 150,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup minZoom={1} maxZoom={8}>
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
              onClick={onCityClick ? () => onCityClick(city.id) : undefined}
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
