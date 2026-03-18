import { useState } from 'react';
import { BookOpen, FileText, FolderOpen } from '../../components/Icons';

const documents = [
  { id: 1, title: 'Accessibility Standards Checklist', category: 'Compliance', type: 'pdf', size: '245 KB', updated: '2026-01-15' },
  { id: 2, title: 'Behaviour Support Plan Template', category: 'Templates', type: 'docx', size: '89 KB', updated: '2026-02-01' },
  { id: 3, title: 'CHSP Program Overview', category: 'Sector Updates', type: 'pdf', size: '1.2 MB', updated: '2025-12-20' },
  { id: 4, title: 'Complaint Resolution Procedure', category: 'Policies', type: 'pdf', size: '320 KB', updated: '2026-01-28' },
  { id: 5, title: 'Cultural Safety Framework', category: 'Provider Guides', type: 'pdf', size: '580 KB', updated: '2026-02-05' },
  { id: 6, title: 'Emergency Response Plan Template', category: 'Templates', type: 'docx', size: '102 KB', updated: '2025-11-30' },
  { id: 7, title: 'Feedback and Complaints Form', category: 'Participant Resources', type: 'pdf', size: '78 KB', updated: '2026-01-10' },
  { id: 8, title: 'Goal Setting Workbook', category: 'Participant Resources', type: 'pdf', size: '1.8 MB', updated: '2026-02-10' },
  { id: 9, title: 'Incident Reporting Guide', category: 'Compliance', type: 'pdf', size: '410 KB', updated: '2026-01-22' },
  { id: 10, title: 'Induction Checklist for New Staff', category: 'Staff Training', type: 'docx', size: '95 KB', updated: '2025-12-15' },
  { id: 11, title: 'NDIS Plan Readiness Guide', category: 'Participant Resources', type: 'pdf', size: '670 KB', updated: '2026-02-08' },
  { id: 12, title: 'NDIS Pricing Arrangements 2025-26', category: 'Sector Updates', type: 'pdf', size: '2.1 MB', updated: '2026-01-01' },
  { id: 13, title: 'Privacy and Consent Policy', category: 'Policies', type: 'pdf', size: '290 KB', updated: '2025-10-12' },
  { id: 14, title: 'Provider Onboarding Handbook', category: 'Provider Guides', type: 'pdf', size: '3.4 MB', updated: '2026-01-20' },
  { id: 15, title: 'Risk Assessment Matrix', category: 'Templates', type: 'xlsx', size: '156 KB', updated: '2025-11-18' },
  { id: 16, title: 'Service Agreement Template', category: 'Templates', type: 'docx', size: '112 KB', updated: '2026-02-12' },
  { id: 17, title: 'Support Worker Code of Conduct', category: 'Staff Training', type: 'pdf', size: '340 KB', updated: '2025-09-25' },
  { id: 18, title: 'Transition Planning Guide', category: 'Provider Guides', type: 'pdf', size: '520 KB', updated: '2026-01-30' },
];

const allCategories = ['All', ...new Set(documents.map(d => d.category))].sort();

const typeIconMap = {
  pdf: { Icon: FileText, color: 'text-red-600' },
  docx: { Icon: BookOpen, color: 'text-blue-600' },
  xlsx: { Icon: FolderOpen, color: 'text-emerald-600' },
};

const categoryColors = {
  'Compliance': 'bg-red-50 text-red-700',
  'Templates': 'bg-emerald-50 text-emerald-700',
  'Sector Updates': 'bg-blue-50 text-blue-700',
  'Policies': 'bg-purple-50 text-purple-700',
  'Provider Guides': 'bg-amber-50 text-amber-700',
  'Participant Resources': 'bg-pink-50 text-pink-700',
  'Staff Training': 'bg-cyan-50 text-cyan-700',
};

const LibraryPage = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = documents
    .filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  // Group by first letter
  const grouped = filtered.reduce((acc, doc) => {
    const letter = doc.title[0].toUpperCase();
    acc[letter] = acc[letter] || [];
    acc[letter].push(doc);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Library</h1>
        <p className="text-sm text-slate-500 mt-1">Browse and download resources, templates, and guides</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-white min-w-[180px]"
          >
            {allCategories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400 mt-3">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found · Sorted A–Z</p>
      </div>

      {/* Alpha Navigation */}
      <div className="flex flex-wrap gap-1">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
              grouped[letter] ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-slate-50 text-slate-300'
            }`}
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Documents Grouped */}
      <div className="space-y-6">
        {Object.keys(grouped).sort().map(letter => (
          <div key={letter} id={`letter-${letter}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">{letter}</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-2">
              {grouped[letter].map(doc => {
                const typeInfo = typeIconMap[doc.type] || { Icon: FileText, color: 'text-slate-600' };
                const TypeIcon = typeInfo.Icon;
                return (
                  <div key={doc.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition-all group cursor-pointer">
                    <TypeIcon className={`w-6 h-6 flex-shrink-0 ${typeInfo.color}`} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[doc.category] || 'bg-slate-100 text-slate-600'}`}>{doc.category}</span>
                        <span className="text-[11px] text-slate-400 uppercase">{doc.type}</span>
                        <span className="text-[11px] text-slate-400">{doc.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400 hidden sm:inline">{new Date(doc.updated).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                      <button className="p-2 bg-slate-50 hover:bg-purple-100 rounded-lg transition-colors group-hover:bg-purple-50">
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
