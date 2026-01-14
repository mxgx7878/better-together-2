import { useState } from 'react';
import { Link } from 'react-router-dom';

const FindSupportPage = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      title: 'Daily Living Support',
      description: 'Get help with everyday tasks around your home including cooking, cleaning, laundry, and household organisation.',
      icon: '🏠',
      color: 'from-blue-500 to-indigo-600',
      examples: ['Meal preparation', 'Housework & cleaning', 'Laundry & ironing', 'Shopping assistance', 'Home organisation'],
    },
    {
      title: 'Social & Community',
      description: 'Connect with support workers who can help you participate in social activities and community events.',
      icon: '🌟',
      color: 'from-purple-500 to-pink-600',
      examples: ['Community outings', 'Recreational activities', 'Social events', 'Hobby support', 'Companionship'],
    },
    {
      title: 'Personal Care',
      description: 'Find qualified support workers to assist with personal care needs in a respectful and dignified manner.',
      icon: '💜',
      color: 'from-teal-500 to-green-600',
      examples: ['Showering assistance', 'Dressing support', 'Mobility assistance', 'Exercise support', 'Medication reminders'],
      qualified: true,
    },
    {
      title: 'Therapy Services',
      description: 'Connect with registered allied health professionals for specialised therapy and support services.',
      icon: '💪',
      color: 'from-orange-500 to-red-500',
      examples: ['Occupational therapy', 'Speech pathology', 'Physiotherapy', 'Psychology services', 'Behaviour support'],
      qualified: true,
    },
    {
      title: 'Transport',
      description: 'Find providers who can help you get to appointments, activities, and anywhere you need to go.',
      icon: '🚗',
      color: 'from-cyan-500 to-blue-600',
      examples: ['Medical appointments', 'Shopping trips', 'Social activities', 'Community events', 'Work or education'],
    },
    {
      title: 'Support Coordination',
      description: 'Connect with experienced coordinators who can help you navigate and manage your NDIS plan effectively.',
      icon: '📋',
      color: 'from-yellow-500 to-amber-600',
      examples: ['Plan management', 'Service coordination', 'Provider connections', 'Goal planning', 'Capacity building'],
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up for free and tell us about yourself, your needs, and the type of support you\'re looking for.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Browse Providers',
      description: 'Search through verified providers in your area. Filter by service type, location, and specialisation.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '03',
      title: 'Post Your Request',
      description: 'Share what you\'re looking for on our message board. Let qualified providers come to you with their offerings.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
    },
    {
      step: '04',
      title: 'Connect & Choose',
      description: 'Receive responses from providers, review their profiles, and connect with those who best match your needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    {
      title: 'Verified Providers',
      description: 'All providers on our platform are verified and many are NDIS registered, giving you peace of mind.',
      icon: '✓',
    },
    {
      title: 'Choice & Control',
      description: 'You decide who provides your support. Browse profiles, compare options, and choose what\'s right for you.',
      icon: '🎯',
    },
    {
      title: 'Local Connections',
      description: 'Find providers in your local community who understand your area and can provide in-person support.',
      icon: '📍',
    },
    {
      title: 'Secure Messaging',
      description: 'Communicate safely through our platform. No need to share personal contact details until you\'re ready.',
      icon: '🔒',
    },
    {
      title: 'Free to Join',
      description: 'Create your profile and start browsing providers at no cost. Upgrade anytime for premium features.',
      icon: '💫',
    },
    {
      title: 'Community Support',
      description: 'Join a supportive community, attend networking events, and connect with others on similar journeys.',
      icon: '🤝',
    },
  ];

  const faqs = [
    {
      question: 'Is NDIS Connect free to use?',
      answer: 'Yes! You can create a profile and browse providers for free. We offer premium subscriptions with additional features like direct messaging and advanced search filters.',
    },
    {
      question: 'How do I find the right provider?',
      answer: 'Use our search filters to find providers by service type, location, and specialisation. You can also post your requirements on our message board and let providers reach out to you.',
    },
    {
      question: 'Are the providers verified?',
      answer: 'We encourage all providers to display their NDIS registration status and qualifications on their profiles. We recommend verifying credentials before engaging any provider.',
    },
    {
      question: 'How do payments work?',
      answer: 'NDIS Connect is a connection platform only. We help you find and connect with providers, but payment arrangements are made directly between you and your chosen provider.',
    },
    {
      question: 'Can I use my NDIS funding?',
      answer: 'Yes! Once you connect with a provider through our platform, you can arrange to use your NDIS funding directly with them based on your plan management type.',
    },
    {
      question: 'What if I need help using the platform?',
      answer: 'Our support team is here to help. You can contact us through the platform, use our AI assistant for quick answers, or attend one of our community events for guidance.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'NDIS Participant',
      content: 'NDIS Connect made it so easy to find support workers in my area. I love being able to see provider profiles and choose who I want to work with.',
      rating: 5,
      avatar: '👩',
    },
    {
      name: 'David L.',
      role: 'Parent & Carer',
      content: 'Finding the right therapy services for my son was overwhelming until we found NDIS Connect. The search filters helped us find exactly what we needed.',
      rating: 5,
      avatar: '👨',
    },
    {
      name: 'Michelle K.',
      role: 'Support Coordinator',
      content: 'I recommend NDIS Connect to all my clients. It gives them the tools to explore their options and make informed choices about their support.',
      rating: 5,
      avatar: '👩‍💼',
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
                <span className="bg-teal-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  🔍 Find Support
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Find Quality
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  NDIS Providers
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Connect with verified service providers in your area. 
                Whether you need daily support, therapy services, or community participation – 
                we'll help you find the right match.
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
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20 text-center">
                    <p className="text-sm text-gray-300 mb-3">Join 10,000+ participants finding support</p>
                    <div className="flex justify-center -space-x-2">
                      {['👩', '👨', '👩‍🦰', '👨‍🦱', '👩‍🦳'].map((avatar, i) => (
                        <div key={i} className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center text-lg border-2 border-white">
                          {avatar}
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
            <a href="#services" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Services</a>
            <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#benefits" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Benefits</a>
            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">Success Stories</a>
            <a href="#faqs" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">FAQs</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">What You Can Find</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Find the Right Services for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse providers across all NDIS service categories. Choose the support that matches your goals and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
                    {service.examples.slice(0, activeService === index ? 5 : 3).map((example, idx) => (
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
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              How NDIS Connect Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Finding the right support has never been easier. Four simple steps to connect with quality providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-teal-300 to-blue-300 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}
                
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
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

          {/* Important Note */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 max-w-2xl">
              <span className="text-3xl mr-4">💡</span>
              <div className="text-left">
                <p className="font-bold text-gray-900">Connection Platform</p>
                <p className="text-sm text-gray-600">NDIS Connect helps you discover and connect with providers. Payment arrangements are made directly between you and your chosen provider using your NDIS funding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              The NDIS Connect Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to giving you choice and control over your support journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-md">
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
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from participants who've found their support through NDIS Connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center text-2xl mr-4">
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
      <section id="faqs" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about finding support
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start">
                  <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-11">{faq.answer}</p>
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
            <span className="bg-teal-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🚀 Start Your Search
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Find
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Your Support Team?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join thousands of NDIS participants who've found quality support through NDIS Connect. It's free to get started.
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