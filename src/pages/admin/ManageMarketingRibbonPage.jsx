import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Megaphone, Search, Loader2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Checkbox from "../../components/common/Checkbox";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import {
  adminFetchUsers,
  adminUpdateUser,
} from "../../store/actions/userActions";
import { ASYNC_STATUS } from "../../constants";

const ManageMarketingRibbonPage = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((s) => s.user);
  const loading = status === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch all providers
  useEffect(() => {
    dispatch(adminFetchUsers({ type: "provider", search }));
  }, [dispatch, search]);

  const providers = useMemo(() => users || [], [users]);

  // Live preview — providers currently flagged for ribbon
  const ribbonPreview = useMemo(
    () =>
      providers
        .filter((p) => p.provider_profile?.on_marketing_ribbon)
        .map((p) => ({
          id: p.id,
          name: p.provider_profile?.organisation_name || p.name,
          initials: (p.provider_profile?.organisation_name || p.name || "??")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          bg: "#7c3aed",
          url: p.provider_profile?.website || "",
          logo_url: p.provider_profile?.organization_logo || "",
        })),
    [providers],
  );

  console.log("Ribbon preview:", ribbonPreview);

  const toggleRibbon = (provider, value) => {
    console.log("Toggling ribbon for", provider, "to", value);
    dispatch(
      adminUpdateUser({
        id: provider.id,
        payload: {
          first_name: provider.first_name,
          last_name: provider.last_name,
          email: provider.email,
          phone_number: provider.phone_number,
          location: provider.location,
          on_marketing_ribbon: value,
        },
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Marketing Ribbon"
        description="Toggle providers on or off the scrolling ribbon. Active providers appear across the platform."
        icon={Megaphone}
      />

      {/* Live Preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Live Preview</h3>
        {ribbonPreview.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No providers on the ribbon yet — toggle the switches below to add
            them.
          </p>
        ) : (
          <FeaturedPartnersRibbon sponsors={ribbonPreview} note="Preview" />
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search providers by name or organisation…"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        />
      </div>

      <p className="text-sm text-slate-500">
        {loading
          ? "Loading…"
          : `${providers.length} ${providers.length === 1 ? "provider" : "providers"} found`}
      </p>

      {/* Provider list */}
      {loading && providers.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No providers found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {providers.map((provider) => {
            const onRibbon = !!provider.provider_profile?.on_marketing_ribbon;
            const orgName =
              provider.provider_profile?.organisation_name || provider.name;
            const logo = provider.provider_profile?.organization_logo;

            return (
              <div
                key={provider.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
              >
                {/* Logo / initials */}
                {logo ? (
                  <img
                    src={logo}
                    alt={orgName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                    {orgName?.[0]?.toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {orgName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {provider.email}
                  </p>
                </div>

                {/* Toggle */}
                <Checkbox
                  label="On Ribbon"
                  checked={onRibbon}
                  onChange={(v) => toggleRibbon(provider, v)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageMarketingRibbonPage;
