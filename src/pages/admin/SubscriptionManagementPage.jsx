import { useState } from 'react';
import { Card, PageHeader, Badge } from '../../components/ui';

const plans = [
  { id: 1, name: 'Provider Free', price: '$0', users: 245, color: 'from-slate-400 to-slate-600' },
  { id: 2, name: 'Growth & Referral', price: '$49/mo', users: 139, color: 'from-purple-500 to-indigo-600' },
  { id: 3, name: 'Participant Free', price: '$0', users: 1890, color: 'from-slate-400 to-slate-600' },
  { id: 4, name: 'Personal Support Plus', price: '$29/mo', users: 573, color: 'from-pink-500 to-rose-600' },
];

const recentTransactions = [
  { id: 1, user: 'Community Care Solutions', plan: 'Growth & Referral', amount: '$49.00', date: '2026-04-05', status: 'paid' },
  { id: 2, user: 'Emily Watson', plan: 'Personal Support Plus', amount: '$29.00', date: '2026-04-05', status: 'paid' },
  { id: 3, user: 'EnableLife Services', plan: 'Growth & Referral', amount: '$49.00', date: '2026-04-04', status: 'paid' },
  { id: 4, user: 'Amy Liu', plan: 'Personal Support Plus', amount: '$29.00', date: '2026-04-04', status: 'paid' },
  { id: 5, user: 'CarePath NDIS', plan: 'Growth & Referral', amount: '$49.00', date: '2026-04-03', status: 'paid' },
  { id: 6, user: 'Rachel Brown', plan: 'Personal Support Plus', amount: '$29.00', date: '2026-04-03', status: 'failed' },
  { id: 7, user: 'Sunrise Support', plan: 'Growth & Referral', amount: '$49.00', date: '2026-04-02', status: 'refunded' },
];

const SubscriptionManagementPage = () => {
  const [tab, setTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Subscriptions & Billing" subtitle="Manage plans, revenue and transactions" />

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5">
          <p className="text-xs text-slate-500">Monthly Revenue</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">$48,290</p>
          <p className="text-xs text-emerald-600 mt-1">+12.4% vs last month</p>
        </Card>
        <Card padding="p-5">
          <p className="text-xs text-slate-500">Paid Subscribers</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">712</p>
          <p className="text-xs text-emerald-600 mt-1">+34 this month</p>
        </Card>
        <Card padding="p-5">
          <p className="text-xs text-slate-500">Churn Rate</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">2.3%</p>
          <p className="text-xs text-emerald-600 mt-1">-0.5% vs last month</p>
        </Card>
        <Card padding="p-5">
          <p className="text-xs text-slate-500">Failed Payments</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">4</p>
          <p className="text-xs text-red-500 mt-1">Requires attention</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {['overview', 'transactions'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map(plan => (
            <Card key={plan.id}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {plan.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{plan.users}</p>
                  <p className="text-xs text-slate-500">users</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'transactions' && (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Plan</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{tx.user}</td>
                    <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{tx.plan}</td>
                    <td className="px-5 py-3 font-semibold text-slate-800">{tx.amount}</td>
                    <td className="px-5 py-3 text-slate-600 hidden md:table-cell">{new Date(tx.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-3"><Badge color={tx.status === 'paid' ? 'green' : tx.status === 'failed' ? 'red' : 'amber'}>{tx.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagementPage;
