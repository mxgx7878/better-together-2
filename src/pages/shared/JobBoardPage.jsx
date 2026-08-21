import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Lock,
  Loader2,
  Send,
  Trash2,
  Info,
  Sparkles,
  Pencil,
  CheckCircle2,
  Clock,
  Repeat,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchServiceRequests,
  createServiceRequestReply,
  updateServiceRequestReply,
  deleteServiceRequestReply,
} from "../../store/actions/serviceRequestActions";
import { ASYNC_STATUS } from "../../constants";

const FREQUENCIES = {
  one_off: "One-off",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
  ongoing: "Ongoing",
};
const URGENCIES = {
  asap: "ASAP",
  within_2_weeks: "Within 2 weeks",
  within_month: "Within a month",
  flexible: "Flexible",
};
const BUDGET_TYPES = {
  ndis_managed: "NDIS Managed",
  self_managed: "Self Managed",
  plan_managed: "Plan Managed",
  not_sure: "Budget TBD",
};

const isReplyEditable = (reply) => {
  if (reply.is_editable !== undefined) return reply.is_editable;
  if (!reply.created_at) return false;
  const mins = (Date.now() - new Date(reply.created_at).getTime()) / 60000;
  return mins <= 15;
};

const JobBoardPage = () => {
  const dispatch = useDispatch();
  const { user, isPaid } = useAuth();
  const { list, status, replyStatus } = useSelector((s) => s.serviceRequest);
  const loading = status === ASYNC_STATUS.LOADING;
  const replying = replyStatus === ASYNC_STATUS.LOADING;

  const providerCategoryIds = useMemo(
    () =>
      (user?.provider_profile?.categories || []).map((c) => c.id ?? c),
    [user],
  );
  const hasCategories = providerCategoryIds.length > 0;

  const [tab, setTab] = useState(hasCategories ? "matching" : "all");
  const [expanded, setExpanded] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyForm, setReplyForm] = useState({
    message: "",
    contact_email: user?.email || "",
    contact_phone: user?.phone_number || "",
  });

  useEffect(() => {
    const params = {};
    if (tab === "matching" && hasCategories) {
      params.matches_my_categories = 1;
    }
    dispatch(fetchServiceRequests(params));
  }, [dispatch, tab, hasCategories]);

  const resetForm = () => {
    setReplyForm({
      message: "",
      contact_email: user?.email || "",
      contact_phone: user?.phone_number || "",
    });
    setReplyingTo(null);
    setEditingReplyId(null);
  };

  const openReply = (requestId) => {
    setReplyingTo(requestId);
    setEditingReplyId(null);
    setReplyForm({
      message: "",
      contact_email: user?.email || "",
      contact_phone: user?.phone_number || "",
    });
  };

  const openEdit = (requestId, reply) => {
    setReplyingTo(requestId);
    setEditingReplyId(reply.id);
    setReplyForm({
      message: reply.message || "",
      contact_email: reply.contact_email || "",
      contact_phone: reply.contact_phone || "",
    });
  };

  const submitReply = async (requestId) => {
    if (!replyForm.message.trim() || replying) return;

    const action = editingReplyId
      ? await dispatch(
          updateServiceRequestReply({
            requestId,
            replyId: editingReplyId,
            payload: replyForm,
          }),
        )
      : await dispatch(
          createServiceRequestReply({
            requestId,
            payload: replyForm,
          }),
        );

    if (action.type.endsWith("/fulfilled")) resetForm();
  };

  const removeOwnReply = (requestId, replyId) => {
    if (window.confirm("Remove your application?"))
      dispatch(deleteServiceRequestReply({ requestId, replyId }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Job Board</h1>
        <p className="text-sm text-slate-500 mt-1">
          Participant requests for services you offer. Apply by replying
          with your contact details.
        </p>
      </div>

      {/* Gate for free providers */}
      {!isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 flex-1">
            <p className="font-semibold">Upgrade to apply</p>
            <p className="mt-0.5">
              Applying to participant requests is a paid feature.{" "}
              <Link
                to="/provider/upgrade"
                className="underline font-semibold"
              >
                Upgrade your subscription
              </Link>{" "}
              to start applying.
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Apply in the open</p>
          <p>
            Your reply is visible to the poster and everyone else on the
            page. You cannot message the poster privately — the choice
            stays with them. You can edit your reply within 15 minutes of
            posting.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("matching")}
          disabled={!hasCategories}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
            tab === "matching"
              ? "bg-white text-purple-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={
            hasCategories
              ? undefined
              : "Add service categories on your profile to enable this"
          }
        >
          <Sparkles className="w-4 h-4" /> Matching Your Services
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "all"
              ? "bg-white text-purple-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          All Requests
        </button>
      </div>

      {/* Posts */}
      {loading && list.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">
            No matching requests right now. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((post) => {
            const isOpen = expanded === post.id;
            const isFulfilled = post.status === "fulfilled";
            const isClosed = post.status === "closed";
            const replies = post.replies || [];
            const myReply = replies.find(
              (r) => r.provider_user_id === user?.id || r.user_id === user?.id,
            );

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-slate-800">
                        {post.service_type}
                      </h3>
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
                </div>

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
                      {FREQUENCIES[post.frequency] || post.frequency}
                    </span>
                  )}
                  {post.urgency && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {URGENCIES[post.urgency] || post.urgency}
                    </span>
                  )}
                  {post.budget_type && (
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />{" "}
                      {BUDGET_TYPES[post.budget_type]}
                      {post.budget_amount
                        ? ` · $${Number(post.budget_amount).toFixed(2)}`
                        : ""}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {post.summary}
                </p>

                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <span className="text-xs text-slate-500">
                    {replies.length}{" "}
                    {replies.length === 1 ? "application" : "applications"}
                  </span>
                  <button
                    onClick={() => setExpanded(isOpen ? null : post.id)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    {isOpen ? "Hide applications" : "View applications"}
                  </button>
                  {isPaid && !isClosed && !isFulfilled && !myReply && (
                    <button
                      onClick={() => openReply(post.id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply
                    </button>
                  )}
                  {myReply && (
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      You&apos;ve applied
                    </span>
                  )}
                </div>

                {/* Reply / Edit form */}
                {replyingTo === post.id && isPaid && !isClosed && !isFulfilled && (
                  <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/30 p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {editingReplyId
                        ? "Edit your application"
                        : "Your public application"}
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
                        {editingReplyId
                          ? "Save Changes"
                          : "Submit Application"}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Applications list */}
                {isOpen && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    {replies.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-2">
                        No applications yet.
                      </p>
                    ) : (
                      replies.map((r) => {
                        const isMyReply =
                          r.provider_user_id === user?.id ||
                          r.user_id === user?.id;
                        const isSelected =
                          post.selected_reply_id === r.id;
                        const editable =
                          isMyReply && isReplyEditable(r) && !isFulfilled;

                        return (
                          <div
                            key={r.id}
                            className={`rounded-xl border p-4 ${
                              isSelected
                                ? "border-emerald-300 bg-emerald-50/40"
                                : isMyReply
                                  ? "border-purple-200 bg-purple-50/40"
                                  : "border-slate-100 bg-slate-50/60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
                                  {r.provider_name || r.provider?.name}
                                  {isMyReply && (
                                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                      YOU
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />{" "}
                                      HIRED
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
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
                              {isMyReply && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {editable && (
                                    <button
                                      onClick={() => openEdit(post.id, r)}
                                      className="text-xs text-slate-500 hover:text-purple-600 p-1"
                                      title="Edit (within 15 min)"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      removeOwnReply(post.id, r.id)
                                    }
                                    className="text-xs text-red-500 hover:text-red-700 p-1"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobBoardPage;