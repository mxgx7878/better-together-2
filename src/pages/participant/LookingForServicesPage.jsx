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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchServiceRequests,
  createServiceRequest,
  deleteServiceRequest,
  closeServiceRequest,
} from "../../store/actions/serviceRequestActions";
import { clearSaveStatus } from "../../store/slices/serviceRequestSlice";
import { ASYNC_STATUS } from "../../constants";

const LookingForServicesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { list, status, saveStatus } = useSelector((s) => s.serviceRequest);
  const loading = status === ASYNC_STATUS.LOADING;
  const saving = saveStatus === ASYNC_STATUS.LOADING;

  const [expanded, setExpanded] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [form, setForm] = useState({
    service_type: "",
    location: "",
    needed_from: "",
    summary: "",
  });

  useEffect(() => {
    dispatch(fetchServiceRequests());
  }, [dispatch]);

  useEffect(() => {
    if (saveStatus === ASYNC_STATUS.SUCCEEDED) {
      setShowNewPost(false);
      setForm({ service_type: "", location: "", needed_from: "", summary: "" });
      dispatch(clearSaveStatus());
    }
  }, [saveStatus, dispatch]);

  const myPostsIds = list
    .filter((p) => p.user_id === user?.id)
    .map((p) => p.id);
  const ordered = [
    ...list.filter((p) => myPostsIds.includes(p.id)),
    ...list.filter((p) => !myPostsIds.includes(p.id)),
  ];

  const handleSubmit = () => {
    if (!form.service_type.trim() || !form.summary.trim() || saving) return;
    dispatch(createServiceRequest(form));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this request?")) {
      dispatch(deleteServiceRequest(id));
    }
  };

  const handleClose = (id) => {
    if (window.confirm("Close this request to new replies?")) {
      dispatch(closeServiceRequest(id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Looking for Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Post what you&apos;re looking for and let trusted providers come to
            you.
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
            Post what service you&apos;re after. Paid providers can reply with
            their contact details — you and everyone viewing this page can see
            the replies. Providers can&apos;t contact you directly; the choice
            stays with you.
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
            const replies = post.replies || [];
            return (
              <div
                key={post.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${
                  isMine
                    ? "border-purple-300 ring-1 ring-purple-200"
                    : "border-slate-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(post.author_name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {isMine && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          YOUR POST
                        </span>
                      )}
                      {isClosed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" /> CLOSED
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {post.author_name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ·{" "}
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString(
                              "en-AU",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">
                      Looking for a {post.service_type}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                      {post.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {post.location}
                        </span>
                      )}
                      {post.needed_from && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> Needed:{" "}
                          {post.needed_from}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {replies.length}{" "}
                        provider {replies.length === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <button
                        onClick={() => setExpanded(isOpen ? null : post.id)}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        {isOpen ? "Hide replies" : "View provider replies"}
                      </button>
                      {isMine && !isClosed && (
                        <button
                          onClick={() => handleClose(post.id)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Close request
                        </button>
                      )}
                      {isMine && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                        {replies.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No replies yet. Check back soon.
                          </p>
                        ) : (
                          replies.map((r) => (
                            <div
                              key={r.id}
                              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                            >
                              <p className="text-sm font-semibold text-slate-800">
                                {r.provider_name}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {r.message}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600">
                                {r.contact_email && (
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5" />{" "}
                                    {r.contact_email}
                                  </span>
                                )}
                                {r.contact_phone && (
                                  <span className="inline-flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />{" "}
                                    {r.contact_phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewPost(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Post a Service Request
              </h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  What service are you looking for?{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.service_type}
                  onChange={(e) =>
                    setForm({ ...form, service_type: e.target.value })
                  }
                  placeholder="e.g. Occupational Therapist"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g. Berwick, Melbourne"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Dates needed
                  </label>
                  <input
                    type="text"
                    value={form.needed_from}
                    onChange={(e) =>
                      setForm({ ...form, needed_from: e.target.value })
                    }
                    placeholder="e.g. After May 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Describe what you need{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  placeholder="e.g. Looking for an Occupational Therapist who can do Functional Assessments and provide ongoing support..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <p className="text-xs text-slate-500">
                Your post will be visible to everyone on this page. Only paid
                providers can reply, and replies are public — providers
                can&apos;t message you privately.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !form.service_type.trim() ||
                  !form.summary.trim()
                }
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
