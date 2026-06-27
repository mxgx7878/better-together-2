import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import usePendingGuard from "../../hooks/usePendingGuard";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Loader2,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRsvp, fetchEvents, fetchPublicEvents, rsvpEvent } from "../../store/actions/eventActions";
import { ASYNC_STATUS } from "../../constants";

const typeColors = {
  networking: { bg: "bg-blue-50", text: "text-blue-700" },
  workshop: { bg: "bg-emerald-50", text: "text-emerald-700" },
  expo: { bg: "bg-purple-50", text: "text-purple-700" },
  webinar: { bg: "bg-amber-50", text: "text-amber-700" },
};

const ITEMS_PER_PAGE = 6;

const EventsPage = () => {
  const { isProvider, isPaid } = useAuth();
  const { guardAction } = usePendingGuard();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, total, totalPages, status } = useSelector(
    (state) => state.event,
  );


  const loading = status === ASYNC_STATUS.LOADING;
  const token = useSelector((state) => state.auth.token);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());

  // View mode
  const [viewMode, setViewMode] = useState("list");

  // RSVP states (eventId -> boolean)
  const [rsvps, setRsvps] = useState({});
  const [rsvpLoading, setRsvpLoading] = useState({});

  // Sponsor modal
  const [showSponsor, setShowSponsor] = useState(false);

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
    if (token) {
      dispatch(
      fetchEvents({
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
    return;
    }
    dispatch(
      fetchPublicEvents({
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [searchTerm, filterType, filterStatus, currentPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // RSVP handler
  const toggleRsvp = async (id) => {
    setRsvpLoading((prev) => ({ ...prev, [id]: true }));
    try {
      if (rsvps[id]) {
        await cancelRsvp(id);
        setRsvps((prev) => ({ ...prev, [id]: false }));
        toast.success("RSVP cancelled");
      } else {
        await rsvpEvent(id);
        setRsvps((prev) => ({ ...prev, [id]: true }));
        toast.success("RSVP confirmed!");
      }
    } catch {
      toast.error("Failed to update RSVP");
    } finally {
      setRsvpLoading((prev) => ({ ...prev, [id]: false }));
      loadEvents();
    }
  };

  // Calendar helper
  const calendarDays = () => {
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const eventDates = events.reduce((acc, e) => {
    const d = new Date(e.date);
    const day = d.getDate();
    const month = d.getMonth();
    if (month === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()){
      acc[day] = acc[day] || [];
      acc[day].push(e);
    }
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Events & Networking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover events, workshops, and networking sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isProvider && isPaid && (
            <button
              onClick={() => setShowSponsor(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Sponsor an Event
            </button>
          )}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-purple-700" : "text-slate-500"}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "calendar" ? "bg-white shadow-sm text-purple-700" : "text-slate-500"}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "networking", label: "Networking" },
            { key: "workshop", label: "Workshops" },
            { key: "webinar", label: "Webinars" },
            // { key: "expo", label: "Expos" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilterType(f.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === f.key
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-purple-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {currentDate.toLocaleDateString("en-AU", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500"
              >
                {d}
              </div>
            ))}
            {calendarDays().map((day, i) => (
              <div
                key={i}
                className={`bg-white p-2 min-h-[80px] ${day ? "hover:bg-purple-50 cursor-pointer transition-colors" : ""}`}
              >
                {day && (
                  <>
                    <span className="text-sm font-medium text-slate-700">
                      {day}
                    </span>
                    {eventDates[day] &&
                      eventDates[day].map((ev) => (
                        <div
                          key={ev.id}
                          className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${typeColors[ev.type]?.bg} ${typeColors[ev.type]?.text}`}
                        >
                          {ev.title.split(" ").slice(0, 3).join(" ")}
                        </div>
                      ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No events found</p>
              <p className="text-sm text-slate-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 flex lg:flex-col items-center lg:items-center gap-3 lg:gap-1 lg:w-20">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl px-4 py-3 lg:px-0 lg:py-0 lg:w-full lg:aspect-square flex flex-col items-center justify-center">
                        <span className="text-[11px] uppercase font-semibold opacity-80">
                          {new Date(event.date).toLocaleDateString("en-AU", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-2xl font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${typeColors[event.type]?.bg} ${typeColors[event.type]?.text}`}
                            >
                              {event.type}
                            </span>
                            {event.costAmount === 0 ? (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                Free
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                                {event.cost}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {event.title}
                          </h3>
                        </div>
                        <button
                          onClick={guardAction(() => toggleRsvp(event.id))}
                          disabled={rsvpLoading[event.id]}
                          className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                            event.attending
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                          }`}
                        >
                          {rsvpLoading[event.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : event.attending ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Confirmed
                            </span>
                          ) : (
                            "RSVP"
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-slate-600 mt-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {event.attendees}{" "}
                          attending
                        </span>
                      </div>

                      {event.accessibility && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Info className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs text-blue-600">
                            {event.accessibility}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {total} event{total !== 1 ? "s" : ""} — Page {currentPage} of{" "}
                {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pg ? "bg-purple-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
                    >
                      {pg}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sponsor Modal */}
      {showSponsor && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSponsor(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Sponsor an Event
              </h2>
              <button
                onClick={() => setShowSponsor(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Apply to sponsor a community event. Our team will work with you to
              create an event in your local area.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Event type
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400">
                  <option>Networking Meetup</option>
                  <option>Workshop / Training</option>
                  <option>Community Expo</option>
                  <option>Webinar</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Preferred location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Melbourne CBD, Western Sydney"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sponsorship tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Bronze $250", "Silver $500", "Gold $1,000"].map((tier) => (
                    <label
                      key={tier}
                      className="flex items-center justify-center p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-purple-400 transition-colors text-sm font-medium text-slate-700 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50"
                    >
                      <input type="radio" name="tier" className="sr-only" />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Additional notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your goals for sponsoring..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md">
                Submit Sponsorship Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
