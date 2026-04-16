import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/apiService';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await adminService.suspendUser(userId);
      setSuccess('User suspended successfully');
      fetchAllUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to suspend user');
    }
  };

  const handleUnsuspend = async (userId) => {
    try {
      await adminService.unsuspendUser(userId);
      setSuccess('User unsuspended successfully');
      fetchAllUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to unsuspend user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        setSuccess('User deleted successfully');
        fetchAllUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'suspended') return u.status === 'SUSPENDED';
    if (filter === 'active') return u.status === 'ACTIVE';
    if (filter === 'admins') return u.role === 'ADMIN';
    return true;
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const filterClass = (value) =>
    `px-4 py-2 rounded-lg font-semibold transition ${
      filter === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.firstName}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
          Logout
        </button>
      </header>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6"><h3 className="text-gray-600 font-semibold">Total Users</h3><p className="text-4xl font-bold text-indigo-600 mt-4">{users.length}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><h3 className="text-gray-600 font-semibold">Active Users</h3><p className="text-4xl font-bold text-green-600 mt-4">{users.filter((u) => u.status === 'ACTIVE').length}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><h3 className="text-gray-600 font-semibold">Suspended Users</h3><p className="text-4xl font-bold text-yellow-600 mt-4">{users.filter((u) => u.status === 'SUSPENDED').length}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><h3 className="text-gray-600 font-semibold">Admins</h3><p className="text-4xl font-bold text-purple-600 mt-4">{users.filter((u) => u.role === 'ADMIN').length}</p></div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
        <div className="flex gap-3 flex-wrap mb-6">
          <button className={filterClass('all')} onClick={() => setFilter('all')}>All Users</button>
          <button className={filterClass('active')} onClick={() => setFilter('active')}>Active</button>
          <button className={filterClass('suspended')} onClick={() => setFilter('suspended')}>Suspended</button>
          <button className={filterClass('admins')} onClick={() => setFilter('admins')}>Admins</button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found for this filter</td>
                  </tr>
                )}
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{`${u.firstName} ${u.lastName}`}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{u.role}</span></td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{u.status}</span></td>
                    <td className="px-6 py-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 space-y-2">
                      {u.status === 'ACTIVE' ? (
                        <button onClick={() => handleSuspend(u.id)} className="w-full px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded hover:bg-yellow-700 transition">Suspend</button>
                      ) : (
                        <button onClick={() => handleUnsuspend(u.id)} className="w-full px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition">Unsuspend</button>
                      )}
                      {u.role === 'USER' && (
                        <button onClick={() => handleDelete(u.id)} className="w-full px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
