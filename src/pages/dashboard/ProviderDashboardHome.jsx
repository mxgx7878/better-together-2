import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProviderDashboardHome = () => {
  const { user, isPaid } = useAuth();

  // Quick navigation tiles for both tiers
  const freeTiles = [
    { label: 'Events & Networking', icon: '📅', path: '/dashboard/events', desc: 'Discover events & connect', color: 'from-violet-500 to-purple-600' },
    { label: 'Provider Directory', icon: '🔍', path: '/dashboard/directory', desc: 'Find local providers', color: 'from-blue-500 to-cyan-600' },
    { label: 'Innovation Lab', icon: '💡', path: '/dashboard/innovation-lab', desc: 'Training & resources', color: 'from-amber-500 to-orange-600' },
    { label: 'Library', icon: '📚', path: '/dashboard/library', desc: 'Documents & guides', color: 'from-emerald-500 to-teal-600' },
    { label: 'Q&A Forum', icon: '💬', path: '/dashboard/qa', desc: 'Ask & learn', color: 'from-pink-500 to-rose-600' },
    { label: 'AI Support', icon: '✨', path: '/dashboard/ai-support', desc: 'Instant NDIS help', color: 'from-indigo-500 to-blue-600' },
    { label: 'Update Subscription', icon: '⭐', path: '/dashboard/upgrade', desc: 'Unlock premium tools', color: 'from-yellow-500 to-amber-600' },
    { label: 'Connect with Admin', icon: '🎧', path: '/dashboard/admin-support', desc: 'Get help & support', color: 'from-slate-500 to-slate-700' },
  ];

  const paidTiles = [
    { label: 'Service Requests', icon: '📨', path: '/dashboard/requests', desc: 'Referrals & enquiries', color: 'from-violet-500 to-purple-600', badge: '3' },
    { label: 'Events & Networking', icon: '📅', path: '/dashboard/events', desc: 'Events & sponsorship', color: 'from-blue-500 to-cyan-600' },
    { label: 'Provider Directory', icon: '🔍', path: '/dashboard/directory', desc: 'Find & collaborate', color: 'from-teal-500 to-emerald-600' },
    { label: 'Job Board', icon: '💼', path: '/dashboard/jobs', desc: 'Post & manage jobs', color: 'from-amber-500 to-orange-600' },
    { label: 'Innovation Lab', icon: '💡', path: '/dashboard/innovation-lab', desc: 'Training & development', color: 'from-pink-500 to-rose-600' },
    { label: 'Library', icon: '📚', path: '/dashboard/library', desc: 'Documents & templates', color: 'from-emerald-500 to-teal-600' },
    { label: 'Q&A Forum', icon: '💬', path: '/dashboard/qa', desc: 'Provider discussions', color: 'from-indigo-500 to-blue-600' },
    { label: 'Marketing', icon: '📣', path: '/dashboard/marketing', desc: 'Boost your visibility', color: 'from-red-500 to-pink-600' },
    { label: 'AI Support', icon: '✨', path: '/dashboard/ai-support', desc: 'AI-powered assistant', color: 'from-purple-500 to-indigo-600' },
    { label: 'Update Subscription', icon: '⚙️', path: '/dashboard/upgrade', desc: 'Manage your plan', color: 'from-slate-500 to-slate-700' },
    { label: 'Connect with Admin', icon: '🎧', path: '/dashboard/admin-support', desc: 'Support & feedback', color: 'from-gray-600 to-gray-800' },
  ];

  const tiles = isPaid ? paidTiles : freeTiles;

  // Mock analytics for paid providers
  const analytics = user.analytics || {
    profileViews: 0,
    referralsThisMonth: 0,
    eventEngagement: 0,
    responseRate: '0%',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Completion Banner */}
      {user.profileComplete < 100 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
              👋
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Complete your profile</h3>
              <p className="text-sm text-amber-700 mt-0.5">
                Your profile is {user.profileComplete}% complete. A complete profile helps participants find you.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-32 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${user.profileComplete}%` }}
              />
            </div>
            <Link
              to="/dashboard/profile"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Free Tier Upgrade Banner */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Unlock Client Referrals & Premium Tools</h3>
              <p className="text-purple-100 mt-1 text-sm max-w-xl">
                Upgrade to Growth & Referral to receive direct participant referrals, enhanced directory visibility, messaging, and job board access.
              </p>
            </div>
            <Link
              to="/dashboard/upgrade"
              className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg flex-shrink-0"
            >
              View Plans →
            </Link>
          </div>
        </div>
      )}

      {/* Analytics Cards - Paid Only */}
      {isPaid && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            label="Profile Views"
            value={analytics.profileViews}
            change="+12%"
            positive
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <AnalyticsCard
            label="Referrals This Month"
            value={analytics.referralsThisMonth}
            change="+3"
            positive
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <AnalyticsCard
            label="Event Engagement"
            value={analytics.eventEngagement}
            change="+2"
            positive
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <AnalyticsCard
            label="Response Rate"
            value={analytics.responseRate}
            change=""
            positive
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Quick Navigation Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.path}
              className="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
            >
              {tile.badge && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {tile.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {tile.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                {tile.label}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{tile.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Service Categories - Profile Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {isPaid ? (
              <>
                <ActivityItem
                  icon="📨"
                  title="New service request received"
                  desc="Participant in Melbourne CBD seeking support coordination"
                  time="5 min ago"
                  highlight
                />
                <ActivityItem
                  icon="📅"
                  title="Event RSVP confirmed"
                  desc="Melbourne Provider Networking Meetup — Feb 28"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon="👤"
                  title="Profile viewed by 4 participants"
                  desc="Your profile is gaining traction this week"
                  time="Today"
                />
                <ActivityItem
                  icon="💬"
                  title="New reply in Q&A Forum"
                  desc="Someone responded to your compliance question"
                  time="Yesterday"
                />
              </>
            ) : (
              <>
                <ActivityItem
                  icon="📅"
                  title="New event near you"
                  desc="Provider Connect Breakfast — Melbourne, March 5"
                  time="1 hour ago"
                />
                <ActivityItem
                  icon="🔍"
                  title="New provider in your area"
                  desc="Allied Health Plus joined the directory"
                  time="Today"
                />
                <ActivityItem
                  icon="💬"
                  title="New Q&A discussion"
                  desc="Topic: NDIS mid-year pricing updates"
                  time="Yesterday"
                />
              </>
            )}
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Your Profile</h3>

          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-sm text-slate-500">{user.organisation}</p>
            <p className="text-xs text-slate-400 mt-1">{user.location}</p>
          </div>

          {/* Profile Completion */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Profile Completion</span>
              <span className="font-semibold text-slate-800">{user.profileComplete}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                style={{ width: `${user.profileComplete}%` }}
              />
            </div>
          </div>

          {isPaid && user.analytics && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Verification</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="text-purple-600 font-medium">{user.subscriptionPlan}</span>
              </div>
            </div>
          )}

          <Link
            to="/dashboard/profile"
            className="mt-5 block w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────

function AnalyticsCard({ label, value, change, positive, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time, highlight }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${highlight ? 'bg-purple-50/50 border border-purple-100' : 'hover:bg-slate-50'}`}>
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
      </div>
      <span className="text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap">{time}</span>
    </div>
  );
}

export default ProviderDashboardHome;