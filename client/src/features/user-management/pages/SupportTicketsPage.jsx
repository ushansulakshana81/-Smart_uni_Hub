import { useState } from 'react';
import '../styles/SectionPages.css';

export const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTicket = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setTickets((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        status: 'Open',
      },
      ...prev,
    ]);

    setTitle('');
    setDescription('');
  };

  return (
    <section className="section-page">
      <div className="section-header">
        <h2>Maintenance & Support</h2>
        <p>Raise and track support tickets for campus issues.</p>
      </div>

      <div className="content-card">
        <h3>Create Ticket</h3>
        <form className="stacked-form" onSubmit={createTicket}>
          <input
            type="text"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={4}
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Submit Ticket</button>
        </form>
      </div>

      <div className="content-card">
        <h3>Ticket List</h3>
        <ul className="item-list">
          {tickets.length === 0 && <li><span>No tickets available.</span></li>}
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>#{ticket.id} {ticket.title}</strong>
              <span className={`status-chip ${ticket.status === 'Open' ? 'warn' : 'ok'}`}>
                {ticket.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
