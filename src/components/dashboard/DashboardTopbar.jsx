import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardTopbar = ({ sidebarCollapsed, onMobileMenuToggle }) => {
  const { user, isProvider, isPaid } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = isProvider
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

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="flex items-center justify-between px-6 lg:px-8 h-16">
        {/* Mobile menu button + Greeting */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div>
          <h1 className="text-lg font-semibold text-slate-800">
            {getGreeting()}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500">
            {isProvider ? user.organisation : `${user.location}`}
            {isPaid && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                {user.subscriptionPlan}
              </span>
            )}
            {!isPaid && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                Free Plan
              </span>
            )}
          </p>
        </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search...</span>
            <kbd className="hidden lg:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
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
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-purple-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
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
          </div>

          {/* Profile Quick Menu */}
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;