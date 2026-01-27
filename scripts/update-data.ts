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
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────

const CITIES_PATH = path.resolve(__dirname, '../src/data/cities.json');
const INFLATION_PATH = path.resolve(__dirname, '../src/data/inflation.json');

const DELAY_MS = 3000; // delay between requests to avoid rate limiting
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

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
  // Russian suburbs — Numbeo may not have pages for all of them
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

function parseNumber(text: string): number | null {
  // Remove currency symbols, commas, spaces, and non-breaking spaces
  const cleaned = text.replace(/[^0-9.\-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function getCitySlug(cityId: string, cityName: string): string {
  if (NUMBEO_SLUGS[cityId]) return NUMBEO_SLUGS[cityId];
  // Convert "São Paulo" → "Sao-Paulo", "Ho Chi Minh City" → "Ho-Chi-Minh-City"
  return cityName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/\./g, '');
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) {
      console.error(`  ✗ HTTP ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`  ✗ Fetch error for ${url}:`, (err as Error).message);
    return null;
  }
}

// ─── Numbeo Scraper ───────────────────────────────────────────────────

interface NumbeoData {
  // Restaurants
  mealInexpensive?: number;
  mealMidRange?: number;
  mcdonalds?: number;
  cappuccino?: number;

  // Markets (we'll estimate monthly groceries from individual items)
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

  // Transport
  monthlyPass?: number;
  taxiKm?: number;
  gasoline?: number;

  // Utilities
  basicUtilities?: number;
  internet?: number;
  mobile?: number;

  // Sports
  gym?: number;
  cinema?: number;

  // Childcare
  preschool?: number;
  internationalSchool?: number;

  // Rent
  rent1bedCenter?: number;
  rent1bedOutside?: number;
  rent3bedCenter?: number;
  rent3bedOutside?: number;

  // Buy
  pricePerSqmCenter?: number;
  pricePerSqmOutside?: number;

  // Salary
  avgSalary?: number;
}

// Map Numbeo item text (substring match) to our data fields
// These are the EXACT strings from Numbeo's HTML as of Jan 2026
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

  // Numbeo HTML structure (Jan 2026):
  // <tr><td>Item Name </td> <td ... class="priceValue ..."> <span class="first_currency">17.81&nbsp;&#36;</span></td>
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

// Estimate monthly groceries from individual item prices
function estimateMonthlyGroceries(data: NumbeoData): number {
  // A reasonable monthly grocery basket for one person:
  // 8L milk, 4 loaves bread, 2kg rice, 24 eggs, 1kg cheese,
  // 4kg chicken, 2kg beef, 4kg fruit, 4kg vegetables, 12L water, 2 bottles wine
  let total = 0;
  let items = 0;
  if (data.milk) { total += data.milk * 8; items++; }
  if (data.bread) { total += data.bread * 4; items++; }
  if (data.rice) { total += data.rice * 2; items++; }
  if (data.eggs) { total += data.eggs * 2; items++; } // 24 eggs = 2x12
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

  // If we have enough items, return the estimate
  if (items >= 5) return Math.round(total);
  return 0;
}

// ─── Currency conversion ──────────────────────────────────────────────

// We fetch Numbeo in USD to get consistent comparisons
// For local currency, we use the existing exchange rate from the city data

function getLocalFromUsd(usdAmount: number, city: any): number {
  // Calculate the exchange rate from existing data
  const existingSalary = city.metrics?.salary?.average;
  if (existingSalary && existingSalary.usd > 0 && existingSalary.local > 0) {
    const rate = existingSalary.local / existingSalary.usd;
    return Math.round(usdAmount * rate * 100) / 100;
  }
  return usdAmount; // fallback
}

// ─── Update city metrics ──────────────────────────────────────────────

function updateCityMetrics(city: any, numbeoData: NumbeoData): { updated: boolean; fields: string[] } {
  const fields: string[] = [];
  const m = city.metrics;

  // Helper to update a MoneyAmount field
  const updateField = (obj: any, key: string, usdValue: number | undefined, label: string) => {
    if (!usdValue || usdValue <= 0) return;
    if (!obj[key]) obj[key] = { local: 0, usd: 0 };
    const localValue = getLocalFromUsd(usdValue, city);
    obj[key] = { local: Math.round(localValue * 100) / 100, usd: Math.round(usdValue * 100) / 100 };
    fields.push(label);
  };

  // Salary
  if (numbeoData.avgSalary) {
    updateField(m.salary, 'average', numbeoData.avgSalary, 'salary.average');
  }

  // Rent
  if (numbeoData.rent1bedCenter) {
    updateField(m.rent, 'oneBedroom', numbeoData.rent1bedCenter, 'rent.1bed');
  }
  if (numbeoData.rent3bedCenter) {
    updateField(m.rent, 'threeBedroom', numbeoData.rent3bedCenter, 'rent.3bed');
  }
  // Estimate 2-bed from 1-bed and 3-bed
  if (numbeoData.rent1bedCenter && numbeoData.rent3bedCenter) {
    const rent2bed = numbeoData.rent1bedCenter + (numbeoData.rent3bedCenter - numbeoData.rent1bedCenter) * 0.45;
    updateField(m.rent, 'twoBedroom', rent2bed, 'rent.2bed');
  }

  // Property
  if (numbeoData.pricePerSqmCenter) {
    updateField(m.property, 'cityCenter', numbeoData.pricePerSqmCenter, 'property.center');

    // Estimate apartment buy prices (1bed=50sqm, 2bed=75sqm, 3bed=110sqm)
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

  // Food
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

  // Transport
  if (numbeoData.monthlyPass) {
    updateField(m.transport, 'monthlyPass', numbeoData.monthlyPass, 'transport.pass');
  }
  if (numbeoData.taxiKm) {
    updateField(m.transport, 'taxiPerKm', numbeoData.taxiKm, 'transport.taxi');
  }
  if (numbeoData.gasoline) {
    updateField(m.transport, 'gasoline', numbeoData.gasoline, 'transport.gas');
  }

  // Utilities
  if (numbeoData.basicUtilities) {
    updateField(m.utilities, 'basic', numbeoData.basicUtilities, 'utilities.basic');
  }
  if (numbeoData.internet) {
    updateField(m.utilities, 'internet', numbeoData.internet, 'utilities.internet');
  }
  if (numbeoData.mobile) {
    updateField(m.utilities, 'mobile', numbeoData.mobile, 'utilities.mobile');
  }

  // Lifestyle
  if (numbeoData.gym) {
    updateField(m.lifestyle, 'gymMembership', numbeoData.gym, 'lifestyle.gym');
  }
  if (numbeoData.cinema) {
    updateField(m.lifestyle, 'cinema', numbeoData.cinema, 'lifestyle.cinema');
  }
  if (numbeoData.cappuccino) {
    updateField(m.lifestyle, 'cappuccino', numbeoData.cappuccino, 'lifestyle.cappuccino');
  }

  // Education
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

  // IMF uses different country codes than ISO 2-letter
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
  const imfCodes = uniqueCodes.map(c => isoToImf[c] || c).filter(Boolean);

  // Fetch each country individually (IMF API doesn't reliably support batch)
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
        // Estimate property growth from inflation (rough: inflation * 1.5 for property)
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
  const cityFlag = args.indexOf('--city');
  const targetCity = cityFlag >= 0 ? args[cityFlag + 1] : null;

  console.log('🏠 KABALA Data Updater');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  if (targetCity) console.log(`   Target city: ${targetCity}`);
  if (inflationOnly) console.log('   Inflation only');

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
  let failCount = 0;

  for (let i = 0; i < citiesToUpdate.length; i++) {
    const city = citiesToUpdate[i];
    const slug = getCitySlug(city.id, city.name);
    const url = `https://www.numbeo.com/cost-of-living/in/${slug}?displayCurrency=USD`;

    process.stdout.write(`  [${i + 1}/${citiesToUpdate.length}] ${city.name}... `);

    const html = await fetchPage(url);
    if (!html) {
      console.log('SKIP (no page)');
      skipCount++;
      await sleep(DELAY_MS);
      continue;
    }

    // Check if Numbeo returned a "no data" page
    if (html.includes('There are no enough data points') || html.includes('We don\'t have enough data')) {
      console.log('SKIP (no data on Numbeo)');
      skipCount++;
      await sleep(DELAY_MS);
      continue;
    }

    const numbeoData = parseNumbeoPage(html);
    const fieldsFound = Object.keys(numbeoData).length;

    if (fieldsFound < 3) {
      console.log(`SKIP (only ${fieldsFound} fields parsed)`);
      skipCount++;
      await sleep(DELAY_MS);
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

    await sleep(DELAY_MS);
  }

  // ── Step 3: Write results ──
  if (!dryRun && successCount > 0) {
    fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + '\n');
    console.log(`\n✅ Done! Updated ${successCount} cities, skipped ${skipCount}, failed ${failCount}`);
    console.log(`   Written to ${CITIES_PATH}`);
  } else if (dryRun) {
    console.log(`\n✅ [DRY RUN] Would update ${successCount} cities, skip ${skipCount}, fail ${failCount}`);
  } else {
    console.log(`\n✅ No changes to write`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
