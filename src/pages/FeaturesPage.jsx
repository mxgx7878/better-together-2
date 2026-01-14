import { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'provider', 'participant'

  const providerFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Business Profile & Branding',
      description: 'Create a professional business profile with your logo, services, and contact details. Stand out to potential clients.',
      details: ['Custom business logo display', 'Service area mapping', 'NDIS registration showcase', 'Website & contact integration'],
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Job Request Board',
      description: 'Receive service requests directly from participants. Respond to opportunities and grow your client base.',
      details: ['Real-time job notifications', 'Filter by service type', 'Direct response system', 'Secure messaging'],
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Document Library',
      description: 'Access organized resources for onboarding, HR, training, marketing, and sales. Everything you need in one place.',
      details: ['Categorized PDF storage', 'Onboarding templates', 'Training materials', 'Marketing resources'],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Training Videos',
      description: 'Watch educational content, webinars, and tutorials to enhance your skills and stay compliant.',
      details: ['Professional development', 'NDIS compliance training', 'Best practice guides', 'Industry updates'],
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Events & Networking',
      description: 'Access exclusive networking events, workshops, and industry meetups. Build valuable connections.',
      details: ['Eventbrite integration', 'Local networking events', 'Pop-up reminders', 'RSVP management'],
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Featured Listing',
      description: 'Get premium visibility with featured placement. Your business appears in the scrolling showcase.',
      details: ['Homepage visibility', 'Priority in search results', 'Featured badge', 'Enhanced profile views'],
      color: 'from-yellow-500 to-amber-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: 'Community Message Board',
      description: 'Connect with other providers, share insights, ask questions, and collaborate on best practices.',
      details: ['Topic discussions', 'Admin announcements', 'Peer support', 'Industry insights'],
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI Assistant',
      description: 'Get instant answers to NDIS-related questions. Our AI bot helps you navigate policies and procedures.',
      details: ['NDIA policy guidance', '24/7 availability', 'Quick answers', 'Resource recommendations'],
      color: 'from-emerald-500 to-green-600',
    },
  ];

  const participantFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Find Quality Providers',
      description: 'Search and discover verified NDIS service providers in your area. Filter by service type, location, and more.',
      details: ['Advanced search filters', 'Location-based results', 'Service category browse', 'Provider comparisons'],
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'Post Service Requests',
      description: 'Tell providers what you need. Post your requirements and let qualified providers come to you.',
      details: ['Easy request creation', 'Multiple responses', 'Compare offers', 'Choose your provider'],
      color: 'from-teal-500 to-cyan-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Personal Profile',
      description: 'Create your profile with your preferences and needs. Help providers understand how to best support you.',
      details: ['Secure information storage', 'Privacy controls', 'Preference settings', 'Easy updates'],
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Secure Messaging',
      description: 'Communicate safely with providers through our secure message board. No need to share personal contact details.',
      details: ['Protected conversations', 'Message history', 'File sharing', 'Read receipts'],
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Resource Library',
      description: 'Access helpful documents, guides, and information to help you understand and navigate the NDIS.',
      details: ['NDIS guides', 'How-to documents', 'Rights information', 'Support resources'],
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Community Events',
      description: 'Join networking events, information sessions, and community gatherings. Connect with others on similar journeys.',
      details: ['Local meetups', 'Online webinars', 'Support groups', 'Information sessions'],
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI Support Assistant',
      description: 'Get instant answers to your NDIS questions. Our friendly AI assistant is available 24/7 to help.',
      details: ['Plain language answers', 'Always available', 'No waiting', 'Helpful guidance'],
      color: 'from-indigo-500 to-violet-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Direct Admin Support',
      description: 'Need help? Contact our support team directly through the platform. We\'re here to assist you.',
      details: ['Quick response times', 'Friendly support', 'Issue resolution', 'Feedback welcome'],
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const comparisonData = [
    { feature: 'Personal Profile', participant: true, provider: true },
    { feature: 'Business Profile & Branding', participant: false, provider: true },
    { feature: 'Browse Providers', participant: true, provider: false },
    { feature: 'Post Service Requests', participant: true, provider: false },
    { feature: 'Receive Job Requests', participant: false, provider: true },
    { feature: 'Secure Messaging', participant: true, provider: true },
    { feature: 'Document Library', participant: true, provider: true },
    { feature: 'Training Videos', participant: true, provider: true },
    { feature: 'Community Message Board', participant: true, provider: true },
    { feature: 'Events Calendar', participant: true, provider: true },
    { feature: 'AI Assistant', participant: true, provider: true },
    { feature: 'Direct Admin Support', participant: true, provider: true },
    { feature: 'Featured Listing Option', participant: false, provider: true },
    { feature: 'News & Updates', participant: true, provider: true },
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
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              ✨ Powerful Features
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Everything You Need
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              All In One Place
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Whether you're a service provider or someone seeking NDIS support, 
            we've built powerful tools to help you succeed.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-yellow-400">8+</div>
              <div className="text-sm text-gray-300">Provider Features</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold text-yellow-400">8+</div>
              <div className="text-sm text-gray-300">Participant Features</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-gray-300">Secure Platform</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-2">🤖</div>
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-300">AI Support</div>
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

      {/* Filter Tabs */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-2xl p-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Features
              </button>
              <button
                onClick={() => setActiveTab('provider')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'provider'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Providers
              </button>
              <button
                onClick={() => setActiveTab('participant')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'participant'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Participants
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Features Section */}
      {(activeTab === 'all' || activeTab === 'provider') && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  🏢 Provider Portal
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                Features for Service Providers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to grow your NDIS business, connect with participants, 
                and deliver exceptional service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {providerFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Provider CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-10 border border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Grow Your Business?</h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Join hundreds of providers already connecting with NDIS participants through our platform.
                </p>
                <Link
                  to="/subscription"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Provider Plans
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Participant Features Section */}
      {(activeTab === 'all' || activeTab === 'participant') && (
        <section className={`py-20 ${activeTab === 'all' ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  👥 Participant Portal
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                Features for NDIS Participants
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple, accessible tools designed to help you find support, 
                connect with providers, and take control of your NDIS journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {participantFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Participant CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-10 border border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Support?</h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Join thousands of participants who've found quality NDIS providers through our platform.
                </p>
                <Link
                  to="/subscription"
                  className="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {activeTab === 'all' && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Side by Side</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Compare Features</h2>
              <p className="text-xl text-gray-600">See what's included for each user type</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <th className="px-6 py-5 text-left text-white font-bold text-lg">Feature</th>
                      <th className="px-6 py-5 text-center text-white font-bold text-lg">
                        <div className="flex items-center justify-center">
                          <span className="bg-white/20 px-3 py-1 rounded-lg">Participant</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-center text-white font-bold text-lg">
                        <div className="flex items-center justify-center">
                          <span className="bg-white/20 px-3 py-1 rounded-lg">Provider</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                        <td className="px-6 py-4 text-center">
                          {item.participant ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.provider ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dual Subscription Note */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4">
                <span className="text-2xl mr-3">💡</span>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Need Both?</p>
                  <p className="text-sm text-gray-600">Subscribe to both portals and access all features with a dual subscription.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Getting Started</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to get connected
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up for free and create your personal profile. Providers can add their business details too.',
                icon: '📝',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                step: '02',
                title: 'Choose Your Plan',
                description: 'Select a subscription that fits your needs. Start with free or unlock premium features.',
                icon: '✨',
                color: 'from-purple-500 to-pink-600',
              },
              {
                step: '03',
                title: 'Start Connecting',
                description: 'Access your dashboard, post requests, find providers, and join the community.',
                icon: '🤝',
                color: 'from-green-500 to-teal-600',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-purple-300 to-pink-300 -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center">
                  <div className={`bg-gradient-to-br ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-purple-600 mb-2">STEP {item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
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
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🚀 Get Started Today
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Experience
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              These Features?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join our growing community of providers and participants. 
            Start for free or unlock premium features today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                View All Plans
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Talk to Our Team
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm">
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

export default FeaturesPage;