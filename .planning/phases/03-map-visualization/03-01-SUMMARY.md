---
phase: 03-map-visualization
plan: 01
subsystem: ui
tags: [map, react-simple-maps, visualization, svg]

requires:
  - 02-02 (City data and getCityIndex function)
provides:
  - WorldMap component with city markers
  - CityMarker component with region-based colors
  - Barrel exports in src/components/Map/index.ts
affects: [03-02-tooltips, 04-city-details, home-page]

tech-stack:
  added: [react-simple-maps@3.0.0, d3-geo@3.1.1, @types/react-simple-maps, @types/d3-geo]
  patterns: [use-client-directive, svg-markers, topoJSON-from-cdn]

key-files:
  created: [src/components/Map/WorldMap.tsx, src/components/Map/CityMarker.tsx, src/components/Map/index.ts]
  modified: [package.json, src/app/page.tsx]

key-decisions:
  - "Used --legacy-peer-deps for react-simple-maps (peer expects React 16-18, we use React 19)"
  - "Natural Earth TopoJSON from jsDelivr CDN for reliable map data"
  - "Mercator projection centered on Europe [10, 50] with scale 150"
  - "Region-based marker colors: amber-500 for CIS, blue-500 for EU"

patterns-established:
  - "Map components use 'use client' directive for client-side rendering"
  - "Coordinates in [lng, lat] order for react-simple-maps Marker component"
  - "Barrel exports in index.ts for component directories"

issues-created: []

duration: 12min
completed: 2026-01-23
---

# Phase 3 Plan 01: Map Component with City Markers

**Interactive world map with clickable city markers using react-simple-maps**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-01-23
- **Completed:** 2026-01-23
- **Tasks:** 3 (+ homepage integration)
- **Files created:** 3
- **Files modified:** 2

## Accomplishments

- Installed react-simple-maps and d3-geo with TypeScript types
- Created WorldMap component with Natural Earth geography
- Created CityMarker component with region-based colors
- Integrated map on homepage with real city data
- All 4 cities display at correct coordinates

## Task Commits

1. **Task 1: Install react-simple-maps and dependencies** - `e1cc3b8` (feat)
2. **Task 2: Create WorldMap component** - `ab60c27` (feat)
3. **Task 3: Create CityMarker component with barrel export** - `fde4bb2` (feat)
4. **Verification: Integrate on homepage** - `751a702` (feat)

## Files Created

### src/components/Map/WorldMap.tsx
Main map component with:
- ComposableMap with Mercator projection
- ZoomableGroup for pan/zoom (1x to 8x)
- Geographies from Natural Earth TopoJSON
- Renders CityMarker for each city in props
- Light gray land, blue water background
- 2:1 aspect ratio container

### src/components/Map/CityMarker.tsx
City marker component with:
- Marker positioned at city coordinates [lng, lat]
- Circle fill color based on region
- Selected state: larger radius (8 vs 6), ring effect
- Hover state: scale animation
- Keyboard accessible with ARIA labels

### src/components/Map/index.ts
Barrel exports for clean imports:
- `export { WorldMap }`
- `export { CityMarker }`

## Verification

- [x] `npm run build` succeeds
- [x] Map renders with world geography
- [x] All 4 cities show markers at correct positions
- [x] Markers have correct colors (amber for CIS, blue for EU)
- [x] No TypeScript errors

## Deviations from Plan

1. **Added @types/react-simple-maps** - Auto-fix (Rule 1): TypeScript build failed without type declarations
2. **Homepage integration** - Auto-add (Rule 2): Necessary to verify components render correctly with real data

## Ready for Plan 03-02

The map is ready for tooltip and interaction layer:
- WorldMap accepts onCityClick callback
- WorldMap accepts selectedCityId prop
- CityMarker has hover/selected states

---
*Phase: 03-map-visualization*
*Completed: 2026-01-23*
