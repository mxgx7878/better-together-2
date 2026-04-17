import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { updateMyProfile } from "../../store/actions/userActions";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { ASYNC_STATUS } from "../../constants";
import { checkAuth } from "../../store/actions/authActions";
import PendingGuardButton from "../../components/common/PendingGuardButton";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isProvider, isPaid } = useAuth();

  const profile = user;
  const { saveStatus } = useSelector((s) => s.user);
  const { publicCategories } = useSelector((s) => s.category);
  const categoriesLoading =
    useSelector((s) => s.category.status) === ASYNC_STATUS.LOADING;

  const saving = saveStatus === ASYNC_STATUS.LOADING;
  const saved = saveStatus === ASYNC_STATUS.SUCCEEDED;

  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState(null);

  // Fetch categories on mount (profile already loaded via checkAuth)
  useEffect(() => {
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
      open_to_collab: pp?.open_to_collab || false,
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
        () => dispatch({ type: "user/clearSaveStatus" }),
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
      payload.open_to_collab = formData.open_to_collab;
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
        ...(isPaid ? [{ key: "reviews", label: "Written Reviews" }] : []),
        { key: "notifications", label: "Notifications" },
      ]
    : [
        { key: "details", label: "My Details" },
        { key: "notifications", label: "Notifications" },
      ];

  if (!formData) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
      </div>
    );
  }

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
        <PendingGuardButton
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
        </PendingGuardButton>
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
            {/* Open to Collaboration toggle */}
            <div className="p-4 rounded-xl border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Open to Collaboration
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highlight on your profile that you&apos;re open to working
                  with other providers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => set("open_to_collab", !formData.open_to_collab)}
                className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                  formData.open_to_collab ? "bg-purple-600" : "bg-slate-300"
                }`}
                aria-pressed={formData.open_to_collab}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    formData.open_to_collab ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
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

        {/* ─── Reviews Tab — Paid provider only ──────────────── */}
        {activeTab === "reviews" && isProvider && isPaid && (
          <ReviewsTab />
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

const MAX_REVIEWS = 5;
const demoReviews = [
  {
    id: 1,
    author: "Rebecca M.",
    rating: 5,
    date: "2026-03-02",
    content:
      "Absolute game-changer. The team helped me navigate my plan review without stress and we got every goal funded.",
  },
  {
    id: 2,
    author: "Alex K.",
    rating: 5,
    date: "2026-02-10",
    content:
      "Communicates clearly, follows up on everything, and genuinely cares. Would recommend to anyone.",
  },
];

function ReviewsTab() {
  const [reviews, setReviews] = useState(demoReviews);
  const [newReview, setNewReview] = useState({ author: "", rating: 5, content: "" });

  const canAdd = reviews.length < MAX_REVIEWS;

  const handleAdd = () => {
    if (!newReview.author.trim() || !newReview.content.trim() || !canAdd) return;
    setReviews([
      {
        id: Date.now(),
        author: newReview.author,
        rating: Number(newReview.rating),
        date: new Date().toISOString().slice(0, 10),
        content: newReview.content,
      },
      ...reviews,
    ]);
    setNewReview({ author: "", rating: 5, content: "" });
  };

  const handleRemove = (id) => setReviews(reviews.filter((r) => r.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-slate-600">
            Written reviews appear on your public profile. Premium providers can
            feature up to {MAX_REVIEWS} written reviews.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {reviews.length} of {MAX_REVIEWS} slots used
          </p>
        </div>
      </div>

      {/* Existing reviews */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{r.author}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">
                    {new Date(r.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemove(r.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
            <p className="text-sm text-slate-700 mt-2">{r.content}</p>
          </div>
        ))}
      </div>

      {/* Add review */}
      <div className="p-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          Add a written review
        </p>
        {!canAdd && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
            Limit reached. Remove one to add a new review.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Reviewer name"
            value={newReview.author}
            disabled={!canAdd}
            onChange={(e) =>
              setNewReview({ ...newReview, author: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 disabled:bg-slate-100"
          />
          <select
            value={newReview.rating}
            disabled={!canAdd}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: e.target.value })
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white disabled:bg-slate-100"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={3}
          placeholder="Review content..."
          value={newReview.content}
          disabled={!canAdd}
          onChange={(e) =>
            setNewReview({ ...newReview, content: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none disabled:bg-slate-100"
        />
        <button
          onClick={handleAdd}
          disabled={
            !canAdd || !newReview.author.trim() || !newReview.content.trim()
          }
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md disabled:opacity-50"
        >
          Add Review
        </button>
      </div>
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
