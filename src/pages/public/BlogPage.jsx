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
import { NAVY, LIME, PURPLE } from "../../components/public/ui";

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
    <div>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 md:pt-16">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, #E3EDFB 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: PURPLE }}>
            Insights, updates &amp; community stories
          </p>
          <h1 className="text-3xl font-extrabold leading-[1.15] md:text-5xl" style={{ color: NAVY }}>
            {activeCategoryMeta ? activeCategoryMeta.name : "Blog & News"}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-500 md:text-base">
            {activeCategoryMeta?.description ||
              "Stay informed with the latest NDIS updates, provider tips, community stories, and resources to help you thrive."}
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-full rounded-full border border-slate-200 bg-white py-4 pr-12 text-[15px] text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#1F6FD8] focus:ring-4 focus:ring-[#1F6FD8]/10"
              style={{ paddingLeft: "3.25rem" }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-2 sm:px-6">
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
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: PURPLE }} />
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
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
      active ? "text-white shadow" : "bg-white text-slate-600 shadow-sm hover:text-slate-900"
    }`}
    style={active ? { background: NAVY } : undefined}
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
    <article className="mb-10 overflow-hidden rounded-[28px] bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="grid md:grid-cols-2">
        <Link
          to={`/blog/${post.slug}`}
          className="relative block h-56 min-h-[260px] bg-gradient-to-br from-[#14306B] to-[#1F6FD8] md:h-full"
        >
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-900" style={{ background: LIME }}>
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
          <h2 className="mb-3 text-2xl font-bold leading-snug md:text-3xl" style={{ color: NAVY }}>
            <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-[#7A2FB8]">
              {post.title}
            </Link>
          </h2>
          <p className="text-slate-500 mb-5 line-clamp-3">{post.excerpt}</p>
          <PostMeta post={post} />
          <Link
            to={`/blog/${post.slug}`}
            className="group mt-6 inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-125"
            style={{ background: NAVY }}
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
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/blog/${post.slug}`}
        className="relative block h-48 overflow-hidden bg-gradient-to-br from-[#14306B] to-[#1F6FD8]"
      >
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/60" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <span
            className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2.5 ${style.badge}`}
          >
            {post.category.name}
          </span>
        )}
        <h3 className="mb-2 line-clamp-2 text-[17px] font-bold leading-snug" style={{ color: NAVY }}>
          <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-[#7A2FB8]">
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
  <div className="rounded-[28px] bg-white py-24 text-center shadow-sm">
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
      className="mt-5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-125"
      style={{ background: NAVY }}
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
        className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
          p === page ? "text-white shadow" : "text-slate-600 hover:bg-white"
        }`}
        style={p === page ? { background: NAVY } : undefined}
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
