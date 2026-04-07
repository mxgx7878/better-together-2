import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, FileText, MessageCircle, Briefcase, Calendar, Shield, Heart, Handshake, Sprout, Star, Lightbulb, Target, CheckCircle, MapPin, Building2, BookOpen, User, Zap, Lock, Globe, Compass, Brain, Eye, TrendingUp, Home, Sparkles, Link2, Laptop, Megaphone, Clipboard, Scale, Wrench, Rocket } from '../../components/Icons';

const FindSupportPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeService, setActiveService] = useState(null);

  // The 7 key supports from WebsiteDoc.docx
  const participantSupports = [
    {
      icon: <Clipboard className="w-10 h-10 text-white" />,
      title: 'Support with Understanding and Coordinating Your Disability Service Plan',
      description: 'Get help making sense of your plan, using your funding effectively, and connecting with the right supports at the right time.',
      color: 'from-blue-500 to-indigo-600',
      details: [
        'Understanding your funding categories',
        'Plan implementation strategies',
        'Budget management guidance',
        'Service coordination support',
      ]
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-white" />,
      title: 'Clear Information, Guidance, and Practical Support',
      description: 'Access easy-to-understand information about how the Disability Service works, what your rights are, and how to make informed decisions about your supports.',
      color: 'from-purple-500 to-pink-600',
      details: [
        'Disability Service rules explained simply',
        'Your rights and responsibilities',
        'Decision-making frameworks',
        'Plain language resources',
      ]
    },
    {
      icon: <Shield className="w-10 h-10 text-white" />,
      title: 'Advocacy and Help Navigating Challenges',
      description: 'Receive guidance from people who understand Disability Service rules, processes, and pathways — and who can help you speak up, resolve issues, and protect your rights.',
      color: 'from-teal-500 to-cyan-600',
      details: [
        'Issue resolution support',
        'Appeals and reviews assistance',
        'Rights protection',
        'Complaint handling guidance',
      ]
    },
    {
      icon: <Handshake className="w-10 h-10 text-white" />,
      title: 'Peer Support and Lived-Experience Coaching',
      description: 'Connect with individuals and families who have walked a similar path. Gain encouragement, insight, and practical strategies grounded in real-life experience.',
      color: 'from-green-500 to-emerald-600',
      details: [
        'Peer mentoring programs',
        'Shared experience groups',
        'Community connections',
        'Practical wisdom from others',
      ]
    },
    {
      icon: <Search className="w-10 h-10 text-white" />,
      title: 'Connections with Trusted, Local Disability Service Providers',
      description: 'Find reliable, experienced providers who align with your needs, values, and goals — without the overwhelm of searching alone.',
      color: 'from-orange-500 to-red-500',
      details: [
        'Verified provider network',
        'Local service matching',
        'Quality-focused connections',
        'Values-aligned partnerships',
      ]
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: 'Access to Specialists and Disability Sector Expertise',
      description: 'Receive support from people who understand disability, the Disability Service, and the realities of everyday life. Get reassurance, clarity, and practical advice when you need it most.',
      color: 'from-indigo-500 to-purple-600',
      details: [
        'Expert consultations',
        'Specialist referrals',
        'Professional guidance',
        'Evidence-based support',
      ]
    },
    {
      icon: <Heart className="w-10 h-10 text-white" />,
      title: 'A Safe, Supportive Community',
      description: 'Join a space where participants and families can share experiences, ask questions, and feel supported by others who understand the journey.',
      color: 'from-pink-500 to-rose-600',
      details: [
        'Welcoming community space',
        'Shared learning opportunities',
        'Judgment-free support',
        'Collective strength',
      ]
    },
    {
      icon: <Sprout className="w-10 h-10 text-white" />,
      title: 'Support for Ethical, Sustainable Disability Service Providers',
      description: 'Access guidance, tools, and community so you can deliver high-quality, person-centred supports while running a healthy, values-driven business. Business and practice mentoring, ethical service design and improvement, local collaboration and referral pathways.',
      color: 'from-pink-500 to-rose-600',
      details: [

      ]
    },
    {
      icon: <Megaphone className="w-10 h-10 text-white" />,
      title: 'Collective Voice and Systems Change',
      description: 'Be part of a movement that speaks up for a fair, accessible, and community-driven Disability Service — led by people with lived experience. Community consultations and feedback forums Policy input and submissions Campaigns to protect choice, control, and local providers',
      color: 'from-pink-500 to-rose-600',
      details: [

      ]
    },
  ];
const services = [
  {
    title: 'Disability Service Service Providers (Registered & Unregistered)',
    icon: <Building2 className="w-7 h-7 text-white" />,
    color: 'from-blue-500 to-indigo-600',
    examples: [
      'Registered Disability Service providers delivering support across all registration groups',
      'Unregistered providers offering flexible, person-centred services',
      'Sole traders and micro-providers with niche or localised supports',
      'Multidisciplinary teams partnering with other businesses to deliver wraparound care'
    ],
  },
  {
    title: 'Professional & Legal Services',
    icon: <Scale className="w-7 h-7 text-white" />,
    color: 'from-purple-500 to-pink-600',
    examples: [
      'Business lawyers (Disability Service compliance, contracts, disputes)',
      'Commercial / employment lawyers',
      'Trademark / IP lawyers',
      'Notary and document certification services'
    ],
  },
  {
    title: 'Financial, Accounting & Insurance Services',
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    color: 'from-teal-500 to-green-600',
    examples: [
      'Accountants and bookkeepers (Disability Service-ready reporting, payroll, BAS)',
      'Financial planners and business advisors',
      'Insurance brokers (public liability, professional indemnity, workers comp)',
      'Audit and compliance review services'
    ],
  },
  {
    title: 'HR, Recruitment & Workforce Development',
    icon: <Users className="w-7 h-7 text-white" />,
    color: 'from-orange-500 to-red-500',
    examples: [
      'HR specialists (policies, performance management, workplace culture)',
      'Recruitment agencies and temp staffing services',
      'Training and RTOs (Disability Service practice standards, safeguarding, clinical skills)',
      'Workplace health & safety consultants'
    ],
  },
  {
    title: 'Technology, Systems & Admin Support',
    icon: <Laptop className="w-7 h-7 text-white" />,
    color: 'from-cyan-500 to-blue-600',
    examples: [
      'Practice management and CRM software providers',
      'IT support, cybersecurity, and data privacy specialists',
      'Virtual assistants and admin support services',
      'Website development, hosting, and tech integration'
    ],
  },
  {
    title: 'Marketing, Branding & Communications',
    icon: <Megaphone className="w-7 h-7 text-white" />,
    color: 'from-yellow-500 to-amber-600',
    examples: [
      'Marketing agencies and consultants (Disability Service-savvy)',
      'Graphic designers and brand strategists',
      'Copywriters and content creators (plain language, accessibility-focused)',
      'Social media management and digital advertising services'
    ],
  },
  {
    title: 'Clinical, Equipment & Workplace Services',
    icon: <Wrench className="w-7 h-7 text-white" />,
    color: 'from-indigo-500 to-blue-600',
    examples: [
      'Medical and allied health equipment suppliers',
      'Assistive technology and home modification providers',
      'Fleet and vehicle fit-out services (accessible vehicles)',
      'Workplace fit-out, ergonomic and accessibility consultants'
    ],
  },
  {
    title: 'Specialist Disability & Behaviour Support Services',
    icon: <Brain className="w-7 h-7 text-white" />,
    color: 'from-pink-500 to-purple-600',
    examples: [
      'Behaviour support practitioners and consulting teams',
      'Complex needs and dual-diagnosis specialists',
      'Positive behaviour support training for provider staff',
      'Clinical oversight and quality-of-care advisory services'
    ],
  }
];


  // How It Works - From WebsiteDoc.docx
  const howItWorks = [
    {
      step: '01',
      title: 'Join the Community',
      description: 'Sign up for free or choose a subscription that gives you access to advocates, experts, and additional support.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Tell Us What You Need',
      description: 'Use the message board or job board to share what you\'re looking for — whether it\'s a support worker, therapist, plan guidance, or help understanding Disability Service processes.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '03',
      title: 'Connect With Trusted Local Providers',
      description: 'You\'ll be matched with reputable providers in your area who align with your needs, values, and goals.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
    },
    {
      step: '04',
      title: 'Access Guidance & Advocacy',
      description: 'Depending on your subscription, you can connect with: Disability Service-experienced advocates, people who can explain your plan, experts who can guide you through reviews, and legal teams if things escalate to the AAT.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
    {
      step: '05',
      title: 'Feel Supported Every Step of the Way',
      description: 'You\'re never left to navigate the Disability Service alone. Our community, advocates, and providers are here to help you make informed decisions and feel confident in your rights.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-600',
    },
  ];

  const benefits = [
    {
      title: 'Verified Providers',
      description: 'All providers on our platform are verified and many are Disability Service registered, giving you peace of mind.',
      icon: <CheckCircle className="w-7 h-7 text-white" />,
    },
    {
      title: 'Choice & Control',
      description: 'You decide who provides your support. Browse profiles, compare options, and choose what\'s right for you.',
      icon: <Target className="w-7 h-7 text-white" />,
    },
    {
      title: 'Local Connections',
      description: 'Find providers in your local community who understand your area and can provide in-person support.',
      icon: <MapPin className="w-7 h-7 text-white" />,
    },
    {
      title: 'Secure Messaging',
      description: 'Communicate safely through our platform. No need to share personal contact details until you\'re ready.',
      icon: <Lock className="w-7 h-7 text-white" />,
    },
    {
      title: 'Free to Join',
      description: 'Create your profile and start browsing providers at no cost. Upgrade anytime for premium features.',
      icon: <Sparkles className="w-7 h-7 text-white" />,
    },
    {
      title: 'Community Support',
      description: 'Join a supportive community, attend networking events, and connect with others on similar journeys.',
      icon: <Handshake className="w-7 h-7 text-white" />,
    },
  ];

  const faqs = [
    {
      question: 'Is The Better Together Network free to use?',
      answer: 'Yes! You can create a profile and browse providers for free. We offer premium subscriptions with additional features like direct messaging, advocacy support, and advanced guidance.',
    },
    {
      question: 'How do I find the right provider?',
      answer: 'Use our search filters to find providers by service type, location, and specialisation. You can also post your requirements on our message board and let providers reach out to you.',
    },
    {
      question: 'Are the providers verified?',
      answer: 'We encourage all providers to display their Disability Service registration status and qualifications on their profiles. We recommend verifying credentials before engaging any provider.',
    },
    {
      question: 'How do payments work?',
      answer: 'The Better Together Network is a connection platform only. We help you find and connect with providers, but payment arrangements are made directly between you and your chosen provider.',
    },
    {
      question: 'Can I use my Disability Service funding?',
      answer: 'Yes! Once you connect with a provider through our platform, you can arrange to use your Disability Service funding directly with them based on your plan management type.',
    },
    {
      question: 'What if I need help using the platform?',
      answer: 'Our support team is here to help. You can contact us through the platform, use our AI assistant for quick answers, or attend one of our community events for guidance.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Disability Service Participant',
      content: 'The Better Together Network made it so easy to Participants workers in my area. I love being able to see provider profiles and choose who I want to work with.',
      rating: 5,
      avatar: <User className="w-8 h-8 text-white" />,
    },
    {
      name: 'David L.',
      role: 'Parent & Carer',
      content: 'Finding the right therapy services for my son was overwhelming until we found The Better Together Network. The search filters helped us find exactly what we needed.',
      rating: 5,
      avatar: <User className="w-8 h-8 text-white" />,
    },
    {
      name: 'Michelle K.',
      role: 'Support Coordinator',
      content: 'I recommend The Better Together Network to all my clients. It gives them the tools to explore their options and make informed choices about their support.',
      rating: 5,
      avatar: <User className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="bg-teal-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-flex items-center gap-1.5">
                  <Search className="w-4 h-4" /> Participants
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Support. Clarity.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  Connection.
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-6 text-gray-200 leading-relaxed">
                Navigating the disability services can feel overwhelming — but you don't have to do it alone.
              </p>

              <p className="text-lg mb-8 text-gray-200 leading-relaxed">
                Our platform is designed to give participants and families access to clear information, trusted providers, and practical guidance from people who genuinely care about your wellbeing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/subscription"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  to="/features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  See How It Works
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free to join
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1,500+ Providers
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Australia-wide
                </div>
              </div>
            </div>

            {/* Right side - Feature card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">What are you looking for?</h3>
                  <div className="space-y-4">
                    {['Daily Living Support', 'Therapy Services', 'Social & Community', 'Transport Assistance'].map((item, index) => (
                      <div key={index} className="flex items-center bg-white/10 rounded-xl px-4 py-3 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20 text-center">
                    <p className="text-sm text-gray-300 mb-3">Join 10,000+ participants finding support</p>
                    <div className="flex justify-center -space-x-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center border-2 border-white">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      ))}
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
            <a href="#what-we-offer" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">What We Offer</a>
            <a href="#services" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Services</a>
            <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#benefits" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Benefits</a>
            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Success Stories</a>
            <a href="#faqs" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">FAQs</a>
          </div>
        </div>
      </section>

      {/* What We Offer Section - The 7 Key Supports */}
      <section id="what-we-offer" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">For Participants & Families</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our goal is to empower you with the knowledge, confidence, and connections you need to live your life with choice, control, and dignity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participantSupports.map((support, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${support.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${support.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    {support.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{support.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{support.description}</p>

                  <ul className="space-y-2">
                    {support.details.slice(0, activeService === index ? 4 : 2).map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-8 border border-teal-200 max-w-4xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Every person with disability deserves trusted local support</strong> — and every family deserves clarity, community, and a place to turn when things get complex.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What You Can Find</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Here are the businesses we are encouraging
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every great disability service needs a strong support crew. Disability Service providers and the businesses that stand behind them — join a network designed to amplify your impact and strengthen the whole sector. It really does take a community, and we need you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {service.icon}
                  </div>

                  <div className="flex items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    {service.qualified && (
                      <span className="ml-2 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Qualified
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                  <ul className="space-y-2">
                    {service.examples.slice(0, 3).map((example, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* How It Works */}
<section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
  {/* Subtle background decoration */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-20">
      <span className="inline-block px-4 py-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 rounded-full mb-4">Simple Process</span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-5 tracking-tight">
        How It Works for Participants & Families
      </h2>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
        Supportive. Safe. Easy to Navigate.
      </p>
    </div>

    {/* Timeline layout */}
    <div className="relative">
      {/* Connecting line */}
      <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-200 via-blue-200 via-purple-200 to-pink-200"></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
        {howItWorks.map((item, index) => (
          <div key={index} className="relative group">
            <div className="relative z-10 bg-white rounded-2xl p-6 pt-16 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 text-center group-hover:-translate-y-1 group-hover:border-transparent">

              {/* Floating step badge on timeline */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full shadow-md border-2 border-gray-100 flex items-center justify-center group-hover:border-teal-400 transition-colors duration-300">
                    <span className="text-sm font-extrabold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">{item.step}</span>
                  </div>
                </div>
              </div>

              {/* Icon */}
              <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mx-auto mb-5 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Closing Statement */}
    <div className="mt-20 text-center">
      <div className="relative inline-block max-w-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl blur-sm opacity-10"></div>
        <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong className="text-gray-900">This process is designed to be simple, safe, and empowering</strong> — giving you real choice, real control, and real support.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              The Better Together Network Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to giving you choice and control over your support journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from participants who've found their support through The Better Together Network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
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
            <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about finding support
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
                    className={`w-6 h-6 text-teal-500 flex-shrink-0 transform transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`}
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
      <section className="py-20 bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="bg-teal-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide inline-flex items-center gap-1.5">
              <Rocket className="w-4 h-4" /> Start Your Search
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Find
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Your Support Team?
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Disability‑sector service participants who've found quality support through The Better Together Network. It's free to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Create Free Account
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              to="/provide-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              I'm a Provider
            </Link>
          </div>

          <p className="mt-8 text-gray-300 text-sm">
            Are you a service provider? <Link to="/provide-support" className="text-teal-400 font-semibold hover:underline">Join as a provider instead →</Link>
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

export default FindSupportPage;