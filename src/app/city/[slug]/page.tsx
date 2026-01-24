import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCityById, getAllCities } from '@/lib/data';
import { CityHeader, HistoricalCharts, MetricCard, MetricSection } from '@/components/City';

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

  const { metrics, currency } = city;
  const currencyCode = currency.code;

  return (
    <div className="space-y-6">
      <CityHeader city={city} />

      {/* Grid of metric sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rent section */}
        <MetricSection title="Rent (Monthly)">
          {metrics.rent.studio && (
            <MetricCard
              label="Studio"
              value={metrics.rent.studio}
              currencyCode={currencyCode}
              showBoth
            />
          )}
          <MetricCard
            label="1 Bedroom"
            value={metrics.rent.oneBedroom}
            currencyCode={currencyCode}
            showBoth
          />
          <MetricCard
            label="2 Bedroom"
            value={metrics.rent.twoBedroom}
            currencyCode={currencyCode}
            showBoth
          />
          <MetricCard
            label="3 Bedroom"
            value={metrics.rent.threeBedroom}
            currencyCode={currencyCode}
            showBoth
          />
        </MetricSection>

        {/* Property section */}
        <MetricSection title="Property (per sqm)">
          <MetricCard
            label="City Center"
            value={metrics.property.cityCenter}
            currencyCode={currencyCode}
            showBoth
          />
          <MetricCard
            label="Outside Center"
            value={metrics.property.outside}
            currencyCode={currencyCode}
            showBoth
          />
        </MetricSection>

        {/* Food section */}
        <MetricSection title="Food">
          <MetricCard
            label="Groceries"
            value={metrics.food.groceries}
            currencyCode={currencyCode}
            subtitle="per month"
            showBoth
          />
          <MetricCard
            label="Restaurant Meal"
            value={metrics.food.restaurantMeal}
            currencyCode={currencyCode}
            subtitle="mid-range"
            showBoth
          />
          <MetricCard
            label="Fast Food"
            value={metrics.food.fastFood}
            currencyCode={currencyCode}
            subtitle="combo meal"
            showBoth
          />
        </MetricSection>

        {/* Transport section */}
        <MetricSection title="Transport">
          <MetricCard
            label="Monthly Pass"
            value={metrics.transport.monthlyPass}
            currencyCode={currencyCode}
            subtitle="public transit"
            showBoth
          />
          <MetricCard
            label="Taxi"
            value={metrics.transport.taxiPerKm}
            currencyCode={currencyCode}
            subtitle="per km"
            showBoth
          />
          <MetricCard
            label="Gasoline"
            value={metrics.transport.gasoline}
            currencyCode={currencyCode}
            subtitle="per liter"
            showBoth
          />
        </MetricSection>

        {/* Utilities section */}
        <MetricSection title="Utilities">
          <MetricCard
            label="Basic"
            value={metrics.utilities.basic}
            currencyCode={currencyCode}
            subtitle="electricity, heating, water"
            showBoth
          />
          <MetricCard
            label="Internet"
            value={metrics.utilities.internet}
            currencyCode={currencyCode}
            subtitle="60+ Mbps"
            showBoth
          />
          <MetricCard
            label="Mobile"
            value={metrics.utilities.mobile}
            currencyCode={currencyCode}
            subtitle="monthly plan"
            showBoth
          />
        </MetricSection>

        {/* Lifestyle section */}
        <MetricSection title="Lifestyle">
          <MetricCard
            label="Gym Membership"
            value={metrics.lifestyle.gymMembership}
            currencyCode={currencyCode}
            subtitle="monthly"
            showBoth
          />
          <MetricCard
            label="Cinema"
            value={metrics.lifestyle.cinema}
            currencyCode={currencyCode}
            subtitle="one ticket"
            showBoth
          />
          <MetricCard
            label="Cappuccino"
            value={metrics.lifestyle.cappuccino}
            currencyCode={currencyCode}
            subtitle="regular"
            showBoth
          />
        </MetricSection>

        {/* Healthcare section */}
        <MetricSection title="Healthcare">
          <MetricCard
            label="Doctor Visit"
            value={metrics.healthcare.doctorVisit}
            currencyCode={currencyCode}
            subtitle="general practitioner"
            showBoth
          />
          <MetricCard
            label="Medications"
            value={metrics.healthcare.medicationBasic}
            currencyCode={currencyCode}
            subtitle="basic monthly"
            showBoth
          />
        </MetricSection>

        {/* Education section - only render if data exists */}
        {metrics.education && (metrics.education.preschool || metrics.education.internationalSchool) && (
          <MetricSection title="Education">
            {metrics.education.preschool && (
              <MetricCard
                label="Preschool"
                value={metrics.education.preschool}
                currencyCode={currencyCode}
                subtitle="monthly"
                showBoth
              />
            )}
            {metrics.education.internationalSchool && (
              <MetricCard
                label="International School"
                value={metrics.education.internationalSchool}
                currencyCode={currencyCode}
                subtitle="yearly"
                showBoth
              />
            )}
          </MetricSection>
        )}

        {/* Salary details - if additional salary data exists */}
        {(metrics.salary.median || metrics.salary.minimum) && (
          <MetricSection title="Salary Details">
            {metrics.salary.median && (
              <MetricCard
                label="Median Salary"
                value={metrics.salary.median}
                currencyCode={currencyCode}
                subtitle="net monthly"
                showBoth
              />
            )}
            {metrics.salary.minimum && (
              <MetricCard
                label="Minimum Wage"
                value={metrics.salary.minimum}
                currencyCode={currencyCode}
                subtitle="net monthly"
                showBoth
              />
            )}
          </MetricSection>
        )}
      </div>

      {/* Historical trends */}
      {city.historical && (
        <HistoricalCharts historical={city.historical} cityName={city.name} />
      )}

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
