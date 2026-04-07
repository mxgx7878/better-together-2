import { useState, useMemo } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  Sparkles,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Shield,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Award,
  Crown,
  Gem,
  Trophy,
  Star,
  AlertCircle,
  Filter,
} from '../../components/Icons';
import { Card, PageHeader, Button, Badge } from '../../components/ui';

const mockEvents = [
  { id: 1, title: 'Melbourne Provider Networking Breakfast', date: '2026-02-28', time: '8:00 AM – 10:00 AM', location: 'The Commons, Melbourne CBD', type: 'networking', cost: 'Free', accessibility: 'Wheelchair accessible, Auslan interpreter available', desc: 'Connect with local providers over breakfast. Share insights, build referral pathways, and grow your network.', rsvpd: true, attendees: 34 },
  { id: 2, title: 'NDIS Plan Meeting Preparation Workshop', date: '2026-03-05', time: '10:00 AM – 12:00 PM', location: 'Online (Zoom)', type: 'workshop', cost: 'Free', accessibility: 'Closed captions, Easy read handout', desc: 'Learn how to prepare for your NDIS plan meeting with practical tips and templates.', rsvpd: false, attendees: 67 },
  { id: 3, title: 'Disability Expo Sydney 2026', date: '2026-03-15', time: '9:00 AM – 4:00 PM', location: 'ICC Sydney, Darling Harbour', type: 'expo', cost: '$15', accessibility: 'Fully accessible venue, Quiet room available', desc: 'Australias largest disability expo featuring 200+ exhibitors, workshops, and live demonstrations.', rsvpd: false, attendees: 1200 },
  { id: 4, title: 'Support Coordination Best Practices Webinar', date: '2026-03-20', time: '2:00 PM – 3:30 PM', location: 'Online (Zoom)', type: 'webinar', cost: 'Free', accessibility: 'Closed captions', desc: 'Expert panel discussion on effective support coordination strategies and compliance updates.', rsvpd: false, attendees: 89 },
  { id: 5, title: 'Community Inclusion Meetup – Western Suburbs', date: '2026-03-22', time: '11:00 AM – 1:00 PM', location: 'Footscray Community Hub', type: 'networking', cost: 'Free', accessibility: 'Wheelchair accessible, CALD language support', desc: 'A relaxed meetup for participants, families, and providers in Melbourne\'s west.', rsvpd: false, attendees: 22 },
  { id: 6, title: 'Provider Compliance & Audit Preparation', date: '2026-04-02', time: '1:00 PM – 3:00 PM', location: 'Online (Teams)', type: 'workshop', cost: '$25', accessibility: 'Closed captions', desc: 'Prepare for your upcoming NDIS audit with step-by-step guidance from compliance experts.', rsvpd: false, attendees: 45 },
  { id: 7, title: 'Assistive Technology Showcase', date: '2026-04-10', time: '10:00 AM – 3:00 PM', location: 'Melbourne Convention Centre', type: 'expo', cost: '$10', accessibility: 'Fully accessible, Quiet zones, Sensory-friendly sessions', desc: 'Hands-on demonstrations of the latest assistive technology solutions from leading providers.', rsvpd: false, attendees: 340 },
  { id: 8, title: 'Inclusive Employment Forum', date: '2026-04-18', time: '9:30 AM – 12:30 PM', location: 'Online (Zoom)', type: 'webinar', cost: 'Free', accessibility: 'Closed captions, Auslan interpreter', desc: 'Explore inclusive hiring practices and supported employment models with industry leaders.', rsvpd: false, attendees: 156 },
];

const typeColors = {
  networking: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  workshop: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  expo: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  webinar: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const SPONSOR_TIERS = [
  { key: 'bronze', label: 'Bronze', price: 200, icon: Award, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', textColor: 'text-amber-700', perks: ['Logo on event page', 'Social media mention', '2 complimentary tickets'] },
  { key: 'silver', label: 'Silver', price: 500, icon: Gem, color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-50', borderColor: 'border-slate-300', textColor: 'text-slate-600', perks: ['All Bronze perks', 'Banner at venue', '5 complimentary tickets', 'Speaking slot (5 min)'] },
  { key: 'gold', label: 'Gold', price: 1000, icon: Crown, color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-400', textColor: 'text-yellow-700', perks: ['All Silver perks', 'Premium booth space', '10 complimentary tickets', 'Keynote speaking slot', 'Exclusive branding'] },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SponsorChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'admin', name: 'BT Admin', text: 'Thanks for your interest in sponsoring! How can we help you today?', time: '2:30 PM' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: 'user', name: 'You', text: input.trim(), time: new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }) },
    ]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, from: 'admin', name: 'BT Admin', text: 'Thanks for your message! An admin will review your enquiry and get back to you shortly.', time: new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }) },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Sponsorship Chat</p>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Admin online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.from === 'user'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about sponsorship..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const { isProvider, isPaid } = useAuth();
  const [viewMode, setViewMode] = useState('list');
  const [calendarLayout, setCalendarLayout] = useState('monthly');
  const [filterType, setFilterType] = useState('all');
  const [rsvps, setRsvps] = useState({ 1: true });
  const [showSponsor, setShowSponsor] = useState(false);
  const [sponsorStep, setSponsorStep] = useState('form');
  const [selectedTier, setSelectedTier] = useState(null);
  const [sponsorForm, setSponsorForm] = useState({ eventType: 'Networking Meetup', location: '', notes: '' });
  const [showChat, setShowChat] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(2); // March 2026 (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [weekStart, setWeekStart] = useState(new Date(2026, 3, 5)); // Apr 5, 2026

  const filtered = filterType === 'all' ? mockEvents : mockEvents.filter(e => e.type === filterType);

  const calendarDays = useMemo(() => {
    const days = [];
    const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
    const firstDay = firstOfMonth.getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth, calendarYear]);

  const eventsByDate = useMemo(() => {
    return mockEvents.reduce((acc, e) => {
      const d = new Date(e.date);
      if (d.getMonth() === calendarMonth && d.getFullYear() === calendarYear) {
        const day = d.getDate();
        acc[day] = acc[day] || [];
        acc[day].push(e);
      }
      return acc;
    }, {});
  }, [calendarMonth, calendarYear]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const eventsForWeekDay = (date) => {
    return mockEvents.filter(e => {
      const ed = new Date(e.date);
      return ed.getFullYear() === date.getFullYear() && ed.getMonth() === date.getMonth() && ed.getDate() === date.getDate();
    });
  };

  const navigateMonth = (dir) => {
    let m = calendarMonth + dir;
    let y = calendarYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCalendarMonth(m);
    setCalendarYear(y);
  };

  const navigateWeek = (dir) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + dir * 7);
    setWeekStart(next);
  };

  const toggleRsvp = (id) => {
    setRsvps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openSponsor = () => {
    setShowSponsor(true);
    setSponsorStep('form');
    setSelectedTier(null);
    setShowChat(false);
  };

  const handleSponsorSubmit = () => {
    if (!selectedTier) return;
    setSponsorStep('confirmation');
  };

  const today = new Date();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Events & Networking" subtitle="Discover events, workshops, and networking sessions">
        {isProvider && isPaid && (
          <Button onClick={openSponsor} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md">
            <Sparkles className="w-4 h-4" /> Sponsor an Event
          </Button>
        )}
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
            List
          </button>
          <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
            Calendar
          </button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
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
        <div className="space-y-4">
          {/* Monthly / Weekly Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => setCalendarLayout('monthly')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${calendarLayout === 'monthly' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
                Monthly
              </button>
              <button onClick={() => setCalendarLayout('weekly')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${calendarLayout === 'weekly' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
                Weekly
              </button>
            </div>
          </div>

          {/* Monthly Calendar */}
          {calendarLayout === 'monthly' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-lg font-bold text-slate-800">{MONTHS[calendarMonth]} {calendarYear}</h2>
                <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                  const isToday = day && calendarMonth === today.getMonth() && calendarYear === today.getFullYear() && day === today.getDate();
                  return (
                    <div
                      key={i}
                      className={`bg-white p-2 min-h-[80px] ${day ? 'hover:bg-purple-50 cursor-pointer transition-colors' : ''}`}
                      onClick={() => {
                        if (day && eventsByDate[day]) {
                          setSelectedEvent(eventsByDate[day][0]);
                        }
                      }}
                    >
                      {day && (
                        <>
                          <span className={`text-sm font-medium ${isToday ? 'bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                            {day}
                          </span>
                          {eventsByDate[day] && eventsByDate[day].map(ev => (
                            <div key={ev.id} className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${typeColors[ev.type].bg} ${typeColors[ev.type].text}`}>
                              {ev.title.split(' ').slice(0, 3).join(' ')}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Weekly Calendar */}
          {calendarLayout === 'weekly' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-lg font-bold text-slate-800">
                  {weekDays[0].toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h2>
                <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map((day, i) => {
                  const dayEvents = eventsForWeekDay(day);
                  const isToday = day.toDateString() === today.toDateString();
                  return (
                    <div key={i} className={`rounded-xl border p-3 min-h-[140px] transition-colors ${isToday ? 'border-purple-300 bg-purple-50/50' : 'border-slate-200 hover:border-purple-200'}`}>
                      <div className="text-center mb-2">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase">
                          {day.toLocaleDateString('en-AU', { weekday: 'short' })}
                        </p>
                        <p className={`text-lg font-bold ${isToday ? 'text-purple-700' : 'text-slate-700'}`}>
                          {day.getDate()}
                        </p>
                      </div>
                      {dayEvents.map(ev => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`w-full text-left mt-1 px-2 py-1.5 rounded-lg text-[11px] font-medium ${typeColors[ev.type].bg} ${typeColors[ev.type].text} hover:opacity-80 transition-opacity`}
                        >
                          <p className="truncate">{ev.title}</p>
                          <p className="opacity-70">{ev.time.split(' – ')[0]}</p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filtered.map(event => (
            <Card key={event.id} padding="p-5" className="hover:shadow-md transition-all">
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
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge color={event.type === 'networking' ? 'blue' : event.type === 'workshop' ? 'green' : event.type === 'expo' ? 'purple' : 'amber'}>
                          {event.type}
                        </Badge>
                        {event.cost === 'Free' ? (
                          <Badge color="green">Free</Badge>
                        ) : (
                          <Badge color="slate">{event.cost}</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">{event.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isProvider && isPaid && (
                        <button
                          onClick={() => { setSelectedEvent(event); openSponsor(); }}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 inline mr-1" />Sponsor
                        </button>
                      )}
                      <button
                        onClick={() => toggleRsvp(event.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          rsvps[event.id]
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                        }`}
                      >
                        {rsvps[event.id] ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Confirmed</span> : 'RSVP'}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">{event.desc}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {event.attendees} attending
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {event.cost}
                    </span>
                  </div>

                  {event.accessibility && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs text-blue-600">{event.accessibility}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Event Detail Modal (from calendar click) */}
      {selectedEvent && !showSponsor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <Card className="max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <Badge color={selectedEvent.type === 'networking' ? 'blue' : selectedEvent.type === 'workshop' ? 'green' : selectedEvent.type === 'expo' ? 'purple' : 'amber'}>
                {selectedEvent.type}
              </Badge>
              <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{selectedEvent.title}</h2>
            <p className="text-sm text-slate-600 mb-4">{selectedEvent.desc}</p>
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                {new Date(selectedEvent.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-purple-500" />
                {selectedEvent.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-purple-500" />
                {selectedEvent.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="w-4 h-4 text-purple-500" />
                {selectedEvent.cost}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4 text-purple-500" />
                {selectedEvent.attendees} attending
              </div>
              {selectedEvent.accessibility && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Shield className="w-4 h-4 text-blue-500" />
                  {selectedEvent.accessibility}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => { toggleRsvp(selectedEvent.id); setSelectedEvent(null); }}
                variant={rsvps[selectedEvent.id] ? 'secondary' : 'primary'}
                className="flex-1"
              >
                {rsvps[selectedEvent.id] ? <><CheckCircle className="w-4 h-4" /> Confirmed</> : 'RSVP Now'}
              </Button>
              {isProvider && isPaid && (
                <Button
                  onClick={() => { openSponsor(); }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Sparkles className="w-4 h-4" /> Sponsor
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Sponsor Modal */}
      {showSponsor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSponsor(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Sponsor an Event</h2>
                  <p className="text-xs text-slate-500">
                    {sponsorStep === 'form' ? 'Choose a tier and fill out your application' : 'Application submitted!'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSponsor(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {sponsorStep === 'form' && (
                <div className="space-y-6">
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Select Sponsorship Tier</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SPONSOR_TIERS.map(tier => {
                        const TierIcon = tier.icon;
                        const isSelected = selectedTier === tier.key;
                        return (
                          <button
                            key={tier.key}
                            onClick={() => setSelectedTier(tier.key)}
                            className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? `${tier.borderColor} ${tier.bgColor} shadow-md`
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className={`w-5 h-5 ${tier.textColor}`} />
                              </div>
                            )}
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                              <TierIcon className="w-5 h-5 text-white" />
                            </div>
                            <p className={`text-sm font-bold ${isSelected ? tier.textColor : 'text-slate-800'}`}>{tier.label}</p>
                            <p className="text-xl font-bold text-slate-800 mt-0.5">${tier.price.toLocaleString()}</p>
                            <ul className="mt-3 space-y-1.5">
                              {tier.perks.map((perk, idx) => (
                                <li key={idx} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                                  <Star className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                  {perk}
                                </li>
                              ))}
                            </ul>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Event type you'd like to sponsor</label>
                    <select
                      value={sponsorForm.eventType}
                      onChange={e => setSponsorForm(prev => ({ ...prev, eventType: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                    >
                      <option>Networking Meetup</option>
                      <option>Workshop / Training</option>
                      <option>Community Expo</option>
                      <option>Webinar</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred location / area</label>
                    <input
                      type="text"
                      value={sponsorForm.location}
                      onChange={e => setSponsorForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Melbourne CBD, Western Sydney"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional notes</label>
                    <textarea
                      rows={3}
                      value={sponsorForm.notes}
                      onChange={e => setSponsorForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Tell us about your goals for sponsoring this event..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 resize-none"
                    />
                  </div>

                  {/* Chat with Admin */}
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700">Chat with Admin</span>
                      </div>
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        {showChat ? 'Hide Chat' : 'Open Chat'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Have questions about sponsorship? Chat directly with our team.</p>
                    {showChat && <SponsorChat onClose={() => setShowChat(false)} />}
                  </div>

                  {/* Validation hint */}
                  {!selectedTier && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700">Please select a sponsorship tier to continue.</p>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    onClick={handleSponsorSubmit}
                    disabled={!selectedTier}
                    className="w-full"
                  >
                    Submit Sponsorship Application
                  </Button>
                </div>
              )}

              {sponsorStep === 'confirmation' && (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Application Submitted!</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                      Your {SPONSOR_TIERS.find(t => t.key === selectedTier)?.label} sponsorship application has been sent to our admin team. We'll reach out within 2 business days to discuss next steps.
                    </p>
                  </div>
                  <Card className="text-left max-w-sm mx-auto !bg-slate-50">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tier</span>
                        <span className="font-semibold text-slate-700">{SPONSOR_TIERS.find(t => t.key === selectedTier)?.label} – ${SPONSOR_TIERS.find(t => t.key === selectedTier)?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Event Type</span>
                        <span className="font-semibold text-slate-700">{sponsorForm.eventType}</span>
                      </div>
                      {sponsorForm.location && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location</span>
                          <span className="font-semibold text-slate-700">{sponsorForm.location}</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Post-submission chat */}
                  <div className="border border-slate-200 rounded-xl p-4 text-left max-w-sm mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700">Continue Discussion</span>
                      </div>
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        {showChat ? 'Hide' : 'Open Chat'}
                      </button>
                    </div>
                    {showChat && <SponsorChat onClose={() => setShowChat(false)} />}
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <Button variant="secondary" onClick={() => setShowSponsor(false)}>
                      Close
                    </Button>
                    <Button onClick={() => { setSponsorStep('form'); setSelectedTier(null); setShowChat(false); }}>
                      Sponsor Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
