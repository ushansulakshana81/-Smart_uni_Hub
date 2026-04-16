import { useAuth } from '../hooks/useAuth';
import '../styles/SectionPages.css';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <section className="section-page">
      <div className="section-header">
        <h2>Dashboard</h2>
        <p>Overview of your most important campus activities.</p>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <h3>Upcoming Bookings</h3>
          <p className="metric-number">0</p>
        </article>
        <article className="metric-card">
          <h3>Open Tickets</h3>
          <p className="metric-number">0</p>
        </article>
        <article className="metric-card">
          <h3>Available Facilities</h3>
          <p className="metric-number">0</p>
        </article>
      </div>

      <div className="content-card">
        <h3>Quick Summary</h3>
        <p>
          Hi {user?.firstName}, this dashboard gives you quick access to facilities, bookings,
          and support actions. No records are currently loaded.
        </p>
      </div>
    </section>
  );
};
