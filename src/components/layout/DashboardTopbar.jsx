import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsProvider, selectIsPaid, selectIsAdmin } from '../../store/slices/authSlice';
import {
  selectNotifications,
  selectUnreadCount,
  markAllNotificationsRead,
  setNotifications,
} from '../../store/slices/uiSlice';
import { Menu, Search, Bell } from 'lucide-react';
import { useEffect } from 'react';

const DashboardTopbar = ({ sidebarCollapsed, onMobileMenuToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isProvider = useSelector(selectIsProvider);
  const isAdmin = useSelector(selectIsAdmin);
  const isPaid = useSelector(selectIsPaid);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [showNotifications, setShowNotifications] = useState(false);

  const basePath = isAdmin ? '/admin' : isProvider ? '/provider' : '/participant';

  // Load mock notifications
  useEffect(() => {
    const mockNotifications = isAdmin
      ? [
          { id: 1, text: 'New provider registration pending approval', time: '2 min ago', unread: true },
          { id: 2, text: '5 new support tickets received', time: '30 min ago', unread: true },
          { id: 3, text: 'Monthly analytics report ready', time: '1 hour ago', unread: false },
        ]
      : isProvider
        ? [
            { id: 1, text: 'New service request from a participant in your area', time: '5 min ago', unread: true },
            { id: 2, text: 'Upcoming networking event: Melbourne Provider Meetup', time: '1 hour ago', unread: true },
            { id: 3, text: 'Your profile was viewed 12 times this week', time: '3 hours ago', unread: false },
          ]
        : [
            { id: 1, text: 'New provider matched your service needs', time: '10 min ago', unread: true },
            { id: 2, text: 'Community workshop: Understanding Your NDIS Plan', time: '2 hours ago', unread: true },
            { id: 3, text: 'Your message board post got 3 replies', time: '5 hours ago', unread: false },
          ];
    dispatch(setNotifications(mockNotifications));
  }, [isProvider, isAdmin, dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button + Greeting */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[150px] sm:max-w-none">
              {isAdmin ? 'Admin Dashboard' : isProvider ? user?.organisation : user?.location}
              {isPaid && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                  {user?.subscriptionPlan}
                </span>
              )}
              {!isPaid && !isAdmin && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                  Free Plan
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Search */}
          {/* <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-500 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="hidden lg:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
              ⌘K
            </kbd>
          </button> */}

          {/* Notifications */}
          {/* <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                    <button
                      onClick={() => dispatch(markAllNotificationsRead())}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-purple-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className={notif.unread ? '' : 'ml-5'}>
                            <p className="text-sm text-slate-700">{notif.text}</p>
                            <p className="text-[11px] text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100">
                    <button className="w-full text-center text-xs text-purple-600 hover:text-purple-700 font-medium py-1">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div> */}

          {/* Profile Quick Menu */}
          <Link
            to={`${basePath}/profile`}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
              <img src={user?.provider_profile?.organization_logo} alt={user?.name} className="w-full h-full object-cover rounded-full" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
