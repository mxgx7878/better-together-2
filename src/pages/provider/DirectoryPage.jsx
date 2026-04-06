import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star } from '../../components/Icons';

const mockProviders = [
  { id: 1, name: 'Allied Health Plus', type: 'Therapy Services', services: ['OT', 'Speech Pathology', 'Physiotherapy'], location: 'Melbourne CBD', distance: 5, rating: 4.8, reviews: 23, registered: true, openToCollab: true, featured: true, desc: 'Comprehensive allied health services with a person-centred approach.', tags: ['NDIS Registered', 'Telehealth', 'Home Visits'] },
  { id: 2, name: 'InReach Support Coordination', type: 'Support Coordination', services: ['Support Coordination', 'Psychosocial Recovery'], location: 'Richmond, VIC', distance: 8, rating: 4.9, reviews: 41, registered: true, openToCollab: true, featured: false, desc: 'Specialist support coordination helping participants navigate the NDIS.', tags: ['NDIS Registered', 'CALD Experience'] },
  { id: 3, name: 'Sunshine Community Supports', type: 'Daily Living', services: ['Core Supports', 'Community Participation', 'Personal Care'], location: 'Footscray, VIC', distance: 12, rating: 4.6, reviews: 18, registered: true, openToCollab: false, featured: false, desc: 'Supporting daily living and community inclusion across Melbourne\'s west.', tags: ['NDIS Registered', 'Wheelchair Accessible'] },
  { id: 4, name: 'MindBridge Psychology', type: 'Mental Health', services: ['Counselling', 'Psychology', 'Behaviour Support'], location: 'South Yarra, VIC', distance: 6, rating: 4.7, reviews: 35, registered: true, openToCollab: true, featured: true, desc: 'Trauma-informed mental health services for all ages.', tags: ['Trauma-Informed', 'NDIS Registered'] },
  { id: 5, name: 'Able Employment Solutions', type: 'Employment', services: ['Employment Supports', 'Job Coaching', 'Resume Building'], location: 'Docklands, VIC', distance: 3, rating: 4.5, reviews: 12, registered: false, openToCollab: true, featured: false, desc: 'Helping participants find meaningful work and build career skills.', tags: ['Employment Focus', 'Supported Employment'] },
  { id: 6, name: 'HomeFirst Modifications', type: 'Equipment & Home Mods', services: ['Home Modifications', 'Assistive Technology', 'Vehicle Mods'], location: 'Dandenong, VIC', distance: 28, rating: 4.4, reviews: 9, registered: true, openToCollab: false, featured: false, desc: 'Making homes and vehicles accessible for independent living.', tags: ['NDIS Registered', 'Capital Supports'] },
  { id: 7, name: 'First Peoples Inclusion', type: 'Community & Inclusion', services: ['First Nations Services', 'Cultural Programs', 'Advocacy'], location: 'Fitzroy, VIC', distance: 7, rating: 4.9, reviews: 28, registered: true, openToCollab: true, featured: false, desc: 'Culturally safe, community-led supports for First Nations people.', tags: ['First Nations-led', 'Cultural Safety'] },
  { id: 8, name: 'TechAssist Pro', type: 'Assistive Technology', services: ['Communication Devices', 'Smart Home', 'AT Assessments'], location: 'CBD, VIC', distance: 4, rating: 4.6, reviews: 15, registered: true, openToCollab: true, featured: false, desc: 'Specialist assistive technology assessments and device setup.', tags: ['AT Specialists', 'NDIS Registered'] },
];

const serviceFilters = ['All Services', 'Therapy Services', 'Support Coordination', 'Daily Living', 'Mental Health', 'Employment', 'Equipment & Home Mods', 'Community & Inclusion', 'Assistive Technology'];
const radiusOptions = [10, 25, 50, 100];

const DirectoryPage = () => {
  const { isProvider, isPaid } = useAuth();
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [radius, setRadius] = useState(50);
  const [showCollabOnly, setShowCollabOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState([1, 4]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const filtered = mockProviders.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesService = serviceFilter === 'All Services' || p.type === serviceFilter;
    const matchesRadius = p.distance <= radius;
    const matchesCollab = !showCollabOnly || p.openToCollab;
    return matchesSearch && matchesService && matchesRadius && matchesCollab;
  });

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isProvider ? 'Provider Directory' : 'Connect with Services'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isProvider ? 'Find providers to collaborate with and build referral pathways' : 'Browse verified providers by location and service type'}
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, service, or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all"
            />
          </div>

          {/* Service Type */}
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none bg-white min-w-[180px]"
          >
            {serviceFilters.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Radius */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-xs text-slate-500 whitespace-nowrap">Radius:</span>
            <div className="flex gap-1">
              {radiusOptions.map(r => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    radius === r ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
          {isProvider && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCollabOnly}
                onChange={e => setShowCollabOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-slate-600">Open to collaboration only</span>
            </label>
          )}
          <span className="text-sm text-slate-400 ml-auto">{filtered.length} provider{filtered.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map(provider => (
          <div
            key={provider.id}
            className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${
              provider.featured ? 'border-purple-200 ring-1 ring-purple-100' : 'border-slate-100'
            }`}
            onClick={() => setSelectedProvider(provider)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                  provider.featured ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-slate-500 to-slate-700'
                }`}>
                  {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-slate-800">{provider.name}</h3>
                    {provider.featured && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">FEATURED</span>
                    )}
                    {provider.registered && (
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{provider.type} · {provider.location}</p>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleBookmark(provider.id); }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                <svg className={`w-5 h-5 ${bookmarks.includes(provider.id) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-600 mt-3">{provider.desc}</p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {provider.tags.map(tag => (
                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{tag}</span>
              ))}
              {provider.openToCollab && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Open to Collaboration</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {provider.rating} ({provider.reviews})
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {provider.distance} km away
                </span>
              </div>
              {isPaid && (
                <button
                  onClick={e => e.stopPropagation()}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Message
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProvider(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedProvider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedProvider.name}</h2>
                  <p className="text-sm text-slate-500">{selectedProvider.type} · {selectedProvider.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedProvider.registered && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">NDIS Registered</span>}
                    {selectedProvider.openToCollab && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Open to Collaboration</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProvider(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">{selectedProvider.desc}</p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.services.map(s => (
                    <span key={s} className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{selectedProvider.rating}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{selectedProvider.reviews}</p>
                  <p className="text-xs text-slate-500">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{selectedProvider.distance}km</p>
                  <p className="text-xs text-slate-500">Away</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {isPaid && (
                <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                  Send Message
                </button>
              )}
              <button
                onClick={() => toggleBookmark(selectedProvider.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  bookmarks.includes(selectedProvider.id) ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bookmarks.includes(selectedProvider.id) ? <><Star className="w-4 h-4 fill-current inline" /> Saved</> : <><Star className="w-4 h-4 inline" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;