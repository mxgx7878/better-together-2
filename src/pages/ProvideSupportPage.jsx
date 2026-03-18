import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProvideSupportPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const benefits = [
    {
      title: 'Connections with Trusted disability services Providers',
      description: 'Build genuine partnerships with providers who understand the sector\'s realities. Share referrals, collaborate on services, and strengthen your network with people who truly "get" the disability services.',
      icon: '🤝',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Access to Participants Seeking Services',
      description: 'Connect with individuals and families actively looking for reliable, local supports. Increase your visibility and reach the right people at the right time.',
      icon: '👥',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Ethical, Sustainable Client Referrals',
      description: 'Receive direct referrals from participants who are searching for the services you offer. Grow your client base in a way that is transparent, participant-led, and aligned with best practice.',
      icon: '🌱',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'Local Networking and Community Events',
      description: 'Join in-person gatherings designed to help you exchange knowledge, share experiences, and build a strong professional community. These events foster collaboration, not competition.',
      icon: '📅',
      color: 'from-orange-500 to-amber-600',
    },
    {
      title: 'Peer Support, Sector Guidance, and Leadership',
      description: 'Access a community of peers who can offer insights, encouragement, and practical advice. Learn from others who have navigated similar challenges and are committed to raising sector standards.',
      icon: '💪',
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Access to Experts and Specialist Advice',
      description: 'Connect with industry professionals who can support you with business strategy, compliance and quality systems, operational efficiency, workforce development, and growth planning.',
      icon: '🎯',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Workplace Tools and Practical Resources',
      description: 'Use tools designed to help you work smarter, stay compliant, and deliver services aligned with the disability services Act, its objects, and its principles. Reduce administrative burden and streamline your operations.',
      icon: '🛠️',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Thought Leadership and Sector Education',
      description: 'Stay informed with guidance that deepens your understanding of disability rights, lived experience, and the evolving disability services landscape. Build confidence in your practice and stay ahead of sector changes.',
      icon: '📚',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Cost-Effective Business Support Solutions',
      description: 'Access practical, affordable tools and human support that help reduce operational costs and maximise profitability. We connect you with real people who can help you manage your business more efficiently — not automated systems that leave you guessing.',
      icon: '💰',
      color: 'from-emerald-500 to-green-600',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Join the Community',
      description: 'Sign up and choose the subscription level that suits your business — from free community access to full visibility and referral support.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '02',
      title: 'Create Your Provider Profile',
      description: 'Share who you are, what you offer, and the values that guide your work. Participants and other providers use this to understand your strengths and approach.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Connect With Local Providers',
      description: 'Use our message board and networking events to build relationships, collaborate, and strengthen your local referral pathways.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
    },
    {
      step: '04',
      title: 'Access Referrals & Opportunities',
      description: 'Depending on your subscription, you can receive client referrals, advertising placements, and direct connections with participants seeking your services.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
    {
      step: '05',
      title: 'Grow With Community Support',
      description: 'Engage with experts, advocates, and other providers who can help you improve quality, streamline operations, and build a sustainable, values-driven business.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-yellow-500 to-amber-600',
    },
  ];

const servicesYouCanOffer = [
  {
    category: 'disability services Service Providers (Registered & Unregistered)',
    qualified: false,
    icon: '🏢',
    color: 'from-blue-500 to-indigo-600',
    services: [
      'Registered disability services providers delivering support across all registration groups',
      'Unregistered providers offering flexible, person-centred services',
      'Sole traders and micro-providers with niche or localised supports',
      'Multidisciplinary teams partnering with other businesses to deliver wraparound care'
    ],
  },
  {
    category: 'Professional & Legal Services',
    qualified: false,
    icon: '⚖️',
    color: 'from-purple-500 to-pink-600',
    services: [
      'Business lawyers (disability services compliance, contracts, disputes)',
      'Commercial / employment lawyers',
      'Trademark / IP lawyers',
      'Notary and document certification services'
    ],
  },
  {
    category: 'Financial, Accounting & Insurance Services',
    qualified: true,
    icon: '💰',
    color: 'from-teal-500 to-green-600',
    services: [
      'Accountants and bookkeepers (disability services-ready reporting, payroll, BAS)',
      'Financial planners and business advisors',
      'Insurance brokers (public liability, professional indemnity, workers comp)',
      'Audit and compliance review services'
    ],
  },
  {
    category: 'HR, Recruitment & Workforce Development',
    qualified: true,
    icon: '👥',
    color: 'from-orange-500 to-red-500',
    services: [
      'HR specialists (policies, performance management, workplace culture)',
      'Recruitment agencies and temp staffing services',
      'Training and RTOs (disability services practice standards, safeguarding, clinical skills)',
      'Workplace health & safety consultants'
    ],
  },
  {
    category: 'Technology, Systems & Admin Support',
    qualified: true,
    icon: '💻',
    color: 'from-cyan-500 to-blue-600',
    services: [
      'Practice management and CRM software providers',
      'IT support, cybersecurity, and data privacy specialists',
      'Virtual assistants and admin support services',
      'Website development, hosting, and tech integration'
    ],
  },
  {
    category: 'Marketing, Branding & Communications',
    qualified: true,
    icon: '📣',
    color: 'from-yellow-500 to-amber-600',
    services: [
      'Marketing agencies and consultants (disability services-savvy)',
      'Graphic designers and brand strategists',
      'Copywriters and content creators (plain language, accessibility-focused)',
      'Social media management and digital advertising services'
    ],
  },
  {
    category: 'Clinical, Equipment & Workplace Services',
    qualified: true,
    icon: '🛠️',
    color: 'from-indigo-500 to-blue-600',
    services: [
      'Medical and allied health equipment suppliers',
      'Assistive technology and home modification providers',
      'Fleet and vehicle fit-out services (accessible vehicles)',
      'Workplace fit-out, ergonomic and accessibility consultants'
    ],
  },
  {
    category: 'Specialist Disability & Behaviour Support Services',
    qualified: true,
    icon: '🧠',
    color: 'from-pink-500 to-purple-600',
    services: [
      'Behaviour support practitioners and consulting teams',
      'Complex needs and dual-diagnosis specialists',
      'Positive behaviour support training for provider staff',
      'Clinical oversight and quality-of-care advisory services'
    ],
  }
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
      description: 'Get instant answers to disability services-related questions and policy guidance.',
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
      question: 'Do I need to be disability services registered?',
      answer: 'Both registered and non-registered providers can join The Better Together Network. We encourage you to display your registration status on your profile so participants can make informed decisions.',
    },
    {
      question: 'How do payments work?',
      answer: 'The Better Together Network is a connection platform — we help you find and connect with participants. Payment arrangements are made directly between you and your clients. We don\'t handle payments or take a cut of your earnings.',
    },
    {
      question: 'What services can I offer?',
      answer: 'You can offer any disability services-fundable service you\'re qualified to provide. This includes daily living support, therapy services, personal care, support coordination, and more. Some services require specific qualifications.',
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
      content: 'The Better Together Network has been fantastic for growing my support coordination business. The job board helps me find clients who need my specific expertise.',
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
                Connect. Collaborate.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  Grow. Thrive.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Running a disability services business can feel isolating — especially when you're juggling compliance, service delivery, staffing, and participant needs. But you don't have to do it alone.
              </p>
              
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                Our platform creates a supportive, collaborative environment where providers can build meaningful relationships, access practical tools, and grow their businesses with confidence.
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
          <p className="text-xl text-gray-600 leading-relaxed">
            We bring together real people, real expertise, and real opportunities so you can focus on what matters most: <strong>delivering high-quality, person-centred support.</strong>
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support designed to help disability services providers build sustainable, values-driven businesses
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
              Is The Better Together Network Right for You?
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
                <p className="text-sm text-gray-600">The Better Together Network is a connection platform. We help you find participants, but don't handle payments. You keep 100% of what you earn from clients.</p>
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
              Connect with participants seeking a wide range of disability services.
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
              Simple. Clear. Community-led.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
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

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 italic">
              This process keeps things simple while giving you the tools, connections, and visibility you need to thrive.
            </p>
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
              Everything you need to manage and grow your disability services business.
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
              Hear from providers who've grown their business with The Better Together Network.
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
            Join 1,500+ providers already growing their disability services business through The Better Together Network. 
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