/**
 * generate-sitemap.js
 * ------------------------------------------------------------------
 * Generates public/sitemap.xml for the Better Together frontend.
 *
 * Only PUBLIC, crawlable routes are listed. Auth-gated dashboards
 * (/admin, /provider, /participant) and dynamic :id routes are
 * intentionally excluded — they should never be in a public sitemap.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *
 * Recommended: run it automatically before every build (see package.json).
 * ------------------------------------------------------------------
 */
 
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
 
// ─── Config ───────────────────────────────────────────────────────
const BASE_URL = "https://bettertogthernetwork.com.au"; // no trailing slash
const OUTPUT = "public/sitemap.xml";

// Blog posts are dynamic, so their URLs are pulled from the API at build time.
// Override the endpoint with SITEMAP_API_URL when building against staging.
const API_URL =
  process.env.SITEMAP_API_URL ||
  "https://bettertogethernetwork.com.au/better-backend/public/api";
const BLOG_SITEMAP_ENDPOINT = `${API_URL}/blogs-sitemap`;
const FETCH_TIMEOUT_MS = 15000;
 
// Public routes → keep this list in sync with the public <Route>s in src/App.jsx.
// changefreq/priority are SEO hints; tune per page as needed.
const ROUTES = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0" },
  { path: "/about",             changefreq: "monthly", priority: "0.8" },
  { path: "/what-we-do",        changefreq: "monthly", priority: "0.8" },
  { path: "/subscription",      changefreq: "monthly", priority: "0.8" },
  { path: "/business-directory",changefreq: "weekly",  priority: "0.8" },
  { path: "/calendar",          changefreq: "weekly",  priority: "0.7" },
  { path: "/blog",              changefreq: "weekly",  priority: "0.7" },
  { path: "/contact",           changefreq: "monthly", priority: "0.7" },
  { path: "/login",             changefreq: "yearly",  priority: "0.5" },
  { path: "/register",          changefreq: "yearly",  priority: "0.5" },
  { path: "/terms",             changefreq: "yearly",  priority: "0.3" },
];
 
// ─── Dynamic blog routes ──────────────────────────────────────────
// A build must never fail because the API is unreachable, so a failed fetch
// logs a warning and the sitemap ships with the static routes only.
async function fetchBlogRoutes() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(BLOG_SITEMAP_ENDPOINT, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = await res.json();
    const posts = body?.data?.posts ?? [];
    const categories = body?.data?.categories ?? [];

    return [
      ...posts.map((post) => ({
        path: `/blog/${post.slug}`,
        lastmod: post.lastmod,
        changefreq: "monthly",
        priority: "0.7",
      })),
      ...categories.map((category) => ({
        path: `/blog?category=${category.slug}`,
        lastmod: category.lastmod,
        changefreq: "weekly",
        priority: "0.6",
      })),
    ];
  } catch (err) {
    console.warn(
      `! Could not fetch blog routes from ${BLOG_SITEMAP_ENDPOINT} (${err.message}) — writing static routes only.`,
    );
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ─── Build ────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// "&" in a query string has to be escaped inside <loc>.
const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toUrlNode = ({ path, changefreq, priority, lastmod }) =>
  [
    "  <url>",
    `    <loc>${escapeXml(`${BASE_URL}${path}`)}</loc>`,
    `    <lastmod>${lastmod || today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");

const blogRoutes = await fetchBlogRoutes();
const allRoutes = [...ROUTES, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(toUrlNode).join("\n")}
</urlset>
`;

// Write relative to the folder where the command is run from (project root).
// npm scripts and `node generate-sitemap.js` both run from the project root,
// so this puts the file at <project-root>/public/sitemap.xml.
const outPath = resolve(process.cwd(), OUTPUT);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf8");

console.log(
  `✓ sitemap.xml generated with ${allRoutes.length} URLs (${blogRoutes.length} from the blog) → ${OUTPUT}`,
);