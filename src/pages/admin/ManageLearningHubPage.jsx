import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  adminFetchLearningModules,
  adminDeleteLearningModule,
} from "../../store/actions/learningActions";
import { ASYNC_STATUS } from "../../constants";

const ITEMS_PER_PAGE = 9;

const DIFFICULTY_OPTIONS = [
  { key: "all", label: "All Levels" },
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All Status" },
  { key: "1", label: "Active" },
  { key: "0", label: "Inactive" },
];

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
  intermediate: "bg-amber-50 text-amber-700 border-amber-100",
  advanced: "bg-red-50 text-red-700 border-red-100",
};

const ManageLearningHubPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { modules, status, total, totalPages } = useSelector((s) => s.learning);
  const loading = status === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadModules = useCallback(() => {
    dispatch(
      adminFetchLearningModules({
        search: searchTerm,
        difficulty: difficultyFilter,
        status: statusFilter,
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, searchTerm, difficultyFilter, statusFilter, currentPage]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteLearningModule(deleteId)).unwrap();
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Learning Hub"
        description="Create, edit, and manage learning modules and lessons"
        icon={BookOpen}
        actions={
          <button
            onClick={() => navigate("/admin/learning-hub/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" /> Create Module
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules by title, category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[140px]"
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[140px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        {loading
          ? "Loading..."
          : `${total} module${total !== 1 ? "s" : ""} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            No learning modules found
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Create your first module to get started
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              {/* Thumbnail or gradient header */}
              <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 relative">
                {mod.thumbnail && (
                  <img
                    src={mod.thumbnail}
                    alt={mod.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {Number(mod.is_paid) === 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
                      <Lock className="w-2.5 h-2.5" /> PAID
                    </span>
                  )}
                  {Number(mod.status) === 1 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/90 text-emerald-700 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/90 text-slate-500 px-2 py-0.5 rounded-full">
                      <XCircle className="w-2.5 h-2.5" /> INACTIVE
                    </span>
                  )}
                </div>
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
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border capitalize ${
                        difficultyColors[mod.difficulty?.toLowerCase()] ||
                        "bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >
                      {mod.difficulty}
                    </span>
                  )}
                </div>

                        {mod.audience && (
          <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
            {mod.audience === "provider"
              ? "Provider"
              : mod.audience === "participants"
              ? "Participants"
              : "Both"}
          </span>
        )}

                <h3 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {mod.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>
                    {mod.lessons_count ?? mod.lessons?.length ?? 0} lessons
                  </span>
                </div>

                <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/admin/learning-hub/${mod.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/learning-hub/edit/${mod.id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(mod.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pg
                    ? "bg-purple-600 text-white"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Module?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The module and all its lessons
                will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLearningHubPage;
