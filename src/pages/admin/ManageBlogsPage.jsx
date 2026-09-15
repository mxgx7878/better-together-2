import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Newspaper,
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  Clock,
  CalendarClock,
  ExternalLink,
  Tags,
  FileText,
  CheckCircle2,
  Archive,
  BarChart3,
  ImageIcon,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchBlogPosts,
  adminFetchBlogStats,
  adminFetchBlogCategories,
  adminDeleteBlogPost,
  adminUpdateBlogPostStatus,
} from "../../store/actions/blogActions";
import { ASYNC_STATUS } from "../../constants";
import {
  categoryStyle,
  formatShortDate,
  readTimeLabel,
  STATUS_STYLES,
} from "../../utils/blog";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { key: "all", label: "All status" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

const ManageBlogsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, categories, stats, status, total, totalPages } = useSelector(
    (s) => s.blog,
  );
  const loading = status === ASYNC_STATUS.LOADING;

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(adminFetchBlogCategories());
    dispatch(adminFetchBlogStats());
  }, [dispatch]);

  const loadPosts = useCallback(() => {
    dispatch(
      adminFetchBlogPosts({
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, searchTerm, categoryFilter, statusFilter, currentPage]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteBlogPost(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
      dispatch(adminFetchBlogStats());
      // The page may now be empty — step back rather than showing nothing.
      if (posts.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
      else loadPosts();
    } catch {
      // The thunk already surfaced a toast.
    } finally {
      setDeleting(false);
    }
  };

  const patchPost = async (post, payload) => {
    setBusyId(post.id);
    try {
      await dispatch(adminUpdateBlogPostStatus({ id: post.id, ...payload })).unwrap();
      dispatch(adminFetchBlogStats());
    } catch {
      // Toast handled in the thunk.
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Blog"
        description="Write, publish and optimise articles for search"
        icon={Newspaper}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/blog/categories")}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm"
            >
              <Tags className="w-4 h-4" /> Categories
            </button>
            <button
              onClick={() => navigate("/admin/blog/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
            >
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>
        }
      />

      {/* ─── Stats ──────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={FileText} label="Total posts" value={stats.total} tone="slate" />
          <StatCard icon={CheckCircle2} label="Published" value={stats.published} tone="emerald" />
          <StatCard icon={Edit2} label="Drafts" value={stats.draft} tone="amber" />
          <StatCard icon={CalendarClock} label="Scheduled" value={stats.scheduled} tone="blue" />
          <StatCard icon={BarChart3} label="Total views" value={stats.total_views} tone="purple" />
        </div>
      )}

      {/* ─── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts by title or content…"
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
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[150px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        {loading ? "Loading…" : `${total} post${total === 1 ? "" : "s"} found`}
      </p>

      {/* ─── List ───────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No posts found</p>
          <p className="text-sm text-slate-400 mt-1">
            Adjust your filters, or write your first article.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              busy={busyId === post.id}
              onEdit={() => navigate(`/admin/blog/edit/${post.id}`)}
              onDelete={() => setDeleteTarget(post)}
              onTogglePublish={() =>
                patchPost(post, {
                  status: post.status === "published" ? "draft" : "published",
                })
              }
              onToggleFeatured={() =>
                patchPost(post, { is_featured: post.is_featured ? 0 : 1 })
              }
            />
          ))}
        </div>
      )}

      {/* ─── Pagination ─────────────────────────────────── */}
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

      {/* ─── Delete confirmation ────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete post?</h3>
            <p className="text-sm text-slate-500 mb-6">
              “{deleteTarget.title}” will be permanently removed, and its URL
              will start returning a 404. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
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

/* ─── Pieces ─────────────────────────────────────────────────── */

const TONES = {
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
};

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${TONES[tone]}`}>
      {Icon && <Icon className="w-4 h-4" />}
    </div>
    <div className="min-w-0">
      <p className="text-lg font-bold text-slate-800 leading-tight">{value ?? 0}</p>
      <p className="text-[11px] text-slate-400 truncate">{label}</p>
    </div>
  </div>
);

const PostRow = ({
  post,
  busy,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}) => {
  const style = categoryStyle(post.category);
  const isPublished = post.status === "published";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-4">
      {/* Thumbnail */}
      <div
        className={`w-full sm:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${style.gradient} relative`}
      >
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white/70" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
              STATUS_STYLES[post.status] || STATUS_STYLES.draft
            }`}
          >
            {post.status === "archived" && <Archive className="w-2.5 h-2.5" />}
            {post.status}
          </span>

          {post.is_scheduled && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              <CalendarClock className="w-2.5 h-2.5" />
              Publishes {formatShortDate(post.published_at)}
            </span>
          )}

          {post.is_featured === 1 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
            </span>
          )}

          {post.noindex === 1 && (
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              noindex
            </span>
          )}

          {post.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
              {post.category.name}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
          {post.excerpt || "No excerpt"}
        </p>

        <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400 mt-2">
          <span className="font-mono text-slate-400 truncate max-w-[220px]">
            /blog/{post.slug}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {readTimeLabel(post.reading_time)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.views}
          </span>
          <span>{formatShortDate(post.published_at || post.created_at)}</span>
          {post.author?.name && <span>by {post.author.name}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center justify-end gap-1 flex-shrink-0">
        <button
          onClick={onTogglePublish}
          disabled={busy}
          title={isPublished ? "Move back to draft" : "Publish now"}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
            isPublished
              ? "text-slate-600 hover:bg-slate-100"
              : "text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={onToggleFeatured}
          disabled={busy}
          title={post.is_featured ? "Remove from featured" : "Mark as featured"}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
            post.is_featured
              ? "text-amber-600 hover:bg-amber-50"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${post.is_featured ? "fill-amber-500 text-amber-500" : ""}`}
          />
          {post.is_featured ? "Featured" : "Feature"}
        </button>

        <div className="flex items-center gap-1">
          {isPublished && !post.is_scheduled && (
            <Link
              to={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View live post"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <button
            onClick={onEdit}
            title="Edit"
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogsPage;
