import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  adminFetchSubscriptions,
  adminCreateSubscription,
  adminUpdateSubscription,
  adminDeleteSubscription,
} from "../../store/actions/subscriptionActions";
import { ASYNC_STATUS } from "../../constants";
import { InlineLoader } from "../../components/common/Loader";

const ROLE_OPTIONS = [
  {
    value: "participant",
    label: "Participant",
    icon: UserRound,
    color: "blue",
    description: "Only participants can purchase this plan",
  },
  {
    value: "provider",
    label: "Provider",
    icon: Building2,
    color: "orange",
    description: "Only providers can purchase this plan",
  },
  {
    value: "both",
    label: "Both",
    icon: Users,
    color: "purple",
    description: "Participants and providers can purchase this plan",
  },
];

const BILLING_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  billing_cycle: "monthly",
  role: "both",
  features: "",
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
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${palette[opt.color]}`}
    >
      <Icon className="w-3 h-3" /> {opt.label}
    </span>
  );
};

const ManageSubscriptionsPage = () => {
  const dispatch = useDispatch();
  const { subscriptions, status } = useSelector((state) => state.subscription);
  const loading = status === ASYNC_STATUS.LOADING;

  // List state
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadSubscriptions = useCallback(() => {
    dispatch(adminFetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

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

  // ─── Modal handlers ─────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (sub) => {
    setEditingId(sub.id);
    const featuresStr = Array.isArray(sub.features)
      ? sub.features.join("\n")
      : sub.features || "";
    setFormData({
      name: sub.name || "",
      description: sub.description || "",
      price: sub.price ?? "",
      billing_cycle: sub.billing_cycle || "monthly",
      role: sub.role || "both",
      features: featuresStr,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Subscription name is required";
    }
    if (formData.price === "" || formData.price === null) {
      errors.price = "Price is required";
    } else if (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = "Price must be a positive number";
    }
    if (!formData.role) {
      errors.role = "Please select who can purchase this subscription";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const featuresArr = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

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
        await dispatch(
          adminUpdateSubscription({ id: editingId, subscriptionData: payload }),
        ).unwrap();
      } else {
        await dispatch(adminCreateSubscription(payload)).unwrap();
      }

      closeModal();
      loadSubscriptions();
    } catch {
      // Errors toasted via action
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete handler ─────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteSubscription(deleteId)).unwrap();
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

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

      {/* ─── Filters ──────────────────────────────────────────── */}
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

      {/* ─── Count ────────────────────────────────────────────── */}
      <p className="text-sm text-slate-500">
        {loading
          ? "Loading..."
          : `${filteredSubs.length} ${
              filteredSubs.length === 1 ? "subscription" : "subscriptions"
            } found`}
      </p>

      {/* ─── Subscriptions Table ──────────────────────────────── */}
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
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    ID
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Price
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Billing
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Eligible Role
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      #{sub.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {sub.name}
                      </p>
                      {sub.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                          {sub.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      ${Number(sub.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                      {sub.billing_cycle || "—"}
                    </td>
                    <td className="px-6 py-4">{roleBadge(sub.role)}</td>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(sub.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* ─── Create / Edit Modal ─────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Subscription" : "Create Subscription"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Growth & Referral"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                    formErrors.name
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Short description shown to users on the subscription page"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Price & Billing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                        formErrors.price
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200"
                      }`}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="billing_cycle"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Billing Cycle
                  </label>
                  <select
                    id="billing_cycle"
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                  >
                    {BILLING_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Who can purchase this plan?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = formData.role === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: opt.value }))
                        }
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                          active
                            ? "border-purple-500 bg-purple-50 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            active
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              active ? "text-purple-700" : "text-slate-800"
                            }`}
                          >
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formErrors.role && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <label
                  htmlFor="features"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Features
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    (one per line)
                  </span>
                </label>
                <textarea
                  id="features"
                  name="features"
                  rows={5}
                  value={formData.features}
                  onChange={handleFormChange}
                  placeholder={"Access to events calendar\nProvider message board\nPriority advertising"}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none font-mono"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <InlineLoader className="text-white" />{" "}
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingId ? "Update Subscription" : "Create Subscription"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Subscription?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The subscription plan will be
                permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptionsPage;
