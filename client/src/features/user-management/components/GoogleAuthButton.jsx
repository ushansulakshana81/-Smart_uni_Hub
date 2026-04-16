import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/apiService';

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export const GoogleAuthButton = ({ onError }) => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [googleReady, setGoogleReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingGooglePayload, setPendingGooglePayload] = useState(null);
  const [nicInput, setNicInput] = useState('');
  const [showNicModal, setShowNicModal] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const closeNicModal = () => {
    setShowNicModal(false);
    setPendingGooglePayload(null);
    setNicInput('');
  };

  const submitGoogleWithNic = async () => {
    if (!pendingGooglePayload) {
      return;
    }

    if (!nicInput.trim()) {
      onError?.('NIC number is required for Google sign-in');
      return;
    }

    try {
      setLoading(true);

      const apiResponse = await authService.googleLogin(
        pendingGooglePayload.email,
        pendingGooglePayload.sub,
        pendingGooglePayload.given_name || pendingGooglePayload.name || 'Google',
        pendingGooglePayload.family_name || '',
        nicInput.trim()
      );

      if (apiResponse.data?.success) {
        login(apiResponse.data.data);
        closeNicModal();
        navigate('/app/dashboard');
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Google login failed';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) return;

    const existingScript = document.querySelector('script[data-google-gsi="true"]');

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const payload = parseJwt(response.credential);
            setPendingGooglePayload(payload);
            setShowNicModal(true);
          } catch (error) {
            const message = error.response?.data?.message || error.message || 'Google login failed';
            onError?.(message);
          }
        },
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        width: 320,
        text: 'continue_with',
      });

      setGoogleReady(true);
    };

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = 'true';
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
    };
  }, [googleClientId, login, navigate, onError]);

  if (!googleClientId) {
    return (
      <p className="text-sm text-gray-500 text-center p-4">
        Google sign-in is unavailable. Set VITE_GOOGLE_CLIENT_ID in client/.env.local.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <div ref={buttonRef} className="flex justify-center" />
        {(!googleReady || loading) && <p className="text-sm text-gray-500 text-center">Preparing Google sign-in...</p>}
      </div>

      {showNicModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4" role="dialog" aria-modal="true" aria-labelledby="google-nic-title">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 id="google-nic-title" className="text-xl font-bold text-gray-900 mb-2">Complete Google Sign-In</h3>
            <p className="text-gray-600 mb-4">Enter your NIC number to continue. One NIC can be linked to only one account.</p>

            <label className="block text-gray-700 font-semibold mb-2">NIC Number</label>
            <input
              type="text"
              value={nicInput}
              onChange={(e) => setNicInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter NIC"
            />

            <div className="mt-5 flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeNicModal}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitGoogleWithNic}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
