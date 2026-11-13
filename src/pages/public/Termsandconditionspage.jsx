import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ScrollText,
  ShieldCheck,
  UserCheck,
  Eye,
  Brain,
  Scale,
  Lock,
  MessageSquare,
  Award,
  Users,
  Heart,
  Ban,
  HandHeart,
  ChevronRight,
  ArrowRight,
  Target,
  Building2,
  Stethoscope,
  Briefcase,
  HandHelping,
  Compass,
  AlertCircle,
  Info,
  FileText,
  RefreshCw,
  Mail,
  Phone,
  CheckCircle2,
  Gavel,
} from "lucide-react";

// ─── Section 2 — Who Can Use the Platform ─────────────────────────────
const userTypes = [
  {
    num: "2.1",
    title: "NDIS Participants, Families & Carers",
    icon: HandHelping,
    color: "from-purple-500 to-indigo-600",
    items: [
      "Disability supports",
      "Health, wellbeing, or community services",
      "Information, events, or peer connection",
      "A safe, accessible place to explore options",
    ],
  },
  {
    num: "2.2",
    title: "Businesses",
    icon: Building2,
    color: "from-blue-500 to-cyan-600",
    items: [
      "Disability supports",
      "Accessibility and assistive technology",
      "Health and wellbeing",
      "Home and living supports",
      "Community participation",
      "Professional services (e.g., legal, accounting, consulting)",
    ],
  },
  {
    num: "2.3",
    title: "Health-Care Service Professionals",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-600",
    items: [
      "Allied health practitioners",
      "Mental health professionals",
      "Behaviour support practitioners",
      "Nurses and health-care workers",
      "Rehabilitation and recovery specialists",
    ],
  },
  {
    num: "2.4",
    title: "Support Workers & Sector Staff",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
    items: [
      "Disability support",
      "Aged care",
      "Community services",
      "Peer work",
      "Support coordination or recovery coaching",
      "Administrative or service delivery roles",
    ],
  },
  {
    num: "2.5",
    title: "People Seeking a Range of Services",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    items: [
      "Disability supports",
      "Health or wellbeing services",
      "Social, recreational, or community activities",
      "General information or connection",
      "You do not need to be an NDIS participant to use the Platform",
    ],
  },
];

// ─── Section 4 — 9 Qualities of Ethical, Person-Centred Providers ─────
const providerQualities = [
  {
    num: "4.1",
    title: "Person-Centred Practice",
    icon: UserCheck,
    color: "from-purple-500 to-indigo-600",
    items: [
      "Prioritises participant goals, preferences, and autonomy",
      "Supports genuine choice and control",
      "Respects cultural, communication, and accessibility needs",
    ],
  },
  {
    num: "4.2",
    title: "Understanding Disability-First Perspectives",
    icon: Eye,
    color: "from-pink-500 to-rose-600",
    items: [
      "Recognises disability as a valid identity and lived experience",
      "Values lived experience as expertise",
      "Engages respectfully with diverse disability perspectives",
    ],
  },
  {
    num: "4.3",
    title: "Disability-First Theory",
    icon: Brain,
    color: "from-blue-500 to-cyan-600",
    items: [
      "Operates from a rights-based, non-deficit framework",
      "Avoids medicalised or paternalistic approaches",
      "Centres dignity, autonomy, and self-determination",
    ],
  },
  {
    num: "4.4",
    title: "Ethical Conduct",
    icon: Scale,
    color: "from-indigo-500 to-purple-600",
    items: [
      "Acts with honesty, transparency, and integrity",
      "Maintains clear professional boundaries",
      "Avoids coercive, misleading, or exploitative behaviour",
    ],
  },
  {
    num: "4.5",
    title: "Safety & Accountability",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    items: [
      "Provides safe, lawful, and compliant services",
      "Responds appropriately to concerns or complaints",
      "Upholds mandatory reporting obligations",
    ],
  },
  {
    num: "4.6",
    title: "Respectful Communication",
    icon: MessageSquare,
    color: "from-cyan-500 to-blue-600",
    items: [
      "Communicates clearly and without discrimination",
      "Engages professionally with participants, families, and peers",
    ],
  },
  {
    num: "4.7",
    title: "Reliability & Professionalism",
    icon: Award,
    color: "from-amber-500 to-orange-600",
    items: [
      "Shows up on time and delivers what is promised",
      "Maintains accurate records and transparent pricing",
    ],
  },
  {
    num: "4.8",
    title: "Community Alignment",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    items: [
      "Contributes positively to the Network culture",
      "Respects the purpose of the community",
      "Does not engage in predatory or harmful behaviour",
    ],
  },
  {
    num: "4.9",
    title: "Rights-Based Practice",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    items: [
      "Upholds participant rights, dignity, and independence",
      "Supports informed decision-making",
      "Never pressures participants into services",
    ],
  },
];

// ─── Section 9 — Platform Conduct Requirements ────────────────────────
const conductRequirements = [
  "Act respectfully and lawfully",
  "Avoid harassment, discrimination, or harmful behaviour",
  "Not upload false, misleading, or defamatory content",
  "Not pressure or solicit participants inappropriately",
  "Not misuse the Platform for unethical or illegal purposes",
];

// ─── Section navigation (table of contents) ──────────────────────────
const sectionNav = [
  { id: "purpose", label: "1. Purpose of the Platform" },
  { id: "who-can-use", label: "2. Who Can Use the Platform" },
  { id: "eligibility", label: "3. Provider Eligibility" },
  { id: "qualities", label: "4. Qualities Required" },
  { id: "removal", label: "5. Provider Removal" },
  { id: "rejoining", label: "6. Rejoining After Removal" },
  { id: "donation-definition", label: "7. Definition of a Donation" },
  { id: "donation-conditions", label: "8. Conditions for Donating" },
  { id: "conduct", label: "9. Platform Conduct" },
  { id: "accuracy", label: "10. Information Accuracy" },
  { id: "privacy", label: "11. Privacy & Data Use" },
  { id: "liability", label: "12. Limitation of Liability" },
  { id: "ip", label: "13. Intellectual Property" },
  { id: "changes", label: "14. Changes to These Terms" },
  { id: "contact", label: "15. Contact Information" },
];

const TermsAndConditionsPage = () => {
  const [activeSection, setActiveSection] = useState("purpose");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 md:pt-16" style={{ background: "#14306B" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "#D8F26A" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#D8F26A" }}>
            Legal &amp; provider standards
          </p>
          <h1 className="text-3xl font-extrabold leading-[1.15] text-white md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-blue-100/90 md:text-base">
            The Better Together Network is committed to maintaining a safe,
            ethical, person-centred environment for people with disability,
            their families, and the broader community.
          </p>
          <p className="mt-6 text-sm text-blue-100/70">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* ─── Intro Statement ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-[24px] shadow-xl p-6 md:p-8">
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            These Terms &amp; Conditions outline the expectations,
            responsibilities, and conditions for all users of The Better
            Together Network online platform. By accessing or using the
            Platform, you agree to these Terms. If you do not agree, you must
            not use the Platform.
          </p>
        </div>
      </section>

      {/* ─── Main Content with Sticky Sidebar ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sticky TOC Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                  On this page
                </h3>
                <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                  {sectionNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-start gap-2 ${
                        activeSection === item.id
                          ? "bg-[#EEF2FA] text-[#14306B] font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#14306B]"
                      }`}
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-transform ${
                          activeSection === item.id ? "translate-x-0.5" : ""
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* ─── 1. Purpose of the Platform ────────────────── */}
            <article id="purpose" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 1
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Purpose of the Platform
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  The Platform exists to:
                </p>
                <ul className="space-y-3">
                  {[
                    "Connect people with ethical, values-aligned NDIS providers, businesses, and professionals",
                    "Support participants to navigate services, especially when Support Coordination is limited or unavailable",
                    "Provide information, events, resources, and community connection",
                    "Promote choice, control, dignity, and rights-based practice",
                    "Strengthen a community built on safety, respect, and accountability",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#2E9E5B] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mt-6">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong>Important:</strong> The Platform is{" "}
                    <strong>not</strong> an NDIS provider, Support Coordinator,
                    Plan Manager, or crisis service.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 2. Who Can Use the Platform ───────────────── */}
            <article id="who-can-use" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 2
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Who Can Use the Platform
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
                <p className="text-base text-slate-700 leading-relaxed">
                  The Better Together Network supports a broad community of
                  people and organisations connected to disability, health, and
                  community services. The Platform may be used by:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.num}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-[#14306B] flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Section {type.num}
                          </p>
                          <h4 className="text-base font-bold text-[#14306B] mt-0.5">
                            {type.title}
                          </h4>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {type.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* User Confirmation 2.6 */}
              <div className="mt-6 bg-[#EEF2FA] border border-[#C9D6EE] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14306B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#14306B] mb-2">
                      Section 2.6 — User Confirmation
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      All users confirm that:
                    </p>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      <li>
                        • They are at least 18 years old, or supported by a
                        responsible adult
                      </li>
                      <li>• Information provided is accurate and truthful</li>
                      <li>
                        • They will use the Platform respectfully, lawfully,
                        and ethically
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            {/* ─── 3. Provider Eligibility ───────────────────── */}
            <article id="eligibility" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 3
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Provider Eligibility to Operate Within the Network
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Only providers who meet our standards of conduct,
                  professionalism, and values alignment may operate within the
                  Platform.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  Providers must demonstrate that they are:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Ethical",
                    "Person-centred",
                    "Rights-based",
                    "Safe and accountable",
                    "Aligned with the values of The Better Together Network",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-xl"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-900">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-base text-slate-700 leading-relaxed pt-2">
                  Providers who do not meet these standards may be{" "}
                  <span className="text-rose-600 font-medium">declined</span>,{" "}
                  <span className="text-rose-600 font-medium">suspended</span>,
                  or{" "}
                  <span className="text-rose-600 font-medium">removed</span> at
                  our discretion.
                </p>
              </div>
            </article>

            {/* ─── 4. Qualities Required of Providers ────────── */}
            <article id="qualities" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 4
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Qualities Required of Providers
                  </h2>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm text-slate-500">
                  Providers operating within the Network must demonstrate the
                  following:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {providerQualities.map((quality) => {
                  const Icon = quality.icon;
                  return (
                    <div
                      key={quality.num}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-[#14306B] flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Section {quality.num}
                          </p>
                          <h4 className="text-base font-bold text-[#14306B] mt-0.5">
                            {quality.title}
                          </h4>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {quality.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* ─── 5. Provider Removal ───────────────────────── */}
            <article id="removal" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 5
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Provider Removal
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  If a provider fails to meet the standards required by the
                  Network, we may remove them from the Platform. Where a
                  provider or business is deemed unsuitable or inappropriate:
                </p>
                <ul className="space-y-3">
                  {[
                    "They will be notified in writing",
                    "All payments made to date will be refunded in full",
                    "Their listing and access will be removed",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-xl p-4 mt-2">
                  <p className="text-sm text-rose-900 leading-relaxed">
                    This protects the safety, integrity, and values of the
                    Network.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 6. Rejoining After Formal Removal ─────────── */}
            <article id="rejoining" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 6
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Rejoining After Formal Removal
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Any individual, business, or related entity that has been
                  formally removed — including any new entity reasonably
                  considered a continuation of the original operator — may
                  rejoin under a{" "}
                  <strong className="text-[#14306B]">paid subscription</strong>.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  However:
                </p>
                <ul className="space-y-3">
                  {[
                    "The Network is under no obligation to list, promote, reinstate, or include the provider in any directory, group, forum, communication channel, or referral pathway",
                    "A paid subscription does not create entitlement to visibility, access, or participation",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* ─── 7. Definition of a Donation ───────────────── */}
            <article id="donation-definition" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 7
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Definition of a Donation
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Where a removed provider elects to pay for a subscription
                  after removal, that payment will be classified as a{" "}
                  <strong className="text-[#14306B]">donation</strong>.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    A donation is:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "A voluntary financial contribution",
                      "Made without any expectation of service delivery, platform access, visibility, or reinstatement",
                      "Not a membership fee",
                      "Not a contractual agreement",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-blue-900 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-slate-600 italic">
                  Donations do not create any entitlement to Network services
                  or participation.
                </p>
              </div>
            </article>

            {/* ─── 8. Conditions for Donating Providers ──────── */}
            <article id="donation-conditions" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 8
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Conditions Applying to Donating Providers
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Providers who donate after formal removal acknowledge that:
                </p>
                <ul className="space-y-3">
                  {[
                    "Their business will not be listed, displayed, or promoted",
                    "They will not have access to administrative support or communication channels",
                    "They will not be included in provider groups, directories, or referral pathways",
                    "Their contribution is treated solely as a donation supporting the mission of the Network",
                    "Donations do not reinstate access, visibility, or standing",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#EEF2FA] border border-[#C9D6EE] rounded-xl p-5 mt-4">
                  <p className="text-sm text-slate-800 leading-relaxed italic">
                    &ldquo;We appreciate contributions, but donations do not
                    restore membership or platform access.&rdquo;
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 9. Platform Conduct Requirements ──────────── */}
            <article id="conduct" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 9
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Platform Conduct Requirements
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  All users must:
                </p>
                <ul className="space-y-3">
                  {conductRequirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl"
                    >
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* ─── 10. Information Accuracy ──────────────────── */}
            <article id="accuracy" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 10
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Information Accuracy
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  We aim to provide accurate and helpful information, but:
                </p>
                <ul className="space-y-2">
                  {[
                    "Content may change",
                    "Provider listings are based on information supplied by providers",
                    "We do not guarantee the quality, suitability, or availability of any service",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-cyan-50 border-l-4 border-cyan-400 rounded-r-xl p-4 mt-2">
                  <p className="text-sm text-cyan-900 leading-relaxed">
                    <strong>Users should verify information</strong> before
                    making decisions.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 11. Privacy and Data Use ──────────────────── */}
            <article id="privacy" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 11
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Privacy and Data Use
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  We protect your privacy and handle personal information in
                  accordance with our Privacy Policy.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  We will:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-900">
                      Never sell your data
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-900">
                      Only share with consent or where legally required
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-4 mt-2">
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    Users are responsible for keeping login details secure.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 12. Limitation of Liability ───────────────── */}
            <article id="liability" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 12
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Limitation of Liability
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  To the maximum extent permitted by law, the Network is{" "}
                  <strong className="text-[#14306B]">not liable</strong> for:
                </p>
                <ul className="space-y-2">
                  {[
                    "Decisions made based on Platform content",
                    "The actions or omissions of providers",
                    "Loss arising from Platform downtime or technical issues",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="bg-slate-100 border-l-4 border-slate-400 rounded-r-xl p-4 mt-2">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Nothing in these Terms limits rights under{" "}
                    <strong>Australian Consumer Law</strong>.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 13. Intellectual Property ─────────────────── */}
            <article id="ip" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 13
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Intellectual Property
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <p className="text-base text-slate-700 leading-relaxed">
                  All Platform content is owned by The Better Together Network
                  unless otherwise stated. Users may not{" "}
                  <strong className="text-[#14306B]">
                    copy, reproduce, or distribute
                  </strong>{" "}
                  content without permission.
                </p>
              </div>
            </article>

            {/* ─── 14. Changes to These Terms ────────────────── */}
            <article id="changes" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 14
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Changes to These Terms
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <p className="text-base text-slate-700 leading-relaxed">
                  We may update these Terms at any time.{" "}
                  <strong className="text-[#14306B]">
                    Continued use of the Platform indicates acceptance
                  </strong>{" "}
                  of updated Terms.
                </p>
              </div>
            </article>

            {/* ─── 15. Contact Information ───────────────────── */}
            <article id="contact" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#14306B] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7A2FB8] mb-1">
                    Section 15
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#14306B]">
                    Contact Information
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <p className="text-base text-slate-700 leading-relaxed mb-5">
                  For questions or concerns:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href="mailto:weare@bettertogethernetwork.com.au"
                    className="flex items-center gap-3 p-4 bg-[#EEF2FA] border border-[#C9D6EE] rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#14306B] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#7A2FB8] uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm font-medium text-[#14306B] group-hover:text-[#7A2FB8] transition-colors">
                        weare@bettertogethernetwork.com.au
                      </p>
                    </div>
                  </a>
                  <a
                    href="tel:0403678767"
                    className="flex items-center gap-3 p-4 bg-[#EEF2FA] border border-[#C9D6EE] rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#14306B] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#7A2FB8] uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-[#14306B] group-hover:text-[#7A2FB8] transition-colors">
                        0403 678 767
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-[#14306B] rounded-[28px] p-10 md:p-14 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D8F26A] rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions about our Terms?
            </h2>
            <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
              If you have any questions about these Terms &amp; Conditions or
              your eligibility to join the network, our team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#D8F26A] text-slate-900 font-bold py-3.5 px-8 rounded-full hover:brightness-95 transition-colors shadow-lg"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;