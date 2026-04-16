import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchMyProfile,
  updateMyProfile,
} from "../../store/actions/profileActions";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { ASYNC_STATUS } from "../../constants";
import { checkAuth } from "../../store/actions/authActions";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isProvider } = useAuth();

  const { profile, status, saveStatus } = useSelector((s) => s.profile);
  const { publicCategories } = useSelector((s) => s.category);
  const categoriesLoading =
    useSelector((s) => s.category.status) === ASYNC_STATUS.LOADING;

  const loading = status === ASYNC_STATUS.LOADING;
  const saving = saveStatus === ASYNC_STATUS.LOADING;
  const saved = saveStatus === ASYNC_STATUS.SUCCEEDED;

  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState(null);

  // Fetch profile + categories on mount
  useEffect(() => {
    dispatch(fetchMyProfile());
    if (isProvider) dispatch(fetchPublicCategories());
  }, [dispatch, isProvider]);

  // Populate local form when profile loads
  useEffect(() => {
    if (!profile) return;
    const pp = profile.provider_profile;
    const pa = profile.participant_profile;
    const nameParts = (profile.name || "").split(" ");

    setFormData({
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      email: profile.email || "",
      phone_number: profile.phone_number || "",
      location: profile.location || "",
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
      // Notifications (local-only for now)
      notifyEmail: true,
      notifyPush: true,
      notifySMS: false,
    });
  }, [profile]);

  // Clear saved status after 2s
  useEffect(() => {
    if (saved) {
      const t = setTimeout(
        () => dispatch({ type: "profile/clearSaveStatus" }),
        2000,
      );
      return () => clearTimeout(t);
    }
  }, [saved, dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const set = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const toggleCategory = useCallback((catId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }));
  }, []);

  const handleSave = async () => {
    if (!formData) return;

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      location: formData.location,
    };

    if (isProvider) {
      payload.organisation_name = formData.organisation_name;
      payload.abn = formData.abn;
      payload.website = formData.website;
      payload.is_ndis_registered = formData.is_ndis_registered;
      payload.about_services = formData.about_services;
      payload.categories = formData.categories;
    } else {
      payload.ndis_number = formData.ndis_number;
      payload.primary_disability = formData.primary_disability;
      payload.support_coordinator_name = formData.support_coordinator_name;
      payload.support_coordinator_phone = formData.support_coordinator_phone;
      payload.support_coordinator_email = formData.support_coordinator_email;
      payload.ndis_goals = formData.ndis_goals;
    }

    await dispatch(updateMyProfile(payload));
    // re-sync the auth user
    dispatch(checkAuth());
  };

  const tabs = isProvider
    ? [
        { key: "details", label: "Business Details" },
        { key: "services", label: "Services & Categories" },
        { key: "notifications", label: "Notifications" },
      ]
    : [
        { key: "details", label: "My Details" },
        { key: "preferences", label: "Support Preferences" },
        { key: "notifications", label: "Notifications" },
      ];

  // Show loader while initial fetch
  if (loading && !formData) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!formData) return null;

  const displayName =
    `${formData.first_name} ${formData.last_name}`.trim() || user?.name || "";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account details and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2"
        >
          {saving && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 inline" /> Saved!
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Avatar & Completion */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white">
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800">{displayName}</h2>
            <p className="text-sm text-slate-500">
              {isProvider
                ? formData.organisation_name || user?.organisation
                : formData.location || user?.location}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${user?.profileComplete || 0}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {user?.profileComplete || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[90px] sm:min-w-[120px] px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* ─── Details Tab ───────────────────────────────────── */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label={isProvider ? "Contact First Name" : "First Name"}
                value={formData.first_name}
                onChange={(v) => set("first_name", v)}
              />
              <InputField
                label="Last Name"
                value={formData.last_name}
                onChange={(v) => set("last_name", v)}
              />
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(v) => set("email", v)}
                disabled
              />
              <InputField
                label="Phone"
                value={formData.phone_number}
                onChange={(v) => set("phone_number", v)}
              />
              <InputField
                label="Location"
                value={formData.location}
                onChange={(v) => set("location", v)}
              />
              {isProvider && (
                <>
                  <InputField
                    label="Organisation Name"
                    value={formData.organisation_name}
                    onChange={(v) => set("organisation_name", v)}
                  />
                  <InputField
                    label="ABN"
                    value={formData.abn}
                    onChange={(v) => set("abn", v)}
                  />
                  <InputField
                    label="Website"
                    value={formData.website}
                    onChange={(v) => set("website", v)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      NDIS Registration
                    </label>
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        name="is_ndis_registered"
                        checked={formData.is_ndis_registered}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                      />
                      <span className="text-sm text-slate-700">
                        NDIS Registered Provider
                      </span>
                    </div>
                  </div>
                </>
              )}
              {!isProvider && (
                <>
                  <InputField
                    label="NDIS Number"
                    value={formData.ndis_number}
                    onChange={(v) => set("ndis_number", v)}
                  />
                  <InputField
                    label="Primary Disability"
                    value={formData.primary_disability}
                    onChange={(v) => set("primary_disability", v)}
                  />
                  <InputField
                    label="Support Coordinator Name"
                    value={formData.support_coordinator_name}
                    onChange={(v) => set("support_coordinator_name", v)}
                  />
                  <InputField
                    label="Coordinator Phone"
                    value={formData.support_coordinator_phone}
                    onChange={(v) => set("support_coordinator_phone", v)}
                  />
                  <InputField
                    label="Coordinator Email"
                    value={formData.support_coordinator_email}
                    onChange={(v) => set("support_coordinator_email", v)}
                  />
                </>
              )}
            </div>
            {isProvider && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  About Your Organisation
                </label>
                <textarea
                  name="about_services"
                  value={formData.about_services}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none resize-none"
                />
              </div>
            )}
            {!isProvider && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  NDIS Goals
                </label>
                <textarea
                  name="ndis_goals"
                  value={formData.ndis_goals}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What are you hoping to achieve with your NDIS plan?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ─── Services Tab — Provider only ───────────────────── */}
        {activeTab === "services" && isProvider && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Select the service categories your organisation offers. These will
              be displayed on your profile and used for matching.
            </p>
            {categoriesLoading && publicCategories.length === 0 ? (
              <div className="flex items-center justify-center py-8">
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
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      formData.categories.includes(cat.id)
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
        )}

        {/* ─── Support Preferences — Participant only ─────────── */}
        {activeTab === "preferences" && !isProvider && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
              Tell us what kind of support you&apos;re looking for. This helps
              providers understand your needs.
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What types of support are you looking for?
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Daily Living Support",
                  "Therapy (OT, Speech, Physio)",
                  "Support Coordination",
                  "Community Participation",
                  "Employment Support",
                  "Personal Care",
                  "Transport",
                  "Home Modifications",
                  "Mental Health Support",
                  "Peer Support",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preferred provider distance
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none bg-white">
                <option>Within 10 km</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Any distance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Accessibility requirements
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Wheelchair accessible",
                  "Auslan / sign language",
                  "Easy read materials",
                  "Home visits available",
                  "Telehealth / online",
                  "CALD language support",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Notifications Tab ──────────────────────────────── */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Choose how you&apos;d like to be notified about activity on the
              platform.
            </p>
            <ToggleRow
              label="Email notifications"
              desc="Receive updates, referrals, and event reminders via email"
              checked={formData.notifyEmail}
              onChange={(v) => set("notifyEmail", v)}
            />
            <ToggleRow
              label="Push notifications"
              desc="Get real-time alerts in your browser"
              checked={formData.notifyPush}
              onChange={(v) => set("notifyPush", v)}
            />
            <ToggleRow
              label="SMS notifications"
              desc="Receive important alerts via text message"
              checked={formData.notifySMS}
              onChange={(v) => set("notifySMS", v)}
            />
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Notify me about:
              </h3>
              <div className="space-y-3">
                {(isProvider
                  ? [
                      "New service requests",
                      "Event reminders",
                      "Q&A replies",
                      "Directory messages",
                      "Platform updates",
                    ]
                  : [
                      "New providers in my area",
                      "Event reminders",
                      "Message board replies",
                      "Plan Buddy messages",
                      "Platform updates",
                    ]
                ).map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function InputField({ label, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none ${
          disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-purple-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default ProfilePage;
