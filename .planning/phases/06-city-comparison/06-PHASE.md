# Phase 6: City Comparison

## Goal
Enable users to compare 2+ cities side-by-side, with optional home base city for relative cost comparisons.

## Dependencies
- Phase 2: Data Layer (city data and types)
- Phase 4: City Details (metric display patterns)

## Plans

### Plan 06-01: Two-city comparison view
Build the core comparison interface for comparing two cities.

**Deliverables:**
- City selector dropdowns
- Side-by-side metric comparison layout
- Difference indicators (percentage, absolute)
- Visual highlighting (cheaper/more expensive)

### Plan 06-02: Multi-city comparison and home base
Extend to support 3+ cities and home base functionality.

**Deliverables:**
- Add/remove cities dynamically
- Home base city selection
- Relative comparison to home base
- URL state for shareable comparisons

## Success Criteria
- Compare any two cities side-by-side
- Clear visual indicators for differences
- Support for 3+ city comparison
- Home base relative comparisons
- URL reflects comparison state
- No TypeScript errors
- Build succeeds
