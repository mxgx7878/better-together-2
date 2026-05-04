import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  Search,
  Loader2,
  Lock,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { fetchLearningModules } from "../../store/actions/learningActions";
import { ASYNC_STATUS } from "../../constants";
import { selectIsPaid } from "../../store/slices/authSlice";
import FeatureGate from "../../components/common/FeatureGate";

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-red-50 text-red-700",
};

const LearningHubPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPaid = useSelector(selectIsPaid);

  const { modules, status } = useSelector((s) => s.learning);
  const loading = status === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadModules = useCallback(() => {
    dispatch(
      fetchLearningModules({
        search: searchTerm || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        status: 1,
      }),
    );
  }, [dispatch, searchTerm, categoryFilter]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const categories = ["All", ...new Set(modules.map((m) => m.category).filter(Boolean))];

  return (
    <FeatureGate featureName="Learning Hub">
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Learning Hub"
        description="Upskill with curated modules on NDIS, service delivery, and best practices"
        icon={GraduationCap}
      />

      {/* Search & Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No learning modules available</p>
          <p className="text-sm text-slate-400 mt-1">
            Check back soon for new content
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const isLocked = Number(mod.is_paid) === 1 && !isPaid;
            return (
              <div
                key={mod.id}
                onClick={() => !isLocked && navigate(`/provider/learning/${mod.id}`)}
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${
                  isLocked
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                }`}
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 relative">
                  {mod.thumbnail && (
                    <img
                      src={mod.thumbnail}
                      alt={mod.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur rounded-full p-3">
                        <Lock className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {mod.category && (
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {mod.category}
                      </span>
                    )}
                    {mod.difficulty && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                          difficultyColors[mod.difficulty?.toLowerCase()] ||
                          "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {mod.difficulty}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4">
                      {mod.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {mod.lessons_count ?? mod.lessons?.length ?? 0} lessons
                    </span>
                    {isLocked ? (
                      <a
                        href="/provider/upgrade"
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Upgrade <ChevronRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </FeatureGate>
  );
};

export default LearningHubPage;
