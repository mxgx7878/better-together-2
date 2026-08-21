import { PROVIDER_BADGES } from "./ProviderBadges";

/**
 * Reusable Trust-Badge row — admin-set trust flags shown as
 * coloured icon chips with hover tooltips.
 *
 * Used on: BusinessDirectoryPage (public), DirectoryPage (logged-in),
 * provider cards, and the modal hero.
 *
 * @param {Object}  provider          - provider obj with badge flags
 * @param {'sm'|'md'|'lg'} size       - icon size
 * @param {'top'|'bottom'} tooltipPos - tooltip placement
 * @param {string}  className         - extra classes on wrapper
 * @param {string}  ringClass         - ring colour around badge
 *                                      (e.g. "ring-white/60" on dark hero)
 */
const TrustBadgeRow = ({
  provider,
  size = "sm",
  tooltipPos = "top",
  className = "",
  ringClass = "ring-white",
}) => {
  const earned = PROVIDER_BADGES.filter((b) => !!provider?.[b.key]);
  if (earned.length === 0) return null;

  const SIZE = {
    sm: { box: "w-7 h-7", icon: "w-3.5 h-3.5" },
    md: { box: "w-8 h-8", icon: "w-4 h-4" },
    lg: { box: "w-10 h-10", icon: "w-5 h-5" },
  };
  const { box, icon: iconSize } = SIZE[size] || SIZE.sm;

  const tipPos =
    tooltipPos === "bottom" ? "top-full mt-2" : "bottom-full mb-2";
  const arrowPos =
    tooltipPos === "bottom"
      ? "bottom-full border-b-slate-900"
      : "top-full border-t-slate-900";

  return (
    <div className={`flex items-center gap-1.5 flex-wrap mb-2 ${className}`}>
      {earned.map((badge) => {
        const Icon = badge.icon;
        return (
          <div key={badge.key} className="relative group/tip">
            <div
              className={`${box} rounded-full ${badge.iconBg} flex items-center justify-center shadow-md ring-2 ${ringClass} cursor-help flex-shrink-0 transition-transform duration-200 group-hover/tip:scale-110 group-hover/tip:shadow-lg`}
            >
              <Icon
                className={`${iconSize} ${badge.iconColor} drop-shadow-sm`}
                // {...(badge.iconFilled ? { fill: "currentColor" } : {})}
                strokeWidth={2}
              />
            </div>

            {/* Tooltip */}
            <div
              className={`absolute ${tipPos} left-1/2 -translate-x-1/2 z-100 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 pointer-events-none`}
            >
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl w-52">
                <p className="text-xs font-semibold">{badge.label}</p>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {badge.description}
                </p>
              </div>
              <div
                className={`absolute ${arrowPos} left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadgeRow;