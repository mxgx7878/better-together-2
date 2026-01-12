import { useState } from 'react';

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(null);

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

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'NDIS Connect was founded with a vision to bridge the gap between participants and providers.',
      icon: '🚀',
      color: 'bg-blue-500'
    },
    {
      year: '2021',
      title: 'Platform Launch',
      description: 'Launched our first platform version, connecting 500+ participants with quality providers.',
      icon: '🎯',
      color: 'bg-green-500'
    },
    {
      year: '2022',
      title: 'Expansion',
      description: 'Expanded nationwide, reaching 5000+ active users and 1000+ registered providers.',
      icon: '📈',
      color: 'bg-purple-500'
    },
    {
      year: '2023',
      title: 'Innovation',
      description: 'Introduced AI-powered matching and advanced search features for better connections.',
      icon: '🤖',
      color: 'bg-orange-500'
    },
    {
      year: '2024',
      title: 'Recognition',
      description: 'Awarded Best NDIS Platform for our commitment to quality and innovation.',
      icon: '🏆',
      color: 'bg-yellow-500'
    },
    {
      year: '2025',
      title: 'Future Ready',
      description: 'Continuing to innovate with new features and expanding our impact across Australia.',
      icon: '✨',
      color: 'bg-pink-500'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      bio: 'With 15+ years in disability services, Sarah leads our mission to transform NDIS connections.',
      image: '👩‍💼',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Tech innovator bringing AI and modern solutions to improve participant experiences.',
      image: '👨‍💻',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Emma Williams',
      role: 'Head of Community',
      bio: 'Passionate advocate ensuring our platform serves the community\'s needs effectively.',
      image: '👩‍🦰',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'David Martinez',
      role: 'Head of Operations',
      bio: 'Operations expert dedicated to maintaining quality and efficiency across all services.',
      image: '👨',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Lisa Thompson',
      role: 'Customer Success Lead',
      bio: 'Committed to ensuring every participant has a positive experience on our platform.',
      image: '👩',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'James Anderson',
      role: 'Provider Relations',
      bio: 'Building strong relationships with providers to ensure quality service delivery.',
      image: '👨‍⚕️',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const achievements = [
    { number: '10,000+', label: 'Active Participants', icon: '👥' },
    { number: '1,500+', label: 'Registered Providers', icon: '🏢' },
    { number: '50,000+', label: 'Successful Connections', icon: '🤝' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
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
              🌟 Our Story
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Building Bridges
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Changing Lives
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Connecting NDIS participants with quality service providers through 
            innovation, technology, and genuine care.
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

      {/* Mission & Vision - Enhanced */}
      <section className="py-20 bg-white">
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
                  creating a thriving ecosystem of care and support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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
              <p className="text-lg text-gray-700 leading-relaxed">
                NDIS Connect was born from a simple observation: the process of finding and 
                connecting with NDIS service providers was unnecessarily complex and time-consuming. 
                Participants struggled to navigate the system, while quality providers found it 
                difficult to reach those who needed their services.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform brings together participants seeking support and providers offering 
                quality services, creating a transparent marketplace where informed decisions can 
                be made. We believe in the power of technology to transform lives and make 
                disability support more accessible for everyone.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <p className="text-lg text-gray-700 leading-relaxed">
                By providing tools for discovery, comparison, and connection, we're helping to build 
                stronger relationships between participants and providers, ultimately contributing to 
                better outcomes for the entire NDIS community. Today, we're proud to serve thousands 
                of participants and providers across Australia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Enhanced */}
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

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Journey</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-xl text-gray-600">
              Key moments in our growth and evolution
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                      <div className="text-3xl mb-3">{milestone.icon}</div>
                      <div className={`${milestone.color} inline-block px-4 py-2 rounded-full text-white font-bold text-sm mb-3`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-purple-600 shadow-lg z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Meet The Team</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              The People Behind NDIS Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team dedicated to making a difference in the NDIS community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className={`bg-gradient-to-br ${member.color} h-32 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                
                <div className="relative px-6 pb-6">
                  <div className={`bg-gradient-to-br ${member.color} w-24 h-24 rounded-2xl mx-auto -mt-12 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white`}>
                    {member.image}
                  </div>
                  
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-purple-600 font-semibold mb-3 text-sm">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Social links placeholder */}
                  <div className="flex justify-center space-x-3 mt-4">
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors duration-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                  </div>
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
              🚀 Join Us Today
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Be Part of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Our Success Story?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Whether you're a participant seeking support or a provider wanting to make a difference, 
            join our community today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50">
              <span className="relative z-10 flex items-center">
                Get Started Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg">
              Contact Our Team
            </button>
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