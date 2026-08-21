import { useMemo } from "react";
import RibbonSvg from "./RibbonSvg";

/**
 * Scrolling marquee of marketing partners.
 *
 * @param {Array}  sponsors  [{ id, name, initials, bg, url, logo_url? }]
 * @param {string} title     Header title (default: "Featured Partners")
 * @param {string} note      Small note on the right
 * @param {string} className Wrapper class
 */
const FeaturedPartnersRibbon = ({
  sponsors = [],
  title = "Featured Partners",
  note = "Sponsored · Marketing add-on",
  className = "",
}) => {
  const track = useMemo(() => [...sponsors], [sponsors]);

  console.log("sponsors",sponsors)

  if (!sponsors.length) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2.5 px-1">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
          {title}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
        {note && (
          <span className="text-[11px] text-slate-400 whitespace-nowrap">
            {note}
          </span>
        )}
      </div>

      {/* Ribbon */}
      <div className="relative">
        {/* Drop shadow */}
        <div
          className="absolute bottom-0 left-8 right-8 h-4 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)",
            filter: "blur(4px)",
            transform: "translateY(8px)",
          }}
        />

        <div className="relative overflow-hidden" style={{ height: "72px" }}>
          <RibbonSvg />

          {/* Scrolling logos */}
          <div className="absolute inset-0 overflow-hidden flex items-center w-full  justify-start">
            <style>{`
              @keyframes ribbon-scroll {
                0%   { transform: translateX(20%); }
                100% { transform: translateX(-100%); }
              }
              .ribbon-track {
                display: flex;
                align-items: center;
                width: 100%;
                animation: ribbon-scroll 20s linear infinite;
                justify-content: flex-end;
              }
              .ribbon-track:hover { animation-play-state: paused; }
            `}</style>

            <div className="ribbon-track">
              {track.map((sponsor, i) => (
                <a
                  key={`${sponsor.id}-${i}`}
                  href={sponsor.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mx-4 flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white transition-colors shadow-sm"
                >
                  {sponsor.provider_profile?.organization_logo  || sponsor.logo_url? (
                    <img
                      src={sponsor.provider_profile?.organization_logo || sponsor.logo_url}
                      alt={sponsor.name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    <span
                      className="w-6 h-6 rounded text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: sponsor.bg || "#7c3aed" }}
                    >
                      {sponsor.initials}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                    {sponsor.first_name ? sponsor.first_name + ' ' + sponsor.last_name : sponsor.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPartnersRibbon;
