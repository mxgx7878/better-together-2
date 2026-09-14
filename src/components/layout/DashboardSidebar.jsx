import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsProvider,
  selectIsAdmin,
  selectIsPaid,
} from "../../store/slices/authSlice";
import { logoutUser } from "../../store/actions/authActions";
import { selectPlanFeatureKeys } from "../../store/slices/authSlice";
import {
  Home,
  User,
  Search,
  Calendar,
  Lightbulb,
  MessageCircle,
  Briefcase,
  FileText,
  BookOpen,
  Shield,
  Star,
  Headphones,
  ChevronsLeft,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Tags,
  CreditCard,
  HeartHandshake,
  Inbox,
  Megaphone,
  HelpCircle,
  Ticket,
  Mail,
  Bookmark,
} from "lucide-react";

const DashboardSidebar = ({
  isCollapsed,
  isMobile,
  onToggle,
  onMobileClose,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isProvider = useSelector(selectIsProvider);
  const isAdmin = useSelector(selectIsAdmin);
  const isPaid = useSelector(selectIsPaid);
  const featureKeys = useSelector(selectPlanFeatureKeys);

  const collapsed = isMobile ? false : isCollapsed;

  const basePath = isAdmin
    ? "/admin"
    : isProvider
      ? "/provider"
      : "/participant";

  // Admin navigation
  const adminNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      end: true,
      tier: "all",
    },
    { label: "Manage Users", icon: Users, path: "/admin/users", tier: "all" },
    {
      label: "Manage Events",
      icon: Calendar,
      path: "/admin/events",
      tier: "all",
    },
            {
      label: "Manage Buddies",
      icon: HeartHandshake,
      path: "/admin/buddies",
      tier: "all",
    },
    {
      label: "Services & Categories",
      icon: Tags,
      path: "/admin/categories",
      tier: "all",
    },
    {
      label: "Service Requests",
      icon: Inbox,
      path: "/admin/service-requests",
      tier: "all",
    },
    {
      label: "User Queries",
      icon: HelpCircle,
      path: "/admin/queries",
      tier: "all",
    },
    {
      label: "Marketing Ribbon",
      icon: Megaphone,
      path: "/admin/marketing-ribbon",
      tier: "all",
    },
    {
      label: "Subscriptions",
      icon: CreditCard,
      path: "/admin/subscriptions",
      tier: "all",
    },
    {
      label: "Manage Coupons",
      icon: Ticket,
      path: "/admin/promo-codes",
      tier: "all",
    },
    {
      label: "Manage Documents",
      icon: FileText,
      path: "/admin/documents",
      tier: "all",
    },
    {
      label: "Learning Hub",
      icon: BookOpen,
      path: "/admin/learning-hub",
      tier: "all",
    },
    {
      label: "Q & A",
      icon: MessageCircle,
      path: "/admin/qa",
      tier: "all",
    },
    {
      label: "Innovation Lab",
      icon: Lightbulb,
      path: "/admin/innovation-lab",
      tier: "all",
    },

    {
      label: "Safety Numbers",
      icon: Shield,
      path: "/admin/safety-numbers",
      tier: "all",
    },

    {
      label: "BroadCast Emails",
      icon: Mail,
      path: "/admin/broadcast-email",
      tier: "all",
    },
    // {
    //   label: "Analytics",
    //   icon: BarChart3,
    //   path: "/admin/analytics",
    //   tier: "all",
    // },
    // { label: "Settings", icon: Settings, path: "/admin/settings", tier: "all" },
  ];

  // Provider navigation
  const providerNavItems = [
    { label: "Home", icon: Home, path: `${basePath}`, end: true, tier: "all" },
    {
      label: "Profile & Services",
      icon: User,
      path: `${basePath}/profile`,
      tier: "all",
    },
    {
      label: "Business Directory",
      icon: Search,
      path: `${basePath}/directory`,
      tier: "all",
    },
    {
      label: "Job Board",
      icon: Briefcase,
      path: `${basePath}/jobs`,
      tier: "all",
    },
    {
      label: "Events & Networking",
      icon: Calendar,
      path: `${basePath}/events`,
      tier: "all",
    },
    {
      label: "Innovation Lab",
      icon: Lightbulb,
      path: `${basePath}/innovation-lab`,
      tier: "all",
    },
    {
      label: "Learning Hub",
      icon: BookOpen,
      path: `${basePath}/learning`,
      tier: "all",
    },
    {
      label: "Q & A",
      icon: MessageCircle,
      path: `${basePath}/qa`,
      tier: "all",
    },
    {
      label: "Documents",
      icon: FileText,
      path: `${basePath}/documents`,
      tier: "all",
    },
    {
      label: "Upgrade Your Subscription",
      icon: Star,
      path: `${basePath}/upgrade`,
      tier: "all",
    },
    {
      label: "Billing",
      icon: CreditCard,
      path: `${basePath}/billing`,
      tier: "all",
    },
  ];

  // Participant navigation
  const participantNavItems = [
    { label: "Home", icon: Home, path: `${basePath}`, end: true, tier: "all" },
    {
      label: "My Profile",
      icon: User,
      path: `${basePath}/profile`,
      tier: "all",
    },
    {
      label: "Provider Directory",
      icon: Search,
      path: `${basePath}/services`,
      tier: "all",
    },
    {
      label: "Saved Providers",
      icon: Bookmark,
      path: `${basePath}/saved-providers`,
      tier: "all",
    },
    {
      label: "Learning Hub",
      icon: BookOpen,
      path: `${basePath}/learning`,
      tier: "all",
    },
    {
      label: "Q & A",
      icon: MessageCircle,
      path: `${basePath}/qa`,
      tier: "all",
    },
    {
      label: "Documents",
      icon: FileText,
      path: `${basePath}/documents`,
      tier: "all",
    },
    {
      label: "Looking for Services",
      icon: Briefcase,
      path: `${basePath}/looking-for-services`,
      tier: "all",
    },
    // {
    //   label: "Events",
    //   icon: Calendar,
    //   path: `${basePath}/events`,
    //   tier: "all",
    // },
    {
      label: "Rights & Safety",
      icon: Shield,
      path: `${basePath}/rights-safety`,
      tier: "all",
    },
    {
      label: "Upgrade Your Subscription",
      icon: Star,
      path: `${basePath}/upgrade`,
      tier: "all",
    },
    {
      label: "Billing",
      icon: CreditCard,
      path: `${basePath}/billing`,
      tier: "all",
    },
    {
      label: "Your Buddy's Profile",
      icon: HeartHandshake,
      path: `${basePath}/plan-buddy`,
      tier: "all",
    },
  ];

  const bottomNavItems = [
    {
      label: "Connect with Admin",
      icon: Headphones,
      path: `${basePath}/admin-support`,
      tier: "all",
    },
  ];

  const navItems = isAdmin
    ? adminNavItems
    : isProvider
      ? providerNavItems
      : participantNavItems;

  const filteredNav = navItems.filter(
    (item) => item.tier === "all" || (item.tier === "paid" && isPaid),
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };


  return (
    <aside
      className={`h-screen text-white flex flex-col transition-all duration-300 ease-in-out ${isAdmin
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"
          : isProvider
            ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900"
        } ${collapsed ? "w-20" : "w-72"}`}
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
              <img src="/uploads/logo.png" className="w-32" alt="Logo" />
              <p className="text-[11px] text-slate-400 truncate">
                {isAdmin
                  ? "Admin Panel"
                  : isProvider
                    ? "Provider Portal"
                    : "Participant Portal"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-black flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft
            className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* User Profile Card */}
      <div
        className={`px-3 py-4 border-b border-white/10 flex-shrink-0 ${collapsed ? "px-2" : ""}`}
      >
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
            <img src={user?.profile_picture || user?.provider_profile?.organization_logo || user?.participant_profile?.profile_picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh6t3nc-wJIQ9-TKUwXl6bGgdnpwN5Fz8k_AkOYWL7IA&s"} alt={user?.name} className="w-full h-full object-cover rounded-full" />
          </div>
          {!collapsed && ( 
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              {!isAdmin && (
                <p className="text-[11px] text-slate-400 truncate">
                  {isPaid ? user?.subscriptionPlan || "Paid Plan" : "Free Plan"}
                </p>
              )}
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
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                ? "bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-500/20"
                : "text-slate-300 hover:bg-white/8 hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`
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

        {!isAdmin && <div className="my-3 mx-3 border-t border-white/10" />}

        {/* Bottom nav items */}
        {!isAdmin &&
          bottomNavItems.map((item) => (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
                } ${collapsed ? "justify-center px-0" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
      </nav>

      {/* Logout — enlarged per client feedback */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white font-bold text-base transition-colors shadow-md ring-1 ring-red-500/30 hover:ring-red-400 ${collapsed ? "justify-center px-0" : ""}`}
          title="Logout"
        >
          <LogOut className="w-7 h-7 flex-shrink-0" />
          {!collapsed && <span className="text-lg tracking-wide">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
