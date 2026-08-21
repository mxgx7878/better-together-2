import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Calendar, Search, Lightbulb, BookOpen, MessageCircle, Star, Mic,
  Inbox, Briefcase, User, Hand as HandWave, Loader2, AlertCircle,
} from 'lucide-react';

const ProviderDashboardHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/provider/dashboard');
      console.log(res ,"res");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Couldn't load the dashboard</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button onClick={fetchDashboard} className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, isPaid, recentActivity = [], featuredPartners = [] } = data;
  const analytics = user.analytics || { profileViews: 0, referralsThisMonth: 0, eventEngagement: 0, responseRate: '—' };

  const freeTiles = [
    { label: 'Business Directory',  icon: <Search className="w-6 h-6 text-white" />, path: '/provider/directory',    desc: 'Name & location preview',     color: 'from-blue-500 to-cyan-600' },
    { label: 'Job Board',           icon: <Briefcase className="w-6 h-6 text-white" />, path: '/provider/jobs',         desc: 'Post free job ads',           color: 'from-amber-500 to-orange-600' },
    { label: 'Events & Networking', icon: <Calendar className="w-6 h-6 text-white" />, path: '/provider/events',       desc: 'Discover events & connect',  color: 'from-violet-500 to-purple-600' },
    { label: 'Innovation Lab',      icon: <Lightbulb className="w-6 h-6 text-white" />, path: '/provider/innovation-lab',desc: 'Training & resources',       color: 'from-amber-500 to-orange-600' },
    { label: 'Learning Hub',        icon: <BookOpen className="w-6 h-6 text-white" />, path: '/provider/learning',     desc: 'Guides & modules',            color: 'from-emerald-500 to-teal-600' },
    { label: 'Q & A',               icon: <MessageCircle className="w-6 h-6 text-white" />, path: '/provider/qa',           desc: 'Ask & learn',                 color: 'from-pink-500 to-rose-600' },
    { label: 'Documents',           icon: <BookOpen className="w-6 h-6 text-white" />, path: '/provider/documents',    desc: 'Resources & templates',       color: 'from-cyan-500 to-blue-600' },
    { label: 'Upgrade Your Subscription',icon: <Star className="w-6 h-6 text-white" />, path: '/provider/upgrade',      desc: 'Unlock premium tools',        color: 'from-yellow-500 to-amber-600' },
    { label: 'Connect with Admin',  icon: <Mic className="w-6 h-6 text-white" />, path: '/provider/admin-support',desc: 'Get help & support',         color: 'from-slate-500 to-slate-700' },
  ];

  const paidTiles = [
    { label: 'Business Directory',  icon: <Search className="w-6 h-6 text-white" />, path: '/provider/directory',    desc: 'Full details & team',         color: 'from-teal-500 to-emerald-600' },
    { label: 'Job Board',           icon: <Briefcase className="w-6 h-6 text-white" />, path: '/provider/jobs',         desc: 'Post & manage jobs',         color: 'from-amber-500 to-orange-600' },
    { label: 'Events & Networking', icon: <Calendar className="w-6 h-6 text-white" />, path: '/provider/events',       desc: 'Events & sponsorship',       color: 'from-blue-500 to-cyan-600' },
    { label: 'Innovation Lab',      icon: <Lightbulb className="w-6 h-6 text-white" />, path: '/provider/innovation-lab',desc: 'Training & development',    color: 'from-pink-500 to-rose-600' },
    { label: 'Learning Hub',        icon: <BookOpen className="w-6 h-6 text-white" />, path: '/provider/learning',     desc: 'Courses & modules',           color: 'from-emerald-500 to-teal-600' },
    { label: 'Q & A',               icon: <MessageCircle className="w-6 h-6 text-white" />, path: '/provider/qa',           desc: 'Provider discussions',       color: 'from-indigo-500 to-blue-600' },
    { label: 'Documents',           icon: <BookOpen className="w-6 h-6 text-white" />, path: '/provider/documents',    desc: 'Resources & templates',       color: 'from-cyan-500 to-blue-600' },
    { label: 'Upgrade Your Subscription',icon: <Star className="w-6 h-6 text-white" />, path: '/provider/upgrade',      desc: 'Manage your plan',            color: 'from-yellow-500 to-amber-600' },
    { label: 'Connect with Admin',  icon: <Mic className="w-6 h-6 text-white" />, path: '/provider/admin-support',desc: 'Support & feedback',          color: 'from-gray-600 to-gray-800' },
  ];

  const tiles = isPaid ? paidTiles : freeTiles;

  const activityIcon = (type) => {
    switch (type) {
      case 'service_request': return <Inbox className="w-5 h-5 text-purple-600" />;
      case 'directory':       return <Search className="w-5 h-5 text-teal-600" />;
      case 'event':           return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'qa':              return <MessageCircle className="w-5 h-5 text-pink-600" />;
      default:                return <MessageCircle className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Analytics Cards - Paid Only */}
      {isPaid && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <AnalyticsCard label="Profile Views" value={analytics.profileViews} change="" positive
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
          <AnalyticsCard label="Referrals This Month" value={analytics.referralsThisMonth} change="" positive
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <AnalyticsCard label="Event Engagement" value={analytics.eventEngagement} change="" positive
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <AnalyticsCard label="Response Rate" value={analytics.responseRate} change="" positive
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>
      )}

      {/* Quick Navigation Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {tile.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">{tile.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{tile.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity + Profile */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((a, i) => (
                <ActivityItem
                  key={i}
                  icon={activityIcon(a.type)}
                  title={a.title}
                  desc={a.desc}
                  time={a.time}
                  highlight={i === 0 && a.type === 'service_request'}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No recent activity yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Your Profile</h3>
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-sm text-slate-500">{user.organisation}</p>
            <p className="text-xs text-slate-400 mt-1">{user.location}</p>
          </div>
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Profile Completion</span>
              <span className="font-semibold text-slate-800">{user.profileComplete}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${user.profileComplete}%` }} />
            </div>
          </div>
          {isPaid && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Verification</span>
                {user.verified ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Verified
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="text-purple-600 font-medium">{user.subscriptionPlan}</span>
              </div>
            </div>
          )}
          <Link to="/provider/profile" className="mt-5 block w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Completion Banner */}
      {user.profileComplete < 100 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><HandWave className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" /></div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Complete your profile</h3>
              <p className="text-sm text-amber-700 mt-0.5">Your profile is {user.profileComplete}% complete. A complete profile helps participants find you.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-32 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${user.profileComplete}%` }} />
            </div>
            <Link to="/provider/profile" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Free Tier Upgrade Banner */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Unlock Client Referrals & Premium Tools</h3>
              <p className="text-purple-100 mt-1 text-sm max-w-xl">Upgrade to Growth & Referral to receive direct participant referrals, enhanced directory visibility, messaging, and job board access.</p>
            </div>
            <Link to="/provider/upgrade" className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg flex-shrink-0">
              View Plans →
            </Link>
          </div>
        </div>
      )}

      {/* ─── Featured Partners Ribbon ─────────────────────────────────── */}
      {featuredPartners.length > 0 && <FeaturedPartnersRibbon partners={featuredPartners} />}

    </div>
  );
};

// ─── Featured Partners Ribbon ─────────────────────────────────────────────────
// Scrolling marquee of providers who have the Marketing add-on subscription.
// `partners` comes from the API (data.featuredPartners): [{ id, name, initials, bg, url }]

function FeaturedPartnersRibbon({ partners }) {
  const track = [...partners, ...partners]; // duplicate for seamless loop

  return (
    <div className="w-full">

      {/* Header row */}
      <div className="flex items-center gap-3 mb-2.5 px-1">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
          Featured Partners
        </span>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 whitespace-nowrap">Sponsored · Marketing add-on</span>
      </div>

      {/* Ribbon container */}
      <div className="relative">

        {/* Drop shadow under ribbon */}
        <div
          className="absolute bottom-0 left-8 right-8 h-4 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
            filter: 'blur(4px)',
            transform: 'translateY(8px)',
          }}
        />

        {/* Ribbon shape wrapper */}
        <div className="relative overflow-hidden" style={{ height: '72px' }}>

          {/* SVG ribbon background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 900 72"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ribGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#1d4ed8" />
                <stop offset="25%"  stopColor="#4f46e5" />
                <stop offset="50%"  stopColor="#7c3aed" />
                <stop offset="70%"  stopColor="#c026d3" />
                <stop offset="85%"  stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
                <stop offset="40%"  stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </linearGradient>

              <linearGradient id="foldL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#1e3a8a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="foldR" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#ea580c" stopOpacity="0" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            <path d="M0,8 L34,36 L0,64 L900,64 L866,36 L900,8 Z" fill="url(#ribGrad)" />
            <path d="M0,8 L34,36 L0,64 L900,64 L866,36 L900,8 Z" fill="url(#shineGrad)" />
            <path d="M0,8 L46,36 L0,64 L90,64 L90,8 Z" fill="url(#foldL)" opacity="0.5" />
            <path d="M810,8 L810,64 L900,64 L866,36 L900,8 Z" fill="url(#foldR)" opacity="0.5" />
            <path d="M34,8 L866,8" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
            <path d="M0,64 L900,64" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
          </svg>

          {/* Scrolling logos on top of ribbon */}
          <div className="absolute inset-0 overflow-hidden flex items-center px-12">
            <style>{`
              @keyframes ribbon-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .ribbon-track {
                display: flex;
                align-items: center;
                width: max-content;
                animation: ribbon-scroll 32s linear infinite;
              }
              .ribbon-track:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="ribbon-track">
              {track.map((sponsor, i) => (
                <a
                  key={`${sponsor.id}-${i}`}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 mx-4 flex-shrink-0 group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      backgroundColor: sponsor.bg,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {sponsor.initials}
                  </div>

                  <span className="text-sm font-medium text-white whitespace-nowrap group-hover:text-yellow-200 transition-colors"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                  >
                    {sponsor.name}
                  </span>

                  <span className="mx-2 opacity-30 text-white text-lg leading-none flex-shrink-0">·</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


// ─── Sub-components ───────────────────────────────────────────────

function AnalyticsCard({ label, value, change, positive, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">{icon}</div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time, highlight }) {
  return (
    <div className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-colors ${highlight ? 'bg-purple-50/50 border border-purple-100' : 'hover:bg-slate-50'}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-slate-800">{title}</p>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
        <span className="text-[10px] sm:hidden text-slate-400 mt-0.5 block">{time}</span>
      </div>
      <span className="text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap hidden sm:block">{time}</span>
    </div>
  );
}

export default ProviderDashboardHome;