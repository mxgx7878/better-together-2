import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  Plus,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Hash,
  FileText,
  Heart,
  Shield,
} from "lucide-react";
import {
  adminFetchUser,
  adminCreateUser,
  adminUpdateUser,
} from "../../store/actions/userActions";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { clearSelectedUser } from "../../store/slices/userSlice";
import { ASYNC_STATUS } from "../../constants";
import InputField from "../../components/common/InputField";

// ─── Form field wrapper ─────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm outline-none transition-colors placeholder:text-slate-300 ${
    err
      ? "border-red-300 focus:border-red-400"
      : "border-slate-100 focus:border-purple-400 focus:bg-white"
  }`;

// ─── Initial empty form ─────────────────────────────────────────
const EMPTY_FORM = {
  role: "participant",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone_number: "",
  location: "",
  // Provider fields
  organisation_name: "",
  abn: "",
  website: "",
  is_ndis_registered: false,
  about_services: "",
  categories: [],
  // Participant fields
  ndis_number: "",
  primary_disability: "",
  support_coordinator_name: "",
  support_coordinator_phone: "",
  support_coordinator_email: "",
  ndis_goals: "",
};

const UserFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { selectedUser, selectedUserStatus } = useSelector((s) => s.user);
  const { publicCategories } = useSelector((s) => s.category);
  const categoriesLoading =
    useSelector((s) => s.category.status) === ASYNC_STATUS.LOADING;

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const loading = selectedUserStatus === ASYNC_STATUS.LOADING;

  // Fetch categories for provider role selection
  useEffect(() => {
    dispatch(fetchPublicCategories());
  }, [dispatch]);

  // Fetch user data if editing
  useEffect(() => {
    if (isEditMode) dispatch(adminFetchUser(id));
    return () => dispatch(clearSelectedUser());
  }, [id, isEditMode, dispatch]);

  // Populate form when selectedUser loads (edit mode)
  useEffect(() => {
    if (isEditMode && selectedUser) {
      const u = selectedUser;
      const pp = u.provider_profile;
      const pa = u.participant_profile;
      const nameParts = (u.name || "").split(" ");

      setForm({
        role: u.role || "participant",
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        email: u.email || "",
        password: "",
        password_confirmation: "",
        phone_number: u.phone_number || "",
        location: u.location || "",
        // Provider
        organisation_name: pp?.organisation_name || "",
        abn: pp?.abn || "",
        website: pp?.website || "",
        is_ndis_registered: pp?.is_ndis_registered || false,
        about_services: pp?.about_services || "",
        categories: pp?.categories?.map((c) => c.id) || [],
        // Participant
        ndis_number: pa?.ndis_number || "",
        primary_disability: pa?.primary_disability || "",
        support_coordinator_name: pa?.support_coordinator_name || "",
        support_coordinator_phone: pa?.support_coordinator_phone || "",
        support_coordinator_email: pa?.support_coordinator_email || "",
        ndis_goals: pa?.ndis_goals || "",
      });
    }
  }, [isEditMode, selectedUser]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const toggleCategory = useCallback((catId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }));
  }, []);

  const validate = () => {
    const errs = {};

    if (!form.first_name.trim()) errs.first_name = "First name is required";
    if (!form.last_name.trim()) errs.last_name = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";

    if (!isEditMode) {
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8)
        errs.password = "Password must be at least 8 characters";
      if (form.password !== form.password_confirmation)
        errs.password_confirmation = "Passwords do not match";
    }

    if (!form.phone_number.trim())
      errs.phone_number = "Phone number is required";
    if (!form.location.trim()) errs.location = "Location is required";

    if (form.role === "provider") {
      if (!form.organisation_name.trim())
        errs.organisation_name = "Organisation name is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    // Build payload - only include role-specific fields
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone_number: form.phone_number,
      location: form.location,
    };

    if (!isEditMode) {
      payload.role = form.role;
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    if (form.role === "provider") {
      payload.organisation_name = form.organisation_name;
      payload.abn = form.abn;
      payload.website = form.website;
      payload.is_ndis_registered = form.is_ndis_registered;
      payload.about_services = form.about_services;
      payload.categories = form.categories;
    } else {
      payload.ndis_number = form.ndis_number;
      payload.primary_disability = form.primary_disability;
      payload.support_coordinator_name = form.support_coordinator_name;
      payload.support_coordinator_phone = form.support_coordinator_phone;
      payload.support_coordinator_email = form.support_coordinator_email;
      payload.ndis_goals = form.ndis_goals;
    }

    try {
      if (isEditMode) {
        await dispatch(adminUpdateUser({ id, payload })).unwrap();
      } else {
        await dispatch(adminCreateUser(payload)).unwrap();
      }
      navigate("/admin/users");
    } catch {
      // error toast already fired by thunk
    } finally {
      setSaving(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  const isProvider = form.role === "provider";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit User" : "Create New User"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditMode
              ? `Update details for ${selectedUser?.name || "user"}`
              : "Add a new participant or provider to the platform"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Main form ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role selector (create only) */}
          {!isEditMode && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4">
                User Role
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    key: "participant",
                    label: "Participant",
                    icon: Heart,
                    desc: "NDIS participant or person seeking services",
                  },
                  {
                    key: "provider",
                    label: "Provider",
                    icon: Building2,
                    desc: "Service provider or organisation",
                  },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, role: r.key }))
                    }
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      form.role === r.key
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <r.icon
                        className={`w-5 h-5 ${
                          form.role === r.key
                            ? "text-purple-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          form.role === r.key
                            ? "text-purple-700"
                            : "text-slate-700"
                        }`}
                      >
                        {r.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Personal details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" /> Personal Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="first_name"
                icon={User}
                placeholder="John"
                required
                value={form.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />
              <InputField
                label="Last Name"
                name="last_name"
                icon={User}
                placeholder="Doe"
                required
                value={form.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

            <InputField
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="user@example.com"
              required
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {!isEditMode && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Password" required error={errors.password}>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={inputCls(errors.password)}
                  />
                </Field>
                <Field
                  label="Confirm Password"
                  required
                  error={errors.password_confirmation}
                >
                  <input
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={inputCls(errors.password_confirmation)}
                  />
                </Field>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                name="phone_number"
                type="tel"
                icon={Phone}
                placeholder="04XX XXX XXX"
                required
                value={form.phone_number}
                onChange={handleChange}
                error={errors.phone_number}
              />
              <InputField
                label="Location"
                name="location"
                icon={MapPin}
                placeholder="e.g. Melbourne, VIC"
                required
                value={form.location}
                onChange={handleChange}
                error={errors.location}
              />
            </div>
          </div>

          {/* Provider-specific fields */}
          {isProvider && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-500" /> Provider
                Details
              </h2>

              <InputField
                label="Organisation Name"
                name="organisation_name"
                icon={Building2}
                placeholder="Your company name"
                required
                value={form.organisation_name}
                onChange={handleChange}
                error={errors.organisation_name}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="ABN"
                  name="abn"
                  icon={Hash}
                  placeholder="XX XXX XXX XXX"
                  value={form.abn}
                  onChange={handleChange}
                  error={errors.abn}
                />
                <InputField
                  label="Website"
                  name="website"
                  type="url"
                  icon={Globe}
                  placeholder="https://yoursite.com.au"
                  value={form.website}
                  onChange={handleChange}
                  error={errors.website}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="is_ndis_registered"
                  name="is_ndis_registered"
                  checked={form.is_ndis_registered}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="is_ndis_registered"
                  className="text-sm text-slate-700"
                >
                  NDIS Registered Provider
                </label>
              </div>

              {/* Service categories */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Service Categories
                </label>
                {categoriesLoading && publicCategories.length === 0 ? (
                  <div className="flex items-center justify-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                    <span className="ml-2 text-sm text-slate-500">
                      Loading categories...
                    </span>
                  </div>
                ) : publicCategories.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">
                      No categories available
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {publicCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                          form.categories.includes(cat.id)
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-slate-200 text-slate-600 hover:border-purple-300"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Field label="About Services">
                <textarea
                  name="about_services"
                  value={form.about_services}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief description of the services provided..."
                  className={`${inputCls(false)} resize-none`}
                />
              </Field>
            </div>
          )}

          {/* Participant-specific fields */}
          {!isProvider && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-500" /> Participant Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="NDIS Number"
                  name="ndis_number"
                  icon={FileText}
                  placeholder="XXX XXX XXXX"
                  value={form.ndis_number}
                  onChange={handleChange}
                  error={errors.ndis_number}
                />
                <InputField
                  label="Primary Disability"
                  name="primary_disability"
                  placeholder="e.g. Intellectual, Physical"
                  value={form.primary_disability}
                  onChange={handleChange}
                  error={errors.primary_disability}
                />
              </div>

              <InputField
                label="Support Coordinator Name"
                name="support_coordinator_name"
                icon={User}
                placeholder="Coordinator's name"
                value={form.support_coordinator_name}
                onChange={handleChange}
                error={errors.support_coordinator_name}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Coordinator Phone"
                  name="support_coordinator_phone"
                  type="tel"
                  icon={Phone}
                  placeholder="04XX XXX XXX"
                  value={form.support_coordinator_phone}
                  onChange={handleChange}
                />
                <InputField
                  label="Coordinator Email"
                  name="support_coordinator_email"
                  type="email"
                  icon={Mail}
                  placeholder="coordinator@example.com"
                  value={form.support_coordinator_email}
                  onChange={handleChange}
                />
              </div>

              <Field label="NDIS Goals">
                <textarea
                  name="ndis_goals"
                  value={form.ndis_goals}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What are the participant's NDIS goals?"
                  className={`${inputCls(false)} resize-none`}
                />
              </Field>
            </div>
          )}
        </div>

        {/* ─── Sidebar ───────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Info card (edit mode) */}
          {isEditMode && selectedUser && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4">
                User Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID</span>
                  <span className="font-medium text-slate-700">
                    #{selectedUser.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === "provider"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {selectedUser.role === "provider" ? (
                      <Building2 className="w-3 h-3" />
                    ) : (
                      <Heart className="w-3 h-3" />
                    )}
                    {selectedUser.role?.charAt(0).toUpperCase() +
                      selectedUser.role?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      selectedUser.is_active !== false
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {selectedUser.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joined</span>
                  <span className="text-slate-700 text-xs">
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString(
                          "en-AU",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit buttons */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isEditMode ? "Save Changes" : "Create User"}
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="w-full py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
