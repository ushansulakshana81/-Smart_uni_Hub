import { createContext, useState, useCallback, useEffect, useRef } from 'react';

export const AuthContext = createContext();

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'lastActivityAt';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inactivityTimerRef = useRef(null);

  const login = useCallback((userData) => {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setUser(null);
  }, []);

  const register = useCallback((userData) => {
    login(userData);
  }, [login]);

  // Initialize user from localStorage
  const initializeAuth = useCallback(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const lastActivityAt = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (storedToken && storedUser && lastActivityAt) {
      const elapsed = Date.now() - Number(lastActivityAt);
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        logout();
        return;
      }
    }

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    }
  }, [logout]);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const scheduleInactivityLogout = useCallback(() => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimer, logout]);

  const recordActivity = useCallback(() => {
    if (!user) {
      return;
    }
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    scheduleInactivityLogout();
  }, [scheduleInactivityLogout, user]);

  useEffect(() => {
    if (!user) {
      clearInactivityTimer();
      return;
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastActivityAt = localStorage.getItem(LAST_ACTIVITY_KEY);
        const elapsed = Date.now() - Number(lastActivityAt || Date.now());
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          logout();
          return;
        }
      }
      recordActivity();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    recordActivity();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInactivityTimer();
    };
  }, [clearInactivityTimer, logout, recordActivity, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        initializeAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
