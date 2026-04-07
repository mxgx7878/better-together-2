import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Heart, Pin } from '../../components/Icons';

const mockPosts = [
  { id: 1, author: 'Rebecca M.', date: '2026-02-16', category: 'tips', title: 'My top 3 tips for a successful plan review', content: 'Just had my plan review and got everything I asked for! Here\'s what helped me: 1) Started preparing 3 months early, 2) Collected evidence from all my providers, 3) Wrote a clear statement about my goals.', likes: 24, replies: 8, pinned: true },
  { id: 2, author: 'Alex K.', date: '2026-02-15', category: 'question', title: 'Has anyone used support coordination for the first time?', content: 'I just got SC funding in my plan. What should I expect from a support coordinator and how do I find a good one?', likes: 12, replies: 15, pinned: false },
  { id: 3, author: 'Maria L.', date: '2026-02-14', category: 'experience', title: 'Sharing my journey with assistive technology', content: 'After months of assessments, I finally got my communication device and it has completely changed my daily life. Happy to answer questions for anyone going through the AT process.', likes: 38, replies: 11, pinned: false },
  { id: 4, author: 'Chris D.', date: '2026-02-13', category: 'social', title: 'Melbourne participants — weekend coffee catch-up?', content: 'Would anyone be interested in a casual coffee meetup this Saturday in the CBD? Thinking accessible venue, around 11am. All welcome!', likes: 15, replies: 6, pinned: false },
  { id: 5, author: 'Anonymous', date: '2026-02-12', category: 'question', title: 'Confused about core vs capacity building funding', content: 'My plan has both but I\'m not sure what I can use each for. Can someone explain the difference in simple terms?', likes: 9, replies: 7, pinned: false },
  { id: 6, author: 'Tina W.', date: '2026-02-11', category: 'experience', title: 'Finding employment support that actually works', content: 'After trying 3 different employment providers, I finally found one that understands my needs. They helped me write my resume and practice for interviews.', likes: 21, replies: 4, pinned: false },
];

const categoryConfig = {
  tips: { label: 'Tips & Advice', color: 'bg-emerald-50 text-emerald-700' },
  question: { label: 'Question', color: 'bg-blue-50 text-blue-700' },
  experience: { label: 'Shared Experience', color: 'bg-purple-50 text-purple-700' },
  social: { label: 'Social & Events', color: 'bg-amber-50 text-amber-700' },
};

const MessageBoardPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [likedPosts, setLikedPosts] = useState([1, 3]);
  const [expandedReplies, setExpandedReplies] = useState(null);

  const filtered = filter === 'all' ? mockPosts : mockPosts.filter(p => p.category === filter);

  const toggleLike = (id) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Message Board</h1>
          <p className="text-sm text-slate-500 mt-1">Connect with other participants, ask questions, and share experiences</p>
        </div>
        <button onClick={() => setShowNewPost(true)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all">
          + New Post
        </button>
      </div>

      {/* Community Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Heart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">This is a safe, supportive community space. Be respectful, share kindly, and remember everyone's journey is different. You can post anonymously if you prefer.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>All Posts</button>
        {Object.entries(categoryConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === key ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${post.pinned ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100 hover:shadow-md'}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {post.author === 'Anonymous' ? '?' : post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {post.pinned && <span className="text-xs text-amber-600 font-bold flex items-center gap-1"><Pin className="w-3.5 h-3.5" /> Pinned</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryConfig[post.category]?.color}`}>{categoryConfig[post.category]?.label}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-800">{post.title}</h3>
                <p className="text-sm text-slate-600 mt-1.5">{post.content}</p>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.includes(post.id) ? 'text-pink-600 font-medium' : 'text-slate-400 hover:text-pink-500'}`}>
                    <svg className="w-4 h-4" fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {post.likes + (likedPosts.includes(post.id) && post.id !== 1 && post.id !== 3 ? 1 : 0)}
                  </button>
                  <button onClick={() => setExpandedReplies(expandedReplies === post.id ? null : post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${expandedReplies === post.id ? 'text-purple-600 font-medium' : 'text-slate-400 hover:text-purple-500'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {post.replies} replies
                  </button>
                  <span className="text-xs text-slate-400 ml-auto">{post.author} · {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-5">Create a Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white">
                  {Object.entries(categoryConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input type="text" placeholder="What's on your mind?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Post</label>
                <textarea rows={5} placeholder="Share your thoughts, questions, or experiences..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600" />
                <span className="text-sm text-slate-600">Post anonymously</span>
              </label>
              <button onClick={() => setShowNewPost(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md">Publish Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBoardPage;
