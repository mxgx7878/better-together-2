import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Clock,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import {
  fetchBlogPosts,
  fetchBlogCategories,
} from "../../store/actions/blogActions";
import { ASYNC_STATUS } from "../../constants";
import { categoryStyle, formatPostDate, readTimeLabel } from "../../utils/blog";
import useSeo from "../../hooks/useSeo";

const PER_PAGE = 9;
const ALL = "all";

const BlogPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { posts, categories, total, totalPages, page, status } = useSelector(
    (s) => s.blog,
  );
  const loading = status === ASYNC_STATUS.LOADING;

  // The active category and page live in the URL so a filtered view can be
  // shared, bookmarked and crawled.
  const activeCategory = searchParams.get("category") || ALL;
  const currentPage = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);

  // Debounce typing into the URL rather than firing a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === urlSearch) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput) next.set("q", searchInput);
          else next.delete("q");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, setSearchParams]);

  useEffect(() => {
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchBlogPosts({
        category: activeCategory,
        search: urlSearch,
        page: currentPage,
        per_page: PER_PAGE,
      }),
    );
  }, [dispatch, activeCategory, urlSearch, currentPage]);

  const setParam = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === ALL || value === "")
            next.delete(key);
          else next.set(key, String(value));
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const activeCategoryMeta = useMemo(
    () => categories.find((c) => c.slug === activeCategory),
    [categories, activeCategory],
  );

  // ─── SEO ────────────────────────────────────────────────────────
  const seo = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const base = `${origin}/blog`;

    const title = activeCategoryMeta
      ? activeCategoryMeta.meta_title || `${activeCategoryMeta.name} — Blog & News`
      : "Blog & News — NDIS Updates, Provider Tips & Community Stories";

    const description = activeCategoryMeta
      ? activeCategoryMeta.meta_description ||
        activeCategoryMeta.description ||
        `${activeCategoryMeta.name} articles from the Better Together network.`
      : "Stay informed with the latest NDIS updates, provider tips, community stories and resources from the Better Together network.";

    return {
      title,
      description,
      // Filtered and paged views point back at one canonical index so search
      // engines don't treat them as duplicate pages.
      canonical: activeCategoryMeta ? `${base}?category=${activeCategoryMeta.slug}` : base,
      robots: urlSearch ? "noindex, follow" : "index, follow",
      og: {
        type: "website",
        title,
        description,
        url: base,
        site_name: "Better Together",
      },
      twitter: { card: "summary_large_image", title, description },
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Better Together Blog",
        description,
        url: base,
      },
    };
  }, [activeCategoryMeta, urlSearch]);

  useSeo(seo);

  // The featured post only headlines the unfiltered first page.
  const isDefaultView = activeCategory === ALL && !urlSearch && currentPage === 1;
  const featured = isDefaultView && posts[0]?.is_featured ? posts[0] : null;
  const gridPosts = featured ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm font-medium">
              Insights, Updates &amp; Community Stories
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {activeCategoryMeta ? activeCategoryMeta.name : "Blog & News"}
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            {activeCategoryMeta?.description ||
              "Stay informed with the latest NDIS updates, provider tips, community stories, and resources to help you thrive."}
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-slate-700 placeholder-slate-400 shadow-lg outline-none focus:ring-4 focus:ring-white/30"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ─── Category pills ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <CategoryPill
            active={activeCategory === ALL}
            onClick={() => setParam({ category: null, page: null })}
            label="All Posts"
            count={activeCategory === ALL ? total : null}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              active={activeCategory === cat.slug}
              onClick={() => setParam({ category: cat.slug, page: null })}
              label={cat.name}
              count={cat.posts_count}
            />
          ))}
        </div>

        {/* ─── Results ────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            search={urlSearch}
            onReset={() => {
              setSearchInput("");
              setParam({ category: null, q: null, page: null });
            }}
          />
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  setParam({ page: p === 1 ? null : p });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Pieces ─────────────────────────────────────────────────── */

const CategoryPill = ({ active, onClick, label, count }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
    }`}
  >
    {label}
    {count !== null && count !== undefined && (
      <span
        className={`text-[11px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const FeaturedCard = ({ post }) => {
  const style = categoryStyle(post.category);

  return (
    <article className="mb-10 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100">
      <div className="grid md:grid-cols-2">
        <Link
          to={`/blog/${post.slug}`}
          className={`relative block h-56 md:h-full min-h-[240px] bg-gradient-to-br ${style.gradient}`}
        >
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
        </Link>

        <div className="p-7 md:p-9 flex flex-col justify-center">
          {post.category && (
            <span
              className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${style.badge}`}
            >
              {post.category.name}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
            <Link to={`/blog/${post.slug}`} className="hover:text-purple-700 transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-slate-500 mb-5 line-clamp-3">{post.excerpt}</p>
          <PostMeta post={post} />
          <Link
            to={`/blog/${post.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 self-start group"
          >
            Read article
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const PostCard = ({ post }) => {
  const style = categoryStyle(post.category);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 flex flex-col group">
      <Link
        to={`/blog/${post.slug}`}
        className={`relative block h-44 bg-gradient-to-br ${style.gradient}`}
      >
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/60" />
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <span
            className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2.5 ${style.badge}`}
          >
            {post.category.name}
          </span>
        )}
        <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-purple-700 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
        <PostMeta post={post} />
      </div>
    </article>
  );
};

const PostMeta = ({ post }) => (
  <div className="flex items-center gap-3 text-xs text-slate-400">
    <span className="inline-flex items-center gap-1.5">
      <Calendar className="w-3.5 h-3.5" />
      <time dateTime={post.published_at || post.created_at}>
        {formatPostDate(post.published_at || post.created_at)}
      </time>
    </span>
    <span aria-hidden="true">·</span>
    <span className="inline-flex items-center gap-1.5">
      <Clock className="w-3.5 h-3.5" />
      {readTimeLabel(post.reading_time)}
    </span>
  </div>
);

const EmptyState = ({ search, onReset }) => (
  <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
    <p className="text-slate-600 font-semibold">
      {search ? `No articles match “${search}”` : "No articles published yet"}
    </p>
    <p className="text-sm text-slate-400 mt-1">
      {search
        ? "Try a different search term or browse another category."
        : "Check back soon — new stories are on the way."}
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
    >
      View all posts
    </button>
  </div>
);

const Pagination = ({ page, totalPages, onChange }) => (
  <nav
    aria-label="Blog pagination"
    className="flex items-center justify-center gap-1 mt-12"
  >
    <button
      type="button"
      onClick={() => onChange(Math.max(1, page - 1))}
      disabled={page === 1}
      aria-label="Previous page"
      className="p-2.5 rounded-xl hover:bg-white text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => onChange(p)}
        aria-current={p === page ? "page" : undefined}
        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
          p === page
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
            : "text-slate-600 hover:bg-white"
        }`}
      >
        {p}
      </button>
    ))}

    <button
      type="button"
      onClick={() => onChange(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
      aria-label="Next page"
      className="p-2.5 rounded-xl hover:bg-white text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </nav>
);

export default BlogPage;
