import { useState, useEffect } from 'react';
import { Users, Search, Filter } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Loader';

const dummyUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@communitycare.com.au', role: 'provider', tier: 'paid', status: 'active' },
  { id: 2, name: 'James Chen', email: 'james.chen@email.com', role: 'participant', tier: 'free', status: 'active' },
  { id: 3, name: 'Emily Davis', email: 'emily@enablelife.com.au', role: 'provider', tier: 'free', status: 'active' },
  { id: 4, name: 'Michael Brown', email: 'michael.b@email.com', role: 'participant', tier: 'paid', status: 'inactive' },
  { id: 5, name: 'Jessica Taylor', email: 'jessica@sunrisesupport.com', role: 'provider', tier: 'paid', status: 'active' },
];

const ManageUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsers(dummyUsers);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Manage Users" description="View and manage all platform users" icon={Users} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-600 hover:bg-slate-200 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.role === 'provider' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.tier === 'paid' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
