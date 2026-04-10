import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Pin } from 'lucide-react';

const mockThreads = [
  { id: 1, title: 'New NDIS pricing changes — how is everyone adapting?', author: 'Karen B.', authorRole: 'Support Coordinator', date: '2026-02-16', replies: 12, views: 89, topic: 'compliance', pinned: true, lastReply: '2 hours ago', preview: 'With the mid-year pricing update, I\'m finding it challenging to reconcile the new rates with existing service agreements...' },
  { id: 2, title: 'Best practices for participant onboarding documentation', author: 'Michael T.', authorRole: 'Provider Manager', date: '2026-02-15', replies: 8, views: 54, topic: 'practice', pinned: false, lastReply: '5 hours ago', preview: 'We recently revamped our onboarding process and wanted to share what\'s been working well for us...' },
  { id: 3, title: 'Telehealth vs in-person — what are participants preferring?', author: 'Dr. Lisa M.', authorRole: 'Allied Health', date: '2026-02-14', replies: 15, views: 112, topic: 'service', pinned: false, lastReply: '1 day ago', preview: 'We\'ve noticed a shift back to in-person for younger participants but telehealth remains popular for...' },
  { id: 4, title: 'SIL roster management — any good tools?', author: 'Anonymous', authorRole: 'Provider', date: '2026-02-13', replies: 6, views: 42, topic: 'tech', pinned: false, lastReply: '1 day ago', preview: 'Managing SIL rosters is becoming increasingly complex. Does anyone use software that integrates with NDIS claiming?' },
  { id: 5, title: 'Worker screening turnaround times in VIC', author: 'Sarah K.', authorRole: 'HR Manager', date: '2026-02-12', replies: 4, views: 31, topic: 'compliance', pinned: false, lastReply: '2 days ago', preview: 'We\'re experiencing delays of 6+ weeks for worker screening checks. Is anyone else seeing this?' },
  { id: 6, title: 'Tips for supporting participants through plan reviews', author: 'James P.', authorRole: 'Support Coordinator', date: '2026-02-10', replies: 19, views: 145, topic: 'practice', pinned: false, lastReply: '3 days ago', preview: 'Plan reviews can be stressful for participants. Here are some strategies that have worked well...' },
];

const topics = [
  { key: 'all', label: 'All Topics' },
  { key: 'compliance', label: 'Compliance & Policy' },
  { key: 'practice', label: 'Practice & Delivery' },
  { key: 'service', label: 'Service Insights' },
  { key: 'tech', label: 'Technology & Tools' },
];

const QAForumPage = () => {
  const { user } = useAuth();
  const [topicFilter, setTopicFilter] = useState('all');
  const [showNewThread, setShowNewThread] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedThread, setSelectedThread] = useState(null);

  const filtered = mockThreads
    .filter(t => topicFilter === 'all' || t.topic === topicFilter)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === 'popular') return b.views - a.views;
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Q&A Forum</h1>
          <p className="text-sm text-slate-500 mt-1">Ask questions, share knowledge, and learn from other providers</p>
        </div>
        <button
          onClick={() => setShowNewThread(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
        >
          + New Discussion
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-2 flex-wrap flex-1">
          {topics.map(t => (
            <button
              key={t.key}
              onClick={() => setTopicFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                topicFilter === t.key ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>

      {/* Thread List */}
      <div className="space-y-3">
        {filtered.map(thread => (
          <div key={thread.id} onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)} className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${thread.pinned ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'} ${selectedThread === thread.id ? 'ring-2 ring-purple-300 border-purple-200' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {thread.author === 'Anonymous' ? '?' : thread.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {thread.pinned && <span className="text-amber-600 text-xs font-bold flex items-center gap-1"><Pin className="w-3.5 h-3.5" /> Pinned</span>}
                  <h3 className="text-base font-semibold text-slate-800 hover:text-purple-700 transition-colors">{thread.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{thread.preview}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="font-medium text-slate-600">{thread.author}</span>
                  <span>{thread.authorRole}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {thread.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {thread.views} views
                  </span>
                  <span>Last reply: {thread.lastReply}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewThread(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-5">Start a New Discussion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white">
                  {topics.filter(t => t.key !== 'all').map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input type="text" placeholder="What's your question or discussion topic?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
                <textarea rows={4} placeholder="Provide context or details..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600" />
                <span className="text-sm text-slate-600">Post anonymously</span>
              </label>
              <button onClick={() => setShowNewThread(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md">
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAForumPage;
