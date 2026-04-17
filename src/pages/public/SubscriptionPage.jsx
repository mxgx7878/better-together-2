import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Star, Handshake, Shield, Sparkles, Building2, Users } from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('provider'); // 'provider' or 'participant'
  const [activePlan, setActivePlan] = useState(null);

  const providerPlans = [
    {
      name: 'Community Access',
      tagline: 'Free to Join',
      price: 0,
      description: 'Stay connected and informed with access to our community calendar and local networking events',
      features: [
        { text: 'Access to events calendar', included: true },
        { text: 'Invitations to local networking meet-ups', included: true },
        { text: 'Updates on community initiatives and sector news', included: true },
        { text: 'Opportunities to connect with other trusted providers', included: true },
        { text: 'Provider message board access', included: true },
        { text: 'Client referral opportunities', included: false },
        { text: 'Advertising placements', included: false },
        { text: 'Priority advertising', included: false },
      ],
      buttonText: 'Join Free',
      buttonStyle: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
      highlight: false,
      icon: <Sprout className="w-10 h-10 text-green-600" />,
      color: 'green',
    },
    {
      name: 'Growth & Referral',
      tagline: 'Expand Your Reach',
      price: 49,
      description: 'Designed for providers ready to expand their reach and strengthen their business through meaningful connections',
      features: [
        { text: 'Everything in Community Access', included: true, bold: true },
        { text: 'Access to participant and client referral opportunities', included: true },
        { text: 'Advertising placements within our community channels', included: true },
        { text: 'Networking with complementary businesses', included: true },
        { text: 'Connections to local referral pathways', included: true },
        { text: 'Increased visibility within provider network', included: true },
        { text: 'Priority advertising', included: false },
        { text: 'Featured provider listing', included: false },
      ],
      buttonText: 'Start Growing',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      highlight: true,
      icon: <TrendingUp className="w-10 h-10 text-purple-600" />,
      color: 'purple',
      badge: 'MOST POPULAR',
    },
    {
      name: 'Premium Visibility',
      tagline: 'Maximum Exposure',
      price: 99,
      description: 'For providers seeking maximum reach, brand presence, and direct access to client groups',
      features: [
        { text: 'Everything in Growth & Referral', included: true, bold: true },
        { text: 'Priority advertising across platform and community spaces', included: true },
        { text: 'Featured provider listings for enhanced visibility', included: true },
        { text: 'Direct exposure to participant groups and families', included: true },
        { text: 'Showcase expertise through events, content, or education', included: true },
        { text: 'Greater brand recognition within local networks', included: true },
        { text: 'Priority support', included: true },
        { text: 'Quarterly performance reports', included: true },
      ],
      buttonText: 'Get Premium',
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      highlight: false,
      icon: <Star className="w-10 h-10 text-orange-600" />,
      color: 'orange',
    },
  ];

  const participantPlans = [
    {
      name: 'Community Connection',
      tagline: 'Free Tier',
      price: 0,
      priceLabel: '/month',
      description: 'Stay connected with your local disability community and access trusted providers when you need them',
      features: [
        { text: 'Access to "Looking for Services" to connect with local providers', included: true },
        { text: 'Ability to post support needs or service requests', included: true },
        { text: 'Updates on community events, workshops, and opportunities', included: true },
        { text: 'A safe space to ask questions and learn from others', included: true },
        { text: 'Browse provider profiles', included: true },
        { text: 'Direct connection with disability services-experienced advocates', included: false },
        { text: 'Access to legal teams', included: false },
        { text: 'Priority provider matching', included: false },
      ],
      buttonText: 'Join Free',
      buttonStyle: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
      highlight: false,
      icon: <Handshake className="w-10 h-10 text-green-600" />,
      color: 'green',
    },
    {
      name: 'Guidance & Advocacy Plus',
      tagline: 'Complete Support',
      price: 350,
      priceLabel: '/year',
      description: 'For participants and families who want deeper support, especially when things become complex or overwhelming',
      features: [
        { text: 'Everything in Community Connection', included: true, bold: true },
        { text: 'Direct connection with disability services-experienced advocates', included: true },
        { text: 'Support to understand your plan, funding categories, and reviews', included: true },
        { text: 'Access to experts who can explain disability services rules clearly', included: true },
        { text: 'Practical advice for plan meetings and reviews', included: true },
        { text: 'Priority access to providers matching your needs', included: true },
        { text: 'Connection with legal teams who understand disability services matters', included: true },
        { text: 'Access to AAT training, workshops, and resources', included: true },
        { text: 'Guidance from advocates on your rights and options', included: true },
        { text: 'Support to make complex processes less intimidating', included: true },
        { text: 'Priority matching with trusted, reputable providers', included: true },
      ],
      buttonText: 'Get Full Support',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      highlight: true,
      icon: <Shield className="w-10 h-10 text-purple-600" />,
      color: 'purple',
      badge: 'RECOMMENDED',
    },
  ];

  const providerComparison = [
    { feature: 'Access to events calendar', tier1: '✓', tier2: '✓', tier3: '✓' },
    { feature: 'Invitations to local networking events', tier1: '✓', tier2: '✓', tier3: '✓' },
    { feature: 'Provider message board access', tier1: '✓', tier2: '✓', tier3: '✓' },
    { feature: 'Client referral opportunities', tier1: '—', tier2: '✓', tier3: '✓ (priority)' },
    { feature: 'Advertising placements', tier1: '—', tier2: '✓', tier3: '✓ (premium)' },
    { feature: 'Networking with complementary businesses', tier1: '—', tier2: '✓', tier3: '✓' },
    { feature: 'Access to local referral pathways', tier1: '—', tier2: '✓', tier3: '✓' },
    { feature: 'Featured provider listing', tier1: '—', tier2: '—', tier3: '✓' },
    { feature: 'Exposure to participant groups', tier1: '—', tier2: '—', tier3: '✓ (enhanced)' },
    { feature: 'Opportunities to showcase expertise', tier1: '—', tier2: '—', tier3: '✓' },
  ];

  const participantComparison = [
    { feature: 'Access to "Looking for Services"', tier1: '✓', tier2: '✓' },
    { feature: 'Connect with local providers', tier1: '✓', tier2: '✓ (priority)' },
    { feature: 'Community updates & events', tier1: '✓', tier2: '✓' },
    { feature: 'Help understanding your disability services plan', tier1: '—', tier2: '✓' },
    { feature: 'Guidance through reviews & processes', tier1: '—', tier2: '✓' },
    { feature: 'Access to advocates & disability services support', tier1: '—', tier2: '✓' },
    { feature: 'Access to legal teams (AAT support)', tier1: '—', tier2: '✓' },
    { feature: 'Training & resources for complex processes', tier1: '—', tier2: '✓' },
    { feature: 'Your Buddy — a personal plan coach', tier1: '—', tier2: '✓' },
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you\'ll only pay the difference if upgrading mid-cycle.',
    },
    {
      question: 'Is the basic tier really free?',
      answer: 'Yes! Both Community Access (for providers) and Community Connection (for participants) are completely free forever. No credit card required, no hidden fees.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and direct debit. All payments are processed securely with 256-bit encryption.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, we\'ll provide a full refund within the first 30 days.',
    },
    {
      question: 'Can I have both provider and participant subscriptions?',
      answer: 'Yes! If you\'re both a participant seeking support and a provider offering services, you can subscribe to plans in both categories and manage separate profiles.',
    },
    {
      question: 'How does the referral system work for providers?',
      answer: 'With Growth & Referral or Premium tiers, you\'ll receive notifications when participants post service requests that match your offerings. You can then reach out directly through our secure messaging system.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block mb-4">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4 inline" /> Subscription Plans
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Join Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Growing Community
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that's right for you. Whether you're a provider looking to grow or a participant seeking support, we have options designed with you in mind.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('provider')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'provider'
                  ? 'bg-white text-purple-900 shadow-xl scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Building2 className="w-5 h-5 inline mr-1" /> For Providers
            </button>
            <button
              onClick={() => setActiveTab('participant')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'participant'
                  ? 'bg-white text-purple-900 shadow-xl scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-5 h-5 inline mr-1" /> For Participants
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-8 ${activeTab === 'provider' ? 'lg:grid-cols-3' : 'md:grid-cols-2 max-w-4xl mx-auto'}`}>
            {(activeTab === 'provider' ? providerPlans : participantPlans).map((plan, index) => (
              <div
                key={index}
                onMouseEnter={() => setActivePlan(index)}
                onMouseLeave={() => setActivePlan(null)}
                className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 ${
                  plan.highlight 
                    ? 'shadow-2xl ring-4 ring-purple-500 transform lg:scale-105 z-10' 
                    : 'shadow-lg hover:shadow-2xl'
                } ${activePlan === index ? 'transform -translate-y-2' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg z-20">
                    {plan.badge}
                  </div>
                )}

                <div className={`p-8 ${
                  plan.color === 'green' ? 'bg-gradient-to-br from-green-50 to-teal-50' :
                  plan.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-pink-50' :
                  plan.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' :
                  'bg-gradient-to-br from-orange-50 to-red-50'
                }`}>
                  <div className="mb-4">{plan.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm font-semibold text-gray-600 mb-4">{plan.tagline}</p>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-xl text-gray-600 ml-2">{plan.priceLabel || '/month'}</span>
                  </div>
                  
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="p-8">
                  <button onClick={() => navigate('/login')} className={`w-full ${plan.buttonStyle} text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-8`}>
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg mb-4">What's included:</h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        {feature.included ? (
                          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-300 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={`${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'} ${feature.bold ? 'font-semibold' : ''}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {activeTab === 'provider' ? 'Provider' : 'Participant'} Plan Comparison
            </h2>
            <p className="text-xl text-gray-600">See exactly what's included in each tier</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <th className="px-6 py-4 text-left font-bold">Features</th>
                    <th className="px-6 py-4 text-center font-bold">
                      {activeTab === 'provider' ? 'Community Access' : 'Community Connection'}
                      <div className="text-xs font-normal mt-1">(Free)</div>
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      {activeTab === 'provider' ? 'Growth & Referral' : 'Guidance & Advocacy Plus'}
                    </th>
                    {activeTab === 'provider' && (
                      <th className="px-6 py-4 text-center font-bold">Premium Visibility</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(activeTab === 'provider' ? providerComparison : participantComparison).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.tier1}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-semibold">{item.tier2}</td>
                      {activeTab === 'provider' && (
                        <td className="px-6 py-4 text-center text-orange-600 font-semibold">{item.tier3}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works — {activeTab === 'provider' ? 'For Providers' : 'For Participants'}
            </h2>
            <p className="text-xl text-gray-600">
              {activeTab === 'provider' ? 'Simple. Clear. Community-led.' : 'Supportive. Safe. Easy to Navigate.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {activeTab === 'provider' ? (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-bold text-gray-900 mb-2">Join the Community</h3>
                  <p className="text-sm text-gray-600">Sign up and choose the subscription level that suits your business</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-bold text-gray-900 mb-2">Create Your Profile</h3>
                  <p className="text-sm text-gray-600">Share who you are, what you offer, and the values that guide your work</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-bold text-gray-900 mb-2">Connect Locally</h3>
                  <p className="text-sm text-gray-600">Use our message board and events to build relationships and referral pathways</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                  <h3 className="font-bold text-gray-900 mb-2">Access Referrals</h3>
                  <p className="text-sm text-gray-600">Receive client referrals and direct connections with participants seeking services</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">5</div>
                  <h3 className="font-bold text-gray-900 mb-2">Grow Together</h3>
                  <p className="text-sm text-gray-600">Engage with experts, advocates, and other providers to build sustainably</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-bold text-gray-900 mb-2">Join the Community</h3>
                  <p className="text-sm text-gray-600">Sign up for free or choose a subscription with additional support</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-bold text-gray-900 mb-2">Tell Us What You Need</h3>
                  <p className="text-sm text-gray-600">Use the message board to share what you're looking for</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-bold text-gray-900 mb-2">Connect With Providers</h3>
                  <p className="text-sm text-gray-600">You'll be matched with reputable providers in your area</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                  <h3 className="font-bold text-gray-900 mb-2">Access Guidance</h3>
                  <p className="text-sm text-gray-600">Connect with advocates, experts, and legal teams as needed</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">5</div>
                  <h3 className="font-bold text-gray-900 mb-2">Feel Supported</h3>
                  <p className="text-sm text-gray-600">You're never left to navigate the disability services alone</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our plans</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start">
                  <svg className="w-6 h-6 mr-3 text-purple-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-9">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link 
              to="/contact"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Our Team
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-800 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
            Join thousands of participants and providers using The Better Together Network today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-10 py-5 rounded-xl text-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Your Free Account
            </button>
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Learn More About Us
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center flex-wrap gap-6 text-sm">
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

export default SubscriptionPage;