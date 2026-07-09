import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Heart,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import TrustBadgeRow from "../../components/common/TrustBadgeRow";

// ─── Normalise (self-contained; mirrors DirectoryPage) ──────────────
const normaliseProvider = (user) => {
  const pp = user?.provider_profile || {};
  const links = Array.isArray(pp.links)
    ? pp.links.filter((l) => l?.url)
    : pp.website
      ? [{ type: "website", url: pp.website }]
      : [];

  return {
    id: user.id,
    role: user.role,
    name: pp.organisation_name || pp.organization_name || user?.name || "Provider",
    contactName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    location: user?.location || "",
    abn: pp.abn || "",
    logo: pp.organization_logo || null,
    about: pp.about_services || "",
    isNdisRegistered: !!pp.is_ndis_registered,
    openToCollab: !!pp.open_to_collab,
    recommended_by_admin: !!pp.recommended_by_admin,
    checked_by_admin: !!pp.checked_by_admin,
    paid_for_marketing: !!pp.paid_for_marketing,
    super_star: !!pp.super_star,
    categories: Array.isArray(pp.categories) ? pp.categories : [],
    links,
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

const ProviderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isProvider } = useAuth();

  // Role-aware directory path (works for both portals)
  const backPath = isProvider ? "/provider/directory" : "/participant/services";
  const backLabel = isProvider ? "Back to business directory" : "Back to directory";

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProvider = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${id}`);
      const raw = res?.data ?? res;
      if (!raw || raw.role !== "provider") {
        setError("Provider not found.");
        setProvider(null);
      } else {
        setProvider(normaliseProvider(raw));
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading provider…</p>
        </div>
      </div>
    );
  }

  // ─── Error / Not found ────────────────────────────────────
  if (error || !provider) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">
              Couldn&apos;t load this provider
            </h3>
            <p className="text-sm text-red-600 mt-1">
              {error || "Provider not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const p = provider;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(backPath)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {backLabel}
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {p.logo ? (
            <img
              src={p.logo}
              alt={p.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {getInitials(p.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{p.name}</h1>
            {p.contactName && p.contactName !== p.name && (
              <p className="text-sm text-slate-500 mt-0.5">{p.contactName}</p>
            )}
            {p.location && (
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> {p.location}
              </p>
            )}

            <div className="mt-3">
              <TrustBadgeRow provider={p} size="sm" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.isNdisRegistered && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NDIS Registered
                </span>
              )}
              {p.openToCollab && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3 py-1">
                  <Heart className="w-3.5 h-3.5" /> Open to collaboration
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      {p.about && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" /> About
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {p.about}
          </p>
        </div>
      )}

      {/* Service categories */}
      {p.categories.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3">
            Service Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {p.categories.map((c) => (
              <span
                key={c.id}
                className="text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-3 py-1"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3">Contact</h2>
        <div className="space-y-2.5">
          {p.email && (
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-400" /> {p.email}
            </a>
          )}
          {p.phone && (
            <a
              href={`tel:${p.phone}`}
              className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-400" /> {p.phone}
            </a>
          )}
          {p.abn && (
            <p className="flex items-center gap-2.5 text-sm text-slate-500">
              <Building2 className="w-4 h-4 text-slate-400" /> ABN: {p.abn}
            </p>
          )}
          {p.links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="truncate">{l.url}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          ))}
          {!p.email && !p.phone && p.links.length === 0 && (
            <p className="text-sm text-slate-400">No contact details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;