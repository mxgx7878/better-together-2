import { useAuth } from '../../context/AuthContext';

const placeholderData = {
  events: {
    title: 'Events & Networking',
    icon: '📅',
    desc: 'Discover upcoming events, workshops, expos and networking sessions. RSVP, manage your calendar, and explore sponsorship opportunities.',
    features: ['Monthly & weekly calendar views', 'Event RSVP & calendar sync', 'Event information cards', 'Sponsor an event (paid)'],
  },
  directory: {
    title: 'Provider Directory',
    icon: '🔍',
    desc: 'Search and connect with trusted providers. Filter by service type, location, and distance radius.',
    features: ['Advanced search filters', 'Distance radius (10–100km)', 'Bookmarks & favourites', 'Collaboration status'],
  },
  requests: {
    title: 'Service Requests & Referrals',
    icon: '📨',
    desc: 'View and respond to participant service requests. Track referrals and manage your communication with participants.',
    features: ['Structured referral forms', 'Accept/decline/request info', 'Status tracking', 'Auto-sorting by urgency & location'],
  },
  'innovation-lab': {
    title: 'Innovation Lab',
    icon: '💡',
    desc: 'Professional development resources organised by category — training videos, webinars, templates, and sector innovation.',
    features: ['Practice Excellence', 'Leadership & Compliance', 'Business Growth', 'Technology & Tools'],
  },
  library: {
    title: 'Library',
    icon: '📚',
    desc: 'Browse alphabetically-sorted resources — policies, templates, participant resources, provider guides, and staff training materials.',
    features: ['A–Z sorting', 'Category tags & colour coding', 'Quick preview snippets', 'Downloadable documents'],
  },
  qa: {
    title: 'Q&A Forum',
    icon: '💬',
    desc: 'A secure space for real-time questions, collaboration, and shared learning with other providers.',
    features: ['Topic-based threads', 'Anonymous posting option', 'Expert responses highlighted', 'Saved Q&A history'],
  },
  jobs: {
    title: 'Job Board',
    icon: '💼',
    desc: 'Post vacancies, discover employment opportunities, and manage applications.',
    features: ['Post & manage job vacancies', 'Filter by role type & location', 'Application tracking', 'Share with your network'],
  },
  marketing: {
    title: 'Marketing & Visibility',
    icon: '📣',
    desc: 'Boost your visibility with sponsored placements, featured listings, and targeted advertising packages.',
    features: ['Product placement on dashboards', 'Boosted directory listings', 'Sponsored event placements', 'Engagement analytics'],
  },
  'ai-support': {
    title: 'AI Support',
    icon: '✨',
    desc: 'Your AI-powered assistant for NDIS processes, documentation, policy explanations, and drafting support.',
    features: ['NDIS process guidance', 'Policy explanations', 'Document drafting', 'Letter & email templates'],
  },
  upgrade: {
    title: 'Manage Subscription',
    icon: '⚙️',
    desc: 'View your current plan, explore upgrade options, manage billing, and add team members.',
    features: ['View current plan', 'Upgrade/downgrade', 'Manage billing & invoices', 'Add team members (up to 4)'],
  },
  'admin-support': {
    title: 'Connect with Admin',
    icon: '🎧',
    desc: 'Direct access to the platform support team for issues, feedback, and account questions.',
    features: ['Submit support tickets', 'Live chat (business hours)', 'Report issues', 'Feature requests'],
  },
  learning: {
    title: 'Learning Hub',
    icon: '📘',
    desc: 'Bite-sized guides, videos, and tips to help you understand your NDIS plan, build skills, and make confident decisions.',
    features: ['What is the NDIS?', "What's in my plan?", 'How do I use my funding?', 'Preparing for plan meetings'],
  },
  services: {
    title: 'Connect with Services',
    icon: '🔗',
    desc: 'Browse verified providers by location and service type. Use filters to find supports that match your goals.',
    features: ['Searchable provider directory', 'Filter by location & service', 'Bookmark favourites', 'Send enquiries'],
  },
  messages: {
    title: 'Message Board',
    icon: '💬',
    desc: 'A safe, moderated space to share ideas, ask questions, and connect with other participants, families, and carers.',
    features: ['Post questions & ideas', 'Community discussions', 'Provider updates', 'Moderated for safety'],
  },
  'rights-safety': {
    title: 'Rights & Safety',
    icon: '🛡️',
    desc: 'Learn about your rights, how to stay safe, and what to do if something goes wrong.',
    features: ['Know your rights', 'Complaint pathways', 'NDIS Commission info', 'Advocacy contacts'],
  },
  'plan-buddy': {
    title: 'My Plan Buddy',
    icon: '❤️',
    desc: 'Your personal support connection — inbox support, check-ins, advocate and lawyer connections, and AAT preparation help.',
    features: ['Personal support inbox', 'Monthly check-ins', 'Advocate & lawyer connections', 'AAT preparation support'],
  },
  profile: {
    title: 'Edit Profile',
    icon: '👤',
    desc: 'Update your details, preferences, and settings.',
    features: ['Contact information', 'Service preferences', 'Notification settings', 'Account management'],
  },
};

const PlaceholderPage = ({ pageKey }) => {
  const { isProvider, isPaid } = useAuth();
  const page = placeholderData[pageKey] || {
    title: 'Page',
    icon: '📄',
    desc: 'This page is coming soon.',
    features: [],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
            {page.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{page.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{page.desc}</p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-900">Under Development</h3>
              <p className="text-xs text-purple-700 mt-0.5">
                This section is being built as part of the dashboard development. The features below will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Planned Features */}
        {page.features.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Planned Features</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {page.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Badge */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">
            {isProvider ? 'Provider' : 'Participant'}
          </span>
          <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">
            {isPaid ? 'Paid' : 'Free'} Tier
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;