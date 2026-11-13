import {
  Users,
  Building2,
  Calendar,
  Shield,
  Star,
  Search,
  Handshake,
  UserPlus,
  Rocket,
  Heart,
  Globe,
  Check,
} from "lucide-react";
import {
  NAVY,
  LIME,
  img,
  Eyebrow,
  SectionHeading,
  Section,
  Button,
  Card,
  IconTile,
  PageHero,
  HeroBadge,
  CtaPanel,
} from "../../components/public/ui";

const SERVICES = [
  {
    icon: Handshake,
    title: "Connect Participants & Businesses",
    description:
      "We bridge the gap between NDIS participants seeking quality support and verified local businesses ready to deliver. Our platform makes it simple to find the right match based on needs, location, and availability.",
    highlights: ["Personalised matching", "Verified providers", "Local connections", "Transparent profiles"],
    image: "ndis",
    to: "/subscription?for=participant",
  },
  {
    icon: Star,
    title: "Subscription Management",
    description:
      "Affordable subscription plans for both participants and providers, giving you ongoing access to our community tools, directory listings, networking events, and dedicated support resources.",
    highlights: ["Flexible plans", "Provider & participant tiers", "Ongoing support access", "Value-driven pricing"],
    image: "service-social",
    to: "/subscription",
  },
  {
    icon: Building2,
    title: "Business Directory",
    description:
      "A comprehensive, searchable directory of NDIS-registered and community-verified businesses. Participants can browse, compare, and connect with providers who meet their specific requirements.",
    highlights: ["Searchable listings", "Service categories", "Reviews & ratings", "Direct contact"],
    image: "smart",
    to: "/business-directory",
  },
  {
    icon: Calendar,
    title: "Community Events",
    description:
      "Regular networking events, workshops, and community gatherings that bring participants, providers, and advocates together. Build genuine relationships and stay informed about sector developments.",
    highlights: ["Networking meetups", "Educational workshops", "Community gatherings", "Sector updates"],
    image: "bg-1",
    to: "/events",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Sign up",
    description:
      "Create your free account as a participant or a provider. Tell us about your needs or your services so we can tailor your experience from the very start.",
  },
  {
    icon: Search,
    title: "Find services or list your business",
    description:
      "Participants can browse our verified directory to find trusted local support. Providers can create a detailed listing, showcase their services, and reach people who need them most.",
  },
  {
    icon: Rocket,
    title: "Connect & grow",
    description:
      "Build meaningful connections through our platform, attend community events, access resources, and grow together. Whether you are finding support or building a business, we are here every step of the way.",
  },
];

const TRUST_POINTS = [
  { icon: Shield, text: "All providers are verified and community-reviewed" },
  { icon: Heart, text: "Led by lived experience and community values" },
  { icon: Users, text: "Built for participants, families, and local providers" },
  { icon: Globe, text: "Supporting communities across Australia" },
];

const WhatWeDoPage = () => (
  <div>
    <PageHero
      eyebrow="Our mission in action"
      title="What we do"
      intro="Connecting NDIS participants with trusted, verified businesses and support workers to build stronger disability networks across Australia."
      image="service-coordination"
      imageAlt="A support coordinator chatting with a group in a lounge room"
      actions={
        <>
          <Button to="/subscription" variant="navy" arrow>Get started today</Button>
          <Button to="/business-directory" variant="outline">Browse directory</Button>
        </>
      }
      badge={<HeroBadge icon={Handshake} title="Real, local connections" text="Matched on needs, location and availability." />}
    />

    {/* Trust strip */}
    <section className="px-4 pt-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <IconTile icon={icon} tone="purple" className="!h-10 !w-10" />
            <span className="text-sm font-medium leading-snug text-slate-700">{text}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Services */}
    <Section>
      <SectionHeading
        eyebrow="Our services"
        title="Everything you need to thrive"
        sub="From finding the right support to growing your business, our platform provides the tools and connections that make the NDIS work better for everyone."
      />
      <div className="space-y-6">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className="grid overflow-hidden rounded-[28px] bg-white shadow-sm md:grid-cols-2"
          >
            <div className={`relative min-h-[240px] ${i % 2 ? "md:order-2" : ""}`}>
              <img src={img(s.image, true)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="flex items-center gap-3">
                <IconTile icon={s.icon} tone={i % 2 ? "purple" : "navy"} />
                <span className="font-display text-sm font-extrabold text-slate-300">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl font-bold" style={{ color: NAVY }}>{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-500">{s.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {s.highlights.map((h) => (
                  <span key={h} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" strokeWidth={3} />
                    {h}
                  </span>
                ))}
              </div>
              <Button to={s.to} variant="outline" arrow className="mt-7 self-start">
                Learn more
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* How it works */}
    <Section className="bg-white">
      <SectionHeading
        eyebrow="How it works"
        title="Three simple steps to get connected"
        sub="Whether you are an NDIS participant looking for support or a provider wanting to reach your community, getting started is easy."
      />
      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-[52px] hidden h-0.5 md:block" style={{ background: "linear-gradient(90deg, #14306B22, #7A2FB855, #14306B22)" }} />
        {STEPS.map(({ icon: Icon, title, description }, i) => (
          <Card key={title} className="relative !bg-[#F8FAFD] text-center !shadow-none">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{ background: NAVY }}>
              <Icon className="h-7 w-7" style={{ color: LIME }} />
              <span className="font-display absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold shadow" style={{ color: NAVY }}>
                {i + 1}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-bold" style={{ color: NAVY }}>{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
          </Card>
        ))}
      </div>
    </Section>

    {/* Two audiences */}
    <Section>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[28px] p-8 md:p-10" style={{ background: "#EEF2FA" }}>
          <Eyebrow>For participants & families</Eyebrow>
          <h3 className="text-2xl font-bold" style={{ color: NAVY }}>Find support your way — no hassle</h3>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
            Search local providers, post what you need, and stay in control. Your details stay
            private and nobody can cold-call you.
          </p>
          <Button to="/subscription?for=participant" variant="navy" arrow className="mt-6">
            Participant plans
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-[28px] p-8 text-white md:p-10" style={{ background: NAVY }}>
          <Eyebrow light>For providers</Eyebrow>
          <h3 className="text-2xl font-bold">Get seen, get referred, get growing</h3>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-blue-100/90">
            Start free, then step up to advertising, local referrals, the Learning Hub and a BTN
            Standards endorsed profile.
          </p>
          <Button to="/subscription" variant="lime" arrow className="mt-6">
            Provider plans
          </Button>
        </div>
      </div>
    </Section>

    <CtaPanel
      eyebrow="Join our community"
      title="Ready to be part of something better?"
      text="Subscribe today and join a growing network of NDIS participants, providers, and advocates who believe in building a stronger disability community together."
      primary={{ to: "/subscription", label: "Subscribe now" }}
      secondary={{ to: "/contact", label: "Contact us" }}
      image="verify"
    />
  </div>
);

export default WhatWeDoPage;
