import { ImageResponse } from 'next/og';
import { getCityById } from '@/lib/data';

export const runtime = 'edge';

export const alt = 'City Cost of Living - KABALA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityById(slug);

  if (!city) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#1e3a8a',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
          }}
        >
          City not found
        </div>
      ),
      { ...size }
    );
  }

  const salary = city.metrics.salary.average.usd;
  const rent = city.metrics.rent.oneBedroom.usd;
  const regionColor = city.region === 'eu' ? '#3b82f6' : '#f59e0b';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#c7d2fe', fontSize: 28 }}>KABALA</div>
          <div
            style={{
              background: regionColor,
              color: 'white',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: 20,
            }}
          >
            {city.region.toUpperCase()}
          </div>
        </div>

        {/* City name */}
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {city.name}
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#e0e7ff',
              marginTop: 8,
            }}
          >
            {city.country}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            marginTop: 80,
            gap: 100,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#c7d2fe', fontSize: 24, marginBottom: 8 }}>
              Average Salary
            </div>
            <div
              style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}
            >
              ${salary.toLocaleString()}
              <span style={{ fontSize: 24, fontWeight: 'normal' }}>/mo</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#c7d2fe', fontSize: 24, marginBottom: 8 }}>
              1BR Rent
            </div>
            <div
              style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}
            >
              ${rent.toLocaleString()}
              <span style={{ fontSize: 24, fontWeight: 'normal' }}>/mo</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
