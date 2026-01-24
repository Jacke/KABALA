# Roadmap: KABALA

## Overview

Build a public purchasing power dashboard from foundation to deployment. Start with project setup and data architecture, then build core features (map, details, rankings), add comparison and calculator tools, implement historical trends and sharing, collect real city data, and deploy to Railway.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Foundation** - Project setup, Next.js, tooling, basic structure
- [x] **Phase 2: Data Layer** - JSON/CSV schema, city data models, sample data
- [x] **Phase 3: Map Visualization** - Interactive 2D map with clickable city markers
- [x] **Phase 4: City Details** - City data cards with all metrics
- [x] **Phase 5: Rankings Table** - Sortable city list with key metrics
- [x] **Phase 6: City Comparison** - Compare cities (2, multiple, vs home base)
- [x] **Phase 7: Budget Calculator** - Full expense input and conversion calculator
- [x] **Phase 8: Historical Data** - Multi-year charts for prices and inflation
- [x] **Phase 9: Sharing Features** - Shareable URLs, OG meta previews
- [x] **Phase 10: Data Collection** - Populate CIS + EU city data from free sources
- [x] **Phase 11: Polish & Launch** - UI refinement, Railway deployment

## Phase Details

### Phase 1: Foundation
**Goal**: Set up Next.js project with TypeScript, Tailwind CSS, and basic project structure
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established patterns)
**Plans**: TBD

Plans:
- [x] 01-01: Project initialization and tooling setup
- [x] 01-02: Layout components and routing structure

### Phase 2: Data Layer
**Goal**: Design and implement data schema for cities, create sample data files
**Depends on**: Phase 1
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Plans:
- [x] 02-01: City data schema and TypeScript types
- [x] 02-02: Data loading utilities and sample cities

### Phase 3: Map Visualization
**Goal**: Interactive 2D world map with city markers that show basic info on hover/click
**Depends on**: Phase 2
**Research**: Likely (library choice)
**Research topics**: React map libraries (Leaflet vs react-simple-maps vs Mapbox GL), marker clustering, performance with many points
**Plans**: TBD

Plans:
- [x] 03-01: Map component with city markers
- [x] 03-02: City hover tooltips and click interactions

### Phase 4: City Details
**Goal**: Detailed city cards showing all metrics (salary, rent, property, food, etc.)
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [x] 04-01: Metric display components (MetricCard, MetricSection)
- [x] 04-02: City detail page with all metrics

### Phase 5: Rankings Table
**Goal**: Sortable table of cities with key metrics, filtering options
**Depends on**: Phase 2
**Research**: Unlikely (standard table patterns)
**Plans**: TBD

Plans:
- [x] 05-01: Rankings table with sorting
- [x] 05-02: Filters and region filtering

### Phase 6: City Comparison
**Goal**: Compare 2+ cities side-by-side, set home base city for relative comparisons
**Depends on**: Phases 4, 5
**Research**: Unlikely (internal logic)
**Plans**: TBD

Plans:
- [x] 06-01: Two-city comparison view
- [x] 06-02: Multi-city comparison and home base selection

### Phase 7: Budget Calculator
**Goal**: Input current expenses, calculate equivalent budget needed in target city
**Depends on**: Phase 2
**Research**: Unlikely (internal logic)
**Plans**: TBD

Plans:
- [x] 07-01: Expense input form
- [x] 07-02: Budget conversion calculations and results display

### Phase 8: Historical Data
**Goal**: Multi-year charts showing price trends, inflation rates
**Depends on**: Phase 2
**Research**: Likely (charting library)
**Research topics**: React charting libraries (Recharts vs Chart.js vs Nivo), time series visualization, responsive charts
**Plans**: TBD

Plans:
- [x] 08-01: Chart components (Recharts, TrendChart, InflationChart)
- [x] 08-02: Integrate charts into city pages

### Phase 9: Sharing Features
**Goal**: Shareable URLs for comparisons, OG meta tags for social previews
**Depends on**: Phases 6, 7
**Research**: Likely (OG generation)
**Research topics**: Dynamic OG image generation (Vercel OG vs satori), URL state management, meta tag handling in Next.js
**Plans**: TBD

Plans:
- [x] 09-01: Enhanced metadata and calculator URL state
- [x] 09-02: OG image generation (homepage and city pages)

### Phase 10: Data Collection
**Goal**: Populate database with real data for CIS + EU cities from free sources
**Depends on**: Phase 2
**Research**: Likely (data sources)
**Research topics**: Free cost of living APIs, open datasets (World Bank, Eurostat), scraping strategies, data validation
**Plans**: TBD

Plans:
- [x] 10-01: Add CIS cities (Kyiv, Minsk, Almaty, Baku, Yerevan, Tashkent)
- [x] 10-02: Add EU cities (Paris, Madrid, Amsterdam, Vienna, Prague, Warsaw, Budapest, Rome)

### Phase 11: Polish & Launch
**Goal**: Final UI polish, Railway deployment, production readiness
**Depends on**: All previous phases
**Research**: Likely (deployment)
**Research topics**: Railway deployment for Next.js, environment variables, custom domain setup
**Plans**: TBD

Plans:
- [x] 11-01: UI polish and responsive fixes
- [x] 11-02: Railway deployment configuration

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-01-23 |
| 2. Data Layer | 2/2 | Complete | 2026-01-23 |
| 3. Map Visualization | 2/2 | Complete | 2026-01-23 |
| 4. City Details | 2/2 | Complete | 2026-01-24 |
| 5. Rankings Table | 2/2 | Complete | 2026-01-24 |
| 6. City Comparison | 2/2 | Complete | 2026-01-24 |
| 7. Budget Calculator | 2/2 | Complete | 2026-01-24 |
| 8. Historical Data | 2/2 | Complete | 2026-01-24 |
| 9. Sharing Features | 2/2 | Complete | 2026-01-24 |
| 10. Data Collection | 2/2 | Complete | 2026-01-24 |
| 11. Polish & Launch | 2/2 | Complete | 2026-01-24 |
