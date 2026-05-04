import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Pin, Lock, Sparkles, Eye, ArrowRight, X } from "lucide-react";
import Checkbox from "../../components/common/Checkbox";

const mockThreads = [
  {
    id: 1,
    title: "New NDIS pricing changes — how is everyone adapting?",
    author: "Karen B.",
    authorRole: "Support Coordinator",
    date: "2026-02-16",
    replies: 12,
    views: 89,
    topic: "compliance",
    pinned: true,
    lastReply: "2 hours ago",
    preview:
      "With the mid-year pricing update, I'm finding it challenging to reconcile the new rates with existing service agreements...",
  },
  {
    id: 2,
    title: "Best practices for participant onboarding documentation",
    author: "Michael T.",
    authorRole: "Provider Manager",
    date: "2026-02-15",
    replies: 8,
    views: 54,
    topic: "practice",
    pinned: false,
    lastReply: "5 hours ago",
    preview:
      "We recently revamped our onboarding process and wanted to share what's been working well for us...",
  },
  {
    id: 3,
    title: "Telehealth vs in-person — what are participants preferring?",
    author: "Dr. Lisa M.",
    authorRole: "Allied Health",
    date: "2026-02-14",
    replies: 15,
    views: 112,
    topic: "service",
    pinned: false,
    lastReply: "1 day ago",
    preview:
      "We've noticed a shift back to in-person for younger participants but telehealth remains popular for...",
  },
  {
    id: 4,
    title: "SIL roster management — any good tools?",
    author: "Anonymous",
    authorRole: "Provider",
    date: "2026-02-13",
    replies: 6,
    views: 42,
    topic: "tech",
    pinned: false,
    lastReply: "1 day ago",
    preview:
      "Managing SIL rosters is becoming increasingly complex. Does anyone use software that integrates with NDIS claiming?",
  },
  {
    id: 5,
    title: "Worker screening turnaround times in VIC",
    author: "Sarah K.",
    authorRole: "HR Manager",
    date: "2026-02-12",
    replies: 4,
    views: 31,
    topic: "compliance",
    pinned: false,
    lastReply: "2 days ago",
    preview:
      "We're experiencing delays of 6+ weeks for worker screening checks. Is anyone else seeing this?",
  },
  {
    id: 6,
    title: "Tips for supporting participants through plan reviews",
    author: "James P.",
    authorRole: "Support Coordinator",
    date: "2026-02-10",
    replies: 19,
    views: 145,
    topic: "practice",
    pinned: false,
    lastReply: "3 days ago",
    preview:
      "Plan reviews can be stressful for participants. Here are some strategies that have worked well...",
  },
];

const topics = [
  { key: "all", label: "All Topics" },
  { key: "compliance", label: "Compliance & Policy" },
  { key: "practice", label: "Practice & Delivery" },
  { key: "service", label: "Service Insights" },
  { key: "tech", label: "Technology & Tools" },
];

const QAForumPage = () => {
  const { user, isPaid } = useAuth();
  const [topicFilter, setTopicFilter] = useState("all");
  const [showNewThread, setShowNewThread] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [selectedThread, setSelectedThread] = useState(null);
  const [postAnonymously, setPostAnonymously] = useState(false);

  const filtered = mockThreads
    .filter((t) => topicFilter === "all" || t.topic === topicFilter)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === "popular") return b.views - a.views;
      return new Date(b.date) - new Date(a.date);
    });

  // Any action that would let a user "participate" goes through this guard.
  // Paid → run the action. Free → show upgrade prompt.
  const guardParticipation = (action) => {
    if (isPaid) {
      action?.();
    } else {
      setShowUpgradePrompt(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Q&A Forum</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isPaid
              ? "Ask questions, share knowledge, and learn from other providers"
              : "Browse discussions from our paid provider community"}
          </p>
        </div>

        {/* New Discussion button — same UI for everyone, but free users get the upgrade prompt */}
        <button
          onClick={() => guardParticipation(() => setShowNewThread(true))}
          className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 ${
            isPaid
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          }`}
        >
          {isPaid ? (
            <>+ New Discussion</>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Upgrade your plan
            </>
          )}
        </button>
      </div>

      {/* ─── Free-tier read-only banner ─────────────────────────── */}
      {!isPaid && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-amber-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-amber-900 flex items-center gap-2 flex-wrap">
                  You&apos;re viewing in read-only mode
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                    Free Plan
                  </span>
                </p>
                <p className="text-sm text-amber-800 mt-0.5">
                  You can browse all discussions, but posting and replying is
                  reserved for paid members. Upgrade to join the conversation.
                </p>
              </div>
            </div>
            <Link
              to="/provider/upgrade"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-2 flex-wrap flex-1">
          {topics.map((t) => (
            <button
              key={t.key}
              onClick={() => setTopicFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                topicFilter === t.key
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-purple-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>

      {/* Thread List */}
      <div className="space-y-3">
        {filtered.map((thread) => (
          <div
            key={thread.id}
            onClick={() =>
              setSelectedThread(selectedThread === thread.id ? null : thread.id)
            }
            className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${
              thread.pinned
                ? "border-amber-200 bg-amber-50/30"
                : "border-slate-100"
            } ${
              selectedThread === thread.id
                ? "ring-2 ring-purple-300 border-purple-200"
                : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {thread.author === "Anonymous"
                  ? "?"
                  : thread.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {thread.pinned && (
                    <span className="text-amber-600 text-xs font-bold flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5" /> Pinned
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-slate-800 hover:text-purple-700 transition-colors">
                    {thread.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {thread.preview}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="font-medium text-slate-600">
                    {thread.author}
                  </span>
                  <span>{thread.authorRole}</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {thread.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {thread.views} views
                  </span>
                  <span>Last reply: {thread.lastReply}</span>
                </div>

                {/* Thread expanded view — show Reply CTA, gated for free users */}
                {selectedThread === thread.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-slate-500">
                      {isPaid
                        ? "Join the conversation — share your insights with the community."
                        : "Want to reply? Paid members can join this discussion."}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        guardParticipation(() => {
                          // Paid users — wire to real reply flow when available
                          console.log("Open reply for thread", thread.id);
                        });
                      }}
                      className={`text-sm font-semibold inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                        isPaid
                          ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                      }`}
                    >
                      {isPaid ? (
                        <>Reply</>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Upgrade to Reply
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── New Thread Modal — paid users only ─────────────────── */}
      {showNewThread && isPaid && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewThread(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Start a New Discussion
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Topic
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white">
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
                  placeholder="What's your question or discussion topic?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide context or details..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <Checkbox
                label="Post anonymously"
                checked={postAnonymously}
                onChange={setPostAnonymously}
              />
              <button
                onClick={() => setShowNewThread(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md"
              >
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Upgrade Prompt Modal — shown to free users on participate attempts ─── */}
      {showUpgradePrompt && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUpgradePrompt(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 px-6 py-8 text-white text-center">
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">Join the Conversation</h2>
              <p className="text-sm text-purple-100 mt-1.5">
                Posting and replying is for paid members
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upgrade your subscription to start discussions, reply to other
                  providers, and become an active part of the community.
                </p>
              </div>

              {/* What you'll unlock */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  What you&apos;ll unlock
                </p>
                <ul className="space-y-2">
                  {[
                    "Start your own discussions",
                    "Reply and comment on any thread",
                    "Direct messaging with other providers",
                    "Eligible for the Marketing add-on",
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

              {/* CTAs */}
              <div className="flex flex-col gap-2">
                <Link
                  to="/provider/upgrade"
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  View Subscription Plans
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAForumPage;