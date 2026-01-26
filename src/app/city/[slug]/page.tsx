import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCityById, getAllCities } from '@/lib/data';
import { CityHeader, CityTabs } from '@/components/City';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all cities.
 */
export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((city) => ({ slug: city.id }));
}

/**
 * Generate metadata for SEO.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityById(slug);

  if (!city) {
    return { title: 'City Not Found - KABALA' };
  }

  return {
    title: `${city.name}, ${city.country} - Cost of Living | KABALA`,
    description: `Explore cost of living in ${city.name}, ${city.country}. Compare rent, food, transport, utilities, and salary data.`,
  };
}

/**
 * City detail page showing all cost of living metrics.
 */
export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityById(slug);

  if (!city) {
    notFound();
  }

  const { metrics } = city;

  return (
    <div className="space-y-6">
      <CityHeader city={city} />

      <CityTabs city={city} />

      {/* Data source attribution */}
      <footer className="text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>Last updated: {metrics.updatedAt}</p>
        {metrics.sources && metrics.sources.length > 0 && (
          <p className="mt-1">
            Sources: {metrics.sources.join(', ')}
          </p>
        )}
      </footer>
    </div>
  );
}
