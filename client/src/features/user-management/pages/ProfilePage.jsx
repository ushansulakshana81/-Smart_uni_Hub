import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/apiService';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
  });

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userService.updateProfile(user.id, formData);
      if (response.data.success) {
        setProfile(response.data.data);
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const infoRow = (label, value) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <p className="text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
          Logout
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">First Name</label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{profile?.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{profile?.lastName}</p>
            )}
          </div>

          {infoRow('Email', profile?.email)}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            {editMode ? (
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Department</label>
            {editMode ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{profile?.department || 'Not provided'}</p>
            )}
          </div>

          {infoRow('Role', profile?.role)}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Account Status</label>
            <p className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${profile?.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {profile?.status}
            </p>
          </div>

          {infoRow('Joined', profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A')}
        </div>

        <div className="mt-8 flex gap-4">
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditMode(false)} className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
