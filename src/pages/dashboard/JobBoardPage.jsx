import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const mockJobs = [
  { id: 1, title: 'Support Worker – Community Access', company: 'Sunshine Community Supports', location: 'Footscray, VIC', type: 'Part-time', salary: '$32–$38/hr', posted: '2026-02-15', desc: 'Supporting participants with community access and social activities in Melbourne\'s western suburbs.', tags: ['NDIS', 'Community', 'Weekend shifts'] },
  { id: 2, title: 'Occupational Therapist', company: 'Allied Health Plus', location: 'Melbourne CBD', type: 'Full-time', salary: '$85k–$100k', posted: '2026-02-14', desc: 'Join our growing team to deliver home-based OT assessments and interventions for NDIS participants.', tags: ['Allied Health', 'Home Visits', 'NDIS Registered'] },
  { id: 3, title: 'Support Coordinator', company: 'InReach Support Coordination', location: 'Remote / VIC', type: 'Full-time', salary: '$75k–$90k', posted: '2026-02-12', desc: 'Experienced support coordinator to manage a caseload of 35+ participants. NDIS experience essential.', tags: ['Coordination', 'Remote', 'Experienced'] },
  { id: 4, title: 'Personal Care Worker – Overnight', company: 'Community Care Solutions', location: 'Richmond, VIC', type: 'Casual', salary: '$35–$45/hr', posted: '2026-02-11', desc: 'Overnight personal care support for participants in SIL accommodation.', tags: ['SIL', 'Overnight', 'Personal Care'] },
  { id: 5, title: 'Behaviour Support Practitioner', company: 'MindBridge Psychology', location: 'South Yarra, VIC', type: 'Full-time', salary: '$95k–$120k', posted: '2026-02-10', desc: 'Develop and implement behaviour support plans. Must be a registered NDIS behaviour support practitioner.', tags: ['Behaviour Support', 'Clinical', 'NDIS'] },
  { id: 6, title: 'Administration Officer', company: 'HomeFirst Modifications', location: 'Dandenong, VIC', type: 'Part-time', salary: '$30–$34/hr', posted: '2026-02-08', desc: 'Admin support for a growing home modifications provider. NDIS claiming experience preferred.', tags: ['Admin', 'Claiming', 'Part-time'] },
];

const typeColors = { 'Full-time': 'bg-emerald-50 text-emerald-700', 'Part-time': 'bg-blue-50 text-blue-700', 'Casual': 'bg-amber-50 text-amber-700', 'Contract': 'bg-purple-50 text-purple-700' };

const JobBoardPage = () => {
  const { isProvider, isPaid } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showPostJob, setShowPostJob] = useState(false);

  const filtered = mockJobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Board</h1>
          <p className="text-sm text-slate-500 mt-1">{isProvider ? 'Post vacancies and find qualified staff' : 'Find employment opportunities that match your goals'}</p>
        </div>
        {isProvider && isPaid && (
          <button onClick={() => setShowPostJob(true)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg">
            + Post a Job
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search jobs by title or provider..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none" />
        </div>
        <div className="flex gap-2">
          {['All', 'Full-time', 'Part-time', 'Casual'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${typeFilter === t ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {job.company.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.company}</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
                {isProvider ? 'View' : 'Apply'}
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-3">{job.desc}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[job.type] || 'bg-slate-100 text-slate-600'}`}>{job.type}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {job.location}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">{job.salary}</span>
              <span className="text-xs text-slate-400 ml-auto">Posted {new Date(job.posted).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex gap-1.5 mt-3">
              {job.tags.map(tag => <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostJob(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-5">Post a Job Vacancy</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label><input type="text" placeholder="e.g., Support Worker – Community Access" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white">
                    <option>Full-time</option><option>Part-time</option><option>Casual</option><option>Contract</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label><input type="text" placeholder="e.g., Melbourne CBD" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Salary Range</label><input type="text" placeholder="e.g., $32–$38/hr or $85k–$100k" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label><textarea rows={4} placeholder="Describe the role, requirements, and qualifications..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none" /></div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md">Publish Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoardPage;