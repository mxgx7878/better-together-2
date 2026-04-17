import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Briefcase,
  Heart,
  Loader2,
  Shield,
  CheckCircle,
  XCircle,
  Ban,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  adminFetchUsers,
  adminApproveUser,
  adminRejectUser,
  adminSuspendUser,
} from "../../store/actions/userActions";
import { ASYNC_STATUS } from "../../constants";

const ITEMS_PER_PAGE = 10;

const ROLE_TABS = [
  { key: "all", label: "All Users", icon: Users },
  { key: "provider", label: "Providers", icon: Briefcase },
  { key: "participant", label: "Participants", icon: Heart },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All Status" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

const roleBadge = (role) => {
  if (role === "provider")
    return "bg-purple-50 text-purple-700 border-purple-100";
  if (role === "participant") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const roleIcon = (role) => {
  if (role === "provider") return Briefcase;
  if (role === "participant") return Heart;
  return Shield;
};

const statusBadge = (status) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "rejected":
      return "bg-rose-50 text-rose-600 border-rose-200";
    case "suspended":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-200";
  }
};

const ManageUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [suspendModal, setSuspendModal] = useState(null);
  const [reason, setReason] = useState("");

  const { users, total, totalPages, status } = useSelector((s) => s.user);
  const loading = status === ASYNC_STATUS.LOADING;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadUsers = useCallback(() => {
    dispatch(
      adminFetchUsers({
        search: searchTerm,
        role: activeRole,
        status: statusFilter,
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
      }),
    );
  }, [searchTerm, activeRole, statusFilter, currentPage, dispatch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // ─── Status actions ───────────────────────────────────────────
  const handleApprove = async (userId) => {
    setActionLoadingId(userId);
    await dispatch(adminApproveUser(userId));
    setActionLoadingId(null);
    loadUsers();
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal) return;
    setActionLoadingId(rejectModal.userId);
    await dispatch(adminRejectUser({ userId: rejectModal.userId, reason }));
    setActionLoadingId(null);
    setRejectModal(null);
    setReason("");
    loadUsers();
  };

  const handleSuspendSubmit = async () => {
    if (!suspendModal) return;
    setActionLoadingId(suspendModal.userId);
    await dispatch(adminSuspendUser({ userId: suspendModal.userId, reason }));
    setActionLoadingId(null);
    setSuspendModal(null);
    setReason("");
    loadUsers();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Manage Users"
          description="View and manage all platform users"
          icon={Users}
        />
        <button
          onClick={() => navigate("/admin/users/create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0 overflow-x-auto">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(setActiveRole)(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-[1px] whitespace-nowrap ${
              activeRole === tab.key
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, organisation, location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:ring-2 focus:ring-purple-500 outline-none min-w-[150px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        {loading ? (
          "Loading..."
        ) : total > 0 ? (
          <>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, total)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{total}</span>{" "}
            users
          </>
        ) : (
          "No users found"
        )}
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "User",
                    "Role",
                    "Status",
                    "Phone",
                    "Location",
                    "Joined",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const RoleIcon = roleIcon(u.role);
                  const userStatus = u.status || "pending";
                  const isActioning = actionLoadingId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {(u.first_name || "U")}
                              
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {u.first_name} {u.last_name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${roleBadge(u.role)}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {u.role
                            ? u.role.charAt(0).toUpperCase() + u.role.slice(1)
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge(userStatus)}`}
                        >
                          {userStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {u.phone_number || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {u.location || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("en-AU", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          {isActioning ? (
                            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                          ) : (
                            <>
                              {/* pending → Approve / Reject */}
                              {userStatus === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(u.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectModal({ userId: u.id })}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {/* approved → Suspend */}
                              {userStatus === "approved" && (
                                <button
                                  onClick={() => setSuspendModal({ userId: u.id })}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                                  title="Suspend"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Suspend
                                </button>
                              )}
                              {/* suspended → Approve (re-approve) */}
                              {userStatus === "suspended" && (
                                <button
                                  onClick={() => handleApprove(u.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                              )}
                              {/* rejected → Approve */}
                              {userStatus === "rejected" && (
                                <button
                                  onClick={() => handleApprove(u.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                              )}
                              {/* Always: View + Edit */}
                              <button
                                onClick={() => navigate(`/admin/users/${u.id}`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                              <button
                                onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                title="Edit user"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-purple-600 text-white shadow-sm"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Reject Modal ────────────────────────────────────────── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Reject User</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to reject this user? You can optionally
              provide a reason.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (optional)..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-purple-400 outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectModal(null); setReason(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoadingId === rejectModal.userId}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoadingId === rejectModal.userId && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Reject User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Suspend Modal ───────────────────────────────────────── */}
      {suspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Suspend User</h3>
            <p className="text-sm text-slate-500">
              This user will be suspended and will not be able to access the
              platform.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for suspension (optional)..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-purple-400 outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setSuspendModal(null); setReason(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendSubmit}
                disabled={actionLoadingId === suspendModal.userId}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoadingId === suspendModal.userId && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
