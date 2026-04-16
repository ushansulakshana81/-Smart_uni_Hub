import { createContext, useState, useCallback, useEffect, useRef } from 'react';

export const AuthContext = createContext();

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;
const EXTENDED_TIMEOUT_MS = 10 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'lastActivityAt';
const TIMEOUT_WINDOW_KEY = 'sessionTimeoutWindowMs';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTimeoutPrompt, setShowTimeoutPrompt] = useState(false);
  const inactivityTimerRef = useRef(null);

  const getTimeoutWindowMs = useCallback(() => {
    const stored = Number(localStorage.getItem(TIMEOUT_WINDOW_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_TIMEOUT_MS;
  }, []);

  const setTimeoutWindowMs = useCallback((value) => {
    localStorage.setItem(TIMEOUT_WINDOW_KEY, String(value));
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    localStorage.setItem(TIMEOUT_WINDOW_KEY, String(DEFAULT_TIMEOUT_MS));
    setShowTimeoutPrompt(false);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    localStorage.removeItem(TIMEOUT_WINDOW_KEY);
    setShowTimeoutPrompt(false);
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
    const timeoutWindowMs = getTimeoutWindowMs();

    if (storedToken && storedUser && lastActivityAt) {
      const elapsed = Date.now() - Number(lastActivityAt);
      const userData = JSON.parse(storedUser);
      setUser(userData);

      if (elapsed >= timeoutWindowMs) {
        setShowTimeoutPrompt(true);
      } else {
        setShowTimeoutPrompt(false);
      }
      return;
    }

    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      setShowTimeoutPrompt(false);
    }
  }, [getTimeoutWindowMs]);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const scheduleInactivityPrompt = useCallback((delayMs = null) => {
    clearInactivityTimer();
    const timeoutWindowMs = getTimeoutWindowMs();
    const effectiveDelay = delayMs ?? timeoutWindowMs;

    inactivityTimerRef.current = setTimeout(() => {
      setShowTimeoutPrompt(true);
    }, effectiveDelay);
  }, [clearInactivityTimer, getTimeoutWindowMs]);

  const recordActivity = useCallback(() => {
    if (!user || showTimeoutPrompt) {
      return;
    }
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    scheduleInactivityPrompt();
  }, [scheduleInactivityPrompt, showTimeoutPrompt, user]);

  const handleExtendSession = useCallback(() => {
    setTimeoutWindowMs(EXTENDED_TIMEOUT_MS);
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    setShowTimeoutPrompt(false);
    scheduleInactivityPrompt(EXTENDED_TIMEOUT_MS);
  }, [scheduleInactivityPrompt, setTimeoutWindowMs]);

  const handleForceLogout = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (!user) {
      clearInactivityTimer();
      return;
    }

    const lastActivityAt = localStorage.getItem(LAST_ACTIVITY_KEY);
    const timeoutWindowMs = getTimeoutWindowMs();
    if (lastActivityAt && !showTimeoutPrompt) {
      const elapsed = Date.now() - Number(lastActivityAt);
      const remaining = Math.max(timeoutWindowMs - elapsed, 0);
      scheduleInactivityPrompt(remaining);
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastActivityAt = localStorage.getItem(LAST_ACTIVITY_KEY);
        const timeoutWindowMs = getTimeoutWindowMs();
        const elapsed = Date.now() - Number(lastActivityAt || Date.now());
        if (elapsed >= timeoutWindowMs) {
          setShowTimeoutPrompt(true);
          return;
        }
      }
      recordActivity();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!showTimeoutPrompt) {
      recordActivity();
    }

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInactivityTimer();
    };
  }, [clearInactivityTimer, getTimeoutWindowMs, recordActivity, scheduleInactivityPrompt, showTimeoutPrompt, user]);

  return (
    <>
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

      {showTimeoutPrompt && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4" role="dialog" aria-modal="true" aria-labelledby="session-timeout-title">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h3 id="session-timeout-title" className="text-2xl font-bold text-gray-900 mb-3">Session Timeout</h3>
            <p className="text-gray-600 mb-6">Your session has been inactive. Do you want to extend it?</p>
            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition" 
                onClick={handleExtendSession}
              >
                Extend 10 Minutes
              </button>
              <button 
                type="button" 
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition" 
                onClick={handleForceLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
