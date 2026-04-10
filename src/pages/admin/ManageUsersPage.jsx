import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Briefcase,
  Heart,
  Loader2,
  X,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Globe,
  Hash,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  adminFetchUsers,
  adminFetchUser,
} from "../../store/actions/userActions";
import { clearSelectedUser } from "../../store/slices/userSlice";
import { ASYNC_STATUS } from "../../constants";

const ITEMS_PER_PAGE = 8;

const ROLE_TABS = [
  { key: "all", label: "All Users", icon: Users },
  { key: "provider", label: "Providers", icon: Briefcase },
  { key: "participant", label: "Participants", icon: Heart },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All Status" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const TIER_OPTIONS = [
  { key: "all", label: "All Plans" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Paid" },
];

// ─── User Detail Modal ───────────────────────────────────────────
const UserDetailModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { selectedUser: u, selectedUserStatus } = useSelector((s) => s.user);
  const loading = selectedUserStatus === ASYNC_STATUS.LOADING;

  console.log(loading   ? "Loading user details..."    : u ? "User details loaded:" : "No user selected", u); 

  const handleClose = () => {
    dispatch(clearSelectedUser());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            User Details
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
          </div>
        ) : !u ? null : (
          <div className="p-6 space-y-5">
            {/* Avatar + basic */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800">
                  {u.name}
                </p>
                <p className="text-sm text-slate-500">{u.email}</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    u.role === "provider"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {u.role === "provider" ? (
                    <Briefcase className="w-3 h-3" />
                  ) : (
                    <Heart className="w-3 h-3" />
                  )}
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </span>
              </div>
            </div>

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              {u.phone_number && (
                <InfoItem icon={Phone} label="Phone" value={u.phone_number} />
              )}
              {u.location && (
                <InfoItem icon={MapPin} label="Location" value={u.location} />
              )}
              <InfoItem
                icon={Calendar}
                label="Joined"
                value={new Date(u.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>

            {/* Provider Profile */}
            {u.provider_profile && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Provider Profile
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    icon={Building2}
                    label="Organisation"
                    value={u.provider_profile.organisation_name}
                  />
                  <InfoItem
                    icon={Hash}
                    label="ABN"
                    value={u.provider_profile.abn}
                  />
                  {u.provider_profile.website && (
                    <InfoItem
                      icon={Globe}
                      label="Website"
                      value={u.provider_profile.website}
                    />
                  )}
                  <InfoItem
                    label="NDIS Registered"
                    value={u.provider_profile.is_ndis_registered ? "Yes" : "No"}
                  />
                </div>
                {u.provider_profile.about_services && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      About Services
                    </p>
                    <p className="text-sm text-slate-600">
                      {u.provider_profile.about_services}
                    </p>
                  </div>
                )}
                {u.provider_profile.categories?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">
                      Service Categories
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {u.provider_profile.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Participant Profile */}
            {u.participant_profile && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Participant Profile
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="NDIS Number"
                    value={u.participant_profile.ndis_number}
                  />
                  <InfoItem
                    label="Primary Disability"
                    value={u.participant_profile.primary_disability}
                  />
                  <InfoItem
                    label="Support Coordinator"
                    value={u.participant_profile.support_coordinator_name}
                  />
                </div>
                {u.participant_profile.ndis_goals && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">NDIS Goals</p>
                    <p className="text-sm text-slate-600">
                      {u.participant_profile.ndis_goals}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-xs text-slate-400 flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </p>
    <p className="text-sm font-medium text-slate-700 mt-0.5 truncate">
      {value}
    </p>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────
const ManageUsersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { users, total, totalPages, status, selectedUserStatus } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const loading = status === ASYNC_STATUS.LOADING;
  const viewingUser = selectedUserStatus === ASYNC_STATUS.LOADING 

  const loadUsers = useCallback(() => {
    console.log({
      searchTerm,
      activeRole,
      statusFilter,
      tierFilter,
      currentPage,
    });
    dispatch(
      adminFetchUsers({
        // search: searchTerm,
        // role: activeRole,
        // status: statusFilter,
        // tier: tierFilter,
        // page: currentPage,
        // limit: ITEMS_PER_PAGE,
      }),
    );
  }, [searchTerm, activeRole, statusFilter, tierFilter, currentPage, dispatch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleViewUser = (userId) => {
    dispatch(adminFetchUser(userId));
    setViewModalOpen(true);
  };

  const roleCounts = {
    all: total,
    provider: users?.filter((u) => u.role === "provider").length || 0,
    participant: users?.filter((u) => u.role === "participant").length || 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Users"
        description="View and manage all platform users"
        icon={Users}
      />

      {/* Role Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(setActiveRole)(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-[1px] ${
              activeRole === tab.key
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                activeRole === tab.key
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {roleCounts[tab.key]}
            </span>
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
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:ring-2 focus:ring-purple-500 outline-none min-w-[130px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => handleFilterChange(setTierFilter)(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:ring-2 focus:ring-purple-500 outline-none min-w-[130px]"
        >
          {TIER_OPTIONS.map((opt) => (
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
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, total)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{total}</span>{" "}
            users
          </>
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
                  {["User", "Role", "Location", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === "Actions" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.role === "provider"
                            ? "bg-purple-50 text-purple-700"
                            : u.role === "admin"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {u.role === "provider" ? (
                          <Briefcase className="w-3 h-3" />
                        ) : (
                          <Heart className="w-3 h-3" />
                        )}
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">
                        {u.location || "—"}
                      </p>
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-500">
                        {new Date(u.created_at).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewUser(u.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                          title="Deactivate"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-purple-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && (
        <UserDetailModal onClose={() => setViewModalOpen(false)} />
      )}
    </div>
  );
};

export default ManageUsersPage;
