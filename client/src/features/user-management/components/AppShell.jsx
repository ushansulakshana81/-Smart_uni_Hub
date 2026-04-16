import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/AppShell.css';

export const AppShell = () => {
  const { user, isAdmin, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h2>Campus Hub</h2>
          <p>{user?.role || 'USER'} Portal</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/app/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/facilities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span>Facilities & Resources</span>
          </NavLink>
          <NavLink to="/app/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span>Bookings</span>
          </NavLink>
          <NavLink to="/app/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span>Maintenance & Support</span>
          </NavLink>
          <NavLink to="/app/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span>My Profile</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/app/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span>Admin Users</span>
            </NavLink>
          )}
        </nav>

        <button onClick={handleLogout} className="sidebar-logout-btn" type="button">
          Logout
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="welcome-text">
            <h1>Welcome, {user?.firstName || 'User'}</h1>
            <p>Manage your campus workflow from one place.</p>
          </div>

          <div className="notification-wrapper" ref={popupRef}>
            <button
              type="button"
              className="notification-btn"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="Open notifications"
            >
              <span className="bell">🔔</span>
              <span className="badge">{notifications.length}</span>
            </button>

            {notificationsOpen && (
              <div className="notification-popup">
                <h3>Notifications</h3>
                <ul>
                  {notifications.length === 0 && (
                    <li>
                      <p className="detail">No notifications available.</p>
                    </li>
                  )}
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <p className="title">{item.title}</p>
                      <p className="detail">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
