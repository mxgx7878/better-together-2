import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Loader2,
  BookOpen,
  Tag,
  Share2,
  Link as LinkIcon,
  Facebook,
  Linkedin,
  Twitter,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
} from "../../store/actions/blogActions";
import { clearSelectedPost } from "../../store/slices/blogSlice";
import { ASYNC_STATUS } from "../../constants";
import { formatPostDate, readTimeLabel } from "../../utils/blog";
import useSeo from "../../hooks/useSeo";
import { NAVY, LIME, PURPLE } from "../../components/public/ui";

const BlogPostPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { selectedPost: post, seo, related, postStatus, error } = useSelector(
    (s) => s.blog,
  );
  const loading = postStatus === ASYNC_STATUS.LOADING;
  const notFound = postStatus === ASYNC_STATUS.FAILED;

  useEffect(() => {
    if (slug) dispatch(fetchBlogPostBySlug(slug));
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, slug]);

  // The article page is often the entry point from search — warm the index so
  // "Back to blog" lands on a populated list.
  useEffect(() => {
    dispatch(fetchBlogPosts({ per_page: 9 }));
  }, [dispatch]);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : seo?.canonical || "";

  // Backend hands us the whole SEO block (meta, OG, Twitter, JSON-LD); the
  // canonical is rewritten to this origin so staging doesn't advertise prod.
  const seoConfig = useMemo(() => {
    if (!seo) return null;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = origin ? `${origin}/blog/${slug}` : seo.canonical;

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical,
      robots: seo.robots,
      og: { ...seo.og, url: canonical },
      twitter: seo.twitter,
      jsonLd: seo.json_ld
        ? {
            ...seo.json_ld,
            mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
          }
        : null,
    };
  }, [seo, slug]);

  useSeo(seoConfig);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: PURPLE }} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="mb-2 text-2xl font-bold" style={{ color: NAVY }}>
            Article not found
          </h1>
          <p className="text-slate-500 mb-6">
            {error ||
              "This article may have been moved or unpublished. Browse the blog for the latest posts."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:brightness-125"
            style={{ background: NAVY }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to the blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="relative overflow-hidden pb-28 pt-10" style={{ background: NAVY }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: LIME }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs — also feed the BreadcrumbList structured data below */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1.5 text-xs text-white/80">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
              <li>
                <Link to="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              {post.category && (
                <>
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  <li>
                    <Link
                      to={`/blog?category=${post.category.slug}`}
                      className="hover:text-white"
                    >
                      {post.category.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          {post.category && (
            <Link
              to={`/blog?category=${post.category.slug}`}
              className="mb-4 inline-block rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-900 transition hover:brightness-95"
              style={{ background: LIME }}
            >
              {post.category.name}
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg leading-relaxed text-blue-100/90">{post.excerpt}</p>
          )}

          <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-white/85">
            {post.author?.name && (
              <span className="inline-flex items-center gap-2">
                {post.author.profile_picture ? (
                  <img
                    src={post.author.profile_picture}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-white/40"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
                    {post.author.name.charAt(0)}
                  </span>
                )}
                {post.author.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.published_at || post.created_at}>
                {formatPostDate(post.published_at || post.created_at)}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTimeLabel(post.reading_time)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} view{post.views === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto -mt-20 max-w-3xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              // A missing object would otherwise leave a tall blank band above
              // the article — collapse the element instead.
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-full aspect-[16/9] object-cover"
            />
          )}

          <div className="p-6 sm:p-9">
            {/*
              Body HTML is authored in the admin editor and sanitised
              server-side against a tag allow-list before it is stored, so it is
              safe to render here.
            */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {post.tags?.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mt-10 pt-6 border-t border-slate-100">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <ShareRow url={pageUrl} title={post.title} />
          </div>
        </div>

        {related?.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="mb-5 text-xl font-bold"
              style={{ color: NAVY }}
            >
              Keep reading
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((item) => (
                <RelatedCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}

        <Link
          to="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: PURPLE }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
      </main>
    </div>
  );
};

/* ─── Pieces ─────────────────────────────────────────────────── */

const ShareRow = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const links = [
    {
      label: "Share on Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Share on X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
        <Share2 className="w-4 h-4" /> Share
      </span>
      <div className="flex items-center gap-1.5">
        {links.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-[#EEF2FA] hover:text-[#14306B]"
          >
            {Icon && <Icon className="w-4 h-4" />}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          title="Copy link"
          className={`p-2 rounded-lg transition-colors ${
            copied
              ? "bg-emerald-50 text-emerald-600"
              : "text-slate-500 hover:bg-[#EEF2FA] hover:text-[#14306B]"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const RelatedCard = ({ post }) => {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/blog/${post.slug}`}
        className="relative block h-32 overflow-hidden bg-gradient-to-br from-[#14306B] to-[#1F6FD8]"
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
            <BookOpen className="w-7 h-7 text-white/60" />
          </span>
        )}
      </Link>
      <div className="p-4">
        <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug" style={{ color: NAVY }}>
          <Link to={`/blog/${post.slug}`} className="hover:text-[#7A2FB8]">
            {post.title}
          </Link>
        </h3>
        <p className="text-[11px] text-slate-400">
          {formatPostDate(post.published_at || post.created_at)} ·{" "}
          {readTimeLabel(post.reading_time)}
        </p>
      </div>
    </article>
  );
};

export default BlogPostPage;
