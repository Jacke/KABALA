# Data Update Strategy

## Current State

All city data lives in `/src/data/cities.json` — a static JSON file with 86 cities. Data was manually researched and entered. There is no automated update mechanism.

## How Updates Would Work

### Option A: Manual Script (Recommended First Step)

**What to build:** A Node.js script (`scripts/update-data.ts`) that fetches data from APIs and overwrites `cities.json`.

**How it works:**
1. Script runs locally: `npx tsx scripts/update-data.ts`
2. Fetches cost-of-living data from an API for each city
3. Maps API response fields to our `CityMetrics` interface
4. Writes updated `cities.json`
5. You review the diff, commit, and deploy

**Code needed:** ~200-300 lines. One script, no app changes.

```
scripts/
  update-data.ts        # Main update script
  sources/
    rapidapi.ts         # RapidAPI TravelTables fetcher
    imf.ts              # IMF inflation fetcher
    worldbank.ts        # World Bank CPI fetcher
```

**When to run:** Monthly or quarterly. Cost-of-living data doesn't change fast.

### Option B: Automated Pipeline

**What to build:** GitHub Action that runs the update script on a schedule.

**How it works:**
1. Cron job runs monthly (e.g., 1st of each month)
2. Runs the same script from Option A
3. Opens a PR with the data changes
4. You review and merge

**Code needed:** Option A script + a `.github/workflows/update-data.yml` file (~30 lines).

### Option C: Runtime API (Not Recommended Yet)

Fetch data at request time or via ISR. This adds complexity (API keys in env, error handling, rate limits, caching layer) and is unnecessary until the app has real traffic. Static JSON is faster and more reliable.

---

## Data Sources — What Each Gives Us

### Tier 1: Free ($0/month)

#### IMF DataMapper API
- **What:** Country-level inflation rates (CPI)
- **Covers:** `inflation.json` — historical and forecast inflation by country
- **API:** `https://www.imf.org/external/datamapper/api/v1/PCPIPCH/{COUNTRY_CODE}`
- **Auth:** None required
- **Format:** JSON, no key needed
- **Update frequency:** Twice yearly (April, October)
- **Code needed:** ~50 lines to fetch and map to our `InflationDataPoint[]` type

#### World Bank API v2
- **What:** Annual inflation %, CPI index
- **Covers:** Same as IMF but with 1-2 year lag. Good for cross-validation.
- **API:** `https://api.worldbank.org/v2/countries/{CODE}/indicators/FP.CPI.TOTL.ZG?format=json`
- **Auth:** None required
- **Code needed:** ~40 lines

#### OECD Data
- **What:** Average wages by country (38 OECD members)
- **Covers:** Salary benchmarks — useful for validating our `SalaryMetrics`
- **Limitation:** Country-level only, not city-level
- **Code needed:** ~40 lines

#### Eurostat
- **What:** EU housing price indices, HICP inflation by category
- **Covers:** Property price trends, rent indices for EU cities
- **Limitation:** EU/EEA only, indices not absolute prices
- **Code needed:** ~60 lines

#### FRED API (US only)
- **What:** CPI by metro area, rent indices, shelter costs
- **Covers:** Detailed US city data (New York, etc.)
- **Auth:** Free API key (register at fred.stlouisfed.org)
- **Code needed:** ~50 lines

### Tier 2: Budget ($10-30/month)

#### RapidAPI — TravelTables
- **What:** Full cost-of-living data per city (8,000+ cities)
- **Covers:** ALL our `CityMetrics` fields — rent, property, food, transport, utilities, lifestyle, salary
- **API:** Standard REST via RapidAPI
- **Auth:** RapidAPI key
- **Free tier:** Limited requests/month (check current limits)
- **Paid tier:** $10-30/month for more requests
- **Code needed:** ~150 lines (main mapper from their format to ours)
- **This is the most practical single source for our use case**

### Tier 3: Production ($260/month)

#### Numbeo API
- **What:** The gold standard for cost-of-living data. 9,000+ cities.
- **Covers:** Maps almost 1:1 to our `CityMetrics` interface
- **API:** REST, JSON, query by city name or coordinates
- **Auth:** API key ($260/month single user)
- **Historical data:** Back to 2009
- **Code needed:** ~100 lines (cleanest mapping since our model was inspired by Numbeo's categories)
- **Worth it when:** The project generates revenue or has significant traffic

---

## What Each Field Maps To

| Our Field | RapidAPI TravelTables | Numbeo API | Free Source |
|---|---|---|---|
| salary.average | Yes | Yes | OECD (country only) |
| rent.oneBedroom | Yes | Yes | — |
| rent.twoBedroom | Yes | Yes | — |
| rent.threeBedroom | Yes | Yes | — |
| property.cityCenter | Yes | Yes | — |
| property.buyCityCenter | Partial | Yes | — |
| food.groceries | Yes | Yes | — |
| food.restaurantMeal | Yes | Yes | — |
| transport.monthlyPass | Yes | Yes | — |
| utilities.basic | Yes | Yes | — |
| lifestyle.gymMembership | Yes | Yes | — |
| healthcare.doctorVisit | Partial | Yes | — |
| education.preschool | Partial | Yes | — |
| inflation history | — | — | IMF / World Bank |
| property price trends | — | — | Eurostat / FRED |

---

## Implementation Plan

### Phase 1: Inflation Auto-Update (Free, ~2 hours of code)

1. Create `scripts/update-inflation.ts`
2. Fetch from IMF API for all country codes in our data
3. Update `src/data/inflation.json`
4. Run manually: `npx tsx scripts/update-inflation.ts`

### Phase 2: City Data via RapidAPI (~4 hours of code)

1. Sign up for RapidAPI TravelTables (free tier)
2. Create `scripts/update-cities.ts`
3. For each city in `cities.json`, fetch latest data
4. Map API fields to our `CityMetrics` structure
5. Preserve fields that the API doesn't cover (tax, education)
6. Run manually or via GitHub Action

### Phase 3: Numbeo Integration (when budget allows)

1. Subscribe to Numbeo API ($260/month)
2. Replace RapidAPI fetcher with Numbeo fetcher
3. Gain access to historical data for trend analysis
4. Cleanest data quality available

---

## What NOT to Do

### Web Scraping
- Numbeo actively blocks scrapers
- Expatistan explicitly prohibits scraping in ToS
- Scrapers break constantly when sites update layouts
- Legal risk for commercial use
- Higher maintenance cost than just paying for an API

### Runtime API Calls
- Adds latency to page loads
- Requires API key management in production
- Rate limit risks under traffic
- Cost-of-living data changes monthly at most — static JSON is the right approach

---

## Quick Start

To implement Phase 1 (inflation updates), the script would look roughly like:

```typescript
// scripts/update-inflation.ts
const COUNTRIES = ['DE', 'GB', 'RU', 'US', 'ES', 'PT', ...];

async function fetchIMFInflation(countryCode: string) {
  const res = await fetch(
    `https://www.imf.org/external/datamapper/api/v1/PCPIPCH/${countryCode}`
  );
  const data = await res.json();
  // Returns { values: { PCPIPCH: { [country]: { [year]: rate } } } }
  return data.values.PCPIPCH[countryCode];
}

async function main() {
  const inflation = JSON.parse(fs.readFileSync('src/data/inflation.json', 'utf8'));

  for (const code of COUNTRIES) {
    const rates = await fetchIMFInflation(code);
    // Map to our format and update inflation.json
    inflation[code] = {
      ...inflation[code],
      inflation2025: rates['2025'],
      inflation2026: rates['2026'],
      inflation2027: rates['2027'],
    };
  }

  fs.writeFileSync('src/data/inflation.json', JSON.stringify(inflation, null, 2));
}
```

This is illustrative — the actual script would need error handling and our specific field mapping.
