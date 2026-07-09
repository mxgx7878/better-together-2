import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  Search,
  Loader2,
  Lock,
  ChevronRight,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  fetchLearningModules,
  fetchMyLearningProgress,
} from "../../store/actions/learningActions";
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

  const { modules, status, progress } = useSelector((s) => s.learning);
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
    dispatch(fetchMyLearningProgress());
  }, [loadModules, dispatch]);

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed_at).map((p) => p.lesson_id),
  );

  const getModuleProgress = (mod) => {
    const total = mod?.lessons_count || mod?.lessons?.length || 0;
    if (!total || !mod.lessons) return { total, completed: 0, pct: 0 };
    const completed = mod.lessons.filter((l) =>
      completedLessonIds.has(l.id),
    ).length;
    return {
      total,
      completed,
      pct: total ? Math.round((completed / total) * 100) : 0,
    };
  };

  const categories = [
    "All",
    ...new Set(modules.map((m) => m.category).filter(Boolean)),
  ];

  // Aggregate stats
  const totalLessons = modules.reduce(
    (sum, m) => sum + (m.lessons_count ?? m.lessons?.length ?? 0),
    0,
  );
  const completedLessons = modules.reduce((sum, m) => {
    if (!m.lessons) return sum;
    return sum + m.lessons.filter((l) => completedLessonIds.has(l.id)).length;
  }, 0);
  const overallPct = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const completedModules = modules.filter((m) => {
    const p = getModuleProgress(m);
    return p.total > 0 && p.completed === p.total;
  }).length;

  const inProgressModules = modules.filter((m) => {
    const p = getModuleProgress(m);
    return p.completed > 0 && p.completed < p.total;
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Learning Hub</h1>
        <p className="text-sm text-slate-500 mt-1">
          Build your knowledge and confidence with guided learning modules
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Your Learning Progress</h2>
            <p className="text-blue-100 text-sm mt-1">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-lg font-bold">{overallPct}%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-200" />
            <p className="text-xl sm:text-2xl font-bold">{completedModules}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <p className="text-xl sm:text-2xl font-bold">{inProgressModules}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">In Progress</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-pink-200" />
            <p className="text-xl sm:text-2xl font-bold">
              {modules.length - completedModules - inProgressModules}
            </p>
            <p className="text-[10px] sm:text-xs text-blue-200">Not Started</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none"
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
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            No learning modules available
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Check back soon for new content
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const isLocked = Number(mod.is_paid) === 1 && !isPaid;
            const { total, completed, pct } = getModuleProgress(mod);
            return (
              <div
                key={mod.id}
                onClick={() =>
                  !isLocked && navigate(`/participant/learning/${mod.id}`)
                }
                className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${
                  isLocked
                    ? "border-slate-200 opacity-80 cursor-not-allowed"
                    : pct === 100
                      ? "border-emerald-200 cursor-pointer hover:shadow-md"
                      : "border-slate-100 cursor-pointer hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-800 line-clamp-1">
                          {mod.title}
                        </h3>
                        {isLocked && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </div>
                      {mod.category && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {mod.category}
                        </p>
                      )}
                    </div>
                  </div>
                  {pct === 100 && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  )}
                </div>

                {mod.description && (
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                    {mod.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-4">
                  {mod.difficulty && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        difficultyColors[mod.difficulty?.toLowerCase()] ||
                        "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {mod.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {total} lesson{total !== 1 ? "s" : ""}
                  </span>
                </div>

                {!isLocked && total > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>
                        {completed}/{total} completed
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct === 100 ? "bg-emerald-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                {isLocked && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <a
                      href="/participant/upgrade"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Upgrade to access <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LearningHubPage;
