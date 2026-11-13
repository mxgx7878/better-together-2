import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Check,
  Search,
  Users,
  ShieldCheck,
  LifeBuoy,
  Heart,
  HandCoins,
  Sprout,
  Handshake,
  Eye,
  Quote,
  Star,
  Building2,
  ClipboardList,
} from "lucide-react";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import { fetchMarketingRibbon } from "../../store/actions/marketingRibbonActions";
import {
  NAVY,
  LIME,
  PURPLE,
  img,
  Eyebrow,
  SectionHeading,
  Section,
  Button,
  Card,
  IconTile,
  CtaPanel,
} from "../../components/public/ui";

// ─── Content ────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Sprout,
    tone: "lime",
    title: "Reimagining what's possible",
    text: "An innovative, independent, values-driven platform connecting local businesses, services and providers with people seeking a genuine range of quality care, health and support options.",
  },
  {
    icon: Heart,
    tone: "pink",
    title: "Led by people with lived experience",
    text: "We are people with lived experience of disability — leading, designing and building for people with disability. Every decision is driven by authentic lived experience.",
  },
  {
    icon: ShieldCheck,
    tone: "blue",
    title: "Trusted, ethical networks",
    text: "Ethical, values-driven providers who are carefully vetted and endorsed, so people can confidently find the right supports close to home.",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Search,
    title: "Smart Provider Search",
    description: "Advanced filters to find the perfect provider for your needs.",
    image: "smart",
    link: "/business-directory",
  },
  {
    icon: Users,
    title: "Community Network",
    description: "Connect with participants and providers across your local community.",
    image: "network",
    link: "/subscription?for=participant",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    description: "Providers checked for quality, alignment and compliance.",
    image: "verify",
    link: "/subscription",
  },
  {
    icon: LifeBuoy,
    title: "Friendly Support",
    description: "Get answers from our Admin team and on-site helpers.",
    image: "available",
    link: "/contact",
  },
];

const SERVICES = [
  {
    title: "Service Organisations & Businesses",
    description:
      "Connect with businesses and providers delivering support under the National Disability Insurance Agency.",
    image: "ndis",
  },
  {
    title: "Transport Accident Support Services",
    description:
      "Find businesses offering Transport Accident Commission funded support and rehabilitation services.",
    image: "tac",
  },
  {
    title: "Health Services",
    description:
      "Browse allied health professionals and wellness providers supporting your health and wellbeing goals.",
    image: "health-care",
  },
  {
    title: "Medical Services",
    description:
      "Access medical practitioners and specialists who understand disability and complex care needs.",
    image: "medical",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Post on the Job Board",
    description: "Post on our job board the services you are looking for.",
    image: "tell",
  },
  {
    title: "Connect Safely",
    description: "Local businesses respond, and you choose who is right for you.",
    image: "plan",
  },
  {
    title: "Strong Partnerships",
    description:
      "We work with you and your chosen provider to build a strong, lasting working relationship.",
    image: "connect",
  },
];

const DIFFERENTIATORS = [
  {
    icon: Users,
    title: "Led by Disabled People",
    desc: "Not built about disabled people, but by disabled people. Lived experience drives every decision.",
  },
  {
    icon: Heart,
    title: "Community First",
    desc: "We prioritise connection, safety, and transparency over profits and metrics.",
  },
  {
    icon: HandCoins,
    title: "No Commission Model",
    desc: "Keep 100% of your earnings. We believe ethical connections shouldn't cost you.",
  },
  {
    icon: Sprout,
    title: "Ground-Up Approach",
    desc: "We listen to the community, respond to real needs, and build tools that reflect lived realities.",
  },
  {
    icon: Handshake,
    title: "Participants & Providers Unite",
    desc: "We bring both sides together safely, because real change happens when everyone has a voice.",
  },
  {
    icon: Eye,
    title: "Transparency & Accountability",
    desc: "We build a culture where honesty is standard, whistleblowing is respected, and community safety comes first.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "NDIS Participant",
    content:
      "The Better Together Network made finding the right support workers so much easier. I love being able to browse profiles and choose who I want to work with.",
  },
  {
    name: "James K.",
    role: "Service Provider",
    content:
      "As a provider, this platform has connected me with participants who truly benefit from my services. It's a game-changer for growing my business.",
  },
  {
    name: "Michelle R.",
    role: "Support Coordinator",
    content:
      "I recommend The Better Together Network to all my clients. It gives them the tools to explore options and make informed choices about their support.",
  },
];

const HERO_TRUST = ["Free to join", "No commission", "Vetted, endorsed providers"];

// ─── Page ───────────────────────────────────────────────────────────
const LandingPage = () => {
  const dispatch = useDispatch();
  const sponsors = useSelector((s) => s.marketingRibbon.entries);

  useEffect(() => {
    dispatch(fetchMarketingRibbon());
  }, [dispatch]);

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 md:pb-32 md:pt-16">
        <div
          className="pointer-events-none absolute -right-48 -top-48 h-[620px] w-[620px] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, #DCE7FA 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-40 top-40 h-[420px] w-[420px] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, #EEF8D6 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
          <div className="btn-fade-up lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-slate-100" style={{ color: NAVY }}>
              <span className="h-2 w-2 rounded-full" style={{ background: "#7BC043" }} />
              Led by people with lived experience of disability
            </span>
            <h1
              className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[58px]"
              style={{ color: NAVY }}
            >
              Reimagining what&apos;s possible,{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">together.</span>
                <span
                  className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-full md:bottom-2 md:h-4"
                  style={{ background: LIME }}
                />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
              An independent, values-driven network putting people first. We connect local
              businesses, services and providers with people seeking quality care, health and
              support — creating a living ecosystem of collaboration, trust and real-world action.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/subscription?for=participant" variant="navy" arrow className="!px-7 !py-3.5">
                Find support
              </Button>
              <Button to="/subscription" variant="outline" className="!px-7 !py-3.5">
                I&apos;m a provider
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {HERO_TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "#EEF8D6" }}>
                    <Check className="h-3 w-3" strokeWidth={3.5} style={{ color: "#4D7A12" }} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Collage */}
          <div className="relative lg:col-span-6">
            <div className="relative ml-auto max-w-[560px]">
              <div className="overflow-hidden rounded-[32px] shadow-2xl ring-1 ring-black/5">
                <img
                  src={img("hero-together")}
                  alt="A team with a wheelchair user planning together at a whiteboard"
                  className="h-[340px] w-full object-cover object-[72%_center] sm:h-[440px] lg:h-[520px]"
                  fetchpriority="high"
                />
              </div>

              <div className="absolute -bottom-10 -left-4 hidden w-48 overflow-hidden rounded-3xl border-[6px] border-white shadow-xl sm:block md:-left-10 md:w-56">
                <img
                  src={img("who-we-help", true)}
                  alt="A wheelchair user and friend with their dog at the beach"
                  className="h-40 w-full object-cover md:h-44"
                  loading="lazy"
                />
              </div>

              <div className="absolute -right-2 top-6 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-xl ring-1 ring-black/5 sm:-right-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: NAVY }}>
                  <ShieldCheck className="h-5 w-5" style={{ color: LIME }} />
                </span>
                <div>
                  <p className="text-sm font-bold" style={{ color: NAVY }}>BTN Standards</p>
                  <p className="text-[11px] text-slate-500">Endorsed local providers</p>
                </div>
              </div>

              <div className="absolute -bottom-6 right-4 rounded-2xl p-4 shadow-xl sm:right-8" style={{ background: NAVY }}>
                <p className="font-display text-2xl font-extrabold" style={{ color: LIME }}>100%</p>
                <p className="text-[11px] font-medium text-blue-100">Your earnings — no commission</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Three pillars ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon, tone, title, text }) => (
            <Card key={title} className="transition hover:-translate-y-1 hover:shadow-md">
              <IconTile icon={icon} tone={tone} />
              <h3 className="mt-5 text-lg font-bold" style={{ color: NAVY }}>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Our purpose ───────────────────────────────────────── */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-[28px] shadow-xl">
              <img
                src={img("mission-community2")}
                alt="Community members talking together in an office"
                className="h-[380px] w-full object-cover md:h-[500px]"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-xl md:left-auto md:right-[-24px] md:max-w-xs">
              <Quote className="h-6 w-6" style={{ color: PURPLE }} />
              <p className="mt-2 font-display text-lg font-bold leading-snug" style={{ color: NAVY }}>
                &ldquo;Nothing about us without us.&rdquo;
              </p>
            </div>
          </div>

          <div className="pt-6 lg:pt-0">
            <Eyebrow>Our purpose</Eyebrow>
            <h2 className="text-3xl font-bold leading-tight md:text-[40px]" style={{ color: NAVY }}>
              Building stronger communities — together
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-500 md:text-base">
              We believe disability services must operate effectively, and they should be driven,
              shaped and guided by people with disabilities.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500 md:text-base">
              Provider practices, community spaces and sector standards should be built through
              authentic co-design, grounded in disability theory and the core principle that{" "}
              <strong style={{ color: NAVY }}>&ldquo;nothing about us without us&rdquo;</strong>.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Lived experience", "at the centre of every decision"],
                ["Local first", "real relationships, close to home"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="font-display text-sm font-bold" style={{ color: NAVY }}>{t}</p>
                  <p className="mt-1 text-xs leading-snug text-slate-500">{s}</p>
                </div>
              ))}
            </div>
            <Button to="/about" variant="navy" arrow className="mt-8">
              Learn more about our mission
            </Button>
          </div>
        </div>
      </Section>

      {/* ─── Who we help ───────────────────────────────────────── */}
      <Section className="!pt-4">
        <SectionHeading
          eyebrow="Who we help"
          title="Connecting participants & providers"
          sub="Whether you're seeking support or providing services, The Better Together Network brings the community together."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Participants */}
          <div className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:shadow-lg">
            <div className="relative h-56 overflow-hidden md:h-64">
              <img
                src={img("cta", true)}
                alt="A smiling young woman with her support worker"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>
                Participants & families
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <h3 className="text-2xl font-bold" style={{ color: NAVY }}>Looking for support?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                Find verified disability-sector service providers in your area. Browse profiles,
                compare services, and connect with providers who match your needs and goals.
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Button to="/register?role=participant" variant="navy" arrow>Find support</Button>
                <Button to="/subscription?for=participant" variant="outline">See participant plans</Button>
              </div>
            </div>
          </div>

          {/* Providers */}
          <div className="group flex flex-col overflow-hidden rounded-[28px] text-white shadow-xl" style={{ background: NAVY }}>
            <div className="relative h-56 overflow-hidden md:h-64">
              <img
                src={img("strong", true)}
                alt="A provider team meeting with a wheelchair user"
                className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900" style={{ background: LIME }}>
                Service providers
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <h3 className="text-2xl font-bold">For providers</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-blue-100/90">
                Join our network and connect with disability-sector participants. Build your
                profile, respond to requests, and grow your business ethically.
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Button to="/register?role=provider" variant="lime" arrow>Join as provider</Button>
                <Button to="/subscription" variant="light">See provider plans</Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Platform features ─────────────────────────────────── */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Platform features"
          title="Everything you need in one place"
          sub="Powerful features designed to make your disability services journey smoother."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_FEATURES.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={img(f.image, true)}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl shadow-md" style={{ background: NAVY }}>
                  <f.icon className="h-5 w-5" style={{ color: LIME }} />
                </span>
              </div>
              <div className="p-6 pt-8">
                <h3 className="text-base font-bold" style={{ color: NAVY }}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: PURPLE }}>
                  Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ─── Services you can find ─────────────────────────────── */}
      <Section>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            className="!mb-0"
            eyebrow="Service providers who support you"
            title="Services you can find"
            sub="Connection to a wide range of businesses who offer support across disability-sector services, health and medical services."
          />
          <Button to="/business-directory" variant="outline" arrow className="flex-shrink-0">
            Browse the directory
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="group relative h-[380px] overflow-hidden rounded-[24px] shadow-sm">
              <img
                src={img(s.image, true)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E2352] via-[#0E2352]/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-lg font-bold leading-snug text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-100/90">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── How it works ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-6 py-14 sm:px-10 md:py-20" style={{ background: NAVY }}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: LIME }} />
          <div className="relative grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow light>How it works</Eyebrow>
              <h2 className="text-3xl font-bold leading-tight text-white md:text-[40px]">
                Fast &amp; reliable connections to trusted services
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-blue-100/85 md:col-span-5">
              Connect with quality disability services support in three simple steps — on your
              terms, at your pace.
            </p>
          </div>

          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.title} className="overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur">
                <div className="relative h-44 overflow-hidden">
                  <img src={img(s.image, true)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="font-display absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-slate-900" style={{ background: LIME }}>
                    {i + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100/80">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What makes us different ───────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Eyebrow>What makes us different</Eyebrow>
            <h2 className="text-3xl font-bold leading-tight md:text-[40px]" style={{ color: NAVY }}>
              This is not a marketplace.
              <span className="mt-1 block" style={{ color: PURPLE }}>It&apos;s a movement.</span>
            </h2>
            <div className="mt-8 overflow-hidden rounded-[28px] shadow-xl">
              <img
                src={img("care")}
                alt="A wheelchair user laughing with a friend by the water at sunset"
                className="h-[300px] w-full object-cover md:h-[380px]"
                loading="lazy"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {DIFFERENTIATORS.map(({ icon, title, desc }, i) => (
                <Card key={title} className="!p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <IconTile icon={icon} tone={i % 2 ? "purple" : "navy"} />
                    <span className="font-display text-sm font-extrabold text-slate-200">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold" style={{ color: NAVY }}>{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                </Card>
              ))}
            </div>
            <Button to="/about" variant="navy" arrow className="mt-8">
              Learn more about our mission
            </Button>
          </div>
        </div>
      </Section>

      {/* ─── Testimonials ──────────────────────────────────────── */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow="Success stories"
          title="What our community says"
          sub="Real experiences from people in The Better Together Network community."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const featured = i === 1;
            return (
              <figure
                key={t.name}
                className={`flex flex-col rounded-2xl p-7 ${featured ? "text-white shadow-2xl" : "border border-slate-100 bg-[#F8FAFD]"}`}
                style={featured ? { background: NAVY } : undefined}
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="h-4 w-4" fill={featured ? LIME : "#F5B700"} stroke="none" />
                  ))}
                </div>
                <blockquote className={`mt-5 flex-1 text-[15px] leading-relaxed ${featured ? "text-blue-50" : "text-slate-600"}`}>
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="font-display flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                    style={featured ? { background: LIME, color: NAVY } : { background: "#E8EEFA", color: NAVY }}
                  >
                    {t.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <span>
                    <span className={`block text-sm font-bold ${featured ? "text-white" : ""}`} style={featured ? undefined : { color: NAVY }}>
                      {t.name}
                    </span>
                    <span className={`block text-xs ${featured ? "text-blue-100" : "text-slate-500"}`}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>

      {/* ─── Quick paths ───────────────────────────────────────── */}
      <Section className="!pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Building2, title: "Business Directory", text: "Browse local, endorsed providers by service and location.", to: "/business-directory" },
            { icon: ClipboardList, title: "Events & networking", text: "Workshops, meetups and community events near you.", to: "/events" },
            { icon: Users, title: "Plan Buddy program", text: "A real person in your corner to help you through the NDIS.", to: "/subscription?for=participant" },
          ].map(({ icon, title, text, to }) => (
            <Link key={title} to={to} className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <IconTile icon={icon} tone="purple" />
              <div className="flex-1">
                <h3 className="text-base font-bold" style={{ color: NAVY }}>{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#7A2FB8]" />
            </Link>
          ))}
        </div>
      </Section>

      <CtaPanel
        eyebrow="Join today"
        title="Ready to transform how you connect with businesses who can help?"
        text="Join a network of participants and providers ready to create meaningful connections. Free to get started — no credit card required."
        primary={{ to: "/subscription?for=participant", label: "For participants" }}
        secondary={{ to: "/subscription", label: "For providers" }}
      />

      {sponsors?.length > 0 && (
        <section className="border-t border-slate-200/70 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FeaturedPartnersRibbon sponsors={sponsors} title="Our Marketing Partners" note="Sponsored providers" />
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
