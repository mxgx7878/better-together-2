import { useState } from 'react';
import { Trophy, Target, ClipboardList, Heart, TrendingUp, Laptop, FileText, Video, FolderOpen, Mic } from '../../../components/Icons';

const categories = [
  { id: 'practice', label: 'Practice Excellence', icon: Trophy, color: 'from-purple-500 to-indigo-600', items: [
    { title: 'Person-Centred Planning Guide', type: 'guide', duration: '15 min read' },
    { title: 'Best Practice in Service Delivery', type: 'video', duration: '22 min' },
    { title: 'Quality Indicators Template', type: 'template', duration: 'Download' },
    { title: 'Participant Feedback Framework', type: 'guide', duration: '10 min read' },
  ]},
  { id: 'leadership', label: 'Leadership', icon: Target, color: 'from-blue-500 to-cyan-600', items: [
    { title: 'Leading with Lived Experience', type: 'video', duration: '30 min' },
    { title: 'Building a Team Culture of Inclusion', type: 'webinar', duration: '45 min' },
    { title: 'Strategic Planning for NDIS Providers', type: 'guide', duration: '20 min read' },
  ]},
  { id: 'compliance', label: 'Compliance', icon: ClipboardList, color: 'from-emerald-500 to-teal-600', items: [
    { title: 'NDIS Practice Standards Overview', type: 'guide', duration: '25 min read' },
    { title: 'Audit Preparation Checklist', type: 'template', duration: 'Download' },
    { title: 'Incident Management Procedures', type: 'video', duration: '18 min' },
    { title: 'Worker Screening Requirements 2026', type: 'guide', duration: '12 min read' },
    { title: 'Restrictive Practices Compliance', type: 'webinar', duration: '40 min' },
  ]},
  { id: 'participant', label: 'Participant Experience', icon: Heart, color: 'from-pink-500 to-rose-600', items: [
    { title: 'Co-Design with Participants', type: 'video', duration: '28 min' },
    { title: 'Feedback Collection Tools', type: 'template', duration: 'Download' },
    { title: 'Accessible Communication Guide', type: 'guide', duration: '15 min read' },
  ]},
  { id: 'business', label: 'Business Growth', icon: TrendingUp, color: 'from-amber-500 to-orange-600', items: [
    { title: 'NDIS Pricing Guide Walkthrough', type: 'video', duration: '35 min' },
    { title: 'Marketing Your NDIS Services', type: 'guide', duration: '20 min read' },
    { title: 'Financial Management for Providers', type: 'webinar', duration: '50 min' },
    { title: 'Service Agreement Template', type: 'template', duration: 'Download' },
  ]},
  { id: 'tech', label: 'Technology & Tools', icon: Laptop, color: 'from-slate-500 to-slate-700', items: [
    { title: 'Digital Record Keeping Best Practices', type: 'guide', duration: '15 min read' },
    { title: 'Using CRM for Client Management', type: 'video', duration: '20 min' },
    { title: 'Telehealth Setup Guide', type: 'guide', duration: '10 min read' },
  ]},
];

const typeIconMap = { guide: FileText, video: Video, template: FolderOpen, webinar: Mic };
const typeColors = { guide: 'bg-blue-50 text-blue-700', video: 'bg-red-50 text-red-700', template: 'bg-emerald-50 text-emerald-700', webinar: 'bg-purple-50 text-purple-700' };

const InnovationLabPage = () => {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const allItems = categories.flatMap(c => c.items.map(i => ({ ...i, category: c.label })));
  const searchResults = search.length > 1 ? allItems.filter(i => i.title.toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Innovation Lab</h1>
        <p className="text-sm text-slate-500 mt-1">Professional development resources, training, and sector innovation</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20 max-h-64 overflow-y-auto">
            {searchResults.map((item, i) => {
              const TypeIcon = typeIconMap[item.type];
              return (
                <button key={i} onClick={() => { const cat = categories.find(c => c.label === item.category); if (cat) setExpanded(cat.id); setSearch(''); setSelectedItem(item.title); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left border-b border-slate-50 last:border-0">
                  {TypeIcon && <TypeIcon className="w-5 h-5 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.category} · {item.duration}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Folders */}
      <div className="space-y-3">
        {categories.map(cat => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <CatIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-slate-800">{cat.label}</h3>
                    <p className="text-xs text-slate-500">{cat.items.length} resources</p>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expanded === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expanded === cat.id && (
                <div className="px-6 pb-5 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-3 pt-4">
                    {cat.items.map((item, i) => {
                      const TypeIcon = typeIconMap[item.type];
                      return (
                        <button key={i} onClick={() => setSelectedItem(selectedItem === item.title ? null : item.title)} className={`flex items-center gap-3 p-4 rounded-xl hover:bg-purple-50 hover:border-purple-200 border transition-all text-left group ${selectedItem === item.title ? 'bg-purple-50 border-purple-300' : 'bg-slate-50 border-transparent'}`}>
                          {TypeIcon && <TypeIcon className="w-6 h-6 flex-shrink-0" />}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-purple-700 transition-colors">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${typeColors[item.type]}`}>{item.type}</span>
                              <span className="text-xs text-slate-400">{item.duration}</span>
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InnovationLabPage;
