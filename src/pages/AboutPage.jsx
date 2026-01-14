import { useState } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(null);

  const howWeWork = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Tell Us What You Need',
      description: 'Share your requirements and the type of NDIS services you\'re looking for.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'We Match You With Providers',
      description: 'We\'ll show you possible providers and services that match your specific needs.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'We Share Your Details',
      description: 'With your permission, we provide your details to relevant providers and suppliers.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Providers Contact You',
      description: 'Qualified providers will reach out to you with their service offerings.',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const coreValues = [
    {
      title: 'Support',
      description: 'Providing comprehensive support to participants and their families throughout their NDIS journey.',
      detailedDescription: 'We believe everyone deserves access to quality support services. Our platform ensures participants receive personalized assistance at every step.',
      icon: '🤝',
      gradient: 'from-green-500 to-teal-600',
      stats: '10k+ Lives Impacted'
    },
    {
      title: 'Innovation',
      description: 'Leveraging technology to create better connections and improve service delivery.',
      detailedDescription: 'Using cutting-edge technology and AI-driven matching, we\'re revolutionizing how participants find and connect with service providers.',
      icon: '💡',
      gradient: 'from-blue-500 to-indigo-600',
      stats: 'AI-Powered Matching'
    },
    {
      title: 'Empowerment',
      description: 'Empowering participants with choice and control over their disability support.',
      detailedDescription: 'We put participants in the driver\'s seat, giving them the tools and information needed to make informed decisions about their care.',
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-600',
      stats: '100% Choice & Control'
    },
    {
      title: 'Quality',
      description: 'Maintaining the highest standards in provider connections and service excellence.',
      detailedDescription: 'Every provider on our platform is thoroughly vetted and monitored to ensure they meet our rigorous quality standards.',
      icon: '⭐',
      gradient: 'from-purple-500 to-pink-600',
      stats: '98% Satisfaction Rate'
    },
  ];

  const ndisServices = [
    {
      category: 'Daily Living Support',
      services: ['Personal care assistance', 'Meal preparation', 'Household tasks', 'Transport assistance'],
      icon: '🏠',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      category: 'Therapy Services',
      services: ['Occupational therapy', 'Speech pathology', 'Physiotherapy', 'Psychology services'],
      icon: '💪',
      color: 'from-green-500 to-teal-600',
    },
    {
      category: 'Community Participation',
      services: ['Social activities', 'Recreational programs', 'Skill development', 'Community access'],
      icon: '🌟',
      color: 'from-purple-500 to-pink-600',
    },
    {
      category: 'Support Coordination',
      services: ['Plan management', 'Service coordination', 'Capacity building', 'Connection to services'],
      icon: '📋',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const achievements = [
    { number: '10,000+', label: 'Active Participants', icon: '👥' },
    { number: '1,500+', label: 'Registered Providers', icon: '🏢' },
    { number: '50,000+', label: 'Successful Connections', icon: '🤝' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
  ];

  const whyChooseUs = [
    {
      title: 'Verified Providers',
      description: 'All providers on our platform are NDIS registered and thoroughly vetted for quality assurance.',
      icon: '✓',
    },
    {
      title: 'Easy to Use',
      description: 'Our platform is designed with accessibility in mind, making it simple for everyone to navigate.',
      icon: '📱',
    },
    {
      title: 'Local Focus',
      description: 'Find providers in your local area who understand your community and can provide in-person support.',
      icon: '📍',
    },
    {
      title: 'Ongoing Support',
      description: 'We\'re here to help at every step of your journey, from finding providers to ongoing assistance.',
      icon: '💬',
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
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🌟 About NDIS Connect
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Connecting You With
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Quality NDIS Services
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We bridge the gap between NDIS participants and quality service providers, 
            making it easier to find the support you need.
          </p>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">
                  {achievement.number}
                </div>
                <div className="text-sm text-gray-300">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">How We Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Whether You're Ready to Go<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Or Just Starting Your Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you every step of the way
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howWeWork.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howWeWork.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-orange-300 to-orange-200 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}
                
                <div className="relative z-10 bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
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

          {/* CTA after How We Work */}
          <div className="mt-16 text-center">
            <Link
              to="/features"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              See All Features
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guiding principles that drive everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="group relative bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg">
                  🎯
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To create an accessible, user-friendly platform that connects NDIS participants 
                  with quality service providers, fostering meaningful relationships and enabling 
                  participants to exercise choice and control in their support journey.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simplify the provider search process
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Empower informed decision-making
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build lasting connections
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg">
                  🔮
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A future where every NDIS participant can easily find and connect with the right 
                  support services, and where providers can reach those who need their expertise, 
                  creating a thriving ecosystem of care and support across Australia.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Australia's leading NDIS connection platform
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accessible support for all Australians
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community-driven innovation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NDIS Services We Connect */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What We Cover</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              NDIS Services We Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find providers across all NDIS service categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ndisServices.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.category}</h3>
                <ul className="space-y-2">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 text-sm">
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

          {/* Additional Services Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4">
              <span className="text-2xl mr-3">💡</span>
              <div className="text-left">
                <p className="font-bold text-gray-900">And Many More!</p>
                <p className="text-sm text-gray-600">We cover all NDIS-funded service categories. Can't find what you need? Contact us!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-600">
              How we're transforming NDIS connections
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl mr-4">
                  💭
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Challenge We Saw</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    NDIS Connect was born from a simple observation: the process of finding and 
                    connecting with NDIS service providers was unnecessarily complex and time-consuming. 
                    Participants struggled to navigate the system, while quality providers found it 
                    difficult to reach those who needed their services.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl mr-4">
                  🌉
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Building the Bridge</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our platform brings together participants seeking support and providers offering 
                    quality services, creating a transparent marketplace where informed decisions can 
                    be made. We believe in the power of technology to transform lives and make 
                    disability support more accessible for everyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl mr-4">
                  🚀
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Where We Are Today</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    By providing tools for discovery, comparison, and connection, we're helping to build 
                    stronger relationships between participants and providers, ultimately contributing to 
                    better outcomes for the entire NDIS community. Today, we're proud to serve thousands 
                    of participants and providers across Australia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fundamental principles that shape our culture and guide our decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveValue(index)}
                onMouseLeave={() => setActiveValue(null)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-transparent overflow-hidden cursor-pointer"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${value.gradient} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {activeValue === index ? value.detailedDescription : value.description}
                  </p>
                  
                  <div className="flex items-center text-purple-600 font-semibold text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {value.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Why NDIS Connect</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What makes NDIS Connect the preferred choice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
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
              🚀 Join Us Today
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Be Part of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Our Community?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Whether you're a participant seeking support or a provider wanting to make a difference, 
            join our growing community today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                Get Started Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Contact Our Team
            </Link>
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

export default AboutPage;