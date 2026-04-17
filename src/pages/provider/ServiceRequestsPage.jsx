import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Lock,
  Loader2,
  Send,
  Trash2,
  Info,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchServiceRequests,
  createServiceRequestReply,
  deleteServiceRequestReply,
} from "../../store/actions/serviceRequestActions";
import { ASYNC_STATUS } from "../../constants";

const ServiceRequestsPage = () => {
  const dispatch = useDispatch();
  const { user, isPaid } = useAuth();
  const { list, status, replyStatus } = useSelector((s) => s.serviceRequest);
  const loading = status === ASYNC_STATUS.LOADING;
  const replying = replyStatus === ASYNC_STATUS.LOADING;

  const [expanded, setExpanded] = useState(null);
  const [replyForm, setReplyForm] = useState({
    message: "",
    contact_email: user?.email || "",
    contact_phone: user?.phone_number || "",
  });
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    dispatch(fetchServiceRequests());
  }, [dispatch]);

  const openReply = (requestId) => {
    setReplyingTo(requestId);
    setReplyForm({
      message: "",
      contact_email: user?.email || "",
      contact_phone: user?.phone_number || "",
    });
  };

  const submitReply = async (requestId) => {
    if (!replyForm.message.trim() || replying) return;
    const action = await dispatch(
      createServiceRequestReply({
        requestId,
        payload: replyForm,
      }),
    );
    if (action.type.endsWith("/fulfilled")) {
      setReplyingTo(null);
      setReplyForm({
        message: "",
        contact_email: user?.email || "",
        contact_phone: user?.phone_number || "",
      });
    }
  };

  const removeOwnReply = (requestId, replyId) => {
    if (window.confirm("Remove your reply?")) {
      dispatch(deleteServiceRequestReply({ requestId, replyId }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Service Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Participants posting what they&apos;re looking for — reply with your
          contact details to connect.
        </p>
      </div>

      {/* Gate notice for free providers */}
      {!isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 flex-1">
            <p className="font-semibold">Upgrade to reply</p>
            <p className="mt-0.5">
              Replying to service requests is a paid feature — it&apos;s how we
              keep referrals high quality.{" "}
              <Link
                to="/provider/upgrade"
                className="underline font-semibold"
              >
                Upgrade your subscription
              </Link>{" "}
              to start responding.
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Reply in the open</p>
          <p>
            Your reply is visible to the poster and every other participant on
            this page. You cannot message the poster privately — the choice
            stays with them. Share the best way to reach you.
          </p>
        </div>
      </div>

      {/* Posts */}
      {loading && list.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">
            No requests yet — check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((post) => {
            const isOpen = expanded === post.id;
            const isClosed = post.status === "closed";
            const replies = post.replies || [];
            const myReply = replies.find(
              (r) => r.provider_user_id === user?.id,
            );
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
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
                        {replies.length === 1 ? "reply" : "replies"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <button
                        onClick={() => setExpanded(isOpen ? null : post.id)}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        {isOpen ? "Hide replies" : "View replies"}
                      </button>
                      {isPaid && !isClosed && !myReply && (
                        <button
                          onClick={() => openReply(post.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
                        >
                          <Send className="w-3.5 h-3.5" /> Reply
                        </button>
                      )}
                      {myReply && (
                        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          You&apos;ve replied
                        </span>
                      )}
                    </div>

                    {/* Reply form */}
                    {replyingTo === post.id && isPaid && !isClosed && (
                      <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/30 p-4 space-y-3">
                        <p className="text-sm font-semibold text-slate-800">
                          Your public reply
                        </p>
                        <textarea
                          rows={3}
                          value={replyForm.message}
                          onChange={(e) =>
                            setReplyForm({
                              ...replyForm,
                              message: e.target.value,
                            })
                          }
                          placeholder="How you can help, availability, areas covered..."
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                        />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={replyForm.contact_email}
                            onChange={(e) =>
                              setReplyForm({
                                ...replyForm,
                                contact_email: e.target.value,
                              })
                            }
                            placeholder="Contact email"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                          />
                          <input
                            type="tel"
                            value={replyForm.contact_phone}
                            onChange={(e) =>
                              setReplyForm({
                                ...replyForm,
                                contact_phone: e.target.value,
                              })
                            }
                            placeholder="Contact phone"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => submitReply(post.id)}
                            disabled={replying || !replyForm.message.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg shadow-md disabled:opacity-50 inline-flex items-center gap-2"
                          >
                            {replying && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Post Reply
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies list */}
                    {isOpen && (
                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                        {replies.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No replies yet.
                          </p>
                        ) : (
                          replies.map((r) => {
                            const isMyReply =
                              r.provider_user_id === user?.id;
                            return (
                              <div
                                key={r.id}
                                className={`rounded-xl border p-4 ${
                                  isMyReply
                                    ? "border-purple-200 bg-purple-50/40"
                                    : "border-slate-100 bg-slate-50/60"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      {r.provider_name}
                                      {isMyReply && (
                                        <span className="ml-2 text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                          YOU
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">
                                      {r.message}
                                    </p>
                                  </div>
                                  {isMyReply && (
                                    <button
                                      onClick={() =>
                                        removeOwnReply(post.id, r.id)
                                      }
                                      className="text-xs text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
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
                            );
                          })
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
    </div>
  );
};

export default ServiceRequestsPage;
