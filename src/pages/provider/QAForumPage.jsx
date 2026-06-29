import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageCircle,
  Plus,
  Lock,
  Sparkles,
  ArrowRight,
  Pin,
  Eye,
  Loader2,
  ChevronLeft,
  Send,
  Trash2,
  X,
  Clock,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchForumQuestions,
  fetchForumQuestion,
  createForumQuestion,
  createForumAnswer,
  deleteForumQuestion,
  deleteForumAnswer,
} from "../../store/actions/forumActions";
import { clearSelected } from "../../store/slices/forumSlice";

const topics = [
  { key: "all", label: "All Topics" },
  { key: "compliance", label: "Compliance & Policy" },
  { key: "practice", label: "Practice & Delivery" },
  { key: "service", label: "Service Insights" },
  { key: "tech", label: "Technology & Tools" },
  { key: "general", label: "General" },
];

const topicLabel = (key) =>
  topics.find((t) => t.key === key)?.label || "General";

const roleBadge = (role) => {
  if (role === "provider")
    return "bg-purple-50 text-purple-700 border-purple-100";
  if (role === "participant")
    return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
};

const roleLabel = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "Member";

// Lightweight relative-time helper
const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
};

const Avatar = ({ name }) => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
    {(name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </div>
);

const QAForumPage = () => {
  const dispatch = useDispatch();
  const { user, isPaid } = useAuth();
  const basePath = `/${(user?.role || "participant").toLowerCase()}`;

  const { list, status, selected, selectedStatus, saveStatus, replyStatus } =
    useSelector((s) => s.forum);
  const loading = status === ASYNC_STATUS.LOADING;
  const submitting = saveStatus === ASYNC_STATUS.LOADING;
  const replying = replyStatus === ASYNC_STATUS.LOADING;

  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showNewThread, setShowNewThread] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [openId, setOpenId] = useState(null);

  // New question form
  const [form, setForm] = useState({
    title: "",
    body: "",
    topic: "general",
    is_anonymous: false,
  });

  // Answer composer
  const [answerBody, setAnswerBody] = useState("");
  const [answerAnon, setAnswerAnon] = useState(false);

  // ─── Fetch list on filter/sort change ───────────────────────
  useEffect(() => {
    const params = { sort: sortBy };
    if (topicFilter !== "all") params.topic = topicFilter;
    dispatch(fetchForumQuestions(params));
  }, [dispatch, topicFilter, sortBy]);

  // ─── Open / close a thread detail ───────────────────────────
  const openThread = (id) => {
    setOpenId(id);
    dispatch(fetchForumQuestion(id));
  };
  const closeThread = () => {
    setOpenId(null);
    setAnswerBody("");
    setAnswerAnon(false);
    dispatch(clearSelected());
  };

  // Paid-only participation guard
  const guardParticipation = (action) => {
    if (isPaid) action?.();
    else setShowUpgradePrompt(true);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const res = await dispatch(createForumQuestion(form));
    if (!res.error) {
      setShowNewThread(false);
      setForm({ title: "", body: "", topic: "general", is_anonymous: false });
    }
  };

  const handleAnswer = async () => {
    if (!answerBody.trim() || !selected?.id) return;
    const res = await dispatch(
      createForumAnswer({
        questionId: selected.id,
        payload: { body: answerBody.trim(), is_anonymous: answerAnon },
      }),
    );
    if (!res.error) {
      setAnswerBody("");
      setAnswerAnon(false);
    }
  };

  const sortedList = useMemo(() => list, [list]);

  // ═══════════════════════════════════════════════════════════
  //  THREAD DETAIL VIEW
  // ═══════════════════════════════════════════════════════════
  if (openId) {
    const detailLoading = selectedStatus === ASYNC_STATUS.LOADING;
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <button
          onClick={closeThread}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all questions
        </button>

        {detailLoading || !selected ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Question */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  {topicLabel(selected.topic)}
                </span>
                {selected.is_pinned && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 inline-flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                {selected.status === "closed" && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    Closed
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold text-slate-800 mb-3">
                {selected.title}
              </h1>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {selected.body}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Avatar name={selected.author?.name} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {selected.author?.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      {selected.author?.role && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full border ${roleBadge(
                            selected.author.role,
                          )}`}
                        >
                          {roleLabel(selected.author.role)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(selected.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {selected.views}
                      </span>
                    </div>
                  </div>
                </div>
                {selected.is_owner && (
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this question?")) {
                        dispatch(deleteForumQuestion(selected.id));
                        closeThread();
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Answers */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 mb-3">
                {selected.answers_count || 0}{" "}
                {(selected.answers_count || 0) === 1 ? "Answer" : "Answers"}
              </h2>

              <div className="space-y-3">
                {(selected.answers || []).map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
                  >
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                      {a.body}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.author?.name} />
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="text-sm font-medium text-slate-700">
                            {a.author?.name}
                          </span>
                          {a.author?.role && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full border ${roleBadge(
                                a.author.role,
                              )}`}
                            >
                              {roleLabel(a.author.role)}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(a.created_at)}
                          </span>
                        </div>
                      </div>
                      {a.is_owner && (
                        <button
                          onClick={() =>
                            dispatch(
                              deleteForumAnswer({
                                questionId: selected.id,
                                answerId: a.id,
                              }),
                            )
                          }
                          className="text-slate-300 hover:text-red-500 transition-colors"
                          title="Delete reply"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(selected.answers || []).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6 bg-white rounded-2xl border border-slate-100">
                    No answers yet — be the first to reply.
                  </p>
                )}
              </div>
            </div>

            {/* Answer composer */}
            {selected.status !== "closed" &&
              (isPaid ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your answer
                  </label>
                  <textarea
                    rows={3}
                    value={answerBody}
                    onChange={(e) => setAnswerBody(e.target.value)}
                    placeholder="Share your knowledge or experience..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={answerAnon}
                        onChange={(e) => setAnswerAnon(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      Post anonymously
                    </label>
                    <button
                      onClick={handleAnswer}
                      disabled={!answerBody.trim() || replying}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
                    >
                      {replying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Post Answer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowUpgradePrompt(true)}
                  className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock className="w-4 h-4" /> Upgrade to answer
                </button>
              ))}
          </>
        )}

        {showUpgradePrompt && (
          <UpgradeModal basePath={basePath} onClose={() => setShowUpgradePrompt(false)} />
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  LIST VIEW
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Q&A Forum</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isPaid
              ? "Ask questions, share knowledge, and learn from the community"
              : "Browse questions from the community"}
          </p>
        </div>

        <button
          onClick={() => guardParticipation(() => setShowNewThread(true))}
          className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
            isPaid
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          }`}
        >
          {isPaid ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {isPaid ? "Ask a Question" : "Upgrade to Ask"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t.key}
              onClick={() => setTopicFilter(t.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                topicFilter === t.key
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : sortedList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No questions here yet.{" "}
            {isPaid ? "Start the conversation!" : "Check back soon."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedList.map((q) => (
            <button
              key={q.id}
              onClick={() => openThread(q.id)}
              className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {q.is_pinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                      {topicLabel(q.topic)}
                    </span>
                    {q.status === "closed" && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                        Closed
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 truncate">
                    {q.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {q.body}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar name={q.author?.name} />
                      <span className="font-medium text-slate-600">
                        {q.author?.name}
                      </span>
                      {q.author?.role && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full border ${roleBadge(
                            q.author.role,
                          )}`}
                        >
                          {roleLabel(q.author.role)}
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeAgo(q.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                    <MessageCircle className="w-3.5 h-3.5" /> {q.answers_count || 0}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Eye className="w-3 h-3" /> {q.views}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New Question Modal — paid only */}
      {showNewThread && isPaid && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewThread(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Ask a Question
              </h2>
              <button
                onClick={() => setShowNewThread(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Topic
                </label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white"
                >
                  {topics
                    .filter((t) => t.key !== "all")
                    .map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What's your question?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Details
                </label>
                <textarea
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Add any context that will help people answer..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_anonymous}
                  onChange={(e) =>
                    setForm({ ...form, is_anonymous: e.target.checked })
                  }
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                Post anonymously
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowNewThread(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.title.trim() || !form.body.trim() || submitting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-xl inline-flex items-center justify-center gap-2 transition-all"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradePrompt && (
        <UpgradeModal basePath={basePath} onClose={() => setShowUpgradePrompt(false)} />
      )}
    </div>
  );
};

// ─── Upgrade prompt for free users ────────────────────────────────
const UpgradeModal = ({ basePath, onClose }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">
        Upgrade to join the conversation
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Free members can browse the forum. Upgrade to ask and answer questions.
      </p>
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <ul className="space-y-2">
          {[
            "Ask your own questions",
            "Reply to any thread",
            "Connect with providers & participants",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          to={`${basePath}/upgrade`}
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          View Subscription Plans <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  </div>
);

export default QAForumPage;