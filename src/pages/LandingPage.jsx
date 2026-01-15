import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // State for animated counter
  const [counters, setCounters] = useState({
    providers: 0,
    participants: 0,
    connections: 0,
    satisfaction: 0
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = {
      providers: 1500,
      participants: 10000,
      connections: 50000,
      satisfaction: 98
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        providers: Math.floor(targets.providers * progress),
        participants: Math.floor(targets.participants * progress),
        connections: Math.floor(targets.connections * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const missionTaglines = [
    "Where lived experience leads, and a stronger NDIS grows from the ground up.",
    "Many voices, one community — reshaping the NDIS with heart, dignity, and unity.",
    "Rooted in lived experience, rising together to shape a better NDIS.",
    "When people and providers stand together, the whole sector rises.",
    "A community of voices becoming the change the NDIS was meant to hold.",
    "Where connection becomes strength, and strength becomes collective change.",
    "Lived experience at the centre, community at the heart, change from the ground up.",
    "Together, we grow the NDIS into the community it was always meant to be.",
    "Uniting voices, lifting standards, and shaping the future — together."
  ];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const taglineTimer = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % missionTaglines.length);
    }, 4000);
    return () => clearInterval(taglineTimer);
  }, []);

  const whyDifferent = [
    {
      number: '01',
      title: 'Led by Disabled People — Not Corporations',
      description: 'Most platforms are built about disabled people. Ours is built by disabled people. Lived experience shapes every decision, every feature, every connection.',
      icon: '👥',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Community First, Not Profit First',
      description: 'We prioritise connection, safety, and transparency over sales funnels and corporate metrics. Our model is built to strengthen the community — not extract from it.',
      icon: '❤️',
      color: 'from-pink-500 to-rose-600',
    },
    {
      number: '03',
      title: 'Ground-Up Approach, Not Top-Down System',
      description: 'We don\'t impose solutions from above. We listen to the community, respond to real needs, and build tools that reflect the lived realities of participants, families, and small providers.',
      icon: '🌱',
      color: 'from-green-500 to-teal-600',
    },
    {
      number: '04',
      title: 'Participants and Providers Meet as Equals',
      description: 'Most platforms separate the two. We bring them together — safely, ethically, and with clear boundaries — because real change happens when everyone is in the same room.',
      icon: '🤝',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      number: '05',
      title: 'Support Beyond Services',
      description: 'We don\'t just help people find supports. We help them understand the NDIS, navigate reviews, access advocacy, and feel confident in their rights. We also help providers grow ethically, connect locally, and build sustainable businesses.',
      icon: '🎯',
      color: 'from-orange-500 to-amber-600',
    },
    {
      number: '06',
      title: 'Transparency and Accountability at the Core',
      description: 'We are building a culture where honesty is standard, not optional. Where whistleblowing is respected. Where poor practice is challenged. Where community safety comes before convenience.',
      icon: '🔍',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      number: '07',
      title: 'A "No One Left Behind" Model',
      description: 'Our platform ensures that disabled people lead the conversation, lived experience is treated as expertise, community replaces isolation, support is accessible at every level, and no one navigates the system alone.',
      icon: '🌟',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const providerBenefits = [
    {
      icon: '🤝',
      title: 'Connections with Trusted NDIS Providers',
      description: 'Build genuine partnerships with providers who understand the sector\'s realities.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: '👥',
      title: 'Access to Participants Seeking Services',
      description: 'Connect with individuals and families actively looking for reliable, local supports.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: '🌱',
      title: 'Ethical, Sustainable Client Referrals',
      description: 'Receive direct referrals from participants searching for services you offer.',
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: '📅',
      title: 'Local Networking and Community Events',
      description: 'Join in-person gatherings that foster collaboration, not competition.',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: '💪',
      title: 'Peer Support & Sector Guidance',
      description: 'Access a community of peers committed to raising sector standards.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: '🎯',
      title: 'Access to Experts & Specialist Advice',
      description: 'Connect with professionals for business strategy, compliance, and growth planning.',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const participantBenefits = [
    {
      icon: '📋',
      title: 'Support Understanding Your NDIS Plan',
      description: 'Get help making sense of your plan and using your funding effectively.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: '💡',
      title: 'Clear Information & Practical Support',
      description: 'Access easy-to-understand information about how the NDIS works and your rights.',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      icon: '🛡️',
      title: 'Advocacy & Help Navigating Challenges',
      description: 'Receive guidance from people who understand NDIS rules and processes.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: '🤗',
      title: 'Peer Support & Lived-Experience Coaching',
      description: 'Connect with individuals and families who have walked a similar path.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: '🔍',
      title: 'Connections with Trusted Local Providers',
      description: 'Find reliable, experienced providers who align with your needs and values.',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: '👨‍⚕️',
      title: 'Access to Specialists & Sector Expertise',
      description: 'Receive support from people who understand disability and the NDIS.',
      color: 'from-rose-500 to-pink-600',
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
      description: 'Advanced filters to find the perfect provider for your needs',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Community Network',
      description: 'Connect with thousands of participants and providers',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Quality',
      description: 'All providers verified for quality and compliance',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '24/7 AI Support',
      description: 'Get instant answers with our intelligent assistant',
      color: 'bg-gradient-to-br from-pink-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'NDIS Participant',
      content: 'This platform finally puts lived experience at the centre. I feel heard, supported, and connected to providers who truly understand my journey.',
      rating: 5,
      image: '👩'
    },
    {
      name: 'James K.',
      role: 'Service Provider',
      content: 'As a small provider, I love being part of a community-first platform. No commission fees, genuine connections, and real support for ethical practice.',
      rating: 5,
      image: '👨‍⚕️'
    },
    {
      name: 'Michelle R.',
      role: 'Support Coordinator',
      content: 'Finally, a platform built by people who get it. The emphasis on transparency, accountability, and lived experience makes all the difference.',
      rating: 5,
      image: '👩‍💼'
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-block mb-4">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  🌟 Connecting Communities
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Reimagining Disability
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  With the Power of Local Community
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl mb-4 text-white font-bold leading-relaxed">
                Building Stronger NDIS Communities — Together
              </p>
              
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                We are an independent NDIS community platform designed to bring people together — providers, participants, families, and local specialists — to create stronger, more connected, and more supportive disability networks across Australia.
              </p>
              
              {/* Rotating tagline */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 min-h-[100px] flex items-center">
                <p className="text-lg text-gray-100 italic transition-all duration-500">
                  "{missionTaglines[currentTagline]}"
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/find-support"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
                >
                  <span className="relative z-10 flex items-center">
                    Find Support
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/provide-support"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  Become a Provider
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{counters.providers.toLocaleString()}+</div>
                  <div className="text-xs text-gray-300 mt-1">Providers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{counters.participants.toLocaleString()}+</div>
                  <div className="text-xs text-gray-300 mt-1">Participants</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{counters.connections.toLocaleString()}+</div>
                  <div className="text-xs text-gray-300 mt-1">Connections</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{counters.satisfaction}%</div>
                  <div className="text-xs text-gray-300 mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right content - Feature highlight cards */}
            <div className="hidden lg:block relative z-10">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-3xl">
                      🤝
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Led by Lived Experience</h3>
                      <p className="text-gray-200">Built by disabled people, for disabled people. Not corporations.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    {['Community First', 'No Commission Fees', 'Transparent & Ethical', 'Ground-Up Approach'].map((item, index) => (
                      <div key={index} className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary card */}
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-2xl max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/80">Nothing About Us</div>
                      <div className="text-2xl font-bold">Without Us</div>
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

      {/* Mission Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-8">
            Strengthen and Drive the Disability Sector
          </h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border border-purple-200">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Our mission is to <strong>strengthen and drive the disability sector</strong> by fostering genuine connection, 
              collaboration, and community — one local relationship at a time.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We believe the NDIS must not only operate effectively, but be <strong>driven, shaped, and guided by people 
              with disabilities</strong>. Provider practices, community spaces, and sector standards should be built through 
              authentic co-design, grounded in disability theory and the core principle that <strong>"nothing about us without us"</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              People with disabilities are not passive recipients of services — they are leaders, designers, and experts in 
              their own lives. Their lived experience informs how providers operate, how communities connect, and how the scheme evolves.
            </p>
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
              Whether you're seeking support or providing services, NDIS Connect brings the community together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Participants */}
            <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg">
                  🔍
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Looking for Support?</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Find verified NDIS service providers in your area. We bring together real choice, real control, and genuine community support.
                </p>
                
                <div className="space-y-3 mb-8">
                  {participantBenefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-2xl mr-3">{benefit.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/find-support"
                  className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Find Support
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* For Providers */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full opacity-10 -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg">
                  🏢
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Want to Provide Support?</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Join our network and connect with thousands of NDIS participants. Build your profile, collaborate with peers, and grow ethically.
                </p>
                
                <div className="space-y-3 mb-8">
                  {providerBenefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-2xl mr-3">{benefit.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/provide-support"
                  className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Become a Provider
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">What Makes Us Different</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Why We're Different from Anything Else in the Marketplace
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We are not another directory, not another provider group, and not another NDIS service platform. 
              We are building something fundamentally different — a community-driven, lived-experience-led ecosystem 
              designed to shift the culture of disability support in Australia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {whyDifferent.map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-transparent overflow-hidden"
              >
                {/* Number badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-lg">{item.number}</span>
                </div>

                <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {item.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 pr-12">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Not a Marketplace */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl px-12 py-6 text-white">
              <p className="text-3xl md:text-4xl font-bold mb-2">This is not a marketplace.</p>
              <p className="text-3xl md:text-4xl font-bold">It's a movement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* No One Left Behind Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Model</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Building a Future Where No One Is Left Behind
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by Lived Experience
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border-2 border-purple-200 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our <em>No One Left Behind</em> model is driven by women with disabilities whose lived experience shapes 
              every decision, every connection, and every part of this community. This platform is built on the belief 
              that real change happens when those who have walked the path lead the way — when women who have navigated 
              the system, challenged its gaps, and carried its weight stand at the centre of reform.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We honour the leadership, insight, and resilience of disabled women who have long been the quiet backbone 
              of advocacy, care, and community building. Their lived experience is not symbolic — it is the engine of 
              this platform. It guides how we connect people, how we support families, how we hold providers accountable, 
              and how we build a sector where no one is left behind.
            </p>
          </div>

          {/* Model Ensures */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Disabled people lead the conversation, break new ground, and reimagine disability in Australia',
              'Lived experience is recognised as expertise, not an afterthought',
              'Community connection replaces isolation',
              'Support is accessible at every level, regardless of circumstance',
              'No participant, family, or provider is left to navigate the system alone'
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <svg className="w-6 h-6 text-purple-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Leadership Statement */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white text-center">
            <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-6">
              By centring disabled women's leadership, we create a community that is stronger, more honest, 
              and more deeply connected — a community where everyone has a place, a voice, and a pathway forward.
            </p>
            <p className="text-xl font-semibold">
              Ensuring the voice of the NDIS community is loud and heard, and that from the ground up it is embedded, 
              respected, and practised in every viewpoint.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Community Voices</span>
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
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
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

      {/* CTA Section */}
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
              🚀 Join the Movement
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join the Movement
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Reshaping Disability Support
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Bold, honest, and rebuilt through the power of lived experience. Because this is not just a platform — 
            it is a collective force reimagining a stronger, fairer, and more human disability system — 
            one built by the community, for the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/find-support"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50"
            >
              <span className="relative z-10 flex items-center">
                Find Support
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/provide-support"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Become a Provider
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
              Led by lived experience
            </div>
          </div>
        </div>
      </section>

      {/* Inline Styles for Animations */}
      <style>{`
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