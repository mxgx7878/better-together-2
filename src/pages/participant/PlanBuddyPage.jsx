import { Link } from "react-router-dom";
import { Frown, Heart, Mail, Phone, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// ─── Mock buddy data (replace with API-driven profile when ready) ─────
const demoBuddy = {
  name: "Karen Burgess",
  role: "Personal Plan Buddy",
  email: "karen.burgess@bettertogether.com.au",
  phone: "0400 123 456",
  avatar: null,
  bio: "Karen has 12 years of lived experience navigating the NDIS and 8 years supporting participants with plan reviews, provider choice, and advocacy. She loves making complex paperwork feel human and manageable.",
};

const BuddyProfilePage = () => {
  const { isPaid, user } = useAuth();

  // ─── Free / un-paid: explain how to get a buddy ─────────────────
  if (!isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Frown className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          You don&apos;t have a buddy yet
        </h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Upgrade your subscription and you&apos;ll be matched with a Buddy
          who will help you with your plan. It&apos;s that simple.
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-left">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> How you get your
            buddy
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600 list-decimal list-inside">
            <li>
              Pay your subscription — that&apos;s the only step to unlock a
              buddy.
            </li>
            <li>
              Our team matches you with a trained Plan Buddy based on your
              location and needs.
            </li>
            <li>
              Your buddy&apos;s full profile appears here — name, email, phone
              and bio — so you can reach out directly.
            </li>
            <li>
              Your buddy helps you with your plan, provider choice, and any
              questions along the way.
            </li>
          </ol>
        </div>

        <Link
          to="/participant/upgrade"
          className="inline-block mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Upgrade to get your buddy
        </Link>
      </div>
    );
  }

  // ─── Paid: show buddy profile ───────────────────────────────────
  const buddy = user?.planBuddy || demoBuddy;
  const initials = buddy.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Your Buddy&apos;s Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          This is the person matched to help you with your plan.
        </p>
      </div>

      {/* Buddy card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 h-28" />
        <div className="p-6 pb-8">
          <div className="flex items-end gap-4 -mt-16">
            {buddy.avatar ? (
              <img
                src={buddy.avatar}
                alt={buddy.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-md">
                {initials}
              </div>
            )}
            <div className="pb-2">
              <h2 className="text-xl font-bold text-slate-800">{buddy.name}</h2>
              <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
                <Heart className="w-4 h-4" /> {buddy.role}
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <a
              href={`mailto:${buddy.email}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
            >
              <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-800 truncate">
                  {buddy.email}
                </p>
              </div>
            </a>
            <a
              href={`tel:${buddy.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
            >
              <Phone className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-800">
                  {buddy.phone}
                </p>
              </div>
            </a>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              About {buddy.name.split(" ")[0]}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {buddy.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyProfilePage;
