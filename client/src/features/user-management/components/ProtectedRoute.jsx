import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, authInitialized } = useAuth();

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
