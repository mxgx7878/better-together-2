import { useState } from 'react';
import { Link } from 'react-router-dom';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly
  const [activePlan, setActivePlan] = useState(null);

  const plans = [
    {
      name: 'Basic Plan',
      tagline: 'Perfect for Exploring',
      price: { monthly: 0, yearly: 0 },
      description: 'Get started with essential features to explore NDIS Connect',
      features: [
        { text: 'Browse provider profiles', included: true },
        { text: 'Basic search functionality', included: true },
        { text: 'Access to event calendar', included: true },
        { text: 'Community forum access', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced search filters', included: false },
        { text: 'Direct messaging', included: false },
        { text: 'Priority support', included: false },
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
      highlight: false,
      icon: '🌱',
      color: 'green',
    },
    {
      name: 'Premium Plan',
      tagline: 'Most Popular Choice',
      price: { monthly: 29, yearly: 290 },
      description: 'Unlock all features with priority support and exclusive benefits',
      features: [
        { text: 'Everything in Basic', included: true, bold: true },
        { text: 'Advanced search filters', included: true },
        { text: 'Direct messaging with providers', included: true },
        { text: 'Featured profile listing', included: true },
        { text: 'Priority support (24/7)', included: true },
        { text: 'Detailed analytics dashboard', included: true },
        { text: 'Custom AI recommendations', included: true },
        { text: 'Early event access & discounts', included: true },
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      highlight: true,
      icon: '⭐',
      color: 'purple',
      badge: 'MOST POPULAR',
      savings: 'Save $58/year',
    },
    {
      name: 'Enterprise Plan',
      tagline: 'For Organizations',
      price: { monthly: 99, yearly: 990 },
      description: 'Comprehensive solution for service providers and organizations',
      features: [
        { text: 'Everything in Premium', included: true, bold: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Advanced analytics & reporting', included: true },
        { text: 'Custom branding options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access & integrations', included: true },
        { text: 'White-label solutions', included: true },
        { text: 'Custom training sessions', included: true },
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      highlight: false,
      icon: '🚀',
      color: 'orange',
      savings: 'Save $198/year',
    },
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you\'ll only pay the difference if upgrading mid-cycle.',
    },
    {
      question: 'Is there a free trial for Premium?',
      answer: 'Yes! We offer a 14-day free trial for our Premium plan. No credit card required to start. Experience all premium features risk-free.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and direct debit. All payments are processed securely with 256-bit encryption.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your Premium or Enterprise plan, we\'ll provide a full refund within the first 30 days.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel anytime. Your access will continue until the end of your billing period. No questions asked, no cancellation fees.',
    },
    {
      question: 'What happens after my trial ends?',
      answer: 'After your 14-day trial, you\'ll be automatically charged based on your selected billing cycle unless you cancel. We\'ll send you a reminder 3 days before the trial ends.',
    },
  ];

  const testimonials = [
    {
      name: 'David Smith',
      role: 'NDIS Participant',
      plan: 'Premium',
      content: 'The Premium plan transformed how I connect with providers. The advanced search saved me hours!',
      rating: 5,
      image: '👨‍💼',
    },
    {
      name: 'Lisa Chen',
      role: 'Service Provider',
      plan: 'Enterprise',
      content: 'As a provider with a team, the Enterprise plan\'s analytics and multi-user access are invaluable.',
      rating: 5,
      image: '👩‍💻',
    },
    {
      name: 'Robert Taylor',
      role: 'Support Coordinator',
      plan: 'Premium',
      content: 'Best investment for my work. Direct messaging makes coordination seamless.',
      rating: 5,
      image: '👨‍⚕️',
    },
  ];

  const comparisonFeatures = [
    { feature: 'Provider Profiles', basic: 'Browse Only', premium: 'Full Access', enterprise: 'Priority Listing' },
    { feature: 'Search Functionality', basic: 'Basic', premium: 'Advanced Filters', enterprise: 'AI-Powered' },
    { feature: 'Messaging', basic: '✗', premium: '✓ Unlimited', enterprise: '✓ + Team Chat' },
    { feature: 'Support', basic: 'Email', premium: '24/7 Priority', enterprise: 'Dedicated Manager' },
    { feature: 'Analytics', basic: '✗', premium: 'Basic', enterprise: 'Advanced + Custom' },
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
              💎 Flexible Pricing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Perfect Plan
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Flexible pricing designed to grow with you. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-white/20 backdrop-blur-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
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
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg">
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className={`p-8 ${
                  plan.color === 'green' ? 'bg-gradient-to-br from-green-50 to-teal-50' :
                  plan.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-pink-50' :
                  'bg-gradient-to-br from-orange-50 to-red-50'
                }`}>
                  <div className="text-5xl mb-4">{plan.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm font-semibold text-gray-600 mb-4">{plan.tagline}</p>
                  
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-xl text-gray-600 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  
                  {billingCycle === 'yearly' && plan.savings && (
                    <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {plan.savings}
                    </div>
                  )}
                  
                  <p className="text-gray-600 mt-4">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <button className={`w-full ${plan.buttonStyle} text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-8`}>
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      What's included:
                    </h4>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Compare Plans</h2>
            <p className="text-xl text-gray-600">See what's included in each plan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <th className="px-6 py-4 text-left font-bold">Feature</th>
                    <th className="px-6 py-4 text-center font-bold">Basic</th>
                    <th className="px-6 py-4 text-center font-bold">Premium</th>
                    <th className="px-6 py-4 text-center font-bold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.basic}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-semibold">{item.premium}</td>
                      <td className="px-6 py-4 text-center text-orange-600 font-semibold">{item.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Loved by Our Members</h2>
            <p className="text-xl text-gray-600">See what others are saying about their plan</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                      {testimonial.plan}
                    </span>
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

      {/* FAQ Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
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

      {/* Provider CTA Section - Enhanced */}
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
              🏢 For Providers
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Are You a Service Provider?
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join our network of quality providers and connect with participants who need your services. 
            Special enterprise pricing available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50">
              <span className="relative z-10 flex items-center">
                View Provider Plans
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              Contact Sales Team
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom Solutions
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Volume Discounts
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dedicated Support
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of participants and providers using NDIS Connect today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Start Your Free Trial
            </button>
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-gray-100 text-gray-900 px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-200 transition-all duration-300 shadow-lg"
            >
              Learn More About Us
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

export default SubscriptionPage;