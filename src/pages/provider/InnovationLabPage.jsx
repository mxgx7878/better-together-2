import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Trophy,
  Target,
  ClipboardList,
  Heart,
  TrendingUp,
  Laptop,
  FileText,
  Video,
  FolderOpen,
  Mic,
  Loader2,
  Lightbulb,
  ExternalLink,
  Download,
  Lock,
  ChevronRight,
} from "lucide-react";
import FeatureGate from "../../components/common/FeatureGate";
import { fetchInnovationLabResources } from "../../store/actions/innovationLabActions";
import { ASYNC_STATUS } from "../../constants";

// ─── Category visuals ──────────────────────────────────────────────
// Backend returns categories as strings. We map known categories to an
// icon + gradient on the frontend so the design stays consistent.
// Any unknown/custom category gets a sensible default.
const categoryVisuals = {
  "Practice Excellence":    { icon: Trophy,        color: "from-purple-500 to-indigo-600" },
  "Leadership":             { icon: Target,        color: "from-blue-500 to-cyan-600" },
  "Compliance":             { icon: ClipboardList, color: "from-emerald-500 to-teal-600" },
  "Participant Experience": { icon: Heart,         color: "from-pink-500 to-rose-600" },
  "Business Growth":        { icon: TrendingUp,    color: "from-amber-500 to-orange-600" },
  "Technology & Tools":     { icon: Laptop,        color: "from-slate-500 to-slate-700" },
};

const defaultVisual = { icon: Lightbulb, color: "from-purple-500 to-pink-600" };

const typeIconMap = {
  guide: FileText,
  video: Video,
  template: FolderOpen,
  webinar: Mic,
};

const typeColors = {
  guide: "bg-blue-50 text-blue-700",
  video: "bg-red-50 text-red-700",
  template: "bg-emerald-50 text-emerald-700",
  webinar: "bg-purple-50 text-purple-700",
};

// ─── Thumbnail with graceful fallback to the type icon ─────────────
// item.thumbnail is a full S3 public URL (from FileUploadPreview). If it
// is missing OR fails to load, we show the type icon tile instead so the
// row never renders a broken image.
const ResourceThumb = ({ item }) => {
  const TypeIcon = typeIconMap[item.type] || FileText;
  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <div
        className={`${
          item.thumbnail ? "hidden" : ""
        } flex items-center justify-center w-full h-full`}
      >
        <TypeIcon className="w-6 h-6 text-slate-400" />
      </div>
    </div>
  );
};

const InnovationLabPage = () => {
  const dispatch = useDispatch();
  const { groupedResources, status } = useSelector((s) => s.innovationLab);
  const loading = status === ASYNC_STATUS.LOADING;

  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchInnovationLabResources({ group_by_category: 1 }));
  }, [dispatch]);

  // Auto-expand first category on initial load
  useEffect(() => {
    if (groupedResources.length > 0 && expanded === null) {
      setExpanded(groupedResources[0].category);
    }
  }, [groupedResources, expanded]);

  const allItems = groupedResources.flatMap((g) =>
    g.items.map((i) => ({ ...i, category: g.category })),
  );

  const searchResults =
    search.length > 1
      ? allItems.filter((i) =>
          i.title.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  const openResource = (item) => {
    if (item.external_url) {
      window.open(item.external_url, "_blank", "noopener,noreferrer");
    } else if (item.attachment_url) {
      window.open(item.attachment_url, "_blank", "noopener,noreferrer");
    } else {
      setSelectedItem(selectedItem === item.id ? null : item.id);
    }
  };

  return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Innovation Lab</h1>
          <p className="text-sm text-slate-500 mt-1">
            Professional development resources, training, and sector innovation
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20 max-h-72 overflow-y-auto">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setExpanded(item.category);
                    setSearch("");
                    setSelectedItem(item.id);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0"
                >
                  <ResourceThumb item={item} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {item.category}
                      {item.duration ? ` · ${item.duration}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && groupedResources.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && groupedResources.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No resources available</p>
            <p className="text-sm text-slate-400 mt-1">
              Check back soon for new content
            </p>
          </div>
        )}

        {/* Category Folders */}
        <div className="space-y-3">
          {groupedResources.map((cat) => {
            const visual = categoryVisuals[cat.category] || defaultVisual;
            const CatIcon = visual.icon;
            const isOpen = expanded === cat.category;

            return (
              <div
                key={cat.category}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : cat.category)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visual.color} flex items-center justify-center`}
                    >
                      <CatIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-slate-800">
                        {cat.category}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {cat.count} resource{cat.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                      {cat.items.map((item) => {
                        const isSelected = selectedItem === item.id;
                        const hasLink =
                          item.external_url || item.attachment_url;
                        const isPaid = Number(item.is_paid) === 1;
                        const ActionIcon = item.attachment_url
                          ? Download
                          : item.external_url
                            ? ExternalLink
                            : ChevronRight;

                        return (
                          <button
                            key={item.id}
                            onClick={() => openResource(item)}
                            className={`flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 hover:border-purple-200 border transition-all text-left group ${
                              isSelected
                                ? "bg-purple-50 border-purple-300"
                                : "bg-slate-50 border-transparent"
                            }`}
                          >
                            {/* Thumbnail (or type-icon fallback) */}
                            <ResourceThumb item={item} />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-1">
                                {item.title}
                              </p>

                              {item.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              <div className="flex items-center flex-wrap gap-2 mt-2">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                    typeColors[item.type] ||
                                    "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {item.type}
                                </span>
                                {item.duration && (
                                  <span className="text-xs text-slate-400">
                                    {item.duration}
                                  </span>
                                )}
                                {isPaid && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                    <Lock className="w-2.5 h-2.5" />
                                    Paid
                                  </span>
                                )}
                              </div>

                              {item.attachment_name && (
                                <p className="text-[11px] text-slate-400 mt-2 truncate">
                                  {item.attachment_name}
                                </p>
                              )}
                            </div>

                            <ActionIcon
                              className={`w-4 h-4 mt-1 transition-colors flex-shrink-0 ${
                                hasLink
                                  ? "text-slate-300 group-hover:text-purple-500"
                                  : "text-slate-300 group-hover:text-purple-500"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Full description panel when a no-link item is selected */}
                    {cat.items
                      .filter(
                        (i) =>
                          selectedItem === i.id &&
                          i.description &&
                          !i.external_url &&
                          !i.attachment_url,
                      )
                      .map((item) => (
                        <div
                          key={`desc-${item.id}`}
                          className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl"
                        >
                          <p className="text-sm font-semibold text-slate-800 mb-1">
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-600 whitespace-pre-line">
                            {item.description}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
  );
};

export default InnovationLabPage;