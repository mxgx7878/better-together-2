import { useState } from 'react';
import { Card, PageHeader, Button, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const mockContent = {
  events: [
    { id: 1, title: 'Melbourne Provider Breakfast', type: 'event', date: '2026-04-15', status: 'published', author: 'Admin' },
    { id: 2, title: 'Sydney NDIS Workshop', type: 'event', date: '2026-04-22', status: 'draft', author: 'Admin' },
    { id: 3, title: 'Perth Networking Evening', type: 'event', date: '2026-05-01', status: 'published', author: 'Admin' },
  ],
  blogs: [
    { id: 4, title: '10 Tips for NDIS Plan Management', type: 'blog', date: '2026-04-01', status: 'published', author: 'Sue Dymond' },
    { id: 5, title: 'Understanding Your Rights as a Participant', type: 'blog', date: '2026-03-28', status: 'published', author: 'Karen Burgess' },
    { id: 6, title: 'Provider Quality Standards Update 2026', type: 'blog', date: '2026-04-05', status: 'draft', author: 'Admin' },
  ],
  resources: [
    { id: 7, title: 'NDIS Price Guide 2025-26', type: 'resource', date: '2026-03-15', status: 'published', author: 'Admin' },
    { id: 8, title: 'Support Coordination Handbook', type: 'resource', date: '2026-02-20', status: 'published', author: 'Admin' },
    { id: 9, title: 'New Provider Onboarding Kit', type: 'resource', date: '2026-04-02', status: 'review', author: 'Admin' },
  ],
};

const ContentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const items = mockContent[activeTab] || [];

  const handleDelete = (id) => {
    toast.success('Content deleted');
  };

  const handlePublish = (id) => {
    toast.success('Content published');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Content Management" subtitle="Manage events, blog posts and resources">
        <Button>+ Create New</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Events', count: mockContent.events.length, key: 'events' },
          { label: 'Blog Posts', count: mockContent.blogs.length, key: 'blogs' },
          { label: 'Resources', count: mockContent.resources.length, key: 'resources' },
        ].map(s => (
          <button key={s.key} onClick={() => setActiveTab(s.key)} className={`p-4 rounded-2xl border text-left transition-all ${activeTab === s.key ? 'border-purple-300 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{s.count}</p>
          </button>
        ))}
      </div>

      {/* Content List */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Author</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{item.title}</td>
                  <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{item.author}</td>
                  <td className="px-5 py-3 text-slate-600 hidden md:table-cell">{new Date(item.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3">
                    <Badge color={item.status === 'published' ? 'green' : item.status === 'draft' ? 'slate' : 'amber'}>{item.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button className="text-purple-600 hover:text-purple-800 text-xs font-medium">Edit</button>
                    {item.status !== 'published' && <button onClick={() => handlePublish(item.id)} className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">Publish</button>}
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ContentManagementPage;
