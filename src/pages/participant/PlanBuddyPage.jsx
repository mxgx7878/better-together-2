import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Frown,
  Heart,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
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

const PlanBuddyPage = () => {
  const { isPaid, user } = useAuth();
  const [showWhatIsBuddy, setShowWhatIsBuddy] = useState(false);

  // ─── Free / un-paid: explain how to get a buddy ─────────────────
  if (!isPaid) {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Frown className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            You don&apos;t have a buddy yet
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Upgrade your subscription and you&apos;ll be matched with a Buddy
            who will help you understand and navigate your plan.
          </p>
        </div>

        {/* What is a Buddy — clear, simple explanation */}
        <WhatIsBuddyCard />

        {/* How you get matched */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
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
              Your buddy helps you understand your plan, point you to trusted
              services, and answer questions along the way.
            </li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/participant/upgrade"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Upgrade to get your buddy
          </Link>
        </div>
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Your Buddy&apos;s Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            This is the person matched to help you with your plan.
          </p>
        </div>
        <button
          onClick={() => setShowWhatIsBuddy(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <Info className="w-3.5 h-3.5" /> What is a Buddy?
        </button>
      </div>

      {/* ─── Buddy profile card ────────────────────────────────── */}
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

      {/* ─── "What is a Buddy" Modal ────────────────────────────── */}
      {showWhatIsBuddy && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowWhatIsBuddy(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <WhatIsBuddyCard
              onClose={() => setShowWhatIsBuddy(false)}
              inModal
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── "What is a Buddy" — clear, simple explanation card ─────────
const WhatIsBuddyCard = ({ onClose, inModal = false }) => {
  const isHelp = [
    "Explain things in plain language",
    "Point you in the right direction",
    "Connect you with trusted services",
    "Help you understand your plan, funding categories, and reviews",
    "Help you feel confident making your own decisions",
  ];

  const isNotHelp = [
    "Manage your supports",
    "Organise your appointments",
    "Chase providers on your behalf",
    "Attend meetings with you",
    "Provide ongoing weekly support",
    "Replace a Support Coordinator",
  ];

  return (
    <div
      className={`bg-white ${inModal ? "p-6 sm:p-8" : "rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8"}`}
    >
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-bold text-purple-700">
              About your Buddy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            What a Buddy is — in clear, simple terms
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A Buddy is your <strong>guide, not your manager</strong>. You stay
            in control. We help you connect with the right people.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            A Buddy is someone you can check in with when you need help
            understanding your plan or finding the right services. They are{" "}
            <strong>not a Support Coordinator</strong>, and they don&apos;t do
            tasks for you.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 flex-shrink-0"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Things a Buddy DOES */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5">
          <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" /> A Buddy will…
          </h3>
          <ul className="space-y-2">
            {isHelp.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Things a Buddy does NOT do */}
        <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-5">
          <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4" /> A Buddy does not…
          </h3>
          <ul className="space-y-2">
            {isNotHelp.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanBuddyPage;