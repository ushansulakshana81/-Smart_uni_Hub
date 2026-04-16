import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of your most important campus activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-600 font-semibold">Upcoming Bookings</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-4">0</p>
        </article>
        <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-600 font-semibold">Open Tickets</h3>
          <p className="text-4xl font-bold text-orange-600 mt-4">0</p>
        </article>
        <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-600 font-semibold">Available Facilities</h3>
          <p className="text-4xl font-bold text-green-600 mt-4">0</p>
        </article>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Summary</h3>
        <p className="text-gray-600 leading-relaxed">
          Hi {user?.firstName}, this dashboard gives you quick access to facilities, bookings, and support actions.
          No records are currently loaded.
        </p>
      </div>
    </section>
  );
};
