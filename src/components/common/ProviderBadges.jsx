import { Star, Smile, BadgeCheck, Lock } from "lucide-react";

// ─── Single source of truth for badge metadata ───────────────
export const PROVIDER_BADGES = [
  {
    key: "recommended_by_admin",
    label: "Recommended by Admin",
    description: "Hand-picked and recommended by The Better Together team",
    icon: Star,
    iconFilled: true,
    pillBg: "bg-amber-50",
    pillText: "text-amber-800",
    iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    iconColor: "text-white",
  },
  {
    key: "checked_by_admin",
    label: "Checked by Admin",
    description: "This business has been reviewed and verified by our admin team",
    icon: Smile,
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-800",
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-500",
    iconColor: "text-white",
  },
  {
    key: "paid_for_marketing",
    label: "Marketing Partner",
    description: "Active marketing partner — supporting the platform",
    icon: BadgeCheck,
    pillBg: "bg-blue-50",
    pillText: "text-blue-800",
    iconBg: "bg-gradient-to-br from-blue-500 to-sky-500",
    iconColor: "text-white",
  },
];

const sizeMap = {
  sm: { icon: "w-6 h-6", inner: "w-3.5 h-3.5", lock: "w-2.5 h-2.5", text: "text-[11px]" },
  md: { icon: "w-7 h-7", inner: "w-4 h-4", lock: "w-2.5 h-2.5", text: "text-xs" },
  lg: { icon: "w-9 h-9", inner: "w-5 h-5", lock: "w-3 h-3", text: "text-sm" },
};

/**
 * Reusable trust-badge row for provider profiles.
 *
 * @param {object} provider - provider_profile object (or merged user obj)
 *   Required fields:
 *     - recommended_by_admin?: boolean
 *     - checked_by_admin?: boolean
 *     - paid_for_marketing?: boolean
 *     - is_paid?: boolean   (or pass tier: 'paid')
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} showLabels - render label pills next to each icon
 * @param {boolean} showInactive - show locked previews for un-earned badges
 *                                 (use on free providers to advertise the upgrade)
 */
export default function ProviderBadges({
  provider = {},
  size = "md",
  showLabels = false,
  showInactive = false,
  className = "",
}) {
  const isPaid = !!provider.is_paid || provider.tier === "paid";
  const s = sizeMap[size] || sizeMap.md;

  const badges = PROVIDER_BADGES.map((b) => ({
    ...b,
    earned: !!provider[b.key] && isPaid,
  }));

  const visible = showInactive ? badges : badges.filter((b) => b.earned);
  if (visible.length === 0) return null;

  if (showLabels) {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {visible.map(({ key, label, description, icon: Icon, iconFilled, pillBg, pillText, earned }) => (
          <span
            key={key}
            title={earned ? `${label} — ${description}` : `${label} (Upgrade to qualify)`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${s.text} ${
              earned ? `${pillBg} ${pillText}` : "bg-slate-100 text-slate-400"
            }`}
          >
            <Icon
              className={`${s.inner} ${earned ? "" : "opacity-60"}`}
              fill={iconFilled && earned ? "currentColor" : "none"}
              strokeWidth={2}
            />
            {label}
            {!earned && <Lock className={`${s.lock} ml-0.5`} strokeWidth={3} />}
          </span>
        ))}
      </div>
    );
  }

  // Compact icon-only mode (used on cards)
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {visible.map(({ key, label, description, icon: Icon, iconFilled, iconBg, iconColor, earned }) => (
        <span
          key={key}
          title={earned ? `${label} — ${description}` : `${label} (locked — upgrade to qualify)`}
          className={`relative inline-flex items-center justify-center rounded-full ${s.icon} shadow-sm ${
            earned ? `${iconBg} ${iconColor}` : "bg-slate-200 text-slate-400"
          }`}
        >
          <Icon
            className={s.inner}
            fill={iconFilled && earned ? "currentColor" : "none"}
            strokeWidth={2}
          />
          {!earned && (
            <span className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center bg-slate-500 rounded-full p-0.5">
              <Lock className={`${s.lock} text-white`} strokeWidth={3} />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}