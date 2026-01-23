'use client';

/**
 * CityMarker component for rendering a city marker on the map.
 * Uses the Marker component from react-simple-maps.
 */

import { Marker } from 'react-simple-maps';
import type { CityIndex, Region } from '@/types';

/**
 * Props for the CityMarker component.
 */
interface CityMarkerProps {
  /** City data including coordinates and region */
  city: CityIndex;
  /** Whether this marker is currently selected */
  isSelected?: boolean;
  /** Callback when the marker is clicked */
  onClick?: () => void;
}

/**
 * Get the marker fill color based on the city's region.
 * CIS cities are amber, EU cities are blue, others are gray.
 */
function getRegionColor(region: Region): string {
  switch (region) {
    case 'cis':
      return '#f59e0b'; // amber-500
    case 'eu':
      return '#3b82f6'; // blue-500
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * City marker component for the interactive map.
 * Renders a colored circle at the city's coordinates with hover and selection states.
 */
export function CityMarker({ city, isSelected = false, onClick }: CityMarkerProps) {
  const baseColor = getRegionColor(city.region);
  const radius = isSelected ? 8 : 6;

  return (
    <Marker coordinates={[city.coordinates.lng, city.coordinates.lat]}>
      <g
        role="button"
        aria-label={`${city.name}, ${city.country}`}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        className="cursor-pointer"
        style={{ outline: 'none' }}
      >
        {/* Selection ring (shown when selected) */}
        {isSelected && (
          <circle
            r={radius + 4}
            fill="none"
            stroke={baseColor}
            strokeWidth={2}
            strokeOpacity={0.5}
          />
        )}

        {/* Main marker circle */}
        <circle
          r={radius}
          fill={baseColor}
          stroke="#ffffff"
          strokeWidth={2}
          className="transition-transform duration-150 hover:scale-125"
        />
      </g>
    </Marker>
  );
}
