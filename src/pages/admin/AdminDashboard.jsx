import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../../store/slices/authSlice';
import {
  Users,
  Briefcase,
  Heart,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const user = useSelector(selectUser);

  const stats = [
    { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Providers', value: '342', change: '+8%', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Participants', value: '906', change: '+15%', icon: Heart, color: 'from-amber-500 to-orange-500' },
    { label: 'Revenue', value: '$24.5k', change: '+22%', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  ];

  const tiles = [
    { label: 'Manage Users', icon: Users, path: '/admin/users', desc: 'Users, providers & participants', color: 'from-blue-500 to-cyan-600' },
    { label: 'Manage Events', icon: Heart, path: '/admin/events', desc: 'Create & manage events', color: 'from-pink-500 to-rose-600' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics', desc: 'Platform analytics & reports', color: 'from-emerald-500 to-teal-600' },
    { label: 'Settings', icon: Settings, path: '/admin/settings', desc: 'Platform configuration', color: 'from-slate-500 to-slate-700' },
    { label: 'Security', icon: Shield, path: '/admin/settings', desc: 'Security & compliance', color: 'from-red-500 to-rose-600' },
  ];

  const recentActivity = [
    { text: 'New provider registration: Sunrise Support Services', time: '5 min ago', type: 'info' },
    { text: 'Participant James Chen upgraded to paid plan', time: '1 hour ago', type: 'success' },
    { text: 'Support ticket #1234 requires attention', time: '2 hours ago', type: 'warning' },
    { text: 'Monthly report generated successfully', time: '3 hours ago', type: 'info' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        title={`Admin Dashboard`}
        description={`Welcome back, ${user?.name?.split(' ')[0]}. Here's your platform overview.`}
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.path}
              className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3`}>
                <tile.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-800">{tile.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{tile.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {recentActivity.map((activity, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  activity.type === 'warning'
                    ? 'text-amber-500'
                    : activity.type === 'success'
                      ? 'text-emerald-500'
                      : 'text-blue-500'
                }`}
              />
              <div>
                <p className="text-sm text-slate-700">{activity.text}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
