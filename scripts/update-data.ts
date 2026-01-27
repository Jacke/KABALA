#!/usr/bin/env npx tsx

/**
 * KABALA Data Updater
 *
 * Scrapes Numbeo for cost-of-living data and fetches IMF inflation data.
 * Updates src/data/cities.json and src/data/inflation.json.
 *
 * Usage:
 *   npx tsx scripts/update-data.ts              # update all cities
 *   npx tsx scripts/update-data.ts --city berlin # update one city
 *   npx tsx scripts/update-data.ts --inflation   # update inflation only
 *   npx tsx scripts/update-data.ts --dry-run     # preview without writing
 *   npx tsx scripts/update-data.ts --resume      # skip cities updated today
 *
 * Rate Limit Strategy:
 *   - Random delay 4-8s between requests
 *   - Rotating User-Agent headers
 *   - On 429: checks Retry-After header, waits with exponential backoff
 *   - Up to 3 retries per city, then saves progress and continues
 *   - Intermediate saves every 10 cities so progress isn't lost
 *   - --resume flag skips cities already updated today
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────

const CITIES_PATH = path.resolve(__dirname, '../src/data/cities.json');
const INFLATION_PATH = path.resolve(__dirname, '../src/data/inflation.json');

const MIN_DELAY_MS = 4000;  // minimum delay between requests
const MAX_DELAY_MS = 8000;  // maximum delay between requests
const MAX_RETRIES = 3;      // max retries per city on 429
const INITIAL_BACKOFF_MS = 30_000;  // first retry wait: 30s
const MAX_BACKOFF_MS = 300_000;     // max retry wait: 5 min
const SAVE_INTERVAL = 10;  // save progress every N cities

// Pool of realistic User-Agent strings
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

// Numbeo URL slug overrides for cities whose names don't match the URL pattern
const NUMBEO_SLUGS: Record<string, string> = {
  'kyiv': 'Kiev',
  'washington-dc': 'Washington',
  'ho-chi-minh': 'Ho-Chi-Minh-City',
  'sao-paulo': 'Sao-Paulo',
  'mexico-city': 'Mexico-City',
  'panama-city': 'Panama-City',
  'san-jose': 'San-Jose-Costa-Rica',
  'buenos-aires': 'Buenos-Aires',
  'new-york': 'New-York',
  'los-angeles': 'Los-Angeles',
  'san-francisco': 'San-Francisco',
  'san-diego': 'San-Diego',
  'kuala-lumpur': 'Kuala-Lumpur',
  'hong-kong': 'Hong-Kong',
  'milton-keynes': 'Milton-Keynes',
  'st-albans': 'St-Albans',
  'bogota': 'Bogota',
  'medellin': 'Medellin',
  'santiago': 'Santiago',
  // Russian suburbs
  'krasnogorsk': 'Krasnogorsk-Russia',
  'odintsovo': 'Odintsovo-Russia',
  'khimki': 'Khimki-Russia',
  'mytishchi': 'Mytishchi-Russia',
  'balashikha': 'Balashikha-Russia',
  'lyubertsy': 'Lyubertsy-Russia',
  'podolsk': 'Podolsk-Russia',
  'korolev': 'Korolev-Russia',
  'dolgoprudny': 'Dolgoprudny-Russia',
  'domodedovo': 'Domodedovo-Russia',
};

// ─── Helpers ──────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

function randomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function parseNumber(text: string): number | null {
  const cleaned = text.replace(/[^0-9.\-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function getCitySlug(cityId: string, cityName: string): string {
  if (NUMBEO_SLUGS[cityId]) return NUMBEO_SLUGS[cityId];
  return cityName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/\./g, '');
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Rate-limited fetch with retry ────────────────────────────────────

interface FetchResult {
  html: string | null;
  status: number;
  retryAfter: number | null;  // seconds from Retry-After header
  headers: Record<string, string>;
  rateLimited: boolean;
}

async function fetchWithAnalysis(url: string): Promise<FetchResult> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': randomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
      redirect: 'follow',
    });

    // Collect all headers for analysis
    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Parse Retry-After header
    let retryAfter: number | null = null;
    const retryHeader = headers['retry-after'];
    if (retryHeader) {
      const seconds = parseInt(retryHeader);
      if (!isNaN(seconds)) {
        retryAfter = seconds;
      } else {
        // Could be a date string
        const date = new Date(retryHeader);
        if (!isNaN(date.getTime())) {
          retryAfter = Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
        }
      }
    }

    const rateLimited = res.status === 429 || res.status === 403;

    if (!res.ok) {
      return { html: null, status: res.status, retryAfter, headers, rateLimited };
    }

    const html = await res.text();
    return { html, status: res.status, retryAfter, headers, rateLimited };
  } catch (err) {
    return { html: null, status: 0, retryAfter: null, headers: {}, rateLimited: false };
  }
}

async function fetchWithRetry(url: string, cityName: string): Promise<{ html: string | null; gaveUp: boolean }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await fetchWithAnalysis(url);

    // Success
    if (result.html) {
      return { html: result.html, gaveUp: false };
    }

    // Not rate limited — genuine error, don't retry
    if (!result.rateLimited) {
      if (result.status > 0) {
        console.log(`HTTP ${result.status}`);
      } else {
        console.log('NETWORK ERROR');
      }
      return { html: null, gaveUp: false };
    }

    // Rate limited — analyze and decide
    if (attempt === MAX_RETRIES) {
      const info = [`HTTP ${result.status}`];
      if (result.retryAfter) info.push(`Retry-After: ${formatDuration(result.retryAfter * 1000)}`);
      console.log(`RATE LIMITED (${info.join(', ')}) — gave up after ${MAX_RETRIES} retries`);
      return { html: null, gaveUp: true };
    }

    // Calculate wait time
    let waitMs: number;
    if (result.retryAfter) {
      // Server told us how long to wait — but cap it
      const serverWaitMs = result.retryAfter * 1000;
      waitMs = Math.min(serverWaitMs, MAX_BACKOFF_MS);
      console.log(`429 — Retry-After: ${formatDuration(serverWaitMs)}${serverWaitMs > MAX_BACKOFF_MS ? ` (capped to ${formatDuration(MAX_BACKOFF_MS)})` : ''}`);
    } else {
      // Exponential backoff: 30s, 60s, 120s
      waitMs = Math.min(INITIAL_BACKOFF_MS * Math.pow(2, attempt), MAX_BACKOFF_MS);
      // Add jitter (±20%)
      waitMs = waitMs * (0.8 + Math.random() * 0.4);
      console.log(`429 — no Retry-After header, backoff ${formatDuration(waitMs)}...`);
    }

    process.stdout.write(`  ⏳ [${cityName}] Retry ${attempt + 1}/${MAX_RETRIES} in ${formatDuration(waitMs)}...`);
    await sleep(waitMs);
    process.stdout.write(` retrying... `);
  }

  return { html: null, gaveUp: true };
}

// ─── Numbeo Scraper ───────────────────────────────────────────────────

interface NumbeoData {
  mealInexpensive?: number;
  mealMidRange?: number;
  mcdonalds?: number;
  cappuccino?: number;
  milk?: number;
  bread?: number;
  rice?: number;
  eggs?: number;
  cheese?: number;
  chicken?: number;
  beef?: number;
  apples?: number;
  bananas?: number;
  tomatoes?: number;
  potatoes?: number;
  onions?: number;
  lettuce?: number;
  water1_5l?: number;
  wine?: number;
  monthlyPass?: number;
  taxiKm?: number;
  gasoline?: number;
  basicUtilities?: number;
  internet?: number;
  mobile?: number;
  gym?: number;
  cinema?: number;
  preschool?: number;
  internationalSchool?: number;
  rent1bedCenter?: number;
  rent1bedOutside?: number;
  rent3bedCenter?: number;
  rent3bedOutside?: number;
  pricePerSqmCenter?: number;
  pricePerSqmOutside?: number;
  avgSalary?: number;
}

const ITEM_MAPPING: Array<[string, keyof NumbeoData]> = [
  ['Meal at an Inexpensive Restaurant', 'mealInexpensive'],
  ['Combo Meal at McDonald', 'mcdonalds'],
  ['Cappuccino (Regular', 'cappuccino'],
  ['Milk (Regular', 'milk'],
  ['Fresh White Bread', 'bread'],
  ['White Rice (1 kg)', 'rice'],
  ['Eggs (12', 'eggs'],
  ['Local Cheese (1 kg)', 'cheese'],
  ['Chicken Fillets (1 kg)', 'chicken'],
  ['Beef Round', 'beef'],
  ['Apples (1 kg)', 'apples'],
  ['Bananas (1 kg)', 'bananas'],
  ['Tomatoes (1 kg)', 'tomatoes'],
  ['Potatoes (1 kg)', 'potatoes'],
  ['Onions (1 kg)', 'onions'],
  ['Lettuce (1 Head)', 'lettuce'],
  ['Bottled Water (1.5 Liter)', 'water1_5l'],
  ['Bottle of Wine (Mid-Range)', 'wine'],
  ['Monthly Public Transport Pass', 'monthlyPass'],
  ['Taxi 1 km (Standard Tariff)', 'taxiKm'],
  ['Gasoline (1 Liter)', 'gasoline'],
  ['Basic Utilities for 85 m2', 'basicUtilities'],
  ['Broadband Internet', 'internet'],
  ['Mobile Phone Plan', 'mobile'],
  ['Monthly Fitness Club', 'gym'],
  ['Cinema Ticket', 'cinema'],
  ['Preschool or Kindergarten', 'preschool'],
  ['International Primary School', 'internationalSchool'],
  ['1 Bedroom Apartment in City Centre', 'rent1bedCenter'],
  ['1 Bedroom Apartment Outside', 'rent1bedOutside'],
  ['3 Bedroom Apartment in City Centre', 'rent3bedCenter'],
  ['3 Bedroom Apartment Outside', 'rent3bedOutside'],
  ['Price per Square Meter to Buy Apartment in City Centre', 'pricePerSqmCenter'],
  ['Price per Square Meter to Buy Apartment Outside', 'pricePerSqmOutside'],
  ['Average Monthly Net Salary', 'avgSalary'],
];

function parseNumbeoPage(html: string): NumbeoData {
  const data: NumbeoData = {};

  const rowPattern = /<tr><td[^>]*>(.*?)<\/td>\s*<td[^>]*class="priceValue[^"]*"[^>]*>\s*<span[^>]*>(.*?)<\/span>/gi;

  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const itemText = match[1].replace(/<[^>]*>/g, '').trim();
    const priceText = match[2]
      .replace(/&nbsp;/g, ' ')
      .replace(/&#36;/g, '$')
      .replace(/<[^>]*>/g, '')
      .trim();

    for (const [substring, fieldKey] of ITEM_MAPPING) {
      if (itemText.includes(substring)) {
        const price = parseNumber(priceText);
        if (price !== null && price > 0) {
          data[fieldKey] = price;
        }
        break;
      }
    }
  }

  return data;
}

function estimateMonthlyGroceries(data: NumbeoData): number {
  let total = 0;
  let items = 0;
  if (data.milk) { total += data.milk * 8; items++; }
  if (data.bread) { total += data.bread * 4; items++; }
  if (data.rice) { total += data.rice * 2; items++; }
  if (data.eggs) { total += data.eggs * 2; items++; }
  if (data.cheese) { total += data.cheese * 0.5; items++; }
  if (data.chicken) { total += data.chicken * 4; items++; }
  if (data.beef) { total += data.beef * 2; items++; }
  if (data.apples) { total += data.apples * 2; items++; }
  if (data.bananas) { total += data.bananas * 2; items++; }
  if (data.tomatoes) { total += data.tomatoes * 2; items++; }
  if (data.potatoes) { total += data.potatoes * 3; items++; }
  if (data.onions) { total += data.onions * 1; items++; }
  if (data.lettuce) { total += data.lettuce * 4; items++; }
  if (data.water1_5l) { total += data.water1_5l * 8; items++; }

  if (items >= 5) return Math.round(total);
  return 0;
}

// ─── Currency conversion ──────────────────────────────────────────────

function getLocalFromUsd(usdAmount: number, city: any): number {
  const existingSalary = city.metrics?.salary?.average;
  if (existingSalary && existingSalary.usd > 0 && existingSalary.local > 0) {
    const rate = existingSalary.local / existingSalary.usd;
    return Math.round(usdAmount * rate * 100) / 100;
  }
  return usdAmount;
}

// ─── Update city metrics ──────────────────────────────────────────────

function updateCityMetrics(city: any, numbeoData: NumbeoData): { updated: boolean; fields: string[] } {
  const fields: string[] = [];
  const m = city.metrics;

  const updateField = (obj: any, key: string, usdValue: number | undefined, label: string) => {
    if (!usdValue || usdValue <= 0) return;
    if (!obj[key]) obj[key] = { local: 0, usd: 0 };
    const localValue = getLocalFromUsd(usdValue, city);
    obj[key] = { local: Math.round(localValue * 100) / 100, usd: Math.round(usdValue * 100) / 100 };
    fields.push(label);
  };

  if (numbeoData.avgSalary) {
    updateField(m.salary, 'average', numbeoData.avgSalary, 'salary.average');
  }

  if (numbeoData.rent1bedCenter) {
    updateField(m.rent, 'oneBedroom', numbeoData.rent1bedCenter, 'rent.1bed');
  }
  if (numbeoData.rent3bedCenter) {
    updateField(m.rent, 'threeBedroom', numbeoData.rent3bedCenter, 'rent.3bed');
  }
  if (numbeoData.rent1bedCenter && numbeoData.rent3bedCenter) {
    const rent2bed = numbeoData.rent1bedCenter + (numbeoData.rent3bedCenter - numbeoData.rent1bedCenter) * 0.45;
    updateField(m.rent, 'twoBedroom', rent2bed, 'rent.2bed');
  }

  if (numbeoData.pricePerSqmCenter) {
    updateField(m.property, 'cityCenter', numbeoData.pricePerSqmCenter, 'property.center');

    if (!m.property.buyCityCenter) {
      m.property.buyCityCenter = {
        oneBedroom: { local: 0, usd: 0 },
        twoBedroom: { local: 0, usd: 0 },
        threeBedroom: { local: 0, usd: 0 },
      };
    }
    updateField(m.property.buyCityCenter, 'oneBedroom', numbeoData.pricePerSqmCenter * 50, 'property.buy1bed');
    updateField(m.property.buyCityCenter, 'twoBedroom', numbeoData.pricePerSqmCenter * 75, 'property.buy2bed');
    updateField(m.property.buyCityCenter, 'threeBedroom', numbeoData.pricePerSqmCenter * 110, 'property.buy3bed');
  }
  if (numbeoData.pricePerSqmOutside) {
    updateField(m.property, 'outside', numbeoData.pricePerSqmOutside, 'property.outside');

    if (!m.property.buyOutside) {
      m.property.buyOutside = {
        oneBedroom: { local: 0, usd: 0 },
        twoBedroom: { local: 0, usd: 0 },
        threeBedroom: { local: 0, usd: 0 },
      };
    }
    updateField(m.property.buyOutside, 'oneBedroom', numbeoData.pricePerSqmOutside * 50, 'property.buyOut1bed');
    updateField(m.property.buyOutside, 'twoBedroom', numbeoData.pricePerSqmOutside * 75, 'property.buyOut2bed');
    updateField(m.property.buyOutside, 'threeBedroom', numbeoData.pricePerSqmOutside * 110, 'property.buyOut3bed');
  }

  const groceries = estimateMonthlyGroceries(numbeoData);
  if (groceries > 0) {
    updateField(m.food, 'groceries', groceries, 'food.groceries');
  }
  if (numbeoData.mealInexpensive) {
    updateField(m.food, 'restaurantMeal', numbeoData.mealInexpensive, 'food.restaurant');
  }
  if (numbeoData.mcdonalds) {
    updateField(m.food, 'fastFood', numbeoData.mcdonalds, 'food.fastfood');
  }

  if (numbeoData.monthlyPass) {
    updateField(m.transport, 'monthlyPass', numbeoData.monthlyPass, 'transport.pass');
  }
  if (numbeoData.taxiKm) {
    updateField(m.transport, 'taxiPerKm', numbeoData.taxiKm, 'transport.taxi');
  }
  if (numbeoData.gasoline) {
    updateField(m.transport, 'gasoline', numbeoData.gasoline, 'transport.gas');
  }

  if (numbeoData.basicUtilities) {
    updateField(m.utilities, 'basic', numbeoData.basicUtilities, 'utilities.basic');
  }
  if (numbeoData.internet) {
    updateField(m.utilities, 'internet', numbeoData.internet, 'utilities.internet');
  }
  if (numbeoData.mobile) {
    updateField(m.utilities, 'mobile', numbeoData.mobile, 'utilities.mobile');
  }

  if (numbeoData.gym) {
    updateField(m.lifestyle, 'gymMembership', numbeoData.gym, 'lifestyle.gym');
  }
  if (numbeoData.cinema) {
    updateField(m.lifestyle, 'cinema', numbeoData.cinema, 'lifestyle.cinema');
  }
  if (numbeoData.cappuccino) {
    updateField(m.lifestyle, 'cappuccino', numbeoData.cappuccino, 'lifestyle.cappuccino');
  }

  if (numbeoData.preschool) {
    if (!m.education) m.education = {};
    updateField(m.education, 'preschool', numbeoData.preschool, 'education.preschool');
  }
  if (numbeoData.internationalSchool) {
    if (!m.education) m.education = {};
    updateField(m.education, 'internationalSchool', numbeoData.internationalSchool, 'education.intlSchool');
  }

  if (fields.length > 0) {
    m.updatedAt = new Date().toISOString().split('T')[0];
    if (!m.sources?.includes('Numbeo')) {
      m.sources = [...(m.sources || []), 'Numbeo'];
    }
  }

  return { updated: fields.length > 0, fields };
}

// ─── IMF Inflation Updater ────────────────────────────────────────────

async function fetchIMFInflation(countryCodes: string[]): Promise<Record<string, Record<string, number>>> {
  console.log('\n📊 Fetching IMF inflation data...');

  const results: Record<string, Record<string, number>> = {};

  const isoToImf: Record<string, string> = {
    'DE': 'DEU', 'PT': 'PRT', 'RU': 'RUS', 'GE': 'GEO', 'UA': 'UKR',
    'BY': 'BLR', 'KZ': 'KAZ', 'AZ': 'AZE', 'AM': 'ARM', 'UZ': 'UZB',
    'FR': 'FRA', 'ES': 'ESP', 'NL': 'NLD', 'AT': 'AUT', 'CZ': 'CZE',
    'PL': 'POL', 'HU': 'HUN', 'IT': 'ITA', 'TH': 'THA', 'GB': 'GBR',
    'US': 'USA', 'JP': 'JPN', 'SG': 'SGP', 'HK': 'HKG', 'KR': 'KOR',
    'CN': 'CHN', 'IN': 'IND', 'MY': 'MYS', 'VN': 'VNM', 'TW': 'TWN',
    'ID': 'IDN', 'PH': 'PHL', 'AE': 'ARE', 'UY': 'URY', 'AR': 'ARG',
    'BR': 'BRA', 'CL': 'CHL', 'PE': 'PER', 'CO': 'COL', 'MX': 'MEX',
    'PA': 'PAN', 'CR': 'CRI',
  };

  const uniqueCodes = [...new Set(countryCodes)];

  for (const [iso2, imf3] of Object.entries(isoToImf)) {
    if (!uniqueCodes.includes(iso2)) continue;
    try {
      const url = `https://www.imf.org/external/datamapper/api/v1/PCPIPCH/${imf3}`;
      const res = await fetch(url);
      const json = await res.json() as any;
      const countryData = json?.values?.PCPIPCH?.[imf3];

      if (countryData) {
        results[iso2] = {};
        for (const [year, rate] of Object.entries(countryData)) {
          const yearNum = parseInt(year);
          if (yearNum >= 2020 && yearNum <= 2030) {
            results[iso2][year] = Math.round((rate as number) * 100) / 100;
          }
        }
      }
    } catch {
      // silently skip failed countries
    }
  }
  console.log(`  ✓ Got inflation data for ${Object.keys(results).length} countries`);

  return results;
}

function updateInflationFile(imfData: Record<string, Record<string, number>>, dryRun: boolean) {
  const inflation = JSON.parse(fs.readFileSync(INFLATION_PATH, 'utf8'));
  const countries = inflation.countries || inflation;

  let updated = 0;
  for (const [countryCode, yearlyData] of Object.entries(imfData)) {
    if (countries[countryCode]) {
      const entry = countries[countryCode];
      if (yearlyData['2025']) entry.inflation2025 = yearlyData['2025'];
      if (yearlyData['2026']) entry.inflation2026 = yearlyData['2026'];
      if (yearlyData['2027']) entry.inflation2027 = yearlyData['2027'];
      if (yearlyData['2024'] && yearlyData['2025'] && yearlyData['2026']) {
        const avgInflation = (yearlyData['2024'] + yearlyData['2025'] + yearlyData['2026']) / 3;
        entry.propertyGrowth2026 = Math.round(avgInflation * 1.3 * 100) / 100;
      }
      updated++;
    }
  }

  if (!dryRun) {
    fs.writeFileSync(INFLATION_PATH, JSON.stringify(inflation, null, 2) + '\n');
    console.log(`  ✓ Updated inflation for ${updated} countries → ${INFLATION_PATH}`);
  } else {
    console.log(`  [DRY RUN] Would update inflation for ${updated} countries`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inflationOnly = args.includes('--inflation');
  const resumeMode = args.includes('--resume');
  const cityFlag = args.indexOf('--city');
  const targetCity = cityFlag >= 0 ? args[cityFlag + 1] : null;

  console.log('🏠 KABALA Data Updater');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  if (targetCity) console.log(`   Target city: ${targetCity}`);
  if (resumeMode) console.log(`   Resume: skipping cities updated today (${todayStr()})`);
  if (inflationOnly) console.log('   Inflation only');
  console.log(`   Rate limit: ${MIN_DELAY_MS/1000}-${MAX_DELAY_MS/1000}s delay, ${MAX_RETRIES} retries, ${INITIAL_BACKOFF_MS/1000}s initial backoff`);
  console.log(`   User-Agent pool: ${USER_AGENTS.length} variants`);

  const cities = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8'));

  // ── Step 1: Update inflation from IMF ──
  const countryCodes = [...new Set(cities.map((c: any) => c.countryCode))] as string[];
  const imfData = await fetchIMFInflation(countryCodes);
  if (Object.keys(imfData).length > 0) {
    updateInflationFile(imfData, dryRun);
  }

  if (inflationOnly) {
    console.log('\n✅ Done (inflation only)');
    return;
  }

  // ── Step 2: Scrape Numbeo for each city ──
  console.log('\n🌐 Scraping Numbeo...');

  const citiesToUpdate = targetCity
    ? cities.filter((c: any) => c.id === targetCity)
    : cities;

  if (citiesToUpdate.length === 0) {
    console.error(`City "${targetCity}" not found`);
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;
  let rateLimitCount = 0;
  let resumeSkipCount = 0;
  let consecutiveRateLimits = 0;
  const startTime = Date.now();

  for (let i = 0; i < citiesToUpdate.length; i++) {
    const city = citiesToUpdate[i];

    // --resume: skip cities already updated today
    if (resumeMode && city.metrics?.updatedAt === todayStr()) {
      process.stdout.write(`  [${i + 1}/${citiesToUpdate.length}] ${city.name}... `);
      console.log('SKIP (already updated today)');
      resumeSkipCount++;
      continue;
    }

    const slug = getCitySlug(city.id, city.name);
    const url = `https://www.numbeo.com/cost-of-living/in/${slug}?displayCurrency=USD`;

    process.stdout.write(`  [${i + 1}/${citiesToUpdate.length}] ${city.name}... `);

    const { html, gaveUp } = await fetchWithRetry(url, city.name);

    if (!html) {
      if (gaveUp) {
        rateLimitCount++;
        consecutiveRateLimits++;

        // If we got 5+ consecutive rate limits even after retries, pause longer
        if (consecutiveRateLimits >= 5) {
          const pauseMs = 120_000; // 2 minutes
          console.log(`\n  🛑 ${consecutiveRateLimits} consecutive rate limits — pausing ${formatDuration(pauseMs)}...`);

          // Save progress before long pause
          if (!dryRun && successCount > 0) {
            fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + '\n');
            console.log(`  💾 Saved progress (${successCount} cities so far)`);
          }

          await sleep(pauseMs);
          consecutiveRateLimits = 0;
          console.log('  ▶️  Resuming...');
        }
      } else {
        skipCount++;
      }
      await sleep(randomDelay());
      continue;
    }

    // Reset consecutive counter on success
    consecutiveRateLimits = 0;

    // Check if Numbeo returned a "no data" page
    if (html.includes('There are no enough data points') || html.includes('We don\'t have enough data')) {
      console.log('SKIP (no data on Numbeo)');
      skipCount++;
      await sleep(randomDelay());
      continue;
    }

    const numbeoData = parseNumbeoPage(html);
    const fieldsFound = Object.keys(numbeoData).length;

    if (fieldsFound < 3) {
      console.log(`SKIP (only ${fieldsFound} fields parsed)`);
      skipCount++;
      await sleep(randomDelay());
      continue;
    }

    const { updated, fields } = updateCityMetrics(city, numbeoData);

    if (updated) {
      console.log(`OK (${fields.length} fields: ${fields.slice(0, 5).join(', ')}${fields.length > 5 ? '...' : ''})`);
      successCount++;
    } else {
      console.log('NO CHANGES');
      skipCount++;
    }

    // Intermediate save every SAVE_INTERVAL successful cities
    if (!dryRun && successCount > 0 && successCount % SAVE_INTERVAL === 0) {
      fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + '\n');
      console.log(`  💾 Intermediate save (${successCount} cities updated so far)`);
    }

    await sleep(randomDelay());
  }

  // ── Step 3: Write final results ──
  const elapsed = Date.now() - startTime;
  const summary = [];
  summary.push(`${successCount} updated`);
  if (skipCount > 0) summary.push(`${skipCount} skipped`);
  if (rateLimitCount > 0) summary.push(`${rateLimitCount} rate-limited`);
  if (resumeSkipCount > 0) summary.push(`${resumeSkipCount} already done today`);

  if (!dryRun && successCount > 0) {
    fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + '\n');
    console.log(`\n✅ Done in ${formatDuration(elapsed)}! ${summary.join(', ')}`);
    console.log(`   Written to ${CITIES_PATH}`);
  } else if (dryRun) {
    console.log(`\n✅ [DRY RUN] ${summary.join(', ')} (${formatDuration(elapsed)})`);
  } else {
    console.log(`\n✅ No changes to write (${formatDuration(elapsed)})`);
  }

  if (rateLimitCount > 0) {
    console.log(`\n⚠️  ${rateLimitCount} cities were rate-limited. Run again with --resume to retry only those.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
