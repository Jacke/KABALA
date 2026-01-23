# Roadmap: KABALA

## Overview

Build a public purchasing power dashboard from foundation to deployment. Start with project setup and data architecture, then build core features (map, details, rankings), add comparison and calculator tools, implement historical trends and sharing, collect real city data, and deploy to Railway.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Foundation** - Project setup, Next.js, tooling, basic structure
- [x] **Phase 2: Data Layer** - JSON/CSV schema, city data models, sample data
- [ ] **Phase 3: Map Visualization** - Interactive 2D map with clickable city markers
- [ ] **Phase 4: City Details** - City data cards with all metrics
- [ ] **Phase 5: Rankings Table** - Sortable city list with key metrics
- [ ] **Phase 6: City Comparison** - Compare cities (2, multiple, vs home base)
- [ ] **Phase 7: Budget Calculator** - Full expense input and conversion calculator
- [ ] **Phase 8: Historical Data** - Multi-year charts for prices and inflation
- [ ] **Phase 9: Sharing Features** - Shareable URLs, OG meta previews
- [ ] **Phase 10: Data Collection** - Populate CIS + EU city data from free sources
- [ ] **Phase 11: Polish & Launch** - UI refinement, Railway deployment

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
- [ ] 03-01: Map component with city markers
- [ ] 03-02: City hover tooltips and click interactions

### Phase 4: City Details
**Goal**: Detailed city cards showing all metrics (salary, rent, property, food, etc.)
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [ ] 04-01: City detail page/modal with all metrics
- [ ] 04-02: Metric formatting and currency display

### Phase 5: Rankings Table
**Goal**: Sortable table of cities with key metrics, filtering options
**Depends on**: Phase 2
**Research**: Unlikely (standard table patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: Rankings table with sorting
- [ ] 05-02: Filters and column customization

### Phase 6: City Comparison
**Goal**: Compare 2+ cities side-by-side, set home base city for relative comparisons
**Depends on**: Phases 4, 5
**Research**: Unlikely (internal logic)
**Plans**: TBD

Plans:
- [ ] 06-01: Two-city comparison view
- [ ] 06-02: Multi-city comparison and home base selection

### Phase 7: Budget Calculator
**Goal**: Input current expenses, calculate equivalent budget needed in target city
**Depends on**: Phase 2
**Research**: Unlikely (internal logic)
**Plans**: TBD

Plans:
- [ ] 07-01: Expense input form
- [ ] 07-02: Budget conversion calculations and results display

### Phase 8: Historical Data
**Goal**: Multi-year charts showing price trends, inflation rates
**Depends on**: Phase 2
**Research**: Likely (charting library)
**Research topics**: React charting libraries (Recharts vs Chart.js vs Nivo), time series visualization, responsive charts
**Plans**: TBD

Plans:
- [ ] 08-01: Historical data schema extension
- [ ] 08-02: Trend charts and visualizations

### Phase 9: Sharing Features
**Goal**: Shareable URLs for comparisons, OG meta tags for social previews
**Depends on**: Phases 6, 7
**Research**: Likely (OG generation)
**Research topics**: Dynamic OG image generation (Vercel OG vs satori), URL state management, meta tag handling in Next.js
**Plans**: TBD

Plans:
- [ ] 09-01: URL state for comparisons
- [ ] 09-02: OG image generation and meta tags

### Phase 10: Data Collection
**Goal**: Populate database with real data for CIS + EU cities from free sources
**Depends on**: Phase 2
**Research**: Likely (data sources)
**Research topics**: Free cost of living APIs, open datasets (World Bank, Eurostat), scraping strategies, data validation
**Plans**: TBD

Plans:
- [ ] 10-01: Research and identify data sources
- [ ] 10-02: Data collection scripts
- [ ] 10-03: CIS cities data population
- [ ] 10-04: EU cities data population

### Phase 11: Polish & Launch
**Goal**: Final UI polish, Railway deployment, production readiness
**Depends on**: All previous phases
**Research**: Likely (deployment)
**Research topics**: Railway deployment for Next.js, environment variables, custom domain setup
**Plans**: TBD

Plans:
- [ ] 11-01: UI polish and responsive fixes
- [ ] 11-02: Railway deployment and production config

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-01-23 |
| 2. Data Layer | 2/2 | Complete | 2026-01-23 |
| 3. Map Visualization | 0/2 | Not started | - |
| 4. City Details | 0/2 | Not started | - |
| 5. Rankings Table | 0/2 | Not started | - |
| 6. City Comparison | 0/2 | Not started | - |
| 7. Budget Calculator | 0/2 | Not started | - |
| 8. Historical Data | 0/2 | Not started | - |
| 9. Sharing Features | 0/2 | Not started | - |
| 10. Data Collection | 0/4 | Not started | - |
| 11. Polish & Launch | 0/2 | Not started | - |
