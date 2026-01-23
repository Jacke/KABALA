# KABALA

## What This Is

A public dashboard for comparing purchasing power across cities worldwide. Users can explore cost of living data on an interactive map, compare cities side-by-side, and calculate how their current budget would translate to other locations. Initial focus on CIS + EU cities.

## Core Value

Help people understand what their money is worth in different cities — not just prices, but real purchasing power considering all living expenses.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interactive 2D world map with clickable city points
- [ ] City data cards showing: salary, rent (1/2/3 bed), property prices, food, transport, utilities, internet, education, healthcare, entertainment
- [ ] Sortable city rankings table with key metrics
- [ ] City comparison mode (2 cities, multiple cities, vs "home" base city)
- [ ] Full budget calculator: input all current expenses → see equivalent needed in target city
- [ ] Historical data with long-term trends (multi-year charts for inflation, prices)
- [ ] Dual currency display (local + USD)
- [ ] Shareable URLs for comparisons
- [ ] OG meta previews for social sharing
- [ ] Data management via JSON/CSV files
- [ ] Initial dataset: CIS + EU cities

### Out of Scope

- User accounts/registration — public anonymous access only
- Mobile app — web only, responsive design sufficient
- Analytics tracking — not in v1
- SEO optimization — users come via direct links
- Localization — English only interface
- Paid API integrations — use free/open data sources only

## Context

**Target audience:** Anyone considering relocation, remote workers comparing cities, people curious about global cost of living differences.

**Data sources:** Free APIs and open data (scraping if needed), with manual corrections. No paid services like Numbeo API.

**Initial cities:** Focus on CIS (Moscow, Kyiv, Minsk, Almaty, Tbilisi, Yerevan, Baku) and EU (Berlin, Warsaw, Prague, Budapest, Lisbon, Barcelona, Amsterdam, Vienna).

**Visual approach:** Clean, modern dashboard design. Focus on data clarity and usability.

## Constraints

- **Hosting**: Railway — simple deployment, good free tier
- **Data**: Free sources only — no paid API subscriptions
- **Budget**: Minimize costs — free/open tools where possible
- **Domain**: Start with Railway subdomain, custom domain later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 2D map over 3D globe | Simpler, more practical for data exploration | — Pending |
| JSON/CSV for data | Direct file editing without admin UI complexity | — Pending |
| No user accounts | Reduces complexity, privacy-friendly | — Pending |
| English only | International reach, simpler i18n | — Pending |
| Free data sources | Cost control, sustainability | — Pending |

---
*Last updated: 2026-01-23 after initialization*
