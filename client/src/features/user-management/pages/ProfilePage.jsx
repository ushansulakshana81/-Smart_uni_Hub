import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/apiService';
import '../styles/ProfilePage.css';

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

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-content">
          <div className="profile-info-card">
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile?.firstName}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Last Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile?.lastName}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <p>{profile?.email}</p>
                </div>

                <div className="info-item">
                  <label>Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile?.phoneNumber || 'Not provided'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Department</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile?.department || 'Not provided'}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Role</label>
                  <p>{profile?.role}</p>
                </div>

                <div className="info-item">
                  <label>Account Status</label>
                  <p className={`status ${profile?.status?.toLowerCase()}`}>{profile?.status}</p>
                </div>

                <div className="info-item">
                  <label>Joined</label>
                  <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="edit-btn">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={loading} className="save-btn">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditMode(false)} className="cancel-btn">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
