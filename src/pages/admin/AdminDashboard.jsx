import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { selectUser } from '../../store/slices/authSlice';
import {
  Users,
  Briefcase,
  Heart,
  BarChart3,
  Shield,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

// Icon + gradient per stat key returned by the API.
const STAT_META = {
  total_users:      { icon: Users,      color: 'from-blue-500 to-cyan-500' },
  active_providers: { icon: Briefcase,  color: 'from-purple-500 to-pink-500' },
  participants:     { icon: Heart,      color: 'from-amber-500 to-orange-500' },
  revenue:          { icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
};

const AdminDashboard = () => {
  const user = useSelector(selectUser);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Quick Actions are static navigation (no API needed).
  const tiles = [
    { label: 'Manage Users', icon: Users, path: '/admin/users', desc: 'Users, providers & participants', color: 'from-blue-500 to-cyan-600' },
    { label: 'Manage Events', icon: Heart, path: '/admin/events', desc: 'Create & manage events', color: 'from-pink-500 to-rose-600' },
    { label: 'Manage Categories', icon: BarChart3, path: '/admin/categories', desc: 'Manage categories & tags', color: 'from-emerald-500 to-teal-600' },
    { label: 'Manage Queries', icon: MessageCircle, path: '/admin/queries', desc: 'Manage user queries & feedback', color: 'from-red-500 to-rose-600' },
    { label: 'Service Requests', icon: MessageCircle, path: '/admin/service-requests', desc: 'Manage service requests', color: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        title={`Admin Dashboard`}
        description={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}. Here's your platform overview.`}
        icon={LayoutDashboard}
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading platform overview…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
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
      )}

      {/* Content */}
      {!loading && !error && data && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat) => {
              const meta = STAT_META[stat.key] || { icon: BarChart3, color: 'from-slate-500 to-slate-700' };
              const Icon = meta.icon;
              const negative = typeof stat.change === 'string' && stat.change.startsWith('-');
              return (
                <div key={stat.key} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {stat.change ? (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${negative ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                        {stat.change}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              );
            })}
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
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity, i) => (
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
                ))
              ) : (
                <p className="text-sm text-slate-400 px-5 py-8 text-center">No recent activity yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;