import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const LandingPage2 = () => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Hero Slider Data - memoized to prevent recreation on each render
  const heroSlides = useMemo(() => [
    {
      title: "Reimagining Disability",
      subtitle: "With the Power of Local Communities",
      description: "We are an independent NDIS community platform dedicated to placing local connection at the heart of everything we do.",
      image: "/uploads/hero-community.jpg",
      primaryBtn: { text: "Find Support", link: "/find-support" },
      secondaryBtn: { text: "Become a Provider", link: "/provide-support" }
    },
    {
      title: "Where Lived Experience",
      subtitle: "Leads the Way",
      description: "Built by disabled people, for disabled people. Every decision is driven by authentic lived experience and community wisdom.",
      image: "/uploads/hero-leadership.jpg",
      primaryBtn: { text: "Learn More", link: "/about" },
      secondaryBtn: { text: "Join Us", link: "/subscription" }
    },
    {
      title: "Building Stronger",
      subtitle: "NDIS Communities Together",
      description: "Uniting participants, providers, families, and specialists to create supportive disability networks across Australia.",
      image: "/uploads/hero-together.jpg",
      primaryBtn: { text: "Get Started", link: "/subscription" },
      secondaryBtn: { text: "Contact Us", link: "/contact" }
    }
  ], []);

  // Testimonials - memoized
  const testimonials = useMemo(() => [
    {
      name: 'Sarah M.',
      role: 'NDIS Participant',
      content: 'Better Together Network made finding the right support workers so much easier. I love being able to browse profiles and choose who I want to work with.',
      image: '/uploads/testimonial-sarah.jpg',
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Service Provider',
      content: 'As a provider, this platform has connected me with participants who truly benefit from my services. It\'s a game-changer for growing my business.',
      image: '/uploads/testimonial-james.jpg',
      rating: 5,
    },
    {
      name: 'Michelle R.',
      role: 'Support Coordinator',
      content: 'I recommend Better Together Network to all my clients. It gives them the tools to explore options and make informed choices about their support.',
      image: '/uploads/testimonial-michelle.jpg',
      rating: 5,
    },
  ], []);

  // Auto-rotate hero slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fallback image handler - memoized to prevent recreation
  const handleImageError = useCallback((e, fallbackColor, fallbackText) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23${fallbackColor}"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle"%3E${encodeURIComponent(fallbackText)}%3C/text%3E%3C/svg%3E`;
  }, []);

  // Services with Images
  const services = useMemo(() => [
    {
      title: 'Daily Living Support',
      description: 'Help with everyday tasks like cooking, cleaning, and household management.',
      image: '/uploads/service-daily-living.jpg',
      color: '3b82f6',
    },
    {
      title: 'Therapy Services',
      description: 'Connect with occupational therapists, speech pathologists, and more.',
      image: '/uploads/service-therapy.png',
      color: 'f97316',
    },
    {
      title: 'Social & Community',
      description: 'Participate in social activities and community events with support.',
      image: '/uploads/service-social.png',
      color: 'a855f7',
    },
    {
      title: 'Support Coordination',
      description: 'Get help navigating and managing your NDIS plan effectively.',
      image: '/uploads/service-coordination.png',
      color: '14b8a6',
    },
  ], []);

  // How It Works with Images
  const howItWorks = useMemo(() => [
    {
      step: '01',
      title: 'Tell Us What You Need',
      description: 'Share your requirements and the type of NDIS services you\'re looking for.',
      image: '/uploads/step-search.jpg',
    },
    {
      step: '02',
      title: 'We Match You With Providers',
      description: 'We\'ll show you possible providers and services that match your specific needs.',
      image: '/uploads/step-match.jpg',
    },
    {
      step: '03',
      title: 'Connect Safely',
      description: 'With your permission, we facilitate secure connections between you and providers.',
      image: '/uploads/step-connect.jpg',
    },
    {
      step: '04',
      title: 'Build Relationships',
      description: 'Qualified providers will reach out to you and you can choose who to work with.',
      image: '/uploads/step-relationship.jpg',
    },
  ], []);

  // Differentiators with Images
  const differentiators = useMemo(() => [
    {
      title: 'Led by Disabled People',
      description: 'Not built about disabled people, but by disabled people. Lived experience drives every decision.',
      image: '/uploads/value-leadership.jpg',
      color: 'a855f7',
    },
    {
      title: 'Community First',
      description: 'We prioritize connection, safety, and transparency over profits and metrics.',
      image: '/uploads/value-community.jpg',
      color: 'ec4899',
    },
    {
      title: 'No Commission Model',
      description: 'Keep 100% of your earnings. We believe ethical connections shouldn\'t cost you.',
      image: '/uploads/value-commission.jpg',
      color: 'fbbf24',
    },
    {
      title: 'Ground-Up Approach',
      description: 'We listen to the community, respond to real needs, and build tools that reflect lived realities.',
      image: '/uploads/value-approach.jpg',
      color: '10b981',
    },
    {
      title: 'Participants & Providers Unite',
      description: 'We bring both sides together safely, because real change happens when everyone has a voice.',
      image: '/uploads/value-unite.jpg',
      color: '6366f1',
    },
    {
      title: 'Transparency & Accountability',
      description: 'We build a culture where honesty is standard, whistleblowing is respected, and community safety comes first.',
      image: '/uploads/value-transparency.jpg',
      color: '06b6d4',
    },
  ], []);

  // Platform Features with Images
  const platformFeatures = useMemo(() => [
    {
      title: 'Smart Provider Search',
      description: 'Advanced filters to find the perfect provider for your needs',
      image: '/uploads/feature-search.jpg',
      color: 'a855f7',
    },
    {
      title: 'Community Network',
      description: 'Connect with thousands of participants and providers',
      image: '/uploads/feature-network.jpg',
      color: '10b981',
    },
    {
      title: 'Verified Quality',
      description: 'All providers verified for quality and compliance',
      image: '/uploads/feature-verified.jpg',
      color: 'fbbf24',
    },
    {
      title: '24/7 Support',
      description: 'Get instant answers with our support team',
      image: '/uploads/feature-support.jpg',
      color: 'ec4899',
    }
  ], []);

  return (
    <div className="min-h-screen bg-white">
      {/* CSS Animations - using regular style tag instead of styled-jsx */}
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

      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e, '6366f1', 'Hero Image')}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-pink-800/70"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight animate-fadeInUp">
                    {slide.title}
                  </h1>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-6 animate-fadeInUp animation-delay-200">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed animate-fadeInUp animation-delay-400">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-600">
                    <Link
                      to={slide.primaryBtn.link}
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      {slide.primaryBtn.text}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link
                      to={slide.secondaryBtn.link}
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300"
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
          {/* Dots */}
          <div className="flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeHeroSlide
                    ? 'w-12 h-3 bg-yellow-400'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Mission Statement Section with Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <img
                src="/uploads/mission-community.jpg"
                alt="Community gathering"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
                loading="lazy"
                onError={(e) => handleImageError(e, 'a855f7', 'Mission Image')}
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Purpose</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Building Stronger NDIS Communities — Together
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mb-8"></div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We are an independent NDIS community platform designed to bring people together — providers, 
                participants, families, and local specialists — to create stronger, more connected, and more 
                supportive disability networks across Australia.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We believe the NDIS must not only operate effectively, but be <strong>driven, shaped, and guided 
                by people with disabilities</strong>. Provider practices, community spaces, and sector standards should 
                be built through authentic co‑design, grounded in disability theory and the core principle that 
                <strong> "nothing about us without us"</strong>.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 group text-lg"
              >
                Learn More About Our Mission
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              NDIS Services You Can Find
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with providers across all NDIS service categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, service.color, service.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/find-support"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with quality NDIS support in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line - Desktop Only */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-200 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}

                <div className="relative z-10 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 z-10 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => handleImageError(e, 'f97316', step.step)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Images */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">What Makes Us Different</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              This Is Not a Marketplace
            </h2>
            <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              It's a Movement
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, item.color, item.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/40">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More About Our Mission
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Help Section with Large Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Who We Help</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Connecting Participants & Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're seeking support or providing services, Better Together Network brings the community together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Participants */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Background Image */}
              <div className="relative h-96 lg:h-[500px]">
                <img
                  src="/uploads/participants-hero.jpg"
                  alt="NDIS Participants"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => handleImageError(e, '14b8a6', 'Participants')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/95 via-teal-900/60 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Looking for Support?</h3>
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Find verified NDIS service providers in your area. Browse profiles, compare services, 
                  and connect with providers who match your needs and goals.
                </p>
                <Link
                  to="/find-support"
                  className="inline-flex items-center justify-center bg-white text-teal-900 px-8 py-4 rounded-lg font-bold hover:bg-teal-50 transition-all duration-300 shadow-xl w-fit"
                >
                  Find Support
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* For Providers */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Background Image */}
              <div className="relative h-96 lg:h-[500px]">
                <img
                  src="/uploads/providers-hero.jpg"
                  alt="NDIS Providers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => handleImageError(e, 'a855f7', 'Providers')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/60 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Become a Provider</h3>
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Join our network and connect with thousands of NDIS participants. Build your profile, 
                  respond to requests, and grow your business.
                </p>
                <Link
                  to="/provide-support"
                  className="inline-flex items-center justify-center bg-white text-purple-900 px-8 py-4 rounded-lg font-bold hover:bg-purple-50 transition-all duration-300 shadow-xl w-fit"
                >
                  Join as Provider
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features with Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make your NDIS journey smoother
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, feature.color, feature.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">Real experiences from real people in the Better Together Network community</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-purple-200">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
                          loading="lazy"
                          onError={(e) => handleImageError(e, 'a855f7', testimonial.name)}
                        />
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                          "{testimonial.content}"
                        </p>

                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-purple-600 font-semibold">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === activeTestimonial
                        ? 'w-12 h-3 bg-purple-600'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/uploads/cta-background.jpg"
            alt="Join our community"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => handleImageError(e, '6366f1', 'Join Us')}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-pink-800/90 to-red-800/85"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
            Join Today
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block text-yellow-400 mt-2">
              NDIS Experience?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of participants and providers who have already discovered 
            the power of meaningful connections through Better Together Network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/find-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Find Support
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              to="/provide-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Provide Support
            </Link>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free to get started
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage2;