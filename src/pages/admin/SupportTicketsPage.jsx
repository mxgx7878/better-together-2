import { useState } from 'react';
import { Card, PageHeader, Button, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const mockTickets = [
  { id: 'TKT-1247', user: 'James Chen', email: 'james.chen@email.com', role: 'participant', subject: 'Cannot access Plan Buddy feature', category: 'technical', priority: 'high', status: 'open', createdAt: '2026-04-05T10:30:00', messages: [{ from: 'user', text: 'I upgraded to paid plan but Plan Buddy still shows locked. Can you help?', time: '10:30 AM' }] },
  { id: 'TKT-1246', user: 'Sarah Mitchell', email: 'sarah@communitycare.com.au', role: 'provider', subject: 'Billing query - double charged', category: 'billing', priority: 'high', status: 'open', createdAt: '2026-04-05T09:15:00', messages: [{ from: 'user', text: 'I was charged twice for my Growth & Referral plan this month. Please refund the extra charge.', time: '9:15 AM' }] },
  { id: 'TKT-1245', user: 'Emily Watson', email: 'emily.w@gmail.com', role: 'participant', subject: 'How to update my NDIS plan details', category: 'general', priority: 'medium', status: 'in_progress', createdAt: '2026-04-04T16:00:00', messages: [{ from: 'user', text: 'Where can I update my NDIS plan number and expiry date?', time: '4:00 PM' }, { from: 'admin', text: 'Hi Emily, you can update plan details in Profile > My Details. Let me know if you need further help.', time: '4:45 PM' }] },
  { id: 'TKT-1244', user: 'Michael Park', email: 'michael@enablelife.com.au', role: 'provider', subject: 'Feature request: bulk upload services', category: 'feedback', priority: 'low', status: 'in_progress', createdAt: '2026-04-04T11:00:00', messages: [{ from: 'user', text: 'Would be great to have CSV upload for our service listings instead of adding one by one.', time: '11:00 AM' }] },
  { id: 'TKT-1243', user: 'Lisa Tran', email: 'lisa.tran@email.com', role: 'participant', subject: 'Account suspended without reason', category: 'general', priority: 'high', status: 'open', createdAt: '2026-04-04T08:30:00', messages: [{ from: 'user', text: 'My account was suddenly suspended. I haven\'t violated any terms. Please review.', time: '8:30 AM' }] },
  { id: 'TKT-1242', user: 'David Cooper', email: 'david@sunrisesupport.com.au', role: 'provider', subject: 'Profile not showing in directory', category: 'technical', priority: 'medium', status: 'resolved', createdAt: '2026-04-03T14:00:00', messages: [{ from: 'user', text: 'My provider profile is complete but not appearing in the business directory.', time: '2:00 PM' }, { from: 'admin', text: 'We found the issue - your profile was pending approval. Now approved and live. Thanks!', time: '3:30 PM' }] },
];

const SupportTicketsPage = () => {
  const [filter, setFilter] = useState('open');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');

  const filtered = mockTickets.filter(t => filter === 'all' || t.status === filter);
  const priorityColor = (p) => p === 'high' ? 'red' : p === 'medium' ? 'amber' : 'slate';
  const statusColor = (s) => s === 'open' ? 'red' : s === 'in_progress' ? 'amber' : 'green';

  const handleReply = () => {
    if (!reply.trim()) return;
    toast.success('Reply sent successfully');
    setReply('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Support Tickets" subtitle={`${mockTickets.filter(t => t.status === 'open').length} open tickets`} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Open', value: mockTickets.filter(t => t.status === 'open').length, color: 'text-red-600' },
          { label: 'In Progress', value: mockTickets.filter(t => t.status === 'in_progress').length, color: 'text-amber-600' },
          { label: 'Resolved', value: mockTickets.filter(t => t.status === 'resolved').length, color: 'text-emerald-600' },
          { label: 'Avg Response', value: '2.4 hrs', color: 'text-blue-600' },
        ].map(s => (
          <Card key={s.label} padding="p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {['open', 'in_progress', 'resolved', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets + Detail */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTicket?.id === ticket.id ? 'border-purple-300 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                <Badge color={priorityColor(ticket.priority)}>{ticket.priority}</Badge>
              </div>
              <p className="text-sm font-medium text-slate-800 mb-1">{ticket.subject}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{ticket.user}</span>
                <Badge color={statusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selectedTicket ? (
            <Card>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{selectedTicket.subject}</h3>
                  <Badge color={statusColor(selectedTicket.status)}>{selectedTicket.status.replace('_', ' ')}</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>{selectedTicket.id}</span>
                  <span>{selectedTicket.user} ({selectedTicket.role})</span>
                  <span>{selectedTicket.email}</span>
                  <Badge color={priorityColor(selectedTicket.priority)}>{selectedTicket.priority} priority</Badge>
                  <Badge color="blue">{selectedTicket.category}</Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-6">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-xl ${msg.from === 'admin' ? 'bg-purple-50 border border-purple-100 ml-4' : 'bg-slate-50 border border-slate-100 mr-4'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">{msg.from === 'admin' ? 'Admin' : selectedTicket.user}</span>
                      <span className="text-[11px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-700">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedTicket.status !== 'resolved' && (
                <div className="border-t border-slate-100 pt-4">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleReply}>Send Reply</Button>
                    <Button variant="secondary">Mark Resolved</Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div className="text-center py-16">
                <p className="text-slate-400 text-sm">Select a ticket to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsPage;
