import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'KABALA - Global Purchasing Power Dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          KABALA
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#e0e7ff',
            marginBottom: 40,
          }}
        >
          Global Purchasing Power Dashboard
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#c7d2fe',
          }}
        >
          Compare cost of living across cities worldwide
        </div>
      </div>
    ),
    { ...size }
  );
}
