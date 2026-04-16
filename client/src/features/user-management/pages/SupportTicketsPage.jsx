import { useState } from 'react';

export const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTicket = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

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
    <section className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">Maintenance & Support</h2>
        <p className="text-gray-600 mt-2">Raise and track support tickets for campus issues.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Ticket</h3>
        <form className="space-y-4" onSubmit={createTicket}>
          <input
            type="text"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            rows={4}
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Ticket
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Ticket List</h3>
        <ul className="space-y-4">
          {tickets.length === 0 && (
            <li className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">No tickets available.</li>
          )}
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between"
            >
              <strong className="text-gray-900">#{ticket.id} {ticket.title}</strong>
              <span className="px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4 bg-yellow-100 text-yellow-800">
                {ticket.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
