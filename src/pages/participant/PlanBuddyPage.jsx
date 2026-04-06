import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Heart, FileText, CheckCircle } from '../../components/Icons';

const mockMessages = [
  { id: 1, from: 'buddy', date: '2026-02-14', content: 'Hi! Just checking in before your plan review next month. Have you started gathering your provider reports? I\'ve added a checklist to your tasks below.' },
  { id: 2, from: 'user', date: '2026-02-14', content: 'Thanks Karen! I\'ve got my OT and speech reports. Still waiting on my support coordinator\'s report.' },
  { id: 3, from: 'buddy', date: '2026-02-14', content: 'Great progress! I\'d suggest following up with your SC this week. Would you like me to help you draft a follow-up email?' },
  { id: 4, from: 'user', date: '2026-02-15', content: 'Yes please, that would be really helpful!' },
  { id: 5, from: 'buddy', date: '2026-02-15', content: 'Done! I\'ve drafted an email for you — check the "Drafts" section below. Feel free to edit it before sending.' },
];

const mockTasks = [
  { id: 1, text: 'Collect OT assessment report', done: true },
  { id: 2, text: 'Collect speech pathology report', done: true },
  { id: 3, text: 'Get support coordinator summary', done: false },
  { id: 4, text: 'Write personal statement about goals', done: false },
  { id: 5, text: 'List current supports and what\'s working', done: false },
  { id: 6, text: 'Note any changes in circumstances', done: false },
];

const PlanBuddyPage = () => {
  const { isPaid, user } = useAuth();
  const [tasks, setTasks] = useState(mockTasks);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('chat');
  const [showScheduleConfirm, setShowScheduleConfirm] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [editingDraft, setEditingDraft] = useState(false);
  const [requestedConnections, setRequestedConnections] = useState([]);
  const [peerMatchRequested, setPeerMatchRequested] = useState(false);

  if (!isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Plan Buddy</h1>
        <p className="text-slate-600 mb-3">Your Personal Plan Buddy (PPB) provides one-on-one support to help you navigate the NDIS.</p>
        <div className="bg-purple-50 rounded-xl p-4 text-left text-sm text-purple-800 mb-6 max-w-md mx-auto">
          <p className="font-semibold mb-2">What a Plan Buddy offers:</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Personal support inbox & check-ins</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Help drafting emails and letters</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Plan review preparation</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Peer matching & connection</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Advocate & lawyer connections</li>
          </ul>
        </div>
        <a href="/dashboard/upgrade" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
          Upgrade to Personal Support Plus — $200/year
        </a>
      </div>
    );
  }

  const buddy = user.planBuddy || { name: 'Karen Burgess', nextCheckIn: '2026-02-28' };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: prev.length + 1, from: 'user', date: '2026-02-16', content: newMessage }]);
    setNewMessage('');
  };

  const completedTasks = tasks.filter(t => t.done).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Plan Buddy</h1>
        <p className="text-sm text-slate-500 mt-1">Your personal support connection for navigating the NDIS</p>
      </div>

      {/* Buddy Profile Card */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
            {buddy.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold">{buddy.name}</h2>
            <p className="text-purple-200 text-sm">Your Personal Plan Buddy</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium">
                Next check-in: {new Date(buddy.nextCheckIn).toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })}
              </span>
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium">
                Plan review checklist: {completedTasks}/{tasks.length}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowScheduleConfirm(true); setTimeout(() => setShowScheduleConfirm(false), 2000); }} className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-sm font-medium transition-colors">
              {showScheduleConfirm ? 'Request Sent!' : 'Schedule Check-in'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { key: 'chat', label: 'Messages' },
          { key: 'checklist', label: 'Plan Review Checklist' },
          { key: 'drafts', label: 'Drafts & Templates' },
          { key: 'connections', label: 'Connections' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.from === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {msg.from === 'buddy' && <p className="text-[11px] font-semibold text-purple-600 mb-1">{buddy.name}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                    {new Date(msg.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 p-4 flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message to your Plan Buddy..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
            />
            <button onClick={sendMessage} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md">Send</button>
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">Plan Review Preparation</h3>
            <span className="text-sm font-medium text-purple-600">{completedTasks}/{tasks.length} complete</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${(completedTasks / tasks.length) * 100}%` }} />
          </div>
          <div className="space-y-2">
            {tasks.map(task => (
              <label key={task.id} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${task.done ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200 hover:border-purple-300'}`}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className={`text-sm ${task.done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{task.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Draft: Follow-up email to Support Coordinator</h3>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 mb-4">
              <p>Hi [Support Coordinator name],</p>
              <p className="mt-2">I hope you're well. I'm preparing for my upcoming NDIS plan review and was wondering if you could please provide a summary report of our work together over the past 12 months.</p>
              <p className="mt-2">It would be helpful if the report could include the goals we've worked on, progress made, and any recommendations for future funding.</p>
              <p className="mt-2">If possible, could I receive this by [date]?</p>
              <p className="mt-2">Thank you for your support.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { navigator.clipboard?.writeText('Hi [Support Coordinator name],\n\nI hope you\'re well. I\'m preparing for my upcoming NDIS plan review and was wondering if you could please provide a summary report of our work together over the past 12 months.\n\nIt would be helpful if the report could include the goals we\'ve worked on, progress made, and any recommendations for future funding.\n\nIf possible, could I receive this by [date]?\n\nThank you for your support.'); setCopiedDraft(true); setTimeout(() => setCopiedDraft(false), 2000); }} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl">
                {copiedDraft ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button onClick={() => setEditingDraft(!editingDraft)} className={`px-4 py-2 text-sm font-medium rounded-xl ${editingDraft ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                {editingDraft ? 'Done Editing' : 'Edit'}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-3">Available Templates</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {['Provider feedback email', 'Plan review personal statement', 'Change of provider request', 'Internal review request', 'Complaint to NDIS Commission', 'Advocate referral request'].map((tmpl, i) => (
                <button key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-purple-50 transition-colors text-left">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{tmpl}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Advocacy & Legal Connections</h3>
            <p className="text-sm text-slate-600 mb-4">Your Plan Buddy can connect you with advocates and lawyers who specialise in NDIS matters.</p>
            <div className="space-y-3">
              {[
                { name: 'Disability Advocacy Network', type: 'Advocacy', desc: 'Free independent advocacy support for NDIS participants' },
                { name: 'NDIS Legal Support Clinic', type: 'Legal', desc: 'Pro bono legal advice for plan reviews, AAT appeals, and complaints' },
                { name: 'Peer Connect Program', type: 'Peer Support', desc: 'Matched with someone who has similar lived experience' },
              ].map((conn, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{conn.name}</h4>
                    <p className="text-xs text-slate-500">{conn.type} · {conn.desc}</p>
                  </div>
                  <button onClick={() => setRequestedConnections(prev => prev.includes(i) ? prev : [...prev, i])} className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex-shrink-0 ${requestedConnections.includes(i) ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 hover:bg-purple-100 text-purple-700'}`}>
                    {requestedConnections.includes(i) ? 'Requested' : 'Request Connection'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Peer Matching</h3>
            <p className="text-sm text-slate-600 mb-4">Connect with other participants who share similar experiences or goals.</p>
            <button onClick={() => setPeerMatchRequested(true)} className={`px-5 py-3 font-semibold rounded-xl shadow-md transition-all ${peerMatchRequested ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'}`}>
              {peerMatchRequested ? 'Match Request Submitted!' : 'Find a Peer Match'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanBuddyPage;
