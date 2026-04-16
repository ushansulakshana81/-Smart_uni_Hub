import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/LandingPage.css';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="brand">Smart Campus Operations Hub</h1>
          <p className="tagline">Streamline Campus Operations. Empower Your Community.</p>
        </div>
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Welcome, {user?.firstName}</span>
              <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/profile'} className="nav-link">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to Smart Campus Operations Hub</h2>
          <p>
            A comprehensive platform for managing campus operations, user profiles, and administrative
            tasks efficiently.
          </p>
          {!isAuthenticated && (
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>User Management</h3>
            <p>Create accounts, manage profiles, and control your personal information securely.</p>
          </div>
          <div className="feature-card">
            <h3>OAuth 2.0 Integration</h3>
            <p>Sign in with your Google account for quick and secure authentication.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Password Reset</h3>
            <p>Reset your password safely using email OTP with a 2-minute validity.</p>
          </div>
          <div className="feature-card">
            <h3>Admin Dashboard</h3>
            <p>Manage users, suspend accounts, and maintain platform security (Admin only).</p>
          </div>
          <div className="feature-card">
            <h3>Role-Based Access</h3>
            <p>Different permissions for users and admins ensuring secure access control.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Updates</h3>
            <p>Stay informed with real-time notifications and status updates.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-large">
            Create Your Account
          </Link>
        )}
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Smart Campus Operations Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};
