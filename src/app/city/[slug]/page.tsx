export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold">City: {slug}</h1>
      <p className="mt-2 text-gray-600">Detailed city information coming soon.</p>
    </div>
  );
}
