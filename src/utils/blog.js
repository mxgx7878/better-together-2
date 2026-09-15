// Shared helpers for the blog surfaces (public index, article page, admin).

// Tailwind classes are written out in full — the JIT compiler only sees class
// names that appear literally in the source, so these can't be built by
// interpolating a colour key.
const CATEGORY_STYLES = {
  purple: {
    badge: "bg-purple-100 text-purple-700",
    gradient: "from-purple-500 to-pink-500",
    dot: "bg-purple-500",
  },
  pink: {
    badge: "bg-pink-100 text-pink-700",
    gradient: "from-pink-500 to-purple-500",
    dot: "bg-pink-500",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700",
    gradient: "from-blue-500 to-indigo-500",
    dot: "bg-blue-500",
  },
  green: {
    badge: "bg-green-100 text-green-700",
    gradient: "from-green-500 to-teal-500",
    dot: "bg-green-500",
  },
  orange: {
    badge: "bg-orange-100 text-orange-700",
    gradient: "from-orange-500 to-red-500",
    dot: "bg-orange-500",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700",
    gradient: "from-teal-500 to-cyan-500",
    dot: "bg-teal-500",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-700",
    gradient: "from-cyan-500 to-blue-500",
    dot: "bg-cyan-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    gradient: "from-amber-500 to-orange-500",
    dot: "bg-amber-500",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700",
    gradient: "from-slate-500 to-slate-700",
    dot: "bg-slate-500",
  },
};

export const CATEGORY_COLORS = Object.keys(CATEGORY_STYLES);

/**
 * Categories without an explicit colour still need a stable one, so fall back
 * to hashing the slug — the same category always lands on the same colour.
 */
export const categoryStyle = (category) => {
  const key = category?.color;
  if (key && CATEGORY_STYLES[key]) return CATEGORY_STYLES[key];

  const source = category?.slug || category?.name || "";
  if (!source) return CATEGORY_STYLES.slate;

  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) % 997;
  }
  return CATEGORY_STYLES[CATEGORY_COLORS[hash % CATEGORY_COLORS.length]];
};

export const formatPostDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** "6 min read" — the backend estimate, with a sane floor. */
export const readTimeLabel = (minutes) =>
  `${Math.max(1, Number(minutes) || 1)} min read`;

export const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  archived: "bg-amber-50 text-amber-700 border-amber-100",
};

/** Turns any title into the slug the backend would generate from it. */
export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
