import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Link2, Briefcase, MessageCircle, Calendar, Shield, Mic, Star, Heart, Search, Send, ClipboardList, Scale, Edit, Phone, Settings, Sparkles } from '../../components/Icons';

const ParticipantDashboardHome = () => {
  const { user, isPaid } = useAuth();

  // Free participant tiles
  const freeTiles = [
    { label: 'Learning Hub', icon: <BookOpen className="w-6 h-6 text-white" />, path: '/dashboard/learning', desc: 'Guides, videos & tips', color: 'from-blue-500 to-indigo-600' },
    { label: 'Connect with Services', icon: <Link2 className="w-6 h-6 text-white" />, path: '/dashboard/services', desc: 'Find local providers', color: 'from-violet-500 to-purple-600' },
    { label: 'Job Board', icon: <Briefcase className="w-6 h-6 text-white" />, path: '/dashboard/jobs', desc: 'Employment opportunities', color: 'from-amber-500 to-orange-600' },
    { label: 'Message Board', icon: <MessageCircle className="w-6 h-6 text-white" />, path: '/dashboard/messages', desc: 'Community discussions', color: 'from-emerald-500 to-teal-600' },
    { label: 'Events', icon: <Calendar className="w-6 h-6 text-white" />, path: '/dashboard/events', desc: 'Workshops & gatherings', color: 'from-pink-500 to-rose-600' },
    { label: 'Library', icon: <BookOpen className="w-6 h-6 text-white" />, path: '/dashboard/library', desc: 'Resources & documents', color: 'from-cyan-500 to-blue-600' },
    { label: 'Rights & Safety', icon: <Shield className="w-6 h-6 text-white" />, path: '/dashboard/rights-safety', desc: 'Know your rights', color: 'from-red-500 to-rose-600' },
    { label: 'Connect with Admin', icon: <Mic className="w-6 h-6 text-white" />, path: '/dashboard/admin-support', desc: 'Help & support', color: 'from-slate-500 to-slate-700' },
    { label: 'Upgrade Subscription', icon: <Star className="w-6 h-6 text-white" />, path: '/dashboard/upgrade', desc: 'Get a Plan Buddy', color: 'from-yellow-500 to-amber-600' },
  ];

  // Paid participant tiles
  const paidTiles = [
    { label: 'My Plan Buddy', icon: <Heart className="w-6 h-6 text-white" />, path: '/dashboard/plan-buddy', desc: 'Your personal support', color: 'from-rose-500 to-pink-600', highlight: true },
    { label: 'Learning Hub', icon: <BookOpen className="w-6 h-6 text-white" />, path: '/dashboard/learning', desc: 'Guides, videos & tips', color: 'from-blue-500 to-indigo-600' },
    { label: 'Connect with Services', icon: <Link2 className="w-6 h-6 text-white" />, path: '/dashboard/services', desc: 'Find & bookmark providers', color: 'from-violet-500 to-purple-600' },
    { label: 'Message Board', icon: <MessageCircle className="w-6 h-6 text-white" />, path: '/dashboard/messages', desc: 'Community discussions', color: 'from-emerald-500 to-teal-600' },
    { label: 'Job Board', icon: <Briefcase className="w-6 h-6 text-white" />, path: '/dashboard/jobs', desc: 'Employment opportunities', color: 'from-amber-500 to-orange-600' },
    { label: 'Events', icon: <Calendar className="w-6 h-6 text-white" />, path: '/dashboard/events', desc: 'Workshops & gatherings', color: 'from-pink-500 to-rose-600' },
    { label: 'Library', icon: <BookOpen className="w-6 h-6 text-white" />, path: '/dashboard/library', desc: 'Resources & templates', color: 'from-cyan-500 to-blue-600' },
    { label: 'Rights & Safety', icon: <Shield className="w-6 h-6 text-white" />, path: '/dashboard/rights-safety', desc: 'Know your rights', color: 'from-red-500 to-rose-600' },
    { label: 'Connect with Admin', icon: <Mic className="w-6 h-6 text-white" />, path: '/dashboard/admin-support', desc: 'Help & feedback', color: 'from-slate-500 to-slate-700' },
  ];

  const tiles = isPaid ? paidTiles : freeTiles;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Welcome to your portal, {user.name.split(' ')[0]}!</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {isPaid
                ? 'You have full access to all features including your Personal Plan Buddy.'
                : 'Explore community tools, find services, and connect with others on your NDIS journey.'
              }
            </p>
          </div>
        </div>
      </div>
     {/* Plan Buddy Card — Paid Only */}
      {isPaid && user.planBuddy && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 sm:p-6">
          <div className="flex flex-col min-[400px]:flex-row items-start min-[400px]:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-base sm:text-xl font-bold flex-shrink-0">
                {user.planBuddy.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-purple-600 font-semibold uppercase tracking-wide">Your Plan Buddy</p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{user.planBuddy.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">Next check-in: {new Date(user.planBuddy.nextCheckIn).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <Link
              to="/dashboard/plan-buddy"
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium rounded-xl transition-colors flex-shrink-0"
            >
              Message
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-100">
            <QuickAction icon={<Send className="w-5 h-5 text-purple-600" />} label="Send a question" />
            <QuickAction icon={<ClipboardList className="w-5 h-5 text-purple-600" />} label="View my checklist" />
            <QuickAction icon={<Calendar className="w-5 h-5 text-purple-600" />} label="Schedule check-in" />
            <QuickAction icon={<Scale className="w-5 h-5 text-purple-600" />} label="Advocate help" />
          </div>
        </div>
      )}
      {/* Quick Navigation Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Portal</h2>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.path}
              className={`group relative bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                tile.highlight ? 'border-purple-200 hover:border-purple-300' : 'border-slate-100 hover:border-purple-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
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

      {/* Recent Activity & Quick Info */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">What's Happening</h3>
          <div className="space-y-4">
            <ActivityItem
              icon={<Calendar className="w-5 h-5 text-pink-600" />}
              title="Upcoming event near you"
              desc="Community Workshop: Understanding Your NDIS Plan — Feb 25"
              time="2 days away"
            />
            <ActivityItem
              icon={<Link2 className="w-5 h-5 text-violet-600" />}
              title="New providers in your area"
              desc="3 new providers registered near Sydney this week"
              time="Today"
            />
            <ActivityItem
              icon={<MessageCircle className="w-5 h-5 text-emerald-600" />}
              title="Message board update"
              desc="New discussion: Tips for your first plan meeting"
              time="Yesterday"
            />
            {isPaid && (
              <ActivityItem
                icon={<Heart className="w-5 h-5 text-rose-600" />}
                title="Plan Buddy update"
                desc="Karen sent you a new checklist for your upcoming review"
                time="2 days ago"
                highlight
              />
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Your Profile</h3>

          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-sm text-slate-500">{user.location}</p>
            {isPaid && (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                Personal Support Plus
              </span>
            )}
          </div>

          {/* Completion Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Profile</span>
              <span className="font-semibold text-slate-800">{user.profileComplete}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${user.profileComplete}%` }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <ProfileLink icon={<Phone className="w-4 h-4 text-slate-500" />} label="Update contact details" />
            <ProfileLink icon={<Settings className="w-4 h-4 text-slate-500" />} label="Preferences & needs" />
            <ProfileLink icon={<Star className="w-4 h-4 text-slate-500" />} label="Saved providers" />
          </div>

          <Link
            to="/dashboard/profile"
            className="mt-5 block w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Completion */}
      {user.profileComplete < 100 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Complete your profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add your details so providers can understand your needs ({user.profileComplete}% done)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${user.profileComplete}%` }}
              />
            </div>
            <Link
              to="/dashboard/profile"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
      )}

      {/* Free Tier Upgrade CTA */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Get a Personal Plan Buddy</h3>
              <p className="text-purple-100 mt-1 text-sm max-w-xl">
                Upgrade to Personal Support Plus for $200/year and get guided help from real people — personalised inbox support, monthly check-ins, advocate and lawyer connections, and AAT preparation help.
              </p>
            </div>
            <Link
              to="/dashboard/upgrade"
              className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg flex-shrink-0"
            >
              Learn More →
            </Link>
          </div>
        </div>
      )}

 

      {/* Provider Spotlight Ribbon - Paid participants see marketing */}
      {isPaid && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Featured Providers</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { name: 'Community Care Solutions', tagline: 'Local support workers — taking clients now', color: 'from-purple-500 to-pink-500' },
              { name: 'Allied Health Plus', tagline: 'OT & physio in your home', color: 'from-blue-500 to-cyan-500' },
              { name: 'InReach Therapy', tagline: 'Teletherapy for all ages', color: 'from-emerald-500 to-teal-500' },
            ].map((provider) => (
              <div
                key={provider.name}
                className="flex-shrink-0 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 min-w-[260px]"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{provider.name}</p>
                  <p className="text-xs text-slate-500 truncate">{provider.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────

function ActivityItem({ icon, title, desc, time, highlight }) {
  return (
    <div className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-colors ${highlight ? 'bg-purple-50/50 border border-purple-100' : 'hover:bg-slate-50'}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-slate-800">{title}</p>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
        <span className="text-[10px] sm:hidden text-slate-400 mt-0.5 block">{time}</span>
      </div>
      <span className="text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap hidden sm:block">{time}</span>
    </div>
  );
}

function QuickAction({ icon, label }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 text-slate-700 transition-colors">
      <span>{icon}</span>
      <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
    </button>
  );
}

function ProfileLink({ icon, label }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 transition-colors text-left">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default ParticipantDashboardHome;