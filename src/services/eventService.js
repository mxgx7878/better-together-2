// ─── Events API Service ─────────────────────────────────────────
// All API calls for events go through here.
// Replace the dummy implementations with real axios/fetch calls when backend is ready.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Dummy Data ─────────────────────────────────────────────────
let dummyEvents = [
  {
    id: 1,
    title: 'Melbourne Provider Networking Breakfast',
    date: '2026-02-28',
    time: '8:00 AM – 10:00 AM',
    location: 'The Commons, Melbourne CBD',
    type: 'networking',
    cost: 'Free',
    costAmount: 0,
    accessibility: 'Wheelchair accessible, Auslan interpreter available',
    description: 'Connect with local providers over breakfast. Share insights, build referral pathways, and grow your network.',
    attendees: 34,
    maxAttendees: 50,
    status: 'published',
    image: null,
    organiser: 'Better Together Network',
    tags: ['networking', 'providers', 'melbourne'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'NDIS Plan Meeting Preparation Workshop',
    date: '2026-03-05',
    time: '10:00 AM – 12:00 PM',
    location: 'Online (Zoom)',
    type: 'workshop',
    cost: 'Free',
    costAmount: 0,
    accessibility: 'Closed captions, Easy read handout',
    description: 'Learn how to prepare for your NDIS plan meeting with practical tips and templates.',
    attendees: 67,
    maxAttendees: 100,
    status: 'published',
    image: null,
    organiser: 'Better Together Network',
    tags: ['workshop', 'ndis', 'planning'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 3,
    title: 'Disability Expo Sydney 2026',
    date: '2026-03-15',
    time: '9:00 AM – 4:00 PM',
    location: 'ICC Sydney, Darling Harbour',
    type: 'expo',
    cost: '$15',
    costAmount: 15,
    accessibility: 'Fully accessible venue, Quiet room available',
    description: 'Australia\'s largest disability expo featuring 200+ exhibitors, workshops, and live demonstrations.',
    attendees: 1200,
    maxAttendees: 2000,
    status: 'published',
    image: null,
    organiser: 'Disability Expo Australia',
    tags: ['expo', 'sydney', 'disability'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 4,
    title: 'Support Coordination Best Practices Webinar',
    date: '2026-03-20',
    time: '2:00 PM – 3:30 PM',
    location: 'Online (Zoom)',
    type: 'webinar',
    cost: 'Free',
    costAmount: 0,
    accessibility: 'Closed captions',
    description: 'Expert panel discussion on effective support coordination strategies and compliance updates.',
    attendees: 89,
    maxAttendees: 200,
    status: 'published',
    image: null,
    organiser: 'Better Together Network',
    tags: ['webinar', 'support-coordination'],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 5,
    title: 'Community Inclusion Meetup – Western Suburbs',
    date: '2026-03-22',
    time: '11:00 AM – 1:00 PM',
    location: 'Footscray Community Hub',
    type: 'networking',
    cost: 'Free',
    costAmount: 0,
    accessibility: 'Wheelchair accessible, CALD language support',
    description: 'A relaxed meetup for participants, families, and providers in Melbourne\'s west.',
    attendees: 22,
    maxAttendees: 40,
    status: 'published',
    image: null,
    organiser: 'Better Together Network',
    tags: ['networking', 'community', 'melbourne'],
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 6,
    title: 'Provider Compliance & Audit Preparation',
    date: '2026-04-02',
    time: '1:00 PM – 3:00 PM',
    location: 'Online (Teams)',
    type: 'workshop',
    cost: '$25',
    costAmount: 25,
    accessibility: 'Closed captions',
    description: 'Prepare for your upcoming NDIS audit with step-by-step guidance from compliance experts.',
    attendees: 45,
    maxAttendees: 80,
    status: 'draft',
    image: null,
    organiser: 'Better Together Network',
    tags: ['workshop', 'compliance', 'providers'],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
];

let nextId = 7;

// ═══════════════════════════════════════════════════════════════════
// PUBLIC / PROVIDER / PARTICIPANT APIs
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/events
 * Query: { search, type, status, page, limit }
 * Response: { data: Event[], total, totalPages, page }
 */
export const fetchEvents = async ({ search = '', type = 'all', page = 1, limit = 10 } = {}) => {
  await delay(600);

  let filtered = dummyEvents.filter((e) => e.status === 'published');

  if (type !== 'all') {
    filtered = filtered.filter((e) => e.type === type);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.organiser.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, totalPages, page };
};

/**
 * GET /api/events/:id
 * Response: Event
 */
export const fetchEventById = async (id) => {
  await delay(400);
  const event = dummyEvents.find((e) => e.id === id);
  if (!event) throw new Error('Event not found');
  return event;
};

/**
 * POST /api/events/:id/rsvp
 * Body: { eventId }
 * Response: { success, message, attending }
 */
export const rsvpEvent = async (eventId) => {
  await delay(500);
  const event = dummyEvents.find((e) => e.id === eventId);
  if (event) event.attendees += 1;
  return { success: true, message: 'RSVP confirmed', attending: true };
};

/**
 * DELETE /api/events/:id/rsvp
 * Response: { success, message, attending }
 */
export const cancelRsvp = async (eventId) => {
  await delay(500);
  const event = dummyEvents.find((e) => e.id === eventId);
  if (event && event.attendees > 0) event.attendees -= 1;
  return { success: true, message: 'RSVP cancelled', attending: false };
};

// ═══════════════════════════════════════════════════════════════════
// ADMIN APIs
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/events
 * Query: { search, type, status, page, limit }
 * Response: { data: Event[], total, totalPages, page }
 */
export const adminFetchEvents = async ({ search = '', type = 'all', status = 'all', page = 1, limit = 10 } = {}) => {
  await delay(600);

  let filtered = [...dummyEvents];

  if (type !== 'all') {
    filtered = filtered.filter((e) => e.type === type);
  }

  if (status !== 'all') {
    filtered = filtered.filter((e) => e.status === status);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.organiser.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, totalPages, page };
};

/**
 * POST /api/admin/events
 * Body: CreateEventPayload
 * Response: Event
 */
export const adminCreateEvent = async (eventData) => {
  await delay(800);

  const newEvent = {
    id: nextId++,
    ...eventData,
    attendees: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dummyEvents.unshift(newEvent);
  return newEvent;
};

/**
 * PUT /api/admin/events/:id
 * Body: UpdateEventPayload
 * Response: Event
 */
export const adminUpdateEvent = async (id, eventData) => {
  await delay(800);

  const index = dummyEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Event not found');

  dummyEvents[index] = {
    ...dummyEvents[index],
    ...eventData,
    updatedAt: new Date().toISOString(),
  };

  return dummyEvents[index];
};

/**
 * DELETE /api/admin/events/:id
 * Response: { success, message }
 */
export const adminDeleteEvent = async (id) => {
  await delay(600);
  dummyEvents = dummyEvents.filter((e) => e.id !== id);
  return { success: true, message: 'Event deleted' };
};
