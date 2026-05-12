import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Crown,
  Check,
  Sparkles,
  ArrowRight,
  Infinity as InfinityIcon,
  Users,
  Zap,
  Loader2,
} from "lucide-react";
import { fetchPublicSubscriptions } from "../../store/actions/subscriptionActions";
import { ASYNC_STATUS } from "../../constants";

/**
 * Founding Members section — pulls the lifetime provider plan from the
 * existing /subscriptions endpoint (same one SubscriptionPage uses).
 * No new API needed.
 *
 * Reuses: fetchPublicSubscriptions({ role: 'provider', billing_cycle: 'lifetime' })
 */
const FoundingMembersSection = () => {
  const dispatch = useDispatch();
  const { publicSubscriptions, publicStatus } = useSelector(
    (s) => s.subscription,
  );
  const loading = publicStatus === ASYNC_STATUS.LOADING;

  // Fetch only lifetime provider plans
  useEffect(() => {
    dispatch(
      fetchPublicSubscriptions({
        role: "provider",
        billing_cycle: "lifetime",
      }),
    );
  }, [dispatch]);

  // Pick the cheapest lifetime plan as the "founding member" plan
  const plan = useMemo(() => {
    const lifetimePlans = (publicSubscriptions || []).filter(
      (p) =>
        (p.role === "provider" || p.role === "both") &&
        p.billing_cycle === "lifetime",
    );
    if (lifetimePlans.length === 0) return null;
    return [...lifetimePlans].sort(
      (a, b) => Number(a.price) - Number(b.price),
    )[0];
  }, [publicSubscriptions]);

  // ─── Hide section while loading or if no lifetime plan exists ──
  if (loading && !plan) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </section>
    );
  }
  if (!plan) return null;

  // ─── Default perks — use plan.features if API returns them ────
  const planFeatures = Array.isArray(plan.features) ? plan.features : [];
  const perks =
    planFeatures.length > 0
      ? planFeatures.slice(0, 4).map((f, i) => ({
          icon: [InfinityIcon, Crown, Zap, Sparkles][i % 4],
          text: typeof f === "string" ? f : f?.name || f?.title || "",
        }))
      : [
          {
            icon: InfinityIcon,
            text: "Lifetime access — pay once, never again",
          },
          {
            icon: Crown,
            text: "Exclusive Founding Member badge on your profile",
          },
          { icon: Zap, text: "Priority listing in the business directory" },
          {
            icon: Sparkles,
            text: "All future features included at no extra cost",
          },
        ];

  const price = Number(plan.price) || 0;

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* ─── Left: Pitch ──────────────────────────── */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 rounded-full px-4 py-1.5 mb-5 shadow-lg">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Founding Members Offer
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Lifetime Access for the
                <span className="block bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                  First 100 Businesses
                </span>
              </h2>

              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                {plan.description ||
                  "Join Better Together Network as a founding member — pay once and get lifetime access. No monthly fees, no renewals, ever."}
              </p>

              {/* Perks */}
              <ul className="space-y-3 mb-8">
                {perks.map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-white/90 text-sm md:text-base">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Claim Your Spot
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold py-3.5 px-6 rounded-xl transition-all"
                >
                  View All Plans
                </Link>
              </div>
            </div>

            {/* ─── Right: Price Card ───────────────────── */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 mb-4">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">
                      Limited to First 100 Businesses
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {plan.name || "Founding Member"}
                  </h3>

                  {/* Price */}
                  <div className="my-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-slate-400">
                        $
                      </span>
                      <span className="text-6xl md:text-7xl font-extrabold bg-gradient-to-br from-indigo-600 to-rose-500 bg-clip-text text-transparent">
                        {price.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mt-2">
                      One-time payment · Lifetime access
                    </p>
                  </div>

                  {/* Value points */}
                  <div className="border-t border-slate-100 pt-6 space-y-2.5 text-left">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Check
                        className="w-4 h-4 text-emerald-500 flex-shrink-0"
                        strokeWidth={3}
                      />
                      <span>No recurring fees, ever</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Check
                        className="w-4 h-4 text-emerald-500 flex-shrink-0"
                        strokeWidth={3}
                      />
                      <span>Full directory listing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Check
                        className="w-4 h-4 text-emerald-500 flex-shrink-0"
                        strokeWidth={3}
                      />
                      <span>Founding Member badge</span>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    Sign Up Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundingMembersSection;