import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import {
  NAVY,
  LIME,
  PURPLE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  Eyebrow,
  Section,
  SectionHeading,
  Card,
  IconTile,
  Button,
  PageHero,
  CtaPanel,
} from "../../components/public/ui";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.96305731531664!3d-37.81097997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642cb2b3e4f97%3A0x5045675218ce6e0!2s328%20Swanston%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sau!4v1710000000000!5m2!1sen!2sau";

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email us",
    subtitle: "Our friendly team is here to help",
    details: [CONTACT_EMAIL],
    link: `mailto:${CONTACT_EMAIL}`,
    cta: "Send an email",
  },
  {
    icon: Phone,
    title: "Call us",
    subtitle: "Mon–Fri, 9am to 5pm AEST",
    details: ["0403 678 767"],
    link: `tel:${CONTACT_PHONE}`,
    cta: "Call now",
  },
  {
    icon: MapPin,
    title: "Visit us",
    subtitle: "Come say hello at our office",
    details: ["328 Swanston St", "Melbourne VIC 3000"],
    link: "https://www.google.com/maps/search/328+Swanston+St+Melbourne+VIC+3000+Australia",
    cta: "Get directions",
    external: true,
  },
];

const FAQS = [
  {
    question: "What are your office hours?",
    answer:
      "Our office is open Monday to Friday, 9:00 AM to 5:00 PM AEST. However, our emergency hotline is available 24/7 for urgent matters.",
  },
  {
    question: "How quickly will I receive a response?",
    answer:
      "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our hotline for immediate assistance.",
  },
  {
    question: "Can I schedule a consultation?",
    answer:
      "Yes! You can schedule a consultation by filling out the contact form or calling us directly. We offer both in-person and virtual consultations.",
  },
];

const CATEGORIES = {
  general: "General Inquiry",
  support: "Technical Support",
  billing: "Billing Question",
  partnership: "Partnership Opportunity",
  feedback: "Feedback",
};

const inputCls = (err) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ${
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#1F6FD8] focus:ring-[#1F6FD8]/10"
  }`;

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold" style={{ color: NAVY }}>
    {children}
  </label>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone) => {
    if (!phone) return true;
    return /^\+?\d{8,15}$/.test(phone.replace(/[\s\-()]+/g, ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (formData.phone && !validatePhone(formData.phone))
      errors.phone = "Please enter a valid phone number (digits only)";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Hand the message to the visitor's email app, addressed to the team.
    const body = [
      formData.message,
      "",
      "—",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : null,
      `Inquiry type: ${CATEGORIES[formData.category]}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[${CATEGORIES[formData.category]}] ${formData.subject}`,
    )}&body=${encodeURIComponent(body)}`;

    setFormStatus("success");
    setTimeout(() => setFormStatus(null), 8000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === "phone" ? value.replace(/[^0-9+\s\-()]/g, "") : value;
    setFormData((f) => ({ ...f, [name]: v }));
    if (formErrors[name]) setFormErrors((er) => ({ ...er, [name]: "" }));
  };

  return (
    <div>
      <PageHero
        eyebrow="We're here to help"
        title="Get in touch with us"
        intro="Have questions? Need support? Our friendly team is ready to assist you. Reach out through your preferred channel."
      />

      {/* Contact methods */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {CONTACT_METHODS.map((m) => (
            <a
              key={m.title}
              href={m.link}
              {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <IconTile icon={m.icon} tone="navy" />
              <h3 className="mt-5 text-lg font-bold" style={{ color: NAVY }}>{m.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{m.subtitle}</p>
              <div className="mt-4 space-y-0.5">
                {m.details.map((d) => (
                  <p key={d} className="break-all text-[15px] font-semibold text-slate-700">{d}</p>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: PURPLE }}>
                {m.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Form + side info */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-7 !p-7 md:!p-10">
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>Drop us a line</h2>
            <p className="mt-2 text-[15px] text-slate-500">
              Fill out the form and we&apos;ll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate={false}>
              <div>
                <Label htmlFor="name">Full name *</Label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your name" className={inputCls()} />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email address *</Label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputCls(formErrors.email)} />
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <input id="phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9+\s\-()]*" value={formData.phone} onChange={handleChange} placeholder="04XX XXX XXX" className={inputCls(formErrors.phone)} />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Inquiry type *</Label>
                  <select id="category" name="category" required value={formData.category} onChange={handleChange} className={inputCls()}>
                    {Object.entries(CATEGORIES).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleChange} placeholder="How can we help you?" className={inputCls()} />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <textarea id="message" name="message" rows={6} required value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." className={`${inputCls()} resize-none`} />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold text-white shadow-sm transition hover:brightness-125"
                style={{ background: NAVY }}
              >
                <Send className="h-4 w-4" /> Send message
              </button>

              {formStatus === "success" && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-800">
                    Thanks! Your email app should open with your message ready to send. If it
                    doesn&apos;t, email us directly at {CONTACT_EMAIL}.
                  </p>
                </div>
              )}
            </form>
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl p-7 text-white shadow-xl" style={{ background: NAVY }}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Clock className="h-5 w-5" style={{ color: LIME }} />
                </span>
                <h3 className="text-xl font-bold">Office hours</h3>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                  <dt className="font-semibold">Monday – Friday</dt>
                  <dd className="text-blue-100">9:00 AM – 5:00 PM AEST</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold">Saturday – Sunday</dt>
                  <dd className="text-blue-100">Emergency hotline only</dd>
                </div>
              </dl>
            </div>

            <Card>
              <h3 className="text-xl font-bold" style={{ color: NAVY }}>Quick answers</h3>
              <div className="mt-5 divide-y divide-slate-100">
                {FAQS.map((f) => (
                  <details key={f.question} className="group py-4 first:pt-0 last:pb-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold" style={{ color: NAVY }}>
                      {f.question}
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF2FA] text-sm transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{f.answer}</p>
                  </details>
                ))}
              </div>
            </Card>

            <Card className="flex items-start gap-4">
              <IconTile icon={MessageCircle} tone="lime" />
              <div>
                <h3 className="text-base font-bold" style={{ color: NAVY }}>Ask Matilda or Shazza</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Our on-site helpers can point you to plans, profiles, events and more — look for
                  them in the corner of any page.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Map */}
      <Section className="!pt-0">
        <SectionHeading eyebrow="Location" title="Find us here" sub="328 Swanston St, Melbourne VIC 3000, Australia" />
        <div className="overflow-hidden rounded-[28px] bg-white p-2 shadow-sm">
          <iframe
            src={MAP_SRC}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="328 Swanston St, Melbourne VIC 3000, Australia"
            className="w-full rounded-[22px]"
          />
        </div>
      </Section>

      <CtaPanel
        eyebrow="Still have questions?"
        title="Our team is here to help"
        text="Don't hesitate to reach out — call us during business hours or send an email any time."
        primary={{ href: `tel:${CONTACT_PHONE}`, label: "Call now" }}
        secondary={{ href: `mailto:${CONTACT_EMAIL}`, label: "Email us" }}
        image="available"
      />
    </div>
  );
};

export default ContactPage;
