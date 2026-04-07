import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Card, PageHeader } from '../../components/ui';

const stats = [
  { label: 'Total Users', value: '2,847', change: '+126 this month', color: 'from-purple-500 to-indigo-600', icon: UsersIcon },
  { label: 'Active Providers', value: '384', change: '+18 this month', color: 'from-blue-500 to-cyan-600', icon: BuildingIcon },
  { label: 'Active Participants', value: '2,463', change: '+108 this month', color: 'from-emerald-500 to-teal-600', icon: PeopleIcon },
  { label: 'Revenue (MRR)', value: '$48,290', change: '+12.4%', color: 'from-amber-500 to-orange-600', icon: DollarIcon },
];

const pendingActions = [
  { label: 'Provider Approvals', count: 12, path: '/dashboard/admin/approvals', color: 'bg-amber-100 text-amber-700' },
  { label: 'Support Tickets', count: 8, path: '/dashboard/admin/tickets', color: 'bg-red-100 text-red-700' },
  { label: 'Content Reviews', count: 5, path: '/dashboard/admin/content', color: 'bg-blue-100 text-blue-700' },
  { label: 'Flagged Users', count: 2, path: '/dashboard/admin/users', color: 'bg-purple-100 text-purple-700' },
];

const recentActivity = [
  { action: 'New provider registered', detail: 'AllAbility Support Services - Melbourne', time: '5 mins ago', type: 'provider' },
  { action: 'Support ticket opened', detail: 'Billing issue - James Chen (#TKT-1247)', time: '12 mins ago', type: 'ticket' },
  { action: 'Provider approved', detail: 'CarePath NDIS - Sydney', time: '1 hour ago', type: 'approval' },
  { action: 'New participant signed up', detail: 'Emily Watson - Brisbane', time: '2 hours ago', type: 'participant' },
  { action: 'Subscription upgraded', detail: 'Harmony Support → Growth & Referral', time: '3 hours ago', type: 'subscription' },
  { action: 'Event created', detail: 'NDIS Provider Meetup - Perth, Apr 15', time: '4 hours ago', type: 'event' },
  { action: 'Blog post published', detail: '10 Tips for NDIS Plan Management', time: '5 hours ago', type: 'content' },
  { action: 'Provider suspended', detail: 'QuickFix Services - Reported by 3 users', time: '6 hours ago', type: 'alert' },
];

const quickLinks = [
  { label: 'User Management', desc: 'Manage all users', path: '/dashboard/admin/users', color: 'from-violet-500 to-purple-600', icon: UsersIcon },
  { label: 'Provider Approvals', desc: 'Review applications', path: '/dashboard/admin/approvals', color: 'from-amber-500 to-orange-600', icon: ShieldCheckIcon },
  { label: 'Support Tickets', desc: 'Handle requests', path: '/dashboard/admin/tickets', color: 'from-red-500 to-rose-600', icon: TicketIcon },
  { label: 'Content Management', desc: 'Events, blogs, resources', path: '/dashboard/admin/content', color: 'from-blue-500 to-cyan-600', icon: ContentIcon },
  { label: 'Subscriptions', desc: 'Plans & billing', path: '/dashboard/admin/subscriptions', color: 'from-emerald-500 to-teal-600', icon: CreditCardIcon },
  { label: 'Reports & Analytics', desc: 'Platform insights', path: '/dashboard/admin/reports', color: 'from-pink-500 to-rose-600', icon: ChartIcon },
  { label: 'Platform Settings', desc: 'Configuration', path: '/dashboard/admin/settings', color: 'from-slate-500 to-slate-700', icon: GearIcon },
];

const AdminDashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h2>
        <p className="text-sm text-slate-300 mt-1">Here's what's happening on the platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Pending Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {pendingActions.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>{item.count}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Links + Recent Activity */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold text-slate-800">Quick Access</h3>
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0`}>
                <link.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 group-hover:text-purple-700 transition-colors">{link.label}</p>
                <p className="text-xs text-slate-500">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-1">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.type === 'provider' ? 'bg-blue-500' :
                    item.type === 'ticket' ? 'bg-red-500' :
                    item.type === 'approval' ? 'bg-emerald-500' :
                    item.type === 'participant' ? 'bg-purple-500' :
                    item.type === 'subscription' ? 'bg-amber-500' :
                    item.type === 'alert' ? 'bg-red-600' :
                    'bg-slate-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{item.action}</p>
                    <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── Icon Components ─────────────────────────────────────────────
function UsersIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
}
function BuildingIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
}
function PeopleIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
}
function DollarIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
}
function ShieldCheckIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
}
function TicketIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>);
}
function ContentIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>);
}
function CreditCardIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
}
function ChartIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
}
function GearIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
}

export default AdminDashboardHome;
