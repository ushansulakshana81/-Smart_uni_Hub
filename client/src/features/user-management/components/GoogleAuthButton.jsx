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
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) return;

    const existingScript = document.querySelector('script[data-google-gsi="true"]');

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setLoading(true);
            const payload = parseJwt(response.credential);

            const apiResponse = await authService.googleLogin(
              payload.email,
              payload.sub,
              payload.given_name || payload.name || 'Google',
              payload.family_name || ''
            );

            if (apiResponse.data?.success) {
              login(apiResponse.data.data);
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
    <div className="space-y-2">
      <div ref={buttonRef} className="flex justify-center" />
      {(!googleReady || loading) && <p className="text-sm text-gray-500 text-center">Preparing Google sign-in...</p>}
    </div>
  );
};
