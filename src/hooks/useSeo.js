import { useEffect } from "react";

/**
 * Manages the document <head> for a page: title, meta description, canonical,
 * robots, Open Graph / Twitter cards and an optional JSON-LD block.
 *
 * The app is a client-rendered SPA, so there is no react-helmet in the tree —
 * this hook writes the tags directly and cleans up the ones it created when the
 * page unmounts, so tags never leak from one route into the next.
 *
 * Every tag it manages is stamped with data-seo="1" so a later render can tell
 * its own tags apart from the static ones in index.html.
 *
 * @param {object}  seo
 * @param {string}  seo.title
 * @param {string}  seo.description
 * @param {string}  seo.canonical      Absolute URL
 * @param {string}  seo.robots         e.g. "index, follow"
 * @param {string}  seo.keywords
 * @param {object}  seo.og             { type, title, description, url, image, site_name }
 * @param {object}  seo.twitter        { card, title, description, image }
 * @param {object}  seo.jsonLd         Structured-data object (serialised as-is)
 */
const SEO_ATTR = "data-seo";
const DEFAULT_TITLE = "Better Together — NDIS platform";

const upsertMeta = (selector, attrs, created) => {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(SEO_ATTR, "1");
    document.head.appendChild(el);
    created.push(el);
  }

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
};

const useSeo = (seo) => {
  useEffect(() => {
    if (!seo) return undefined;

    const created = [];
    const previousTitle = document.title;

    if (seo.title) {
      document.title = seo.title.includes("Better Together")
        ? seo.title
        : `${seo.title} | Better Together`;
    }

    const metas = [];

    if (seo.description) {
      metas.push([
        'meta[name="description"]',
        { name: "description", content: seo.description },
      ]);
    }

    if (seo.keywords) {
      metas.push([
        'meta[name="keywords"]',
        { name: "keywords", content: seo.keywords },
      ]);
    }

    if (seo.robots) {
      metas.push([
        'meta[name="robots"]',
        { name: "robots", content: seo.robots },
      ]);
    }

    Object.entries(seo.og || {}).forEach(([key, value]) => {
      if (!value) return;
      const property = `og:${key === "site_name" ? "site_name" : key}`;
      metas.push([
        `meta[property="${property}"]`,
        { property, content: String(value) },
      ]);
    });

    Object.entries(seo.twitter || {}).forEach(([key, value]) => {
      if (!value) return;
      const name = `twitter:${key}`;
      metas.push([`meta[name="${name}"]`, { name, content: String(value) }]);
    });

    metas.forEach(([selector, attrs]) => upsertMeta(selector, attrs, created));

    // ─── Canonical link ───────────────────────────────────────────
    let canonicalEl = null;
    let previousCanonical = null;

    if (seo.canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        previousCanonical = canonicalEl.getAttribute("href");
      } else {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        canonicalEl.setAttribute(SEO_ATTR, "1");
        document.head.appendChild(canonicalEl);
        created.push(canonicalEl);
      }
      canonicalEl.setAttribute("href", seo.canonical);
    }

    // ─── JSON-LD structured data ──────────────────────────────────
    let jsonLdEl = null;
    if (seo.jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.setAttribute(SEO_ATTR, "1");
      jsonLdEl.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(jsonLdEl);
    }

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      created.forEach((el) => el.remove());
      jsonLdEl?.remove();
      // A canonical that already existed is restored rather than removed.
      if (canonicalEl && previousCanonical !== null) {
        canonicalEl.setAttribute("href", previousCanonical);
      }
    };
  }, [seo]);
};

export default useSeo;
