# Phase 5: Rankings Table

## Goal
Create a sortable table of cities with key metrics, allowing users to quickly compare and rank cities by various criteria.

## Dependencies
- Phase 2: Data Layer (city data and types)
- Phase 4: City Details (links to detail pages)

## Plans

### Plan 05-01: Rankings table with sorting
Build the core rankings table with sortable columns for key metrics.

**Deliverables:**
- RankingsTable component with columns for city, salary, rent, property
- Client-side sorting by any column (ascending/descending)
- Click-through to city detail pages
- Responsive table design

### Plan 05-02: Filters and column customization
Add filtering options and column visibility controls.

**Deliverables:**
- Region filter (All, CIS, EU)
- Column visibility toggles
- Metric selection (which metrics to display)
- URL state for filters (optional)

## Success Criteria
- Table displays all cities with key metrics
- Sorting works on all numeric columns
- Filters narrow down the city list
- Mobile-friendly table layout
- No TypeScript errors
- Build succeeds
