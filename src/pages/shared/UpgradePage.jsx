import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Megaphone,
  Check,
  Crown,
  Sparkles,
  ArrowRight,
  Loader2,
  Info,
  CheckCircle2,
  Clock,
  X as XIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchPublicSubscriptions,
  fetchMySubscription,
  changePlan,
  cancelPendingPlan,
  purchaseMarketingAddon,
} from "../../store/actions/subscriptionActions";
import { checkAuth } from "../../store/actions/authActions";
import { ASYNC_STATUS } from "../../constants";
import usePayment from "../../hooks/usePayment";
import PaymentModal from "../../components/payments/PaymentModal";
import api from "../../services/api";
import { calculatePrice } from "../../utils/pricing";

// ─── Helpers ────────────────────────────────────────────────────────
// Locate the user's current plan in whichever shape the backend returns.
const getUserPlan = (user) => {
  if (!user) return null;
  // NEW shape from /user — preferred
  if (user.subscriber?.plan && typeof user.subscriber.plan === "object")
    return user.subscriber.plan;
  // Legacy fallbacks
  if (user.subscription && typeof user.subscription === "object")
    return user.subscription;
  if (
    user.current_subscription &&
    typeof user.current_subscription === "object"
  )
    return user.current_subscription;
  if (user.plan && typeof user.plan === "object") return user.plan;
  if (user.subscriptionPlan && typeof user.subscriptionPlan === "object")
    return user.subscriptionPlan;
  return null;
};

const getUserPlanName = (user) => {
  const plan = getUserPlan(user);
  if (plan?.name) return plan.name;
  if (typeof user?.subscriptionPlan === "string") return user.subscriptionPlan;
  return null;
};

const isCurrentPlan = (user, isPaid, plan) => {
  if (!plan) return false;
  // Free plan ↔ unpaid user
  if (Number(plan.price) === 0) return !isPaid;
  // Match by id when we have it (from API)
  const userPlan = getUserPlan(user);
  if (userPlan?.id && plan.id) return userPlan.id === plan.id;
  // Fallback — match by name (legacy string)
  const userPlanName = getUserPlanName(user);
  if (userPlanName && plan.name) {
    return userPlanName.toLowerCase() === plan.name.toLowerCase();
  }
  return false;
};

const formatPriceDisplay = (plan, billingCycle) => {
  const price = Number(plan.price);
  if (price === 0) return { main: "Free", sub: "" };

  // Lifetime — single one-time payment, no recurring suffix.
  if (billingCycle === "lifetime" || plan.billing_cycle === "lifetime") {
    return { main: `$${price.toFixed(0)}`, sub: " one-time" };
  }

  if (billingCycle === "yearly") {
    return { main: `$${price.toFixed(0)}`, sub: "/year" };
  }
  return { main: `$${price.toFixed(0)}`, sub: "/month" };
};

// ─── Page ───────────────────────────────────────────────────────────
const UpgradePage = () => {
  const dispatch = useDispatch();
  const { user, isProvider, isParticipant, isPaid } = useAuth();
  const { config, submitting, pay, close, handlePaymentMethod } = usePayment();
  const navigate = useNavigate();

  console.log(close, "close")
  const {
    publicSubscriptions,
    publicStatus,
    mySubscription,
    changePlanStatus,
    lastInvoice,
  } = useSelector((s) => s.subscription);

  const loading = publicStatus === ASYNC_STATUS.LOADING;
  const changing = changePlanStatus === ASYNC_STATUS.LOADING;
  const pendingPlan = mySubscription?.pending_plan || null;

  const [promo, setPromo] = useState({});
  const [loader , setLoading] = useState(false)

  const [billingCycle, setBillingCycle] = useState( isParticipant? 'yearly':"monthly");

  const role = isProvider ? "provider" : isParticipant ? "participant" : "all";

  // Fetch plans matching this user's role + billing cycle
  useEffect(() => {
    dispatch(
      fetchPublicSubscriptions({
        role,
        billing_cycle: billingCycle,
      }),
    );
  }, [dispatch, role, billingCycle]);

  const previewPromo = async (planId) => {
    const code = promo[planId]?.code?.trim();

    if (!code) return;

    setLoading(true)
    try {
      const res = await api.post("/promo-codes/validate", {
        code,
        plan_id: planId,
      });

      setPromo((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          discount: res.data.discount,
          error: "",
        },
      }));
    } catch (e) {
      setPromo((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          discount: null,
          error: e.message,
        },
      }));
    } finally{
      setLoading(false)
    }
  };
  // Fetch current subscription on mount
  useEffect(() => {
    dispatch(fetchMySubscription());
  }, [dispatch]);

  // Filter + sort plans for display
  const plans = useMemo(() => {
    const apiPlans = (publicSubscriptions || []).filter(
      (p) =>
        (p.role === role || p.role === "both") &&
        (p.billing_cycle === billingCycle || !p.billing_cycle),
    );
    return [...apiPlans].sort((a, b) => Number(a.price) - Number(b.price));
  }, [publicSubscriptions, role, billingCycle]);

  // What plan is the user currently on?
  const userPlanName =
    getUserPlanName(user) || (isPaid ? "Paid Plan" : "Free Plan");
  const currentPlan = plans.find((p) => isCurrentPlan(user, isPaid, p));

  // Free plan reference (used for Cancel Plan → downgrade to free)
  const freePlan = useMemo(
    () => plans.find((p) => Number(p.price) === 0),
    [plans],
  );

  // Marketing add-on eligibility — any paid plan
  const hasGrowthOrAbove = isPaid;

  // ─── Action handlers ──────────────────────────────────────────────
  const refreshUser = async () => {
    await dispatch(checkAuth());
    dispatch(fetchMySubscription());
  };

  const handlePlanAction = (plan) => {
    const currentPrice = Number(currentPlan?.price ?? 0);
    const newPrice = Number(plan.price);

    // Downgrade / switch to free → no card needed (backend schedules)
    if (newPrice <= currentPrice) {
      dispatch(changePlan({ plan_id: plan.id }))
        .unwrap()
        .then(refreshUser)
        .catch(() => {});
      return;
    }

    const pricing = calculatePrice({
      price: newPrice,
      discount: promo[plan.id]?.discount,
    });

    // Upgrade → open Stripe card modal
    pay({
      title: `Upgrade to ${plan.name}`,
      subtitle:
        plan.billing_cycle === "lifetime"
          ? "One-time payment"
          : `Billed ${plan.billing_cycle || "monthly"}`,
      amount: pricing.finalPrice,
      submitLabel: `Pay $${pricing.finalPrice.toFixed(2)} & Subscribe`,
      onPay: async (paymentMethodId) => {
        await dispatch(
          changePlan({
            plan_id: plan.id,
            payment_method_id: paymentMethodId,
            promo_code: promo[plan.id]?.code || undefined,
          }),
        ).unwrap();
        await refreshUser();
        if(isProvider) {
        navigate("/provider/dashboard");
      } else{
        navigate("/participant/plan-buddy");
      }
      },
    });
  };

  const handleCancelPending = () => {
    dispatch(cancelPendingPlan())
      .unwrap()
      .then(refreshUser)
      .catch(() => {});
  };

  const handleCancelPlan = () => {
    if (!freePlan) return;
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        "Cancel your plan? You'll keep access until the end of your billing period.",
      )
    )
      return;
    dispatch(changePlan({ plan_id: freePlan.id }))
      .unwrap()
      .then(refreshUser)
      .catch(() => {});
  };

  const handleBuyMarketing = () => {
    pay({
      title: "Marketing Add-on",
      subtitle: "Featured Partners ribbon · billed monthly",
      amount: 49, // TODO: pull from backend marketing plan config
      submitLabel: "Pay & Activate",
      onPay: async (paymentMethodId) => {
        await dispatch(
          purchaseMarketingAddon({ payment_method_id: paymentMethodId }),
        ).unwrap();
        await refreshUser();
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Manage Subscription
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isPaid
            ? "View your current plan or switch to a different one"
            : "Choose a plan to unlock more features"}
        </p>
      </div>

      {/* ─── Current Plan Banner ─────────────────────────────── */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 ${
          isPaid
            ? "bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white"
            : "bg-slate-50 border border-slate-200"
        }`}
      >
        {isPaid && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
        )}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPaid ? (
                <Crown className="w-4 h-4 text-yellow-300" />
              ) : (
                <Info className="w-4 h-4 text-slate-500" />
              )}
              <p
                className={`text-xs font-bold uppercase tracking-widest ${
                  isPaid ? "text-purple-100" : "text-slate-500"
                }`}
              >
                Current Plan
              </p>
            </div>
            <h2
              className={`text-xl md:text-2xl font-bold ${
                isPaid ? "text-white" : "text-slate-800"
              }`}
            >
              {currentPlan?.name || userPlanName}
            </h2>
            {currentPlan && Number(currentPlan.price) > 0 && (
              <p
                className={`text-sm mt-1 ${
                  isPaid ? "text-purple-100" : "text-slate-600"
                }`}
              >
                ${Number(currentPlan.price).toFixed(0)}
                {currentPlan.billing_cycle === "lifetime"
                  ? " one-time"
                  : `/${currentPlan.billing_cycle || billingCycle}`}
              </p>
            )}
          </div>
          {isPaid && (
            <div className="flex flex-wrap gap-2">
              {/* Manage Billing → Stripe Customer Portal (backend endpoint pending) */}
              <button
                disabled
                title="Coming soon — Stripe billing portal"
                className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/25 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Manage Billing
              </button>
              <button
                onClick={handleCancelPlan}
                disabled={changing || !freePlan}
                className="px-4 py-2 bg-white text-rose-600 text-sm font-semibold rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-60"
              >
                Cancel Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Pending Downgrade Banner ────────────────────────── */}
      {pendingPlan && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              Scheduled change: switching to{" "}
              <span className="underline">{pendingPlan.name}</span> on{" "}
              {mySubscription?.current_period_end || "the next billing date"}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              You&apos;ll keep your current plan&apos;s benefits until then.
            </p>
          </div>
          <button
            onClick={handleCancelPending}
            disabled={changing}
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors disabled:opacity-60"
          >
            <XIcon className="w-3 h-3" /> Cancel
          </button>
        </div>
      )}

 
      {/* ─── Billing toggle — Monthly / Yearly / Lifetime ────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-800">Available Plans</h2>
        <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 flex-wrap">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Yearly
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              SAVE
            </span>
          </button>
          <button
            onClick={() => setBillingCycle("lifetime")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "lifetime"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Lifetime
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
              ONE-TIME
            </span>
          </button>
        </div>
      </div>

      {/* ─── Plans Grid ──────────────────────────────────────── */}
      {loading && plans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-500">
            No {billingCycle} plans available right now. Try a different billing
            option above, or check back soon.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-5 ${
            plans.length === 3
              ? "lg:grid-cols-3"
              : "lg:grid-cols-2 max-w-3xl mx-auto"
          }`}
        >
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(user, isPaid, plan);
            const price = formatPriceDisplay(plan, billingCycle);
            const isFree = Number(plan.price) === 0;

            const pricing = calculatePrice({
              price: plan.price,
              discount: promo[plan.id]?.discount,
            });

            // Determine if this is upgrade or downgrade vs current
            let actionLabel = isPaid ? "Switch Plan" : "Upgrade Now";
            if (currentPlan && !isCurrent) {
              if (Number(plan.price) > Number(currentPlan.price)) {
                actionLabel = "Upgrade";
              } else if (Number(plan.price) < Number(currentPlan.price)) {
                actionLabel = "Downgrade";
              }
            }
            if (isFree && !isPaid) actionLabel = "Free Forever";
            // Lifetime plans get a clearer call to action
            if (
              !isCurrent &&
              !isFree &&
              (billingCycle === "lifetime" || plan.billing_cycle === "lifetime")
            ) {
              actionLabel = "Get Lifetime Access";
            }

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                  isCurrent
                    ? "border-emerald-400 ring-2 ring-emerald-100 shadow-md"
                    : plan.popular
                      ? "border-purple-300 shadow-lg"
                      : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Top badge */}
                {isCurrent ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    <CheckCircle2 className="w-3 h-3" /> Current Plan
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    <Crown className="w-3 h-3" /> Most Popular
                  </div>
                ) : null}

                {/* Plan title + price */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    {plan.description}
                  </p>
                )}
                <div className="mb-4">
                  <p className="flex flex-col items-baseline gap-0.5">
                    {pricing.hasDiscount ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="line-through text-slate-400">
                            $ {pricing.originalPrice.toFixed(2)}
                          </span>

                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            Save {pricing.savedPercent}%
                          </span>
                        </div>

                        <div className="text-4xl font-bold text-purple-700">
                          $ {pricing.finalPrice.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-slate-900">
                        {price.main}
                      </span>
                    )}
                  </p>
                  {plan.savings_note && (
                    <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 inline-block mt-1.5">
                      {plan.savings_note}
                    </p>
                  )}
                </div>

                {/* Feature list */}
                <ul className="space-y-2 mb-6">
                  {(plan.features || []).map((f, i) => {
                    const fname = f.name || f.feature_key;
                    const fvalue =
                      typeof f.value === "string" && f.value
                        ? f.value
                        : f.pivot?.value || null;
                    return (
                      <li
                        key={f.id || f.feature_key || i}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check
                          className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"
                          strokeWidth={3}
                        />
                        <span className="text-slate-700 leading-snug flex-1">
                          {fname}
                          {fvalue && (
                            <span className="ml-1.5 inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {fvalue}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 mb-3">
                  <div className="flex gap-2">
                    <input
                      value={promo[plan.id]?.code || ""}
                      onChange={(e) =>
                        setPromo((prev) => ({
                          ...prev,
                          [plan.id]: {
                            ...prev[plan.id],
                            code: e.target.value,
                            discount: null,
                            error: "",
                          },
                        }))
                      }
                      placeholder="Promo code"
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => previewPromo(plan.id)}
                      disabled={loading}
                      className="px-3 py-2 rounded-lg border border-purple-300 text-purple-700 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {promo[plan.id]?.discount != null && (
                    <p className="text-xs text-green-600 mt-1">
                      ${promo[plan.id].discount.toFixed(2)} applied
                    </p>
                  )}

                  {promo[plan.id]?.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {promo[plan.id].error}
                    </p>
                  )}
                </div>

                {/* Action button */}
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl cursor-default border border-emerald-200"
                  >
                    Your Current Plan
                  </button>
                ) : isFree && !isPaid ? (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-50 text-slate-400 text-sm font-bold rounded-xl cursor-default"
                  >
                    Free Forever
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanAction(plan)}
                    disabled={changing || submitting}
                    className={`w-full py-3 text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {changing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {actionLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Marketing Add-on (provider only) ───────────────── */}
      {isProvider && (
        <div
          className={`rounded-2xl border-2 p-6 transition-all ${
            hasGrowthOrAbove
              ? "bg-white border-amber-200 shadow-sm"
              : "bg-slate-50 border-slate-200 opacity-90"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  hasGrowthOrAbove ? "bg-amber-100" : "bg-slate-200"
                }`}
              >
                <Megaphone
                  className={`w-6 h-6 ${
                    hasGrowthOrAbove ? "text-amber-700" : "text-slate-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-base font-semibold text-slate-800">
                    Marketing Add-on — Platform Advertising
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      hasGrowthOrAbove
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    Add-on
                  </span>
                </div>
                <p className="text-sm text-slate-500 max-w-xl mb-3">
                  Get your brand featured across the platform — your logo
                  scrolls in the{" "}
                  <span className="font-medium text-slate-700">
                    Featured Partners ribbon
                  </span>
                  , visible to all participants and providers. Billed monthly,
                  cancel any time.
                </p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    "Logo in Featured Partners ribbon",
                    "Listing boosted in provider search",
                    "Highlighted on participant home page",
                    "1-month minimum, renew as needed",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          hasGrowthOrAbove ? "text-amber-600" : "text-slate-400"
                        }`}
                        strokeWidth={3}
                      />
                      <span className="text-xs text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {hasGrowthOrAbove ? (
                <button
                  onClick={handleBuyMarketing}
                  disabled={changing || submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all whitespace-nowrap disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Add Marketing
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 bg-slate-200 text-slate-400 text-sm font-semibold rounded-xl cursor-not-allowed whitespace-nowrap"
                >
                  Upgrade First
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Team Members Note (provider + paid) ─────────────── */}
      {isProvider && isPaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Team Members</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              All paid subscriptions include the ability to add up to 4 team
              members. Team members get access to free tier features.{" "}
              <Link to="../profile" className="underline font-semibold">
                Manage in Profile <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </p>
          </div>
        </div>
      )}

      <PaymentModal
        open={!!config}
        onClose={close}
        title={config?.title || "Complete Payment"}
        subtitle={config?.subtitle}
        amount={config?.amount}
        currency={config?.currency}
        submitting={submitting}
        submitLabel={config?.submitLabel}
        onPaymentMethod={handlePaymentMethod}
      />

      {/* ─── Last invoice success toast ─────────────────────── */}
      {lastInvoice && (
        <div className="fixed bottom-6 right-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm shadow-lg z-40">
          <p className="text-sm font-semibold text-emerald-800">
            Payment successful
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Invoice {lastInvoice.invoice_number} — $
            {Number(lastInvoice.amount).toFixed(2)}
          </p>
          {lastInvoice.hosted_invoice_url && (
            <a
              href={lastInvoice.hosted_invoice_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-700 underline mt-1 inline-block"
            >
              View invoice ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradePage;
