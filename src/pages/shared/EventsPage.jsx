import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import usePendingGuard from "../../hooks/usePendingGuard";
import {
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
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRsvp,
  fetchEvents,
  fetchPublicEvents,
  rsvpEvent,
} from "../../store/actions/eventActions";
import { ASYNC_STATUS } from "../../constants";

const typeColors = {
  networking: { bg: "bg-blue-50", text: "text-blue-700" },
  workshop: { bg: "bg-emerald-50", text: "text-emerald-700" },
  expo: { bg: "bg-purple-50", text: "text-purple-700" },
  webinar: { bg: "bg-amber-50", text: "text-amber-700" },
};

const ITEMS_PER_PAGE = 6;
const MORE_INFO_URL = "https://ndisevents.frondizoai.com/";

const EventsPage = () => {
  const { guardAction } = usePendingGuard();
  const dispatch = useDispatch();

  const { events, total, totalPages, status } = useSelector(
    (state) => state.event,
  );

  const loading = status === ASYNC_STATUS.LOADING;
  const token = useSelector((state) => state.auth.token);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());

  // View mode
  const [viewMode, setViewMode] = useState("list");

  // RSVP states (eventId -> boolean)
  const [rsvps, setRsvps] = useState({});
  const [rsvpLoading, setRsvpLoading] = useState({});

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch events
  const loadEvents = useCallback(() => {
    const params = {
      search: searchTerm,
      type: filterType,
      status: filterStatus,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    if (token) {
      dispatch(fetchEvents(params));
      return;
    }

    dispatch(fetchPublicEvents(params));
  }, [dispatch, token, searchTerm, filterType, filterStatus, currentPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // RSVP handler
  const toggleRsvp = async (event) => {
    const id = event.id;
    const currentlyAttending = rsvps[id] ?? event.attending;

    setRsvpLoading((prev) => ({ ...prev, [id]: true }));
    try {
      if (currentlyAttending) {
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

  const eventDates = events.reduce((acc, event) => {
    const date = new Date(event.date);
    if (Number.isNaN(date.getTime())) return acc;

    const day = date.getDate();
    const month = date.getMonth();
    if (
      month === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      acc[day] = acc[day] || [];
      acc[day].push(event);
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
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => {
                setFilterType(filter.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === filter.key
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-purple-300"
              }`}
            >
              {filter.label}
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
              aria-label="Previous month"
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
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (dayName) => (
                <div
                  key={dayName}
                  className="bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500"
                >
                  {dayName}
                </div>
              ),
            )}
            {calendarDays().map((day, index) => (
              <div
                key={index}
                className={`bg-white p-2 min-h-[80px] ${day ? "hover:bg-purple-50 transition-colors" : ""}`}
              >
                {day && (
                  <>
                    <span className="text-sm font-medium text-slate-700">
                      {day}
                    </span>
                    {eventDates[day] &&
                      eventDates[day].map((event) => (
                        <a
                          key={event.id}
                          href={MORE_INFO_URL}
                          className={`block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${typeColors[event.type]?.bg || "bg-slate-100"} ${typeColors[event.type]?.text || "text-slate-700"}`}
                          title={`${event.title} — More Info`}
                        >
                          {event.title.split(" ").slice(0, 3).join(" ")}
                        </a>
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
              {events.map((event) => {
                const isAttending = rsvps[event.id] ?? event.attending;

                return (
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
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${typeColors[event.type]?.bg || "bg-slate-100"} ${typeColors[event.type]?.text || "text-slate-700"}`}
                              >
                                {event.type}
                              </span>
                              {event.costAmount === 0 ? (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                                  Free
                                </span>
                              ) : event.cost ? (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                                  {event.cost}
                                </span>
                              ) : null}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              {event.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                            <a
                              href={MORE_INFO_URL}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                            >
                              More Info
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={guardAction(() => toggleRsvp(event))}
                              disabled={rsvpLoading[event.id]}
                              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                                isAttending
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                              }`}
                            >
                              {rsvpLoading[event.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isAttending ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> Confirmed
                                </span>
                              ) : (
                                "RSVP"
                              )}
                            </button>
                          </div>
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
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-slate-500">
                {total} event{total !== 1 ? "s" : ""} — Page {currentPage} of{" "}
                {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-purple-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;
