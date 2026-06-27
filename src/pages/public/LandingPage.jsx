import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FeaturedPartnersRibbon from "../../components/common/FeaturedPartnersRibbon";
import { fetchMarketingRibbon } from "../../store/actions/marketingRibbonActions";
import FoundingMembersSection from "../../features/landingPage/MembersFounding";

const LandingPage3 = () => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const dispatch = useDispatch();
  const sponsors = useSelector((s) => s.marketingRibbon.entries);

  console.log(sponsors, "sponsors");

  useEffect(() => {
    dispatch(fetchMarketingRibbon());
  }, [dispatch]);

  // Primary color: Indigo (used consistently throughout)
  const primaryColor = {
    bg: "bg-indigo-600",
    bgHover: "hover:bg-indigo-700",
    bgLight: "bg-indigo-50",
    bgDark: "bg-indigo-900",
    text: "text-indigo-600",
    textHover: "hover:text-indigo-700",
    border: "border-indigo-600",
    borderLight: "border-indigo-200",
  };

  // Hero Slider Data
  const heroSlides = useMemo(
    () => [
      {
        title: "Reimagining Disability",
        subtitle: "With the Power of Local Communities",
        description:
          "We are an independent platform dedicated to fostering connections within local communities and linking people with local disability service providers",
        image: "/uploads/bgnew1.jpg",
        primaryBtn: { text: "Find Support", link: "/find-support" },
        secondaryBtn: { text: "For Providers", link: "/provide-support" },
      },
      {
        title: "Led by People ",
        subtitle: "with Lived Experience",
        description:
          "We are people with disabilities offering and designing for people with disabilities. Every decision is driven by authentic lived experience and community wisdom.",
        image: "/uploads/bg-two.jpeg",
        primaryBtn: { text: "Learn More", link: "/about" },
        secondaryBtn: { text: "Join Us", link: "/subscription" },
      },
      {
        title: "Building Stronger",
        subtitle: "Accessible Communities Together",
        description:
          "Uniting people with disabilities, families, businesses, providers and specialists to create a disability support network across Australia.",
        image: "/uploads/bg-three.jpeg",
        primaryBtn: { text: "Get Started", link: "/subscription" },
        secondaryBtn: { text: "Contact Us", link: "/contact" },
      },
    ],
    [],
  );

  // Testimonials
  const testimonials = useMemo(
    () => [
      {
        name: "Sarah M.",
        role: "NDIS Participant",
        content:
          "The Better Together Network made finding the right support workers so much easier. I love being able to browse profiles and choose who I want to work with.",
        image: "/uploads/testimonial-sarah.jpg",
        rating: 5,
      },
      {
        name: "James K.",
        role: "Service Provider",
        content:
          "As a provider, this platform has connected me with participants who truly benefit from my services. It's a game-changer for growing my business.",
        image: "/uploads/testimonial-james.jpg",
        rating: 5,
      },
      {
        name: "Michelle R.",
        role: "Support Coordinator",
        content:
          "I recommend The Better Together Network to all my clients. It gives them the tools to explore options and make informed choices about their support.",
        image: "/uploads/testimonial-michelle.jpg",
        rating: 5,
      },
    ],
    [],
  );

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fallback image handler
  const handleImageError = useCallback((e, fallbackText) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%234f46e5"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle"%3E${encodeURIComponent(fallbackText)}%3C/text%3E%3C/svg%3E`;
  }, []);

  // Services
  const services = useMemo(
    () => [
      {
        title: "Service Organisations & Businesses",
        description:
          "Connect with businesses and providers delivering support under the National Disability Insurance Agency.",
        image: "/uploads/ndis.jpg",
      },
      {
        title: "Transport Accident Support Services",
        description:
          "Find businesses offering Transport Accident Commission funded support and rehabilitation services.",
        image: "/uploads/tac.png",
      },
      {
        title: "Health Services",
        description:
          "Browse allied health professionals and wellness providers supporting your health and wellbeing goals.",
        image: "/uploads/health-care.jpg",
      },
      {
        title: "Medical Services",
        description:
          "Access medical practitioners and specialists who understand disability and complex care needs.",
        image: "/uploads/medical.jpg",
      },
    ],
    [],
  );
  // How It Works
  const howItWorks = useMemo(
    () => [
      {
        step: "01",
        title: "Post on the Job Board",
        description: "Post on our job board the services you are looking for.",
        image: "/uploads/tell.jpg",
      },
      {
        step: "02",
        title: "Connect Safety",
        description:
          "Local businesses will respond, and you choose who is right for you.",
        image: "/uploads/plan.jpg",
      },
      {
        step: "03",
        title: "Strong Partnerships",
        description:
          "We work with you and your chosen provider to help build the relationship and establish a strong working relationship. ",
        image: "/uploads/connect.jpg",
      },
    ],
    [],
  );

  // Differentiators
  const differentiators = useMemo(
    () => [
      {
        title: "Led by Disabled People",
        description:
          "Not built about disabled people, but by disabled people. Lived experience drives every decision.",
        image: "/uploads/value-leadership.jpg",
      },
      {
        title: "Community First",
        description:
          "We prioritize connection, safety, and transparency over profits and metrics.",
        image: "/uploads/value-community.jpg",
      },
      {
        title: "No Commission Model",
        description:
          "Keep 100% of your earnings. We believe ethical connections shouldn't cost you.",
        image: "/uploads/value-commission.jpg",
      },
      {
        title: "Ground-Up Approach",
        description:
          "We listen to the community, respond to real needs, and build tools that reflect lived realities.",
        image: "/uploads/value-approach.jpg",
      },
      {
        title: "Participants & Providers Unite",
        description:
          "We bring both sides together safely, because real change happens when everyone has a voice.",
        image: "/uploads/value-unite.jpg",
      },
      {
        title: "Transparency & Accountability",
        description:
          "We build a culture where honesty is standard, whistleblowing is respected, and community safety comes first.",
        image: "/uploads/value-transparency.jpg",
      },
    ],
    [],
  );

  // Platform Features
  const platformFeatures = useMemo(
    () => [
      {
        title: "Smart Provider Search",
        description:
          "Advanced filters to find the perfect provider for your needs",
        image: "/uploads/smart.jpg",
        link: "/dashboard/directory",
      },
      {
        title: "Community Network",
        description: "Connect with thousands of participants and providers",
        image: "/uploads/network.jpg",
        link: "/find-support",
      },
      {
        title: "Verified Quality",
        description: "All providers verified for quality and compliance",
        image: "/uploads/verify.jpg",
        link: "/provide-support",
      },
      {
        title: "24/7 Support",
        description: "Get instant answers with our support team",
        image: "/uploads/available.jpg",
        link: "/contact",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white">
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>

      {/* Hero Slider Section - No Gradients, Solid Overlay */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Solid Color Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e, "Hero Image")}
              />
              {/* Solid indigo overlay instead of gradient */}
              <div className="absolute inset-0"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <h1
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight animate-fadeInUp drop-shadow-lg"
                    style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}
                  >
                    {slide.title}
                  </h1>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fadeInUp animation-delay-200 drop-shadow-lg"
                    style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
                  >
                    {slide.subtitle}
                  </h2>
                  <p
                    className="text-xl md:text-2xl text-white mb-8 leading-relaxed animate-fadeInUp animation-delay-400 drop-shadow-md"
                    style={{ textShadow: "1px 1px 6px rgba(0,0,0,0.7)" }}
                  >
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
                    {/* Primary Button - White with indigo text */}
                    <Link
                      to={slide.primaryBtn.link}
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      {slide.primaryBtn.text}
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>

                    {/* Secondary Button - Solid white with border */}
                    <Link
                      to={slide.secondaryBtn.link}
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 shadow-lg"
                    >
                      {slide.secondaryBtn.text}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
          <div className="flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeHeroSlide
                    ? "w-12 h-3 bg-white"
                    : "w-3 h-3 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setActiveHeroSlide(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <img
                src="/uploads/hearing-aid.jpg"
                alt="Community gathering"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e, "Mission Image")}
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                Our Purpose
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Building Stronger Communities — Together
              </h2>
              <div className="w-24 h-1 bg-indigo-600 mb-8"></div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe that disability-sector services and people who offer
                support in the disability sector must operate effectively, and
                this needs to be driven, shaped, and led by people with
                disabilities
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe disability services must operate effectively, and
                they should be driven, shaped, and guided by people with
                disabilities. Provider practices, community spaces, and sector
                standards should be built through authentic co‑design, grounded
                in disability theory and the core principle that
                <strong> "nothing about us without us"</strong>.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 group text-lg"
              >
                Learn More About Our Mission
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}

      <section className="relative overflow-hidden py-16 md:py-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/uploads/who-we-help2.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Headings */}
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Who We Help
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Connecting Participants &amp; Providers
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Whether you're seeking support or providing services, The Better
              Together Network brings the community together.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-6 max-w-2xl">
            {/* Card 1 - White */}
            <div
              className="group rounded-3xl bg-white p-8 md:p-10
                   shadow-[0_25px_60px_rgba(0,0,0,0.18)]
                   transition-all duration-300
                   hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-start gap-5">
                {/* Icon circle */}
                <div
                  className="shrink-0 w-14 h-14 rounded-full bg-slate-900/90 text-white
                       flex items-center justify-center
                       transition-transform duration-300 group-hover:scale-105"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12a5 5 0 100-10 5 5 0 000 10z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21a8 8 0 10-16 0"
                    />
                  </svg>
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-600">
                    Participants Seeking Support
                  </div>
                  <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                    Looking for Support?
                  </h3>
                  <p className="mt-3 text-slate-600 leading-7">
                    Find verified disability-sector service providers in your
                    area. Browse profiles, compare services, and connect with
                    providers who match your needs and goals.
                  </p>

                  <div className="mt-6">
                    <Link
                      to="/find-support"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full
                           bg-slate-900 text-white font-semibold
                           transition-all duration-300
                           hover:bg-slate-800 hover:-translate-y-0.5"
                    >
                      Find Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Pink */}
            <div
              className="group rounded-3xl bg-rose-600 p-8 md:p-10
                   shadow-[0_25px_60px_rgba(0,0,0,0.18)]
                   transition-all duration-300
                   hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-start gap-5">
                {/* Icon circle */}
                <div
                  className="shrink-0 w-14 h-14 rounded-full bg-white text-rose-600
                       flex items-center justify-center
                       transition-transform duration-300 group-hover:scale-105"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7a4 4 0 108 0 4 4 0 00-8 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 8v6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M23 11h-6"
                    />
                  </svg>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/85">
                    Service Providers
                  </div>
                  <h3 className="mt-1 text-2xl font-extrabold text-white">
                    For Provider
                  </h3>
                  <p className="mt-3 text-white/90 leading-7">
                    Join our network and connect with thousands of
                    disability-sector participants. Build your profile, respond
                    to requests, and grow your business.
                  </p>

                  <div className="mt-6">
                    <Link
                      to="/provide-support"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full
                           bg-white text-rose-600 font-semibold
                           transition-all duration-300
                           hover:-translate-y-0.5 hover:bg-white/90"
                    >
                      Join as Provider
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* subtle background shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full border border-slate-200/60" />
          <div className="absolute -right-56 -top-20 h-[520px] w-[520px] rounded-full border border-slate-200/60" />
          <div className="absolute right-0 top-0 h-[420px] w-[520px] opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-transparent [clip-path:polygon(35%_0,100%_0,60%_100%,0_100%)]" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-rose-500 uppercase tracking-wider">
              Platform Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to make your disability services
              journey smoother
            </p>
          </div>

          {/* Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature, index) => (
              <Link
                to={feature.link}
                key={index}
                className={`group relative px-8 py-10 text-center transition-all duration-300 cursor-pointer ${
                  index !== platformFeatures.length - 1
                    ? "lg:border-r lg:border-slate-200/70"
                    : ""
                }`}
              >
                {/* Hover panel */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-3 rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] border border-slate-200/70" />
                </div>

                {/* Content wrapper */}
                <div className="relative">
                  {/* Circle Image */}
                  <div className="relative mx-auto w-40 h-40">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover rounded-full shadow-md transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => handleImageError(e, feature.title)}
                    />

                    {/* Floating icon badge */}
                    <div className="absolute -top-1 -right-2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-7 h-7 text-rose-500 transition-colors duration-300 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* simple “feature” icon */}
                        <path d="M12 2v4" />
                        <path d="M12 18v4" />
                        <path d="M4.93 4.93l2.83 2.83" />
                        <path d="M16.24 16.24l2.83 2.83" />
                        <path d="M2 12h4" />
                        <path d="M18 12h4" />
                        <path d="M4.93 19.07l2.83-2.83" />
                        <path d="M16.24 7.76l2.83-2.83" />
                        <circle cx="12" cy="12" r="3.2" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-8 text-xl font-extrabold text-slate-900 transition-colors duration-300 group-hover:text-rose-500">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-slate-600 leading-7">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex justify-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent transition-all duration-300 group-hover:bg-rose-500">
                      <svg
                        className="w-5 h-5 text-slate-900 transition-colors duration-300 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Service Providers Who Support You
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Services You Can Find
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connection to a wide range of businesses who offer support across
              disability-sector services, health, and medical services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, service.title)}
                  />
                  <div className="absolute inset-0"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/find-support"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Services
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden bg-[#071c4d] py-16 md:py-20">
        {/* Top-right diagonal accent */}
        <div className="pointer-events-none absolute right-0 top-0 h-[220px] w-[360px] opacity-90">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#2b1b6b] via-[#0b2a7a] to-transparent" />
          <div className="absolute right-10 top-0 h-full w-10 -skew-x-[25deg] bg-white/10" />
          <div className="absolute right-24 top-0 h-full w-10 -skew-x-[25deg] bg-white/10" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="grid items-start gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-4 w-4 rounded-sm border border-red-400/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
                  Explore Services With Us
                </span>
              </div>

              <h2 className="max-w-xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
                Fast & Reliable Connections To Trusted Services{" "}
              </h2>
            </div>

            <div className="relative md:col-span-5">
              <div className="absolute -left-4 top-1 hidden h-20 w-[2px] bg-red-500 md:block" />
              <p className="max-w-md text-sm leading-7 text-white/80 md:pl-2">
                Connect with quality disability services support in simple
                steps.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="group relative rounded-2xl bg-[#0a255f]/60 border border-white/10 p-8
                     shadow-xl backdrop-blur-sm transition-all duration-300
                     hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              >
                {/* Step Number Badge */}
                <div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full
                       bg-[#061a45] ring-1 ring-white/15 text-2xl font-extrabold text-white
                       transition-all duration-300
                       group-hover:bg-indigo-600 group-hover:scale-110 group-hover:ring-indigo-400/60"
                >
                  {step.step}
                </div>

                {/* Glow on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                          group-hover:opacity-100
                          shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35)]"
                />

                {/* Content */}
                <h3 className="text-center text-xl font-bold text-white transition-colors duration-300 group-hover:text-indigo-200">
                  {step.title}
                </h3>

                <p className="mt-3 text-center text-sm leading-6 text-white/65 transition-colors duration-300 group-hover:text-white/80">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FoundingMembersSection />

      {/* Why Choose Us Section */}

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left: Media Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Media */}
                <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                  {/* Replace src with your image if needed */}
                  <img
                    src="/uploads/care.jpg"
                    alt=""
                    className="w-full h-[420px] md:h-[720px] object-cover"
                  />

                  {/* Play button */}
                </div>

                {/* Vertical pill (decor) */}
                <div className="hidden lg:block absolute -right-7 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-32 rounded-full bg-slate-800/90 shadow-lg" />
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <div className="text-sm font-semibold uppercase tracking-wider text-rose-500">
                  What Makes Us Different
                </div>

                <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  This Is Not a Marketplace
                </h2>

                <div className="mt-2 text-2xl md:text-3xl font-extrabold text-indigo-600">
                  It&apos;s a Movement
                </div>
              </div>

              {/* 6 Pills/Cards */}
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  {
                    num: "01",
                    title: "Led by Disabled People",
                    desc: "Not built about disabled people, but by disabled people. Lived experience drives every decision.",
                  },
                  {
                    num: "02",
                    title: "Community First",
                    desc: "We prioritize connection, safety, and transparency over profits and metrics.",
                  },
                  {
                    num: "03",
                    title: "No Commission Model",
                    desc: "Keep 100% of your earnings. We believe ethical connections shouldn't cost you.",
                  },
                  {
                    num: "04",
                    title: "Ground-Up Approach",
                    desc: "We listen to the community, respond to real needs, and build tools that reflect lived realities.",
                  },
                  {
                    num: "05",
                    title: "Participants & Providers Unite",
                    desc: "We bring both sides together safely, because real change happens when everyone has a voice.",
                  },
                  {
                    num: "06",
                    title: "Transparency & Accountability",
                    desc: "We build a culture where honesty is standard, whistleblowing is respected, and community safety comes first.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white rounded-2xl border border-slate-200
                         shadow-[0_10px_30px_rgba(15,23,42,0.06)]
                         px-5 py-5 transition-all duration-300
                         hover:-translate-y-1 hover:border-indigo-200
                         hover:shadow-[0_18px_50px_rgba(79,70,229,0.18)]"
                  >
                    {/* Glow ring */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                              group-hover:opacity-100
                              shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35)]"
                    />

                    <div className="flex items-start gap-4">
                      {/* Check + number badge */}
                      <div
                        className="shrink-0 w-12 h-12 rounded-full bg-slate-50 border border-slate-200
                             flex items-center justify-center transition-all duration-300
                             group-hover:bg-indigo-50 group-hover:border-indigo-200"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-rose-500 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="text-slate-900 font-bold leading-tight">
                            {item.title}
                          </div>
                          <div className="text-slate-300 font-extrabold">
                            {item.num}
                          </div>
                        </div>

                        <div className="mt-2 text-sm leading-6 text-slate-600 group-hover:text-slate-700 transition-colors">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl
                       bg-indigo-600 text-white font-semibold
                       shadow-lg transition-all duration-300
                       hover:bg-indigo-700 hover:shadow-[0_18px_40px_rgba(79,70,229,0.25)]
                       hover:-translate-y-0.5"
                >
                  Learn More About Our Mission
                  <svg
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from real people in The Better Together Network
              community
            </p>
          </div>

          {/* Cards */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {[0, 1].map((slot) => {
                const idx = (activeTestimonial + slot) % testimonials.length;
                const t = testimonials[idx];
                const accent = slot === 1;

                return (
                  <button
                    key={slot}
                    onClick={() => setActiveTestimonial(idx)}
                    className="group text-left"
                    aria-label={`Select testimonial ${idx + 1}`}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_22px_60px_rgba(15,23,42,0.10)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
                      {/* Curved background shapes */}
                      <div className="pointer-events-none absolute inset-0">
                        <div
                          className={`absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-90 ${
                            accent ? "bg-rose-500" : "bg-rose-200"
                          }`}
                        />
                        <div className="absolute -left-12 -top-12 h-52 w-52 rounded-full bg-white/80" />
                      </div>

                      <div className="relative p-8 md:p-10">
                        {/* Stars */}
                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(t.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-rose-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Testimonial text */}
                        <p className="text-slate-600 leading-7 text-center mb-8">
                          {t.content}
                        </p>

                        {/* Author */}
                        <div className="text-center">
                          <div className="text-xl font-extrabold text-slate-900">
                            {t.name}
                          </div>
                          <div className="text-rose-500 font-semibold">
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeTestimonial
                      ? "w-12 h-3 bg-indigo-600"
                      : "w-3 h-3 bg-indigo-200 hover:bg-indigo-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Solid Color Background */}
      <section className="relative py-32 overflow-hidden bg-indigo-900">
        {/* Background Image with Solid Overlay */}
        <div className="absolute inset-0">
          <img
            src="/uploads/banner.jpg"
            alt="Join our community"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white text-indigo-900 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
            Join Today
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform
            <span className="block text-indigo-200 mt-2">
              how you connect with businesses who can help.{" "}
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {" "}
            Join a network of participants and providers who are ready to create
            meaningful connections and experience the power of The Better
            Together Network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/find-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-indigo-900 bg-white rounded-lg hover:bg-indigo-50 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              For Participants
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              to="/provide-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Provide Support
            </Link>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free to get started
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
      {sponsors?.length > 0 && (
        <section className="bg-white py-10 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedPartnersRibbon
              sponsors={sponsors}
              title="Our Marketing Partners"
              note="Sponsored providers"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage3;
