import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Sparkles, CheckCircle } from '../../components/Icons';

const mockEvents = [
  { id: 1, title: 'Melbourne Provider Networking Breakfast', date: '2026-02-28', time: '8:00 AM – 10:00 AM', location: 'The Commons, Melbourne CBD', type: 'networking', cost: 'Free', accessibility: 'Wheelchair accessible, Auslan interpreter available', desc: 'Connect with local providers over breakfast. Share insights, build referral pathways, and grow your network.', rsvpd: true, attendees: 34 },
  { id: 2, title: 'NDIS Plan Meeting Preparation Workshop', date: '2026-03-05', time: '10:00 AM – 12:00 PM', location: 'Online (Zoom)', type: 'workshop', cost: 'Free', accessibility: 'Closed captions, Easy read handout', desc: 'Learn how to prepare for your NDIS plan meeting with practical tips and templates.', rsvpd: false, attendees: 67 },
  { id: 3, title: 'Disability Expo Sydney 2026', date: '2026-03-15', time: '9:00 AM – 4:00 PM', location: 'ICC Sydney, Darling Harbour', type: 'expo', cost: '$15', accessibility: 'Fully accessible venue, Quiet room available', desc: 'Australias largest disability expo featuring 200+ exhibitors, workshops, and live demonstrations.', rsvpd: false, attendees: 1200 },
  { id: 4, title: 'Support Coordination Best Practices Webinar', date: '2026-03-20', time: '2:00 PM – 3:30 PM', location: 'Online (Zoom)', type: 'webinar', cost: 'Free', accessibility: 'Closed captions', desc: 'Expert panel discussion on effective support coordination strategies and compliance updates.', rsvpd: false, attendees: 89 },
  { id: 5, title: 'Community Inclusion Meetup – Western Suburbs', date: '2026-03-22', time: '11:00 AM – 1:00 PM', location: 'Footscray Community Hub', type: 'networking', cost: 'Free', accessibility: 'Wheelchair accessible, CALD language support', desc: 'A relaxed meetup for participants, families, and providers in Melbourne\'s west.', rsvpd: false, attendees: 22 },
  { id: 6, title: 'Provider Compliance & Audit Preparation', date: '2026-04-02', time: '1:00 PM – 3:00 PM', location: 'Online (Teams)', type: 'workshop', cost: '$25', accessibility: 'Closed captions', desc: 'Prepare for your upcoming NDIS audit with step-by-step guidance from compliance experts.', rsvpd: false, attendees: 45 },
];

const typeColors = {
  networking: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  workshop: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  expo: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  webinar: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const EventsPage = () => {
  const { isProvider, isPaid } = useAuth();
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('all');
  const [rsvps, setRsvps] = useState({ 1: true });
  const [showSponsor, setShowSponsor] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = filterType === 'all' ? mockEvents : mockEvents.filter(e => e.type === filterType);

  const calendarDays = () => {
    const days = [];
    const now = new Date(2026, 1, 1); // Feb 2026
    const firstDay = now.getDay();
    const daysInMonth = 28;
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const eventDates = mockEvents.reduce((acc, e) => {
    const day = new Date(e.date).getDate();
    const month = new Date(e.date).getMonth();
    if (month === 1) { // Feb
      acc[day] = acc[day] || [];
      acc[day].push(e);
    }
    return acc;
  }, {});

  const toggleRsvp = (id) => {
    setRsvps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Events & Networking</h1>
          <p className="text-sm text-slate-500 mt-1">Discover events, workshops, and networking sessions</p>
        </div>
        <div className="flex items-center gap-3">
          {isProvider && isPaid && (
            <button
              onClick={() => setShowSponsor(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-white inline" /> Sponsor an Event
            </button>
          )}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
              List
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Events' },
          { key: 'networking', label: 'Networking' },
          { key: 'workshop', label: 'Workshops' },
          { key: 'webinar', label: 'Webinars' },
          { key: 'expo', label: 'Expos' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === f.key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-lg font-bold text-slate-800">February 2026</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500">{d}</div>
            ))}
            {calendarDays().map((day, i) => (
              <div key={i} className={`bg-white p-2 min-h-[80px] ${day ? 'hover:bg-purple-50 cursor-pointer transition-colors' : ''}`}>
                {day && (
                  <>
                    <span className={`text-sm font-medium ${day === 16 ? 'bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>{day}</span>
                    {eventDates[day] && eventDates[day].map(ev => (
                      <div key={ev.id} className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${typeColors[ev.type].bg} ${typeColors[ev.type].text}`}>
                        {ev.title.split(' ').slice(0, 3).join(' ')}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filtered.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Date Badge */}
                <div className="flex-shrink-0 flex lg:flex-col items-center lg:items-center gap-3 lg:gap-1 lg:w-20">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl px-4 py-3 lg:px-0 lg:py-0 lg:w-full lg:aspect-square flex flex-col items-center justify-center">
                    <span className="text-[11px] uppercase font-semibold opacity-80">
                      {new Date(event.date).toLocaleDateString('en-AU', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${typeColors[event.type].bg} ${typeColors[event.type].text}`}>
                          {event.type}
                        </span>
                        {event.cost === 'Free' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700">Free</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">{event.cost}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">{event.title}</h3>
                    </div>
                    <button
                      onClick={() => toggleRsvp(event.id)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        rsvps[event.id]
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                      }`}
                    >
                      {rsvps[event.id] ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Confirmed</span> : "RSVP"}
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">{event.desc}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.attendees} attending
                    </span>
                  </div>

                  {event.accessibility && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs text-blue-600">{event.accessibility}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sponsor Modal */}
      {showSponsor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSponsor(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Sponsor an Event</h2>
              <button onClick={() => setShowSponsor(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-5">Apply to sponsor a community event. Our team will work with you to create an event in your local area.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Event type you'd like to sponsor</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400">
                  <option>Networking Meetup</option>
                  <option>Workshop / Training</option>
                  <option>Community Expo</option>
                  <option>Webinar</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred location / area</label>
                <input type="text" placeholder="e.g., Melbourne CBD, Western Sydney" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Sponsorship tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Bronze $250', 'Silver $500', 'Gold $1,000'].map(tier => (
                    <label key={tier} className="flex items-center justify-center p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-purple-400 transition-colors text-sm font-medium text-slate-700 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                      <input type="radio" name="tier" className="sr-only" />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional notes</label>
                <textarea rows={3} placeholder="Tell us about your goals for sponsoring..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none" />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-700 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  After submitting, our admin team will contact you via direct message to collaborate on event details, timing, and branding.
                </p>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md">
                Submit Sponsorship Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;