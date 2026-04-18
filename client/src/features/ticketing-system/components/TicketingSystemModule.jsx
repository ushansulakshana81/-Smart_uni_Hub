import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../user-management/hooks/useAuth';
import { ticketingService } from '../../user-management/services/apiService';

const emptyTicketForm = {
  title: '',
  description: '',
  issueType: 'FACILITY',
  facilityOrAssetName: '',
  location: '',
};

const emptyResponseMap = {};

const statusTone = {
  OPEN: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
  CLOSED: 'bg-slate-200 text-slate-800',
  REJECTED: 'bg-rose-100 text-rose-800',
};

const allowedStatusByCurrent = {
  OPEN: ['RESOLVED', 'REJECTED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  REJECTED: [],
};

const getAllowedStatus = (ticket, isAdmin) => {
  if (!ticket?.status) return [];
  const nextStatuses = allowedStatusByCurrent[ticket.status] || [];

  if (isAdmin) {
    return nextStatuses;
  }

  if (ticket.status === 'RESOLVED') {
    return ['CLOSED'];
  }

  return [];
};

export const TicketingSystemModule = () => {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ticketForm, setTicketForm] = useState(emptyTicketForm);
  const [responseDrafts, setResponseDrafts] = useState(emptyResponseMap);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [resolutionDrafts, setResolutionDrafts] = useState({});
  const [editingResponse, setEditingResponse] = useState({});

  const totalCounts = useMemo(() => {
    const byStatus = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    return {
      all: tickets.length,
      open: byStatus.OPEN || 0,
      resolved: byStatus.RESOLVED || 0,
      closed: byStatus.CLOSED || 0,
      rejected: byStatus.REJECTED || 0,
    };
  }, [tickets]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketingService.getTickets();
      const ticketData = response.data.data || [];
      setTickets(ticketData);

      const nextStatusDrafts = {};
      const nextResolutionDrafts = {};
      ticketData.forEach((ticket) => {
        nextStatusDrafts[ticket.id] = '';
        nextResolutionDrafts[ticket.id] = ticket.resolutionNotes || '';
      });
      setStatusDrafts(nextStatusDrafts);
      setResolutionDrafts(nextResolutionDrafts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const clearAlerts = () => {
    setError('');
    setSuccess('');
  };

  const handleTicketField = (event) => {
    const { name, value } = event.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    clearAlerts();

    try {
      await ticketingService.createTicket(ticketForm);
      setSuccess('Ticket created successfully');
      setTicketForm(emptyTicketForm);
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleResponseDraftChange = (ticketId, value) => {
    setResponseDrafts((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleAddResponse = async (ticketId) => {
    clearAlerts();
    const message = (responseDrafts[ticketId] || '').trim();
    if (!message) {
      setError('Response message is required');
      return;
    }

    try {
      await ticketingService.addResponse(ticketId, { message });
      setSuccess('Response added successfully');
      setResponseDrafts((prev) => ({ ...prev, [ticketId]: '' }));
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add response');
    }
  };

  const handleStatusChange = async (ticket) => {
    clearAlerts();
    const nextStatus = statusDrafts[ticket.id];
    if (!nextStatus) {
      setError('Select a status to update');
      return;
    }

    const payload = {
      status: nextStatus,
      resolutionNotes: resolutionDrafts[ticket.id] || '',
    };

    try {
      await ticketingService.updateTicketStatus(ticket.id, payload);
      setSuccess('Ticket status updated successfully');
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    clearAlerts();
    if (!window.confirm('Delete this ticket?')) return;

    try {
      await ticketingService.deleteTicket(ticketId);
      setSuccess('Ticket deleted successfully');
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const handleEditResponseToggle = (ticketId, responseId, message) => {
    setEditingResponse({ ticketId, responseId, message });
  };

  const handleUpdateResponse = async () => {
    clearAlerts();
    const message = (editingResponse.message || '').trim();
    if (!message) {
      setError('Response message is required');
      return;
    }

    try {
      await ticketingService.updateResponse(editingResponse.ticketId, editingResponse.responseId, { message });
      setSuccess('Response updated successfully');
      setEditingResponse({});
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update response');
    }
  };

  const handleDeleteResponse = async (ticketId, responseId) => {
    clearAlerts();
    if (!window.confirm('Delete this response?')) return;

    try {
      await ticketingService.deleteResponse(ticketId, responseId);
      setSuccess('Response deleted successfully');
      await fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete response');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-bold text-gray-900">Maintenance & Support Ticketing</h2>
        <p className="mt-2 text-gray-600">
          Report issues, track updates, and close tickets after confirmation.
        </p>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{success}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">All</p><p className="text-2xl font-bold text-gray-900">{totalCounts.all}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Open</p><p className="text-2xl font-bold text-blue-700">{totalCounts.open}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Resolved</p><p className="text-2xl font-bold text-emerald-700">{totalCounts.resolved}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Closed</p><p className="text-2xl font-bold text-slate-700">{totalCounts.closed}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Rejected</p><p className="text-2xl font-bold text-rose-700">{totalCounts.rejected}</p></div>
      </div>

      <form onSubmit={handleCreateTicket} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Create New Ticket</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input name="title" value={ticketForm.title} onChange={handleTicketField} placeholder="Issue title" className="rounded-lg border border-gray-300 px-4 py-2" required />
          <select name="issueType" value={ticketForm.issueType} onChange={handleTicketField} className="rounded-lg border border-gray-300 px-4 py-2" required>
            <option value="FACILITY">Facility</option>
            <option value="ASSET">Asset</option>
          </select>
          <input name="facilityOrAssetName" value={ticketForm.facilityOrAssetName} onChange={handleTicketField} placeholder="Facility or asset name" className="rounded-lg border border-gray-300 px-4 py-2" required />
          <input name="location" value={ticketForm.location} onChange={handleTicketField} placeholder="Location" className="rounded-lg border border-gray-300 px-4 py-2" required />
        </div>
        <textarea name="description" value={ticketForm.description} onChange={handleTicketField} placeholder="Describe the issue in detail" rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2" required />
        <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700">Submit Ticket</button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Tickets</h3>
        {loading && <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">Loading tickets...</div>}
        {!loading && tickets.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">No tickets available.</div>
        )}

        {!loading && tickets.map((ticket) => {
          const allowedStatus = getAllowedStatus(ticket, isAdmin);
          const statusDraft = statusDrafts[ticket.id] || '';

          return (
            <article key={ticket.id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{ticket.ticketCode}</p>
                  <h4 className="text-lg font-bold text-gray-900">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">{ticket.issueType} - {ticket.facilityOrAssetName} - {ticket.location}</p>
                  <p className="mt-2 text-sm text-gray-700">{ticket.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                  {ticket.status}
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p><span className="font-semibold">Reported by:</span> {ticket.createdByName} ({ticket.createdByEmail})</p>
                {ticket.resolutionNotes && <p className="mt-2"><span className="font-semibold">Resolution Notes:</span> {ticket.resolutionNotes}</p>}
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Responses</h5>
                {ticket.responses?.length === 0 && <p className="text-sm text-gray-500">No responses yet.</p>}
                {ticket.responses?.map((response) => (
                  <div key={response.id} className="rounded-lg border border-gray-200 p-3">
                    {editingResponse.responseId === response.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={editingResponse.message}
                          onChange={(event) => setEditingResponse((prev) => ({ ...prev, message: event.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={handleUpdateResponse} className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">Save</button>
                          <button type="button" onClick={() => setEditingResponse({})} className="rounded bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700">{response.message}</p>
                        <p className="mt-1 text-xs text-gray-500">{response.createdByName} ({response.createdByRole})</p>
                      </>
                    )}

                    {isAdmin && editingResponse.responseId !== response.id && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditResponseToggle(ticket.id, response.id, response.message)}
                          className="rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white"
                        >
                          Edit Response
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResponse(ticket.id, response.id)}
                          className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white"
                        >
                          Delete Response
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <textarea
                  rows={2}
                  value={responseDrafts[ticket.id] || ''}
                  onChange={(event) => handleResponseDraftChange(ticket.id, event.target.value)}
                  placeholder="Add response"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <div className="flex items-end">
                  <button type="button" onClick={() => handleAddResponse(ticket.id)} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
                    Add Response
                  </button>
                </div>
              </div>

              {allowedStatus.length > 0 && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-3">
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDrafts((prev) => ({ ...prev, [ticket.id]: event.target.value }))}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select next status</option>
                    {allowedStatus.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={resolutionDrafts[ticket.id] || ''}
                    onChange={(event) => setResolutionDrafts((prev) => ({ ...prev, [ticket.id]: event.target.value }))}
                    placeholder="Resolution notes (required for RESOLVED)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <button type="button" onClick={() => handleStatusChange(ticket)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                    Update Status
                  </button>
                </div>
              )}

              {isAdmin && (
                <div>
                  <button type="button" onClick={() => handleDeleteTicket(ticket.id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    Delete Ticket
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
