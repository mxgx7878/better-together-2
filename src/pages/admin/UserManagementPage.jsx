import { useState } from 'react';
import { Card, PageHeader, Button, Badge } from '../../components/ui';

const mockUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@communitycare.com.au', role: 'provider', tier: 'paid', organisation: 'Community Care Solutions', location: 'Melbourne, VIC', status: 'active', joinedDate: '2024-11-15' },
  { id: 2, name: 'James Chen', email: 'james.chen@email.com', role: 'participant', tier: 'free', organisation: '', location: 'Sydney, NSW', status: 'active', joinedDate: '2025-01-10' },
  { id: 3, name: 'Emily Watson', email: 'emily.w@gmail.com', role: 'participant', tier: 'paid', organisation: '', location: 'Brisbane, QLD', status: 'active', joinedDate: '2025-02-20' },
  { id: 4, name: 'Michael Park', email: 'michael@enablelife.com.au', role: 'provider', tier: 'paid', organisation: 'EnableLife Services', location: 'Perth, WA', status: 'active', joinedDate: '2024-12-01' },
  { id: 5, name: 'Lisa Tran', email: 'lisa.tran@email.com', role: 'participant', tier: 'free', organisation: '', location: 'Adelaide, SA', status: 'suspended', joinedDate: '2025-01-25' },
  { id: 6, name: 'David Cooper', email: 'david@sunrisesupport.com.au', role: 'provider', tier: 'free', organisation: 'Sunrise Support Services', location: 'Melbourne, VIC', status: 'active', joinedDate: '2025-03-01' },
  { id: 7, name: 'Amy Liu', email: 'amy.liu@email.com', role: 'participant', tier: 'paid', organisation: '', location: 'Sydney, NSW', status: 'active', joinedDate: '2025-02-14' },
  { id: 8, name: 'Tom Nguyen', email: 'tom@carepath.com.au', role: 'provider', tier: 'paid', organisation: 'CarePath NDIS', location: 'Sydney, NSW', status: 'active', joinedDate: '2024-10-20' },
  { id: 9, name: 'Rachel Brown', email: 'rachel.b@email.com', role: 'participant', tier: 'free', organisation: '', location: 'Hobart, TAS', status: 'inactive', joinedDate: '2025-01-05' },
  { id: 10, name: 'QuickFix Services', email: 'admin@quickfix.com.au', role: 'provider', tier: 'free', organisation: 'QuickFix Services', location: 'Melbourne, VIC', status: 'suspended', joinedDate: '2025-02-10' },
];

const UserManagementPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const statusColor = (s) => s === 'active' ? 'green' : s === 'suspended' ? 'red' : 'slate';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="User Management" subtitle={`${mockUsers.length} total users on the platform`} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: mockUsers.length },
          { label: 'Providers', value: mockUsers.filter(u => u.role === 'provider').length },
          { label: 'Participants', value: mockUsers.filter(u => u.role === 'participant').length },
          { label: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length },
        ].map(s => (
          <Card key={s.label} padding="p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
          />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none">
            <option value="all">All Roles</option>
            <option value="provider">Providers</option>
            <option value="participant">Participants</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* User List */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Tier</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell"><Badge color={user.role === 'provider' ? 'blue' : 'purple'}>{user.role}</Badge></td>
                  <td className="px-5 py-3 hidden lg:table-cell text-slate-600">{user.location}</td>
                  <td className="px-5 py-3 hidden sm:table-cell"><Badge color={user.tier === 'paid' ? 'amber' : 'slate'}>{user.tier}</Badge></td>
                  <td className="px-5 py-3"><Badge color={statusColor(user.status)}>{user.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelectedUser(user)} className="text-purple-600 hover:text-purple-800 text-xs font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedUser.name}</h3>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Role</span><Badge color={selectedUser.role === 'provider' ? 'blue' : 'purple'}>{selectedUser.role}</Badge></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Tier</span><Badge color={selectedUser.tier === 'paid' ? 'amber' : 'slate'}>{selectedUser.tier}</Badge></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Status</span><Badge color={statusColor(selectedUser.status)}>{selectedUser.status}</Badge></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Location</span><span className="text-slate-800">{selectedUser.location}</span></div>
              {selectedUser.organisation && <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Organisation</span><span className="text-slate-800">{selectedUser.organisation}</span></div>}
              <div className="flex justify-between py-2"><span className="text-slate-500">Joined</span><span className="text-slate-800">{new Date(selectedUser.joinedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            </div>
            <div className="flex gap-2 mt-6">
              {selectedUser.status === 'active' ? (
                <Button variant="danger" size="sm" className="flex-1">Suspend User</Button>
              ) : (
                <Button variant="primary" size="sm" className="flex-1">Activate User</Button>
              )}
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
