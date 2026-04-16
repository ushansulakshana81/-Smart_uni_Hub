import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/apiService';

const emptyForm = {
  name: '',
  category: '',
  location: '',
  status: 'In Use',
  condition: 'Good',
};

export const AdminAssetsCataloguePage = () => {
  const [form, setForm] = useState(emptyForm);
  const [assets, setAssets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = useMemo(() => editingId !== null, [editingId]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAssets();
      setAssets(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.category || !form.location) {
      return;
    }

    try {
      if (isEditMode) {
        await adminService.updateAsset(editingId, form);
        setSuccess('Asset updated successfully');
      } else {
        await adminService.createAsset(form);
        setSuccess('Asset created successfully');
      }
      await fetchAssets();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save asset');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      location: item.location,
      status: item.status,
      condition: item.condition,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset?')) {
      return;
    }

    try {
      await adminService.deleteAsset(id);
      setSuccess('Asset deleted successfully');
      await fetchAssets();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete asset');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Assets Catalogue</h1>
        <p className="text-gray-600 mt-1">Create, update, and maintain the campus asset list.</p>
      </header>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <select name="status" value={form.status} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="In Use">In Use</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Retired">Retired</option>
          </select>
          <select name="condition" value={form.condition} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
            {isEditMode ? 'Update Asset' : 'Add Asset'}
          </button>
          {isEditMode && (
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Asset ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading assets...</td>
              </tr>
            )}
            {!loading && assets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No assets added yet.</td>
              </tr>
            )}
            {!loading && assets.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{item.assetId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.category}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.location}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.status}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.condition}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
