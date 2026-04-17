import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Search, MapPin, Calendar, Mail, Phone, Globe, Building2, Info, Plus } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    author: 'Sarah M.',
    date: '2026-04-15',
    title: 'Looking for an Occupational Therapist in Berwick, Melbourne',
    content: 'Looking for an Occupational Therapist in Berwick, Melbourne who can do Functional Assessments and provide ongoing support. Dates needed are after May 2026.',
    location: 'Berwick, Melbourne',
    dateNeeded: 'After May 2026',
    replies: [
      {
        id: 101,
        providerName: 'Melbourne OT Solutions',
        providerType: 'Registered NDIS Provider',
        message: "We're a team of experienced OTs specialising in Functional Capacity Assessments across south-east Melbourne. We have availability from May 2026 and would love to chat about your needs.",
        contact: {
          email: 'hello@melbourneot.com.au',
          phone: '03 9876 5432',
          website: 'www.melbourneot.com.au',
        },
        date: '2026-04-16',
      },
      {
        id: 102,
        providerName: 'Berwick Allied Health',
        providerType: 'NDIS Registered',
        message: 'Local Berwick practice with 3 senior OTs. We complete FCA reports within 2 weeks and provide ongoing therapy support. Happy to arrange an initial chat.',
        contact: {
          email: 'intake@berwickallied.com.au',
          phone: '03 9701 2345',
          website: 'www.berwickallied.com.au',
        },
        date: '2026-04-16',
      },
    ],
  },
  {
    id: 2,
    author: 'James T.',
    date: '2026-04-14',
    title: 'Support Coordinator needed in Western Sydney',
    content: 'Looking for a new Support Coordinator in Penrith / Blacktown area. I manage my own plan and need someone who can help me find quality providers and attend plan meetings.',
    location: 'Penrith, NSW',
    dateNeeded: 'ASAP',
    replies: [
      {
        id: 201,
        providerName: 'Empower Coordination',
        providerType: 'NDIS Registered',
        message: "Hi James — our SC team covers all of Western Sydney. We have capacity to start this week. Let's connect.",
        contact: {
          email: 'connect@empowercoordination.com.au',
          phone: '02 4721 9988',
          website: 'www.empowercoordination.com.au',
        },
        date: '2026-04-15',
      },
    ],
  },
  {
    id: 3,
    author: 'Priya R.',
    date: '2026-04-12',
    title: 'Speech Pathologist for my son (age 6)',
    content: 'Looking for a paediatric Speech Pathologist in Brisbane Northside. My son has autism and needs support with social communication. Prefer a provider with NDIS experience.',
    location: 'Brisbane Northside, QLD',
    dateNeeded: 'From June 2026',
    replies: [],
  },
];

const MessageBoardPage = () => {
  const { user, isPaid, isProvider } = useAuth();
  const [posts, setPosts] = useState(mockPosts);
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState(1);
  const [replyingToPost, setReplyingToPost] = useState(null);
  const [newPostForm, setNewPostForm] = useState({ title: '', content: '', location: '', dateNeeded: '' });
  const [replyForm, setReplyForm] = useState({ message: '', email: '', phone: '', website: '' });

  const handleNewPost = () => {
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) return;
    const newPost = {
      id: Date.now(),
      author: user?.name || 'You',
      date: new Date().toISOString().split('T')[0],
      title: newPostForm.title,
      content: newPostForm.content,
      location: newPostForm.location,
      dateNeeded: newPostForm.dateNeeded,
      replies: [],
      isOwn: true,
    };
    setPosts([newPost, ...posts]);
    setNewPostForm({ title: '', content: '', location: '', dateNeeded: '' });
    setShowNewPost(false);
    setExpandedPost(newPost.id);
  };

  const handleReply = (postId) => {
    if (!replyForm.message.trim()) return;
    const reply = {
      id: Date.now(),
      providerName: user?.organisation || user?.name || 'Your Business',
      providerType: 'Paid Provider',
      message: replyForm.message,
      contact: {
        email: replyForm.email,
        phone: replyForm.phone,
        website: replyForm.website,
      },
      date: new Date().toISOString().split('T')[0],
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...p.replies, reply] } : p));
    setReplyForm({ message: '', email: '', phone: '', website: '' });
    setReplyingToPost(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Looking for Services</h1>
          <p className="text-sm text-slate-500 mt-1">Post what you need — paid providers will reply directly on the thread</p>
        </div>
        {!isProvider && (
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Post a Service Request
          </button>
        )}
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-semibold">How Looking for Services works:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>Post your request — describe what service, where, and when you need it.</li>
            <li>Only <strong>paid providers</strong> can reply with their contact details.</li>
            <li>Replies are visible to everyone on this page — providers cannot contact you privately.</li>
            <li>You choose which provider to reach out to.</li>
          </ul>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map(post => {
          const isExpanded = expandedPost === post.id;
          const initials = post.author.split(' ').map(n => n[0]).join('');
          return (
            <div key={post.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${post.isOwn ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-100'}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-slate-800">{post.author}</span>
                      {post.isOwn && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">YOUR POST</span>}
                      <span className="text-xs text-slate-400">· {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                      {post.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {post.location}</span>
                      )}
                      {post.dateNeeded && (
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Needed: {post.dateNeeded}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        {isExpanded ? 'Hide' : 'View'} {post.replies.length} provider {post.replies.length === 1 ? 'reply' : 'replies'}
                      </button>
                      {isProvider && isPaid && (
                        <button
                          onClick={() => setReplyingToPost(replyingToPost === post.id ? null : post.id)}
                          className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          Post a Reply
                        </button>
                      )}
                      {isProvider && !isPaid && (
                        <a href="/provider/upgrade" className="ml-auto text-xs text-amber-600 font-medium hover:underline">
                          Upgrade to reply to service requests →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-3">
                  {post.replies.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No provider replies yet. Be the first paid provider to reach out!</p>
                  ) : (
                    post.replies.map(reply => (
                      <div key={reply.id} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-800">{reply.providerName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{reply.providerType}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{reply.message}</p>
                            <div className="mt-3 pt-3 border-t border-slate-100 grid sm:grid-cols-3 gap-2 text-xs">
                              {reply.contact.email && (
                                <a href={`mailto:${reply.contact.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600">
                                  <Mail className="w-3.5 h-3.5" /> {reply.contact.email}
                                </a>
                              )}
                              {reply.contact.phone && (
                                <a href={`tel:${reply.contact.phone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600">
                                  <Phone className="w-3.5 h-3.5" /> {reply.contact.phone}
                                </a>
                              )}
                              {reply.contact.website && (
                                <a href={`https://${reply.contact.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 truncate">
                                  <Globe className="w-3.5 h-3.5" /> {reply.contact.website}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Provider reply form */}
                  {replyingToPost === post.id && isProvider && isPaid && (
                    <div className="bg-white rounded-xl border-2 border-purple-200 p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-800">Your Reply</h4>
                      <textarea
                        rows={3}
                        value={replyForm.message}
                        onChange={e => setReplyForm({ ...replyForm, message: e.target.value })}
                        placeholder="Briefly introduce your services and availability..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400"
                      />
                      <div className="grid sm:grid-cols-3 gap-2">
                        <input type="email" placeholder="Email" value={replyForm.email} onChange={e => setReplyForm({ ...replyForm, email: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400" />
                        <input type="tel" placeholder="Phone" value={replyForm.phone} onChange={e => setReplyForm({ ...replyForm, phone: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400" />
                        <input type="text" placeholder="Website" value={replyForm.website} onChange={e => setReplyForm({ ...replyForm, website: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-purple-400" />
                      </div>
                      <p className="text-xs text-slate-500">Note: Your reply and contact details are visible to everyone on the page. You cannot message the poster directly.</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleReply(post.id)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl">Post Reply</button>
                        <button onClick={() => setReplyingToPost(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Post a Service Request</h2>
            <p className="text-sm text-slate-500 mb-5">Tell providers what you're looking for.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Looking for an Occupational Therapist in Berwick"
                  value={newPostForm.title}
                  onChange={e => setNewPostForm({ ...newPostForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
                <textarea
                  rows={4}
                  value={newPostForm.content}
                  onChange={e => setNewPostForm({ ...newPostForm, content: e.target.value })}
                  placeholder="Describe the service you need, frequency, any specific requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    placeholder="Suburb, State"
                    value={newPostForm.location}
                    onChange={e => setNewPostForm({ ...newPostForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">When you need it</label>
                  <input
                    type="text"
                    placeholder="e.g. After May 2026"
                    value={newPostForm.dateNeeded}
                    onChange={e => setNewPostForm({ ...newPostForm, dateNeeded: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleNewPost} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Publish Post
                </button>
                <button onClick={() => setShowNewPost(false)} className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBoardPage;
