import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/user-management/context/AuthContext';
import { useAuth } from './features/user-management/hooks/useAuth';
import { LandingPage } from './features/user-management/pages/LandingPage';
import { LoginForm } from './features/user-management/components/LoginForm';
import { RegisterForm } from './features/user-management/components/RegisterForm';
import { ProfilePage } from './features/user-management/pages/ProfilePage';
import { AdminDashboard } from './features/user-management/pages/AdminDashboard';
import { ForgotPasswordPage } from './features/user-management/pages/ForgotPasswordPage';
import { ProtectedRoute } from './features/user-management/components/ProtectedRoute';
import { AppShell } from './features/user-management/components/AppShell';
import { DashboardPage } from './features/user-management/pages/DashboardPage';
import { FacilitiesResourcesPage } from './features/user-management/pages/FacilitiesResourcesPage';
import { BookingsPage } from './features/user-management/pages/BookingsPage';
import { SupportTicketsPage } from './features/user-management/pages/SupportTicketsPage';
import { AdminFacilitiesManagementPage } from './features/user-management/pages/AdminFacilitiesManagementPage';
import { AdminAssetsCataloguePage } from './features/user-management/pages/AdminAssetsCataloguePage';

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
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="facilities" element={<FacilitiesResourcesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="support" element={<SupportTicketsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/facilities-management"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminFacilitiesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/assets-catalogue"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminAssetsCataloguePage />
            </ProtectedRoute>
          }
        />
      </Route>
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
