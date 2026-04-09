import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  selectUser,
  selectIsProvider,
  selectIsParticipant,
  selectIsAdmin,
  selectIsPaid,
  selectDummyUsers,
} from '../../store/slices/authSlice';
import { switchProfile } from '../../store/slices/authSlice';
import { logoutUser } from '../../store/actions/authActions';
import {
  Home,
  User,
  MessageSquare,
  Search,
  Inbox,
  Calendar,
  Lightbulb,
  MessageCircle,
  Briefcase,
  Megaphone,
  FileText,
  BookOpen,
  Shield,
  Heart,
  Star,
  Bot,
  Headphones,
  ChevronsLeft,
  X,
  ChevronsUpDown,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';

const DashboardSidebar = ({ isCollapsed, isMobile, onToggle, onMobileClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isProvider = useSelector(selectIsProvider);
  const isParticipant = useSelector(selectIsParticipant);
  const isAdmin = useSelector(selectIsAdmin);
  const isPaid = useSelector(selectIsPaid);
  const dummyUsers = useSelector(selectDummyUsers);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const collapsed = isMobile ? false : isCollapsed;

  // Get base path based on role
  const basePath = isAdmin ? '/admin' : isProvider ? '/provider' : '/participant';

  // Admin navigation
  const adminNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', end: true, tier: 'all' },
    { label: 'Manage Users', icon: Users, path: '/admin/users', tier: 'all' },
    { label: 'Manage Providers', icon: Briefcase, path: '/admin/providers', tier: 'all' },
    { label: 'Manage Participants', icon: Heart, path: '/admin/participants', tier: 'all' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics', tier: 'all' },
    { label: 'Settings', icon: Settings, path: '/admin/settings', tier: 'all' },
  ];

  // Provider navigation
  const providerNavItems = [
    { label: 'Home', icon: Home, path: `${basePath}`, end: true, tier: 'all' },
    { label: 'Profile & Services', icon: User, path: `${basePath}/profile`, tier: 'all' },
    { label: 'Messages', icon: MessageSquare, path: `${basePath}/messaging`, tier: 'all' },
    { label: 'Business Directory', icon: Search, path: `${basePath}/directory`, tier: 'all' },
    { label: 'Service Requests', icon: Inbox, path: `${basePath}/requests`, tier: 'paid', badge: isPaid ? '3' : null },
    { label: 'Events & Networking', icon: Calendar, path: `${basePath}/events`, tier: 'all' },
    { label: 'Innovation Lab', icon: Lightbulb, path: `${basePath}/innovation-lab`, tier: 'all' },
    { label: 'Q&A Forum', icon: MessageCircle, path: `${basePath}/qa`, tier: 'all' },
    { label: 'Job Board', icon: Briefcase, path: `${basePath}/jobs`, tier: 'paid' },
    { label: 'Marketing', icon: Megaphone, path: `${basePath}/marketing`, tier: 'paid' },
    { label: 'Documents', icon: FileText, path: `${basePath}/documents`, tier: 'all' },
  ];

  // Participant navigation
  const participantNavItems = [
    { label: 'Home', icon: Home, path: `${basePath}`, end: true, tier: 'all' },
    { label: 'My Profile', icon: User, path: `${basePath}/profile`, tier: 'all' },
    { label: 'Connect with Services', icon: Search, path: `${basePath}/services`, tier: 'all' },
    { label: 'Messages', icon: MessageSquare, path: `${basePath}/messaging`, tier: 'all' },
    { label: 'Subscription', icon: Star, path: `${basePath}/upgrade`, tier: 'all' },
    { label: 'Documents', icon: FileText, path: `${basePath}/documents`, tier: 'all' },
    { label: 'Learning Hub', icon: BookOpen, path: `${basePath}/learning`, tier: 'all' },
    { label: 'Message Board', icon: MessageCircle, path: `${basePath}/messages`, tier: 'all' },
    { label: 'Job Board', icon: Briefcase, path: `${basePath}/jobs`, tier: 'all' },
    { label: 'Events', icon: Calendar, path: `${basePath}/events`, tier: 'all' },
    { label: 'Rights & Safety', icon: Shield, path: `${basePath}/rights-safety`, tier: 'all' },
    { label: 'My Plan Buddy', icon: Heart, path: `${basePath}/plan-buddy`, tier: 'paid' },
  ];

  const bottomNavItems = [
    { label: isProvider ? 'AI Support' : isAdmin ? 'AI Assistant' : 'Ask AI', icon: Bot, path: `${basePath}/ai-support`, tier: 'all' },
    ...(!isAdmin && !isPaid ? [{ label: 'Upgrade Plan', icon: Star, path: `${basePath}/upgrade`, tier: 'all' }] : []),
    { label: 'Connect with Admin', icon: Headphones, path: `${basePath}/admin-support`, tier: 'all' },
  ];

  const navItems = isAdmin
    ? adminNavItems
    : isProvider
      ? providerNavItems
      : participantNavItems;

  const filteredNav = navItems.filter(
    (item) => item.tier === 'all' || (item.tier === 'paid' && isPaid)
  );

  const profileLabels = {
    'admin@bettertogether.com': { label: 'Admin', short: 'AD' },
    'provider.free@test.com': { label: 'Provider (Free)', short: 'PF' },
    'provider.paid@test.com': { label: 'Provider (Paid)', short: 'PP' },
    'participant.free@test.com': { label: 'Participant (Free)', short: 'CF' },
    'participant.paid@test.com': { label: 'Participant (Paid)', short: 'CP' },
  };

  const handleProfileSwitch = (email) => {
    dispatch(switchProfile(email));
    setShowProfileSwitcher(false);
    const role = dummyUsers[email]?.role;
    const redirectMap = { admin: '/admin', provider: '/provider', participant: '/participant' };
    navigate(redirectMap[role] || '/');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <aside
      className={`h-screen text-white flex flex-col transition-all duration-300 ease-in-out ${
        isAdmin
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
          : isProvider
            ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900'
      } ${collapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 h-20 border-b border-white/10 flex-shrink-0 bg-white">
        {isMobile && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 lg:hidden flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <img src="/uploads/logo.jpg" className="w-24" alt="Logo" />
              <p className="text-[11px] text-slate-400 truncate">
                {isAdmin ? 'Admin Panel' : isProvider ? 'Provider Portal' : 'Participant Portal'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-black flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronsLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* User Profile Card */}
      <div className={`px-3 py-4 border-b border-white/10 flex-shrink-0 ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
            {user?.name?.split(' ').map((n) => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {isPaid ? (user?.subscriptionPlan || 'Paid Plan') : 'Free Plan'}
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
        <div className="my-3 mx-3 border-t border-white/10" />

        {/* Bottom nav items */}
        {bottomNavItems.map((item) => (
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
            <ChevronsUpDown className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {!collapsed && (
              <span className="text-amber-400 font-medium truncate">
                Demo: {profileLabels[user?.email]?.label || user?.role}
              </span>
            )}
          </button>

          {showProfileSwitcher && (
            <div
              className={`absolute bottom-full mb-2 ${
                collapsed ? 'left-full ml-2' : 'left-0 right-0'
              } bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[220px] z-50`}
            >
              <div className="p-2 border-b border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-2">
                  Switch Demo Profile
                </p>
              </div>
              {Object.keys(dummyUsers).map((email) => (
                <button
                  key={email}
                  onClick={() => handleProfileSwitch(email)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    user?.email === email
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {profileLabels[email]?.label || email}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm ${collapsed ? 'justify-center px-0' : ''}`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Exit to Website</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
