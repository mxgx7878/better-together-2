import { useState } from "react";
import {
  Handshake,
  Search,
  Sprout,
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  Target,
  Star,
  Quote,
  ChevronDown,
  Megaphone,
  MapPin,
  ShieldCheck,
} from "lucide-react";
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
  CheckList,
  PageHero,
  HeroBadge,
  CtaPanel,
} from "../../components/public/ui";

// ─── Content ────────────────────────────────────────────────────────
const MISSION_TAGLINES = [
  "Where lived experience leads, and a stronger disability services grows from the ground up.",
  "Many voices, one community — reshaping the disability services with heart, dignity, and unity.",
  "Rooted in lived experience, rising together to shape a better disability services.",
  "When people and providers stand together, the whole sector rises.",
  "A community of voices becoming the change the disability services was meant to hold.",
  "Where connection becomes strength, and strength becomes collective change.",
  "Lived experience at the centre, community at the heart, change from the ground up.",
  "Together, we grow the disability services into the community it was always meant to be.",
  "Uniting voices, lifting standards, and shaping the future — together.",
];

const VISION_POINTS = [
  { icon: Handshake, title: "Providers Support Each Other", description: "Collaboration becomes the norm, not the exception." },
  { icon: Search, title: "Easy Access to Trusted Services", description: "Real choice and control are strengthened through genuine, transparent connections." },
  { icon: Sprout, title: "Local Relationships Valued", description: "Communities thrive when people know, trust, and support one another." },
  { icon: Sparkles, title: "Trust & Transparency First", description: "We prioritise integrity, lived experience, and the voices of people with disability." },
  { icon: TrendingUp, title: "Connected & Empowered", description: "Everyone deserves access to clear information, respectful support, and a community that listens." },
  { icon: Users, title: "Community-Driven Support", description: "The disability services remains community-driven and sustainable. We work together to advocate for fair, ethical, and accessible systems that support both participants and local providers to thrive." },
];

const WHY_DIFFERENT = [
  { icon: Users, title: "Led by Disabled People — Not Corporations", description: "Most platforms are built about disabled people. Ours is built by disabled people. Lived experience shapes every decision, every feature, every connection." },
  { icon: Heart, title: "Community First, Not Profit First", description: "We prioritise connection, safety, and transparency over sales funnels and corporate metrics. Our model is built to strengthen the community — not extract from it." },
  { icon: Sprout, title: "Ground-Up Approach, Not Top-Down System", description: "We don't impose solutions from above. We listen to the community, respond to real needs, and build tools that reflect the lived realities of participants, families, and small providers." },
  { icon: Handshake, title: "Participants and Providers Meet as Equals", description: "Most platforms separate the two. We bring them together — safely, ethically, and with clear boundaries — because real change happens when everyone is in the same room." },
  { icon: Target, title: "Support Beyond Services", description: "We don't just help people find services. We help them understand the disability services, navigate reviews, access advocacy, and feel confident in their rights. We also help providers grow ethically, connect locally, and build sustainable businesses." },
  { icon: Search, title: "Transparency and Accountability at the Core", description: "We are building a culture where honesty is standard, not optional. Where whistleblowing is respected. Where poor practice is challenged. Where community safety comes before convenience." },
  { icon: Star, title: 'A "No One Left Behind" Model', description: "Our platform ensures that disabled people lead the conversation, lived experience is treated as expertise, community replaces isolation, support is accessible at every level, and no one navigates the system alone." },
  { icon: MapPin, title: "Local, Relationship-Driven, Not Just Digital", description: "We focus on building local networks, peer support, and in-person connections — not just clicks and profiles — so people can find real community, not just services." },
  { icon: Megaphone, title: "Advocacy as a Core Function, Not an Add-On", description: "We don’t sit on the sidelines. We organise, amplify community voices, and engage with government and systems so that policies, pricing, and practices reflect what disabled people and small providers actually need." },
];

const COLLECTIVE_VOICE = [
  "Protecting real choice and control for participants",
  "Supporting local providers who deliver genuine value",
  "Advocating for fair conditions that allow small businesses to thrive",
  "Engaging with government to ensure the disability services remains accessible, ethical, and community-driven",
];

const MODEL_ENSURES = [
  "Disabled people lead the conversation, break new ground, and reimagine disability in Australia",
  "Lived experience is recognised as expertise, not an afterthought",
  "Community connection replaces isolation",
  "Support is accessible at every level, regardless of circumstance",
  "No participant, family, or provider is left to navigate the system alone",
  "Trust, transparency, and safety are non-negotiable foundations for every interaction and decision",
];

const LEADERS = [
  {
    name: "Karen Burgess",
    post: "FIML",
    role: "Founder & Leader",
    org: "NDIS Community Founder",
    photo: "/uploads/karen02.jpg",
    quote:
      "We are bridging the gaps and responding to change by bringing people together to grow this community and lead with the strength of disabled experience.",
    bio: [
      "Karen Burgess is an accomplished disability sector leader, reform advocate, and nationally recognised voice for rights‑based, ethical practice across Australia's complex care systems. With more than three decades of experience spanning disability, community services, and systems reform, she brings a rare combination of lived experience, strategic capability, and deep operational insight to every space she enters.",
      "As a proudly disabled and openly dyslexic professional, Karen has built her career on transforming personal experience into leadership. Her dyslexia has shaped her commitment to accessible communication, inclusive practice, and the recognition of diverse cognitive strengths within organisations and service environments. She is widely respected for her ability to translate complex policy into clear, practical language that empowers both participants and providers to navigate disability supports with confidence.",
      { highlight: "Karen holds a Master of Business Leadership from Charles Sturt University and is a Fellow of the Institute of Managers and Leaders (FIML) — recognition reserved for senior leaders who demonstrate excellence in governance, strategic leadership, and ethical practice. Her academic and professional background enables her to bridge the gap between policy intent, operational reality, and participant experience." },
      "Her leadership has been acknowledged through multiple award nominations, including recognition for community impact, sector leadership, and contributions to disability reform. Karen is also a sought‑after speaker and panelist, known for her clarity, integrity, and ability to challenge systemic barriers while centring lived experience in every conversation.",
      "Throughout her career, Karen has been a strong advocate for transparency, accountability, and participant safety. She has acted as a whistleblower when required, demonstrating courage and integrity in calling out practices that compromise dignity, rights, or ethical standards. Her approach is principled, collaborative, and grounded in the belief that meaningful reform must be shaped by the people most affected by it.",
      "Karen's work spans community mobilisation, sector education, and systems improvement. She is deeply committed to elevating the voices of people with disability, strengthening small providers, and promoting a sector culture that values lived experience as expertise.",
      "Karen Burgess remains a respected and influential voice in the disability community — a leader who brings clarity, courage, and lived experience to every room, every conversation, and every reform effort she touches.",
    ],
  },
  {
    name: "Sue Dymond",
    role: "Founder & Leader",
    org: "SD Connect",
    photo: "/uploads/Sue.jpg",
    quote:
      "It only takes one person to spark change — but when a community stands together, transformation becomes unstoppable.",
    bio: [
      "Sue Dymond is a powerhouse of lived experience, advocacy, and community leadership — and a driving force behind this platform. Her work is shaped by decades of navigating disability, raising her daughter Chloe who has Down syndrome, and supporting families who often feel unheard, overwhelmed, or left behind by the system.",
      "Sue's journey has never been theoretical. It has been lived — deeply, personally, and courageously. From the early challenges of raising her daughter Chloe to becoming a mentor, author, advocate, and founder of SD Connect, she has transformed her experiences into a mission to educate, empower, and unite people across the disability community.",
      "Her work spans councils, disability organisations, community groups, and families across Victoria, where she has consistently challenged outdated thinking, inspired new perspectives, and pushed for genuine inclusion and respect. She is known for her honesty, her humour, and her unwavering belief that real change begins with real people coming together.",
      "Sue's lived experience is not just part of her story — it is the foundation of her leadership. She understands the gaps, the frustrations, and the emotional weight families carry because she has lived it. She also understands the potential of the disability services when community, providers, and participants work together with integrity and heart.",
      {
        list: {
          lead: "This platform reflects Sue's vision:",
          items: [
            "A community where lived experience leads",
            "Where providers and participants stand side by side",
            "And where quality, connection, and humanity rise from the ground up",
          ],
        },
      },
    ],
  },
];

// ─── Leader profile ─────────────────────────────────────────────────
const LeaderProfile = ({ leader, reverse }) => {
  const [open, setOpen] = useState(false);
  const visible = open ? leader.bio : leader.bio.slice(0, 2);

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className={`grid lg:grid-cols-12 ${reverse ? "lg:[direction:rtl]" : ""}`}>
        <div className="relative lg:col-span-4 [direction:ltr]" style={{ background: NAVY }}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-2xl" style={{ background: LIME }} />
          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center md:p-10">
            <div className="h-44 w-44 overflow-hidden rounded-3xl ring-4 ring-white/15 shadow-2xl">
              <img src={leader.photo} alt={leader.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">{leader.name}</h3>
            {leader.post && (
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: LIME }}>
                {leader.post}
              </p>
            )}
            <p className="mt-3 text-sm font-semibold text-blue-100">{leader.role}</p>
            <p className="text-xs text-blue-100/70">{leader.org}</p>
          </div>
        </div>

        <div className="p-7 md:p-10 lg:col-span-8 [direction:ltr]">
          <div className="space-y-4">
            {visible.map((p, i) => {
              if (typeof p === "string")
                return (
                  <p key={i} className="text-[15px] leading-relaxed text-slate-600 md:text-base">
                    {p}
                  </p>
                );
              if (p.highlight)
                return (
                  <div key={i} className="rounded-2xl border-l-4 bg-[#F4F6FA] p-5" style={{ borderColor: PURPLE }}>
                    <p className="text-[15px] leading-relaxed text-slate-700">{p.highlight}</p>
                  </div>
                );
              if (p.list)
                return (
                  <div key={i} className="rounded-2xl bg-[#F4F6FA] p-5">
                    <p className="mb-3 text-sm font-semibold" style={{ color: NAVY }}>{p.list.lead}</p>
                    <CheckList items={p.list.items} />
                  </div>
                );
              return null;
            })}
          </div>

          {leader.bio.length > 2 && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: PURPLE }}
              aria-expanded={open}
            >
              {open ? "Show less" : `Read ${leader.name.split(" ")[0]}'s full story`}
              <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
            </button>
          )}

          <figure className="mt-6 flex gap-3 rounded-2xl p-5" style={{ background: "#EEF2FA" }}>
            <Quote className="h-6 w-6 flex-shrink-0" style={{ color: PURPLE }} />
            <blockquote className="font-display text-[15px] font-semibold leading-relaxed md:text-base" style={{ color: NAVY }}>
              {leader.quote}
            </blockquote>
          </figure>
        </div>
      </div>
    </div>
  );
};

// ─── Page ───────────────────────────────────────────────────────────
const AboutPage = () => (
  <div>
    <PageHero
      eyebrow="About The Better Together Network"
      title="Innovative change, led by lived experience"
      intro="We are building stronger communities — together. We are redefining power in the human services sector, putting it back in the hands of people and communities and unapologetically centring their care and support needs in everything we design and do."
      image="hero-community"
      imageAlt="Friends and a wheelchair user chatting together at home"
      actions={
        <>
          <Button to="/subscription" variant="navy" arrow>Join the network</Button>
          <Button to="/contact" variant="outline">Get in touch</Button>
        </>
      }
      badge={<HeroBadge icon={ShieldCheck} title="Rigorously vetted & endorsed" text="Ethical, values-driven providers at the heart of the system." />}
    />

    {/* ─── Who we are ──────────────────────────────────────────── */}
    <Section className="!pt-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="!p-8 md:!p-10">
          <Eyebrow>Who we are</Eyebrow>
          <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">
            This is a bold, purpose&#8209;built network for people who champion genuine, human touch
            from local providers who are uncompromising about quality care and supports. We elevate
            ethical, values&#8209;driven providers — rigorously vetted and endorsed — and place them at
            the heart of the system for people seeking services and for businesses that truly care.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-base">
            As an independent Human Services sector community platform, we connect trusted, ethical
            providers, participants, families, and local specialists together to create stronger,
            more connected, and more supportive networks of care and disability support across
            Australia.
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img src={img("daily", true)} alt="Two friends relaxing together on a couch" className="h-full min-h-[180px] w-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col justify-end rounded-2xl p-6 text-white" style={{ background: NAVY }}>
            <p className="font-display text-3xl font-extrabold" style={{ color: LIME }}>3+</p>
            <p className="mt-1 text-sm text-blue-100">decades of combined lived experience and sector leadership</p>
          </div>
          <div className="flex flex-col justify-end rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-display text-3xl font-extrabold" style={{ color: NAVY }}>0%</p>
            <p className="mt-1 text-sm text-slate-500">commission — providers keep what they earn</p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img src={img("chess", true)} alt="A young man in a power wheelchair playing chess with friends" className="h-full min-h-[180px] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </Section>

    {/* ─── Leadership ──────────────────────────────────────────── */}
    <Section className="!pt-4">
      <SectionHeading
        eyebrow="Our leadership"
        title="Meet the legends at the forefront of this change"
        sub="Trusted leaders with deep lived experience, a long history of advocacy and change management, and a proven track record of standing beside people, families, and providers. Shaped by decades of driving real reform, they are united in their commitment to transforming the health, caring, and disability sectors into fairer, more human, and genuinely person-centred systems."
      />
      <div className="space-y-8">
        {LEADERS.map((l, i) => (
          <LeaderProfile key={l.name} leader={l} reverse={i % 2 === 1} />
        ))}
      </div>
    </Section>

    {/* ─── Mission ─────────────────────────────────────────────── */}
    <Section className="bg-white">
      <SectionHeading
        eyebrow="Our mission"
        title="Strengthen and drive the disability sector"
        sub="A unique, collaborative force for change, we bring carefully vetted, trusted local teams and businesses together to build a real community of support — in the home, in the community, and beyond."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="!bg-[#F4F6FA] !shadow-none">
          <h3 className="text-xl font-bold" style={{ color: NAVY }}>Taking charge of change in human services systems</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Our platform is a bold, market&#8209;leading disruption to the sector — truly independent,
            relentlessly human&#8209;centred, and built to earn trust from people, families, and
            providers alike. Every connection sits within a rigorously checked local network, so
            communities know they are engaging only with reputable, reliable providers they can
            depend on. We are uncompromising: if providers don&rsquo;t meet our ethical, quality, and
            safety standards, they don&rsquo;t stay in the Network.
          </p>
        </Card>
        <Card className="!bg-[#F4F6FA] !shadow-none">
          <h3 className="text-xl font-bold" style={{ color: NAVY }}>What we do — and how we do it</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            We connect people with trusted, rigorously verified providers and supports — building
            powerful, ethical care networks in local communities across Australia. We actively remove
            providers who are not cutting the mustard, protecting people from poor practice and
            keeping quality front and centre.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            We help businesses grow, stand out, and connect directly with people who are actively
            seeking high&#8209;quality, ethical support. As part of the Network, you gain a dedicated
            team behind you — making introductions, guiding people to your services, and helping
            nurture long&#8209;term, values&#8209;aligned relationships. If you are not committed to ethical,
            person&#8209;centred practice, this is not the place for you. If you are, we back you — and we
            make sure people know it.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 !bg-[#F4F6FA] !shadow-none">
          <div className="flex items-center gap-3">
            <IconTile icon={Target} tone="lime" />
            <h3 className="text-xl font-bold" style={{ color: NAVY }}>Our mission in action</h3>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            By empowering participants, supporting local providers and amplifying lived experience,
            we aim to build a support ecosystem that is ethical, inclusive and genuinely
            community-driven — a place where real choice and control are protected, local businesses
            are valued, and smaller providers have the strength of a unified voice to advocate for
            fair, sustainable conditions.
          </p>
        </Card>
        <div className="flex items-center rounded-2xl p-8 lg:col-span-2" style={{ background: NAVY }}>
          <div>
            <Quote className="h-7 w-7" style={{ color: LIME }} />
            <p className="font-display mt-3 text-lg font-bold leading-snug text-white md:text-xl">
              To build a connected, supportive community where people, providers and local networks
              grow stronger together — and where the sector is shaped by the very people it exists to
              serve.
            </p>
          </div>
        </div>
      </div>
    </Section>

    {/* ─── Many voices ─────────────────────────────────────────── */}
    <Section>
      <SectionHeading eyebrow="Our mission, many voices" title="Different perspectives, one unified purpose" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSION_TAGLINES.map((t, i) => (
          <Card key={t} className="!p-6 flex gap-4">
            <span className="font-display flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: i % 3 === 1 ? PURPLE : NAVY }}>
              {i + 1}
            </span>
            <p className="text-[15px] italic leading-relaxed text-slate-600">&ldquo;{t}&rdquo;</p>
          </Card>
        ))}
      </div>
    </Section>

    {/* ─── Vision ──────────────────────────────────────────────── */}
    <Section className="bg-white">
      <SectionHeading
        eyebrow="Our vision"
        title="A connected, local, inclusive disability services community"
        sub="We are creating a community where no one stands alone — not providers, not participants, not families. A community where connection replaces isolation, and collaboration replaces competition."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VISION_POINTS.map(({ icon, title, description }, i) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-[#F8FAFD] p-6">
            <IconTile icon={icon} tone={["navy", "lime", "purple"][i % 3]} />
            <h3 className="mt-4 text-base font-bold" style={{ color: NAVY }}>{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-8 overflow-hidden rounded-[28px] lg:grid-cols-2" style={{ background: "#EEF2FA" }}>
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold" style={{ color: NAVY }}>A stronger collective voice</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            We are coming together as smaller, local groups to become a{" "}
            <strong style={{ color: NAVY }}>stronger collective voice</strong>:
          </p>
          <CheckList items={COLLECTIVE_VOICE} className="mt-5" />
        </div>
        <img src={img("social")} alt="A group of friends laughing together" className="h-full min-h-[280px] w-full object-cover" loading="lazy" />
      </div>

      <p className="font-display mx-auto mt-12 max-w-3xl text-center text-xl font-bold leading-relaxed md:text-2xl" style={{ color: NAVY }}>
        Our vision is simple: a connected disability services ecosystem where people, providers, and
        communities <span className="rounded px-1" style={{ background: LIME }}>grow stronger together</span>.
      </p>
    </Section>

    {/* ─── Why different ───────────────────────────────────────── */}
    <Section>
      <SectionHeading
        eyebrow="What makes us different"
        title="Why we're different from anything else in the marketplace"
        sub="We are not another directory, not another provider group, and not another disability services platform. We are building something fundamentally different — a community-driven, lived-experience-led ecosystem designed to shift the culture of disability support in Australia."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_DIFFERENT.map(({ icon, title, description }, i) => (
          <Card key={title} className="relative !p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="font-display absolute right-6 top-6 text-sm font-extrabold text-slate-200">
              {String(i + 1).padStart(2, "0")}
            </span>
            <IconTile icon={icon} tone={i % 2 ? "purple" : "navy"} />
            <h3 className="mt-4 pr-6 text-base font-bold leading-snug" style={{ color: NAVY }}>{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
          </Card>
        ))}
      </div>
      <div className="mt-10 rounded-2xl px-6 py-8 text-center" style={{ background: NAVY }}>
        <p className="font-display text-2xl font-bold text-white md:text-3xl">
          This is not a marketplace. <span style={{ color: LIME }}>It&apos;s a movement.</span>
        </p>
      </div>
    </Section>

    {/* ─── No one left behind ──────────────────────────────────── */}
    <Section className="bg-white">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[28px] shadow-xl">
            <img src={img("support2")} alt="A wheelchair user laughing with friends on a couch" className="h-[320px] w-full object-cover md:h-[460px]" loading="lazy" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Eyebrow>Our model · Powered by lived experience</Eyebrow>
          <h2 className="text-3xl font-bold leading-tight md:text-[40px]" style={{ color: NAVY }}>
            Building a future where no one is left behind
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 md:text-base">
            Our <em>No One Left Behind</em> model is driven by women with disabilities whose lived
            experience shapes every decision, every connection, and every part of this community.
            This platform is built on the belief that real change happens when those who have walked
            the path lead the way — when women who have navigated the system, challenged its gaps,
            and carried its weight stand at the centre of reform.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-base">
            We honour the leadership, insight, and resilience of disabled women who have long been
            the quiet backbone of advocacy, care, and community building. Their lived experience is
            not symbolic — it is the engine of this platform. It guides how we connect people, how we
            support families, how we hold providers accountable, and how we build a sector where no
            one is left behind.
          </p>
          <div className="mt-6 rounded-2xl bg-[#F4F6FA] p-6">
            <p className="mb-4 text-sm font-semibold" style={{ color: NAVY }}>Our model ensures:</p>
            <CheckList items={MODEL_ENSURES} />
          </div>
          <div className="mt-6 rounded-2xl border-l-4 p-6" style={{ borderColor: LIME, background: "#EEF2FA" }}>
            <p className="font-display text-base font-bold leading-relaxed md:text-lg" style={{ color: NAVY }}>
              By centring disabled women&apos;s leadership, we create a community that is stronger, more
              honest, and more deeply connected — a community where everyone has a place, a voice,
              and a pathway forward.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Ensuring the voice of the disability services community is loud and heard, and that
              from the ground up it is embedded, respected, and practised in every viewpoint.
            </p>
          </div>
        </div>
      </div>
    </Section>

    <div className="pt-16">
      <CtaPanel
        eyebrow="Join the movement"
        title="Ready to be part of this movement?"
        text="Join the movement reshaping what disability support can be — bold, honest, and rebuilt through the power of lived experience. Because this is not just a platform. It is a collective force, built by the community, for the community."
        primary={{ to: "/subscription", label: "Join us today" }}
        secondary={{ to: "/contact", label: "Get in touch" }}
        image="bg-1"
      />
    </div>
  </div>
);

export default AboutPage;
