import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Card } from '../../components/ui';
import {
  Home, Calendar, Search, Lightbulb, BookOpen, MessageCircle, Bot, Star,
  Mic, Inbox, Briefcase, Megaphone, Settings, Mail, User, Hand as HandWave,
  Bell, Eye, Users, Zap, CheckCircle, ShieldCheck, TrendingUp, BarChart3,
  ArrowRight, Sparkles, Crown, Edit, ChevronDown, MapPin, Phone, Globe,
} from '../../components/Icons';

// ─── Service categories (matching document spec) ─────────────────
const SERVICE_CATEGORIES = [
  { id: 'ndis', label: 'NDIS Supports', color: 'bg-purple-100 text-purple-700' },
  { id: 'aged', label: 'Aged Care Supports', color: 'bg-blue-100 text-blue-700' },
  { id: 'health', label: 'Health & Medical', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'education', label: 'Education & Early Learning', color: 'bg-amber-100 text-amber-700' },
  { id: 'mental', label: 'Mental Health & Wellbeing', color: 'bg-pink-100 text-pink-700' },
  { id: 'tac', label: 'TAC, WorkSafe & Injury', color: 'bg-red-100 text-red-700' },
  { id: 'equipment', label: 'Equipment & Technology', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'business', label: 'Business & Professional', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'community', label: 'Community & Inclusion', color: 'bg-teal-100 text-teal-700' },
];

// ─── Mock sponsor data ────────────────────────────────────────────
const SPONSORS = [
  { id: 1,  name: 'Sunrise Support Services', initials: 'SS', bg: '#f59e0b', url: '#' },
  { id: 2,  name: 'CarePath NDIS',             initials: 'CP', bg: '#3b82f6', url: '#' },
  { id: 3,  name: 'EnableLife',                initials: 'EL', bg: '#10b981', url: '#' },
  { id: 4,  name: 'Allied Health Hub',         initials: 'AH', bg: '#8b5cf6', url: '#' },
  { id: 5,  name: 'Bright Futures Care',       initials: 'BF', bg: '#ef4444', url: '#' },
  { id: 6,  name: 'Harmony Support',           initials: 'HS', bg: '#06b6d4', url: '#' },
  { id: 7,  name: 'Ability Connect',           initials: 'AC', bg: '#f97316', url: '#' },
  { id: 8,  name: 'PlanCare Pro',              initials: 'PC', bg: '#ec4899', url: '#' },
  { id: 9,  name: 'NextStep Therapy',          initials: 'NT', bg: '#14b8a6', url: '#' },
  { id: 10, name: 'Empower NDIS Group',        initials: 'EG', bg: '#a855f7', url: '#' },
];

// ─── Mock notifications ───────────────────────────────────────────
const MOCK_NOTIFICATIONS = {
  free: [
    { id: 1, icon: <Calendar className="w-4 h-4" />, text: 'New event near you: Provider Connect Breakfast', time: '1h ago', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, icon: <Search className="w-4 h-4" />, text: 'Allied Health Plus joined the directory', time: '3h ago', color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 3, icon: <MessageCircle className="w-4 h-4" />, text: 'New Q&A discussion: NDIS pricing updates', time: '1d ago', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ],
  paid: [
    { id: 1, icon: <Inbox className="w-4 h-4" />, text: 'New service request from Melbourne CBD', time: '5m ago', color: 'text-purple-600', bg: 'bg-purple-50', highlight: true },
    { id: 2, icon: <Calendar className="w-4 h-4" />, text: 'Event RSVP confirmed: Provider Networking Meetup', time: '2h ago', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 3, icon: <Users className="w-4 h-4" />, text: 'Profile viewed by 4 participants this week', time: '4h ago', color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 4, icon: <MessageCircle className="w-4 h-4" />, text: 'New reply to your compliance question', time: '1d ago', color: 'text-pink-600', bg: 'bg-pink-50' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────
const ProviderDashboardHome = () => {
  const { user, isPaid } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedServices, setSelectedServices] = useState(['ndis', 'health']);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const freeTiles = [
    { label: 'Home',               icon: <Home />,           path: '/dashboard',              color: 'from-purple-500 to-purple-700' },
    { label: 'Events & Networking', icon: <Calendar />,       path: '/dashboard/events',       color: 'from-violet-500 to-purple-600' },
    { label: 'Provider Directory',  icon: <Search />,         path: '/dashboard/directory',    color: 'from-blue-500 to-cyan-600' },
    { label: 'Innovation Lab',     icon: <Lightbulb />,      path: '/dashboard/innovation-lab', color: 'from-amber-500 to-orange-600' },
    { label: 'Library',            icon: <BookOpen />,       path: '/dashboard/library',      color: 'from-emerald-500 to-teal-600' },
    { label: 'Q&A Forum',          icon: <MessageCircle />,  path: '/dashboard/qa',           color: 'from-pink-500 to-rose-600' },
    { label: 'AI Support',         icon: <Bot />,            path: '/dashboard/ai-support',   color: 'from-indigo-500 to-blue-600' },
    { label: 'Update Subscription', icon: <Star />,          path: '/dashboard/upgrade',      color: 'from-yellow-500 to-amber-600' },
    { label: 'Connect with Admin', icon: <Mic />,            path: '/dashboard/admin-support', color: 'from-slate-500 to-slate-700' },
  ];

  const paidTiles = [
    { label: 'Home',               icon: <Home />,           path: '/dashboard',              color: 'from-purple-500 to-purple-700' },
    { label: 'Service Requests',   icon: <Inbox />,          path: '/dashboard/requests',     color: 'from-violet-500 to-purple-600', badge: '3' },
    { label: 'Events & Networking', icon: <Calendar />,      path: '/dashboard/events',       color: 'from-blue-500 to-cyan-600' },
    { label: 'Provider Directory', icon: <Search />,         path: '/dashboard/directory',    color: 'from-teal-500 to-emerald-600' },
    { label: 'Job Board',          icon: <Briefcase />,      path: '/dashboard/jobs',         color: 'from-amber-500 to-orange-600' },
    { label: 'Innovation Lab',    icon: <Lightbulb />,      path: '/dashboard/innovation-lab', color: 'from-pink-500 to-rose-600' },
    { label: 'Library',            icon: <BookOpen />,       path: '/dashboard/library',      color: 'from-emerald-500 to-teal-600' },
    { label: 'Q&A Forum',          icon: <MessageCircle />,  path: '/dashboard/qa',           color: 'from-indigo-500 to-blue-600' },
    { label: 'Marketing',          icon: <Megaphone />,      path: '/dashboard/marketing',    color: 'from-red-500 to-pink-600' },
    { label: 'AI Support',         icon: <Bot />,            path: '/dashboard/ai-support',   color: 'from-purple-500 to-indigo-600' },
    { label: 'Update Subscription', icon: <Settings />,      path: '/dashboard/upgrade',      color: 'from-slate-500 to-slate-700' },
    { label: 'Connect with Admin', icon: <Mic />,            path: '/dashboard/admin-support', color: 'from-gray-600 to-gray-800' },
  ];

  const tiles = isPaid ? paidTiles : freeTiles;

  const analytics = user.analytics || {
    profileViews: 0,
    referralsThisMonth: 0,
    eventEngagement: 0,
    responseRate: '0%',
  };

  const notifications = isPaid ? MOCK_NOTIFICATIONS.paid : MOCK_NOTIFICATIONS.free;

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ─── Welcome Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user.name?.split(' ')[0] || 'Provider'}
            </h1>
            <p className="text-purple-100 mt-1.5 text-sm sm:text-base">
              {isPaid
                ? 'Your dashboard is ready. Here is what is happening today.'
                : 'Explore your portal and connect with the NDIS community.'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {isPaid && (
              <VerificationBadge verified={true} />
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/20">
              <Crown className="w-3.5 h-3.5" />
              {isPaid ? user.subscriptionPlan || 'Growth Plan' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Analytics Cards (Paid Only) ────────────────────────────── */}
      {isPaid && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <AnalyticsCard
            label="Profile Views"
            value={analytics.profileViews}
            change="+12%"
            positive
            icon={<Eye className="w-5 h-5" />}
            gradient="from-purple-500 to-purple-600"
          />
          <AnalyticsCard
            label="Referrals"
            value={analytics.referralsThisMonth}
            change="+3"
            positive
            icon={<Users className="w-5 h-5" />}
            gradient="from-blue-500 to-cyan-600"
          />
          <AnalyticsCard
            label="Event Engagement"
            value={analytics.eventEngagement}
            change="+2"
            positive
            icon={<BarChart3 className="w-5 h-5" />}
            gradient="from-pink-500 to-rose-600"
          />
          <AnalyticsCard
            label="Response Rate"
            value={analytics.responseRate}
            change=""
            positive
            icon={<Zap className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
          />
        </div>
      )}

      {/* ─── Portal Sections Grid ───────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Portal Sections</h2>
          <span className="text-xs text-slate-400 hidden sm:block">
            {isPaid ? '12 sections available' : '9 sections available'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.path}
              className="group relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-2xl`} />

              {tile.badge && (
                <span className="absolute top-3 right-3 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full flex items-center justify-center animate-pulse">
                  {tile.badge}
                </span>
              )}

              <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 text-white`}>
                {tile.icon}
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors leading-tight">
                {tile.label}
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-500 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Notifications + Profile Sidebar ────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Notifications Panel */}
        <Card className="lg:col-span-2" padding="p-0">
          <div className="flex items-center justify-between p-5 pb-0 sm:p-6 sm:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Notifications</h3>
            </div>
            {notifications.length > 0 && (
              <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                {notifications.length} new
              </span>
            )}
          </div>
          <div className="p-4 sm:p-6 pt-3 sm:pt-4 space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  notif.highlight
                    ? 'bg-purple-50/70 border border-purple-100'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${notif.bg} ${notif.color} flex items-center justify-center flex-shrink-0`}>
                  {notif.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 leading-snug">{notif.text}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">{notif.time}</span>
                </div>
                {notif.highlight && (
                  <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Panel – Interactive */}
        <Card padding="p-0">
          <div className="p-5 sm:p-6">
            {/* Avatar + Upload */}
            <div className="text-center mb-5">
              <div className="relative inline-block group">
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white mx-auto" style={{ width: '72px', height: '72px' }}>
                  {user.name?.split(' ').map(n => n[0]).join('') || 'P'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-colors">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {isPaid && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="font-bold text-slate-800 mt-3">{user.name}</p>
              <p className="text-sm text-slate-500">{user.organisation}</p>
              {user.location && (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </p>
              )}
            </div>

            {/* Verification Status */}
            {isPaid && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-700">Verified Provider</span>
              </div>
            )}

            {/* Quick Info Toggle */}
            <button
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors mb-3"
            >
              <span className="text-xs font-medium text-slate-600">Quick Details</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileEdit ? 'rotate-180' : ''}`} />
            </button>

            {showProfileEdit && (
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600">0412 345 678</span>
                </div>
                {user.organisation && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 truncate">{user.organisation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Industry Registrations – Service Categories */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Services Offered</span>
                <button
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                  className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {showServiceDropdown ? 'Done' : '+ Edit'}
                </button>
              </div>

              {/* Service category tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedServices.map(id => {
                  const cat = SERVICE_CATEGORIES.find(c => c.id === id);
                  return cat ? (
                    <span key={id} className={`text-[10px] font-medium px-2 py-1 rounded-full ${cat.color}`}>
                      {cat.label}
                    </span>
                  ) : null;
                })}
                {selectedServices.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic">No services selected</span>
                )}
              </div>

              {/* Dropdown selector */}
              {showServiceDropdown && (
                <div className="border border-slate-200 rounded-xl p-2 space-y-1 max-h-48 overflow-y-auto">
                  {SERVICE_CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(cat.id)}
                        onChange={() => {
                          setSelectedServices(prev =>
                            prev.includes(cat.id)
                              ? prev.filter(s => s !== cat.id)
                              : [...prev, cat.id]
                          );
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-slate-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Completion */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Profile completion</span>
                <span className="font-bold text-slate-800">{user.profileComplete}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 relative"
                  style={{ width: `${user.profileComplete}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
                </div>
              </div>
              {user.profileComplete < 100 && (
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Complete your profile to increase visibility
                </p>
              )}
            </div>

            {/* Plan Info */}
            {isPaid && (
              <div className="flex items-center justify-between text-sm py-2.5 border-t border-slate-100">
                <span className="text-slate-500">Current plan</span>
                <span className="font-semibold text-purple-600">{user.subscriptionPlan}</span>
              </div>
            )}
          </div>

          {/* Edit Profile Link */}
          <div className="border-t border-slate-100 p-4 flex gap-2">
            <Link
              to="/dashboard/profile"
              className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 text-sm font-semibold rounded-xl transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-all duration-200"
              title="Notification Preferences"
            >
              <Bell className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* ─── Profile Completion Banner ──────────────────────────────── */}
      {user.profileComplete < 100 && (
        <Card padding="p-0" className="overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200/50">
                <HandWave className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Complete your profile to stand out</h3>
                <p className="text-sm text-amber-700 mt-0.5">
                  Your profile is {user.profileComplete}% complete. A full profile helps participants find and trust you.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-32 h-2.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${user.profileComplete}%` }}
                />
              </div>
              <Link
                to="/dashboard/profile"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-200/50"
              >
                Complete Now
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* ─── Upgrade Banner (Free Users) ────────────────────────────── */}
      {!isPaid && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 sm:p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">Premium</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Unlock Client Referrals & Premium Tools
              </h3>
              <p className="text-purple-100 mt-2 text-sm max-w-xl leading-relaxed">
                Upgrade to Growth & Referral to receive direct participant referrals, enhanced directory visibility, messaging, job board access, and marketing tools.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <UpgradeFeature text="Direct Referrals" />
                <UpgradeFeature text="Job Board" />
                <UpgradeFeature text="Marketing Tools" />
                <UpgradeFeature text="Analytics" />
              </div>
            </div>
            <Link
              to="/dashboard/upgrade"
              className="px-7 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-xl flex-shrink-0 flex items-center gap-2"
            >
              View Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ─── Featured Partners Ribbon ───────────────────────────────── */}
      <FeaturedPartnersRibbon />

    </div>
  );
};

// ─── Upgrade Feature Pill ─────────────────────────────────────────
function UpgradeFeature({ text }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
      <CheckCircle className="w-3 h-3" />
      {text}
    </span>
  );
}

// ─── Verification Badge ───────────────────────────────────────────
function VerificationBadge({ verified }) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 border border-emerald-400/20">
      <ShieldCheck className="w-3.5 h-3.5" />
      Verified
    </span>
  );
}

// ─── Analytics Card ───────────────────────────────────────────────
function AnalyticsCard({ label, value, change, positive, icon, gradient }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200" padding="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        {change && (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </Card>
  );
}

// ─── Featured Partners Ribbon ─────────────────────────────────────
function FeaturedPartnersRibbon() {
  const track = [...SPONSORS, ...SPONSORS];

  return (
    <div className="w-full">

      {/* Header row */}
      <div className="flex items-center gap-3 mb-2.5 px-1">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
          Featured Partners
        </span>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 whitespace-nowrap">Sponsored</span>
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
                <stop offset="0%"   stopColor="#7c3aed" />
                <stop offset="25%"  stopColor="#8b5cf6" />
                <stop offset="50%"  stopColor="#a855f7" />
                <stop offset="70%"  stopColor="#c026d3" />
                <stop offset="85%"  stopColor="#db2777" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>

              <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
                <stop offset="40%"  stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </linearGradient>

              <linearGradient id="foldL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#4c1d95" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="foldR" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#e11d48" stopOpacity="0" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0.85" />
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

                  <span
                    className="text-sm font-medium text-white whitespace-nowrap group-hover:text-yellow-200 transition-colors"
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

      {/* Footer CTA */}
      <div className="flex items-center justify-center gap-2 mt-2.5">
        <span className="text-[11px] text-slate-400">Want your logo here?</span>
        <Link
          to="/dashboard/marketing"
          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 transition-colors"
        >
          Add Marketing add-on →
        </Link>
      </div>

    </div>
  );
}

export default ProviderDashboardHome;
