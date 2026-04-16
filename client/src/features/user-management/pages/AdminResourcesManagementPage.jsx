import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/apiService';

const emptyForm = {
  resourceType: '',
  facilityOrAsset: '',
  date: '',
  time: '',
  purpose: '',
};

export const AdminResourcesManagementPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = useMemo(() => editingId !== null, [editingId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await adminService.getResourceRequests();
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resource requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
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

    if (!form.resourceType || !form.facilityOrAsset || !form.date || !form.time || !form.purpose) {
      return;
    }

    try {
      if (isEditMode) {
        await adminService.updateResourceRequest(editingId, form);
        setSuccess('Resource request updated successfully');
      } else {
        await adminService.createResourceRequest(form);
        setSuccess('Resource request created successfully');
      }
      await fetchRequests();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resource request');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      resourceType: item.resourceType,
      facilityOrAsset: item.facilityOrAsset,
      date: item.date,
      time: item.time,
      purpose: item.purpose,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource request?')) {
      return;
    }

    try {
      await adminService.deleteResourceRequest(id);
      setSuccess('Resource request deleted successfully');
      await fetchRequests();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resource request');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Resource Request UI</h1>
        <p className="text-gray-600 mt-1">Create and manage resource request records for facilities and assets.</p>
      </header>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="resourceType" value={form.resourceType} onChange={handleChange} placeholder="Resource Type" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="facilityOrAsset" value={form.facilityOrAsset} onChange={handleChange} placeholder="Facility / Asset" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="time" type="time" value={form.time} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <textarea name="purpose" value={form.purpose} onChange={handleChange} placeholder="Purpose" className="md:col-span-2 lg:col-span-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]" required />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
            {isEditMode ? 'Update Request' : 'Add Request'}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Resource Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Facility / Asset</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading requests...</td>
              </tr>
            )}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No requests added yet.</td>
              </tr>
            )}
            {!loading && requests.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{item.requestId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.resourceType}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.facilityOrAsset}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.time}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.purpose}</td>
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
