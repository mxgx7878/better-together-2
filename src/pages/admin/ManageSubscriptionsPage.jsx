import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CreditCard,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  UserRound,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Eye,
  ArrowRight,
  Mail,
  Phone,
  Lock,
  Receipt,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  adminFetchSubscriptions,
  adminCreateSubscription,
  adminUpdateSubscription,
  adminDeleteSubscription,
  adminFetchPlanSubscribers,
} from "../../store/actions/subscriptionActions";
import {
  clearPlanSubscribers,
  selectPlanSubscribers,
  selectPlanSubscribersStatus,
} from "../../store/slices/subscriptionSlice";
import { adminFetchFeatures } from "../../store/actions/featuresActions";
import { ASYNC_STATUS } from "../../constants";

const ROLE_OPTIONS = [
  { value: "participant", label: "Participant", icon: UserRound, color: "blue",   description: "Only participants can purchase this plan" },
  { value: "provider",    label: "Provider",    icon: Building2, color: "orange", description: "Only providers can purchase this plan" },
  { value: "both",        label: "Both",        icon: Users,     color: "purple", description: "Participants and providers can purchase this plan" },
];

const BILLING_OPTIONS = [
  { value: "monthly",  label: "Monthly" },
  { value: "yearly",   label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  billing_cycle: "monthly",
  role: "both",
  features: {},
  status: 1,
};

const roleBadge = (role) => {
  const opt = ROLE_OPTIONS.find((r) => r.value === role);
  if (!opt) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
        Unknown
      </span>
    );
  }
  const Icon = opt.icon;
  const palette = {
    blue:   "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${palette[opt.color]}`}>
      <Icon className="w-3 h-3" /> {opt.label}
    </span>
  );
};

const formatDate = (s) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch { return s; }
};

const ManageSubscriptionsPage = () => {
  const dispatch = useDispatch();
  const { subscriptions, status } = useSelector((state) => state.subscription);
  const { features: allFeatures, status: featuresStatus } = useSelector((state) => state.feature);
  const planSubscribers = useSelector(selectPlanSubscribers);
  const planSubscribersStatus = useSelector(selectPlanSubscribersStatus);
  const loading = status === ASYNC_STATUS.LOADING;

  // List state
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm,  setSearchTerm]  = useState("");
  const [roleFilter,  setRoleFilter]  = useState("all");

  // Create/Edit modal
  const [showModal,  setShowModal]  = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [formData,   setFormData]   = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete state — now holds the full plan object so we can show counts
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [migrateToPlanId, setMigrateToPlanId] = useState("");
  const [deleting, setDeleting] = useState(false);

  // View Subscribers modal
  const [viewSubscribersPlan, setViewSubscribersPlan] = useState(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadSubscriptions = useCallback(() => {
    dispatch(adminFetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    loadSubscriptions();
    dispatch(adminFetchFeatures({ status: 1 }));
  }, [loadSubscriptions, dispatch]);

  // Filter client-side
  const filteredSubs = subscriptions.filter((sub) => {
    if (roleFilter !== "all" && sub.role !== roleFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      sub.name?.toLowerCase().includes(q) ||
      sub.description?.toLowerCase().includes(q)
    );
  });

  // Compatible features for the currently-selected role
  const compatibleFeatures = useMemo(() => {
    if (!Array.isArray(allFeatures)) return [];
    if (formData.role === "both") return allFeatures;
    return allFeatures.filter((f) => f.type === formData.role || f.type === "both");
  }, [allFeatures, formData.role]);

  // ─── Modal handlers (create / edit) ─────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (sub) => {
    setEditingId(sub.id);
    const featuresMap = {};
    if (Array.isArray(sub.features)) {
      sub.features.forEach((f) => {
        if (typeof f === "object" && f.id) {
          featuresMap[f.id] = { selected: true, value: f.value ?? "" };
        }
      });
    }
    setFormData({
      name: sub.name || "",
      description: sub.description || "",
      price: sub.price ?? "",
      billing_cycle: sub.billing_cycle || "monthly",
      role: sub.role || "both",
      features: featuresMap,
      status: sub.status ?? 1,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleFeature = (featureId) => {
    setFormData((prev) => {
      const fs = { ...prev.features };
      if (fs[featureId]) {
        delete fs[featureId];
      } else {
        fs[featureId] = { selected: true, value: "" };
      }
      return { ...prev, features: fs };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Subscription name is required";
    if (formData.price === "" || Number(formData.price) < 0)
      errors.price = "Price must be 0 or higher";
    if (!ROLE_OPTIONS.find((r) => r.value === formData.role))
      errors.role = "Please select who can purchase this subscription";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const featuresArr = Object.entries(formData.features).map(([id, meta]) => {
        const out = { id: Number(id) };
        if (meta.value && meta.value.trim()) out.value = meta.value.trim();
        return out;
      });

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        billing_cycle: formData.billing_cycle,
        role: formData.role,
        features: featuresArr,
        status: Number(formData.status),
      };

      if (editingId) {
        await dispatch(adminUpdateSubscription({ id: editingId, subscriptionData: payload })).unwrap();
      } else {
        await dispatch(adminCreateSubscription(payload)).unwrap();
      }
      closeModal();
      loadSubscriptions();
    } catch {
      /* toasted by action */
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete handlers ─────────────────────────────────────────────
  const openDeleteModal = (sub) => {
    setDeleteTarget(sub);
    setMigrateToPlanId("");
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setMigrateToPlanId("");
  };

  const dependencyCount = (sub) =>
    (sub?.active_subscriber_count || 0) +
    (sub?.pending_subscriber_count || 0) +
    (sub?.invoice_count || 0);

  const requiresMigration = deleteTarget && dependencyCount(deleteTarget) > 0;

  // Plans available as migration targets — exclude self, only active, role-compatible
  const migrationTargets = useMemo(() => {
    if (!deleteTarget) return [];
    return subscriptions.filter((p) => {
      if (p.id === deleteTarget.id) return false;
      if (Number(p.status) !== 1) return false;
      // Role compatibility: target must accept users of deleted plan's role
      if (deleteTarget.role === "both") return true;
      return p.role === deleteTarget.role || p.role === "both";
    });
  }, [subscriptions, deleteTarget]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (requiresMigration && !migrateToPlanId) return;

    setDeleting(true);
    try {
      await dispatch(
        adminDeleteSubscription({
          id: deleteTarget.id,
          migrate_to_plan_id: migrateToPlanId || null,
        }),
      ).unwrap();
      closeDeleteModal();
      loadSubscriptions();
    } catch {
      /* toasted by action */
    } finally {
      setDeleting(false);
    }
  };

  // ─── View Subscribers handlers ──────────────────────────────────
  const openSubscribersModal = (sub) => {
    setViewSubscribersPlan(sub);
    dispatch(adminFetchPlanSubscribers({ planId: sub.id }));
  };

  const closeSubscribersModal = () => {
    setViewSubscribersPlan(null);
    dispatch(clearPlanSubscribers());
  };

  const selectedFeatureCount = Object.keys(formData.features).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Subscriptions"
        description="Create, edit, and manage subscription plans for participants and providers"
        icon={CreditCard}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" /> Create Subscription
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions by name or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        >
          <option value="all">All Roles</option>
          <option value="participant">Participant Only</option>
          <option value="provider">Provider Only</option>
          <option value="both">Both</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        {loading
          ? "Loading..."
          : `${filteredSubs.length} ${filteredSubs.length === 1 ? "subscription" : "subscriptions"} found`}
      </p>

      {/* Subscriptions Table */}
      {loading && subscriptions.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : filteredSubs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No subscriptions found</p>
          <p className="text-sm text-slate-400 mt-1">
            {searchTerm || roleFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first subscription plan to get started"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">ID</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Price</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Billing</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Eligible Role</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Subscribers</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.map((sub) => {
                  const isFree = Number(sub.price) === 0;
                  const activeCount = sub.active_subscriber_count || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">#{sub.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">{sub.name}</p>
                        {sub.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{sub.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {isFree ? "Free" : `$${Number(sub.price).toFixed(0)}`}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 capitalize">{sub.billing_cycle}</td>
                      <td className="px-6 py-4">{roleBadge(sub.role)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openSubscribersModal(sub)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-purple-700 transition-colors"
                          title="View subscribers"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {activeCount}
                          {sub.pending_subscriber_count > 0 && (
                            <span className="text-amber-600">+{sub.pending_subscriber_count}</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {Number(sub.status) === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openSubscribersModal(sub)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View subscribers"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(sub)}
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(sub)}
                            disabled={isFree}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            title={isFree ? "Free plan cannot be deleted" : "Delete"}
                          >
                            {isFree ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
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

      {/* ─── Create / Edit Modal ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Subscription" : "Create Subscription"}
              </h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Plan name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none ${formErrors.name ? "border-red-300" : "border-slate-200"}`}
                  placeholder="e.g. Growth & Referral"
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  placeholder="Short tagline shown to users"
                />
              </div>

              {/* Price + Billing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">Price ($)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none ${formErrors.price ? "border-red-300" : "border-slate-200"}`}
                    placeholder="0"
                  />
                  {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
                </div>
                <div>
                  <label htmlFor="billing_cycle" className="block text-sm font-semibold text-slate-700 mb-1.5">Billing cycle</label>
                  <select
                    id="billing_cycle"
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {BILLING_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Eligible role</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = formData.role === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setFormData((p) => ({ ...p, role: opt.value }))}
                        className={`text-left p-3 border-2 rounded-xl transition-all ${selected ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-200"}`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${selected ? "text-purple-600" : "text-slate-500"}`} />
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{opt.description}</p>
                      </button>
                    );
                  })}
                </div>
                {formErrors.role && <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Features <span className="text-slate-400 font-normal">({selectedFeatureCount} selected)</span>
                </label>
                {featuresStatus === ASYNC_STATUS.LOADING ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1.5 bg-slate-50">
                    {compatibleFeatures.length === 0 ? (
                      <p className="text-xs text-slate-500 px-2 py-3 text-center">No features available for this role.</p>
                    ) : (
                      compatibleFeatures.map((f) => {
                        const isSelected = !!formData.features[f.id];
                        return (
                          <div
                            key={f.id}
                            onClick={() => toggleFeature(f.id)}
                            className={`flex items-center justify-between gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-purple-50 border border-purple-200" : "bg-white border border-slate-100 hover:bg-purple-50/40"}`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleFeature(f.id)}
                                className="w-4 h-4 text-purple-600 rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800">{f.name}</p>
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  f.type === "participant" ? "bg-purple-100 text-purple-700" :
                                  f.type === "provider"    ? "bg-orange-100 text-orange-700" :
                                                             "bg-blue-100 text-blue-700"
                                }`}>{f.type}</span>
                              </div>
                            </label>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-md disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Subscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal — with optional migration ───── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                requiresMigration ? "bg-amber-100" : "bg-red-100"
              }`}>
                {requiresMigration
                  ? <AlertTriangle className="w-5 h-5 text-amber-600" />
                  : <Trash2 className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800">
                  {requiresMigration ? "Migrate users & delete?" : "Delete subscription?"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  You're about to permanently delete <strong>{deleteTarget.name}</strong>.
                </p>
              </div>
            </div>

            {requiresMigration && (
              <>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4 space-y-1.5 text-xs text-amber-900">
                  {deleteTarget.active_subscriber_count > 0 && (
                    <p className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      <strong>{deleteTarget.active_subscriber_count}</strong>
                      active subscriber{deleteTarget.active_subscriber_count === 1 ? "" : "s"} on this plan
                    </p>
                  )}
                  {deleteTarget.pending_subscriber_count > 0 && (
                    <p className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <strong>{deleteTarget.pending_subscriber_count}</strong>
                      scheduled change{deleteTarget.pending_subscriber_count === 1 ? "" : "s"} pointing here
                    </p>
                  )}
                  {deleteTarget.invoice_count > 0 && (
                    <p className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5" />
                      <strong>{deleteTarget.invoice_count}</strong>
                      historical invoice{deleteTarget.invoice_count === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Migrate everyone (and invoices) to:
                </label>
                <select
                  value={migrateToPlanId}
                  onChange={(e) => setMigrateToPlanId(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none mb-2"
                >
                  <option value="">— Select a target plan —</option>
                  {migrationTargets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({Number(p.price) === 0 ? "Free" : `$${Number(p.price).toFixed(0)}/${p.billing_cycle}`})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mb-4 flex items-start gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  Every migrated user will be emailed automatically about the change.
                </p>

                {migrationTargets.length === 0 && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 mb-3 text-xs text-red-700">
                    No compatible active plans available as migration target. Create one first (or activate an existing one).
                  </div>
                )}
              </>
            )}

            {!requiresMigration && (
              <p className="text-sm text-slate-500 mb-4">
                This action cannot be undone.
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || (requiresMigration && !migrateToPlanId)}
                className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed ${
                  requiresMigration
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {requiresMigration ? "Migrate & Delete" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Subscribers List Modal ─────────────────────────────────── */}
      {viewSubscribersPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-800 truncate">
                  Subscribers — {viewSubscribersPlan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active users plus anyone scheduled to switch onto this plan
                </p>
              </div>
              <button onClick={closeSubscribersModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {planSubscribersStatus === ASYNC_STATUS.LOADING ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              ) : planSubscribers.items.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No subscribers yet</p>
                  <p className="text-xs text-slate-400 mt-1">No users are on this plan or scheduled to move to it.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {planSubscribers.items.map((s) => (
                    <div key={s.id} className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 flex-wrap">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                        {(s.user?.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 truncate">{s.user?.name || "Unknown user"}</p>
                          <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            s.user?.role === "provider"
                              ? "bg-orange-50 text-orange-700"
                              : s.user?.role === "participant"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                          }`}>{s.user?.role || "—"}</span>
                          {s.is_pending_change && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                              Scheduled change
                            </span>
                          )}
                          {s.cancelled_at && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{s.user?.email}</span>
                          {s.user?.phone_number && (
                            <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{s.user.phone_number}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {s.current_period_end ? <>Period ends {formatDate(s.current_period_end)} · </> : null}
                          Joined {formatDate(s.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-right">
              <button onClick={closeSubscribersModal} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptionsPage;