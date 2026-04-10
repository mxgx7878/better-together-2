import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

const UpgradePage = () => {
  const { user, isProvider, isPaid } = useAuth();

  // Check if user has Growth & Referral or higher (marketing add-on eligibility)
  const hasGrowthOrAbove = isPaid && (
    user.subscriptionPlan === 'Growth & Referral' ||
    user.subscriptionPlan === 'Premium Visibility'
  );

  const providerPlans = [
    {
      name: 'Free Starter',
      price: 0,
      period: '',
      current: !isPaid,
      features: [
        'Basic directory listing (providers only)',
        'View & register for events',
        'Access to Learning Hub',
        'Read Q&A discussions',
        'Basic library resources',
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
        'See & respond to service requests',
        'Direct messaging with participants',
        'Enhanced profile with tags',
        'Priority in search results',
        'Job board posting',
        'Central inbox & message tally',
        'Eligible for Marketing add-on',
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
        'Visual badges on profile',
        'Boosted in participant views',
        'Monthly analytics report',
        'Profile views & enquiry data',
        'Priority support',
        'Eligible for Marketing add-on',
      ],
      color: 'pink',
    },
  ];

  const participantPlans = [
    {
      name: 'Explore & Connect',
      price: 0,
      period: '',
      current: !isPaid,
      features: [
        'Home dashboard & Learning Hub',
        'Connect with Services directory',
        'Community Message Board',
        'Events calendar',
        'Library resources',
        'Rights & Safety info',
        'AI "Ask a Question"',
      ],
      color: 'slate',
    },
    {
      name: 'Personal Support Plus',
      price: 200,
      period: '/year',
      current: isPaid,
      popular: true,
      features: [
        'Everything in Free',
        'Personal Plan Buddy (PPB)',
        'Personal support inbox',
        'Optional monthly check-ins',
        'Draft help for emails & letters',
        'Peer matching & groups',
        'Advocate & lawyer connections',
        'AAT preparation support',
        'Priority help requests',
        'Extra templates & checklists',
      ],
      color: 'purple',
    },
  ];

  const plans = isProvider ? providerPlans : participantPlans;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isPaid ? 'View and manage your current plan' : 'Upgrade to unlock more features'}
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className={`rounded-2xl p-6 ${isPaid ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
        <div className="flex items-center justify-between">
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
                  <span className={`text-sm ${f === 'Eligible for Marketing add-on' ? 'text-purple-700 font-medium' : 'text-slate-700'}`}>
                    {f}
                  </span>
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

      {/* ─── Marketing Add-on Card ─────────────────────────────────────── */}
      {isProvider && (
        <div className={`rounded-2xl border-2 p-6 transition-all ${
          hasGrowthOrAbove
            ? 'bg-white border-amber-200 shadow-sm'
            : 'bg-slate-50 border-slate-200 opacity-80'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                hasGrowthOrAbove ? 'bg-amber-100' : 'bg-slate-200'
              }`}>
                <Megaphone className={`w-6 h-6 ${hasGrowthOrAbove ? 'text-amber-700' : 'text-slate-500'}`} />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-slate-800">
                    Marketing Add-on — Platform Advertising
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    hasGrowthOrAbove
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    Add-on
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  Get your brand featured across the platform — your logo scrolls in the
                  <span className="font-medium text-slate-700"> Featured Partners ribbon</span>, visible to
                  all participants and providers. Billed monthly, cancel any time.
                </p>

                {/* What's included */}
                <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    'Logo in Featured Partners ribbon',
                    'Listing boosted in provider search',
                    'Highlighted on participant home page',
                    '1-month minimum, renew as needed',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 ${hasGrowthOrAbove ? 'text-amber-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Lock notice for free users */}
                {!hasGrowthOrAbove && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Requires <span className="font-semibold text-slate-600 mx-1">Growth & Referral</span> or higher to unlock
                  </div>
                )}
              </div>
            </div>

            {/* Pricing + CTA */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 text-center md:text-right md:items-end">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">$400</span>
                <span className="text-sm text-slate-500">/month</span>
                <p className="text-[11px] text-slate-400 mt-0.5">No lock-in · month to month</p>
              </div>

              {hasGrowthOrAbove ? (
                <Link
                  to="marketing"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all whitespace-nowrap"
                >
                  Add Marketing →
                </Link>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 bg-slate-200 text-slate-400 text-sm font-semibold rounded-xl cursor-not-allowed whitespace-nowrap"
                >
                  Upgrade First
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Note */}
      {isProvider && isPaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Team Members</p>
            <p className="text-xs text-blue-700 mt-0.5">
              All paid subscriptions include the ability to add up to 4 team members. Team members get access to free tier features.{' '}
              <Link to="profile" className="underline font-semibold">Manage in Profile →</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePage;
