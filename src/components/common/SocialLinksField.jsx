import { Plus, Trash2, Globe, Facebook, Instagram, Linkedin, Youtube, Twitter, Link as LinkIcon } from "lucide-react";

// ─── Link type definitions ───────────────────────────────
export const LINK_TYPES = [
  { value: "website", label: "Website", icon: Globe, placeholder: "https://yoursite.com.au" },
  { value: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourpage" },
  { value: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourhandle" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/..." },
  { value: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourchannel" },
  { value: "twitter", label: "X (Twitter)", icon: Twitter, placeholder: "https://x.com/yourhandle" },
  { value: "other", label: "Other", icon: LinkIcon, placeholder: "https://..." },
];

const getTypeMeta = (type) =>
  LINK_TYPES.find((t) => t.value === type) || LINK_TYPES[LINK_TYPES.length - 1];

/**
 * Reusable list of social/web links.
 *
 * @param {Array}    value    [{ type: 'website'|'facebook'|..., url: 'https://...' }]
 * @param {function} onChange Receives the updated array
 * @param {string}   label
 * @param {number}   max      Max links allowed (default: 6)
 */
const SocialLinksField = ({
  value = [],
  onChange,
  label = "Links",
  max = 6,
}) => {
  const links = Array.isArray(value) ? value : [];

  const addLink = () => {
    if (links.length >= max) return;
    // Pick first unused type as default
    const used = links.map((l) => l.type);
    const nextType =
      LINK_TYPES.find((t) => !used.includes(t.value))?.value || "website";
    onChange?.([...links, { type: nextType, url: "" }]);
  };

  const updateLink = (idx, key, val) => {
    const next = links.map((l, i) => (i === idx ? { ...l, [key]: val } : l));
    onChange?.(next);
  };

  const removeLink = (idx) => {
    onChange?.(links.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-slate-700">{label}</label>
          <span className="text-xs text-slate-400">
            {links.length}/{max}
          </span>
        </div>
      )}

      <p className="text-xs text-slate-500 mb-3">
        Add your website, Facebook, Instagram, or any other public link
        customers can use to find your business.
      </p>

      <div className="space-y-2">
        {links.map((link, idx) => {
          const meta = getTypeMeta(link.type);
          const Icon = meta.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2"
            >
              {/* Type select */}
              <div className="relative flex-shrink-0">
                <select
                  value={link.type}
                  onChange={(e) => updateLink(idx, "type", e.target.value)}
                  className="appearance-none pl-9 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none cursor-pointer"
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* URL input */}
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(idx, "url", e.target.value)}
                placeholder={meta.placeholder}
                className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex-shrink-0"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      {links.length < max && (
        <button
          type="button"
          onClick={addLink}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg border border-dashed border-purple-300"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      )}
    </div>
  );
};

export default SocialLinksField;