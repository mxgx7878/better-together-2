import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Inbox,
  Search,
  Loader2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Lock,
  Eye,
  X,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchServiceRequests,
  adminFetchServiceRequestStats,
  adminDeleteServiceRequest,
  adminDeleteServiceRequestReply,
} from "../../store/actions/serviceRequestActions";
import { ASYNC_STATUS } from "../../constants";

const ManageServiceRequestsPage = () => {
  const dispatch = useDispatch();
  const { list, status, total, stats, statsStatus } = useSelector(
    (s) => s.serviceRequest,
  );
  const loading = status === ASYNC_STATUS.LOADING;
  const statsLoading = statsStatus === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    dispatch(adminFetchServiceRequestStats());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    dispatch(adminFetchServiceRequests(params));
  }, [dispatch, searchTerm, statusFilter]);

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this service request and all its replies?"))
      return;
    setDeletingId(id);
    await dispatch(adminDeleteServiceRequest(id));
    setDeletingId(null);
    if (selected?.id === id) setSelected(null);
  };

  const handleDeleteReply = (requestId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    dispatch(adminDeleteServiceRequestReply({ requestId, replyId }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Service Requests"
        description="Moderate participant posts and provider replies from Looking for Services"
        icon={Inbox}
      />

      {/* Analytics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Inbox}
          color="purple"
          label="Total Requests"
          value={stats?.total_requests ?? 0}
          loading={statsLoading}
        />
        <StatCard
          icon={TrendingUp}
          color="emerald"
          label="Open"
          value={stats?.open_requests ?? 0}
          loading={statsLoading}
        />
        <StatCard
          icon={CheckCircle2}
          color="slate"
          label="Closed"
          value={stats?.closed_requests ?? 0}
          loading={statsLoading}
        />
        <StatCard
          icon={MessageSquare}
          color="blue"
          label="Provider Replies"
          value={stats?.total_replies ?? 0}
          loading={statsLoading}
        />
      </div>

      {/* Breakdown panels */}
      {(stats?.by_service_type?.length || stats?.top_providers?.length) && (
        <div className="grid lg:grid-cols-2 gap-4">
          {stats?.by_service_type?.length ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Most requested services
                </h3>
              </div>
              <ul className="space-y-2">
                {stats.by_service_type.slice(0, 6).map((row) => {
                  const max = stats.by_service_type[0]?.count || 1;
                  const pct = Math.round((row.count / max) * 100);
                  return (
                    <li key={row.service_type}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-700">
                          {row.service_type}
                        </span>
                        <span className="text-slate-500">{row.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {stats?.top_providers?.length ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Top replying providers
                </h3>
              </div>
              <ul className="space-y-2">
                {stats.top_providers.slice(0, 6).map((p) => (
                  <li
                    key={p.provider_user_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700 truncate">
                      {p.provider_name}
                    </span>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by summary, service type, or author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Counts */}
      <p className="text-sm text-slate-500">
        {loading
          ? "Loading..."
          : `${list.length} of ${total || list.length} request${total === 1 ? "" : "s"}`}
      </p>

      {/* Table */}
      {loading && list.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">No service requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Replies</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((post) => {
                  const replies = post.replies || [];
                  return (
                    <tr key={post.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 min-w-[260px]">
                        <p className="font-semibold text-slate-800">
                          {post.service_type}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {post.summary}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {post.author_name}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {replies.length}
                      </td>
                      <td className="px-5 py-3">
                        {post.status === "closed" ? (
                          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Closed
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            Open
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString(
                              "en-AU",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelected(post)}
                            className="p-2 rounded-lg hover:bg-purple-50 text-purple-600"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingId === post.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                            title="Delete post"
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selected.service_type}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  by {selected.author_name}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-700">{selected.summary}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                {selected.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {selected.location}
                  </span>
                )}
                {selected.needed_from && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Needed:{" "}
                    {selected.needed_from}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Replies ({(selected.replies || []).length})
                </h3>
                <div className="space-y-2">
                  {(selected.replies || []).length === 0 ? (
                    <p className="text-sm text-slate-500">No replies yet.</p>
                  ) : (
                    selected.replies.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {r.provider_name}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {r.message}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
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
                          <button
                            onClick={() => handleDeleteReply(selected.id, r.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 flex-shrink-0"
                            title="Delete reply"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex justify-end gap-2">
              <button
                onClick={() => handleDeletePost(selected.id)}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const COLOR_CLASSES = {
  purple: "bg-purple-50 text-purple-600",
  emerald: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-100 text-slate-600",
  blue: "bg-blue-50 text-blue-600",
};

function StatCard({ icon: Icon, color, label, value, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
            COLOR_CLASSES[color] || COLOR_CLASSES.purple
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default ManageServiceRequestsPage;
