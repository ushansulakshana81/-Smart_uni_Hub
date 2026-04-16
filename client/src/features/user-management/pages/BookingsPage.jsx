import { useMemo, useState } from 'react';
import '../styles/SectionPages.css';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ resource: '', date: '', time: '' });

  const canSubmit = useMemo(
    () => formData.resource.trim() && formData.date && formData.time,
    [formData]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

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
    <section className="section-page">
      <div className="section-header">
        <h2>Bookings</h2>
        <p>Create and review your facility reservations.</p>
      </div>

      <div className="content-card">
        <h3>Create Booking</h3>
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Resource name"
            value={formData.resource}
            onChange={(e) => setFormData((prev) => ({ ...prev, resource: e.target.value }))}
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Time (e.g. 3:00 PM)"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
          />
          <button type="submit" disabled={!canSubmit}>
            Add Booking
          </button>
        </form>
      </div>

      <div className="content-card">
        <h3>Upcoming Bookings</h3>
        <ul className="item-list">
          {bookings.length === 0 && <li><span>No bookings available.</span></li>}
          {bookings.map((booking) => (
            <li key={booking.id}>
              <strong>{booking.resource}</strong>
              <span>{booking.date} at {booking.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
