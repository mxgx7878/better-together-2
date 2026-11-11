import { Link, useSearchParams } from "react-router-dom";
import {
  Check,
  Minus,
  Search,
  ShieldCheck,
  PhoneOff,
  Hand,
  Building2,
  Users,
} from "lucide-react";

// ─── Design tokens (from client's subscription mockups) ─────────────
const NAVY = "#14306B";
const LIME = "#D8F26A";
const BLUE = "#1F6FD8";
const PURPLE = "#7A2FB8";
const CONTACT_EMAIL = "weare@bettertogethernetwork.com.au";

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
.btn-sub { font-family: 'Inter', system-ui, sans-serif; }
.btn-sub h1, .btn-sub h2, .btn-sub h3, .btn-sub h4, .btn-sub .font-display { font-family: 'Poppins', 'Inter', sans-serif; }
`;

// ─── Content: Providers ─────────────────────────────────────────────
const PROVIDER = {
  eyebrow: "Provider subscriptions",
  title: "Start free. Grow with us. Or build it with us from day one.",
  intro:
    "Better Together is a portal with a meeting point, not a directory that lists whoever pays the most. Every level gets you in the door. Each step up gives you more ways to be found, trusted and referred by participants and families.",
  plans: [
    {
      name: "Free Business Standard",
      desc: "Your foot in the door. Get your business online and see what the community is about. Advertising is for paid members.",
      price: "$0",
      unit: "forever",
      cta: "Join free",
      variant: "outline",
      lead: null,
      features: [
        "Basic business profile",
        "Basic directory listing",
        "Your own dashboard",
        "See upcoming events",
        "Read the community Q&A",
        "Friendly support from Admin",
      ],
    },
    {
      name: "Business Premium",
      badge: "Yearly",
      desc: "Get seen, get referred, get growing. For providers ready to join the conversation.",
      price: "$950",
      unit: "per year",
      note: "One payment, billed yearly",
      cta: "Choose Business Premium",
      variant: "blue",
      lead: "Everything in Free, plus:",
      features: [
        "Advertising on the BTN website",
        "Local referrals",
        "Members-only events and real networking",
        "Post, ask and reply in the Q&A",
        "Learning Hub, documents and templates",
        "Learning Innovation Lab access",
        "Request a BTN Standards assessment for an endorsed profile and priority placement",
        "Option to add the Spotlight boost",
      ],
    },
    {
      name: "Founding Member",
      badge: "Limited founding spots",
      desc: "Get in early and be part of the foundation. One payment covers your business for three years.",
      price: "$2,500",
      unit: "one-off",
      highlightNote:
        "Covers 3 years, about $833 a year. Save $350 compared with 3 years of Premium.",
      cta: "Become a Founding Member",
      variant: "dark",
      lead: "Everything in Business Premium, for 3 years, plus:",
      features: [
        "BTN Standards assessment included",
        "Endorsements and recommendations from trusted voices in the NDIS community",
        "Priority connections with providers and decision-makers",
        "Founding Member badge: you were here first",
        "A say in how the network grows",
      ],
    },
  ],
  compare: {
    title: "Compare everything side by side",
    sub: "Exactly what you get at each level.",
    columns: [
      { name: "Free", price: "$0" },
      { name: "Business Premium", price: "$950 a year" },
      { name: "Founding Member", price: "$2,500 for 3 years", highlight: true },
    ],
    groups: [
      {
        label: "Get found",
        rows: [
          ["Business profile", "Basic profile", "Full profile", "Full profile"],
          [
            "Provider directory listing",
            "Basic listing",
            "Listing + priority placement once assessed",
            "Listing + priority placement",
          ],
          ["Your own dashboard", true, true, true],
          ["Advertising on the BTN website", false, true, true],
          [
            "Featured Marketing & Spotlight add-on",
            false,
            "Can add ($450/month)",
            "Can add ($450/month)",
          ],
        ],
      },
      {
        label: "Connect & grow",
        rows: [
          [
            "Events",
            "View upcoming events",
            "Members-only events and networking",
            "Members-only events and networking",
          ],
          ["Community Q&A", "Read only", "Post, ask and reply", "Post, ask and reply"],
          ["Local referrals", false, true, true],
          ["Priority connections with providers and decision-makers", false, false, true],
        ],
      },
      {
        label: "Learn & build",
        rows: [
          ["Learning Hub", false, true, true],
          ["Documents and templates", false, true, true],
          ["Learning Innovation Lab", false, true, true],
        ],
      },
      {
        label: "Trust & recognition",
        rows: [
          ["BTN Standards assessment", false, "On request", true],
          [
            "Endorsements and recommendations from the NDIS community",
            false,
            "Endorsed profile once assessed",
            true,
          ],
          ["Founding Member badge", false, false, true],
        ],
      },
      {
        label: "Support & terms",
        rows: [
          ["Connect with Admin", "Friendly support", "Direct Admin support", "Direct Admin support"],
          ["How long it lasts", "Forever", "12 months", "3 years"],
          ["How you pay", "Nothing to pay", "One payment each year", "One payment, once"],
        ],
      },
    ],
  },
  cta: {
    title: "Not sure which one fits?",
    text: "Start free and upgrade anytime. Ask Shazza on the site, or talk to us and we will help you work out the right fit for your business.",
  },
};

// ─── Content: Participants ──────────────────────────────────────────
const PARTICIPANT = {
  eyebrow: "For participants, families and service users",
  title: "Find the right support. And someone to walk with you.",
  intro:
    "Joining Better Together is free. Find local providers, learn your rights and connect with people who get it. When you want extra help, add a buddy.",
  plans: [
    {
      name: "Free & Connected",
      desc: "Your way in. Everything you need to find supports and join the community.",
      price: "$0",
      unit: "forever",
      note: "No credit card needed",
      cta: "Join free",
      variant: "outline",
      lead: null,
      features: [
        "Search for local providers, with no hassle from providers",
        "Post what you need and we help you find a provider",
        "Your details stay private. You choose who to contact, and when",
        "Save the providers you like",
        "Come along to events",
        "Ask questions in the community",
        "Learning Hub, templates and tips",
        "Rights and safety information",
        "Help from our Admin team",
      ],
    },
    {
      name: "Get a Buddy",
      badge: "Someone in your corner",
      desc: "Because finding your way through the NDIS should not feel like a solo mission.",
      price: "$350",
      unit: "per year",
      highlightNote: "One payment for the year. Less than $7 a week.",
      cta: "Get a Buddy",
      variant: "dark",
      lead: "Everything in Free & Connected, plus:",
      features: [
        "Your own buddy: a real person who knows the NDIS",
        "Help to find and organise the right services",
        "Clear guidance on your plan, funding and reviews",
        "Help to get ready for meetings",
        "Access to experienced professionals and advocates",
        "Connection to trusted legal teams if you need backup",
        "ART training and resources",
        "Priority matching with reputable providers",
      ],
    },
  ],
  compare: {
    title: "Compare the plans",
    sub: "Exactly what you get with each one.",
    columns: [
      { name: "Free & Connected", price: "$0" },
      { name: "Get a Buddy", price: "$350 a year", highlight: true },
    ],
    groups: [
      {
        label: "Find the right supports",
        rows: [
          ["Search the provider directory", true, true],
          ["Post what you need and we help find a local provider", true, true],
          ["Save providers you like", true, true],
          ["Priority matching with trusted, reputable providers", false, true],
        ],
      },
      {
        label: "Learn & connect",
        rows: [
          ["Community events", true, true],
          ["Ask questions in the community Q&A", true, true],
          ["Learning Hub", true, true],
          ["Templates and tips for managing your supports at home", true, true],
          ["Rights and safety information", true, true],
        ],
      },
      {
        label: "Someone in your corner",
        rows: [
          ["Your own personal buddy", false, true],
          ["Help to find and organise your services", false, true],
          ["Step-by-step guidance on your plan, funding and reviews", false, true],
          ["Help to get ready for meetings", false, true],
          ["Access to experienced professionals and advocates", false, true],
          ["Connection to trusted legal teams", false, true],
          ["ART training and resources", false, true],
        ],
      },
      {
        label: "Support & cost",
        rows: [
          ["Connect with Admin", true, true],
          ["Cost", "Free, no card needed", "$350 a year"],
        ],
      },
    ],
  },
  cta: {
    title: "Not sure where to start?",
    text: "Join free and look around first. You can add a buddy any time. Have a question? Ask Matilda, our helper on the site, or email us.",
  },
};

const ENDORSEMENT_STEPS = [
  {
    title: "Recommended by Admin",
    text: "Your business joins and is recommended into the network.",
  },
  {
    title: "Checked by Admin",
    text: "We assess your business for alignment with the disability community and the BTN Standards.",
  },
  {
    title: "Superstar",
    text: "Awarded the BTN Standards: a fully endorsed profile participants and families can trust.",
  },
];

const SERVICE_PROMISES = [
  {
    icon: Search,
    title: "Easy to search",
    text: "Look for local providers by service and location, in your own time, at your own pace.",
  },
  {
    icon: ShieldCheck,
    title: "Your details are protected",
    text: "Your personal details are not shared with providers. They stay private.",
  },
  {
    icon: PhoneOff,
    title: "No pushy providers",
    text: "Providers cannot chase you or cold-call you. Nobody gets your number unless you give it to them.",
  },
  {
    icon: Hand,
    title: "You choose",
    text: "You decide who to contact and when. Reach out when you are ready, and only to the providers you pick.",
  },
];

const BUDDY_RIGHT_FOR_ME = [
  "You don't have a support coordinator",
  "You have run out of support coordination funding",
  "You are waiting on a review or a new plan and need someone to talk things through with",
  "You just want someone in your corner who gets it",
];

const BUDDY_HELPS = [
  {
    title: "Finding services",
    text: "Your buddy helps you find local providers that fit your needs and get your services organised.",
  },
  {
    title: "Understanding your plan",
    text: "Plain-English help with your plan, your funding and what the rules mean for you.",
  },
  {
    title: "Meetings and reviews",
    text: "Tips to get ready for planning meetings and reviews, so you go in feeling prepared.",
  },
  {
    title: "Knowing your rights",
    text: "Straightforward guidance on your rights, and what to do if something is not right.",
  },
  {
    title: "Extra backup",
    text: "If you need it, we connect you with experienced advocates and trusted legal teams, plus ART training and resources.",
  },
  {
    title: "Trusted providers",
    text: "When it is time to choose a provider, you get priority matching with reputable services.",
  },
];

const BUDDY_STEPS = [
  {
    title: "Join for free",
    text: "Create your free profile and tell us what support you are looking for.",
  },
  {
    title: "Add a buddy",
    text: "Choose the Buddy plan when you want someone in your corner. One payment covers the year.",
  },
  {
    title: "Meet your buddy",
    text: "You are matched with a peer or professional buddy who gets to know you, your goals and the bumps in your road.",
  },
  {
    title: "Work through it together",
    text: "Find services, get ready for meetings and reviews, and get backup when you need it.",
  },
];

const HELPERS = {
  shazza: {
    img: "/assistants/shazza-kangaroo-static.webp",
    imgBg: "#E4EEFC",
    eyebrow: "For providers and businesses",
    title: "Meet Shazza the kangaroo",
    text: "Shazza is the helper for providers and businesses. Ask her about the subscription plans, setting up your profile, the BTN Standards assessment, events or the Spotlight add-on. She points you in the right direction so you can get set up and get connected faster.",
    tag: "Look for Shazza on the site and ask away.",
    accent: "#8DB3E8",
  },
  matilda: {
    img: "/assistants/matilda-koala-static.webp",
    imgBg: "#EAF6DF",
    eyebrow: "For participants and families",
    title: "Meet Matilda the koala",
    text: "Matilda is your friendly helper on the Better Together website. Ask her where to find things, how the site works, what the plans include or how to get a buddy. She helps you find your way around, so you are never stuck wondering where to click next.",
    tag: "Look for Matilda on the site and say g'day.",
    accent: "#B9D98A",
  },
};

// ─── Small building blocks ──────────────────────────────────────────
const Eyebrow = ({ children, className = "" }) => (
  <p
    className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-3 ${className}`}
    style={{ color: PURPLE }}
  >
    {children}
  </p>
);

const SectionHeading = ({ eyebrow, title, sub }) => (
  <div className="text-center max-w-2xl mx-auto mb-10">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="text-2xl md:text-[34px] leading-tight font-bold" style={{ color: NAVY }}>
      {title}
    </h2>
    {sub && <p className="mt-3 text-slate-500 text-[15px] leading-relaxed">{sub}</p>}
  </div>
);

const PlanCard = ({ plan, registerTo }) => {
  const dark = plan.variant === "dark";
  const blue = plan.variant === "blue";

  const ctaClass = dark
    ? "text-slate-900 hover:brightness-95"
    : blue
      ? "text-white hover:brightness-110"
      : "border-2 bg-white hover:bg-slate-50";
  const ctaStyle = dark
    ? { background: LIME }
    : blue
      ? { background: BLUE }
      : { borderColor: NAVY, color: NAVY };

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-7 md:p-8 ${
        dark ? "text-white shadow-2xl" : "bg-white shadow-sm"
      } ${blue ? "border-[1.5px]" : dark ? "" : "border border-slate-100"}`}
      style={dark ? { background: NAVY } : blue ? { borderColor: "#9DBCE6" } : undefined}
    >
      {plan.badge && (
        <span
          className="self-start mb-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={
            dark
              ? { background: LIME, color: NAVY }
              : { background: "#E3EDFB", color: BLUE }
          }
        >
          {plan.badge}
        </span>
      )}

      <h3 className="text-xl font-bold" style={dark ? undefined : { color: NAVY }}>
        {plan.name}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-blue-100" : "text-slate-500"}`}>
        {plan.desc}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span
          className="font-display text-4xl md:text-[44px] font-extrabold leading-none"
          style={dark ? undefined : { color: NAVY }}
        >
          {plan.price}
        </span>
        <span className={`text-sm ${dark ? "text-blue-100" : "text-slate-500"}`}>
          {plan.unit}
        </span>
      </div>
      {plan.note && <p className="mt-2 text-xs text-slate-500">{plan.note}</p>}
      {plan.highlightNote && (
        <p className="mt-2 text-xs font-semibold leading-snug" style={{ color: LIME }}>
          {plan.highlightNote}
        </p>
      )}

      <Link
        to={registerTo}
        className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-bold transition ${ctaClass}`}
        style={ctaStyle}
      >
        {plan.cta}
      </Link>

      {plan.lead && (
        <p className={`mt-6 text-sm font-semibold ${dark ? "text-white" : "text-slate-700"}`}>
          {plan.lead}
        </p>
      )}
      <ul className={`space-y-3 ${plan.lead ? "mt-3" : "mt-6"}`}>
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm leading-snug">
            <Check
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              strokeWidth={3}
              style={{ color: dark ? LIME : "#2E9E5B" }}
            />
            <span className={dark ? "text-white" : "text-slate-600"}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Cell = ({ value }) => {
  if (value === true)
    return <Check className="mx-auto h-5 w-5 text-emerald-600" strokeWidth={3} />;
  if (value === false)
    return <Minus className="mx-auto h-4 w-4 text-slate-300" strokeWidth={2.5} />;
  return <span className="text-[13px] leading-snug text-slate-600">{value}</span>;
};

const CompareTable = ({ compare, highlightBg }) => {
  const cols = compare.columns;
  return (
    <>
    <p className="mb-3 text-center text-xs font-medium text-slate-500 md:hidden">
      Swipe the table sideways to see every plan →
    </p>
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: `${170 + cols.length * 150}px` }}>
          <thead>
            <tr className="border-b border-slate-100">
              <th className="sticky left-0 z-10 w-[170px] bg-white px-4 py-5 text-left text-sm font-medium text-slate-500 md:static md:w-auto md:px-7">
                What you get
              </th>
              {cols.map((c) => (
                <th
                  key={c.name}
                  className="px-4 py-5 text-center align-bottom"
                  style={c.highlight ? { background: highlightBg } : undefined}
                >
                  <div className="font-display text-sm font-bold md:text-[15px]" style={{ color: NAVY }}>
                    {c.name}
                  </div>
                  <div className="mt-1 text-xs font-normal text-slate-500">{c.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.groups.map((g) => (
              <GroupRows key={g.label} group={g} cols={cols} highlightBg={highlightBg} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

const GroupRows = ({ group, cols, highlightBg }) => (
  <>
    <tr>
      <td
        colSpan={cols.length + 1}
        className="px-4 pb-2 pt-6 text-[11px] font-bold uppercase tracking-[0.16em] md:px-7"
        style={{ color: PURPLE }}
      >
        <span className="sticky left-4">{group.label}</span>
      </td>
    </tr>
    {group.rows.map(([label, ...values]) => (
      <tr key={label} className="border-t border-slate-100">
        <td
          className="sticky left-0 z-10 w-[170px] bg-white px-4 py-4 text-[13px] font-medium shadow-[1px_0_0_#F1F5F9] md:static md:w-auto md:px-7 md:text-sm md:shadow-none"
          style={{ color: NAVY }}
        >
          {label}
        </td>
        {values.map((v, i) => (
          <td
            key={i}
            className="px-4 py-4 text-center align-middle"
            style={cols[i].highlight ? { background: highlightBg } : undefined}
          >
            <Cell value={v} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const HelperCard = ({ helper, featured }) => (
  <div
    className={`flex flex-col gap-6 rounded-2xl bg-white p-6 sm:flex-row sm:items-center md:p-8 ${
      featured ? "border-[1.5px] shadow-sm" : "shadow-sm"
    }`}
    style={featured ? { borderColor: helper.accent } : undefined}
  >
    <div
      className="flex h-40 w-36 flex-shrink-0 items-center justify-center self-center overflow-hidden rounded-2xl sm:self-auto"
      style={{ background: helper.imgBg }}
    >
      <img
        src={helper.img}
        alt={helper.title}
        className="h-full w-full object-contain p-2"
      />
    </div>
    <div>
      <Eyebrow className="!mb-2">{helper.eyebrow}</Eyebrow>
      <h3 className="text-xl font-bold md:text-2xl" style={{ color: NAVY }}>
        {helper.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-500">{helper.text}</p>
      <p className="mt-3 text-sm font-semibold" style={{ color: NAVY }}>
        {helper.tag}
      </p>
    </div>
  </div>
);

// ─── Page ───────────────────────────────────────────────────────────
const SubscriptionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const audience = searchParams.get("for") === "participant" ? "participant" : "provider";
  const isProvider = audience === "provider";
  const content = isProvider ? PROVIDER : PARTICIPANT;
  const registerTo = `/register?role=${audience}`;

  const setAudience = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "provider") next.delete("for");
    else next.set("for", value);
    setSearchParams(next, { replace: true });
  };

  const helpers = isProvider
    ? [HELPERS.shazza, HELPERS.matilda]
    : [HELPERS.matilda, HELPERS.shazza];

  return (
    <div className="btn-sub min-h-screen" style={{ background: "#F4F6FA" }}>
      <style>{FONT_CSS}</style>
      <div className="h-1 w-full bg-gradient-to-r from-[#2D3FD8] via-[#D6267E] to-[#7BC043]" />

      {/* ─── Audience switch ─────────────────────────────────────── */}
      <div className="flex justify-center px-4 pt-10">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {[
            { key: "provider", label: "For providers", icon: Building2 },
            { key: "participant", label: "For participants & families", icon: Users },
          ].map(({ key, label, icon: Icon }) => {
            const active = audience === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAudience(key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition sm:px-5 sm:text-sm ${
                  active ? "text-white shadow" : "text-slate-500 hover:text-slate-800"
                }`}
                style={active ? { background: NAVY } : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Hero + plans ────────────────────────────────────────── */}
      <section className="px-4 pb-16 pt-10 sm:px-6 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1
              className="text-3xl font-extrabold leading-[1.15] md:text-5xl"
              style={{ color: NAVY }}
            >
              {content.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-500 md:text-base">
              {content.intro}
            </p>
          </div>

          <div
            className={`mx-auto grid items-start gap-6 ${
              isProvider ? "max-w-6xl lg:grid-cols-3" : "max-w-4xl md:grid-cols-2"
            }`}
          >
            {content.plans.map((p) => (
              <PlanCard key={p.name} plan={p} registerTo={registerTo} />
            ))}
          </div>

          {isProvider && (
            <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-dashed border-pink-200 bg-white p-7 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="max-w-3xl">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-pink-600">
                  Optional add-on for paid members
                </p>
                <h3 className="text-xl font-bold md:text-2xl" style={{ color: NAVY }}>
                  Featured Marketing &amp; Spotlight
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Want new clients to find you first? Spotlight puts your business front and
                  centre on key pages and in targeted advertising on our website. Month to month,
                  no lock-in: choose the months that suit you. Only 10 spots open each month.
                </p>
              </div>
              <div className="flex-shrink-0 md:text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold" style={{ color: NAVY }}>
                    $450
                  </span>
                  <span className="text-sm text-slate-500">per month</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Add to Business Premium or Founding Member
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Participant-only: services + buddy program ─────────── */}
      {!isProvider && (
        <>
          <section className="px-4 pb-16 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <SectionHeading
                eyebrow="Looking for services"
                title="Find services your way. No hassle."
                sub="Looking for support should not mean your phone ringing off the hook. On Better Together, you stay in control the whole way."
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICE_PROMISES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EEFA]">
                      <Icon className="h-5 w-5" style={{ color: NAVY }} />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: NAVY }}>
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-16 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <SectionHeading
                eyebrow="The buddy program"
                title="Who is a buddy?"
                sub="A buddy is a peer or a professional who can guide you through the bumps in the road. They are a real, down-to-earth person who knows the disability sector inside out. They break down the confusing stuff, help you find the right services and stand alongside you at the moments that matter, like planning meetings and reviews."
              />

              <div
                className="mx-auto max-w-4xl rounded-2xl border-[1.5px] bg-white p-7 md:p-8"
                style={{ borderColor: "#C8E08F" }}
              >
                <h3 className="text-xl font-bold" style={{ color: NAVY }}>
                  Is a buddy right for me?
                </h3>
                <p className="mt-2 text-sm text-slate-500">A buddy can help in the meantime if:</p>
                <ul className="mt-4 space-y-3">
                  {BUDDY_RIGHT_FOR_ME.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" strokeWidth={3} />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-slate-500">
                  You don&apos;t have to go it alone while you wait. Your buddy helps you keep
                  moving until the right supports are in place.
                </p>
              </div>

              <h3
                className="mb-6 mt-14 text-center text-xl font-bold md:text-2xl"
                style={{ color: NAVY }}
              >
                What your buddy can help with
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {BUDDY_HELPS.map(({ title, text }) => (
                  <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                    <h4 className="text-base font-bold" style={{ color: NAVY }}>
                      {title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
                  </div>
                ))}
              </div>

              <h3
                className="mb-6 mt-14 text-center text-xl font-bold md:text-2xl"
                style={{ color: NAVY }}
              >
                How does it work?
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {BUDDY_STEPS.map(({ title, text }, i) => (
                  <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                    <span
                      className="font-display mb-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: NAVY }}
                    >
                      {i + 1}
                    </span>
                    <h4 className="text-base font-bold" style={{ color: NAVY }}>
                      {title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── Comparison ──────────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6">
        <div className={`mx-auto ${isProvider ? "max-w-6xl" : "max-w-4xl"}`}>
          <SectionHeading title={content.compare.title} sub={content.compare.sub} />
          <CompareTable
            compare={content.compare}
            highlightBg={isProvider ? "#F1EEFB" : "#EEF8E4"}
          />
        </div>
      </section>

      {/* ─── Provider-only: endorsement steps ───────────────────── */}
      {isProvider && (
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHeading title="How BTN endorsement works" />
            <div className="grid gap-5 md:grid-cols-3">
              {ENDORSEMENT_STEPS.map(({ title, text }, i) => (
                <div key={title} className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
                  <p className="text-xs font-bold" style={{ color: PURPLE }}>
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold" style={{ color: NAVY }}>
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Meet Matilda and Shazza ────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Help is always close by"
            title="Meet Matilda and Shazza"
            sub="Got a question? Our two helpers on the website are here to point you in the right direction."
          />
          <div className="space-y-5">
            {helpers.map((h, i) => (
              <HelperCard key={h.title} helper={h} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>
            {content.cta.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-500">{content.cta.text}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={registerTo}
              className="rounded-full px-7 py-3 text-sm font-bold text-white transition hover:brightness-125"
              style={{ background: NAVY }}
            >
              Join free
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all rounded-full border-2 bg-white px-6 py-3 text-sm font-bold transition hover:bg-slate-50"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;