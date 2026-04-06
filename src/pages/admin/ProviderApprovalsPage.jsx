import { useState } from 'react';
import { Card, PageHeader, Button, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const mockApprovals = [
  { id: 1, name: 'AllAbility Support Services', contact: 'Karen Wilson', email: 'karen@allability.com.au', abn: '45 678 901 234', location: 'Melbourne, VIC', services: ['Core Supports', 'Support Coordination', 'Community Participation'], registrationStatus: 'registered', submittedDate: '2026-04-01', status: 'pending' },
  { id: 2, name: 'BrightPath Therapy', contact: 'Dr. Simon Lee', email: 'simon@brightpath.com.au', abn: '56 789 012 345', location: 'Sydney, NSW', services: ['Therapy Services', 'Allied Health', 'Early Childhood'], registrationStatus: 'registered', submittedDate: '2026-04-02', status: 'pending' },
  { id: 3, name: 'Pacific Coast Supports', contact: 'Natalie Ross', email: 'natalie@pacificcoast.com.au', abn: '67 890 123 456', location: 'Gold Coast, QLD', services: ['SIL / STA / MTA', 'Personal Care', 'Daily Living'], registrationStatus: 'pending', submittedDate: '2026-04-03', status: 'pending' },
  { id: 4, name: 'Empower Now', contact: 'Jake Thompson', email: 'jake@empowernow.com.au', abn: '78 901 234 567', location: 'Perth, WA', services: ['Employment Supports', 'Capacity Building'], registrationStatus: 'registered', submittedDate: '2026-03-28', status: 'pending' },
  { id: 5, name: 'QuickCare Solutions', contact: 'Unknown', email: 'info@quickcare.com', abn: 'Not provided', location: 'Melbourne, VIC', services: ['Core Supports'], registrationStatus: 'unregistered', submittedDate: '2026-04-04', status: 'pending' },
];

const ProviderApprovalsPage = () => {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filter, setFilter] = useState('pending');

  const handleAction = (id, action) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    setSelectedProvider(null);
    toast.success(action === 'approved' ? 'Provider approved successfully' : 'Provider application rejected');
  };

  const filtered = approvals.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Provider Approvals" subtitle={`${approvals.filter(a => a.status === 'pending').length} pending applications`} />

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { key: 'pending', label: 'Pending', count: approvals.filter(a => a.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: approvals.filter(a => a.status === 'approved').length },
          { key: 'rejected', label: 'Rejected', count: approvals.filter(a => a.status === 'rejected').length },
          { key: 'all', label: 'All', count: approvals.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${filter === tab.key ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-sm text-slate-500 py-8">No applications found</p></Card>
        ) : (
          filtered.map(app => (
            <Card key={app.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{app.name}</h3>
                    <p className="text-xs text-slate-500">{app.contact} - {app.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.services.slice(0, 3).map(s => (<span key={s} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>))}
                      {app.services.length > 3 && <span className="text-[10px] text-slate-400">+{app.services.length - 3} more</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge color={app.status === 'pending' ? 'amber' : app.status === 'approved' ? 'green' : 'red'}>{app.status}</Badge>
                  <span className="text-xs text-slate-400">{new Date(app.submittedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                  <button onClick={() => setSelectedProvider(app)} className="text-xs text-purple-600 hover:text-purple-800 font-medium">Review</button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProvider(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Review Application</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Organisation</span><span className="font-medium text-slate-800">{selectedProvider.name}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Contact</span><span className="text-slate-800">{selectedProvider.contact}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Email</span><span className="text-slate-800">{selectedProvider.email}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">ABN</span><span className="text-slate-800">{selectedProvider.abn}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Location</span><span className="text-slate-800">{selectedProvider.location}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">NDIS Registration</span><Badge color={selectedProvider.registrationStatus === 'registered' ? 'green' : selectedProvider.registrationStatus === 'pending' ? 'amber' : 'red'}>{selectedProvider.registrationStatus}</Badge></div>
              <div className="py-2 border-b border-slate-100">
                <span className="text-slate-500 block mb-2">Services Offered</span>
                <div className="flex flex-wrap gap-1">{selectedProvider.services.map(s => (<span key={s} className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full">{s}</span>))}</div>
              </div>
            </div>
            {selectedProvider.status === 'pending' && (
              <div className="flex gap-2 mt-6">
                <Button className="flex-1" onClick={() => handleAction(selectedProvider.id, 'approved')}>Approve</Button>
                <Button variant="danger" className="flex-1" onClick={() => handleAction(selectedProvider.id, 'rejected')}>Reject</Button>
              </div>
            )}
            {selectedProvider.status !== 'pending' && (
              <div className="mt-6"><Button variant="secondary" className="w-full" onClick={() => setSelectedProvider(null)}>Close</Button></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderApprovalsPage;
