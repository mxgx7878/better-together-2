import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const mockProviders = [
  { id: 1, tier: 'paid', name: 'Allied Health Plus', type: 'Therapy Services', services: ['OT', 'Speech Pathology', 'Physiotherapy'], location: 'Melbourne CBD', distance: 5, rating: 4.8, reviews: 23, registered: true, openToCollab: true, featured: true, desc: 'Comprehensive allied health services with a person-centred approach.', tags: ['NDIS Registered', 'Telehealth', 'Home Visits'], website: 'https://alliedhealthplus.com.au', team: [{ name: 'Dr Priya Kaur', role: 'Lead OT' }, { name: 'Tom Walters', role: 'Speech Pathologist' }] },
  { id: 2, tier: 'paid', name: 'InReach Support Coordination', type: 'Support Coordination', services: ['Support Coordination', 'Psychosocial Recovery'], location: 'Richmond, VIC', distance: 8, rating: 4.9, reviews: 41, registered: true, openToCollab: true, featured: false, desc: 'Specialist support coordination helping participants navigate the NDIS.', tags: ['NDIS Registered', 'CALD Experience'], website: 'https://inreachsc.com.au', team: [{ name: 'Maria Lee', role: 'Senior SC' }] },
  { id: 3, tier: 'free', name: 'Sunshine Community Supports', type: 'Daily Living', services: ['Core Supports', 'Community Participation', 'Personal Care'], location: 'Footscray, VIC', distance: 12, rating: 4.6, reviews: 18, registered: true, openToCollab: false, featured: false, desc: 'Supporting daily living and community inclusion across Melbourne\'s west.', tags: ['NDIS Registered', 'Wheelchair Accessible'], website: 'https://sunshinesupports.com.au', team: [] },
  { id: 4, tier: 'paid', name: 'MindBridge Psychology', type: 'Mental Health', services: ['Counselling', 'Psychology', 'Behaviour Support'], location: 'South Yarra, VIC', distance: 6, rating: 4.7, reviews: 35, registered: true, openToCollab: true, featured: true, desc: 'Trauma-informed mental health services for all ages.', tags: ['Trauma-Informed', 'NDIS Registered'], website: 'https://mindbridgepsych.com.au', team: [{ name: 'Dr Ayesha Khan', role: 'Clinical Psychologist' }] },
  { id: 5, tier: 'free', name: 'Able Employment Solutions', type: 'Employment', services: ['Employment Supports', 'Job Coaching', 'Resume Building'], location: 'Docklands, VIC', distance: 3, rating: 4.5, reviews: 12, registered: false, openToCollab: true, featured: false, desc: 'Helping participants find meaningful work and build career skills.', tags: ['Employment Focus', 'Supported Employment'], website: null, team: [] },
  { id: 6, tier: 'paid', name: 'HomeFirst Modifications', type: 'Equipment & Home Mods', services: ['Home Modifications', 'Assistive Technology', 'Vehicle Mods'], location: 'Dandenong, VIC', distance: 28, rating: 4.4, reviews: 9, registered: true, openToCollab: false, featured: false, desc: 'Making homes and vehicles accessible for independent living.', tags: ['NDIS Registered', 'Capital Supports'], website: 'https://homefirstmods.com.au', team: [] },
  { id: 7, tier: 'paid', name: 'First Peoples Inclusion', type: 'Community & Inclusion', services: ['First Nations Services', 'Cultural Programs', 'Advocacy'], location: 'Fitzroy, VIC', distance: 7, rating: 4.9, reviews: 28, registered: true, openToCollab: true, featured: false, desc: 'Culturally safe, community-led supports for First Nations people.', tags: ['First Nations-led', 'Cultural Safety'], website: 'https://firstpeoples.org.au', team: [{ name: 'Kirra Wilson', role: 'Community Lead' }] },
  { id: 8, tier: 'free', name: 'TechAssist Pro', type: 'Assistive Technology', services: ['Communication Devices', 'Smart Home', 'AT Assessments'], location: 'CBD, VIC', distance: 4, rating: 4.6, reviews: 15, registered: true, openToCollab: true, featured: false, desc: 'Specialist assistive technology assessments and device setup.', tags: ['AT Specialists', 'NDIS Registered'], website: null, team: [] },
];

const serviceFilters = ['All Services', 'Therapy Services', 'Support Coordination', 'Daily Living', 'Mental Health', 'Employment', 'Equipment & Home Mods', 'Community & Inclusion', 'Assistive Technology'];
const radiusOptions = [10, 25, 50, 100];

const DirectoryPage = () => {
  const { isProvider, isPaid, isParticipant } = useAuth();
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [radius, setRadius] = useState(50);
  const [showCollabOnly, setShowCollabOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState([1, 4]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Participants only see paid providers. Providers + admins see all.
  const visibleProviders = isParticipant
    ? mockProviders.filter((p) => p.tier === 'paid')
    : mockProviders;

  // Free providers only see name + location (everything else is gated).
  const isFreeProvider = isProvider && !isPaid;

  const filtered = visibleProviders.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesService = serviceFilter === 'All Services' || p.type === serviceFilter;
    const matchesRadius = p.distance <= radius;
    const matchesCollab = !showCollabOnly || p.openToCollab;
    return matchesSearch && matchesService && matchesRadius && matchesCollab;
  });

  const toggleBookmark = (id) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isProvider ? 'Business Directory' : 'Provider Directory'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isProvider
            ? 'Discover other providers to collaborate with and build referral pathways'
            : 'Browse verified, paid providers in your area'}
        </p>
      </div>

      {/* Free-provider gate notice */}
      {isFreeProvider && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 flex-1">
            <p className="font-semibold">Limited preview</p>
            <p className="mt-0.5">
              On the Free plan you can see each provider&apos;s name and
              location.{' '}
              <Link to="/provider/upgrade" className="underline font-semibold">
                Upgrade
              </Link>{' '}
              to unlock full details — services, website, team and contact.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, service, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none transition-all"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 text-sm outline-none bg-white min-w-[180px]"
          >
            {serviceFilters.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-xs text-slate-500 whitespace-nowrap">Radius:</span>
            <div className="flex gap-1">
              {radiusOptions.map((r) => (
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

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
          {isProvider && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCollabOnly}
                onChange={(e) => setShowCollabOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-slate-600">Open to collaboration only</span>
            </label>
          )}
          <span className="text-sm text-slate-400 ml-auto">
            {filtered.length} provider{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Results — reduced card for free providers */}
      {isFreeProvider ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                {p.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{p.location}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Upgrade to see details
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all cursor-pointer ${
                provider.featured ? 'border-purple-200 ring-1 ring-purple-100' : 'border-slate-100'
              }`}
              onClick={() => setSelectedProvider(provider)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                      provider.featured ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-slate-500 to-slate-700'
                    }`}
                  >
                    {provider.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
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
                    <p className="text-xs text-slate-500 mt-0.5">
                      {provider.type} · {provider.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(provider.id);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <svg
                    className={`w-5 h-5 ${bookmarks.includes(provider.id) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-slate-600 mt-3">{provider.desc}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {provider.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tag}
                  </span>
                ))}
                {provider.openToCollab && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    Open to Collaboration
                  </span>
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
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {provider.distance} km away
                  </span>
                </div>
                {isPaid && isParticipant && (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && !isFreeProvider && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedProvider.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedProvider.name}</h2>
                  <p className="text-sm text-slate-500">
                    {selectedProvider.type} · {selectedProvider.location}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedProvider.registered && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        NDIS Registered
                      </span>
                    )}
                    {selectedProvider.openToCollab && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Open to Collaboration
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProvider(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">{selectedProvider.desc}</p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.services.map((s) => (
                    <span key={s} className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {/* Website + team only visible to paid providers */}
              {isProvider && isPaid && (
                <>
                  {selectedProvider.website && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Website</h4>
                      <a
                        href={selectedProvider.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-purple-600 hover:underline"
                      >
                        {selectedProvider.website}
                      </a>
                    </div>
                  )}
                  {selectedProvider.team && selectedProvider.team.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Team</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        {selectedProvider.team.map((m, i) => (
                          <li key={i}>
                            <span className="font-medium">{m.name}</span>{' '}
                            <span className="text-slate-500">· {m.role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
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
              {isParticipant && isPaid && (
                <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                  Connect
                </button>
              )}
              <button
                onClick={() => toggleBookmark(selectedProvider.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  bookmarks.includes(selectedProvider.id)
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bookmarks.includes(selectedProvider.id) ? (
                  <>
                    <Star className="w-4 h-4 fill-current inline" /> Saved
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 inline" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
