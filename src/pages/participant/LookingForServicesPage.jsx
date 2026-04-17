import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Briefcase,
  MapPin,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Info,
  Plus,
  X,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────
const mockPosts = [
  {
    id: 1,
    author: "Rebecca M.",
    authorId: 101,
    date: "2026-04-12",
    serviceType: "Occupational Therapist",
    location: "Berwick, Melbourne",
    neededFrom: "May 2026",
    summary:
      "Looking for an Occupational Therapist in Berwick, Melbourne who can do Functional Assessments and provide ongoing support. Dates needed are after May 2026.",
    replies: [
      {
        id: 1,
        provider: "Sunrise Allied Health",
        message:
          "Hi Rebecca, we have OTs available in Berwick from May onwards and we do Functional Assessments for NDIS participants.",
        email: "info@sunrisealliedhealth.com.au",
        phone: "03 9000 1234",
      },
      {
        id: 2,
        provider: "StepUp Therapy Co.",
        message:
          "Happy to help — we travel to Berwick weekly and offer ongoing OT support.",
        email: "hello@stepuptherapy.com.au",
        phone: "0412 345 678",
      },
    ],
  },
  {
    id: 2,
    author: "Chris D.",
    authorId: 102,
    date: "2026-04-10",
    serviceType: "Support Coordinator",
    location: "Melbourne CBD",
    neededFrom: "ASAP",
    summary:
      "Looking for a Support Coordinator with experience in psychosocial supports. CBD or willing to travel.",
    replies: [
      {
        id: 1,
        provider: "InReach Support Coordination",
        message:
          "We specialise in psychosocial recovery coaching across inner Melbourne, happy to connect.",
        email: "team@inreachsc.com.au",
        phone: "03 9111 2222",
      },
    ],
  },
  {
    id: 3,
    author: "Tina W.",
    authorId: 103,
    date: "2026-04-09",
    serviceType: "Employment Support",
    location: "Geelong, VIC",
    neededFrom: "June 2026",
    summary:
      "Need help with resume writing and interview prep. Looking for a DES / employment-focused provider in Geelong.",
    replies: [],
  },
];

const LookingForServicesPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(mockPosts);
  const [expanded, setExpanded] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [form, setForm] = useState({
    serviceType: "",
    location: "",
    neededFrom: "",
    summary: "",
  });

  const myPostsIds = posts.filter((p) => p.authorId === user?.id).map((p) => p.id);
  const ordered = [
    ...posts.filter((p) => myPostsIds.includes(p.id)),
    ...posts.filter((p) => !myPostsIds.includes(p.id)),
  ];

  const handleSubmit = () => {
    if (!form.serviceType.trim() || !form.summary.trim()) return;
    const newPost = {
      id: Date.now(),
      author: user?.name || "You",
      authorId: user?.id,
      date: new Date().toISOString().slice(0, 10),
      serviceType: form.serviceType,
      location: form.location,
      neededFrom: form.neededFrom,
      summary: form.summary,
      replies: [],
    };
    setPosts([newPost, ...posts]);
    setForm({ serviceType: "", location: "", neededFrom: "", summary: "" });
    setShowNewPost(false);
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
      <div className="space-y-4">
        {ordered.map((post) => {
          const isMine = myPostsIds.includes(post.id);
          const isOpen = expanded === post.id;
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
                  {post.author
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
                    <span className="text-xs text-slate-500">{post.author}</span>
                    <span className="text-xs text-slate-400">
                      ·{" "}
                      {new Date(post.date).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Looking for a {post.serviceType}
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
                    {post.neededFrom && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" /> Needed:{" "}
                        {post.neededFrom}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {post.replies.length}{" "}
                      provider{" "}
                      {post.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => setExpanded(isOpen ? null : post.id)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      {isOpen ? "Hide replies" : "View provider replies"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      {post.replies.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No replies yet. Check back soon.
                        </p>
                      ) : (
                        post.replies.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-800">
                              {r.provider}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {r.message}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600">
                              <span className="inline-flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" /> {r.email}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" /> {r.phone}
                              </span>
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
                  What service are you looking for?
                </label>
                <input
                  type="text"
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm({ ...form, serviceType: e.target.value })
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
                    value={form.neededFrom}
                    onChange={(e) =>
                      setForm({ ...form, neededFrom: e.target.value })
                    }
                    placeholder="e.g. After May 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Describe what you need
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
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md disabled:opacity-60"
                disabled={!form.serviceType.trim() || !form.summary.trim()}
              >
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
