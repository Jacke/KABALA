import { WorldMap } from '@/components/Map';
import { getCityIndex } from '@/lib/data';

export default function HomePage() {
  const cities = getCityIndex();

  return (
    <div>
      <h1 className="text-3xl font-bold">World Map</h1>
      <p className="mt-2 text-gray-600">
        Explore purchasing power across cities. Click a marker to view details.
      </p>
      <div className="mt-8">
        <WorldMap cities={cities} />
      </div>
    </div>
  );
}
