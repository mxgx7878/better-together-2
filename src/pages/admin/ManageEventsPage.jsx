import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import {
  adminFetchEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
} from '../../services/eventService';

const EVENT_TYPES = ['networking', 'workshop', 'webinar', 'expo'];
const STATUS_OPTIONS = ['all', 'published', 'draft'];
const ITEMS_PER_PAGE = 6;

const typeColors = {
  networking: 'bg-blue-50 text-blue-700',
  workshop: 'bg-emerald-50 text-emerald-700',
  expo: 'bg-purple-50 text-purple-700',
  webinar: 'bg-amber-50 text-amber-700',
};

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  type: 'networking',
  cost: 'Free',
  costAmount: 0,
  accessibility: '',
  description: '',
  maxAttendees: 50,
  status: 'draft',
  image: null,
  organiser: 'Better Together Network',
  tags: [],
};

const ManageEventsPage = () => {
  // List state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch events
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminFetchEvents({
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setEvents(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, filterStatus, currentPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ─── Form handlers ────────────────────────────────────────────
  const openCreateModal = () => {
    setFormData({ ...emptyForm });
    setFormErrors({});
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      cost: event.cost,
      costAmount: event.costAmount,
      accessibility: event.accessibility || '',
      description: event.description,
      maxAttendees: event.maxAttendees,
      status: event.status,
      image: event.image,
      organiser: event.organiser,
      tags: event.tags || [],
      _id: event.id,
    });
    setFormErrors({});
    setModalMode('edit');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time.trim()) errs.time = 'Time is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = { ...formData };
    delete payload._id;

    // Set cost string from amount
    if (payload.costAmount === 0) {
      payload.cost = 'Free';
    } else {
      payload.cost = `$${payload.costAmount}`;
    }

    try {
      if (modalMode === 'create') {
        await adminCreateEvent(payload);
        toast.success('Event created successfully');
      } else {
        await adminUpdateEvent(formData._id, payload);
        toast.success('Event updated successfully');
      }
      setShowModal(false);
      loadEvents();
    } catch {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteEvent(deleteId);
      toast.success('Event deleted successfully');
      setDeleteId(null);
      loadEvents();
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Events"
        description="Create, edit, and manage platform events"
        icon={Calendar}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      {/* ─── Filters ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title, location, organiser..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[140px]"
        >
          <option value="all">All Types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[140px]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* ─── Count ────────────────────────────────────────────── */}
      <p className="text-sm text-slate-500">
        {loading ? 'Loading...' : `${totalCount} event${totalCount !== 1 ? 's' : ''} found`}
      </p>

      {/* ─── Events Grid ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No events found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or create a new event</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Date banner */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 flex items-center justify-between">
                <div className="text-white">
                  <p className="text-[11px] uppercase font-semibold opacity-80">
                    {new Date(event.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xl font-bold">{new Date(event.date).getDate()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  event.status === 'published' ? 'bg-white/20 text-white' : 'bg-amber-400 text-amber-900'
                }`}>
                  {event.status}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${typeColors[event.type]}`}>
                    {event.type}
                  </span>
                  <span className={`text-[11px] font-semibold ${event.costAmount === 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {event.cost}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2">{event.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</p>
                  <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.attendees}/{event.maxAttendees} attendees</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(event)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(event.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Pagination ───────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pg ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                {pg}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CREATE / EDIT MODAL                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {modalMode === 'create' ? 'Create New Event' : 'Edit Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Title <span className="text-red-500">*</span></label>
                <input name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g. Melbourne Provider Networking Breakfast" className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none ${formErrors.title ? 'border-red-300' : 'border-slate-200'} focus:border-purple-500`} />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>

              {/* Type + Status */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Type</label>
                  <select name="type" value={formData.type} onChange={handleFormChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500">
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date <span className="text-red-500">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleFormChange} className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none ${formErrors.date ? 'border-red-300' : 'border-slate-200'} focus:border-purple-500`} />
                  {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time <span className="text-red-500">*</span></label>
                  <input name="time" value={formData.time} onChange={handleFormChange} placeholder="e.g. 9:00 AM – 11:00 AM" className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none ${formErrors.time ? 'border-red-300' : 'border-slate-200'} focus:border-purple-500`} />
                  {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <input name="location" value={formData.location} onChange={handleFormChange} placeholder="e.g. Online (Zoom) or venue address" className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none ${formErrors.location ? 'border-red-300' : 'border-slate-200'} focus:border-purple-500`} />
                {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
              </div>

              {/* Cost + Max Attendees */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cost (AUD) — 0 = Free</label>
                  <input type="number" name="costAmount" value={formData.costAmount} onChange={handleFormChange} min="0" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Attendees</label>
                  <input type="number" name="maxAttendees" value={formData.maxAttendees} onChange={handleFormChange} min="1" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* Organiser */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organiser</label>
                <input name="organiser" value={formData.organiser} onChange={handleFormChange} placeholder="Organisation name" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500" />
              </div>

              {/* Accessibility */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Accessibility Information</label>
                <input name="accessibility" value={formData.accessibility} onChange={handleFormChange} placeholder="e.g. Wheelchair accessible, Auslan interpreter" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} rows={4} placeholder="Describe the event in detail..." className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none resize-none ${formErrors.description ? 'border-red-300' : 'border-slate-200'} focus:border-purple-500`} />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION                                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Event?</h3>
              <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The event and all RSVPs will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
