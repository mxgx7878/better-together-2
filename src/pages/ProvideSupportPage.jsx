import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProvideSupportPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const benefits = [
    {
      title: 'Grow Your Client Base',
      description: 'Connect with thousands of NDIS participants actively seeking services in your area.',
      icon: '📈',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'Set Your Own Terms',
      description: 'You decide which clients to work with, your availability, and your service offerings.',
      icon: '🎯',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Professional Profile',
      description: 'Showcase your business, qualifications, services, and build your reputation with reviews.',
      icon: '⭐',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Networking Events',
      description: 'Join exclusive provider networking events, workshops, and community meetups.',
      icon: '🤝',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Resource Library',
      description: 'Access training materials, templates, and resources to grow your business.',
      icon: '📚',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Featured Listings',
      description: 'Get premium visibility with featured placement in search results and homepage showcases.',
      icon: '🌟',
      color: 'from-yellow-500 to-amber-600',
    },
  ];

  const servicesYouCanOffer = [
    {
      category: 'Daily Living Support',
      qualified: false,
      icon: '🏠',
      color: 'from-blue-500 to-indigo-600',
      services: ['Domestic assistance', 'Meal preparation', 'Shopping support', 'Transport', 'Gardening'],
    },
    {
      category: 'Social & Community',
      qualified: false,
      icon: '🌟',
      color: 'from-purple-500 to-pink-600',
      services: ['Community participation', 'Social activities', 'Recreational support', 'Companionship', 'Skill building'],
    },
    {
      category: 'Personal Care',
      qualified: true,
      icon: '💜',
      color: 'from-teal-500 to-green-600',
      services: ['Showering assistance', 'Dressing support', 'Mobility assistance', 'Medication reminders', 'Exercise support'],
    },
    {
      category: 'Allied Health',
      qualified: true,
      icon: '💪',
      color: 'from-orange-500 to-red-500',
      services: ['Occupational therapy', 'Speech pathology', 'Physiotherapy', 'Psychology', 'Behaviour support'],
    },
    {
      category: 'Support Coordination',
      qualified: true,
      icon: '📋',
      color: 'from-cyan-500 to-blue-600',
      services: ['Plan management', 'Service coordination', 'Capacity building', 'Connection services'],
    },
    {
      category: 'Nursing Services',
      qualified: true,
      icon: '🏥',
      color: 'from-rose-500 to-pink-600',
      services: ['Clinical care', 'Wound management', 'Medication management', 'Health monitoring', 'Respite support'],
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Provider Profile',
      description: 'Sign up and build your professional profile. Showcase your business, services, qualifications, and experience.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '02',
      title: 'Get Discovered',
      description: 'Participants search for providers like you. Your profile appears in search results based on location and services.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Respond to Requests',
      description: 'View service requests posted by participants on the job board. Respond to opportunities that match your expertise.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
    },
    {
      step: '04',
      title: 'Connect & Grow',
      description: 'Build relationships with participants. Arrange services directly and grow your client base organically.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
  ];

  const platformFeatures = [
    {
      title: 'Business Profile',
      description: 'Professional listing with your logo, services, qualifications, and contact details.',
      icon: '🏢',
    },
    {
      title: 'Job Request Board',
      description: 'See requests from participants seeking your services and respond directly.',
      icon: '📋',
    },
    {
      title: 'Secure Messaging',
      description: 'Communicate with potential clients through our secure platform.',
      icon: '💬',
    },
    {
      title: 'Document Library',
      description: 'Access templates, guides, and resources for onboarding, HR, and marketing.',
      icon: '📁',
    },
    {
      title: 'Training Videos',
      description: 'Educational content to help you stay compliant and grow your skills.',
      icon: '🎥',
    },
    {
      title: 'Events Calendar',
      description: 'Network with other providers at exclusive events and workshops.',
      icon: '📅',
    },
    {
      title: 'Community Board',
      description: 'Connect with fellow providers, share insights, and learn best practices.',
      icon: '👥',
    },
    {
      title: 'AI Assistant',
      description: 'Get instant answers to NDIS-related questions and policy guidance.',
      icon: '🤖',
    },
  ];

  const isRightForYou = {
    benefits: [
      'Connect with local participants seeking support',
      'Build your professional profile and reputation',
      'Access networking events and community',
      'Get discovered through our search platform',
      'Receive service requests via our job board',
      'Access training resources and materials',
    ],
    considerations: [
      'You manage your own client relationships',
      'Payment arrangements are between you and clients',
      'You\'re responsible for your own compliance',
      'You set your own rates and availability',
      'Premium features require a subscription',
    ],
  };

  const faqs = [
    {
      question: 'Is it free to join as a provider?',
      answer: 'You can create a basic profile for free. Premium features like direct messaging, featured listings, and full resource access require a subscription. We offer different plans to suit providers of all sizes.',
    },
    {
      question: 'Do I need to be NDIS registered?',
      answer: 'Both registered and non-registered providers can join NDIS Connect. We encourage you to display your registration status on your profile so participants can make informed decisions.',
    },
    {
      question: 'How do payments work?',
      answer: 'NDIS Connect is a connection platform – we help you find and connect with participants. Payment arrangements are made directly between you and your clients. We don\'t handle payments or take a cut of your earnings.',
    },
    {
      question: 'What services can I offer?',
      answer: 'You can offer any NDIS-fundable service you\'re qualified to provide. This includes daily living support, therapy services, personal care, support coordination, and more. Some services require specific qualifications.',
    },
    {
      question: 'How do I get more visibility?',
      answer: 'Complete your profile fully, maintain good reviews, stay active in the community, and consider upgrading to a featured listing for premium visibility in search results and homepage showcases.',
    },
    {
      question: 'Can I have both a personal and business profile?',
      answer: 'Yes! If you\'re both a participant seeking support and a provider offering services, you can subscribe to both plans and manage separate profiles.',
    },
  ];

  const testimonials = [
    {
      name: 'Rebecca T.',
      role: 'Support Coordinator',
      business: 'Care Connect Services',
      content: 'NDIS Connect has been fantastic for growing my support coordination business. The job board helps me find clients who need my specific expertise.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'James K.',
      role: 'Occupational Therapist',
      business: 'Independent Practice',
      content: 'As a sole practitioner, I love how easy it is to showcase my services and connect with participants in my local area. Great platform!',
      rating: 5,
      avatar: '👨‍⚕️',
    },
    {
      name: 'Maria S.',
      role: 'Disability Support Worker',
      business: 'Self-Employed',
      content: 'The networking events have been invaluable. I\'ve met other providers, learned so much, and even got referrals through connections I made.',
      rating: 5,
      avatar: '👩',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  🏢 For Providers
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Grow Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  NDIS Business
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Join NDIS Connect and reach thousands of participants looking for quality support services. 
                Build your profile, get discovered, and grow your client base.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/subscription"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Join as Provider
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  See All Features
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1,500+ Providers
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10,000+ Participants
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Australia-wide
                </div>
              </div>
            </div>

            {/* Right side - Stats card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Why Providers Love Us</h3>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center text-2xl mr-4">
                        💰
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">No Commission</div>
                        <div className="text-sm text-gray-300">Keep 100% of your earnings</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center text-2xl mr-4">
                        📈
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">50k+</div>
                        <div className="text-sm text-gray-300">Successful connections made</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl mr-4">
                        ⭐
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">98%</div>
                        <div className="text-sm text-gray-300">Provider satisfaction rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Jump Links */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#benefits" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Benefits</a>
            <a href="#services" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Services</a>
            <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">How It Works</a>
            <a href="#features" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Features</a>
            <a href="#faqs" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">FAQs</a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Make a Difference While Growing Your Business
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            NDIS participants need quality support workers and service providers like you. 
            By joining NDIS Connect, you gain access to a platform designed to help you 
            reach the people who need your services most.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <p className="text-lg text-gray-700 italic">
              "Support work is about empathy, dedication, and responsibility. Your work makes 
              a significant difference to the quality of someone's life."
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Why Join Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Benefits for Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build and grow your NDIS service business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`bg-gradient-to-br ${benefit.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This Right For You */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Before You Join</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Is NDIS Connect Right for You?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform helps providers connect with participants. Here's what you should know.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What You Get */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What You Get</h3>
              </div>
              <ul className="space-y-4">
                {isRightForYou.benefits.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Consider */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  💡
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Things to Consider</h3>
              </div>
              <ul className="space-y-4">
                {isRightForYou.considerations.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 max-w-2xl">
              <span className="text-3xl mr-4">🔗</span>
              <div className="text-left">
                <p className="font-bold text-gray-900">Connection Platform</p>
                <p className="text-sm text-gray-600">NDIS Connect is a connection platform. We help you find participants, but don't handle payments. You keep 100% of what you earn from clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services You Can Offer */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Your Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What Services Can You Offer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with participants seeking a wide range of NDIS services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesYouCanOffer.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`bg-gradient-to-br ${service.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {service.icon}
                </div>
                <div className="flex items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.category}</h3>
                  {service.qualified && (
                    <span className="ml-2 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Qualified
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                Qualified
              </span>
              = Requires specific qualifications or registration
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Get Started</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              How It Works for Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to start connecting with NDIS participants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-purple-300 to-pink-300 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}
                
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  
                  <div className={`bg-gradient-to-br ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Provider Tools</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Platform Features for Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage and grow your NDIS business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Provider Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What Providers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from providers who've grown their business with NDIS Connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-purple-600 font-semibold">{testimonial.business}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything providers need to know
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between"
                >
                  <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                  <svg 
                    className={`w-6 h-6 text-purple-500 flex-shrink-0 transform transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeQuestion === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🚀 Ready to Grow?
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Start Connecting With
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Participants Today
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join 1,500+ providers already growing their NDIS business through NDIS Connect. 
            Build your profile and start receiving enquiries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Join as Provider
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/find-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              I Need Support
            </Link>
          </div>

          <p className="mt-8 text-gray-300 text-sm">
            Looking for support services? <Link to="/find-support" className="text-yellow-400 font-semibold hover:underline">Find providers instead →</Link>
          </p>
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

export default ProvideSupportPage;