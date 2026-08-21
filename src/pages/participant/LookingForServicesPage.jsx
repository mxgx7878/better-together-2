import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Info,
  Plus,
  X,
  Loader2,
  Trash2,
  Lock,
  DollarSign,
  Repeat,
  Clock,
  Heart,
  CheckCircle2,
  UserCheck,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchServiceRequests,
  createServiceRequest,
  deleteServiceRequest,
  closeServiceRequest,
  selectServiceRequestProvider,
} from "../../store/actions/serviceRequestActions";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { clearSaveStatus } from "../../store/slices/serviceRequestSlice";
import { ASYNC_STATUS } from "../../constants";
import TrustBadgeRow from "../../components/common/TrustBadgeRow";
import {
  fetchSavedProviders,
  saveProvider,
  unsaveProvider,
} from "../../store/actions/savedProviderActions";

const BUDGET_TYPES = [
  { value: "ndis_managed", label: "NDIS Managed" },
  { value: "self_managed", label: "Self Managed" },
  { value: "plan_managed", label: "Plan Managed" },
  { value: "not_sure", label: "Not sure" },
];

const FREQUENCIES = [
  { value: "one_off", label: "One-off" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "ongoing", label: "Ongoing" },
];

const URGENCIES = [
  { value: "asap", label: "ASAP" },
  { value: "within_2_weeks", label: "Within 2 weeks" },
  { value: "within_month", label: "Within a month" },
  { value: "flexible", label: "Flexible" },
];

const CONTACT_METHODS = [
  { value: "either", label: "Either" },
  { value: "email", label: "Email only" },
  { value: "phone", label: "Phone only" },
];

const AGE_GROUPS = [
  { value: "", label: "Prefer not to say" },
  { value: "child", label: "Child (0-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "adult", label: "Adult (18-64)" },
  { value: "senior", label: "Senior (65+)" },
];

const GENDER_PREFS = [
  { value: "no_preference", label: "No preference" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
];

const EMPTY_FORM = {
  service_type: "",
  category_id: "",
  summary: "",
  location: "",
  needed_from: "",
  budget_type: "not_sure",
  budget_amount: "",
  budget_note: "",
  frequency: "one_off",
  urgency: "flexible",
  preferred_contact: "either",
  participant_age_group: "",
  gender_preference: "no_preference",
  language_preference: "",
  accessibility_needs: "",
};

const LookingForServicesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, status, saveStatus, hireStatus } = useSelector(
    (s) => s.serviceRequest,
  );
  const { publicCategories } = useSelector((s) => s.category);
    const { savedIds } = useSelector((s) => s.savedProvider);

  const loading = status === ASYNC_STATUS.LOADING;
  const saving = saveStatus === ASYNC_STATUS.LOADING;
  const hiring = hireStatus === ASYNC_STATUS.LOADING;

  const [expanded, setExpanded] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [hiringReplyId, setHiringReplyId] = useState(null);

  useEffect(() => {
    dispatch(fetchServiceRequests());
    dispatch(fetchPublicCategories());
     dispatch(fetchSavedProviders());
  }, [dispatch]);

  useEffect(() => {
    if (saveStatus === ASYNC_STATUS.SUCCEEDED) {
      setShowNewPost(false);
      setForm({ ...EMPTY_FORM });
      setErrors({});
      dispatch(clearSaveStatus());
    }
  }, [saveStatus, dispatch]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.service_type.trim()) e.service_type = "Required";
    if (!form.category_id) e.category_id = "Required";
    if (!form.summary.trim()) e.summary = "Required";
    if (!form.budget_type) e.budget_type = "Required";
    if (!form.frequency) e.frequency = "Required";
    if (!form.urgency) e.urgency = "Required";
    if (!form.preferred_contact) e.preferred_contact = "Required";
    if (
      form.budget_amount &&
      (isNaN(form.budget_amount) || Number(form.budget_amount) < 0)
    )
      e.budget_amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || saving) return;
    const payload = { ...form };
    // Empty strings → null for optional fields
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = null;
    });
    payload.category_id = Number(form.category_id);
    if (payload.budget_amount !== null)
      payload.budget_amount = Number(payload.budget_amount);
    dispatch(createServiceRequest(payload));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this request?"))
      dispatch(deleteServiceRequest(id));
  };

  const toggleSaveProvider = (providerId) => {
    if (!providerId) return;
    if (savedIds.includes(providerId)) {
      dispatch(unsaveProvider(providerId));
    } else {
      dispatch(saveProvider(providerId));
    }
  };

  const handleClose = (id) => {
    if (
      window.confirm(
        "Close this request? No more replies will be accepted, but the post stays visible.",
      )
    )
      dispatch(closeServiceRequest(id));
  };

  const handleHire = async (requestId, replyId, providerName) => {
    if (
      !window.confirm(
        `Hire ${providerName}? This will mark the request as fulfilled and notify all applicants.`,
      )
    )
      return;
    setHiringReplyId(replyId);
    await dispatch(
      selectServiceRequestProvider({ requestId, replyId }),
    );
    setHiringReplyId(null);
  };

  const myPostsIds = list
    .filter((p) => p.user_id === user?.id)
    .map((p) => p.id);
  const ordered = [
    ...list.filter((p) => myPostsIds.includes(p.id)),
    ...list.filter((p) => !myPostsIds.includes(p.id)),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Looking for Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Post what you&apos;re looking for and let trusted providers come
            to you.
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Post a Request
        </button>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">How it works</p>
          <p>
            Post what service you need. Paid providers can reply publicly
            with their contact details. Review applications, and when you
            find the right fit, click <strong>Hire</strong> on their reply —
            we&apos;ll notify the chosen provider and let the others know
            the position has been filled.
          </p>
        </div>
      </div>

      {/* Posts */}
      {loading && list.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : ordered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">
            No requests yet. Be the first to post.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordered.map((post) => {
            const isMine = myPostsIds.includes(post.id);
            const isOpen = expanded === post.id;
            const isClosed = post.status === "closed";
            const isFulfilled = post.status === "fulfilled";
            const replies = post.replies || [];

            return (
              <div
                key={post.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${
                  isMine
                    ? "border-purple-200 ring-1 ring-purple-100"
                    : "border-slate-100"
                }`}
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-800">
                        {post.service_type}
                      </h3>
                      {isMine && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          YOUR POST
                        </span>
                      )}
                      {isFulfilled && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> FULFILLED
                        </span>
                      )}
                      {isClosed && (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          CLOSED
                        </span>
                      )}
                    </div>
                    {post.category?.name && (
                      <p className="text-xs text-slate-500">
                        {post.category.name}
                      </p>
                    )}
                  </div>

                  {isMine && !isClosed && !isFulfilled && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClose(post.id)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                  {post.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {post.location}
                    </span>
                  )}
                  {post.needed_from && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />{" "}
                      {post.needed_from}
                    </span>
                  )}
                  {post.frequency && (
                    <span className="inline-flex items-center gap-1">
                      <Repeat className="w-3.5 h-3.5" />{" "}
                      {FREQUENCIES.find((f) => f.value === post.frequency)
                        ?.label || post.frequency}
                    </span>
                  )}
                  {post.urgency && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {URGENCIES.find((u) => u.value === post.urgency)
                        ?.label || post.urgency}
                    </span>
                  )}
                  {post.budget_type && post.budget_type !== "not_sure" && (
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />{" "}
                      {BUDGET_TYPES.find(
                        (b) => b.value === post.budget_type,
                      )?.label}
                      {post.budget_amount
                        ? ` · $${Number(post.budget_amount).toFixed(2)}`
                        : ""}
                    </span>
                  )}
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-700 leading-relaxed mb-3 whitespace-pre-wrap">
                  {post.summary}
                </p>

                {/* Toggle replies */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {replies.length}{" "}
                    {replies.length === 1 ? "application" : "applications"}
                  </span>
                  {replies.length > 0 && (
                    <button
                      onClick={() =>
                        setExpanded(isOpen ? null : post.id)
                      }
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      {isOpen ? "Hide applications" : "View applications"}
                    </button>
                  )}
                </div>

                {/* Replies list */}
                {isOpen && replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    {replies.map((r) => {
                      const isSelected =
                        post.selected_reply_id === r.id;
                      const canHire =
                        isMine && !isFulfilled && !isClosed;
                      return (
                        <div
                          key={r.id}
                          className={`rounded-xl border p-4 ${
                            isSelected
                              ? "border-emerald-300 bg-emerald-50/40"
                              : "border-slate-100 bg-slate-50/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
                                {r.provider_name || r.provider?.name}
                                <TrustBadgeRow provider={r} size="sm" />
                                     <button
                                  type="button"
                                  onClick={() =>
                                    toggleSaveProvider(
                                      r.provider_user_id || r.user_id,
                                    )
                                  }
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                                    savedIds.includes(
                                      r.provider_user_id || r.user_id,
                                    )
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                  }`}
                                  title={
                                    savedIds.includes(
                                      r.provider_user_id || r.user_id,
                                    )
                                      ? "Saved"
                                      : "Save provider"
                                  }
                                >
                                  <Heart
                                    className={`w-3 h-3 ${
                                      savedIds.includes(
                                        r.provider_user_id || r.user_id,
                                      )
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                  {savedIds.includes(
                                    r.provider_user_id || r.user_id,
                                  )
                                    ? "Saved"
                                    : "Save"}
                                </button>
                                {isSelected && (
                                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />{" "}
                                    HIRED
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
                                {r.message}
                              </p>

                              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600">
                                {r.contact_email && (
                                  <a
                                    href={`mailto:${r.contact_email}`}
                                    className="inline-flex items-center gap-1 hover:text-purple-600"
                                  >
                                    <Mail className="w-3.5 h-3.5" />{" "}
                                    {r.contact_email}
                                  </a>
                                )}
                                {r.contact_phone && (
                                  <a
                                    href={`tel:${r.contact_phone}`}
                                    className="inline-flex items-center gap-1 hover:text-purple-600"
                                  >
                                    <Phone className="w-3.5 h-3.5" />{" "}
                                    {r.contact_phone}
                                  </a>
                                )}
                              </div>
                            </div>

                            {canHire && (
                              <button
                                onClick={() =>
                                  handleHire(
                                    post.id,
                                    r.id,
                                    r.provider_name ||
                                      r.provider?.name ||
                                      "this provider",
                                  )
                                }
                                disabled={hiring}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md disabled:opacity-60 transition-all flex-shrink-0"
                              >
                                {hiring &&
                                hiringReplyId === r.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Heart className="w-3.5 h-3.5" />
                                )}
                                Hire
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── New Post Modal ──────────────────────────────────── */}
      {showNewPost && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowNewPost(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Post a Service Request
              </h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Service type + Category */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Service type <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.service_type}
                    onChange={(e) =>
                      setField("service_type", e.target.value)
                    }
                    placeholder="e.g. Occupational Therapist"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${
                      errors.service_type
                        ? "border-red-300"
                        : "border-slate-200 focus:border-purple-400"
                    }`}
                  />
                  {errors.service_type && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.service_type}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Service category{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setField("category_id", e.target.value)
                    }
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none bg-white ${
                      errors.category_id
                        ? "border-red-300"
                        : "border-slate-200 focus:border-purple-400"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {(publicCategories || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.category_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe what you need{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.summary}
                  onChange={(e) => setField("summary", e.target.value)}
                  placeholder="e.g. Looking for an OT who can do Functional Assessments and provide ongoing support..."
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none ${
                    errors.summary
                      ? "border-red-300"
                      : "border-slate-200 focus:border-purple-400"
                  }`}
                />
                {errors.summary && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.summary}
                  </p>
                )}
              </div>

              {/* Location + Needed from */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="e.g. Berwick, Melbourne"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Needed from
                  </label>
                  <input
                    type="date"
                    value={form.needed_from}
                    onChange={(e) =>
                      setField("needed_from", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  Budget
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">
                      Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.budget_type}
                      onChange={(e) =>
                        setField("budget_type", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                    >
                      {BUDGET_TYPES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">
                      Amount (AUD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.budget_amount}
                      onChange={(e) =>
                        setField("budget_amount", e.target.value)
                      }
                      placeholder="e.g. 120"
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                        errors.budget_amount
                          ? "border-red-300"
                          : "border-slate-200 focus:border-purple-400"
                      }`}
                    />
                    {errors.budget_amount && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.budget_amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">
                      Note
                    </label>
                    <input
                      type="text"
                      value={form.budget_note}
                      onChange={(e) =>
                        setField("budget_note", e.target.value)
                      }
                      placeholder="per hour / negotiable"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Frequency + Urgency + Contact */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Frequency <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.frequency}
                    onChange={(e) =>
                      setField("frequency", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Urgency <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.urgency}
                    onChange={(e) => setField("urgency", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                  >
                    {URGENCIES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred contact{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.preferred_contact}
                    onChange={(e) =>
                      setField("preferred_contact", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                  >
                    {CONTACT_METHODS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional preferences */}
              <details className="bg-slate-50 rounded-xl p-3">
                <summary className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Additional preferences (optional)
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">
                        Age group of participant
                      </label>
                      <select
                        value={form.participant_age_group}
                        onChange={(e) =>
                          setField(
                            "participant_age_group",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                      >
                        {AGE_GROUPS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">
                        Gender preference
                      </label>
                      <select
                        value={form.gender_preference}
                        onChange={(e) =>
                          setField("gender_preference", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-purple-400"
                      >
                        {GENDER_PREFS.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">
                      Language preference
                    </label>
                    <input
                      type="text"
                      value={form.language_preference}
                      onChange={(e) =>
                        setField("language_preference", e.target.value)
                      }
                      placeholder="e.g. Mandarin, Arabic, Auslan"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">
                      Accessibility needs
                    </label>
                    <textarea
                      rows={2}
                      value={form.accessibility_needs}
                      onChange={(e) =>
                        setField("accessibility_needs", e.target.value)
                      }
                      placeholder="e.g. wheelchair access, sensory-friendly environment"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none resize-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </details>

              <p className="text-xs text-slate-500">
                Your post is visible to everyone on this page. Only paid
                providers can apply, and replies are public — providers
                can&apos;t message you privately.
              </p>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Post Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LookingForServicesPage;