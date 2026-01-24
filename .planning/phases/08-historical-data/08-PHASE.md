# Phase 8: Historical Data

## Goal
Display multi-year trends for key metrics using charts, showing how costs and salaries have changed over time.

## Dependencies
- Phase 2: Data Layer (historical data types already defined)
- Phase 4: City Details (charts will be added to city pages)

## Existing Infrastructure
- HistoricalDataPoint type: { year, value: MoneyAmount }
- InflationDataPoint type: { year, rate }
- HistoricalMetrics: averageSalary, rentOneBedroom, propertyPrice, inflation
- Sample historical data exists for Berlin

## Plans

### Plan 08-01: Chart components
Install charting library and create reusable chart components.

**Deliverables:**
- Install Recharts
- TrendChart component for line charts
- InflationChart for bar charts
- Responsive, styled charts

### Plan 08-02: Integrate charts into city pages
Add historical charts to city detail pages.

**Deliverables:**
- Historical section on city page
- Salary trend chart
- Rent trend chart
- Inflation chart
- Handle cities without historical data

## Success Criteria
- Charts display correctly with historical data
- Responsive design works
- Cities without data show appropriate message
- No TypeScript errors
- Build succeeds
