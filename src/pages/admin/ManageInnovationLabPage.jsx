import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  FolderOpen,
  Mic,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchInnovationLabResources,
  adminDeleteInnovationLabResource,
  fetchInnovationLabCategories,
} from "../../store/actions/innovationLabActions";
import { ASYNC_STATUS } from "../../constants";

const ITEMS_PER_PAGE = 9;

const TYPE_OPTIONS = [
  { key: "all", label: "All Types" },
  { key: "guide", label: "Guide" },
  { key: "video", label: "Video" },
  { key: "template", label: "Template" },
  { key: "webinar", label: "Webinar" },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All Status" },
  { key: "1", label: "Published" },
  { key: "0", label: "Draft" },
];

const typeIconMap = {
  guide: FileText,
  video: Video,
  template: FolderOpen,
  webinar: Mic,
};

const typeColors = {
  guide: "bg-blue-50 text-blue-700 border-blue-100",
  video: "bg-red-50 text-red-700 border-red-100",
  template: "bg-emerald-50 text-emerald-700 border-emerald-100",
  webinar: "bg-purple-50 text-purple-700 border-purple-100",
};

const ManageInnovationLabPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { resources, categories, status, total, totalPages } = useSelector(
    (s) => s.innovationLab,
  );
  const loading = status === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

  // Load categories once for filter dropdown
  useEffect(() => {
    dispatch(fetchInnovationLabCategories());
  }, [dispatch]);

  const loadResources = useCallback(() => {
    dispatch(
      adminFetchInnovationLabResources({
        search: searchTerm,
        category: categoryFilter,
        type: typeFilter,
        status: statusFilter,
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
      }),
    );
  }, [
    dispatch,
    searchTerm,
    categoryFilter,
    typeFilter,
    statusFilter,
    currentPage,
  ]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteInnovationLabResource(deleteId)).unwrap();
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Innovation Lab"
        description="Create, edit, and manage professional development resources"
        icon={Lightbulb}
        actions={
          <button
            onClick={() => navigate("/admin/innovation-lab/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" /> Create Resource
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources by title, category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[180px]"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[140px]"
        >
          {TYPE_OPTIONS.map((opt) => (
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
          : `${total} resource${total !== 1 ? "s" : ""} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No resources found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your filters or create a new resource.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => {
            const TypeIcon = typeIconMap[r.type] || FileText;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize border ${typeColors[r.type]}`}
                    >
                      <TypeIcon className="w-3 h-3" />
                      {r.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Number(r.is_paid) === 1 && (
                      <span
                        title="Paid tier"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"
                      >
                        <Lock className="w-2.5 h-2.5" /> Paid
                      </span>
                    )}
                    {Number(r.status) === 1 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-2.5 h-2.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-2.5 h-2.5" /> Draft
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
                  {r.description || "No description"}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-medium text-slate-700">
                    {r.category}
                  </span>
                  {r.duration && (
                    <>
                      <span>·</span>
                      <span>{r.duration}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                  <button
                    onClick={() =>
                      navigate(`/admin/innovation-lab/edit/${r.id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete resource?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. The resource will be permanently
              removed.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInnovationLabPage;