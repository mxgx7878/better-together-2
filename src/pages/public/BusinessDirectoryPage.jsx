import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Shield,
  Building2,
  ArrowRight,
  Filter,
  Loader2,
  Heart,
  X,
  Lock,
  Hash,
  Phone,
  Mail,
} from "lucide-react";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import TrustBadgeRow from "../../components/common/TrustBadgeRow";
import { fetchMarketingRibbon } from "../../store/actions/marketingRibbonActions";
import { LINK_TYPES } from "../../components/common/SocialLinksField";
import { API_BASE_URL } from "../../constants";

// ─── Unsplash backgrounds (community / care theme) ─────────────────
const HERO_BG =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80";
const CTA_BG =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80";

// ─── API base — public fetch, no auth interceptor ───────────────────

const publicFetch = async (path, params = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// ─── Helpers ────────────────────────────────────────────────────────
// Robust truthy check — handles boolean, number, and string "0" / "1"
const truthy = (v) => v === true || Number(v) === 1;

const normaliseProvider = (user) => {
  const pp = user?.provider_profile || {};
  // ⚠️ Backend returns `organization_name` (American spelling).
  // The previous British spelling silently fell back to user.name.
  const orgName =
    pp.organization_name || pp.organisation_name || user?.name || "Provider";

  const initials =
    orgName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const GRADIENTS = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-indigo-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-amber-500",
    "from-teal-500 to-cyan-500",
    "from-rose-500 to-pink-500",
    "from-violet-500 to-purple-500",
    "from-fuchsia-500 to-pink-500",
  ];
  const gradient = GRADIENTS[Math.abs(Number(user.id) || 0) % GRADIENTS.length];

  const links = Array.isArray(pp.links)
    ? pp.links.filter((l) => l?.url)
    : pp.website
      ? [{ type: "website", url: pp.website }]
      : [];

  return {
    id: user.id,
    name: orgName,
    contactName: user?.name || "",
    initials,
    location: user?.location || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    abn: pp.abn || "",
    logo: pp.organization_logo || null,
    about: pp.about_services || "",
    // ✅ Strict checks — string "0" no longer passes through
    isNdisRegistered: truthy(pp.is_ndis_registered),
    openToCollab: truthy(pp.open_to_collab),
    primaryCategory: pp.categories?.[0]?.name || "Service Provider",
    categories: Array.isArray(pp.categories) ? pp.categories : [],
    links,
    recommended_by_admin: truthy(pp.recommended_by_admin),
    checked_by_admin: truthy(pp.checked_by_admin),
    paid_for_marketing: truthy(pp.paid_for_marketing),
    super_star: truthy(pp.super_star),
    gradient,
  };
};

// ─── Component ──────────────────────────────────────────────────────
const BusinessDirectoryPage = () => {
  const dispatch = useDispatch();
  const sponsors = useSelector((s) => s.marketingRibbon.publicEntries);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchMarketingRibbon());
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    publicFetch("/provider/categories")
      .then((data) => {
        if (cancelled) return;
        setCategories(Array.isArray(data?.data) ? data.data : []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = {
      type: "provider",
      per_page: 6, // ← only latest 6
      sort_by: "created_at", // ← newest first (adjust if backend uses different param)
      sort_order: "desc",
    };
    if (search) params.search = search;
    if (categoryId && categoryId !== "all") params.category_id = categoryId;

    publicFetch("/public/users", params)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data ?? res;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        // Client-side safety net in case backend ignores per_page
        setUsers(list.slice(0, 6));
        setTotal(payload?.total ?? list.length);
      })
      .catch(() => {
        if (cancelled) return;
        setUsers([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, categoryId]);

  const providers = useMemo(
    () => (users || []).map(normaliseProvider),
    [users],
  );

  const closeModal = useCallback(() => setSelectedProvider(null), []);

  // Mask helpers for gated contact info
  const maskEmail = (e) => {
    if (!e) return "";
    const [u, d] = e.split("@");
    return `${u.slice(0, 2)}•••@${d || "•••"}`;
  };
  const maskPhone = (p) => (p ? `${p.slice(0, 3)} ••• ${p.slice(-2)}` : "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden="true"
        />
        {/* Gradient overlay tinting the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/90 via-purple-600/85 to-pink-500/90" />
        {/* Decorative blurred blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 ring-1 ring-white/20">
            <Building2 className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm font-medium">
              Trusted NDIS Providers
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-sm">
            Business Directory
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Find trusted NDIS providers and support services near you
          </p>
        </div>
      </section>

      {/* ─── Search & Filters ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by provider name, organisation or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white cursor-pointer min-w-[220px]"
              >
                <option value="all">All Services</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {loading
              ? "Loading providers…"
              : `Showing ${providers.length} of ${total || providers.length} provider${
                  (total || providers.length) === 1 ? "" : "s"
                } (latest first)`}
          </p>
        </div>
      </section>

      {/* ─── Business Cards Grid ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && providers.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl bg-white border border-dashed border-purple-200"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.05) 0%, transparent 50%)",
            }}
          >
            <Search className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">
              No providers found
            </h3>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                onClick={() => setSelectedProvider(biz)}
              >
                {/* Card Header — logo + NDIS badge */}
                <div
                  className={`bg-gradient-to-r ${biz.gradient} p-5 rounded-t-2xl`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {biz.logo ? (
                      <img
                        src={biz.logo}
                        alt={biz.name}
                        className="w-14 h-14 rounded-xl object-cover bg-white/20 backdrop-blur-sm border border-white/30"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {biz.initials}
                        </span>
                      </div>
                    )}
                    {biz.isNdisRegistered && (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        <Shield className="w-3 h-3" />
                        NDIS
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body — minimal */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {biz.name}
                  </h3>

                  <span className="inline-block w-fit text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 mb-3">
                    {biz.primaryCategory}
                  </span>

                  {biz.location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{biz.location}</span>
                    </div>
                  )}

                  {/* Trust badges */}
                  <TrustBadgeRow
                    provider={biz}
                    size="sm"
                    ringClass="ring-white"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProvider(biz);
                    }}
                    className="mt-auto pt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Provider Detail Modal ─────────────────────────────── */}
      {selectedProvider && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative bg-gradient-to-r ${selectedProvider.gradient} p-6 pb-8`}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 pr-10">
                {selectedProvider.logo ? (
                  <img
                    src={selectedProvider.logo}
                    alt={selectedProvider.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white/20 border border-white/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {selectedProvider.initials}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {selectedProvider.name}
                  </h2>
                  {selectedProvider.location && (
                    <p className="text-sm text-white/90 mt-1 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProvider.location}
                    </p>
                  )}
                  <div className="mt-2">
                    <TrustBadgeRow
                      provider={selectedProvider}
                      size="md"
                      ringClass="ring-white/60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
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

              {/* Quick info grid — ABN + Contact name */}
              {(selectedProvider.abn || selectedProvider.contactName) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedProvider.contactName && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Contact Name
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                        {selectedProvider.contactName}
                      </p>
                    </div>
                  )}
                  {selectedProvider.abn && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        ABN
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-1 inline-flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        {selectedProvider.abn}
                      </p>
                    </div>
                  )}
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
              {selectedProvider.links.length > 0 && (
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
                  <p
                    className={`text-base font-semibold mt-1 ${
                      selectedProvider.isNdisRegistered
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {selectedProvider.isNdisRegistered ? "Yes" : "No"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Open to Collab</p>
                  <p
                    className={`text-base font-semibold mt-1 ${
                      selectedProvider.openToCollab
                        ? "text-purple-600"
                        : "text-slate-400"
                    }`}
                  >
                    {selectedProvider.openToCollab ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Gated contact preview */}
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Want to contact this provider?
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Sign up to view full contact details.
                    </p>
                  </div>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap flex-shrink-0"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Masked preview so users see SOMETHING is there */}
                {(selectedProvider.email || selectedProvider.phone) && (
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-purple-100">
                    {selectedProvider.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="truncate blur-[1.5px] select-none">
                          {maskEmail(selectedProvider.email)}
                        </span>
                      </div>
                    )}
                    {selectedProvider.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="truncate blur-[1.5px] select-none">
                          {maskPhone(selectedProvider.phone)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${CTA_BG})` }}
            aria-hidden="true"
          />
          {/* Overlay tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/92 via-purple-600/88 to-pink-500/92" />

          <div className="relative p-10 md:p-14 text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6 ring-1 ring-white/20">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Are you a provider?
              </h2>
              <p className="text-lg text-purple-100 max-w-xl mx-auto mb-8">
                List your business on our directory and connect with NDIS
                participants looking for quality support services in their area.
              </p>
              <Link
                to="/subscription"
                className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold py-3.5 px-8 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
              >
                List Your Business
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marketing Partners Ribbon ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <FeaturedPartnersRibbon
          sponsors={sponsors}
          title="Our Marketing Partners"
          note="Sponsored providers"
        />
      </section>
    </div>
  );
};

export default BusinessDirectoryPage;
