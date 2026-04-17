import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Frown, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MyBuddyPage = () => {
  const { isPaid, user } = useAuth();

  if (!isPaid) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-10 text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
              <Frown className="w-14 h-14 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">You don't have a Buddy yet</h1>
            <p className="text-slate-600 text-base max-w-lg mx-auto">
              A Buddy is your personal support person — someone to help you with your plan, answer questions, and walk beside you through the process.
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">How it works:</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Pay your subscription</h3>
                  <p className="text-sm text-slate-600">Upgrade to Guidance & Advocacy Plus ($350/year) to unlock Buddy support.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-800">We match you with a Buddy</h3>
                  <p className="text-sm text-slate-600">An experienced support person will be assigned to you based on your needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Your Buddy helps you with your plan</h3>
                  <p className="text-sm text-slate-600">Get one-on-one guidance, check-ins, and practical support — it's that simple.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
              <Heart className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Pay your subscription, and you will get a Buddy to help you with your plan — it's that simple.</h3>
              <Link
                to="/participant/upgrade"
                className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-white text-purple-700 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Upgrade Subscription
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const buddy = user?.planBuddy || {
    name: 'Karen Burgess',
    email: 'karen.burgess@bettertogether.com.au',
    phone: '+61 412 345 678',
    bio: "Hi! I'm Karen, a qualified support coordinator with over 10 years of experience in the disability services sector. I've walked beside hundreds of participants through plan reviews, provider changes, and everything in between. I believe every person deserves someone in their corner — and I'm honoured to be that person for you.",
    photo: null,
    specialties: ['Plan Reviews', 'Provider Matching', 'AAT Support', 'Funding Categories'],
  };

  const initials = buddy.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Your Buddy's Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Meet the person supporting you through your plan</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-8 text-white relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-xl">
              {buddy.photo ? (
                <img src={buddy.photo} alt={buddy.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                initials
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-bold">{buddy.name}</h2>
              <p className="text-purple-100 mt-1">Your Personal Buddy</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {buddy.specialties?.map((spec, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">About</h3>
            <p className="text-slate-700 leading-relaxed">{buddy.bio}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`mailto:${buddy.email}`} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{buddy.email}</p>
              </div>
            </a>
            <a href={`tel:${buddy.phone}`} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-sm font-semibold text-slate-800">{buddy.phone}</p>
              </div>
            </a>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Your Buddy can help with:
            </h3>
            <ul className="space-y-2 text-sm text-purple-900">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /> Understanding your plan, funding, and reviews</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /> Drafting emails and letters</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /> Preparing for plan meetings</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /> Connecting with advocates and legal teams</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" /> Matching with trusted providers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBuddyPage;
