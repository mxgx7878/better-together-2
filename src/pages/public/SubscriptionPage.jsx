import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Sparkles,
  Building2,
  Users,
  Check,
  Crown,
  Handshake,
  ArrowRight,
  Loader2,
  Shield,
} from "lucide-react";
import { fetchPublicSubscriptions } from "../../store/actions/subscriptionActions";
import { ASYNC_STATUS } from "../../constants";

// Static fallback only used when the API has zero plans (dev / unseeded
// backend). Pricing matches the latest brief.
const FALLBACK = {
  provider: {
    monthly: [
      { id: "free-p", name: "Community Access", price: 0, billing_cycle: "monthly", role: "provider",
        description: "Stay connected with the community at no cost.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
        ] },
      { id: "mid-p", name: "Provider Portal", price: 65, billing_cycle: "monthly", role: "provider", popular: true,
        description: "Built for providers ready to grow their reach and referrals.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
          { feature_key: "client_referrals", name: "Client referral opportunities", value: null },
          { feature_key: "advertising_placements", name: "Advertising placements", value: null },
          { feature_key: "networking_complementary", name: "Network with complementary businesses", value: null },
          { feature_key: "local_referral_pathways", name: "Local referral pathways", value: null },
        ] },
      { id: "prem-p", name: "Premium", price: 95, billing_cycle: "monthly", role: "provider",
        description: "Maximum reach, brand presence, and direct access to participant groups.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
          { feature_key: "client_referrals", name: "Client referral opportunities", value: null },
          { feature_key: "advertising_placements", name: "Advertising placements", value: null },
          { feature_key: "networking_complementary", name: "Network with complementary businesses", value: null },
          { feature_key: "local_referral_pathways", name: "Local referral pathways", value: null },
          { feature_key: "priority_advertising", name: "Priority advertising", value: null },
          { feature_key: "featured_listing", name: "Featured provider listing", value: null },
          { feature_key: "participant_exposure", name: "Direct participant group access", value: null },
          { feature_key: "showcase_expertise", name: "Showcase expertise", value: null },
          { feature_key: "priority_support", name: "Priority support", value: null },
          { feature_key: "quarterly_reports", name: "Quarterly performance reports", value: null },
        ] },
    ],
    yearly: [
      { id: "free-p", name: "Community Access", price: 0, billing_cycle: "yearly", role: "provider",
        description: "Stay connected with the community at no cost.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
        ] },
      { id: "mid-p", name: "Provider Portal", price: 650, billing_cycle: "yearly", role: "provider",
        popular: true, monthly_equivalent: 54, savings_note: "≈ 2 months free",
        description: "Built for providers ready to grow their reach and referrals.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
          { feature_key: "client_referrals", name: "Client referral opportunities", value: null },
          { feature_key: "advertising_placements", name: "Advertising placements", value: null },
          { feature_key: "networking_complementary", name: "Network with complementary businesses", value: null },
          { feature_key: "local_referral_pathways", name: "Local referral pathways", value: null },
        ] },
      { id: "prem-p", name: "Premium", price: 960, billing_cycle: "yearly", role: "provider",
        monthly_equivalent: 80, savings_note: "Save $180/year",
        description: "Maximum reach, brand presence, and direct access to participant groups.",
        features: [
          { feature_key: "events_calendar", name: "Events calendar", value: null },
          { feature_key: "networking_meetups", name: "Networking meet-ups", value: null },
          { feature_key: "community_updates", name: "Community & sector updates", value: null },
          { feature_key: "message_board", name: "Provider message board", value: null },
          { feature_key: "client_referrals", name: "Client referral opportunities", value: null },
          { feature_key: "advertising_placements", name: "Advertising placements", value: null },
          { feature_key: "networking_complementary", name: "Network with complementary businesses", value: null },
          { feature_key: "local_referral_pathways", name: "Local referral pathways", value: null },
          { feature_key: "priority_advertising", name: "Priority advertising", value: null },
          { feature_key: "featured_listing", name: "Featured provider listing", value: null },
          { feature_key: "participant_exposure", name: "Direct participant group access", value: null },
          { feature_key: "showcase_expertise", name: "Showcase expertise", value: null },
          { feature_key: "priority_support", name: "Priority support", value: null },
          { feature_key: "quarterly_reports", name: "Quarterly performance reports", value: null },
        ] },
    ],
  },
  participant: {
    monthly: [
      { id: "free-pt", name: "Community Connection", price: 0, billing_cycle: "monthly", role: "participant",
        description: "Stay informed and connected with the community.",
        features: [
          { feature_key: "lfs_access", name: 'Access to "Looking for Services"', value: null },
          { feature_key: "connect_local", name: "Connect with local providers", value: null },
          { feature_key: "community_events", name: "Community updates & events", value: null },
        ] },
      { id: "guidance-pt", name: "Guidance & Advocacy Plus", price: 29, billing_cycle: "monthly", role: "participant", popular: true,
        description: "Get a personal Buddy and walk through your plan with confidence.",
        features: [
          { feature_key: "lfs_access", name: 'Access to "Looking for Services"', value: null },
          { feature_key: "connect_local", name: "Connect with local providers", value: null },
          { feature_key: "community_events", name: "Community updates & events", value: null },
          { feature_key: "plan_help", name: "Help understanding your plan", value: null },
          { feature_key: "review_guidance", name: "Guidance through reviews & processes", value: null },
          { feature_key: "advocates_access", name: "Access to advocates", value: null },
          { feature_key: "legal_aat", name: "Legal team (AAT support)", value: null },
          { feature_key: "complex_resources", name: "Training for complex processes", value: null },
          { feature_key: "buddy", name: "Personal Plan Buddy", value: null },
        ] },
    ],
    yearly: [
      { id: "free-pt", name: "Community Connection", price: 0, billing_cycle: "yearly", role: "participant",
        description: "Stay informed and connected with the community.",
        features: [
          { feature_key: "lfs_access", name: 'Access to "Looking for Services"', value: null },
          { feature_key: "connect_local", name: "Connect with local providers", value: null },
          { feature_key: "community_events", name: "Community updates & events", value: null },
        ] },
      { id: "guidance-pt", name: "Guidance & Advocacy Plus", price: 290, billing_cycle: "yearly", role: "participant",
        popular: true, monthly_equivalent: 24, savings_note: "≈ 2 months free",
        description: "Get a personal Buddy and walk through your plan with confidence.",
        features: [
          { feature_key: "lfs_access", name: 'Access to "Looking for Services"', value: null },
          { feature_key: "connect_local", name: "Connect with local providers", value: null },
          { feature_key: "community_events", name: "Community updates & events", value: null },
          { feature_key: "plan_help", name: "Help understanding your plan", value: null },
          { feature_key: "review_guidance", name: "Guidance through reviews & processes", value: null },
          { feature_key: "advocates_access", name: "Access to advocates", value: null },
          { feature_key: "legal_aat", name: "Legal team (AAT support)", value: null },
          { feature_key: "complex_resources", name: "Training for complex processes", value: null },
          { feature_key: "buddy", name: "Personal Plan Buddy", value: null },
        ] },
    ],
  },
};

// ─── Helpers ────────────────────────────────────────────────────────
const formatPrice = (plan, billingCycle) => {
  const price = Number(plan.price);
  if (price === 0) return { main: "Free", sub: "", tail: "Forever" };
  if (billingCycle === "yearly") {
    return {
      main: `$${price.toFixed(0)}`,
      sub: "/year",
      tail: plan.monthly_equivalent
        ? `≈ $${plan.monthly_equivalent}/mo`
        : "Billed yearly",
    };
  }
  return { main: `$${price.toFixed(0)}`, sub: "/month", tail: "Billed monthly" };
};

const ComparisonCell = ({ value }) => {
  if (value === undefined || value === false) {
    return <span className="text-slate-300 font-medium select-none">—</span>;
  }
  if (typeof value === "string") {
    return <span className="font-bold text-emerald-700">{value}</span>;
  }
  return <Check className="w-5 h-5 text-emerald-500 mx-auto" strokeWidth={3} />;
};

// ─── Page ───────────────────────────────────────────────────────────
const SubscriptionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { publicSubscriptions, publicStatus } = useSelector(
    (state) => state.subscription,
  );
  const loading = publicStatus === ASYNC_STATUS.LOADING;

  const [activeTab, setActiveTab] = useState("provider");
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    dispatch(
      fetchPublicSubscriptions({
        role: activeTab,
        billing_cycle: billingCycle,
      }),
    );
  }, [dispatch, activeTab, billingCycle]);

  // Use API plans if available, otherwise fallback. Sort cheapest first.
  const plans = useMemo(() => {
    const apiPlans = (publicSubscriptions || []).filter(
      (p) =>
        (p.role === activeTab || p.role === "both") &&
        (p.billing_cycle === billingCycle || !p.billing_cycle),
    );
    if (apiPlans.length > 0) {
      return [...apiPlans].sort((a, b) => Number(a.price) - Number(b.price));
    }
    return  [];
  }, [publicSubscriptions, activeTab, billingCycle]);

  // Build feature comparison rows. Each row appears once and shows
  // its presence/value on every plan.
  const comparisonRows = useMemo(() => {
    const seen = new Set();
    const rows = [];
    plans.forEach((plan) => {
      (plan.features || []).forEach((f) => {
        const key = f.feature_key || f.name;
        if (!seen.has(key)) {
          seen.add(key);
          rows.push({ key, name: f.name });
        }
      });
    });
    return rows.map((r) => {
      const presence = {};
      plans.forEach((plan) => {
        const f = (plan.features || []).find(
          (x) => (x.feature_key || x.name) === r.key,
        );
        presence[plan.id] = f ? (f.value ?? true) : false;
      });
      return { ...r, presence };
    });
  }, [plans]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Subscription Plans
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Pick the plan that
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              works for you
            </span>
          </h1>

          <p className="text-base md:text-lg mb-8 text-gray-200 max-w-2xl mx-auto">
            Flexible monthly or yearly options. Compare every feature
            side-by-side and choose what fits your needs.
          </p>

          {/* Audience tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
            <button
              onClick={() => setActiveTab("provider")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "provider"
                  ? "bg-white text-purple-900 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-1.5" /> For Providers
            </button>
            <button
              onClick={() => setActiveTab("participant")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "participant"
                  ? "bg-white text-purple-900 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Users className="w-4 h-4 inline mr-1.5" /> For Participants
            </button>
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-purple-900 shadow"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white text-purple-900 shadow"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold bg-emerald-400 text-emerald-900 px-2 py-0.5 rounded-full">
                SAVE
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Compare {activeTab === "provider" ? "provider" : "participant"} plans
            </h2>
            <p className="text-sm md:text-base text-slate-500">
              Pricing reflects your{" "}
              <span className="font-semibold text-purple-700">
                {billingCycle}
              </span>{" "}
              selection above. Tap a plan to get started.
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p className="text-slate-500">
                No plans available right now. Please check back soon.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile hint */}
              <div className="md:hidden text-center mb-3">
                <p className="text-xs text-slate-500 inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                  <ArrowRight className="w-3 h-3" /> Swipe right to see all plans
                </p>
              </div>

              {/* ─── Comparison Table ─────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table
                    className="w-full"
                    style={{ minWidth: `${260 + plans.length * 200}px` }}
                  >
                    <thead>
                      <tr>
                        {/* Sticky Features column header */}
                        <th className="sticky left-0 z-20 bg-white text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 px-5 py-5 border-b-2 border-slate-100 align-bottom min-w-[220px]">
                          Features
                        </th>
                        {plans.map((plan) => {
                          const price = formatPrice(plan, billingCycle);
                          return (
                            <th
                              key={plan.id}
                              className={`p-5 border-b-2 border-slate-100 align-top text-center relative min-w-[180px] ${
                                plan.popular ? "bg-purple-50/60" : ""
                              }`}
                            >
                              {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold uppercase tracking-widest py-1">
                                  Most Popular
                                </div>
                              )}
                              <div className={plan.popular ? "pt-4" : ""}>
                                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-tight">
                                  {plan.name}
                                </h3>
                                <div className="my-3">
                                  <p className="flex items-baseline justify-center gap-0.5">
                                    <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                                      {price.main}
                                    </span>
                                    {price.sub && (
                                      <span className="text-sm font-semibold text-slate-500">
                                        {price.sub}
                                      </span>
                                    )}
                                  </p>
                                  {price.tail && (
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {price.tail}
                                    </p>
                                  )}
                                  {plan.savings_note && (
                                    <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 inline-block mt-1.5">
                                      {plan.savings_note}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => navigate("/register")}
                                  className={`w-full py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                    plan.popular
                                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                                      : Number(plan.price) === 0
                                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                        : "bg-slate-900 hover:bg-slate-800 text-white"
                                  }`}
                                >
                                  {Number(plan.price) === 0
                                    ? "Join Free"
                                    : "Choose Plan"}
                                </button>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody>
                      {comparisonRows.map((row, idx) => {
                        const stripe = idx % 2 === 0;
                        return (
                          <tr
                            key={row.key}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td
                              className={`sticky left-0 z-10 px-5 py-3.5 text-sm font-medium text-slate-700 align-middle ${
                                stripe ? "bg-white" : "bg-slate-50/80"
                              }`}
                            >
                              {row.name}
                            </td>
                            {plans.map((plan) => (
                              <td
                                key={plan.id}
                                className={`px-3 py-3.5 text-center align-middle ${
                                  plan.popular
                                    ? stripe
                                      ? "bg-purple-50/40"
                                      : "bg-purple-50/60"
                                    : stripe
                                      ? "bg-white"
                                      : "bg-slate-50/40"
                                }`}
                              >
                                <ComparisonCell value={row.presence[plan.id]} />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ─── Plan descriptions ──────────────────────────── */}
              <div
                className="grid gap-4 mt-6"
                style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
                }}
              >
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-xl p-4 border ${
                      plan.popular ? "border-purple-200" : "border-slate-200"
                    }`}
                  >
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                      {plan.name}
                      {plan.popular && (
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              How it works —{" "}
              {activeTab === "provider" ? "for providers" : "for participants"}
            </h2>
            <p className="text-base text-slate-500">
              {activeTab === "provider"
                ? "Simple. Clear. Community-led."
                : "Supportive. Safe. Easy to navigate."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: 1,
                title:
                  activeTab === "provider"
                    ? "Join the community"
                    : "Create your profile",
                desc:
                  activeTab === "provider"
                    ? "Sign up and choose the plan that fits your business."
                    : "Tell us about yourself and the support you're looking for.",
              },
              {
                num: 2,
                title:
                  activeTab === "provider"
                    ? "Build your profile"
                    : "Browse local providers",
                desc:
                  activeTab === "provider"
                    ? "Share your services, values, and what makes you different."
                    : "Search verified providers by location and service.",
              },
              {
                num: 3,
                title:
                  activeTab === "provider"
                    ? "Connect & refer"
                    : "Connect directly",
                desc:
                  activeTab === "provider"
                    ? "Use the message board and events to grow relationships."
                    : "Reach out and find the right match for your goals.",
              },
              {
                num: 4,
                title: "Grow together",
                desc:
                  activeTab === "provider"
                    ? "Access referrals, advertising, and insights as you grow."
                    : "Walk through reviews and decisions confidently with us.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 shadow-md">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Frequently asked questions
            </h2>
            <p className="text-sm text-slate-500">
              Everything you need to know before you join.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes. You can upgrade or downgrade at any time. Changes take effect immediately, and you'll only pay the difference if upgrading mid-cycle.",
              },
              {
                q: "What's the difference between monthly and yearly?",
                a: "Yearly plans give you the same features at a discounted rate — for example, the Provider Portal is $65/month or $650/year (about two months free). Premium is $95/month or $960/year (effectively $80/month, saving $180 a year).",
              },
              {
                q: "Is the free tier really free?",
                a: "Yes. Both Community Access (providers) and Community Connection (participants) are completely free, forever. No credit card required.",
              },
              {
                q: "What payment methods do you accept?",
                a: "All major credit cards (Visa, MasterCard, Amex), PayPal, and direct debit. All payments are processed securely.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes — a 30-day money-back guarantee on all paid plans. Not satisfied? Get a full refund within the first 30 days.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden group"
              >
                <summary className="cursor-pointer px-5 py-4 font-semibold text-sm text-slate-800 flex items-center justify-between gap-4 hover:bg-slate-50 list-none">
                  <span>{faq.q}</span>
                  <ArrowRight className="w-4 h-4 text-purple-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  <p className="pt-3">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to join The Better Together Network?
          </h2>
          <p className="text-sm md:text-base text-purple-100 max-w-xl mx-auto mb-7">
            Whether you're growing a business or seeking the right support, our
            community walks alongside you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-xl hover:bg-purple-50 transition-colors shadow-lg text-sm"
            >
              <Handshake className="w-4 h-4" />
              Get Started
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              Talk to Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;