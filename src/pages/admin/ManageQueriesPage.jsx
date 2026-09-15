import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Inbox,
  Search,
  Loader2,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Lock,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchQueries,
  adminFetchQueryStats,
  adminRespondToQuery,
  adminUpdateQueryStatus,
  adminDeleteQuery,
} from "../../store/actions/queryActions";
import { ASYNC_STATUS } from "../../constants";

const CATEGORY_LABELS = {
  general: "General Enquiry",
  technical: "Technical Issue",
  billing: "Billing Question",
  feedback: "Feedback",
};

const STATUS_STYLES = {
  open: "bg-amber-50 text-amber-700",
  responded: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
};

const ManageQueriesPage = () => {
  const dispatch = useDispatch();
  const { list, status, total, stats, statsStatus, responseStatus } =
    useSelector((s) => s.query);
  const loading = status === ASYNC_STATUS.LOADING;
  const responding = responseStatus === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    dispatch(adminFetchQueryStats());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    if (categoryFilter !== "all") params.category = categoryFilter;
    dispatch(adminFetchQueries(params));
  }, [dispatch, searchTerm, statusFilter, categoryFilter]);

  const openDetail = (q) => {
    setSelected(q);
    setResponseText(q.admin_response || "");
  };

  const closeDetail = () => {
    setSelected(null);
    setResponseText("");
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    const result = await dispatch(
      adminRespondToQuery({ id: selected.id, response: responseText.trim() }),
    );
    if (!result.error) {
      // refresh detail with updated query
      const updated = result.payload;
      if (updated) setSelected({ ...selected, ...updated });
    }
  };

  const handleStatusChange = async (newStatus) => {
    const result = await dispatch(
      adminUpdateQueryStatus({ id: selected.id, status: newStatus }),
    );
    if (!result.error && result.payload) {
      setSelected({ ...selected, ...result.payload });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this query permanently?")) return;
    await dispatch(adminDeleteQuery(id));
    if (selected?.id === id) closeDetail();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="User Queries"
        description="Manage and respond to queries from participants and providers"
        icon={Inbox}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Inbox}
          color="purple"
          label="Total Queries"
          value={stats?.total ?? 0}
          loading={statsStatus === ASYNC_STATUS.LOADING}
        />
        <StatCard
          icon={Clock}
          color="amber"
          label="Open"
          value={stats?.open ?? 0}
          loading={statsStatus === ASYNC_STATUS.LOADING}
        />
        <StatCard
          icon={CheckCircle2}
          color="emerald"
          label="Responded"
          value={stats?.responded ?? 0}
          loading={statsStatus === ASYNC_STATUS.LOADING}
        />
        <StatCard
          icon={Lock}
          color="slate"
          label="Closed"
          value={stats?.closed ?? 0}
          loading={statsStatus === ASYNC_STATUS.LOADING}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by subject, name, or email..."
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
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white"
        >
          <option value="all">All categories</option>
          <option value="general">General Enquiry</option>
          <option value="technical">Technical Issue</option>
          <option value="billing">Billing Question</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      <p className="text-sm text-slate-500">
        {loading
          ? "Loading..."
          : `${list.length} of ${total || list.length} quer${
              list.length === 1 ? "y" : "ies"
            }`}
      </p>

      {/* Table */}
      {loading && list.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">No queries found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Received</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 min-w-[260px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {q.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {q.message}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      <p className="font-medium">{q.name}</p>
                      <p className="text-xs text-slate-400">{q.email}</p>
                      {q.user_role && (
                        <span className="text-[10px] uppercase tracking-wider text-purple-600 font-semibold">
                          {q.user_role}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-700 text-xs">
                      {CATEGORY_LABELS[q.category] || q.category}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          STATUS_STYLES[q.status] || STATUS_STYLES.open
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {q.created_at
                        ? new Date(q.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openDetail(q)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="View & respond"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      STATUS_STYLES[selected.status] || STATUS_STYLES.open
                    }`}
                  >
                    {selected.status}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {CATEGORY_LABELS[selected.category] || selected.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  {selected.subject}
                </h2>
              </div>
              <button
                onClick={closeDetail}
                className="p-2 hover:bg-slate-100 rounded-lg flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* User info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <strong>{selected.name}</strong>
                  {selected.user_role && (
                    <span className="text-[10px] uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {selected.user_role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" /> {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" /> {selected.phone}
                  </div>
                )}
                <p className="text-xs text-slate-400">
                  Sent on{" "}
                  {selected.created_at
                    ? new Date(selected.created_at).toLocaleString()
                    : "—"}
                </p>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Message
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Existing response */}
              {selected.admin_response && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Your previous
                    response
                  </h3>
                  <p className="text-sm text-emerald-900 whitespace-pre-wrap">
                    {selected.admin_response}
                  </p>
                  {selected.responded_at && (
                    <p className="text-xs text-emerald-600 mt-2">
                      Sent {new Date(selected.responded_at).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Response box */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {selected.admin_response
                    ? "Update response"
                    : "Send a response"}
                </h3>
                <textarea
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here. It will be visible to the user on their Connect with Admin page."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleSendResponse}
                  disabled={responding || !responseText.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {responding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Response
                </button>

                {selected.status !== "closed" && (
                  <button
                    onClick={() => handleStatusChange("closed")}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl inline-flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Mark as Closed
                  </button>
                )}
                {selected.status === "closed" && (
                  <button
                    onClick={() => handleStatusChange("open")}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Re-open
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selected.id)}
                  className="ml-auto px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
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
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
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

export default ManageQueriesPage;