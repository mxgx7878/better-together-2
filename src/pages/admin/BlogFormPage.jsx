import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  Save,
  Newspaper,
  Search,
  Globe,
  Star,
  X,
  Plus,
  Eye,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import InputField from "../../components/common/InputField";
import FileUploadPreview from "../../components/common/FileUploadPreview";
import RichTextEditor from "../../components/common/RichTextEditor";
import {
  adminCreateBlogPost,
  adminUpdateBlogPost,
  adminFetchBlogPostById,
  adminFetchBlogCategories,
} from "../../store/actions/blogActions";
import { clearSelectedPost } from "../../store/slices/blogSlice";
import { ASYNC_STATUS } from "../../constants";
import { slugify } from "../../utils/blog";

// Search engines truncate around these lengths — the meters below turn amber
// past the ideal and red past the hard limit.
const META_TITLE_IDEAL = 60;
const META_DESC_IDEAL = 160;

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  blog_category_id: "",
  featured_image: "",
  featured_image_alt: "",
  tags: [],
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_image: "",
  noindex: 0,
  status: "draft",
  is_featured: 0,
  published_at: "",
};

/** "2026-03-22T14:05:00.000000Z" → "2026-03-22T14:05" for datetime-local. */
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const BlogFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedPost, categories, postStatus } = useSelector((s) => s.blog);
  const loading = isEditMode && postStatus === ASYNC_STATUS.LOADING;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  // Once the author touches the slug it stops tracking the title.
  const [slugLocked, setSlugLocked] = useState(false);

  useEffect(() => {
    dispatch(adminFetchBlogCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) dispatch(adminFetchBlogPostById(id));
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [isEditMode, id, dispatch]);

  // Hydrate the form once the post arrives.
  useEffect(() => {
    if (!isEditMode || !selectedPost || String(selectedPost.id) !== String(id)) {
      return;
    }

    setForm({
      title: selectedPost.title || "",
      slug: selectedPost.slug || "",
      excerpt: selectedPost.excerpt || "",
      content: selectedPost.content || "",
      blog_category_id: selectedPost.blog_category_id ?? "",
      featured_image: selectedPost.featured_image || "",
      featured_image_alt: selectedPost.featured_image_alt || "",
      tags: selectedPost.tags || [],
      meta_title: selectedPost.meta_title || "",
      meta_description: selectedPost.meta_description || "",
      meta_keywords: selectedPost.meta_keywords || "",
      canonical_url: selectedPost.canonical_url || "",
      og_image: selectedPost.og_image || "",
      noindex: Number(selectedPost.noindex) || 0,
      status: selectedPost.status || "draft",
      is_featured: Number(selectedPost.is_featured) || 0,
      published_at: toLocalInput(selectedPost.published_at),
    });
    setSlugLocked(true);
  }, [isEditMode, selectedPost, id]);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const handleTitle = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugLocked ? prev.slug : slugify(value),
    }));
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (!tag) return;
    if (form.tags.length >= 20) {
      toast.error("Up to 20 tags per post.");
      return;
    }
    if (form.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setTagInput("");
      return;
    }
    setField("tags", [...form.tags, tag]);
    setTagInput("");
  };

  // ─── SEO previews & meters ──────────────────────────────────────
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const effectiveMetaTitle = form.meta_title || form.title;
  const effectiveMetaDesc = form.meta_description || form.excerpt;

  const seoChecks = useMemo(() => {
    const plain = form.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = plain ? plain.split(" ").length : 0;

    return [
      {
        ok: form.title.length > 0 && form.title.length <= 70,
        label: "Title is present and under 70 characters",
      },
      {
        ok: effectiveMetaDesc.length >= 70 && effectiveMetaDesc.length <= META_DESC_IDEAL,
        label: `Meta description is 70–${META_DESC_IDEAL} characters`,
      },
      { ok: Boolean(form.featured_image), label: "Featured image set" },
      {
        ok: !form.featured_image || Boolean(form.featured_image_alt),
        label: "Featured image has alt text",
      },
      { ok: Boolean(form.blog_category_id), label: "Category assigned" },
      { ok: words >= 300, label: `Body is at least 300 words (${words})` },
      { ok: form.tags.length > 0, label: "At least one tag" },
      { ok: /<h[23]/i.test(form.content), label: "Body uses subheadings (H2/H3)" },
    ];
  }, [form, effectiveMetaDesc]);

  const seoScore = Math.round(
    (seoChecks.filter((c) => c.ok).length / seoChecks.length) * 100,
  );

  // ─── Submit ─────────────────────────────────────────────────────
  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.content.trim()) next.content = "Write something before saving";
    if (form.canonical_url && !/^https?:\/\//i.test(form.canonical_url)) {
      next.canonical_url = "Must be a full URL starting with http(s)://";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (overrideStatus) => {
    const status = overrideStatus || form.status;

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        blog_category_id: form.blog_category_id || null,
        // Let the backend derive these when the author left them blank.
        slug: form.slug || undefined,
        excerpt: form.excerpt || undefined,
        meta_title: form.meta_title || undefined,
        meta_description: form.meta_description || undefined,
        canonical_url: form.canonical_url || undefined,
        og_image: form.og_image || undefined,
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : undefined,
      };

      if (isEditMode) {
        await dispatch(adminUpdateBlogPost({ id, postData: payload })).unwrap();
      } else {
        await dispatch(adminCreateBlogPost(payload)).unwrap();
      }
      navigate("/admin/blog");
    } catch {
      // Toast raised in the thunk.
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
      </div>
    );
  }

  const busy = saving || uploading;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/blog")}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            aria-label="Back to posts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              {isEditMode ? "Edit Post" : "New Post"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditMode
                ? "Update the article and its search listing"
                : "Write an article and publish it to the public blog"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode && form.status === "published" && (
            <Link
              to={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 text-sm"
            >
              <Eye className="w-4 h-4" /> View
            </Link>
          )}
          <button
            onClick={() => submit("draft")}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 text-sm disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => submit("published")}
            disabled={busy}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Main column ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <InputField
              label="Title"
              name="title"
              required
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Understanding Your NDIS Plan: A Complete Guide"
              error={errors.title}
            />

            {/* Slug */}
            <div className="mt-4">
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                URL slug
              </label>
              <div className="flex items-stretch rounded-xl border-2 border-slate-200 focus-within:border-purple-500 overflow-hidden">
                <span className="px-3 flex items-center text-xs text-slate-400 bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                  /blog/
                </span>
                <input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugLocked(true);
                    setField("slug", slugify(e.target.value));
                  }}
                  placeholder="auto-generated-from-title"
                  className="flex-1 px-3 py-3 text-sm outline-none min-w-0"
                />
                {slugLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugLocked(false);
                      setField("slug", slugify(form.title));
                    }}
                    title="Re-sync slug with the title"
                    className="px-3 text-slate-400 hover:text-purple-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isEditMode && (
                <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                  Changing the slug breaks existing links to this article.
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="mt-4">
              <label
                htmlFor="excerpt"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="A short summary shown on cards and in search results. Leave blank to generate it from the article."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y"
              />
              <Counter value={form.excerpt.length} ideal={200} />
            </div>
          </Card>

          <Card>
            <RichTextEditor
              label="Article content"
              value={form.content}
              onChange={(html) => setField("content", html)}
              error={errors.content}
              folder="blog/content"
            />
          </Card>
        </div>

        {/* ─── Sidebar ──────────────────────────────────── */}
        <div className="space-y-5">
          {/* Publishing */}
          <Card title="Publishing">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="published_at"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Publish date
                </label>
                <input
                  id="published_at"
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(e) => setField("published_at", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  A future date with status “Published” schedules the post — it
                  stays hidden until then.
                </p>
              </div>

              <div>
                <label
                  htmlFor="blog_category_id"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Category
                </label>
                <select
                  id="blog_category_id"
                  value={form.blog_category_id}
                  onChange={(e) => setField("blog_category_id", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
                >
                  <option value="">Uncategorised</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Link
                  to="/admin/blog/categories"
                  className="text-xs text-purple-600 hover:text-purple-700 mt-1 inline-block"
                >
                  Manage categories →
                </Link>
              </div>

              <Toggle
                icon={Star}
                label="Feature this post"
                hint="Featured posts headline the blog index."
                checked={form.is_featured === 1}
                onChange={(v) => setField("is_featured", v ? 1 : 0)}
              />
            </div>
          </Card>

          {/* Media */}
          <Card title="Featured image">
            <FileUploadPreview
              value={form.featured_image}
              onChange={(url) => setField("featured_image", url)}
              folder="blog/featured"
              accept="image/*"
              maxSizeMb={5}
              loading={setUploading}
              placeholder="Upload a cover image (1200×630 works best)"
            />
            <div className="mt-3">
              <InputField
                label="Alt text"
                name="featured_image_alt"
                value={form.featured_image_alt}
                onChange={(e) => setField("featured_image_alt", e.target.value)}
                placeholder="Participant reviewing an NDIS plan"
              />
              <p className="text-xs text-slate-400 mt-1">
                Describes the image for screen readers and image search.
              </p>
            </div>
          </Card>

          {/* Tags */}
          <Card title="Tags">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                aria-label="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() =>
                        setField("tags", form.tags.filter((t) => t !== tag))
                      }
                      aria-label={`Remove ${tag}`}
                      className="hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* SEO */}
          <Card
            title="Search engine listing"
            icon={Search}
            aside={
              <span
                className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                  seoScore >= 80
                    ? "bg-emerald-50 text-emerald-700"
                    : seoScore >= 50
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                }`}
              >
                {seoScore}%
              </span>
            }
          >
            {/* Google-style preview */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-white mb-4">
              <p className="text-[11px] text-slate-500 truncate">
                {origin}/blog/{form.slug || "your-post-slug"}
              </p>
              <p className="text-[15px] text-[#1a0dab] leading-snug truncate mt-0.5">
                {effectiveMetaTitle || "Your post title appears here"}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                {effectiveMetaDesc ||
                  "Your meta description appears here — write 70 to 160 characters that make someone want to click."}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <InputField
                  label="Meta title"
                  name="meta_title"
                  value={form.meta_title}
                  onChange={(e) => setField("meta_title", e.target.value)}
                  placeholder={form.title || "Defaults to the post title"}
                />
                <Counter value={effectiveMetaTitle.length} ideal={META_TITLE_IDEAL} />
              </div>

              <div>
                <label
                  htmlFor="meta_description"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Meta description
                </label>
                <textarea
                  id="meta_description"
                  rows={3}
                  value={form.meta_description}
                  onChange={(e) => setField("meta_description", e.target.value)}
                  placeholder="Defaults to the excerpt"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y"
                />
                <Counter value={effectiveMetaDesc.length} ideal={META_DESC_IDEAL} />
              </div>

              <InputField
                label="Focus keywords"
                name="meta_keywords"
                value={form.meta_keywords}
                onChange={(e) => setField("meta_keywords", e.target.value)}
                placeholder="ndis plan, plan management, support budget"
              />

              <InputField
                label="Canonical URL"
                name="canonical_url"
                value={form.canonical_url}
                onChange={(e) => setField("canonical_url", e.target.value)}
                placeholder="Leave blank unless this was published elsewhere first"
                error={errors.canonical_url}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Social share image
                </label>
                <FileUploadPreview
                  value={form.og_image}
                  onChange={(url) => setField("og_image", url)}
                  folder="blog/og"
                  accept="image/*"
                  maxSizeMb={5}
                  loading={setUploading}
                  placeholder="Optional — falls back to the featured image"
                />
              </div>

              <Toggle
                icon={Globe}
                label="Hide from search engines"
                hint="Adds noindex, nofollow and drops the post from the sitemap."
                checked={form.noindex === 1}
                onChange={(v) => setField("noindex", v ? 1 : 0)}
              />
            </div>

            {/* Checklist */}
            <ul className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
              {seoChecks.map((check) => (
                <li
                  key={check.label}
                  className={`flex items-start gap-2 text-xs ${
                    check.ok ? "text-slate-500" : "text-amber-700"
                  }`}
                >
                  {check.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-px" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-px" />
                  )}
                  {check.label}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── Pieces ─────────────────────────────────────────────────── */

const Card = ({ title, icon: Icon, aside, children }) => (
  <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    {title && (
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          {Icon && <Icon className="w-4 h-4 text-purple-500" />}
          {title}
        </h2>
        {aside}
      </div>
    )}
    {children}
  </section>
);

const Counter = ({ value, ideal }) => {
  const tone =
    value === 0
      ? "text-slate-400"
      : value <= ideal
        ? "text-emerald-600"
        : value <= ideal * 1.15
          ? "text-amber-600"
          : "text-rose-600";

  return (
    <p className={`text-[11px] mt-1 text-right ${tone}`}>
      {value} / {ideal} characters
    </p>
  );
};

const Toggle = ({ icon: Icon, label, hint, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
    />
    <span className="min-w-0">
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
      </span>
      {hint && <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>}
    </span>
  </label>
);

export default BlogFormPage;
