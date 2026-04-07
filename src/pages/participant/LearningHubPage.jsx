import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { ClipboardList, Search, DollarSign, Edit, Scale, Landmark, Handshake, Target, Briefcase, Laptop, Lock } from '../../components/Icons';

const modules = [
  { id: 1, title: 'Understanding Your NDIS Plan', category: 'Getting Started', lessons: 6, completed: 4, icon: ClipboardList, desc: 'Learn how to read and understand your NDIS plan, including funding categories and budgets.', difficulty: 'Beginner' },
  { id: 2, title: 'Choosing the Right Providers', category: 'Getting Started', lessons: 5, completed: 5, icon: Search, desc: 'How to find, compare, and choose providers that match your goals.', difficulty: 'Beginner' },
  { id: 3, title: 'Self-Management Basics', category: 'Managing Your Plan', lessons: 8, completed: 2, icon: DollarSign, desc: 'A step-by-step guide to self-managing your NDIS funding effectively.', difficulty: 'Intermediate' },
  { id: 4, title: 'Preparing for Plan Reviews', category: 'Managing Your Plan', lessons: 4, completed: 0, icon: Edit, desc: 'Get ready for your plan review with templates, tips, and checklists.', difficulty: 'Beginner' },
  { id: 5, title: 'Your Rights Under the NDIS', category: 'Know Your Rights', lessons: 5, completed: 0, icon: Scale, desc: 'Understand your rights as a participant, including complaints and appeals.', difficulty: 'Beginner' },
  { id: 6, title: 'AAT Appeals Process', category: 'Know Your Rights', lessons: 6, completed: 0, icon: Landmark, desc: 'Step-by-step guide to the Administrative Appeals Tribunal process.', difficulty: 'Advanced', paid: true },
  { id: 7, title: 'Building Your Support Team', category: 'Living Well', lessons: 4, completed: 0, icon: Handshake, desc: 'Tips for building a reliable team of support workers and coordinators.', difficulty: 'Beginner' },
  { id: 8, title: 'Goal Setting & Achievement', category: 'Living Well', lessons: 5, completed: 0, icon: Target, desc: 'How to set meaningful goals and track your progress over time.', difficulty: 'Intermediate' },
  { id: 9, title: 'Employment & Your NDIS Plan', category: 'Employment', lessons: 4, completed: 0, icon: Briefcase, desc: 'How NDIS funding can support your employment goals.', difficulty: 'Intermediate' },
  { id: 10, title: 'Technology & Assistive Tools', category: 'Living Well', lessons: 6, completed: 0, icon: Laptop, desc: 'Discover assistive technology that can help you live more independently.', difficulty: 'Beginner' },
];

const categories = [...new Set(modules.map(m => m.category))];
const difficultyColors = { 'Beginner': 'bg-emerald-50 text-emerald-700', 'Intermediate': 'bg-amber-50 text-amber-700', 'Advanced': 'bg-red-50 text-red-700' };

const LearningHubPage = () => {
  const { isPaid } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = modules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalLessons = modules.reduce((a, m) => a + m.lessons, 0);
  const completedLessons = modules.reduce((a, m) => a + m.completed, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Learning Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Build your knowledge and confidence with guided learning modules</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Your Learning Progress</h2>
            <p className="text-blue-100 text-sm mt-1">{completedLessons} of {totalLessons} lessons completed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="text-lg font-bold">{overallProgress}%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{modules.filter(m => m.completed === m.lessons).length}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-2 sm:p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{modules.filter(m => m.completed > 0 && m.completed < m.lessons).length}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">In Progress</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-2 sm:p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{modules.filter(m => m.completed === 0).length}</p>
            <p className="text-[10px] sm:text-xs text-blue-200">Not Started</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search modules..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(mod => {
          const progress = mod.lessons > 0 ? Math.round((mod.completed / mod.lessons) * 100) : 0;
          const isLocked = mod.paid && !isPaid;
          const ModIcon = mod.icon;
          return (
            <div key={mod.id} className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all ${isLocked ? 'border-slate-200 opacity-80' : mod.completed === mod.lessons ? 'border-emerald-200' : 'border-slate-100'} ${isLocked ? '' : 'cursor-pointer'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ModIcon className="w-7 h-7 flex-shrink-0 text-slate-600" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-800">{mod.title}</h3>
                      {isLocked && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Paid
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{mod.category}</p>
                  </div>
                </div>
                {mod.completed === mod.lessons && mod.lessons > 0 && (
                  <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-2">{mod.desc}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[mod.difficulty]}`}>{mod.difficulty}</span>
                <span className="text-xs text-slate-400">{mod.lessons} lessons</span>
              </div>
              {!isLocked && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>{mod.completed}/{mod.lessons} completed</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              {isLocked && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <a href="/dashboard/upgrade" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Upgrade to access →</a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningHubPage;
