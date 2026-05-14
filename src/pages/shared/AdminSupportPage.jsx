import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle,
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle2,
  Lock,
  Inbox,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import usePendingGuard from "../../hooks/usePendingGuard";
import {
  submitQuery,
  fetchMyQueries,
} from "../../store/actions/queryActions";
import { clearSubmitStatus } from "../../store/slices/querySlice";
import { ASYNC_STATUS } from "../../constants";

const faqItems = [
  {
    q: "How do I update my profile information?",
    a: "Navigate to your Profile page from the sidebar or top bar. You can edit your details, services, and notification preferences there.",
  },
  {
    q: "How do I upgrade my subscription?",
    a: "Go to Update Subscription in the sidebar. You can compare plans and upgrade instantly. Changes take effect immediately.",
  },
  {
    q: "I cant see some features — why?",
    a: "Some features are only available on paid plans. Check the Upgrade page to see whats included in each tier.",
  },
  {
    q: "How do I add team members?",
    a: "Paid provider accounts can add up to 4 team members. Go to Profile → Team Members to invite them.",
  },
  {
    q: "How do I report an issue with a provider or participant?",
    a: "Use the contact form below or email us directly. All reports are handled confidentially by our admin team.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Update Subscription → Manage Billing → Cancel Plan. Your access continues until the end of your billing period.",
  },
];

const CATEGORY_LABELS = {
  general: "General Enquiry",
  technical: "Technical Issue",
  billing: "Billing Question",
  feedback: "Feedback",
};

const STATUS_STYLES = {
  open: "bg-amber-50 text-amber-700 border-amber-200",
  responded: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_ICONS = {
  open: Clock,
  responded: CheckCircle2,
  closed: Lock,
};

const AdminSupportPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { guardAction } = usePendingGuard();
  const { myQueries, myQueriesStatus, submitStatus } = useSelector(
    (s) => s.query,
  );
  const submitting = submitStatus === ASYNC_STATUS.LOADING;
  const submitted = submitStatus === ASYNC_STATUS.SUCCEEDED;

  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [formData, setFormData] = useState({
    category: "general",
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchMyQueries());
  }, [dispatch]);

  // Auto-reset the success state after a moment
  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => {
        dispatch(clearSubmitStatus());
        setFormData((prev) => ({
          ...prev,
          subject: "",
          message: "",
        }));
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [submitted, dispatch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field])
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(submitQuery(formData));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Connect with Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Get help, report issues, or give feedback to The Better Together team
        </p>
      </div>

      {/* Admin Team Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            SD
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Sue Dymond
            </h3>
            <p className="text-sm text-slate-500">Co-founder & Team Leader</p>
            <p className="text-xs text-purple-600 mt-1">
              Lived experience leadership
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            KB
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Karen Burgess
            </h3>
            <p className="text-sm text-slate-500">Co-founder & Team Leader</p>
            <p className="text-xs text-purple-600 mt-1">
              Community & provider relations
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="border border-slate-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-800 pr-4">
                  {item.q}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Send Us a Message
        </h2>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Message Sent!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Our team will get back to you within 1-2 business days. You'll see
              the response in "My Queries" below.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                What can we help with?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleChange("category", key)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      formData.category === key
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-slate-50 text-slate-600 hover:bg-purple-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-400 ${
                    formErrors.name ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-400 ${
                    formErrors.email ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Brief description of your enquiry"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-400 ${
                  formErrors.subject ? "border-red-300" : "border-slate-200"
                }`}
              />
              {formErrors.subject && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.subject}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Tell us how we can help..."
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-400 resize-none ${
                  formErrors.message ? "border-red-300" : "border-slate-200"
                }`}
              />
              {formErrors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>
            <button
              onClick={guardAction(handleSubmit)}
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}
      </div>

      {/* My Queries Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Inbox className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-slate-800">My Queries</h2>
        </div>

        {myQueriesStatus === ASYNC_STATUS.LOADING && myQueries.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          </div>
        ) : myQueries.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            You haven't sent any queries yet. Send one above to get help from
            our team.
          </p>
        ) : (
          <div className="space-y-3">
            {myQueries.map((q) => {
              const StatusIcon = STATUS_ICONS[q.status] || Clock;
              const isExpanded = expandedQuery === q.id;
              return (
                <div
                  key={q.id}
                  className="border border-slate-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedQuery(isExpanded ? null : q.id)
                    }
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${
                              STATUS_STYLES[q.status] || STATUS_STYLES.open
                            } inline-flex items-center gap-1`}
                          >
                            <StatusIcon className="w-3 h-3" /> {q.status}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {CATEGORY_LABELS[q.category] || q.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {q.subject}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {q.created_at
                            ? new Date(q.created_at).toLocaleString()
                            : ""}
                        </p>
                      </div>
                      {q.admin_response && (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Reply
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-4 bg-slate-50/40">
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          Your message
                        </h4>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                          {q.message}
                        </p>
                      </div>

                      {q.admin_response ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Admin response
                          </h4>
                          <p className="text-sm text-emerald-900 whitespace-pre-wrap">
                            {q.admin_response}
                          </p>
                          {q.responded_at && (
                            <p className="text-[11px] text-emerald-600 mt-2">
                              {new Date(q.responded_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 inline-flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> Awaiting response —
                          our team typically replies within 1-2 business days.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;