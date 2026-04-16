import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/apiService';

const emptyForm = {
  facilityName: '',
  type: '',
  location: '',
  capacity: '',
  availability: 'Available',
};

export const AdminFacilitiesManagementPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [facilities, setFacilities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = useMemo(() => editingId !== null, [editingId]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await adminService.getFacilities();
      setFacilities(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
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

    if (!form.facilityName || !form.type || !form.location || !form.capacity) {
      return;
    }

    const payload = {
      ...form,
      capacity: Number(form.capacity),
    };

    try {
      if (isEditMode) {
        await adminService.updateFacility(editingId, payload);
        setSuccess('Facility updated successfully');
      } else {
        await adminService.createFacility(payload);
        setSuccess('Facility created successfully');
      }
      await fetchFacilities();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save facility');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      facilityName: item.facilityName,
      type: item.type,
      location: item.location,
      capacity: String(item.capacity),
      availability: item.availability,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility record?')) {
      return;
    }

    try {
      await adminService.deleteFacility(id);
      setSuccess('Facility deleted successfully');
      await fetchFacilities();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete facility');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Facilities Management</h1>
        <p className="text-gray-600 mt-1">Manage facilities with full CRUD for admin operations.</p>
      </header>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="facilityName" value={form.facilityName} onChange={handleChange} placeholder="Facility Name" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} placeholder="Capacity" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <select name="availability" value={form.availability} onChange={handleChange} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
            {isEditMode ? 'Update Facility' : 'Add Facility'}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">F_id</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Facility Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Availability</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading facilities...</td>
              </tr>
            )}
            {!loading && facilities.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No facility records yet.</td>
              </tr>
            )}
            {!loading && facilities.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{item.fId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.facilityName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.type}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.location}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.capacity}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.availability}</td>
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
