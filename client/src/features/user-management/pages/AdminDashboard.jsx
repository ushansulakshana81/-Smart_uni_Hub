import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/apiService';
import '../styles/AdminDashboard.css';

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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.firstName}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">{users.filter((u) => u.status === 'ACTIVE').length}</p>
          </div>
          <div className="stat-card">
            <h3>Suspended Users</h3>
            <p className="stat-number">{users.filter((u) => u.status === 'SUSPENDED').length}</p>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <p className="stat-number">{users.filter((u) => u.role === 'ADMIN').length}</p>
          </div>
        </div>

        <div className="users-section">
          <div className="section-header">
            <h2>User Management</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Users
              </button>
              <button
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`filter-btn ${filter === 'suspended' ? 'active' : ''}`}
                onClick={() => setFilter('suspended')}
              >
                Suspended
              </button>
              <button
                className={`filter-btn ${filter === 'admins' ? 'active' : ''}`}
                onClick={() => setFilter('admins')}
              >
                Admins
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{`${u.firstName} ${u.lastName}`}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className={`status ${u.status.toLowerCase()}`}>{u.status}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="actions">
                        {u.status === 'ACTIVE' ? (
                          <button onClick={() => handleSuspend(u.id)} className="btn-suspend">
                            Suspend
                          </button>
                        ) : (
                          <button onClick={() => handleUnsuspend(u.id)} className="btn-unsuspend">
                            Unsuspend
                          </button>
                        )}
                        {u.role === 'USER' && (
                          <button onClick={() => handleDelete(u.id)} className="btn-delete">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <p className="no-data">No users found for this filter</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
