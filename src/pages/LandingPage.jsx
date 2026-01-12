import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // State for animated counter
  const [counters, setCounters] = useState({
    providers: 0,
    participants: 0,
    connections: 0
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = {
      providers: 1000,
      participants: 5000,
      connections: 10000
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        providers: Math.floor(targets.providers * progress),
        participants: Math.floor(targets.participants * progress),
        connections: Math.floor(targets.connections * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = [
    { 
      id: 1, 
      title: 'NDIS Information Session', 
      date: 'Jan 20, 2026',
      time: '10:00 AM - 12:00 PM',
      location: 'Online Webinar',
      category: 'Workshop',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 2, 
      title: 'Provider Networking Event', 
      date: 'Jan 25, 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'Melbourne Convention Centre',
      category: 'Networking',
      color: 'from-green-500 to-teal-500'
    },
    { 
      id: 3, 
      title: 'Community Support Workshop', 
      date: 'Feb 01, 2026',
      time: '9:00 AM - 11:30 AM',
      location: 'Sydney Community Hub',
      category: 'Community',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Provider Search',
      description: 'Advanced search with filters to find the perfect provider for your needs',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Community Network',
      description: 'Connect with thousands of participants and providers nationwide',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Quality',
      description: 'All providers verified for quality assurance and compliance',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Round-the-clock assistance whenever you need help',
      color: 'bg-gradient-to-br from-pink-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'NDIS Participant',
      content: 'NDIS Connect made finding the right support services so much easier. The platform is intuitive and the support team is incredibly helpful.',
      rating: 5,
      image: '👩‍🦰'
    },
    {
      name: 'Michael Chen',
      role: 'Service Provider',
      content: 'As a provider, this platform has connected me with participants who truly benefit from my services. It\'s a game-changer for our industry.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Emma Williams',
      role: 'Family Member',
      content: 'Finding quality care for my brother was always challenging. NDIS Connect provided transparency and choice that we desperately needed.',
      rating: 5,
      image: '👩'
    }
  ];

  const supportingOrgs = [
    { name: 'NDIS Community', logo: '/uploads/community.jpg' },
    { name: 'Partnering with Success', logo: '/uploads/partners.png' },
    { name: 'Better Together', logo: '/uploads/logo.jpg' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with modern gradient and better typography */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center md:text-left z-10">
              <div className="inline-block mb-4">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  🎉 Connecting Communities
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  Quality NDIS Care
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Empowering participants with choice. Connecting providers with purpose. 
                Building stronger communities together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  to="/subscription"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  Learn More
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400">{counters.providers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-300 mt-1">Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400">{counters.participants.toLocaleString()}+</div>
                  <div className="text-sm text-gray-300 mt-1">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400">{counters.connections.toLocaleString()}+</div>
                  <div className="text-sm text-gray-300 mt-1">Connections</div>
                </div>
              </div>
            </div>

            {/* Right content - Feature highlight cards */}
            <div className="hidden md:block relative z-10">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-3xl">
                      🤝
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Seamless Connection</h3>
                      <p className="text-gray-200">Find and connect with quality providers in minutes, not weeks.</p>
                    </div>
                  </div>
                </div>

                {/* Secondary card */}
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/80">Trusted by</div>
                      <div className="text-2xl font-bold">10,000+ Users</div>
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

      {/* Supporting Organizations - Enhanced */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trusted Partners</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Supporting Organizations</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportingOrgs.map((org, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <img 
                  src={org.logo} 
                  alt={org.name}
                  className="max-h-32 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make your NDIS journey smoother and more connected
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Stay Connected</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Upcoming Events & Workshops
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for workshops, information sessions, and community events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                {/* Event header with gradient */}
                <div className={`bg-gradient-to-r ${event.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      {event.category}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  </div>
                </div>

                {/* Event details */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:scale-105">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="#" 
              className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200 group text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Join our Facebook Community
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from real people in the NDIS Connect community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
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

      {/* CTA Section - Enhanced */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 text-white overflow-hidden">
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
              🚀 Join Today
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
            the power of meaningful connections through NDIS Connect.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/subscription"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                Start Free Trial
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm">
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
              14-day free trial
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