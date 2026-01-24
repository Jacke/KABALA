# Plan 05-01 Summary: Rankings Table with Sorting

## Completed

Built a sortable rankings table for comparing cities by key metrics.

### RankingsTable (`src/components/Rankings/RankingsTable.tsx`)
- Client component with useState for sort state
- Sortable columns: City name, Avg. Salary, 1BR Rent, Property/sqm
- Default sort: by salary (USD, descending)
- Sort direction toggles on repeated clicks
- Visual sort indicators (▲/▼) on active column
- Uses USD values for consistent cross-currency comparison
- Region badges (CIS: amber, EU: blue)
- City names link to detail pages

### Rankings Page (`src/app/rankings/page.tsx`)
- Server component that fetches all cities
- Passes data to client RankingsTable component
- SEO metadata for title and description

### Barrel Export (`src/components/Rankings/index.ts`)
- Exports RankingsTable component and props type

### Responsive Design
- Horizontal scroll container for mobile
- Hover effects on rows and headers
- Tabular-nums for number alignment
- Proper padding and dividers

## Verification

- [x] `npm run build` succeeds
- [x] /rankings shows table with all cities
- [x] Clicking column headers sorts data
- [x] Sort direction toggles on repeated clicks
- [x] City names link to detail pages
- [x] Table scrolls horizontally on mobile
- [x] No TypeScript errors

## Ready For

Plan 05-02: Filters and column customization.
