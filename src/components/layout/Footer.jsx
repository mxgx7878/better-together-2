import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import {
  BrandStripe,
  NAVY_DEEP,
  LIME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_ADDRESS,
} from "../public/ui";

// Organisations shown under "Supported By" in the footer
const PARTNERS = [
  {
    name: "SD Connect",
    href: "https://sdconnect.com.au/",
    logo: "/uploads/partners/sd-connect.webp",
  },
  {
    name: "KSPR Labs · NDIS Community",
    href: "https://ksprlabs.com/ndiscomunity/",
    logo: "/uploads/partners/kspr-labs.webp",
  },
  {
    name: "Compliance Standards Australia",
    href: "https://compliancestandardsaustralia.com.au/",
    logo: "/uploads/partners/compliance-standards-australia.webp",
  },
];

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About Us" },
      { to: "/what-we-do", label: "What We Do" },
      { to: "/business-directory", label: "Business Directory" },
      { to: "/events", label: "Events" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Get started",
    links: [
      { to: "/subscription", label: "Provider plans" },
      { to: "/subscription?for=participant", label: "Participant plans" },
      { to: "/register", label: "Create an account" },
      { to: "/login", label: "Log in" },
      { to: "/contact", label: "Contact us" },
      { to: "/terms", label: "Terms and Conditions" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "http://www.facebook.com/groups/bettertogethernetworkaustralia",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bettertogethernetwork",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

const Footer = () => (
  <footer className="relative overflow-hidden text-white" style={{ background: NAVY_DEEP }}>
    <BrandStripe />
    <div
      className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full opacity-[0.07] blur-3xl"
      style={{ background: LIME }}
    />

    <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <img
            src="/uploads/web/logo-white.webp"
            alt="The Better Together Network"
            className="h-24 w-auto"
            loading="lazy"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-blue-100/70">
            Connecting participants and providers through community-driven solutions — led by
            people with lived experience of disability.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="lg:col-span-2">
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: LIME }}>
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-blue-100/75 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="lg:col-span-4">
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: LIME }}>
            Contact us
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="group flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="break-all text-blue-100/80 group-hover:text-white">{CONTACT_EMAIL}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_PHONE}`} className="group flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="text-blue-100/80 group-hover:text-white">{CONTACT_PHONE}</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="text-blue-100/80">{CONTACT_ADDRESS}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Supported by */}
      <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: LIME }}>
              Supported by
            </p>
            <p className="mt-1 text-sm text-blue-100/70">
              Organisations standing behind the network.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${p.name} (opens in a new tab)`}
                className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] p-2.5 pr-4 transition hover:bg-white/[0.12]"
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-contain" loading="lazy" />
                </span>
                <span className="max-w-[130px] text-xs font-semibold leading-tight text-blue-100/80 group-hover:text-white">
                  {p.name}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-blue-100/40 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-blue-100/50 md:flex-row">
        <p>&copy; {new Date().getFullYear()} The Better Together Network. All rights reserved.</p>
        <Link to="/terms" className="hover:text-white">
          Terms &amp; Conditions
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
