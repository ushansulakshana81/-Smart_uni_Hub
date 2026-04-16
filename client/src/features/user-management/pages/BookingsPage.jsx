import { useMemo, useState } from 'react';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ resource: '', date: '', time: '' });

  const canSubmit = useMemo(
    () => formData.resource.trim() && formData.date && formData.time,
    [formData]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setBookings((prev) => [
      ...prev,
      {
        id: Date.now(),
        resource: formData.resource.trim(),
        date: formData.date,
        time: formData.time,
      },
    ]);

    setFormData({ resource: '', date: '', time: '' });
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">Bookings</h2>
        <p className="text-gray-600 mt-2">Create and review your facility reservations.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Booking</h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Resource name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.resource}
            onChange={(e) => setFormData((prev) => ({ ...prev, resource: e.target.value }))}
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Time (e.g. 3:00 PM)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Add Booking
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Bookings</h3>
        <ul className="space-y-4">
          {bookings.length === 0 && (
            <li className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">No bookings available.</li>
          )}
          {bookings.map((booking) => (
            <li key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <strong className="text-gray-900 block">{booking.resource}</strong>
              <span className="text-gray-600 text-sm mt-2 block">{booking.date} at {booking.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
