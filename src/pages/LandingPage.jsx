import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, FileText, MessageCircle, Home, Briefcase, Lightbulb, Target, Heart, Handshake, Leaf, Sprout, Star, Shield, ShieldCheck, Lock, CheckCircle, ThumbsUp, Building2, Sparkles, Brain, Compass, BookOpen, Zap, User, TrendingUp, Eye, Globe } from '../components/Icons';

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: 'Daily Living Support',
      description: 'Help with everyday tasks like cooking, cleaning, and household management.',
      icon: <Home className="w-7 h-7 text-white" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Therapy Services',
      description: 'Connect with occupational therapists, speech pathologists, and more.',
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Social & Community',
      description: 'Participate in social activities and community events with support.',
      icon: <Star className="w-7 h-7 text-white" />,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Support Coordination',
      description: 'Get help navigating and managing your NDIS plan effectively.',
      icon: <FileText className="w-7 h-7 text-white" />,
      color: 'from-teal-500 to-green-600',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Tell Us What You Need',
      description: 'Share your requirements and the type of NDIS services you\'re looking for.',
      icon: <Search className="w-8 h-8" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '02',
      title: 'We Match You With Providers',
      description: 'We\'ll show you possible providers and services that match your specific needs.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '03',
      title: 'Connect Safely',
      description: 'With your permission, we facilitate secure connections between you and providers.',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '04',
      title: 'Build Relationships',
      description: 'Qualified providers will reach out to you and you can choose who to work with.',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'NDIS Participant',
      content: 'The Better Together Network made finding the right support workers so much easier. I love being able to browse profiles and choose who I want to work with.',
      avatar: <User className="w-8 h-8 text-purple-600" />,
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Service Provider',
      content: 'As a provider, this platform has connected me with participants who truly benefit from my services. It\'s a game-changer for growing my business.',
      avatar: <User className="w-8 h-8 text-blue-600" />,
      rating: 5,
    },
    {
      name: 'Michelle R.',
      role: 'Support Coordinator',
      content: 'I recommend The Better Together Network to all my clients. It gives them the tools to explore options and make informed choices about their support.',
      avatar: <User className="w-8 h-8 text-pink-600" />,
      rating: 5,
    },
  ];

  // FIXED: Reduced to 6 items for even grid (2 rows of 3)
  const differentiators = [
    {
      number: '01',
      title: 'Led by Disabled People',
      description: 'Not built about disabled people, but by disabled people. Lived experience drives every decision.',
      icon: <Users className="w-7 h-7 text-white" />,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Community First',
      description: 'We prioritize connection, safety, and transparency over profits and metrics.',
      icon: <Heart className="w-7 h-7 text-white" />,
      color: 'from-pink-500 to-rose-600',
    },
    {
      number: '03',
      title: 'No Commission Model',
      description: 'Keep 100% of your earnings. We believe ethical connections shouldn\'t cost you.',
      icon: <Briefcase className="w-7 h-7 text-white" />,
      color: 'from-yellow-500 to-amber-500',
    },
    {
      number: '04',
      title: 'Ground-Up Approach',
      description: 'We listen to the community, respond to real needs, and build tools that reflect lived realities.',
      icon: <Sprout className="w-7 h-7 text-white" />,
      color: 'from-green-500 to-teal-600',
    },
    {
      number: '05',
      title: 'Participants & Providers Unite',
      description: 'We bring both sides together safely, because real change happens when everyone has a voice.',
      icon: <Handshake className="w-7 h-7 text-white" />,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      number: '06',
      title: 'Transparency & Accountability',
      description: 'We build a culture where honesty is standard, whistleblowing is respected, and community safety comes first.',
      icon: <Lock className="w-7 h-7 text-white" />,
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  // FIXED: Added 6th vision point for even grid (2 rows of 3)
  const visionPoints = [
    {
      icon: <Handshake className="w-7 h-7 text-white" />,
      title: 'Providers Support Each Other',
      description: 'Collaboration becomes the norm, not the exception.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <Search className="w-7 h-7 text-white" />,
      title: 'Easy Access to Trusted Services',
      description: 'Real choice and control are strengthened through genuine, transparent connections.',
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: <Globe className="w-7 h-7 text-white" />,
      title: 'Local Relationships Valued',
      description: 'Communities thrive when people know, trust, and support one another.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-white" />,
      title: 'Trust & Transparency First',
      description: 'We prioritise integrity, lived experience, and the voices of people with disability.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      title: 'Connected & Empowered',
      description: 'Everyone deserves access to clear information, respectful support, and a community that listens.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: <Target className="w-7 h-7 text-white" />,
      title: 'Support Beyond Services',
      description: 'We help you understand the NDIS, navigate reviews, access advocacy, and feel confident in your rights.',
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  const platformFeatures = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Provider Search',
      description: 'Advanced filters to find the perfect provider for your needs',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Network',
      description: 'Connect with thousands of participants and providers',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Verified Quality',
      description: 'All providers verified for quality and compliance',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Get instant answers with our support team',
      color: 'bg-gradient-to-br from-pink-500 to-red-500'
    }
  ];

  const trustIndicators = [
    {
      icon: <Shield className="w-10 h-10 text-green-600" />,
      title: 'NDIS Quality & Safety',
      description: 'We adhere to NDIS Quality and Safeguards Commission standards'
    },
    {
      icon: <Lock className="w-10 h-10 text-green-600" />,
      title: 'Secure Platform',
      description: 'Your data is encrypted and protected with industry-leading security'
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      title: 'Verified Providers',
      description: 'All providers undergo thorough verification before joining'
    },
    {
      icon: <ThumbsUp className="w-10 h-10 text-green-600" />,
      title: '98% Satisfaction',
      description: 'Our community consistently rates us 5 stars for service quality'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-5xl mx-auto">

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Reimagining Disability with the Power of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Local Communities
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl mb-16 text-gray-200 leading-relaxed max-w-4xl mx-auto">
              We are an independent NDIS community platform dedicated to placing local connection at the heart of everything we do. By uniting participants, providers, families, and local specialists, we aim to foster stronger, more connected, and truly supportive disability communities throughout Australia.
            </p>

            {/* Explore Our Platform */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-10">Explore Our Platform</h2>

              <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">

                {/* Participants */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-3 h-3 bg-yellow-400 rounded-full mt-2 mr-4"></div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Participants</h3>
                      <p className="text-gray-200 leading-relaxed">
                        Discover information tailored to your experience as a participant. Learn how you can connect with your local community and access the support you need.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Providers */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-3 h-3 bg-yellow-400 rounded-full mt-2 mr-4"></div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Providers</h3>
                      <p className="text-gray-200 leading-relaxed">
                        Access resources and details designed for providers and connect with people who are looking for support. Find out how you can contribute to and benefit from our supportive local network.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                to="/find-support"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                Participants
                <span>→</span>
              </Link>
              <Link
                to="/provide-support"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105"
              >
                Providers
              </Link>
            </div>

          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              Building Stronger NDIS Communities — Together
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Main Mission Statement */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-3xl p-10 mb-12 border-2 border-purple-200 shadow-xl">
              <div className="text-center mb-8">
                <div className="mb-4 flex justify-center"><Sprout className="w-12 h-12 text-green-600" /></div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Where Lived Experience Leads
                </h3>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed mb-6 text-center">
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

              <p className="text-lg text-gray-700 leading-relaxed text-center">
                <strong>Our mission:</strong> To build a connected NDIS community where people, providers, and local
                networks grow stronger together — and where the sector is shaped by the very people it exists to serve.
              </p>
            </div>

            {/* Mission Taglines - Grid of 3 */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { tagline: "Where lived experience leads, and a stronger NDIS grows from the ground up.", icon: <Leaf className="w-7 h-7" /> },
                { tagline: "Many voices, one community — reshaping the NDIS with heart, dignity, and unity.", icon: <Star className="w-7 h-7" /> },
                { tagline: "When people and providers stand together, the whole sector rises.", icon: <Handshake className="w-7 h-7" /> }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100"
                >
                  <div className="mb-4">{item.icon}</div>
                  <p className="text-gray-700 leading-relaxed italic">"{item.tagline}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced with light gradient */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> What Makes Us Different
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              This Is Not a Marketplace
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              It's a Movement
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-8"></div>
            <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
              We're not another directory or provider platform. We're building a community-driven ecosystem
              that puts lived experience at the heart of everything we do.
            </p>
          </div>

          {/* Differentiators Grid - FIXED: Now 6 items in 2 rows of 3 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100"
              >
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  {item.number}
                </div>

                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-md`}>
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* No One Left Behind Callout */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-3xl p-10">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                    <Shield className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    No One Left Behind
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
                    Our platform ensures that <strong>disabled people lead the conversation</strong>, lived experience
                    is treated as expertise, community replaces isolation, and no one navigates the system alone.
                  </p>

                  {/* Key commitments */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {[
                      { icon: <Users className="w-7 h-7 text-purple-600" />, text: 'Disabled people lead every decision' },
                      { icon: <Lightbulb className="w-7 h-7 text-purple-600" />, text: 'Lived experience drives innovation' },
                      { icon: <Handshake className="w-7 h-7 text-purple-600" />, text: 'Community replaces isolation' },
                      { icon: <Target className="w-7 h-7 text-purple-600" />, text: 'Support accessible at every level' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                        <span className="mr-3 flex-shrink-0">{item.icon}</span>
                        <span className="text-gray-700 font-medium text-left">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/about"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Learn More About Our Mission
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Our Values</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Built on Strong Foundations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every decision we make is guided by our core commitment to community, transparency, and lived experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Sprout className="w-7 h-7 text-white" />,
                title: 'Community First',
                description: 'We prioritize genuine connections and collaborative growth over profit-driven metrics.',
                color: 'from-green-400 to-teal-500'
              },
              {
                icon: <Sparkles className="w-7 h-7 text-white" />,
                title: 'Transparency',
                description: 'Honesty is our standard. We build trust through open communication and accountability.',
                color: 'from-blue-400 to-indigo-500'
              },
              {
                icon: <Handshake className="w-7 h-7 text-white" />,
                title: 'Equality',
                description: 'Participants and providers meet as equals, fostering mutual respect and understanding.',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: <Target className="w-7 h-7 text-white" />,
                title: 'Empowerment',
                description: 'We provide tools, knowledge, and support to help everyone make informed decisions.',
                color: 'from-orange-400 to-red-500'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Quote Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-8 md:p-12 border-2 border-purple-200">
              <div className="text-center">
                <svg className="w-12 h-12 text-purple-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed mb-6 italic">
                  "It only takes one person to spark change — but when a community stands together,
                  transformation becomes unstoppable."
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 font-semibold">Sue Dymond, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Who We Help</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Connecting Participants & Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're seeking support or providing services, The Better Together Network brings the community together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Participants */}
            <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Looking for Support?</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Find verified NDIS service providers in your area. Browse profiles, compare services,
                  and connect with providers who match your needs and goals.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Search 1,500+ verified providers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Post your needs and let providers come to you
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free to join and browse
                  </li>
                </ul>
                <Link
                  to="/find-support"
                  className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Participants
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* For Providers - FIXED HEADING */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Are you providing support?</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Join our network and connect with thousands of NDIS participants. Build your profile,
                  respond to requests, and grow your business.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reach 10,000+ active participants
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Keep 100% of your earnings — no commission
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access training and networking events
                  </li>
                </ul>
                <Link
                  to="/provide-support"
                  className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Providers
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-white">
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
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/find-support"
              className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 group text-lg"
            >
              View All Services
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-orange-300 to-orange-200 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}

                <div className="relative z-10 bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <div className={`bg-gradient-to-br ${step.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200 group text-lg"
            >
              Learn More About Us
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-white">
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
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore All Features
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Vision Section - FIXED: Added 6th point */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Our Vision</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              A Connected, Local, Inclusive NDIS Community
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We are creating a community where no one stands alone — not providers, not participants, not families.
              A community where connection replaces isolation, and collaboration replaces competition.
            </p>
          </div>

          {/* Vision Points - FIXED: Now 6 items in 2 rows of 3 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {visionPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${point.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Trust & Safety</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Your Safety Is Our Priority
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing a secure, trusted platform for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-200 text-center transform hover:-translate-y-2"
              >
                <div className="mb-4 flex justify-center">{indicator.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{indicator.title}</h3>
                <p className="text-gray-600 leading-relaxed">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">Real experiences from real people in The Better Together Network community</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-2xl border-2 border-purple-200">
              {/* Testimonial Content */}
              <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">{testimonials[activeTestimonial].avatar}</div>

                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xl text-gray-700 italic leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].content}"
                </p>

                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-purple-600 font-semibold">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? 'bg-purple-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Flexible Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Start Free, Upgrade Anytime
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. No credit card required to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 shadow-lg border-2 border-green-200">
              <div className="mb-4"><Sprout className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-extrabold text-gray-900 mb-2">$0<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">Perfect to get started</p>
              <ul className="space-y-3 mb-8">
                {['Browse providers', 'Post requests', 'Community access', 'Basic messaging'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/subscription"
                className="block w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
              >
                Get Started Free
              </Link>
            </div>

            {/* Growth Tier */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-2xl border-2 border-purple-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              <div className="mb-4"><TrendingUp className="w-8 h-8 text-purple-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-4xl font-extrabold text-gray-900 mb-2">$49<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Priority support', 'Advanced analytics', 'Featured listing', 'Direct referrals'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/subscription"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
              >
                Start Growing
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200">
              <div className="mb-4"><Star className="w-8 h-8 text-orange-500" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-4xl font-extrabold text-gray-900 mb-2">$99<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">Maximum visibility</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Growth', 'Priority placement', 'Dedicated support', 'Custom branding', 'Performance reports'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/subscription"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
              >
                Go Premium
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/subscription"
              className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 group text-lg"
            >
              View Full Pricing Details
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-flex items-center gap-2">
              <Zap className="w-4 h-4" /> Join Today
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              NDIS Experience?
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join thousands of participants and providers who have already discovered
            the power of meaningful connections through The Better Together Network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/find-support"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                Participants
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              to="/provide-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Providers
            </Link>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 text-sm">
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

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;