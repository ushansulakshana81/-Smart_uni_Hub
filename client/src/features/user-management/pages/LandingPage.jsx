import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600">Smart Campus Operations Hub</h1>
            <p className="text-gray-600 text-sm mt-1">Streamline Campus Operations. Empower Your Community.</p>
          </div>
          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium">Welcome, {user?.firstName}</span>
                <Link
                  to={user?.role === 'ADMIN' ? '/app/admin' : '/app/dashboard'}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="py-20 px-6 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Smart Campus Operations Hub</h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            A comprehensive platform for managing campus operations, user profiles, and administrative tasks efficiently.
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 font-semibold transition"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              ['User Management', 'Create accounts, manage profiles, and control your personal information securely.'],
              ['OAuth 2.0 Integration', 'Sign in with your Google account for quick and secure authentication.'],
              ['Secure Password Reset', 'Reset your password safely using email OTP with a 2-minute validity.'],
              ['Admin Dashboard', 'Manage users, suspend accounts, and maintain platform security (Admin only).'],
              ['Role-Based Access', 'Different permissions for users and admins ensuring secure access control.'],
              ['Real-time Updates', 'Stay informed with real-time notifications and status updates.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-indigo-600 mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 py-16 px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Ready to Get Started?</h2>
        {!isAuthenticated && (
          <div className="text-center">
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Create Your Account
            </Link>
          </div>
        )}
      </section>

      <footer className="bg-gray-900 text-white text-center py-8 mt-auto">
        <p>&copy; 2026 Smart Campus Operations Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};
