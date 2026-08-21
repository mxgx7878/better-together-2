import {
  ArrowLeft,
  Loader2,
  Plus,
  Save
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  adminCreateEvent,
  adminUpdateEvent,
  fetchAdminEventById,
} from "../../store/actions/eventActions";
import { EVENT_TYPES } from "../../constants";


const emptyForm = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  type: "networking",
  cost: "Free",
  costAmount: 0,
  accessibility: "",
  maxAttendees: 50,
  status: "draft",
  organiser: "Better Together Network",
};

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm outline-none transition-colors placeholder:text-slate-300 ${
    err
      ? "border-red-300 focus:border-red-400"
      : "border-slate-100 focus:border-purple-400 focus:bg-white"
  }`;

const EventFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { selectedEvent } = useSelector((state) => state.event);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) dispatch(fetchAdminEventById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && selectedEvent) setForm(selectedEvent);
  }, [isEditMode, selectedEvent]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.date) errs.date = "Date is required";
    if (!form.time.trim()) errs.time = "Time is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = { ...form };
    delete payload._id;
    payload.cost = payload.costAmount === 0 ? "Free" : `$${payload.costAmount}`;

    try {
      if (isEditMode) {
        await dispatch(adminUpdateEvent({ id, eventData: payload })).unwrap();
        toast.success("Event updated successfully");
      } else {
        await dispatch(adminCreateEvent(payload)).unwrap();
        toast.success("Event created successfully");
      }
      navigate("/admin/events");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/events")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditMode
              ? "Update the event details below"
              : "Fill in the details to publish a new event"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
            Event Details
          </h2>

          <Field label="Event Title" required error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Melbourne Provider Networking Breakfast"
              className={inputCls(errors.title)}
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the event in detail..."
              className={`${inputCls(errors.description)} resize-none`}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Date" required error={errors.date}>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={inputCls(errors.date)}
              />
            </Field>
            <Field label="Time" required error={errors.time}>
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="e.g. 9:00 AM – 11:00 AM"
                className={inputCls(errors.time)}
              />
            </Field>
          </div>

          <Field label="Location" required error={errors.location}>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Online (Zoom) or venue address"
              className={inputCls(errors.location)}
            />
          </Field>

          <Field label="Accessibility Information">
            <input
              name="accessibility"
              value={form.accessibility}
              onChange={handleChange}
              placeholder="e.g. Wheelchair accessible, Auslan interpreter"
              className={inputCls(false)}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish box */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
              Publish Settings
            </h2>

            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputCls(false)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>

            <Field label="Event Type">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputCls(false)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Organiser">
              <input
                name="organiser"
                value={form.organiser}
                onChange={handleChange}
                placeholder="Organisation name"
                className={inputCls(false)}
              />
            </Field>
          </div>

          {/* Capacity & Cost */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
              Capacity & Cost
            </h2>

            <Field label="Max Attendees">
              <input
                type="number"
                name="maxAttendees"
                value={form.maxAttendees}
                onChange={handleChange}
                min="1"
                className={inputCls(false)}
              />
            </Field>

            <Field label="Cost (AUD) — 0 = Free">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  name="costAmount"
                  value={form.costAmount}
                  onChange={handleChange}
                  min="0"
                  className={`${inputCls(false)} pl-7`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {form.costAmount === 0 ? "✓ Free event" : `$${form.costAmount} AUD`}
              </p>
            </Field>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isEditMode ? "Save Changes" : "Create Event"}
          </button>

          <button
            onClick={() => navigate("/admin/events")}
            className="w-full py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFormPage;