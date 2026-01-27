# Data Update Strategy

## Current State

All city data lives in `/src/data/cities.json` (86 cities) and `/src/data/inflation.json` (43 countries). A single update script handles both.

## How It Works

### The Script: `scripts/update-data.ts`

A Node.js script that:
1. **Scrapes Numbeo** for cost-of-living data (rent, food, transport, utilities, salary, property prices, etc.)
2. **Fetches IMF DataMapper API** for country-level inflation rates (free, no key required)
3. Updates `cities.json` and `inflation.json` in place
4. You review the diff, commit, and deploy

### Usage

```bash
# Update all cities + inflation (full run)
npx tsx scripts/update-data.ts

# Preview without writing files
npx tsx scripts/update-data.ts --dry-run

# Update a single city
npx tsx scripts/update-data.ts --city berlin

# Update inflation data only
npx tsx scripts/update-data.ts --inflation
```

**When to run:** Monthly or quarterly. Cost-of-living data doesn't change fast. There's a 3-second delay between requests to avoid rate limiting.

---

## Data Sources

### Numbeo (Scraper — Free)

- **What:** Cost-of-living data for 9,000+ cities worldwide
- **Covers:** 26+ fields per city — rent, property prices per sqm, groceries, restaurants, transport, utilities, salary, gym, cinema, education
- **How:** Direct HTML scraping of public pages (`numbeo.com/cost-of-living/in/{City}?displayCurrency=USD`)
- **Auth:** None — public pages
- **Parsing:** Regex-based extraction of `<tr><td>` rows with price values
- **Reliability:** Tested on 86 cities, gets 24-26 fields per city. Some small suburbs may have limited data.

### IMF DataMapper API (Free)

- **What:** Country-level inflation rates (CPI, % change)
- **Covers:** Historical and forecast inflation (2020-2030) for all countries in our dataset
- **API:** `https://www.imf.org/external/datamapper/api/v1/PCPIPCH/{COUNTRY_CODE}`
- **Auth:** None required
- **Update frequency:** IMF updates data twice yearly (April WEO, October WEO)

---

## What Gets Updated

### From Numbeo

| Our Field | Numbeo Source |
|---|---|
| `salary.average` | Average Monthly Net Salary |
| `rent.oneBedroom` | 1 Bedroom Apartment in City Centre |
| `rent.twoBedroom` | Interpolated from 1-bed and 3-bed (45% of gap) |
| `rent.threeBedroom` | 3 Bedroom Apartment in City Centre |
| `property.cityCenter` | Price per Square Meter in City Centre |
| `property.buyCityCenter.*` | Calculated from sqm price (1bed=50sqm, 2bed=75sqm, 3bed=110sqm) |
| `property.outside` | Price per Square Meter Outside Centre |
| `property.buyOutside.*` | Same calculation for outside |
| `food.groceries` | Estimated from 14 individual grocery items |
| `food.restaurantMeal` | Meal at an Inexpensive Restaurant |
| `food.fastFood` | McDonald's Combo Meal |
| `transport.monthlyPass` | Monthly Public Transport Pass |
| `transport.taxiPerKm` | Taxi 1 km (Standard Tariff) |
| `transport.gasoline` | Gasoline (1 Liter) |
| `utilities.basic` | Basic Utilities for 85m² |
| `utilities.internet` | Broadband Internet |
| `utilities.mobile` | Mobile Phone Plan |
| `lifestyle.gymMembership` | Monthly Fitness Club |
| `lifestyle.cinema` | Cinema Ticket |
| `lifestyle.cappuccino` | Cappuccino (Regular) |
| `education.preschool` | Preschool/Kindergarten Monthly |
| `education.internationalSchool` | International Primary School Yearly |

### From IMF

| Our Field | IMF Source |
|---|---|
| `inflation2025` | CPI % change forecast for 2025 |
| `inflation2026` | CPI % change forecast for 2026 |
| `inflation2027` | CPI % change forecast for 2027 |
| `propertyGrowth2026` | Estimated from avg inflation × 1.3 |

### Not Updated (Manual)

These fields are NOT touched by the script and must be maintained manually:
- `tax` — Tax brackets, rates, deductions (country-specific tax law)
- `coordinates` — Latitude/longitude
- `region`, `country`, `countryCode`, `currency` — City metadata
- `population`, `costOfLivingIndex` — Summary stats

---

## Architecture

```
scripts/
  update-data.ts    # Single script: Numbeo scraper + IMF fetcher + JSON writer

src/data/
  cities.json       # 86 cities, updated by script
  inflation.json    # 43 countries, updated by script
```

The script is ~450 lines, no external dependencies beyond Node.js fetch API and `tsx` for TypeScript execution.

### Key Implementation Details

- **Numbeo URL slugs:** Most cities map directly (`Berlin` → `/in/Berlin`), but 30+ cities need overrides (e.g., `kyiv` → `Kiev`, `ho-chi-minh` → `Ho-Chi-Minh-City`, Russian suburbs → `Khimki-Russia`)
- **Currency conversion:** All Numbeo data is fetched in USD. Local currency values are derived from the existing exchange rate ratio in `cities.json` (calculated from `salary.local / salary.usd`)
- **Grocery estimation:** Monthly grocery cost is estimated from 14 individual item prices with realistic monthly quantities (8L milk, 4 loaves bread, 4kg chicken, etc.)
- **2-bedroom rent:** Not directly available on Numbeo; interpolated as 1-bed + 45% of (3-bed − 1-bed)
- **Apartment prices:** Calculated from price-per-sqm using standard sizes (1-bed=50sqm, 2-bed=75sqm, 3-bed=110sqm)
- **IMF country codes:** The script maps ISO 2-letter codes (DE, GB, US) to IMF 3-letter codes (DEU, GBR, USA)

---

## Future Improvements

### Automated Pipeline (GitHub Action)

Add `.github/workflows/update-data.yml` to run the script on a cron schedule and open a PR with changes:

```yaml
on:
  schedule:
    - cron: '0 6 1 * *'  # 1st of each month
  workflow_dispatch: {}

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx tsx scripts/update-data.ts
      - uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: update city data from Numbeo + IMF'
```

### Additional Free Sources

- **World Bank API v2** — Annual inflation with 1-2 year lag, good for cross-validation
- **OECD Data** — Average wages for 38 OECD members (country-level)
- **Eurostat** — EU housing price indices, HICP inflation by category
- **FRED API** — US metro area CPI, rent indices (free API key required)

### Numbeo API ($260/month)

If the project generates revenue, the official Numbeo API provides:
- JSON responses (no scraping needed)
- Historical data back to 2009
- Cleanest data quality
- Stable, documented endpoints
