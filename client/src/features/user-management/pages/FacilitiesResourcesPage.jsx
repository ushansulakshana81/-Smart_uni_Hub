import { useEffect, useMemo, useState } from 'react';
import { catalogService } from '../services/apiService';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const availabilityTone = (value) => {
  const status = normalize(value);
  if (status === 'available' || status === 'active' || status === 'in use') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'under maintenance' || status === 'reserved') {
    return 'bg-amber-100 text-amber-800';
  }
  return 'bg-slate-100 text-slate-700';
};

const SectionCard = ({ title, subtitle, count, searchQuery, onSearchChange, onClear, children }) => (
  <section className="space-y-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b border-gray-200 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
        {count} item{count === 1 ? '' : 's'}
      </div>
    </div>

    <div className="px-6">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Search ${title.toLowerCase()} by name, location, or ID...`}
          className="w-full bg-transparent text-sm outline-none"
        />
        {searchQuery && (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-gray-500 hover:text-gray-800">
            Clear
          </button>
        )}
      </div>
    </div>

    <div className="overflow-x-auto pb-2">
      {children}
    </div>
  </section>
);

export const FacilitiesResourcesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [assets, setAssets] = useState([]);
  const [facilitySearch, setFacilitySearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [activeTab, setActiveTab] = useState('facilities');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCatalog = async () => {
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
        setError(err.response?.data?.message || 'Failed to load facilities and assets');
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const filteredFacilities = useMemo(() => {
    if (!facilitySearch.trim()) return facilities;
    const query = normalize(facilitySearch);
    return facilities.filter((facility) => (
      normalize(facility.facilityName).includes(query) ||
      normalize(facility.location).includes(query) ||
      normalize(facility.fId).includes(query)
    ));
  }, [facilities, facilitySearch]);

  const filteredAssets = useMemo(() => {
    if (!assetSearch.trim()) return assets;
    const query = normalize(assetSearch);
    return assets.filter((asset) => (
      normalize(asset.name).includes(query) ||
      normalize(asset.location).includes(query) ||
      normalize(asset.assetId).includes(query)
    ));
  }, [assets, assetSearch]);

  const activeFacilitiesCount = filteredFacilities.length;
  const activeAssetsCount = filteredAssets.length;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-8 text-white shadow-lg">
        <h2 className="text-4xl font-bold">Facilities & Resources</h2>
        <p className="mt-3 max-w-2xl text-indigo-100">
          Search campus facilities and assets, then check availability from the same screen.
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('facilities')}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'facilities'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Facilities
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'assets'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Assets
        </button>
      </div>

      {activeTab === 'facilities' ? (
        <SectionCard
          title="Facilities"
          subtitle="Search facilities by name, location, or facility ID."
          count={activeFacilitiesCount}
          searchQuery={facilitySearch}
          onSearchChange={setFacilitySearch}
          onClear={() => setFacilitySearch('')}
        >
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Facility ID</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Location</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Capacity</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading facilities...</td>
                </tr>
              )}
              {!loading && filteredFacilities.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {facilitySearch ? 'No facilities match your search.' : 'No facility data available.'}
                  </td>
                </tr>
              )}
              {!loading && filteredFacilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{facility.fId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{facility.facilityName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{facility.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{facility.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{facility.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${availabilityTone(facility.availability)}`}>
                      {facility.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      ) : (
        <SectionCard
          title="Assets"
          subtitle="Search assets by name, location, or asset ID."
          count={activeAssetsCount}
          searchQuery={assetSearch}
          onSearchChange={setAssetSearch}
          onClear={() => setAssetSearch('')}
        >
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Asset ID</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Location</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Availability</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading assets...</td>
                </tr>
              )}
              {!loading && filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {assetSearch ? 'No assets match your search.' : 'No asset data available.'}
                  </td>
                </tr>
              )}
              {!loading && filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{asset.assetId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${availabilityTone(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </section>
  );
};
