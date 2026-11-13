import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
   Public-site design kit
   One source of truth for the look first set on the Subscription page:
   navy headings, purple eyebrows, lime accents, soft grey canvas,
   white rounded cards. Every public page builds from these pieces.
   ──────────────────────────────────────────────────────────────────── */

export const NAVY = "#14306B";
export const NAVY_DEEP = "#0E2352";
export const LIME = "#D8F26A";
export const BLUE = "#1F6FD8";
export const PURPLE = "#7A2FB8";
export const PINK = "#D6267E";
export const CANVAS = "#F4F6FA";
export const CONTACT_EMAIL = "weare@bettertogethernetwork.com.au";
export const CONTACT_PHONE = "0403678767";
export const CONTACT_ADDRESS = "328 Swanston St, Melbourne VIC 3000";

/** Optimised photo path. `img("care")` → 1920w webp, `img("care", true)` → 900w */
export const img = (name, small = false) =>
  `/uploads/web/${name}${small ? "-sm" : ""}.webp`;

/** Brand stripe used at the top of the Subscription page. */
export const BrandStripe = ({ className = "" }) => (
  <div
    className={`h-1 w-full bg-gradient-to-r from-[#2D3FD8] via-[#D6267E] to-[#7BC043] ${className}`}
  />
);

export const Eyebrow = ({ children, light = false, className = "" }) => (
  <p
    className={`mb-3 text-[11px] font-bold uppercase tracking-[0.18em] ${className}`}
    style={{ color: light ? LIME : PURPLE }}
  >
    {children}
  </p>
);

export const SectionHeading = ({
  eyebrow,
  title,
  sub,
  align = "center",
  light = false,
  className = "",
}) => (
  <div
    className={`${
      align === "center" ? "mx-auto text-center" : "text-left"
    } mb-10 max-w-2xl md:mb-12 ${className}`}
  >
    {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
    <h2
      className={`text-2xl font-bold leading-tight md:text-[36px] ${light ? "text-white" : ""}`}
      style={light ? undefined : { color: NAVY }}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={`mt-4 text-[15px] leading-relaxed md:text-base ${
          light ? "text-blue-100/90" : "text-slate-500"
        }`}
      >
        {sub}
      </p>
    )}
  </div>
);

/** Page section with consistent horizontal padding and width. */
export const Section = ({
  children,
  className = "",
  width = "max-w-6xl",
  style,
  id,
}) => (
  <section id={id} className={`px-4 py-16 sm:px-6 md:py-20 ${className}`} style={style}>
    <div className={`mx-auto ${width}`}>{children}</div>
  </section>
);

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F6FD8]";

const BTN_VARIANTS = {
  navy: { className: "text-white hover:brightness-125 shadow-sm", style: { background: NAVY } },
  lime: { className: "text-slate-900 hover:brightness-95 shadow-sm", style: { background: LIME } },
  blue: { className: "text-white hover:brightness-110 shadow-sm", style: { background: BLUE } },
  outline: {
    className: "border-2 bg-white hover:bg-slate-50",
    style: { borderColor: NAVY, color: NAVY },
  },
  light: {
    className: "border-2 border-white/40 text-white hover:bg-white/10",
    style: undefined,
  },
  white: { className: "bg-white hover:bg-slate-50 shadow-sm", style: { color: NAVY } },
};

/** Pill button. Pass `to` for router links, `href` for external/mailto. */
export const Button = ({
  to,
  href,
  variant = "navy",
  arrow = false,
  className = "",
  children,
  ...rest
}) => {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.navy;
  const cls = `${BTN_BASE} ${v.className} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4" />}
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} style={v.style} {...rest}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} style={v.style} {...rest}>
        {inner}
      </a>
    );
  return (
    <button type="button" className={cls} style={v.style} {...rest}>
      {inner}
    </button>
  );
};

export const Card = ({ children, className = "", as: Tag = "div", ...rest }) => (
  <Tag className={`rounded-2xl bg-white p-6 shadow-sm md:p-7 ${className}`} {...rest}>
    {children}
  </Tag>
);

export const IconTile = ({ icon: Icon, tone = "navy", className = "" }) => {
  const tones = {
    navy: { bg: "#E8EEFA", fg: NAVY },
    purple: { bg: "#F1EAFB", fg: PURPLE },
    lime: { bg: "#EEF8D6", fg: "#4D7A12" },
    pink: { bg: "#FCE7F1", fg: PINK },
    blue: { bg: "#E3EDFB", fg: BLUE },
  };
  const t = tones[tone] || tones.navy;
  return (
    <div
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ background: t.bg }}
    >
      <Icon className="h-5 w-5" style={{ color: t.fg }} />
    </div>
  );
};

export const CheckList = ({ items, dark = false, className = "" }) => (
  <ul className={`space-y-3 ${className}`}>
    {items.map((t) => (
      <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed md:text-[15px]">
        <Check
          className="mt-0.5 h-4 w-4 flex-shrink-0"
          strokeWidth={3}
          style={{ color: dark ? LIME : "#2E9E5B" }}
        />
        <span className={dark ? "text-white/90" : "text-slate-600"}>{t}</span>
      </li>
    ))}
  </ul>
);

/**
 * Inner-page hero. With `image` it renders a split layout (copy left,
 * photo right); without it, a centred block like the Subscription page.
 */
export const PageHero = ({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  actions,
  badge,
  children,
}) => (
  <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 md:pb-20 md:pt-16">
    <div
      className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
      style={{ background: "radial-gradient(circle, #E3EDFB 0%, transparent 70%)" }}
    />
    <div
      className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full opacity-60 blur-3xl"
      style={{ background: "radial-gradient(circle, #F1EAFB 0%, transparent 70%)" }}
    />
    <div className="relative mx-auto max-w-6xl">
      {image ? (
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="btn-fade-up lg:col-span-6">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1
              className="text-3xl font-extrabold leading-[1.12] md:text-5xl"
              style={{ color: NAVY }}
            >
              {title}
            </h1>
            {intro && (
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-500 md:text-[17px]">
                {intro}
              </p>
            )}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
          <div className="relative lg:col-span-6">
            <div className="overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5">
              <img
                src={img(image)}
                alt={imageAlt}
                className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                fetchpriority="high"
              />
            </div>
            {badge && (
              <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[290px]">
                {badge}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="btn-fade-up mx-auto max-w-3xl text-center">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1
            className="text-3xl font-extrabold leading-[1.15] md:text-5xl"
            style={{ color: NAVY }}
          >
            {title}
          </h1>
          {intro && (
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-500 md:text-base">
              {intro}
            </p>
          )}
          {actions && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          )}
          {children}
        </div>
      )}
    </div>
  </section>
);

/** Small floating stat/quote card used on top of hero photos. */
export const HeroBadge = ({ icon: Icon, title, text }) => (
  <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5">
    {Icon && <IconTile icon={Icon} tone="lime" className="!h-10 !w-10" />}
    <div>
      <p className="text-sm font-bold" style={{ color: NAVY }}>
        {title}
      </p>
      {text && <p className="mt-0.5 text-xs leading-snug text-slate-500">{text}</p>}
    </div>
  </div>
);

/** Navy closing call-to-action panel. */
export const CtaPanel = ({
  eyebrow = "Join the network",
  title,
  text,
  primary = { to: "/subscription", label: "Join free" },
  secondary,
  image = "cta",
}) => (
  <section className="px-4 pb-20 sm:px-6">
    <div
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] px-6 py-14 text-center shadow-2xl sm:px-12 md:py-16"
      style={{ background: NAVY }}
    >
      <img
        src={img(image, true)}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.15] blur-3xl"
        style={{ background: LIME }}
      />
      <div className="relative mx-auto max-w-2xl">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
        {text && (
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-blue-100/90">
            {text}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {primary && (
            <Button to={primary.to} href={primary.href} variant="lime" arrow>
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button to={secondary.to} href={secondary.href} variant="light">
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  </section>
);
