import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const DashboardSidebar = ({ isCollapsed, isMobile, onToggle, onMobileClose }) => {
  const { user, isProvider, isAdmin, isPaid, logout, switchProfile, currentProfile, availableProfiles } = useAuth();
  const navigate = useNavigate();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // On mobile, always show expanded sidebar
  const collapsed = isMobile ? false : isCollapsed;

  // Provider (Business) navigation items
  const providerNavItems = [
    { label: 'Home', icon: HomeIcon, path: '/dashboard', end: true, tier: 'all' },
    { label: 'Profile & Services', icon: ProfileIcon, path: '/dashboard/profile', tier: 'all' },
    { label: 'Messages', icon: ChatIcon, path: '/dashboard/messaging', tier: 'all' },
    { label: 'Business Directory', icon: DirectoryIcon, path: '/dashboard/directory', tier: 'all' },
    { label: 'Service Requests', icon: InboxIcon, path: '/dashboard/requests', tier: 'paid', badge: isPaid ? '3' : null },
    { label: 'Events & Networking', icon: CalendarIcon, path: '/dashboard/events', tier: 'all' },
    { label: 'Innovation Lab', icon: LightbulbIcon, path: '/dashboard/innovation-lab', tier: 'all' },
    // { label: 'Library', icon: LibraryIcon, path: '/dashboard/library', tier: 'all' },
    { label: 'Q&A Forum', icon: ChatBubbleIcon, path: '/dashboard/qa', tier: 'all' },
    { label: 'Job Board', icon: BriefcaseIcon, path: '/dashboard/jobs', tier: 'paid' },
    { label: 'Marketing', icon: MegaphoneIcon, path: '/dashboard/marketing', tier: 'paid' },
    { label: 'Documents', icon: DocumentIcon, path: '/dashboard/documents', tier: 'all' },
  ];

  // Participant navigation items
  const participantNavItems = [
    { label: 'Home', icon: HomeIcon, path: '/dashboard', end: true, tier: 'all' },
    { label: 'My Profile', icon: ProfileIcon, path: '/dashboard/profile', tier: 'all' },
    { label: 'Connect with Services', icon: DirectoryIcon, path: '/dashboard/services', tier: 'all' },
    { label: 'Messages', icon: ChatIcon, path: '/dashboard/messaging', tier: 'all' },
    { label: 'Subscription', icon: StarIcon, path: '/dashboard/upgrade', tier: 'all' },
    { label: 'Documents', icon: DocumentIcon, path: '/dashboard/documents', tier: 'all' },
    { label: 'Learning Hub', icon: BookOpenIcon, path: '/dashboard/learning', tier: 'all' },
    { label: 'Message Board', icon: ChatBubbleIcon, path: '/dashboard/messages', tier: 'all' },
    { label: 'Job Board', icon: BriefcaseIcon, path: '/dashboard/jobs', tier: 'all' },
    { label: 'Events', icon: CalendarIcon, path: '/dashboard/events', tier: 'all' },
    // { label: 'Library', icon: LibraryIcon, path: '/dashboard/library', tier: 'all' },
    { label: 'Rights & Safety', icon: ShieldIcon, path: '/dashboard/rights-safety', tier: 'all' },
    { label: 'My Plan Buddy', icon: HeartIcon, path: '/dashboard/plan-buddy', tier: 'paid' },
  ];

  // Admin navigation items
  const adminNavItems = [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard', end: true, tier: 'all' },
    { label: 'User Management', icon: ProfileIcon, path: '/dashboard/admin/users', tier: 'all' },
    { label: 'Provider Approvals', icon: ShieldIcon, path: '/dashboard/admin/approvals', tier: 'all', badge: '12' },
    { label: 'Support Tickets', icon: HeadsetIcon, path: '/dashboard/admin/tickets', tier: 'all', badge: '8' },
    { label: 'Content Management', icon: DocumentIcon, path: '/dashboard/admin/content', tier: 'all' },
    { label: 'Subscriptions', icon: StarIcon, path: '/dashboard/admin/subscriptions', tier: 'all' },
    { label: 'Reports & Analytics', icon: ChatBubbleIcon, path: '/dashboard/admin/reports', tier: 'all' },
    { label: 'Platform Settings', icon: LightbulbIcon, path: '/dashboard/admin/settings', tier: 'all' },
  ];

  const bottomNavItems = [
    { label: isProvider ? 'AI Support' : 'Ask AI', icon: AiIcon, path: '/dashboard/ai-support', tier: 'all' },
    { label: 'Upgrade Plan', icon: StarIcon, path: '/dashboard/upgrade', tier: 'free' },
    { label: 'Connect with Admin', icon: HeadsetIcon, path: '/dashboard/admin-support', tier: 'all' },
  ];

  const navItems = isAdmin ? adminNavItems : isProvider ? providerNavItems : participantNavItems;

  const filteredNav = navItems.filter(item => item.tier === 'all' || (item.tier === 'paid' && isPaid));
  const filteredBottom = bottomNavItems.filter(item => item.tier === 'all' || (item.tier === 'free' && !isPaid));

  const profileLabels = {
    providerFree: { label: 'Provider (Free)', short: 'PF' },
    providerPaid: { label: 'Provider (Paid)', short: 'PP' },
    participantFree: { label: 'Participant (Free)', short: 'CF' },
    participantPaid: { label: 'Participant (Paid)', short: 'CP' },
    admin: { label: 'Admin', short: 'AD' },
  };

  const handleProfileSwitch = (key) => {
    switchProfile(key);
    setShowProfileSwitcher(false);
    navigate('/dashboard');
  };

  return (
    <aside
    className={`h-screen text-white flex flex-col transition-all duration-300 ease-in-out ${
    isAdmin
      ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      : isProvider
        ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950'
        : 'bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900'
  } ${collapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 h-20 border-b border-white/10 flex-shrink-0 bg-[#fff]">
        {/* Mobile close button */}
        {isMobile && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 lg:hidden flex-shrink-0"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            {/* <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">BT</span>
            </div> */}
            <div className="min-w-0">
              <img src="/uploads/logo.jpg" className='w-24' alt="" />  
              {/* <p className="text-sm font-semibold text-white truncate">The Better Together</p> */}
              <p className="text-[11px] text-slate-400 truncate">
                {isAdmin ? 'Admin Portal' : isProvider ? 'Provider Portal' : 'Participant Portal'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-black flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* User Profile Card */}
      <div className={`px-3 py-4 border-b border-white/10 flex-shrink-0 ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {isPaid ? (user.subscriptionPlan || 'Paid Plan') : 'Free Plan'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-white/10"></div>

        {/* Bottom nav items */}
        {filteredBottom.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Demo Profile Switcher */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            {!collapsed && (
              <span className="text-amber-400 font-medium truncate">
                Demo: {profileLabels[currentProfile]?.label}
              </span>
            )}
          </button>

          {showProfileSwitcher && (
            <div className={`absolute bottom-full mb-2 ${collapsed ? 'left-full ml-2' : 'left-0 right-0'} bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[220px] z-50`}>
              <div className="p-2 border-b border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-2">Switch Demo Profile</p>
              </div>
              {availableProfiles.map((key) => (
                <button
                  key={key}
                  onClick={() => handleProfileSwitch(key)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    currentProfile === key
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {profileLabels[key]?.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm ${collapsed ? 'justify-center px-0' : ''}`}
          title="Logout"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

// ─── Icon Components ─────────────────────────────────────────────
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DirectoryIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function AiIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Outer chip */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        strokeWidth={1.8}
      />

      {/* Circuit lines */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 9v6M9 12h6"
      />

      {/* Pins */}
      <path
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"
      />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function LightbulbIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function LibraryIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function MegaphoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function HeadsetIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ProfileIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChatBubbleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

export default DashboardSidebar;