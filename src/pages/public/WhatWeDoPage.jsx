import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Calendar,
  Shield,
  Star,
  Search,
  Handshake,
  UserPlus,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Heart,
  Rocket,
  Globe,
} from 'lucide-react';

const WhatWeDoPage = () => {
  const services = [
    {
      icon: <Handshake className="w-8 h-8 text-white" />,
      title: 'Connect Participants & Businesses',
      description:
        'We bridge the gap between NDIS participants seeking quality support and verified local businesses ready to deliver. Our platform makes it simple to find the right match based on needs, location, and availability.',
      highlights: [
        'Personalised matching',
        'Verified providers',
        'Local connections',
        'Transparent profiles',
      ],
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: <Star className="w-8 h-8 text-white" />,
      title: 'Subscription Management',
      description:
        'Affordable subscription plans for both participants and providers, giving you ongoing access to our community tools, directory listings, networking events, and dedicated support resources.',
      highlights: [
        'Flexible plans',
        'Provider & participant tiers',
        'Ongoing support access',
        'Value-driven pricing',
      ],
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      title: 'Business Directory',
      description:
        'A comprehensive, searchable directory of NDIS-registered and community-verified businesses. Participants can browse, compare, and connect with providers who meet their specific requirements.',
      highlights: [
        'Searchable listings',
        'Service categories',
        'Reviews & ratings',
        'Direct contact',
      ],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: 'Community Events',
      description:
        'Regular networking events, workshops, and community gatherings that bring participants, providers, and advocates together. Build genuine relationships and stay informed about sector developments.',
      highlights: [
        'Networking meetups',
        'Educational workshops',
        'Community gatherings',
        'Sector updates',
      ],
      color: 'from-orange-500 to-red-500',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: <UserPlus className="w-10 h-10 text-white" />,
      title: 'Sign Up',
      description:
        'Create your free account as a participant or a provider. Tell us about your needs or your services so we can tailor your experience from the very start.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02',
      icon: <Search className="w-10 h-10 text-white" />,
      title: 'Find Services or List Your Business',
      description:
        'Participants can browse our verified directory to find trusted local support. Providers can create a detailed listing, showcase their services, and reach people who need them most.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      number: '03',
      icon: <Rocket className="w-10 h-10 text-white" />,
      title: 'Connect & Grow',
      description:
        'Build meaningful connections through our platform, attend community events, access resources, and grow together. Whether you are finding support or building a business, we are here every step of the way.',
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  const trustPoints = [
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      text: 'All providers are verified and community-reviewed',
    },
    {
      icon: <Heart className="w-6 h-6 text-purple-600" />,
      text: 'Led by lived experience and community values',
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      text: 'Built for participants, families, and local providers',
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      text: 'Supporting communities across Australia',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block mb-4">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Our Mission in Action
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            What We
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Do
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Connecting NDIS participants with trusted, verified businesses and support workers
            to build stronger disability networks across Australia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/subscribe"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/find-support"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Browse Directory <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-purple-50 rounded-2xl px-5 py-4"
              >
                {point.icon}
                <span className="text-sm font-medium text-gray-700">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {' '}Thrive
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From finding the right support to growing your business, our platform provides
              the tools and connections that make the NDIS work better for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="p-8">
                  <div className="flex items-start gap-5">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {service.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Three Simple Steps to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {' '}Get Connected
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you are an NDIS participant looking for support or a provider wanting to
              reach your community, getting started is easy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-300 to-pink-300"></div>
                )}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative z-10 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-sm font-bold text-purple-400 mb-4 tracking-widest">
                    STEP {step.number}
                  </div>
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-flex items-center gap-2">
              <Heart className="w-4 h-4" /> Join Our Community
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Be Part of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Something Better?
            </span>
          </h2>

          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscribe today and join a growing network of NDIS participants, providers,
            and advocates who believe in building a stronger disability community together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscribe"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Subscribe Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Contact Us <Handshake className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDoPage;
