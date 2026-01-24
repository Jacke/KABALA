import type { Metadata } from 'next';
import { getAllCities } from '@/lib/data';
import { RankingsTable } from '@/components/Rankings';

export const metadata: Metadata = {
  title: 'City Rankings',
  description:
    'Compare and rank cities by salary, rent, and cost of living metrics.',
  openGraph: {
    title: 'City Rankings - KABALA',
    description:
      'Compare and rank cities by salary, rent, and cost of living metrics.',
  },
};

/**
 * Rankings page showing sortable table of all cities.
 */
export default function RankingsPage() {
  const cities = getAllCities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">City Rankings</h1>
        <p className="text-gray-600 mt-2">
          Compare cities by cost of living metrics. Click column headers to
          sort.
        </p>
      </div>

      <RankingsTable cities={cities} />
    </div>
  );
}
