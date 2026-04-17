import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const UpgradePage = () => {
  const { user, isProvider, isPaid } = useAuth();

  const providerPlans = [
    {
      name: 'Free Starter',
      price: 0,
      period: '',
      current: !isPaid,
      features: [
        'Basic directory listing (name & location only)',
        'View & register for events',
        'Access to Learning Hub',
        'Read Q&A discussions',
        'Basic library resources',
        'Post to Job Board',
      ],
      color: 'slate',
    },
    {
      name: 'Growth & Referral',
      price: 45,
      period: '/month',
      yearlyPrice: 400,
      current: isPaid && user.subscriptionPlan === 'Growth & Referral',
      popular: true,
      features: [
        'Everything in Free Starter',
        'Full access to Business Directory (website, team members)',
        'Reply to "Looking for Services" posts',
        'Enhanced profile with tags',
        'Priority in search results',
        'Collaboration badge on profile',
      ],
      color: 'purple',
    },
    {
      name: 'Premium Visibility',
      price: 90,
      period: '/month',
      yearlyPrice: 800,
      current: isPaid && user.subscriptionPlan === 'Premium Visibility',
      features: [
        'Everything in Growth & Referral',
        '"Featured Provider" status',
        'Up to 5 written reviews on your profile',
        'Visual badges on profile',
        'Boosted in participant views',
        'Monthly analytics report',
        'Priority support',
      ],
      color: 'pink',
    },
  ];

  const participantPlans = [
    {
      name: 'Community Connection',
      price: 0,
      period: '',
      current: !isPaid,
      features: [
        'Home dashboard & Learning Hub',
        'Provider Directory access',
        '"Looking for Services" board',
        'Events calendar',
        'Library resources',
        'Rights & Safety info',
        'Q & A',
      ],
      color: 'slate',
    },
    {
      name: 'Guidance & Advocacy Plus',
      price: 350,
      period: '/year',
      current: isPaid,
      popular: true,
      features: [
        'Everything in Free',
        'Check-ins, Planning and Individualised Support',
        'Help with emails & letters',
        'Help with understanding NDIS',
        'Peer matching & groups',
        'Advocate & lawyer connections',
        'AAT preparation support',
        'Priority support requests',
        'Extra templates & checklists',
      ],
      color: 'purple',
    },
  ];

  const plans = isProvider ? providerPlans : participantPlans;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isProvider ? 'Upgrade Your Subscription' : 'Your Buddy'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isProvider
            ? (isPaid ? 'View and manage your current plan' : 'Upgrade to unlock more features')
            : (isPaid ? 'You have access to your personal Buddy — manage your plan below' : 'Pay your subscription, and you will get a Buddy to help you with your plan — it\'s that simple.')}
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className={`rounded-2xl p-6 ${isPaid ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Plan</p>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{isPaid ? user.subscriptionPlan : 'Free Plan'}</h2>
            {isPaid && <p className="text-sm text-slate-600 mt-1">Renews on March 15, 2026</p>}
          </div>
          {isPaid && (
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                Manage Billing
              </button>
              <button className="px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                Cancel Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className={`grid gap-6 ${plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-3xl mx-auto'}`}>
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative ${
              plan.current
                ? 'border-purple-400 ring-2 ring-purple-100'
                : plan.popular
                ? 'border-purple-200'
                : 'border-slate-100'
            }`}
          >
            {plan.popular && !plan.current && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                RECOMMENDED
              </span>
            )}
            {plan.current && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                CURRENT PLAN
              </span>
            )}
            <div className="text-center mb-5 pt-2">
              <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
              </div>
              {plan.yearlyPrice && (
                <p className="text-xs text-slate-400 mt-1">
                  or ${plan.yearlyPrice}/year (save {Math.round((1 - plan.yearlyPrice / (plan.price * 12)) * 100)}%)
                </p>
              )}
            </div>
            <div className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
            {plan.current ? (
              <button disabled className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl cursor-default">
                Current Plan
              </button>
            ) : plan.price === 0 ? (
              <button disabled className="w-full py-3 bg-slate-50 text-slate-400 font-semibold rounded-xl cursor-default">
                Free Forever
              </button>
            ) : (
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all">
                {isPaid ? 'Switch Plan' : 'Upgrade Now'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Team Members Note */}
      {isProvider && isPaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Team Members</p>
            <p className="text-xs text-blue-700 mt-0.5">
              All paid subscriptions include the ability to add up to 4 team members. Team members get access to free tier features and are encouraged to create their own free profile to boost their presence.{' '}
              <Link to="../profile" className="underline font-semibold">Manage in Profile →</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePage;
