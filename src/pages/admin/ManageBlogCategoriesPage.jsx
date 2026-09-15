import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ArrowLeft,
  Search,
  X,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import InputField from "../../components/common/InputField";
import {
  adminFetchBlogCategories,
  adminCreateBlogCategory,
  adminUpdateBlogCategory,
  adminDeleteBlogCategory,
} from "../../store/actions/blogActions";
import { ASYNC_STATUS } from "../../constants";
import { CATEGORY_COLORS, categoryStyle, slugify } from "../../utils/blog";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  meta_title: "",
  meta_description: "",
  color: "purple",
  sort_order: 0,
  status: 1,
};

const ManageBlogCategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, categoryStatus } = useSelector((s) => s.blog);
  const loading = categoryStatus === ASYNC_STATUS.LOADING;

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | { ...form, id? }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);

  useEffect(() => {
    dispatch(adminFetchBlogCategories());
  }, [dispatch]);

  const visible = categories.filter((c) =>
    `${c.name} ${c.slug} ${c.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditing({ ...emptyForm, sort_order: categories.length });
    setSlugLocked(false);
    setErrors({});
  };

  const openEdit = (category) => {
    setEditing({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      meta_title: category.meta_title || "",
      meta_description: category.meta_description || "",
      color: category.color || "purple",
      sort_order: category.sort_order ?? 0,
      status: Number(category.status),
    });
    setSlugLocked(true);
    setErrors({});
  };

  const setField = (name, value) => {
    setEditing((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const save = async () => {
    if (!editing.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: editing.name.trim(),
        slug: editing.slug || undefined,
        description: editing.description || null,
        meta_title: editing.meta_title || null,
        meta_description: editing.meta_description || null,
        color: editing.color,
        sort_order: Number(editing.sort_order) || 0,
        status: Number(editing.status),
      };

      if (editing.id) {
        await dispatch(
          adminUpdateBlogCategory({ id: editing.id, categoryData: payload }),
        ).unwrap();
      } else {
        await dispatch(adminCreateBlogCategory(payload)).unwrap();
      }
      setEditing(null);
    } catch {
      // Toast raised in the thunk.
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteBlogCategory(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
    } catch {
      // Toast raised in the thunk.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          aria-label="Back to posts"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <PageHeader
            title="Blog Categories"
            description="Organise articles and give each category its own search listing"
            icon={Tags}
            actions={
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
              >
                <Plus className="w-4 h-4" /> New Category
              </button>
            }
          />
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        />
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Tags className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No categories yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Create one to group your articles.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {visible.map((category) => {
            const style = categoryStyle(category);
            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex gap-3"
              >
                <div
                  className={`w-1.5 rounded-full flex-shrink-0 bg-gradient-to-b ${style.gradient}`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">
                      {category.name}
                    </h3>
                    {Number(category.status) === 1 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Eye className="w-2.5 h-2.5" /> Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-2.5 h-2.5" /> Hidden
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {category.description || "No description"}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="font-mono truncate">/blog?category={category.slug}</span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {category.posts_count ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GripVertical className="w-3 h-3" />
                      {category.sort_order}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    aria-label={`Delete ${category.name}`}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create / edit modal ────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-8">
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                {editing.id ? "Edit category" : "New category"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <InputField
                label="Name"
                name="name"
                required
                value={editing.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditing((prev) => ({
                    ...prev,
                    name: value,
                    slug: slugLocked ? prev.slug : slugify(value),
                  }));
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="NDIS Updates"
                error={errors.name}
              />

              <div>
                <label
                  htmlFor="category-slug"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  URL slug
                </label>
                <input
                  id="category-slug"
                  value={editing.slug}
                  onChange={(e) => {
                    setSlugLocked(true);
                    setField("slug", slugify(e.target.value));
                  }}
                  placeholder="ndis-updates"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="category-description"
                  rows={2}
                  value={editing.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Shown under the heading on the category view."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 resize-y"
                />
              </div>

              {/* Colour */}
              <div>
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  Colour
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((color) => {
                    const style = categoryStyle({ color });
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setField("color", color)}
                        aria-label={color}
                        aria-pressed={editing.color === color}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} transition-all ${
                          editing.color === color
                            ? "ring-2 ring-offset-2 ring-slate-800 scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Sort order"
                  name="sort_order"
                  type="number"
                  min="0"
                  value={editing.sort_order}
                  onChange={(e) => setField("sort_order", e.target.value)}
                />
                <div>
                  <label
                    htmlFor="category-status"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Visibility
                  </label>
                  <select
                    id="category-status"
                    value={editing.status}
                    onChange={(e) => setField("status", Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
                  >
                    <option value={1}>Visible</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>

              {/* SEO */}
              <details className="rounded-xl border border-slate-200 p-3">
                <summary className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Search engine listing
                </summary>
                <div className="space-y-3 mt-3">
                  <InputField
                    label="Meta title"
                    name="meta_title"
                    value={editing.meta_title}
                    onChange={(e) => setField("meta_title", e.target.value)}
                    placeholder={editing.name || "Defaults to the category name"}
                  />
                  <div>
                    <label
                      htmlFor="category-meta-description"
                      className="block text-sm font-semibold text-slate-700 mb-1.5"
                    >
                      Meta description
                    </label>
                    <textarea
                      id="category-meta-description"
                      rows={2}
                      value={editing.meta_description}
                      onChange={(e) => setField("meta_description", e.target.value)}
                      placeholder="Defaults to the description above"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 resize-y"
                    />
                  </div>
                </div>
              </details>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing.id ? "Save changes" : "Create category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete confirmation ────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete category?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {deleteTarget.posts_count > 0
                ? `“${deleteTarget.name}” has ${deleteTarget.posts_count} post(s). They will stay published but become uncategorised.`
                : `“${deleteTarget.name}” will be permanently removed.`}
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
                onClick={remove}
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

export default ManageBlogCategoriesPage;
