import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Inbox, MessageCircle, CheckCircle, Zap } from '../../components/Icons';

const mockRequests = [
  { id: 1, participant: 'Emily Watson', location: 'Melbourne CBD', service: 'Support Coordination', urgency: 'high', status: 'new', date: '2026-02-16', message: 'Looking for a support coordinator to help me navigate my new NDIS plan. I need help understanding my funding categories and connecting with providers.', responseTime: null },
  { id: 2, participant: 'David Kim', location: 'Richmond, VIC', service: 'Occupational Therapy', urgency: 'medium', status: 'new', date: '2026-02-15', message: 'I need an OT assessment for home modifications. My current home setup isn\'t working for my wheelchair.', responseTime: null },
  { id: 3, participant: 'Sarah Patel', location: 'Footscray, VIC', service: 'Daily Living Support', urgency: 'low', status: 'new', date: '2026-02-14', message: 'Looking for support workers for community access on weekends. Ideally someone who enjoys outdoor activities.', responseTime: null },
  { id: 4, participant: 'James Liu', location: 'South Yarra, VIC', service: 'Psychology', urgency: 'medium', status: 'responded', date: '2026-02-12', message: 'Seeking a psychologist experienced with autism in adults. Prefer telehealth options.', responseTime: '2 hours' },
  { id: 5, participant: 'Amy Chen', location: 'Docklands, VIC', service: 'Support Coordination', urgency: 'high', status: 'accepted', date: '2026-02-10', message: 'Urgent: my current support coordinator is leaving and I need someone new before my plan review next month.', responseTime: '45 min' },
  { id: 6, participant: 'Tom Barrett', location: 'St Kilda, VIC', service: 'Community Participation', urgency: 'low', status: 'declined', date: '2026-02-08', message: 'Interested in group programs for social connection. Available Tuesdays and Thursdays.', responseTime: '1 day' },
];

const urgencyColors = {
  high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  low: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const statusConfig = {
  new: { label: 'New', color: 'bg-purple-100 text-purple-700' },
  responded: { label: 'Responded', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  declined: { label: 'Declined', color: 'bg-slate-100 text-slate-500' },
};

const ServiceRequestsPage = () => {
  const { isPaid } = useAuth();
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState(mockRequests);
  const [replyText, setReplyText] = useState('');

  if (!isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><Inbox className="w-10 h-10 text-purple-600" /></div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Service Requests & Referrals</h1>
        <p className="text-slate-600 mb-6">Upgrade to a paid plan to receive service requests from participants and manage referrals.</p>
        <a href="/dashboard/upgrade" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
          Upgrade Now
        </a>
      </div>
    );
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const newCount = requests.filter(r => r.status === 'new').length;

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    setSelectedRequest(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Service Requests & Referrals</h1>
          <p className="text-sm text-slate-500 mt-1">Manage participant enquiries and referral requests</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">{newCount} new request{newCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="New Requests" value={requests.filter(r => r.status === 'new').length} icon={<Inbox className="w-5 h-5" />} color="purple" />
        <StatCard label="Responded" value={requests.filter(r => r.status === 'responded').length} icon={<MessageCircle className="w-5 h-5" />} color="blue" />
        <StatCard label="Accepted" value={requests.filter(r => r.status === 'accepted').length} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
        <StatCard label="Avg Response Time" value="1.5h" icon={<Zap className="w-5 h-5" />} color="amber" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Requests' },
          { key: 'new', label: `New (${requests.filter(r => r.status === 'new').length})` },
          { key: 'responded', label: 'Responded' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'declined', label: 'Declined' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div
            key={req.id}
            onClick={() => setSelectedRequest(req)}
            className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${
              req.status === 'new' ? 'border-purple-200 border-l-4 border-l-purple-500' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {req.participant.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-800">{req.participant}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[req.status].color}`}>
                      {statusConfig[req.status].label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${urgencyColors[req.urgency].bg} ${urgencyColors[req.urgency].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${urgencyColors[req.urgency].dot}`} />
                      {req.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{req.service} · {req.location}</p>
                  <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{req.message}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400">{new Date(req.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                {req.responseTime && <p className="text-[10px] text-emerald-600 mt-1">Replied in {req.responseTime}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {selectedRequest.participant.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedRequest.participant}</h2>
                  <p className="text-sm text-slate-500">{selectedRequest.service} · {selectedRequest.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-700">{selectedRequest.message}</p>
            </div>

            <div className="flex items-center gap-3 mb-5 text-xs text-slate-500">
              <span className={`font-bold px-2 py-0.5 rounded-full ${urgencyColors[selectedRequest.urgency].bg} ${urgencyColors[selectedRequest.urgency].text}`}>
                {selectedRequest.urgency} priority
              </span>
              <span>{new Date(selectedRequest.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            {selectedRequest.status === 'new' && (
              <>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the participant..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={() => handleAction(selectedRequest.id, 'accepted')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">Accept</button>
                  <button onClick={() => handleAction(selectedRequest.id, 'responded')} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors">Respond</button>
                  <button onClick={() => handleAction(selectedRequest.id, 'declined')} className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-colors">Decline</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function StatCard({ label, value, icon, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>{icon}</div>
        <div>
          <p className="text-xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestsPage;