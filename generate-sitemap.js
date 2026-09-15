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
 
// ─── Build ────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
 
const urls = ROUTES.map(({ path, changefreq, priority }) => {
  const loc = `${BASE_URL}${path}`;
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}).join("\n");
 
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
 
// Write relative to the folder where the command is run from (project root).
// npm scripts and `node generate-sitemap.js` both run from the project root,
// so this puts the file at <project-root>/public/sitemap.xml.
const outPath = resolve(process.cwd(), OUTPUT);
 
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf8");
 
console.log(`✓ sitemap.xml generated with ${ROUTES.length} URLs → ${OUTPUT}`);