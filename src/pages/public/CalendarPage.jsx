import { useEffect, useMemo, useState } from "react";
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
import {
  NAVY,
  LIME,
  PURPLE,
  Section,
  PageHero,
  CtaPanel,
} from "../../components/public/ui";

const PUBLIC_EVENTS_PAGE_SIZE = 100;

const TYPE_TONES = {
  networking: { bg: "#E3EDFB", fg: "#1F6FD8" },
  workshop: { bg: "#EEF8D6", fg: "#4D7A12" },
  expo: { bg: "#F1EAFB", fg: "#7A2FB8" },
  webinar: { bg: "#FDF0DC", fg: "#B5650D" },
};

const dateParts = (value) => {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) return null;
  return {
    day: d.toLocaleDateString("en-AU", { day: "2-digit" }),
    month: d.toLocaleDateString("en-AU", { month: "short" }).toUpperCase(),
    weekday: d.toLocaleDateString("en-AU", { weekday: "short" }),
  };
};

const getOrganiserWebsite = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
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
  const [typeFilter, setTypeFilter] = useState("all");

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

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;
        return aDate - bDate;
      }),
    [events],
  );

  const types = useMemo(
    () => [...new Set(events.map((e) => e.type).filter(Boolean))],
    [events],
  );

  const visibleEvents =
    typeFilter === "all" ? sortedEvents : sortedEvents.filter((e) => e.type === typeFilter);

  return (
    <div>
      <PageHero
        eyebrow="Community events"
        title="Events calendar"
        intro="Discover upcoming community events, networking opportunities, workshops, and expos across the NDIS sector. Connect, learn, and grow — together."
        image="bg-1"
        imageAlt="A community art workshop with participants of all abilities"
      />

      <Section className="!pt-4">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>
              Upcoming community events
            </h2>
            <p className="mt-2 text-[15px] text-slate-500">
              Browse all events currently available through the Better Together Network.
            </p>
          </div>
          {types.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {["all", ...types].map((t) => {
                const active = typeFilter === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                      active ? "text-white shadow" : "bg-white text-slate-600 shadow-sm hover:text-slate-900"
                    }`}
                    style={active ? { background: NAVY } : undefined}
                  >
                    {t === "all" ? "All events" : t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-slate-500 shadow-sm">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" style={{ color: PURPLE }} />
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
            <Info className="mx-auto mb-3 h-9 w-9 text-red-400" />
            <h3 className="mb-2 text-lg font-semibold" style={{ color: NAVY }}>Unable to load events</h3>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : visibleEvents.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold" style={{ color: NAVY }}>No events available</h3>
            <p className="text-sm text-slate-500">
              New community events will appear here as soon as they are added.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleEvents.map((event) => {
              const organiserWebsite = getOrganiserWebsite(event.organiserWebsite);
              const parts = dateParts(event.date);
              const tone = TYPE_TONES[event.type] || { bg: "#EEF2FA", fg: NAVY };
              return (
                <article
                  key={event.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg md:flex-row"
                >
                  <div
                    className="flex shrink-0 items-center gap-4 p-6 text-white md:w-44 md:flex-col md:justify-center md:gap-1 md:p-8"
                    style={{ background: NAVY }}
                  >
                    {parts ? (
                      <>
                        <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: LIME }}>
                          {parts.month}
                        </span>
                        <span className="font-display text-4xl font-extrabold leading-none md:text-5xl">
                          {parts.day}
                        </span>
                        <span className="text-xs text-blue-100">{parts.weekday}</span>
                      </>
                    ) : (
                      <Calendar className="h-9 w-9" style={{ color: LIME }} />
                    )}
                  </div>

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <span
                          className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: tone.bg, color: tone.fg }}
                        >
                          {event.type || "Event"}
                        </span>
                        <h3 className="mt-3 text-xl font-bold md:text-2xl" style={{ color: NAVY }}>
                          {event.title}
                        </h3>
                      </div>
                      {event.cost && (
                        <span className="self-start whitespace-nowrap rounded-full bg-[#F4F6FA] px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {event.cost}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" style={{ color: PURPLE }} />
                        {formatDate(event.date)}
                        {event.time ? ` · ${event.time}` : ""}
                      </span>
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" style={{ color: PURPLE }} />
                          {event.location}
                        </span>
                      )}
                      {event.attendees !== undefined && (
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-4 w-4" style={{ color: PURPLE }} />
                          {event.attendees} attending
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{event.description}</p>
                    )}

                    {event.accessibility && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#EEF2FA] px-4 py-3 text-sm" style={{ color: NAVY }}>
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{event.accessibility}</span>
                      </div>
                    )}

                    {organiserWebsite && (
                      <a
                        href={organiserWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-125"
                        style={{ background: NAVY }}
                      >
                        More info
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Section>

      <CtaPanel
        eyebrow="Host with us"
        title="Want to host an event?"
        text="If you are organising a community event, workshop, or networking session relevant to the NDIS sector, we would love to help you promote it. Get in touch and we will feature it on our calendar."
        primary={{ to: "/contact", label: "Contact us" }}
        image="network"
      />
    </div>
  );
};

export default CalendarPage;
