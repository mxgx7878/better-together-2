import { useState } from 'react';
import { Card, PageHeader, Badge } from '../../components/ui';

const monthlyData = [
  { month: 'Nov', users: 1200, providers: 180, revenue: 28500 },
  { month: 'Dec', users: 1580, providers: 220, revenue: 33200 },
  { month: 'Jan', users: 1890, providers: 265, revenue: 37800 },
  { month: 'Feb', users: 2180, providers: 310, revenue: 41200 },
  { month: 'Mar', users: 2520, providers: 350, revenue: 45100 },
  { month: 'Apr', users: 2847, providers: 384, revenue: 48290 },
];

const topProviders = [
  { name: 'Community Care Solutions', views: 2480, referrals: 45, rating: 4.9 },
  { name: 'CarePath NDIS', views: 2120, referrals: 38, rating: 4.8 },
  { name: 'EnableLife Services', views: 1850, referrals: 32, rating: 4.7 },
  { name: 'BrightPath Therapy', views: 1640, referrals: 28, rating: 4.8 },
  { name: 'Harmony Support', views: 1320, referrals: 22, rating: 4.6 },
];

const topRegions = [
  { name: 'Melbourne, VIC', users: 820, providers: 124 },
  { name: 'Sydney, NSW', users: 690, providers: 98 },
  { name: 'Brisbane, QLD', users: 420, providers: 56 },
  { name: 'Perth, WA', users: 310, providers: 42 },
  { name: 'Adelaide, SA', users: 240, providers: 28 },
];

const ReportsPage = () => {
  const [period, setPeriod] = useState('6m');
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Platform performance insights">
        <select value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none">
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '2,847', change: '+13%', positive: true },
          { label: 'Active Providers', value: '384', change: '+9.7%', positive: true },
          { label: 'Monthly Revenue', value: '$48,290', change: '+12.4%', positive: true },
          { label: 'Conversion Rate', value: '24.8%', change: '+2.1%', positive: true },
        ].map(m => (
          <Card key={m.label} padding="p-5">
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{m.value}</p>
            <p className={`text-xs font-medium mt-1 ${m.positive ? 'text-emerald-600' : 'text-red-500'}`}>{m.change}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Chart (Bar) */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Monthly Revenue</h3>
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">${(d.revenue / 1000).toFixed(1)}k</span>
              <div className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
              <span className="text-xs text-slate-500">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Providers</h3>
          <div className="space-y-3">
            {topProviders.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.views.toLocaleString()} views - {p.referrals} referrals</p>
                </div>
                <Badge color="amber">{p.rating}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Regions */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Regions</h3>
          <div className="space-y-3">
            {topRegions.map((r) => (
              <div key={r.name} className="p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-800">{r.name}</p>
                  <span className="text-xs text-slate-500">{r.users + r.providers} total</span>
                </div>
                <div className="flex gap-2 h-2">
                  <div className="bg-purple-500 rounded-full" style={{ width: `${(r.users / 820) * 60}%` }} title={`${r.users} users`} />
                  <div className="bg-blue-400 rounded-full" style={{ width: `${(r.providers / 124) * 30}%` }} title={`${r.providers} providers`} />
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] text-purple-600">{r.users} participants</span>
                  <span className="text-[10px] text-blue-500">{r.providers} providers</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Growth */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">User Growth</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Month</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Total Users</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Providers</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(d => (
                <tr key={d.month} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{d.month} 2026</td>
                  <td className="px-4 py-3 text-right text-slate-600">{d.users.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{d.providers}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">${d.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
