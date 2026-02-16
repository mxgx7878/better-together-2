import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Mock jobs posted by providers
const mockJobs = [
  { id: 1, title: 'Support Worker – Community Access', company: 'Sunshine Community Supports', location: 'Footscray, VIC', type: 'Part-time', salary: '$32–$38/hr', posted: '2026-02-15', desc: 'Supporting participants with community access and social activities in Melbourne\'s western suburbs. Must have a passion for community inclusion and a valid driver\'s licence.', requirements: ['NDIS Worker Screening Check', 'First Aid Certificate', 'Valid driver\'s licence', 'Experience with community participation'], tags: ['NDIS', 'Community', 'Weekend shifts'], applicants: 5, status: 'active' },
  { id: 2, title: 'Occupational Therapist', company: 'Allied Health Plus', location: 'Melbourne CBD', type: 'Full-time', salary: '$85k–$100k', posted: '2026-02-14', desc: 'Join our growing team to deliver home-based OT assessments and interventions for NDIS participants. You\'ll work autonomously with a supportive clinical team.', requirements: ['AHPRA Registration', 'Minimum 2 years experience', 'Home visit capability', 'NDIS experience preferred'], tags: ['Allied Health', 'Home Visits', 'NDIS Registered'], applicants: 12, status: 'active' },
  { id: 3, title: 'Support Coordinator', company: 'InReach Support Coordination', location: 'Remote / VIC', type: 'Full-time', salary: '$75k–$90k', posted: '2026-02-12', desc: 'Experienced support coordinator to manage a caseload of 35+ participants. NDIS experience essential. Flexible remote working arrangements available.', requirements: ['NDIS experience (2+ years)', 'Strong communication skills', 'CRM experience', 'Own vehicle'], tags: ['Coordination', 'Remote', 'Experienced'], applicants: 8, status: 'active' },
  { id: 4, title: 'Personal Care Worker – Overnight', company: 'Community Care Solutions', location: 'Richmond, VIC', type: 'Casual', salary: '$35–$45/hr', posted: '2026-02-11', desc: 'Overnight personal care support for participants in SIL accommodation. Active overnight shifts with sleep provision.', requirements: ['NDIS Worker Screening Check', 'Manual handling experience', 'Available overnight shifts', 'Medication assistance experience'], tags: ['SIL', 'Overnight', 'Personal Care'], applicants: 3, status: 'active' },
  { id: 5, title: 'Behaviour Support Practitioner', company: 'MindBridge Psychology', location: 'South Yarra, VIC', type: 'Full-time', salary: '$95k–$120k', posted: '2026-02-10', desc: 'Develop and implement behaviour support plans for NDIS participants across a range of settings.', requirements: ['NDIS BSP registration', 'Postgraduate qualification', 'PBS framework experience', 'Report writing skills'], tags: ['Behaviour Support', 'Clinical', 'NDIS'], applicants: 6, status: 'active' },
  { id: 6, title: 'Administration Officer', company: 'HomeFirst Modifications', location: 'Dandenong, VIC', type: 'Part-time', salary: '$30–$34/hr', posted: '2026-02-08', desc: 'Admin support for a growing home modifications provider. Handle scheduling, invoicing, and participant communications.', requirements: ['Admin experience', 'NDIS claiming knowledge preferred', 'Microsoft Office proficient', 'Strong phone manner'], tags: ['Admin', 'Claiming', 'Part-time'], applicants: 9, status: 'active' },
];

// Mock provider's own posted jobs (for management view)
const myPostedJobs = [
  { id: 101, title: 'Support Worker – Evening Shifts', type: 'Casual', location: 'Richmond, VIC', salary: '$34–$40/hr', posted: '2026-02-10', applicants: 7, status: 'active', views: 142 },
  { id: 102, title: 'Team Leader – SIL House', type: 'Full-time', location: 'Richmond, VIC', salary: '$80k–$90k', posted: '2026-01-28', applicants: 4, status: 'active', views: 98 },
  { id: 103, title: 'Admin Assistant', type: 'Part-time', location: 'Richmond, VIC', salary: '$28–$32/hr', posted: '2026-01-15', applicants: 11, status: 'closed', views: 210 },
];

// Mock applicants for a job
const mockApplicants = [
  { id: 1, name: 'Jordan Taylor', email: 'jordan.t@email.com', applied: '2026-02-14', status: 'new', summary: 'Experienced support worker with 3 years in community access programs. First Aid and Manual Handling certified.' },
  { id: 2, name: 'Sam Nguyen', email: 'sam.n@email.com', applied: '2026-02-13', status: 'reviewed', summary: '2 years in disability support. Currently completing Certificate IV in Disability. Available weekends.' },
  { id: 3, name: 'Casey Williams', email: 'casey.w@email.com', applied: '2026-02-12', status: 'shortlisted', summary: 'Background in aged care transitioning to NDIS. Strong communication skills and clean driving record.' },
  { id: 4, name: 'Morgan Lee', email: 'morgan.l@email.com', applied: '2026-02-11', status: 'new', summary: 'Recent grad with placement experience in SIL setting. Keen to build career in disability sector.' },
];

const typeColors = {
  'Full-time': 'bg-emerald-50 text-emerald-700',
  'Part-time': 'bg-blue-50 text-blue-700',
  'Casual': 'bg-amber-50 text-amber-700',
  'Contract': 'bg-purple-50 text-purple-700',
};

const statusColors = {
  new: 'bg-purple-100 text-purple-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const JobBoardPage = () => {
  const { isProvider, isPaid, user } = useAuth();

  // Shared state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Provider state
  const [providerTab, setProviderTab] = useState('browse'); // 'browse' | 'my-jobs'
  const [showPostJob, setShowPostJob] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(null);
  const [applicantStatuses, setApplicantStatuses] = useState({});

  // Participant state
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const filtered = mockJobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApply = (jobId) => {
    setAppliedJobs(prev => [...prev, jobId]);
    setApplicationSubmitted(true);
    setTimeout(() => {
      setShowApplyModal(null);
      setApplicationSubmitted(false);
    }, 2000);
  };

  const updateApplicantStatus = (applicantId, status) => {
    setApplicantStatuses(prev => ({ ...prev, [applicantId]: status }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Board</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isProvider
              ? 'Post vacancies, find qualified staff, and manage applications'
              : 'Find employment opportunities posted by providers that match your goals'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {/* Participant: My Applications button */}
          {!isProvider && appliedJobs.length > 0 && (
            <button
              onClick={() => setShowMyApplications(!showMyApplications)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                showMyApplications
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              My Applications ({appliedJobs.length})
            </button>
          )}
          {/* Provider: Post Job button */}
          {isProvider && isPaid && (
            <button
              onClick={() => setShowPostJob(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              + Post a Job
            </button>
          )}
        </div>
      </div>

      {/* Provider Tabs: Browse Jobs / My Posted Jobs */}
      {isProvider && isPaid && (
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => { setProviderTab('browse'); setViewingApplicants(null); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              providerTab === 'browse' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            Browse All Jobs
          </button>
          <button
            onClick={() => { setProviderTab('my-jobs'); setViewingApplicants(null); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              providerTab === 'my-jobs' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            My Posted Jobs ({myPostedJobs.length})
          </button>
        </div>
      )}

      {/* ─── PROVIDER: My Posted Jobs ─── */}
      {isProvider && isPaid && providerTab === 'my-jobs' && !viewingApplicants && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{myPostedJobs.filter(j => j.status === 'active').length}</p>
              <p className="text-xs text-slate-500">Active Listings</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{myPostedJobs.reduce((a, j) => a + j.applicants, 0)}</p>
              <p className="text-xs text-slate-500">Total Applicants</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{myPostedJobs.reduce((a, j) => a + j.views, 0)}</p>
              <p className="text-xs text-slate-500">Total Views</p>
            </div>
          </div>

          {/* My Jobs List */}
          {myPostedJobs.map(job => (
            <div key={job.id} className={`bg-white rounded-xl shadow-sm border p-5 ${job.status === 'closed' ? 'border-slate-200 opacity-70' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-slate-800">{job.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[job.type]}`}>{job.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {job.status === 'active' ? '● Active' : '● Closed'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{job.location} · {job.salary}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Posted {new Date(job.posted).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                    <span>{job.views} views</span>
                    <span className="font-semibold text-purple-600">{job.applicants} applicants</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setViewingApplicants(job)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    View Applicants
                  </button>
                  <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm rounded-xl transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PROVIDER: View Applicants for a Job ─── */}
      {isProvider && isPaid && viewingApplicants && (
        <div className="space-y-4">
          <button onClick={() => setViewingApplicants(null)} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to My Jobs
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800">{viewingApplicants.title}</h2>
            <p className="text-sm text-slate-500">{viewingApplicants.applicants} applicants · {viewingApplicants.views} views</p>
          </div>

          {mockApplicants.map(applicant => {
            const currentStatus = applicantStatuses[applicant.id] || applicant.status;
            return (
              <div key={applicant.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {applicant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-800">{applicant.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[currentStatus]}`}>
                          {currentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{applicant.email} · Applied {new Date(applicant.applied).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-sm text-slate-600 mt-2">{applicant.summary}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => updateApplicantStatus(applicant.id, 'shortlisted')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      currentStatus === 'shortlisted' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    ✓ Shortlist
                  </button>
                  <button
                    onClick={() => updateApplicantStatus(applicant.id, 'reviewed')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      currentStatus === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Mark Reviewed
                  </button>
                  <button className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors">
                    Message
                  </button>
                  <button
                    onClick={() => updateApplicantStatus(applicant.id, 'rejected')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ml-auto"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── PARTICIPANT: My Applications Panel ─── */}
      {!isProvider && showMyApplications && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">My Applications</h3>
          <div className="space-y-3">
            {mockJobs.filter(j => appliedJobs.includes(j.id)).map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {job.company.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Applied</span>
                  <p className="text-[10px] text-slate-400 mt-1">Awaiting response</p>
                </div>
              </div>
            ))}
            {appliedJobs.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No applications yet. Browse jobs below and click Apply!</p>
            )}
          </div>
        </div>
      )}

      {/* ─── BROWSE JOBS (Both Roles) ─── */}
      {((!isProvider) || (isProvider && providerTab === 'browse') || (isProvider && !isPaid)) && !viewingApplicants && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={isProvider ? 'Search jobs by title or provider...' : 'Search for jobs that interest you...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Full-time', 'Part-time', 'Casual'].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    typeFilter === t ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Participant tip banner */}
          {!isProvider && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-sm text-blue-800">These jobs are posted by NDIS providers on the platform. Click <strong>Apply Now</strong> to send your interest directly to the provider. They'll review your application and get in touch about next steps.</p>
            </div>
          )}

          {/* Job Listings */}
          <div className="space-y-4">
            {filtered.map(job => {
              const hasApplied = appliedJobs.includes(job.id);
              return (
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
                    {/* Action Button — different for each role */}
                    {!isProvider ? (
                      <button
                        onClick={() => !hasApplied && setShowApplyModal(job)}
                        disabled={hasApplied}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          hasApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md'
                        }`}
                      >
                        {hasApplied ? '✓ Applied' : 'Apply Now'}
                      </button>
                    ) : (
                      <button className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors flex-shrink-0">
                        View Details
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-3">{job.desc}</p>

                  {/* Requirements shown for participants */}
                  {!isProvider && job.requirements && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 mb-1.5">Requirements:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requirements.map(req => (
                          <span key={req} className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">{req}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeColors[job.type]}`}>{job.type}</span>
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
              );
            })}
          </div>
        </>
      )}

      {/* ─── PARTICIPANT: Apply Modal ─── */}
      {showApplyModal && !isProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !applicationSubmitted && setShowApplyModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            {applicationSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h3 className="text-lg font-semibold text-slate-800">Application Sent!</h3>
                <p className="text-sm text-slate-500 mt-1">The provider will review your application and get in touch.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Apply for this Role</h2>
                    <p className="text-sm text-slate-500 mt-1">{showApplyModal.title} at {showApplyModal.company}</p>
                  </div>
                  <button onClick={() => setShowApplyModal(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Job Summary */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className={`font-semibold px-2 py-0.5 rounded-lg ${typeColors[showApplyModal.type]}`}>{showApplyModal.type}</span>
                    <span className="text-slate-500">{showApplyModal.location}</span>
                    <span className="font-semibold text-emerald-700">{showApplyModal.salary}</span>
                  </div>
                </div>

                {/* Application Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="0412 345 678" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Location / Suburb</label>
                    <input type="text" defaultValue={user.location} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Availability</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Weekdays', 'Weekends', 'Mornings', 'Evenings', 'Overnights', 'Flexible'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tell us about yourself</label>
                    <textarea
                      rows={4}
                      placeholder="Share your experience, skills, and why you're interested in this role..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume / Supporting Document (optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-purple-300 transition-colors cursor-pointer">
                      <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC up to 5MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(showApplyModal.id)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    Submit Application
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">Your application will be sent directly to {showApplyModal.company}. They will contact you about next steps.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── PROVIDER: Post Job Modal ─── */}
      {showPostJob && isProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostJob(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Post a Job Vacancy</h2>
              <button onClick={() => setShowPostJob(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
                <input type="text" placeholder="e.g., Support Worker – Community Access" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white">
                    <option>Full-time</option><option>Part-time</option><option>Casual</option><option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                  <input type="text" placeholder="e.g., Melbourne CBD" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary Range</label>
                <input type="text" placeholder="e.g., $32–$38/hr or $85k–$100k" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Description</label>
                <textarea rows={4} placeholder="Describe the role, responsibilities, and working conditions..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Requirements (one per line)</label>
                <textarea rows={3} placeholder={"e.g.,\nNDIS Worker Screening Check\nFirst Aid Certificate\nValid driver's licence"} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">How should applicants apply?</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-purple-500 bg-purple-50 rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="apply-method" defaultChecked className="sr-only" />
                    <span className="text-sm font-medium text-purple-700">Through platform</span>
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                    <input type="radio" name="apply-method" className="sr-only" />
                    <span className="text-sm font-medium text-slate-700">External link</span>
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600" />
                <span className="text-sm text-slate-600">Share with my bookmarked provider network</span>
              </label>
              <button
                onClick={() => setShowPostJob(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md"
              >
                Publish Job Vacancy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoardPage;