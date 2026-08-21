import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Loader2,
  Info,
} from "lucide-react";
import api from "../../services/api";

const MORE_INFO_URL = "https://ndisevents.frondizoai.com/";
const PUBLIC_EVENTS_PAGE_SIZE = 100;

const typeGradients = {
  networking: "from-blue-500 to-indigo-600",
  workshop: "from-emerald-500 to-teal-600",
  expo: "from-purple-500 to-fuchsia-600",
  webinar: "from-amber-500 to-orange-600",
};

const formatDate = (value) => {
  if (!value) return "Date to be confirmed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAllEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: 1,
          limit: PUBLIC_EVENTS_PAGE_SIZE,
          type: "all",
          status: "all",
        };

        const firstPage = await api.get("/events", { params });
        const allEvents = [...(firstPage.data || [])];
        const totalPages = Math.max(Number(firstPage.totalPages) || 1, 1);

        if (totalPages > 1) {
          const remainingRequests = Array.from(
            { length: totalPages - 1 },
            (_, index) =>
              api.get("/events", {
                params: {
                  ...params,
                  page: index + 2,
                },
              }),
          );

          const remainingPages = await Promise.all(remainingRequests);
          remainingPages.forEach((page) => {
            allEvents.push(...(page.data || []));
          });
        }

        if (active) {
          setEvents(allEvents);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load events.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAllEvents();

    return () => {
      active = false;
    };
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;
    return aDate - bDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Community Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Events Calendar
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Discover upcoming community events, networking opportunities,
            workshops, and expos across the NDIS sector. Connect, learn, and
            grow — together.
          </p>
        </div>
      </section>

      {/* Events from API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Community Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all events currently available through the Better Together
            Network.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
            <Info className="w-9 h-9 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load events
            </h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events available
            </h3>
            <p className="text-sm text-gray-600">
              New community events will appear here as soon as they are added.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Date Accent */}
                  <div
                    className={`bg-gradient-to-br ${typeGradients[event.type] || "from-purple-500 to-pink-600"} p-6 md:p-8 flex flex-col items-center justify-center md:w-48 shrink-0 text-white`}
                  >
                    <Calendar className="w-9 h-9 mb-3" />
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                      {event.type || "Event"}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-500" />
                            {formatDate(event.date)}
                            {event.time ? ` · ${event.time}` : ""}
                          </span>
                          {event.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-pink-500" />
                              {event.location}
                            </span>
                          )}
                          {event.attendees !== undefined && (
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-indigo-500" />
                              {event.attendees} attending
                            </span>
                          )}
                        </div>
                      </div>

                      {event.cost && (
                        <span className="self-start px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold whitespace-nowrap">
                          {event.cost}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-600 leading-relaxed mb-5">
                        {event.description}
                      </p>
                    )}

                    {event.accessibility && (
                      <div className="flex items-start gap-2 mb-5 text-sm text-blue-700 bg-blue-50 rounded-xl px-4 py-3">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{event.accessibility}</span>
                      </div>
                    )}

                    <a
                      href={MORE_INFO_URL}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      More Info
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-lg text-purple-100 mb-8 leading-relaxed">
              If you are organising a community event, workshop, or networking
              session relevant to the NDIS sector, we would love to help you
              promote it. Get in touch with our team and we will feature it on
              our calendar.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;
