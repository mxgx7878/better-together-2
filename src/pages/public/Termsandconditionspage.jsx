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
  Sparkles,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// ─── 9 qualities of ethical, person-centred providers ─────────────────
const providerQualities = [
  {
    num: "1",
    title: "Person-Centred Practice",
    icon: UserCheck,
    color: "from-purple-500 to-indigo-600",
    items: [
      "Prioritises the goals, preferences, and autonomy of people with disability",
      "Supports genuine choice and control",
      "Respects cultural, communication, and accessibility needs",
    ],
  },
  {
    num: "2",
    title: "Understanding Disability First Perspectives",
    icon: Eye,
    color: "from-pink-500 to-rose-600",
    items: [
      "Recognises disability as a valid identity and lived experience",
      "Understands the diversity of disability perspectives — physical, cognitive, psychosocial, sensory, and invisible",
      "Values lived experience as expertise",
      "Engages with participants in ways that honour their worldview, communication style, and decision-making preferences",
    ],
  },
  {
    num: "3",
    title: "Disability-First Theory",
    icon: Brain,
    color: "from-blue-500 to-cyan-600",
    items: [
      "Operates from a disability-first, rights-based framework",
      "Understands that disability is not a deficit but a natural part of human diversity",
      "Centres the person's experience of disability in planning, communication, and service delivery",
      "Avoids medicalised, deficit-based, or paternalistic approaches",
      "Upholds the principles of dignity, autonomy, and self-determination",
    ],
  },
  {
    num: "4",
    title: "Ethical Conduct",
    icon: Scale,
    color: "from-emerald-500 to-teal-600",
    items: [
      "Acts with honesty, transparency, and integrity",
      "Maintains clear professional boundaries",
      "Avoids conflicts of interest and coercive practices",
    ],
  },
  {
    num: "5",
    title: "Safety & Accountability",
    icon: ShieldCheck,
    color: "from-amber-500 to-orange-600",
    items: [
      "Provides safe, lawful, and compliant services",
      "Responds appropriately to concerns, complaints, and feedback",
      "Upholds mandatory reporting obligations",
    ],
  },
  {
    num: "6",
    title: "Respectful Communication",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-600",
    items: [
      "Communicates clearly, respectfully, and without discrimination",
      "Engages with participants, families, and peers in a professional manner",
      "Avoids harassment, intimidation, or manipulative behaviour",
    ],
  },
  {
    num: "7",
    title: "Reliability & Professionalism",
    icon: Award,
    color: "from-indigo-500 to-blue-600",
    items: [
      "Shows up on time, follows through, and delivers what is promised",
      "Maintains accurate records and transparent pricing",
      "Demonstrates consistency and reliability in service delivery",
    ],
  },
  {
    num: "8",
    title: "Community Alignment",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    items: [
      "Contributes positively to the network culture",
      "Respects the purpose of the community and its members",
      "Does not engage in predatory, exploitative, or misleading behaviour",
    ],
  },
  {
    num: "9",
    title: "Rights-Based Practice",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    items: [
      "Upholds the rights, dignity, and independence of people with disability",
      "Supports informed decision-making",
      "Ensures participants are never pressured into services",
    ],
  },
];

// ─── Section navigation (table of contents) ──────────────────────────
const sectionNav = [
  { id: "eligibility", label: "7.1 Eligibility to Operate" },
  { id: "rejoining", label: "7.2 Rejoining After Removal" },
  { id: "donation-definition", label: "7.3 Definition of a Donation" },
  { id: "donation-conditions", label: "7.4 Conditions for Donating Providers" },
  { id: "acknowledgement", label: "7.5 Acknowledgement of Contributions" },
];

const TermsAndConditionsPage = () => {
  const [activeSection, setActiveSection] = useState("eligibility");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // sticky header offset
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <ScrollText className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Legal & Provider Standards
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Terms &amp; Conditions
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            The Better Together Network is committed to maintaining a safe,
            ethical, person-centred environment for people with disabilities,
            their families, and the broader community.
          </p>
          <p className="text-sm text-purple-200 mt-6">
            Last updated: {new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      {/* ─── Intro Statement ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            To protect the integrity of our network, only providers who meet
            our standards of conduct, professionalism, and values alignment are
            eligible to operate within our platform. These Terms and Conditions
            are published so providers clearly understand what is expected of
            them before joining.
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
                <nav className="space-y-1">
                  {sectionNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-start gap-2 ${
                        activeSection === item.id
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
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
            {/* ─── 7.1 Eligibility ──────────────────────────── */}
            <article id="eligibility" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
                    Section 7.1
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Eligibility to Operate Within The Better Together Network
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Providers must demonstrate that they are{" "}
                  <strong className="text-slate-900">
                    ethical, person-centred, rights-based, and aligned with the
                    values of The Better Together Network
                  </strong>
                  . Providers who do not meet these standards may be{" "}
                  <span className="text-rose-600 font-medium">declined</span>,{" "}
                  <span className="text-rose-600 font-medium">suspended</span>,
                  or{" "}
                  <span className="text-rose-600 font-medium">removed</span> at
                  our discretion.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  To support clarity, the following qualities define an
                  acceptable provider within our network.
                </p>
              </div>

              {/* 9 Qualities */}
              <div className="mt-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                    Qualities We Expect From Ethical, Person-Centred Providers
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Providers operating within The Better Together Network must
                    demonstrate the following:
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
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quality.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Quality {quality.num}
                            </p>
                            <h4 className="text-base font-bold text-slate-900 mt-0.5">
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
              </div>

              {/* Removal notice */}
              <div className="mt-6 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl p-6">
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-900 mb-2">
                      Right of Removal
                    </h4>
                    <p className="text-sm text-rose-800 leading-relaxed">
                      If a provider operating under our defined quality and
                      conduct standards fails to meet the expectations required
                      of this network, The Better Together Network reserves the
                      right to remove them from the platform. Where provider
                      groups or individual businesses are deemed unsuitable, you
                      will be{" "}
                      <strong>notified in writing, all payments made to date will be refunded in full</strong>
                      , and the provider will be removed from the platform.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* ─── 7.2 Rejoining ────────────────────────────── */}
            <article id="rejoining" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
                    Section 7.2
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Rejoining After Formal Removal
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Any individual, business, or related entity that has been
                  formally removed under this clause — including any new entity
                  reasonably deemed to be a continuation of, or controlled by,
                  the original operator — may, if they choose, rejoin under a{" "}
                  <strong className="text-slate-900">paid subscription</strong>.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  However, The Better Together Network is{" "}
                  <strong className="text-slate-900">
                    under no obligation
                  </strong>{" "}
                  to list, promote, reinstate, or otherwise include their
                  business in any directory, group, forum, communication
                  channel, or referral pathway. Paid subscriptions made after
                  removal{" "}
                  <strong className="text-slate-900">
                    will not create any entitlement
                  </strong>{" "}
                  to visibility, access, or participation within the network.
                </p>
              </div>
            </article>

            {/* ─── 7.3 Definition of a Donation ─────────────── */}
            <article id="donation-definition" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                    Section 7.3
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Definition of a Donation
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Where a removed provider elects to pay for a subscription
                  after removal, that payment will be classified as a{" "}
                  <strong className="text-slate-900">donation</strong>.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    <strong>A donation is defined as</strong> a voluntary
                    financial contribution made without any expectation,
                    entitlement, or guarantee of service delivery, platform
                    access, business listing, promotional activity, or
                    administrative engagement. Donations do not create a
                    contractual relationship, service obligation, or membership
                    status within The Better Together Network.
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 7.4 Conditions for Donating Providers ────── */}
            <article id="donation-conditions" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">
                    Section 7.4
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Conditions Applying to Donating Providers
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
                <p className="text-base text-slate-700 leading-relaxed">
                  Providers who contribute financially after formal removal
                  acknowledge and agree that:
                </p>
                <ul className="space-y-3">
                  {[
                    "Their business details will not be listed, displayed, promoted, or reinstated on the platform.",
                    "They will not have access to administrative support, communication channels, or engagement with network moderators.",
                    "They will not be included in provider groups, directories, referral pathways, or community spaces.",
                    "Their contribution will be treated solely as a donation to support the ongoing work and mission of The Better Together Network.",
                    "A donation is a voluntary financial contribution made without any entitlement to services, visibility, reinstatement, or participation.",
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

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 mt-6">
                  <p className="text-sm text-slate-800 leading-relaxed italic">
                    &ldquo;We thank you for your contribution; however,
                    donations do not reinstate your position, access, or
                    standing on the platform once formal removal has occurred.
                    This ensures the integrity, safety, and values of the
                    network remain protected.&rdquo;
                  </p>
                </div>
              </div>
            </article>

            {/* ─── 7.5 Acknowledgement of Contributions ─────── */}
            <article id="acknowledgement" className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
                    Section 7.5
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Acknowledgement of Contributions
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <p className="text-base text-slate-700 leading-relaxed">
                  While no services or access will be provided, The Better
                  Together Network may, at its discretion, acknowledge donors
                  in aggregate form (e.g.,{" "}
                  <em className="text-slate-900">
                    &ldquo;Thank you to all contributors who support the Better
                    Together Network&rdquo;
                  </em>
                  ).{" "}
                  <strong className="text-slate-900">
                    No individual provider names, business details, or
                    identifying information will be published or promoted.
                  </strong>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 rounded-2xl p-10 md:p-14 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions about our Terms?
            </h2>
            <p className="text-lg text-purple-100 max-w-xl mx-auto mb-8">
              If you have any questions about these Terms &amp; Conditions or
              your eligibility to join the network, our team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold py-3.5 px-8 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
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