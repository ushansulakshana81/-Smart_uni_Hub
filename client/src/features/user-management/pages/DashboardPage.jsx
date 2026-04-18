import { useEffect, useMemo, useState } from 'react';
import { catalogService } from '../services/apiService';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

export const DashboardPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');

      try {
        const [facilityResponse, assetResponse] = await Promise.all([
          catalogService.getFacilities(),
          catalogService.getAssets(),
        ]);

        setFacilities(facilityResponse.data.data || []);
        setAssets(assetResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const stats = useMemo(() => {
    const availableFacilities = facilities.filter((facility) => normalize(facility.availability) === 'available').length;
    const availableAssets = assets.filter((asset) => {
      const status = normalize(asset.status);
      return status === 'available' || status === 'active' || status === 'in use';
    }).length;

    const unavailableFacilities = Math.max(facilities.length - availableFacilities, 0);
    const unavailableAssets = Math.max(assets.length - availableAssets, 0);

    const facilityAvailabilityRate = facilities.length === 0
      ? 0
      : Math.round((availableFacilities / facilities.length) * 100);

    const assetAvailabilityRate = assets.length === 0
      ? 0
      : Math.round((availableAssets / assets.length) * 100);

    return {
      totalFacilities: facilities.length,
      availableFacilities,
      unavailableFacilities,
      totalAssets: assets.length,
      availableAssets,
      unavailableAssets,
      facilityAvailabilityRate,
      assetAvailabilityRate,
    };
  }, [facilities, assets]);

  const cards = [
    { label: 'Total Facilities', value: stats.totalFacilities, tone: 'text-indigo-600' },
    { label: 'Available Facilities', value: stats.availableFacilities, tone: 'text-emerald-600' },
    { label: 'Total Assets', value: stats.totalAssets, tone: 'text-blue-600' },
    { label: 'Available Assets', value: stats.availableAssets, tone: 'text-cyan-600' },
    { label: 'Unavailable Facilities', value: stats.unavailableFacilities, tone: 'text-amber-600' },
    { label: 'Unavailable Assets', value: stats.unavailableAssets, tone: 'text-rose-600' },
  ];

  return (
    <section className="space-y-8">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <article key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{card.label}</h3>
            <p className={`mt-3 text-4xl font-bold ${card.tone}`}>
              {loading ? '-' : card.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Facilities Availability</h3>
          <p className="mt-2 text-sm text-gray-600">Share of facilities currently marked as available.</p>
          <div className="mt-5 h-3 w-full rounded-full bg-gray-100">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${loading ? 0 : stats.facilityAvailabilityRate}%` }}
            />
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {loading ? '-' : `${stats.facilityAvailabilityRate}%`}
          </p>
        </article>

        <article className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Assets Availability</h3>
          <p className="mt-2 text-sm text-gray-600">Share of assets currently active and usable.</p>
          <div className="mt-5 h-3 w-full rounded-full bg-gray-100">
            <div
              className="h-3 rounded-full bg-cyan-500 transition-all"
              style={{ width: `${loading ? 0 : stats.assetAvailabilityRate}%` }}
            />
          </div>
          <p className="mt-3 text-2xl font-bold text-cyan-600">
            {loading ? '-' : `${stats.assetAvailabilityRate}%`}
          </p>
        </article>
      </div>

      <article className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Quick Summary</h3>
        <p className="mt-3 text-gray-600 leading-relaxed">
          {loading
            ? 'Loading current counts for facilities and assets...'
            : `The system currently tracks ${stats.totalFacilities} facilities and ${stats.totalAssets} assets. ` +
              `${stats.availableFacilities} facilities and ${stats.availableAssets} assets are available for use right now.`}
        </p>
      </article>
    </section>
  );
};
