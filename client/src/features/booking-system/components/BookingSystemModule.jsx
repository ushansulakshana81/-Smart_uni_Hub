import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../user-management/hooks/useAuth';
import { bookingService, catalogService } from '../../user-management/services/apiService';

const emptyBookingForm = {
  resourceType: 'FACILITY',
  resourceId: '',
  bookingDate: '',
  startTime: '',
  endTime: '',
  expectedAttendees: '',
  purpose: '',
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const statusTone = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800',
  CANCELLED: 'bg-slate-200 text-slate-700',
};

const resourceLabel = (booking) => booking.resourceType === 'ASSET' ? booking.resourceName : booking.resourceDisplayName;

const decisionToStatus = (decision) => {
  if (decision === 'APPROVE') return 'APPROVED';
  if (decision === 'REJECT') return 'REJECTED';
  return '';
};

export const BookingSystemModule = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [adminFilters, setAdminFilters] = useState({
    status: '',
    resourceType: '',
    fromDate: '',
    toDate: '',
    search: '',
  });
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [cancelDrafts, setCancelDrafts] = useState({});

  const fetchCatalog = async () => {
    try {
      const [facilityResponse, assetResponse] = await Promise.all([
        catalogService.getFacilities(),
        catalogService.getAssets(),
      ]);
      setFacilities(facilityResponse.data.data || []);
      setAssets(assetResponse.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load catalog data');
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = isAdmin
        ? {
            adminView: true,
            status: adminFilters.status || undefined,
            resourceType: adminFilters.resourceType || undefined,
            fromDate: adminFilters.fromDate || undefined,
            toDate: adminFilters.toDate || undefined,
            search: adminFilters.search || undefined,
          }
        : { adminView: false };

      const response = await bookingService.getBookings(params);
      const bookingData = response.data.data || [];
      setBookings(bookingData);

      const nextReviewDrafts = {};
      const nextCancelDrafts = {};
      bookingData.forEach((booking) => {
        nextReviewDrafts[booking.id] = { decision: '', reason: '' };
        nextCancelDrafts[booking.id] = '';
      });
      setReviewDrafts(nextReviewDrafts);
      setCancelDrafts(nextCancelDrafts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [adminFilters, isAdmin]);

  const resourceOptions = useMemo(() => {
    const query = normalize(resourceSearch);
    const source = bookingForm.resourceType === 'ASSET' ? assets : facilities;

    return source
      .filter((item) => {
        if (!query) return true;
        const name = bookingForm.resourceType === 'ASSET' ? item.name : item.facilityName;
        return normalize(name).includes(query) || normalize(item.location).includes(query) || normalize(item.id).includes(query);
      })
      .slice(0, 8)
      .map((item) => {
        const name = bookingForm.resourceType === 'ASSET' ? item.name : item.facilityName;
        return {
          id: item.id,
          label: name,
          location: item.location,
          availability: bookingForm.resourceType === 'ASSET' ? item.status : item.availability,
        };
      });
  }, [assets, facilities, resourceSearch, bookingForm.resourceType]);

  const summaryCounts = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      },
      { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 }
    );
  }, [bookings]);

  const handleBookingField = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'resourceType') {
      setSelectedResource(null);
      setResourceSearch('');
      setBookingForm((prev) => ({ ...prev, resourceId: '', resourceType: value }));
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreateBooking = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!selectedResource) {
      setError('Please select a facility or asset from the database suggestions');
      return;
    }

    try {
      await bookingService.createBooking({
        ...bookingForm,
        resourceId: selectedResource.id,
        expectedAttendees: bookingForm.expectedAttendees ? Number(bookingForm.expectedAttendees) : null,
      });
      setSuccess('Booking request submitted successfully');
      setBookingForm(emptyBookingForm);
      setSelectedResource(null);
      setResourceSearch('');
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleSelectResource = (resource) => {
    setSelectedResource(resource);
    setResourceSearch(resource.label);
    setBookingForm((prev) => ({ ...prev, resourceId: resource.id }));
  };

  const handleReviewDraftChange = (bookingId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [bookingId]: {
        ...(prev[bookingId] || { decision: '', reason: '' }),
        [field]: value,
      },
    }));
  };

  const handleReviewBooking = async (bookingId) => {
    clearMessages();
    const draft = reviewDrafts[bookingId] || { decision: '', reason: '' };
    if (!draft.decision) {
      setError('Choose approve or reject');
      return;
    }

    try {
      await bookingService.reviewBooking(bookingId, {
        decision: draft.decision,
        status: decisionToStatus(draft.decision),
        reason: draft.reason,
      });
      setSuccess('Booking review updated successfully');
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to review booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    clearMessages();
    try {
      await bookingService.cancelBooking(bookingId, {
        reason: cancelDrafts[bookingId] || '',
      });
      setSuccess('Booking cancelled successfully');
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    clearMessages();
    if (!window.confirm('Delete this booking?')) return;
    try {
      await bookingService.deleteBooking(bookingId);
      setSuccess('Booking deleted successfully');
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-900">Bookings</h2>
        <p className="text-gray-600">
          Request facilities or assets, track approval status, and manage scheduling conflicts.
        </p>
      </header>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{success}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{summaryCounts.PENDING}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-emerald-600">{summaryCounts.APPROVED}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-rose-600">{summaryCounts.REJECTED}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-slate-600">{summaryCounts.CANCELLED}</p>
        </div>
      </div>

      <form onSubmit={handleCreateBooking} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Create Booking Request</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select name="resourceType" value={bookingForm.resourceType} onChange={handleBookingField} className="rounded-lg border border-gray-300 px-4 py-2" required>
            <option value="FACILITY">Facility</option>
            <option value="ASSET">Asset</option>
          </select>
          <input
            type="date"
            name="bookingDate"
            value={bookingForm.bookingDate}
            onChange={handleBookingField}
            className="rounded-lg border border-gray-300 px-4 py-2"
            required
          />
          <input
            type="time"
            name="startTime"
            value={bookingForm.startTime}
            onChange={handleBookingField}
            className="rounded-lg border border-gray-300 px-4 py-2"
            required
          />
          <input
            type="time"
            name="endTime"
            value={bookingForm.endTime}
            onChange={handleBookingField}
            className="rounded-lg border border-gray-300 px-4 py-2"
            required
          />
          <input
            type="number"
            min="1"
            name="expectedAttendees"
            value={bookingForm.expectedAttendees}
            onChange={handleBookingField}
            placeholder="Expected attendees (optional)"
            className="rounded-lg border border-gray-300 px-4 py-2"
          />
          <textarea
            name="purpose"
            value={bookingForm.purpose}
            onChange={handleBookingField}
            placeholder="Purpose"
            rows={3}
            className="rounded-lg border border-gray-300 px-4 py-2"
            required
          />
        </div>

        <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-gray-900">Select resource from database</h4>
              <p className="text-sm text-gray-600">Search and pick the facility or asset you want to book.</p>
            </div>
            {selectedResource && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Selected</span>}
          </div>
          <input
            type="text"
            value={resourceSearch}
            onChange={(event) => setResourceSearch(event.target.value)}
            placeholder={bookingForm.resourceType === 'ASSET' ? 'Search assets by name, location, or id' : 'Search facilities by name, location, or id'}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          <div className="flex flex-wrap gap-2">
            {resourceOptions.length === 0 && (
              <span className="text-sm text-gray-500">No matching resources found</span>
            )}
            {resourceOptions.map((resource) => (
              <button
                type="button"
                key={resource.id}
                onClick={() => handleSelectResource(resource)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  selectedResource?.id === resource.id
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                {resource.label}
              </button>
            ))}
          </div>
          {selectedResource && (
            <p className="text-sm text-gray-700">
              Selected resource: <span className="font-semibold">{selectedResource.label}</span>
            </p>
          )}
        </div>

        <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700">
          Submit Booking
        </button>
      </form>

      {isAdmin && (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Admin Filters</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <select value={adminFilters.status} onChange={(event) => setAdminFilters((prev) => ({ ...prev, status: event.target.value }))} className="rounded-lg border border-gray-300 px-4 py-2">
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select value={adminFilters.resourceType} onChange={(event) => setAdminFilters((prev) => ({ ...prev, resourceType: event.target.value }))} className="rounded-lg border border-gray-300 px-4 py-2">
              <option value="">All resource types</option>
              <option value="FACILITY">Facility</option>
              <option value="ASSET">Asset</option>
            </select>
            <input type="date" value={adminFilters.fromDate} onChange={(event) => setAdminFilters((prev) => ({ ...prev, fromDate: event.target.value }))} className="rounded-lg border border-gray-300 px-4 py-2" />
            <input type="date" value={adminFilters.toDate} onChange={(event) => setAdminFilters((prev) => ({ ...prev, toDate: event.target.value }))} className="rounded-lg border border-gray-300 px-4 py-2" />
            <input
              type="text"
              value={adminFilters.search}
              onChange={(event) => setAdminFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Search by code, purpose, or resource"
              className="rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
        </section>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{isAdmin ? 'All Bookings' : 'My Bookings'}</h3>
        {loading && <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">Loading bookings...</div>}
        {!loading && bookings.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">No bookings available.</div>
        )}

        {!loading && bookings.map((booking) => {
          const reviewDraft = reviewDrafts[booking.id] || { decision: '', reason: '' };
          const canReview = isAdmin && booking.status === 'PENDING';
          const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';

          return (
            <article key={booking.id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{booking.bookingCode}</p>
                  <h4 className="text-lg font-bold text-gray-900">{resourceLabel(booking)}</h4>
                  <p className="text-sm text-gray-600">
                    {booking.resourceType} - {booking.location} - {booking.bookingDate}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{booking.purpose}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.startTime} to {booking.endTime}
                    {booking.expectedAttendees ? ` | Expected attendees: ${booking.expectedAttendees}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                  {booking.status}
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p><span className="font-semibold">Requested by:</span> {booking.createdByName} ({booking.createdByEmail})</p>
                {booking.reviewReason && <p className="mt-2"><span className="font-semibold">Review reason:</span> {booking.reviewReason}</p>}
                {booking.cancelReason && <p className="mt-2"><span className="font-semibold">Cancel reason:</span> {booking.cancelReason}</p>}
              </div>

              {canReview && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-3">
                  <select
                    value={reviewDraft.decision}
                    onChange={(event) => handleReviewDraftChange(booking.id, 'decision', event.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="">Choose decision</option>
                    <option value="APPROVE">Approve</option>
                    <option value="REJECT">Reject</option>
                  </select>
                  <input
                    type="text"
                    value={reviewDraft.reason}
                    onChange={(event) => handleReviewDraftChange(booking.id, 'reason', event.target.value)}
                    placeholder="Reason required"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <button type="button" onClick={() => handleReviewBooking(booking.id)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                    Save Review
                  </button>
                </div>
              )}

              {canCancel && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-3">
                  <input
                    type="text"
                    value={cancelDrafts[booking.id] || ''}
                    onChange={(event) => setCancelDrafts((prev) => ({ ...prev, [booking.id]: event.target.value }))}
                    placeholder="Cancel reason (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <div />
                  <button type="button" onClick={() => handleCancelBooking(booking.id)} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800">
                    Cancel Booking
                  </button>
                </div>
              )}

              {isAdmin && (
                <div>
                  <button type="button" onClick={() => handleDeleteBooking(booking.id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    Delete Booking
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
