import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AppShell = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [notifications] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    if (location.pathname.startsWith('/app/admin/')) {
      setAdminMenuOpen(true);
    }
  }, [location.pathname]);

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

  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-indigo-100 hover:bg-indigo-600/50'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-72 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-indigo-600">
          <h2 className="text-2xl font-bold">Campus Hub</h2>
          <p className="text-indigo-200 text-sm mt-1">{user?.role || 'USER'} Portal</p>
        </div>

        <nav className="p-6 space-y-2 flex-1">
          <NavLink to="/app/dashboard" className={navClass}>Dashboard</NavLink>
          <NavLink to="/app/facilities" className={navClass}>Facilities & Resources</NavLink>
          <NavLink to="/app/bookings" className={navClass}>Bookings</NavLink>
          <NavLink to="/app/support" className={navClass}>Maintenance & Support</NavLink>
          <NavLink to="/app/profile" className={navClass}>My Profile</NavLink>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setAdminMenuOpen((prev) => !prev)}
                className="w-full text-left px-4 py-2 rounded-lg transition text-indigo-100 hover:bg-indigo-600/50"
              >
                <span className="flex items-center justify-between">
                  <span>Admin Management</span>
                  <span className="text-xs">{adminMenuOpen ? 'v' : '>'}</span>
                </span>
              </button>

              {adminMenuOpen && (
                <div className="ml-3 mt-1 space-y-1 border-l border-indigo-500 pl-3">
                  <NavLink
                    to="/app/admin"
                    end
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive ? 'bg-indigo-500 text-white font-semibold' : 'text-indigo-100 hover:bg-indigo-600/40'
                      }`
                    }
                  >
                    User Management
                  </NavLink>
                  <NavLink
                    to="/app/admin/facilities-management"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive ? 'bg-indigo-500 text-white font-semibold' : 'text-indigo-100 hover:bg-indigo-600/40'
                      }`
                    }
                  >
                    Facilities Management
                  </NavLink>
                  <NavLink
                    to="/app/admin/assets-catalogue"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive ? 'bg-indigo-500 text-white font-semibold' : 'text-indigo-100 hover:bg-indigo-600/40'
                      }`
                    }
                  >
                    Assets Catalogue
                  </NavLink>
                  <NavLink
                    to="/app/admin/resources-management"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive ? 'bg-indigo-500 text-white font-semibold' : 'text-indigo-100 hover:bg-indigo-600/40'
                      }`
                    }
                  >
                    Resources Management
                  </NavLink>
                </div>
              )}
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          type="button"
          className="w-4/5 mx-auto mb-6 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName || 'User'}</h1>
              <p className="text-gray-600">Manage your campus workflow from one place.</p>
            </div>

            <div className="relative" ref={popupRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label="Open notifications"
                className="relative text-2xl hover:text-indigo-600 transition"
              >
                N
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {notifications.length === 0 && (
                      <li className="p-4 text-center text-gray-500">No notifications available.</li>
                    )}
                    {notifications.map((item) => (
                      <li key={item.id} className="p-4 hover:bg-gray-50 transition">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
