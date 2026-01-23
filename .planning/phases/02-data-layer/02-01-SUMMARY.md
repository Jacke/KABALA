---
phase: 02-data-layer
plan: 01
subsystem: data
tags: [typescript, types, data-models]

requires:
  - 01-foundation (project structure, TypeScript config)
provides:
  - City data types (City, CityIndex, CityWithMetrics)
  - Cost of living metrics types (CityMetrics, MoneyAmount, etc.)
  - Barrel export from @/types
affects: [02-02, 03-map, 04-city-details, 05-rankings]

tech-stack:
  added: []
  patterns: [barrel-exports, jsdoc-comments]

key-files:
  created: [src/types/city.ts, src/types/metrics.ts, src/types/index.ts]
  modified: []

key-decisions:
  - "Used interfaces over types for extensibility"
  - "MoneyAmount always includes both local and USD for comparison"
  - "Region type for filtering (cis, eu, other)"
  - "CityIndex for lightweight list/map references"
  - "Comprehensive JSDoc comments for all types"

patterns-established:
  - "Barrel export from @/types for all type imports"
  - "Dual currency representation (MoneyAmount)"
  - "Historical data as separate optional HistoricalMetrics"

issues-created: []

duration: 5min
completed: 2026-01-23
---

# Phase 2 Plan 01: City Data Schema and TypeScript Types

**Comprehensive TypeScript type definitions for city data and cost of living metrics**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-01-23
- **Completed:** 2026-01-23
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- Created core city types (City, CityIndex, CityWithMetrics)
- Created comprehensive metrics types covering all cost categories
- Created historical data types for trend analysis
- Established barrel export pattern from @/types

## Task Commits

1. **Task 1: Create core city types** - `544f0d1` (feat)
2. **Task 2: Create metrics types** - `08fce47` (feat)
3. **Task 3: Create barrel export** - `09193a8` (feat)

## Files Created

### src/types/city.ts
Core city data types:
- `Currency` - ISO 4217 currency info
- `Coordinates` - lat/lng for map
- `Region` - geographic region type (cis | eu | other)
- `City` - full city data
- `CityIndex` - lightweight reference
- `CityWithMetrics` - city with full metrics

### src/types/metrics.ts
Cost of living metrics:
- `MoneyAmount` - dual currency (local + USD)
- `SalaryMetrics` - income data
- `RentMetrics` - rental costs by bedroom count
- `PropertyMetrics` - real estate prices
- `FoodMetrics` - groceries and dining
- `TransportMetrics` - public transit, taxi, gas
- `UtilitiesMetrics` - electricity, internet, mobile
- `LifestyleMetrics` - gym, cinema, coffee
- `EducationMetrics` - preschool, schools
- `HealthcareMetrics` - doctor visits, medications
- `CityMetrics` - combines all categories
- `HistoricalDataPoint` - time series data point
- `InflationDataPoint` - yearly inflation rate
- `HistoricalMetrics` - historical trends

### src/types/index.ts
Barrel export for all types, enabling `import { ... } from '@/types'`

## Type Coverage

All metrics from PROJECT.md requirements are covered:
- [x] Salary (average, median, minimum)
- [x] Rent (studio, 1/2/3 bedroom)
- [x] Property prices (city center, outside)
- [x] Food (groceries, restaurant, fast food)
- [x] Transport (monthly pass, taxi, gasoline)
- [x] Utilities (basic, internet, mobile)
- [x] Lifestyle (gym, cinema, coffee)
- [x] Education (preschool, international school)
- [x] Healthcare (doctor visit, medications)
- [x] Historical data (salary, rent, property, inflation trends)
- [x] Dual currency (local + USD via MoneyAmount)

## Verification

- [x] `npx tsc --noEmit` passes without errors
- [x] All interfaces documented with JSDoc
- [x] Types cover all metrics from PROJECT.md requirements
- [x] Barrel export from `@/types` works
- [x] `npm run build` succeeds

## Deviations from Plan

None. All tasks completed as specified.

## Next Phase Readiness

- Types ready for data loading utilities (Plan 02-02)
- CityIndex ready for map markers
- CityWithMetrics ready for detail views
- MoneyAmount pattern established for all monetary values

---
*Phase: 02-data-layer*
*Completed: 2026-01-23*
