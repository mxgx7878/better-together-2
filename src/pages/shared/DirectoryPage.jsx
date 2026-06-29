import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  Lock,
  Search,
  Loader2,
  MapPin,
  Building2,
  Heart,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { PROVIDER_BADGES } from "../../components/common/ProviderBadges";
import Checkbox from "../../components/common/Checkbox";
import { fetchUsers } from "../../store/actions/userActions";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { LINK_TYPES } from "../../components/common/SocialLinksField";
import { ASYNC_STATUS } from "../../constants";
import TrustBadgeRow from "../../components/common/TrustBadgeRow";

// ─── Helpers ────────────────────────────────────────────────────────
// Backend shape: User { id, name, email, location, role, tier?, provider_profile: {...} }
const normaliseProvider = (user) => {
  const pp = user?.provider_profile || {};

  const isPaid =
    String(user?.tier || "").toLowerCase() === "paid" ||
    !!user?.subscription?.id ||
    !!user?.current_subscription?.id;

  // Links: prefer the new array shape, fall back to a legacy single `website` column
  const links = Array.isArray(pp.links)
    ? pp.links.filter((l) => l?.url)
    : pp.website
      ? [{ type: "website", url: pp.website }]
      : [];

  const orgName = pp.organisation_name || user?.name || "Provider";

  return {
    id: user.id,
    name: orgName,
    contactName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    location: user?.location || "",
    logo: pp.organization_logo || null,
    about: pp.about_services || "",
    isNdisRegistered: !!pp.is_ndis_registered,
    openToCollab: !!pp.open_to_collab,
    isPaid,
    tier: isPaid ? "paid" : "free",
    // Trust-badge flags (set by admin from the user form, independent of tier)
    recommended_by_admin: !!pp.recommended_by_admin,
    checked_by_admin: !!pp.checked_by_admin,
    paid_for_marketing: !!pp.paid_for_marketing,
    super_star: !!pp.super_star,
    is_paid: isPaid,
    categories: Array.isArray(pp.categories) ? pp.categories : [],
    links,
    featured: !!pp.recommended_by_admin || !!pp.paid_for_marketing,
  };
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

// ─── Inline Trust-Badge row ─────────────────────────────────────────
// Renders gold star (recommended) / smiley (checked) / blue tick
// (marketing partner) — directly off the admin-set flags. Independent
// of the provider's paid tier so admin-curated trust signals show up
// even on free-tier providers.
// ═══════════════════════════════════════════════════════════════════
// PATCH: TrustBadgeRow with proper hover tooltip
// ═══════════════════════════════════════════════════════════════════
//
// Open src/pages/shared/DirectoryPage.jsx — find the existing
// `TrustBadgeRow` component (just before the main DirectoryPage
// component) and REPLACE it entirely with this version.
//
// Nothing else in the file changes.

// ─── Inline Trust-Badge row ─────────────────────────────────────────
// Renders gold star (recommended) / smiley (checked) / blue tick
// (marketing partner) — directly off the admin-set flags. Each badge
// has a hover tooltip explaining what it means so users aren't left
// guessing what each icon represents.


// ─── Component ──────────────────────────────────────────────────────
const DirectoryPage = () => {
  const dispatch = useDispatch();
  const { isProvider, isPaid, isParticipant } = useAuth();

  const { users, status, total } = useSelector((s) => s.user);
  const { publicCategories } = useSelector((s) => s.category);
  const loading = status === ASYNC_STATUS.LOADING;

  // ─── Filters ─────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [showCollabOnly, setShowCollabOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Debounce search input → server
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load categories once
  useEffect(() => {
    if (!publicCategories?.length) {
      dispatch(fetchPublicCategories());
    }
  }, [dispatch, publicCategories?.length]);

  // Fetch providers whenever filters change.
  useEffect(() => {
    const params = { type: "provider" };
    if (search) params.search = search;
    if (categoryId && categoryId !== "all") params.category_id = categoryId;
    if (showCollabOnly) params.open_to_collab = 1;

    dispatch(fetchUsers(params));
  }, [dispatch, search, categoryId, showCollabOnly]);

  // Free providers see only name + location. Everyone else gets full view.
  const isFreeProvider = isProvider && !isPaid;
  const canSeeFullDetails = !isFreeProvider;
  const canContact = !isFreeProvider;

  const providers = useMemo(
    () => (users || []).map(normaliseProvider),
    [users],
  );

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isProvider ? "Business Directory" : "Provider Directory"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isProvider
            ? "Discover other providers to collaborate with and build referral pathways"
            : "Browse providers and reach out to the right one for you"}
        </p>
      </div>

      {/* Free-provider gate notice */}
      {isFreeProvider && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 flex-1">
            <p className="font-semibold">Limited preview</p>
            <p className="mt-0.5">
              On the Free plan you can see each provider&apos;s name and
              location.{" "}
              <Link to="/provider/upgrade" className="underline font-semibold">
                Upgrade
              </Link>{" "}
              to unlock full details and contact other providers.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, organisation or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all"
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none bg-white min-w-[200px]"
          >
            <option value="all">All Services</option>
            {publicCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
          {isProvider && (
            <Checkbox
              label="Open to collaboration only"
              checked={showCollabOnly}
              onChange={setShowCollabOnly}
            />
          )}
          <span className="text-sm text-slate-400 ml-auto">
            {loading
              ? "Loading…"
              : `${total || providers.length} provider${
                  (total || providers.length) === 1 ? "" : "s"
                } found`}
          </span>
        </div>
      </div>

      {/* Results */}
      {loading && providers.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No providers found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : isFreeProvider ? (
        // ─── Reduced card for free providers ──────────────────
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4"
            >
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {getInitials(p.name)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {p.location || "—"}
                </p>
                <div className="mt-2">
                  <TrustBadgeRow provider={p} size="sm" />
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Upgrade to see details
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ─── Full card for participants + paid providers + admins ──
        <div className="grid lg:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${
                provider.featured
                  ? "border-purple-200 ring-1 ring-purple-100"
                  : "border-slate-100"
              }`}
              // onClick={() => setSelectedProvider(provider)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4 min-w-0">
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                        provider.featured
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-slate-500 to-slate-700"
                      }`}
                    >
                      {getInitials(provider.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-800 truncate">
                        {provider.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {provider.categories[0]?.name || "Service Provider"}
                    </p>
                    <div className="mt-2">
                      <TrustBadgeRow provider={provider} size="sm" />
                    </div>
                  </div>
                </div>

                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(provider.id);
                  }}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    bookmarks.includes(provider.id)
                      ? "bg-amber-50 text-amber-600"
                      : "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
                  }`}
                  aria-label="Save provider"
                >
                  <Star
                    className={`w-4 h-4 ${
                      bookmarks.includes(provider.id) ? "fill-current" : ""
                    }`}
                  />
                </button> */}
              </div>

              {provider.about && (
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                  {provider.about}
                </p>
              )}

              {/* Tag row */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {provider.isNdisRegistered && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                    <ShieldCheck className="w-3 h-3" /> NDIS Registered
                  </span>
                )}
                {provider.openToCollab && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium">
                    <Heart className="w-3 h-3" /> Open to Collab
                  </span>
                )}
                {provider.categories.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-1 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {provider.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[140px]">
                        {provider.location}
                      </span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProvider(provider)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && canSeeFullDetails && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5 gap-3">
              <div className="flex items-center gap-4 min-w-0">
                {selectedProvider.logo ? (
                  <img
                    src={selectedProvider.logo}
                    alt={selectedProvider.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {getInitials(selectedProvider.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-800 truncate">
                    {selectedProvider.name}
                  </h2>
                  {selectedProvider.location && (
                    <p className="text-sm text-slate-500 mt-0.5 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProvider.location}
                    </p>
                  )}
                  <div className="mt-2">
                    <TrustBadgeRow provider={selectedProvider} size="md" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* About */}
              {selectedProvider.about && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    About
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedProvider.about}
                  </p>
                </div>
              )}

              {/* Categories */}
              {selectedProvider.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Services Offered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.categories.map((c) => (
                      <span
                        key={c.id}
                        className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {selectedProvider.links?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Website &amp; Social
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.links.map((link, i) => {
                      const meta =
                        LINK_TYPES.find((t) => t.value === link.type) ||
                        LINK_TYPES[0];
                      const Icon = meta.icon;
                      return (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-medium transition-colors"
                          title={meta.label}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {meta.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status row */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500">NDIS Registered</p>
                  <p className="text-base font-semibold text-slate-800 mt-1">
                    {selectedProvider.isNdisRegistered ? "Yes" : "No"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Open to Collab</p>
                  <p className="text-base font-semibold text-slate-800 mt-1">
                    {selectedProvider.openToCollab ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              {canContact && selectedProvider.email && (
                <a
                  href={`mailto:${selectedProvider.email}`}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  Contact Provider
                </a>
              )}
              {/* <button
                onClick={() => toggleBookmark(selectedProvider.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  bookmarks.includes(selectedProvider.id)
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {bookmarks.includes(selectedProvider.id) ? (
                  <>
                    <Star className="w-4 h-4 fill-current inline mr-1" /> Saved
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 inline mr-1" /> Save
                  </>
                )}
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
