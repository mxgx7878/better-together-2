import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, MapPin, Loader2, Bookmark, ShieldCheck, Heart } from "lucide-react";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchSavedProviders,
  unsaveProvider,
} from "../../store/actions/savedProviderActions";
// Reuse the exact mapping the directory uses so cards stay consistent.
import { normaliseProvider, getInitials } from "../shared/DirectoryPage";

const SavedProvidersPage = () => {
  const dispatch = useDispatch();
  const { list, savedIds, status } = useSelector((s) => s.savedProvider);
  const loading = status === ASYNC_STATUS.LOADING;

  useEffect(() => {
    dispatch(fetchSavedProviders());
  }, [dispatch]);

  const providers = (list || []).map(normaliseProvider);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Saved Providers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Providers you&apos;ve saved from the directory and from your service
          request applications.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && providers.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No saved providers yet
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Tap the star on a provider in the directory to save them here.
          </p>
          <Link
            to="/participant/services"
            className="inline-block mt-4 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Browse Provider Directory
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && providers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
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
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                      {getInitials(provider.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-800 truncate">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {provider.categories[0]?.name || "Service Provider"}
                    </p>
                    {provider.location && (
                      <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">
                          {provider.location}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => dispatch(unsaveProvider(provider.id))}
                  className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex-shrink-0"
                  aria-label="Remove from saved"
                  title="Remove from saved"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              {provider.about && (
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                  {provider.about}
                </p>
              )}

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

              {(provider.email || provider.phone) && (
                <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {provider.email && (
                    <a
                      href={`mailto:${provider.email}`}
                      className="hover:text-purple-600 truncate"
                    >
                      {provider.email}
                    </a>
                  )}
                  {provider.phone && (
                    <a
                      href={`tel:${provider.phone}`}
                      className="hover:text-purple-600"
                    >
                      {provider.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProvidersPage;