import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ExternalLink, Users } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: 'NDIS Provider Networking Breakfast',
    date: 'Saturday, 18 April 2026',
    time: '8:00 AM – 10:30 AM',
    location: 'The Commons, 388 Brunswick St, Fitzroy VIC',
    description:
      'Connect with local NDIS providers over breakfast. Share insights, build referral partnerships, and strengthen the community-driven support network in your area.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 2,
    title: 'Disability Expo Melbourne 2026',
    date: 'Friday – Sunday, 8–10 May 2026',
    time: '9:00 AM – 5:00 PM',
    location: 'Melbourne Convention & Exhibition Centre, South Wharf VIC',
    description:
      'Australia\'s largest disability expo featuring assistive technology, service providers, workshops, and keynote speakers. Free entry for NDIS participants and carers.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 3,
    title: 'Support Worker Training Workshop',
    date: 'Wednesday, 20 May 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'Community Hub, 45 George St, Parramatta NSW',
    description:
      'Hands-on training covering person-centred approaches, safeguarding, and cultural responsiveness. Ideal for new and experienced support workers looking to upskill.',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 4,
    title: 'Community Connect Day',
    date: 'Saturday, 7 June 2026',
    time: '11:00 AM – 4:00 PM',
    location: 'Riverside Park, Adelaide SA',
    description:
      'A relaxed, inclusive community day bringing together participants, families, providers, and advocates. Activities, live music, information stalls, and plenty of good conversation.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 5,
    title: 'NDIS Plan Management Essentials',
    date: 'Tuesday, 23 June 2026',
    time: '1:00 PM – 4:00 PM',
    location: 'Online (Zoom)',
    description:
      'A practical webinar for participants and support coordinators covering plan budgets, claiming, provider payments, and making the most of your NDIS funding.',
    color: 'from-orange-500 to-amber-600',
  },
];

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Community Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Events Calendar
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Discover upcoming community events, networking opportunities, workshops, and expos
            across the NDIS sector. Connect, learn, and grow — together.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated list of sector events. All events are hosted on Eventbrite
            where you can register and find full details.
          </p>
        </div>

        <div className="space-y-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="flex flex-col md:flex-row">
                {/* Date Accent */}
                <div
                  className={`bg-gradient-to-br ${event.color} p-6 md:p-8 flex items-center justify-center md:w-48 shrink-0`}
                >
                  <Calendar className="w-10 h-10 text-white" />
                </div>

                {/* Event Details */}
                <div className="flex-1 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {event.date} &middot; {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      {event.location}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-5">
                    {event.description}
                  </p>

                  <a
                    href="https://www.eventbrite.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    View on Eventbrite
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-lg text-purple-100 mb-8 leading-relaxed">
              If you are organising a community event, workshop, or networking session relevant
              to the NDIS sector, we would love to help you promote it. Get in touch with our
              team and we will feature it on our calendar.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;
