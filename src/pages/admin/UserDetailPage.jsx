import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Globe,
  Hash,
  Briefcase,
  Heart,
  Shield,
  CheckCircle2,
  XCircle,
  Target,
  Users as UsersIcon,
  BadgeCheck,
  Pencil,
  CheckCircle,
  Ban,
  Power,
  PowerOff,
} from "lucide-react";
import {
  adminFetchUser,
  adminApproveUser,
  adminRejectUser,
  adminSuspendUser,
  adminDeactivateUser,
  adminActivateUser,
} from "../../store/actions/userActions";
import { clearSelectedUser } from "../../store/slices/userSlice";
import { ASYNC_STATUS } from "../../constants";

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-700 font-medium break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

const roleMeta = {
  provider: {
    icon: Briefcase,
    gradient: "from-purple-500 to-pink-500",
    label: "Service Provider",
    chip: "bg-purple-50 text-purple-700 border-purple-100",
  },
  participant: {
    icon: Heart,
    gradient: "from-blue-500 to-cyan-500",
    label: "Participant",
    chip: "bg-blue-50 text-blue-700 border-blue-100",
  },
  admin: {
    icon: Shield,
    gradient: "from-slate-700 to-slate-900",
    label: "Administrator",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const statusColors = {
  active: {
    bg: "bg-emerald-400/20",
    text: "text-emerald-50",
    border: "border-emerald-300/30",
    dot: "bg-emerald-400",
    cardBg: "bg-emerald-50",
    cardText: "text-emerald-700",
    cardBorder: "border-emerald-200",
  },
  pending: {
    bg: "bg-amber-400/20",
    text: "text-amber-50",
    border: "border-amber-300/30",
    dot: "bg-amber-400",
    cardBg: "bg-amber-50",
    cardText: "text-amber-700",
    cardBorder: "border-amber-200",
  },
  suspended: {
    bg: "bg-red-400/20",
    text: "text-red-50",
    border: "border-red-300/30",
    dot: "bg-red-400",
    cardBg: "bg-red-50",
    cardText: "text-red-700",
    cardBorder: "border-red-200",
  },
  rejected: {
    bg: "bg-rose-400/20",
    text: "text-rose-50",
    border: "border-rose-300/30",
    dot: "bg-rose-400",
    cardBg: "bg-rose-50",
    cardText: "text-rose-700",
    cardBorder: "border-rose-200",
  },
  inactive: {
    bg: "bg-slate-400/20",
    text: "text-slate-200",
    border: "border-slate-300/30",
    dot: "bg-slate-400",
    cardBg: "bg-slate-50",
    cardText: "text-slate-600",
    cardBorder: "border-slate-200",
  },
};

const getStatusLabel = (user) => {
  if (user.status) return user.status;
  if (user.is_active === false) return "inactive";
  return "active";
};

const UserDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedUser: user, selectedUserStatus } = useSelector(
    (s) => s.user,
  );
  const loading = selectedUserStatus === ASYNC_STATUS.LOADING;

  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (id) dispatch(adminFetchUser(id));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [id, dispatch]);

  // ─── Action handlers ──────────────────────────────────────────
  const handleApprove = async () => {
    setActionLoading(true);
    await dispatch(adminApproveUser(id));
    dispatch(adminFetchUser(id));
    setActionLoading(false);
  };

  const handleActivate = async () => {
    setActionLoading(true);
    await dispatch(adminActivateUser(id));
    dispatch(adminFetchUser(id));
    setActionLoading(false);
  };

  const handleRejectSubmit = async () => {
    setActionLoading(true);
    await dispatch(adminRejectUser({ userId: id, reason }));
    dispatch(adminFetchUser(id));
    setActionLoading(false);
    setRejectModal(false);
    setReason("");
  };

  const handleSuspendSubmit = async () => {
    setActionLoading(true);
    await dispatch(adminSuspendUser({ userId: id, reason }));
    dispatch(adminFetchUser(id));
    setActionLoading(false);
    setSuspendModal(false);
    setReason("");
  };

  const handleDeactivateSubmit = async () => {
    setActionLoading(true);
    await dispatch(adminDeactivateUser({ userId: id, reason }));
    dispatch(adminFetchUser(id));
    setActionLoading(false);
    setDeactivateModal(false);
    setReason("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <p className="text-slate-500">User not found.</p>
        </div>
      </div>
    );
  }

  const meta = roleMeta[user.role] || roleMeta.admin;
  const RoleIcon = meta.icon;
  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userStatus = getStatusLabel(user);
  const sc = statusColors[userStatus] || statusColors.active;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <button
          onClick={() => navigate(`/admin/users/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          <Pencil className="w-4 h-4" />
          Edit User
        </button>
      </div>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div
          className={`bg-gradient-to-r ${meta.gradient} px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5`}
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 border border-white/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-white">
            <h1 className="text-2xl font-bold truncate">{user.name}</h1>
            <p className="text-white/80 text-sm truncate flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white border border-white/30">
                <RoleIcon className="w-3 h-3" />
                {meta.label}
              </span>
              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${sc.bg} ${sc.text} ${sc.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {userStatus}
              </span>
              {user.email_verified_at ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-50 border border-emerald-300/30">
                  <BadgeCheck className="w-3 h-3" /> Email Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-50 border border-amber-300/30">
                  <XCircle className="w-3 h-3" /> Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Basic info grid */}
        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 border-b border-slate-100">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone_number} />
          <InfoRow icon={MapPin} label="Location" value={user.location} />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={
              user.created_at
                ? new Date(user.created_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null
            }
          />
          <InfoRow
            icon={Calendar}
            label="Last Updated"
            value={
              user.updated_at
                ? new Date(user.updated_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null
            }
          />
          <InfoRow icon={Hash} label="User ID" value={`#${user.id}`} />
        </div>

        {/* Provider profile */}
        {user.provider_profile && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" /> Provider Profile
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <InfoRow
                icon={Building2}
                label="Organisation Name"
                value={user.provider_profile.organisation_name}
              />
              <InfoRow
                icon={Hash}
                label="ABN"
                value={user.provider_profile.abn}
              />
              {user.provider_profile.website && (
                <InfoRow
                  icon={Globe}
                  label="Website"
                  value={user.provider_profile.website}
                />
              )}
              <InfoRow
                icon={
                  user.provider_profile.is_ndis_registered
                    ? CheckCircle2
                    : XCircle
                }
                label="NDIS Registered"
                value={
                  user.provider_profile.is_ndis_registered ? "Yes" : "No"
                }
              />
            </div>

            {user.provider_profile.about_services && (
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  About Services
                </p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {user.provider_profile.about_services}
                </p>
              </div>
            )}

            {user.provider_profile.categories?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Service Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.provider_profile.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium border border-purple-100"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Participant profile */}
        {user.participant_profile && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-500" /> Participant Profile
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <InfoRow
                icon={Hash}
                label="NDIS Number"
                value={user.participant_profile.ndis_number}
              />
              <InfoRow
                icon={Heart}
                label="Primary Disability"
                value={user.participant_profile.primary_disability}
              />
              <InfoRow
                icon={UsersIcon}
                label="Support Coordinator"
                value={user.participant_profile.support_coordinator_name}
              />
              <InfoRow
                icon={Phone}
                label="Coordinator Phone"
                value={user.participant_profile.support_coordinator_phone}
              />
              <InfoRow
                icon={Mail}
                label="Coordinator Email"
                value={user.participant_profile.support_coordinator_email}
              />
            </div>

            {user.participant_profile.ndis_goals && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> NDIS Goals
                </p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {user.participant_profile.ndis_goals}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Status Management Panel ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-500" /> Account Status
          Management
        </h2>

        {/* Current status card */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border mb-5 ${sc.cardBg} ${sc.cardBorder}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${sc.dot} flex-shrink-0`}
            />
            <div>
              <p className={`text-sm font-semibold capitalize ${sc.cardText}`}>
                {userStatus}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {userStatus === "active" &&
                  "This user has full access to the platform. You can deactivate or suspend them."}
                {userStatus === "pending" &&
                  "New registration — awaiting your approval before this user can access the platform."}
                {userStatus === "suspended" &&
                  "This user was suspended due to a policy violation or bad behaviour. You can re-activate them."}
                {userStatus === "rejected" &&
                  "This user's registration was rejected. You can still activate them if needed."}
                {userStatus === "inactive" &&
                  "This user's account has been temporarily deactivated. You can re-activate them."}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {actionLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              Processing...
            </div>
          ) : (
            <>
              {/* Approve — for pending users */}
              {userStatus === "pending" && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve User
                </button>
              )}

              {/* Reject — for pending users */}
              {userStatus === "pending" && (
                <button
                  onClick={() => setRejectModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Reject User
                </button>
              )}

              {/* Deactivate — for active users (temporary disable) */}
              {userStatus === "active" && (
                <button
                  onClick={() => setDeactivateModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <PowerOff className="w-4 h-4" />
                  Deactivate
                </button>
              )}

              {/* Suspend — for active users (bad behaviour / violation) */}
              {userStatus === "active" && (
                <button
                  onClick={() => setSuspendModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Ban className="w-4 h-4" />
                  Suspend User
                </button>
              )}

              {/* Activate — for suspended / rejected / inactive */}
              {(userStatus === "suspended" ||
                userStatus === "rejected" ||
                userStatus === "inactive") && (
                <button
                  onClick={handleActivate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Power className="w-4 h-4" />
                  Activate User
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Reject Modal ────────────────────────────────────────── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Reject User</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to reject{" "}
              <span className="font-semibold text-slate-700">{user.name}</span>?
              You can optionally provide a reason.
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
                onClick={() => {
                  setRejectModal(false);
                  setReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && (
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
              <span className="font-semibold text-slate-700">{user.name}</span>{" "}
              will be suspended due to policy violation or bad behaviour and will
              not be able to access the platform.
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
                onClick={() => {
                  setSuspendModal(false);
                  setReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendSubmit}
                disabled={actionLoading}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Deactivate Modal ────────────────────────────────────── */}
      {deactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              Deactivate User
            </h3>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{user.name}</span>{" "}
              will be temporarily deactivated. They will not be able to access
              the platform until re-activated by an admin.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for deactivation (optional)..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-purple-400 outline-none resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeactivateModal(false);
                  setReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateSubmit}
                disabled={actionLoading}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
