import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/user-management/context/AuthContext';
import { LandingPage } from './features/user-management/pages/LandingPage';
import { LoginForm } from './features/user-management/components/LoginForm';
import { RegisterForm } from './features/user-management/components/RegisterForm';
import { ProfilePage } from './features/user-management/pages/ProfilePage';
import { AdminDashboard } from './features/user-management/pages/AdminDashboard';
import { ForgotPasswordPage } from './features/user-management/pages/ForgotPasswordPage';
import { ProtectedRoute } from './features/user-management/components/ProtectedRoute';

function AppContent() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
