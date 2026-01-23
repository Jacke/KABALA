---
phase: 02-data-layer
plan: 02
subsystem: data
tags: [json, data-loading, currency, utilities]

requires:
  - 02-01 (TypeScript types for city and metrics)
provides:
  - Sample city data (4 cities with complete metrics)
  - Data loading utilities (getAllCities, getCityById, getCityIndex, getCitiesByRegion)
  - Currency formatting utilities (formatMoney, formatCurrency, formatPercent)
affects: [03-map, 04-city-details, 05-rankings, 06-comparison, 07-calculator]

tech-stack:
  added: []
  patterns: [json-imports, intl-numberformat]

key-files:
  created: [src/data/cities.json, src/lib/data.ts, src/lib/currency.ts]
  modified: []

key-decisions:
  - "Direct JSON import for static data (no async loading needed)"
  - "Intl.NumberFormat for locale-aware currency formatting"
  - "Currency locale mapping for proper symbol placement"
  - "formatPercent auto-detects decimal vs percentage input"

patterns-established:
  - "City data stored in src/data/cities.json"
  - "Data access through typed functions in src/lib/data.ts"
  - "Currency formatting via src/lib/currency.ts"

issues-created: []

duration: 8min
completed: 2026-01-23
---

# Phase 2 Plan 02: Data Loading Utilities and Sample Cities

**Sample city data and utilities for accessing and formatting city metrics**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-01-23
- **Completed:** 2026-01-23
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Created sample data for 4 cities (Berlin, Lisbon, Moscow, Tbilisi)
- Built data loading utilities with full TypeScript typing
- Implemented currency formatting with locale awareness
- Phase 2 Data Layer complete

## Task Commits

1. **Task 1: Create sample city data JSON** - `de84ee1` (feat)
2. **Task 2: Create data loading utilities** - `c613a50` (feat)
3. **Task 3: Create currency formatting utilities** - `8cbd9cd` (feat)

## Files Created

### src/data/cities.json
Sample data for 4 cities:
- **Berlin** (Germany, EU): EUR currency, ~3500 EUR avg salary
- **Lisbon** (Portugal, EU): EUR currency, ~1400 EUR avg salary
- **Moscow** (Russia, CIS): RUB currency, ~120000 RUB avg salary
- **Tbilisi** (Georgia, CIS): GEL currency, ~3500 GEL avg salary

Each city includes:
- Complete metrics (salary, rent, property, food, transport, utilities, lifestyle, education, healthcare)
- 3 years of historical data (averageSalary, rentOneBedroom, inflation)
- All MoneyAmount fields with local and USD values

### src/lib/data.ts
Data loading utilities:
- `getAllCities()`: Returns all cities with metrics
- `getCityById(id)`: Find city by slug
- `getCityIndex()`: Lightweight list for navigation/maps
- `getCitiesByRegion(region)`: Filter by cis/eu/other

### src/lib/currency.ts
Currency formatting utilities:
- `formatMoney(amount, currencyCode, showBoth)`: Format MoneyAmount
- `formatCurrency(value, currencyCode)`: Format any number with currency
- `formatPercent(value)`: Format percentage with sign

## Verification

- [x] `npm run build` succeeds
- [x] cities.json contains 4 cities with complete metrics
- [x] Data loading functions return typed arrays
- [x] Currency formatting produces readable output
- [x] No TypeScript errors

## Deviations from Plan

None. All tasks completed as specified.

## Phase 2 Complete

The Data Layer phase is now complete:
- **Plan 02-01**: TypeScript types for cities and metrics
- **Plan 02-02**: Sample data and utilities

Ready for dependent phases:
- Phase 3: Map Visualization (uses CityIndex for markers)
- Phase 4: City Details (uses CityWithMetrics)
- Phase 5: Rankings Table (uses getAllCities)

---
*Phase: 02-data-layer*
*Completed: 2026-01-23*
