import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Shield,
  ArrowRight,
  Filter,
  Loader2,
  X,
  Hash,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import TrustBadgeRow from "../../components/common/TrustBadgeRow";
import { fetchMarketingRibbon } from "../../store/actions/marketingRibbonActions";
import { LINK_TYPES } from "../../components/common/SocialLinksField";
import { API_BASE_URL } from "../../constants";
import { NAVY, LIME, PURPLE, img, Eyebrow, CtaPanel } from "../../components/public/ui";

// How many providers to show per "page" / per Load More click (3-col grid → 9)
const PER_PAGE = 9;

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

// Handles common Laravel shapes:
//  { data: { data: [...], total, last_page } }
//  { data: [...], meta: { total, last_page } }
//  { data: [...] }  or  [...]
const parsePage = (res) => {
  const payload = res?.data && !Array.isArray(res.data) ? res.data : res;
  const list = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : Array.isArray(res?.data)
        ? res.data
        : [];
  const meta = payload?.meta || res?.meta || payload || {};
  const lastPage = Number(meta?.last_page) || null;
  const total = Number(meta?.total) || list.length;
  return { list, lastPage, total };
};

// ─── Helpers ────────────────────────────────────────────────────────
// Robust truthy check — handles boolean, number, and string "0" / "1"
const truthy = (v) => v === true || Number(v) === 1;

const normaliseProvider = (user) => {
  const pp = user?.provider_profile || {};
  // ⚠️ Backend returns `organization_name` (American spelling).
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

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

  const buildParams = useCallback(
    (pageNum) => {
      const params = {
        type: "provider",
        for: "public-business-directory",
        per_page: PER_PAGE,
        page: pageNum,
        sort_by: "created_at",
        sort_order: "desc",
      };
      if (search) params.search = search;
      if (categoryId && categoryId !== "all") params.category_id = categoryId;
      return params;
    },
    [search, categoryId],
  );

  // First page — re-runs whenever search / category changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);
    setVisibleCount(PER_PAGE);

    publicFetch("/public/users", buildParams(1))
      .then((res) => {
        if (cancelled) return;
        const { list, lastPage: lp, total: t } = parsePage(res);
        setUsers(list);
        setLastPage(lp);
        setTotal(t);
      })
      .catch(() => {
        if (cancelled) return;
        setUsers([]);
        setLastPage(null);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [buildParams]);

  // Works both ways:
  //  - backend paginates → fetches the next page and appends
  //  - backend ignores per_page and sends everything → just reveals 9 more
  const hasMore =
    visibleCount < users.length || (lastPage !== null && page < lastPage);

  const loadMore = async () => {
    if (visibleCount < users.length) {
      setVisibleCount((v) => v + PER_PAGE);
      return;
    }
    if (lastPage === null || page >= lastPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await publicFetch("/public/users", buildParams(nextPage));
      const { list, lastPage: lp, total: t } = parsePage(res);
      setUsers((prev) => {
        const seen = new Set(prev.map((u) => u.id));
        return [...prev, ...list.filter((u) => !seen.has(u.id))];
      });
      setPage(nextPage);
      setLastPage(lp);
      setTotal(t);
      setVisibleCount((v) => v + PER_PAGE);
    } catch {
      // keep what we have; user can click again
    } finally {
      setLoadingMore(false);
    }
  };

  const providers = useMemo(
    () => (users || []).slice(0, visibleCount).map(normaliseProvider),
    [users, visibleCount],
  );

  const totalCount = Math.max(total, users.length);

  const closeModal = useCallback(() => setSelectedProvider(null), []);

  // Mask helpers for gated contact info
  const maskEmail = (e) => {
    if (!e) return "";
    const [u, d] = e.split("@");
    return `${u.slice(0, 2)}•••@${d || "•••"}`;
  };
  const maskPhone = (p) => (p ? `${p.slice(0, 3)} ••• ${p.slice(-2)}` : "");

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 md:pt-16" style={{ background: NAVY }}>
        <img
          src={img("network")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: LIME }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <Eyebrow light>Trusted NDIS providers</Eyebrow>
          <h1 className="text-3xl font-extrabold leading-[1.15] text-white md:text-5xl">Business Directory</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-blue-100/90 md:text-base">
            Find trusted NDIS providers and support services near you — checked, endorsed and
            ready to connect.
          </p>
        </div>
      </section>

      {/* ─── Search & Filters ──────────────────────────────────── */}
      <section className="relative z-10 mx-auto -mt-14 max-w-6xl px-4 sm:px-6">
        <div className="rounded-[24px] bg-white p-5 shadow-xl md:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by provider name, organisation or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-[#F8FAFD] py-3.5 pl-12 pr-4 text-[15px] outline-none transition focus:border-[#1F6FD8] focus:bg-white focus:ring-4 focus:ring-[#1F6FD8]/10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full min-w-[230px] cursor-pointer appearance-none rounded-full border border-slate-200 bg-[#F8FAFD] py-3.5 pl-10 pr-10 text-[15px] outline-none focus:border-[#1F6FD8] focus:bg-white focus:ring-4 focus:ring-[#1F6FD8]/10"
              >
                <option value="all">All services</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <p className="mt-4 px-1 text-sm text-slate-500">
            {loading
              ? "Loading providers…"
              : `Showing ${providers.length} of ${totalCount} provider${totalCount === 1 ? "" : "s"} (latest first)`}
          </p>
        </div>
      </section>

      {/* ─── Business Cards Grid ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {loading && providers.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: PURPLE }} />
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-[24px] bg-white py-16 text-center shadow-sm">
            <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-semibold" style={{ color: NAVY }}>No providers found</h3>
            <p className="mt-1 text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((biz) => (
                <div
                  key={biz.id}
                  className="group flex cursor-pointer flex-col rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => setSelectedProvider(biz)}
                >
                  <div className="flex items-start justify-between gap-3">
                    {biz.logo ? (
                      <img
                        src={biz.logo}
                        alt={biz.name}
                        loading="lazy"
                        className="h-16 w-16 rounded-2xl border border-slate-100 bg-white object-cover"
                      />
                    ) : (
                      <div className="font-display flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold" style={{ background: "#EEF2FA", color: NAVY }}>
                        {biz.initials}
                      </div>
                    )}
                    {biz.isNdisRegistered && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#EEF8D6", color: "#4D7A12" }}>
                        <Shield className="h-3 w-3" />
                        NDIS registered
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 line-clamp-1 text-lg font-bold leading-tight transition-colors group-hover:text-[#7A2FB8]" style={{ color: NAVY }}>
                    {biz.name}
                  </h3>
                  <span className="mt-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: "#F1EAFB", color: PURPLE }}>
                    {biz.primaryCategory}
                  </span>

                  {biz.location && (
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="truncate">{biz.location}</span>
                    </div>
                  )}

                  <div className="mt-4">
                    <TrustBadgeRow provider={biz} size="sm" ringClass="ring-white" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProvider(biz);
                    }}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#14306B] py-2.5 text-sm font-bold text-[#14306B] transition group-hover:bg-[#14306B] group-hover:text-white"
                    style={{ marginTop: "1.25rem" }}
                  >
                    View profile
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ─── Load More ─────────────────────────────────────── */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    background: NAVY,
                    width: `${Math.min(100, (providers.length / (totalCount || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-slate-500">
                {providers.length} of {totalCount} providers
              </p>

              {hasMore ? (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: NAVY }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Load more providers
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                totalCount > PER_PAGE && (
                  <p className="text-sm font-semibold" style={{ color: PURPLE }}>
                    You&apos;ve seen all providers
                  </p>
                )
              )}
            </div>
          </>
        )}
      </section>

      {/* ─── Provider Detail Modal ─────────────────────────────── */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E2352]/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProvider.name}
          >
            <div className="relative overflow-hidden p-6 pb-7 md:p-7" style={{ background: NAVY }}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-2xl" style={{ background: LIME }} />
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex items-center gap-4 pr-10">
                {selectedProvider.logo ? (
                  <img
                    src={selectedProvider.logo}
                    alt={selectedProvider.name}
                    className="h-16 w-16 flex-shrink-0 rounded-2xl border border-white/20 bg-white object-cover"
                  />
                ) : (
                  <div className="font-display flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white">
                    {selectedProvider.initials}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
                    {selectedProvider.name}
                  </h2>
                  {selectedProvider.location && (
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-blue-100">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedProvider.location}
                    </p>
                  )}
                  <div className="mt-2">
                    <TrustBadgeRow provider={selectedProvider} size="md" ringClass="ring-white/60" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-7">
              {selectedProvider.about && (
                <div>
                  <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>About</h4>
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
                    {selectedProvider.about}
                  </p>
                </div>
              )}

              {(selectedProvider.abn || selectedProvider.contactName) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedProvider.contactName && (
                    <div className="rounded-xl bg-[#F4F6FA] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact name</p>
                      <p className="mt-1 truncate text-sm font-semibold" style={{ color: NAVY }}>
                        {selectedProvider.contactName}
                      </p>
                    </div>
                  )}
                  {selectedProvider.abn && (
                    <div className="rounded-xl bg-[#F4F6FA] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ABN</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: NAVY }}>
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        {selectedProvider.abn}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedProvider.categories.length > 0 && (
                <div>
                  <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Services offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.categories.map((c) => (
                      <span key={c.id} className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: "#EEF2FA", color: NAVY }}>
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProvider.links.length > 0 && (
                <div>
                  <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: PURPLE }}>Website &amp; social</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.links.map((link, i) => {
                      const meta = LINK_TYPES.find((t) => t.value === link.type) || LINK_TYPES[0];
                      const Icon = meta.icon;
                      return (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F6FA] px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-[#EEF2FA] hover:text-[#14306B]"
                          title={meta.label}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3.5 text-center">
                  <p className="text-xs text-slate-500">NDIS registered</p>
                  <p className={`mt-1 text-base font-bold ${selectedProvider.isNdisRegistered ? "text-emerald-600" : "text-slate-400"}`}>
                    {selectedProvider.isNdisRegistered ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3.5 text-center">
                  <p className="text-xs text-slate-500">Open to collab</p>
                  <p className="mt-1 text-base font-bold" style={{ color: selectedProvider.openToCollab ? PURPLE : "#94a3b8" }}>
                    {selectedProvider.openToCollab ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {(selectedProvider.email || selectedProvider.phone) && (
                <div className="grid gap-2 rounded-2xl p-4 sm:grid-cols-2" style={{ background: "#EEF2FA" }}>
                  {selectedProvider.email && (
                    <a href={`mailto:${selectedProvider.email}`} className="flex min-w-0 items-center gap-2 text-sm font-medium hover:underline" style={{ color: NAVY }}>
                      <Mail className="h-4 w-4 flex-shrink-0" style={{ color: PURPLE }} />
                      <span className="truncate">{selectedProvider.email}</span>
                    </a>
                  )}
                  {selectedProvider.phone && (
                    <a href={`tel:${selectedProvider.phone}`} className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: NAVY }}>
                      <Phone className="h-4 w-4 flex-shrink-0" style={{ color: PURPLE }} />
                      {selectedProvider.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CtaPanel
        eyebrow="Are you a provider?"
        title="List your business on the directory"
        text="Connect with NDIS participants looking for quality support services in their area. Start free and grow with us."
        primary={{ to: "/subscription", label: "List your business" }}
        image="handshake"
      />

      {/* ─── Marketing Partners Ribbon ─────────────────────────── */}
      {sponsors?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <FeaturedPartnersRibbon sponsors={sponsors} title="Our Marketing Partners" note="Sponsored providers" />
        </section>
      )}
    </div>
  );
};

export default BusinessDirectoryPage;