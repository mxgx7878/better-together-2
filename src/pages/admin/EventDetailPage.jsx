import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminEventById } from "../../store/actions/eventActions";
import {
  Loader2,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Calendar,
  DollarSign,
  Building2,
  Accessibility,
  Tag,
  Edit2,
} from "lucide-react";

const typeColors = {
  networking: "bg-blue-50 text-blue-700 border-blue-100",
  workshop: "bg-emerald-50 text-emerald-700 border-emerald-100",
  expo: "bg-purple-50 text-purple-700 border-purple-100",
  webinar: "bg-amber-50 text-amber-700 border-amber-100",
};

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent, status } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchAdminEventById(id));
  }, [id, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  if (!selectedEvent) return null;

  const event = selectedEvent;
  const eventDate = new Date(event.date);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/events")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        <button
          onClick={() => navigate(`/admin/events/edit/${event.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit Event
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 flex items-end justify-between">
              <div className="text-white">
                <p className="text-xs uppercase font-semibold opacity-75 tracking-wider mb-1">
                  {eventDate.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
                </p>
                <p className="text-5xl font-bold leading-none">{eventDate.getDate()}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    event.status === "published"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-amber-400 text-amber-900 border-amber-300"
                  }`}
                >
                  {event.status}
                </span>
                {event.type && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${typeColors[event.type]}`}
                  >
                    {event.type}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-xl font-bold text-slate-800 mb-4">{event.title}</h1>

              <div className="grid sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-medium truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-medium">
                    {event.attendees ?? 0}/{event.maxAttendees} attendees
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  About this event
                </p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {event.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
              Event Info
            </h2>

            <InfoRow
              icon={Building2}
              label="Organiser"
              value={event.organiser}
            />
            <InfoRow
              icon={DollarSign}
              label="Cost"
              value={event.cost || (event.costAmount === 0 ? "Free" : `$${event.costAmount}`)}
            />
            <InfoRow
              icon={Calendar}
              label="Date"
              value={eventDate.toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <InfoRow icon={Clock} label="Time" value={event.time} />
            <InfoRow icon={MapPin} label="Location" value={event.location} />
            {event.accessibility && (
              <InfoRow
                icon={Accessibility}
                label="Accessibility"
                value={event.accessibility}
              />
            )}
          </div>

          {/* Attendees progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Capacity</h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-slate-800">
                {event.attendees ?? 0}
              </span>
              <span className="text-sm text-slate-400">
                of {event.maxAttendees}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((event.attendees ?? 0) / event.maxAttendees) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {event.maxAttendees - (event.attendees ?? 0)} spots remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;