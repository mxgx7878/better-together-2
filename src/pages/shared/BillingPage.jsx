import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CreditCard,
  Loader2,
  ArrowRight,
  AlertTriangle,
  X,
  Download,
  RotateCcw,
  Trash2,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Info,
  Star,
  Building2,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import {
  fetchMySubscription,
  cancelSubscription,
  resumeSubscription,
  changePlan,
  cancelPendingPlan,
} from "../../store/actions/subscriptionActions";
import {
  fetchPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  fetchTransactions,
} from "../../store/actions/billingActions";
import { ASYNC_STATUS } from "../../constants";
import CardPaymentForm from "../../components/payments/CardPaymentForm";
import { getStripe } from "../../services/stripe";


// ─── Helpers ─────────────────────────────────────────────────────
const formatDate = (s) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
};

const formatPrice = (n) => `$${Number(n || 0).toFixed(2)}`;

const formatBillingCycle = (cycle) => {
  if (cycle === "yearly") return "/year";
  if (cycle === "lifetime") return " one-time";
  return "/month";
};

// Days until a given date (negative = past).
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

// Compute the user's current subscription state.
//   - free        : no paid plan
//   - active      : paid, in current period, not cancelled
//   - cancelling  : cancelled but still has paid access until ends_at
//   - expired     : paid period ended, or status==='expired'
const getSubscriptionState = (sub) => {
  if (!sub || !sub.plan) return "free";
  if (Number(sub.plan?.price || 0) === 0) return "free";

  const now = new Date();
  const endsAt = sub.ends_at ? new Date(sub.ends_at) : null;
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;

  if (sub.status === "expired") return "expired";

  // Period ended without renewal → expired
  if (periodEnd && now > periodEnd && !sub.cancelled_at) return "expired";

  // Cancelled but still has access
  if (sub.cancelled_at && endsAt && now < endsAt) return "cancelling";

  // Cancelled and period over
  if (sub.cancelled_at && endsAt && now >= endsAt) return "expired";

  return "active";
};

// ─── Sub-components ──────────────────────────────────────────────

// Plan icon based on plan tier (free / paid / premium)
const PlanIcon = ({ plan }) => {
  const price = Number(plan?.price || 0);
  if (price === 0) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <UserRound className="w-7 h-7 text-slate-500" />
      </div>
    );
  }
  if (price < 100) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-7 h-7 text-purple-600" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
      <Star className="w-7 h-7 text-amber-600" />
    </div>
  );
};

const Section = ({ title, description, children }) => (
  <section className="space-y-3">
    <div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
    </div>
    {children}
  </section>
);

// ─── Main Page ───────────────────────────────────────────────────
const BillingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isProvider, isParticipant } = useAuth();

  const upgradePath = isProvider
    ? "/provider/upgrade"
    : isParticipant
      ? "/participant/upgrade"
      : "/subscription";

  // ─── Redux state ───────────────────────────────────────────────
  const mySubscription = useSelector((s) => s.subscription.mySubscription);
  const subscriptionStatus = useSelector((s) => s.subscription.myStatus);
  const subscriptionLoading = subscriptionStatus === ASYNC_STATUS.LOADING;

const {
  cards = [],
  defaultPaymentMethodId,
  cardsStatus,
  transactions: transactionsRaw,
  transactionsStatus,
  addCardStatus,
} = useSelector((s) => s.billing || {});

// Normalize transactions — slice wraps it as { items, page, total, total_pages }
// but defensive in case shape changes to a plain array later.
const transactions = Array.isArray(transactionsRaw)
  ? transactionsRaw
  : (transactionsRaw?.items || []);
  const cardsLoading = cardsStatus === ASYNC_STATUS.LOADING;
  const transactionsLoading = transactionsStatus === ASYNC_STATUS.LOADING;
  const addingCard = addCardStatus === ASYNC_STATUS.LOADING;

  // ─── Local UI state ────────────────────────────────────────────
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [renewing, setRenewing] = useState(false);

  // ─── Load data on mount ────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchMySubscription());
    dispatch(fetchPaymentMethods());
    dispatch(fetchTransactions());
  }, [dispatch]);

  // ─── Derived state ─────────────────────────────────────────────
  const state = getSubscriptionState(mySubscription);
  const plan = mySubscription?.plan;
  const pendingPlan = mySubscription?.pending_plan;
  const daysLeft = daysUntil(mySubscription?.current_period_end || mySubscription?.ends_at);
  const isNearExpiry = state === "active" && daysLeft !== null && daysLeft <= 7;
  const defaultCard = cards.find((c) => c.id === defaultPaymentMethodId) || cards[0];

  // ─── Action handlers ───────────────────────────────────────────
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await dispatch(cancelSubscription()).unwrap();
      setShowCancelModal(false);
    } catch {
      // toasted by action
    } finally {
      setCancelling(false);
    }
  };

  const handleResume = async () => {
    setResuming(true);
    try {
      await dispatch(resumeSubscription()).unwrap();
    } catch {
      // toasted
    } finally {
      setResuming(false);
    }
  };

  const handleRenew = async () => {
    if (!defaultCard) {
      toast.error("Please add a payment method first");
      setShowAddCard(true);
      return;
    }
    if (!plan?.id) {
      navigate(upgradePath);
      return;
    }
    setRenewing(true);
    try {
      await dispatch(
        changePlan({
          plan_id: plan.id,
          payment_method_id: defaultCard.id,
        }),
      ).unwrap();
      dispatch(fetchMySubscription());
      dispatch(fetchTransactions());
    } catch {
      // toasted
    } finally {
      setRenewing(false);
    }
  };

  const handleAddCardSuccess = async (paymentMethodId) => {
    try {
      await dispatch(addPaymentMethod({ payment_method_id: paymentMethodId })).unwrap();
      setShowAddCard(false);
      dispatch(fetchPaymentMethods());
    } catch {
      // toasted
    }
  };

  const handleRemoveCard = async (id) => {
    if (!confirm("Remove this card?")) return;
    await dispatch(removePaymentMethod(id));
    dispatch(fetchPaymentMethods());
  };

  const handleSetDefault = async (id) => {
    await dispatch(setDefaultPaymentMethod(id));
    dispatch(fetchPaymentMethods());
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (subscriptionLoading && !mySubscription) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your plan, payment method, and invoices.
        </p>
      </div>

      {/* ─── Plan Hero Card ───────────────────────────────────── */}
      <div
        className={`bg-white rounded-2xl border shadow-sm p-6 ${
          state === "expired"
            ? "border-amber-200"
            : isNearExpiry
              ? "border-amber-200"
              : "border-slate-200"
        }`}
      >
        <div className="flex items-start gap-4 flex-wrap">
          <PlanIcon plan={plan} />

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800">
              {plan?.name || "Free plan"}
            </h2>
            {plan?.description && (
              <p className="text-sm text-slate-500 mt-0.5">{plan.description}</p>
            )}

            {/* Status line — varies by state */}
            <div className="mt-2 text-sm">
              {state === "free" && (
                <p className="text-slate-500">
                  You're on the Free plan. Upgrade to unlock paid features.
                </p>
              )}
              {state === "active" && !isNearExpiry && (
                <p className="text-slate-600">
                  <Calendar className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                  Active until{" "}
                  <span className="font-semibold text-slate-800">
                    {formatDate(mySubscription?.current_period_end)}
                  </span>
                  . Manual renewal — we don't auto-charge.
                </p>
              )}
              {state === "active" && isNearExpiry && (
                <p className="text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                  Expires in {daysLeft} day{daysLeft === 1 ? "" : "s"} — renew before{" "}
                  <span className="font-semibold">
                    {formatDate(mySubscription?.current_period_end)}
                  </span>{" "}
                  to keep access.
                </p>
              )}
              {state === "cancelling" && (
                <p className="text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                  Cancelled — access ends on{" "}
                  <span className="font-semibold">
                    {formatDate(mySubscription?.ends_at || mySubscription?.current_period_end)}
                  </span>
                  .
                </p>
              )}
              {state === "expired" && (
                <p className="text-red-700">
                  <Info className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                  Your access has ended. Renew to continue.
                </p>
              )}
            </div>
          </div>

          {/* Right-side actions — varies by state */}
          <div className="flex flex-wrap items-center gap-2">
            {state === "free" && (
              <button
                onClick={() => navigate(upgradePath)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
              >
                Upgrade <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {state === "active" && (
              <>
                {isNearExpiry && (
                  <button
                    onClick={handleRenew}
                    disabled={renewing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60"
                  >
                    {renewing && <Loader2 className="w-4 h-4 animate-spin" />}
                    Renew now ({formatPrice(plan?.price)})
                  </button>
                )}
                <button
                  onClick={() => navigate(upgradePath)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Change plan
                </button>
              </>
            )}

            {state === "cancelling" && (
              <button
                onClick={handleResume}
                disabled={resuming}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md disabled:opacity-60"
              >
                {resuming && <Loader2 className="w-4 h-4 animate-spin" />}
                <RotateCcw className="w-4 h-4" />
                Resume subscription
              </button>
            )}

            {state === "expired" && (
              <>
                <button
                  onClick={handleRenew}
                  disabled={renewing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md disabled:opacity-60"
                >
                  {renewing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Renew now ({formatPrice(plan?.price)})
                </button>
                <button
                  onClick={() => navigate(upgradePath)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Change plan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Plan price display */}
        {plan && Number(plan.price) > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {formatPrice(plan.price)}
            </span>
            <span className="text-sm text-slate-500">
              {formatBillingCycle(plan.billing_cycle)}
            </span>
          </div>
        )}
      </div>

      {/* ─── Pending Change Banner ────────────────────────────── */}
      {pendingPlan && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              Plan change scheduled
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              You'll switch to{" "}
              <span className="font-semibold">{pendingPlan.name}</span> on{" "}
              {formatDate(mySubscription?.ends_at || mySubscription?.current_period_end)}.
            </p>
          </div>
          <button
            onClick={() => dispatch(cancelPendingPlan())}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
          >
            Cancel change
          </button>
        </div>
      )}

      {/* ─── Payment Method ───────────────────────────────────── */}
      <Section title="Payment method">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {cardsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
            </div>
          ) : cards.length === 0 ? (
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                No payment method on file. Add one to renew your subscription.
              </p>
              <button
                onClick={() => setShowAddCard(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add payment method
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {cards.map((card) => {
                const isDefault = card.id === defaultPaymentMethodId;
                return (
                  <li
                    key={card.id}
                    className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CreditCard className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {(card.brand || "Card").charAt(0).toUpperCase() +
                            (card.brand || "Card").slice(1)}{" "}
                          •••• {card.last4 || card.last_four || "····"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Expires{" "}
                          {String(card.exp_month || "").padStart(2, "0")}/
                          {String(card.exp_year || "").slice(-2)}
                          {isDefault && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Default
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isDefault && (
                        <button
                          onClick={() => handleSetDefault(card.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
              <li className="px-6 py-3">
                <button
                  onClick={() => setShowAddCard(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add another card
                </button>
              </li>
            </ul>
          )}
        </div>
      </Section>

      {/* ─── Cancel subscription (only if active and not cancelling) ── */}
      {state === "active" && (
        <Section title="Subscription">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">Cancel subscription</p>
              <p className="text-xs text-slate-500 mt-1">
                Your access continues until{" "}
                {formatDate(mySubscription?.current_period_end)}, then your account
                drops to the Free plan. You can resume anytime before that.
              </p>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl"
            >
              Cancel subscription
            </button>
          </div>
        </Section>
      )}

      {/* ─── Invoices ─────────────────────────────────────────── */}
      <Section title="Invoices">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-500">No invoices yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Plan
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(tx.paid_at || tx.created_at)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {tx.plan_name || tx.description || "Subscription"}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {formatPrice(tx.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                          tx.status === "paid" || tx.status === "succeeded"
                            ? "bg-emerald-50 text-emerald-700"
                            : tx.status === "failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.pdf_url || tx.invoice_pdf ? (
                        <a
                          href={tx.pdf_url || tx.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
                        >
                          <Download className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Section>

      {/* ─── Cancel Confirmation Modal ────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-800">
                  Cancel your subscription?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your <strong>{plan?.name}</strong> access continues until{" "}
                  <strong>{formatDate(mySubscription?.current_period_end)}</strong>.
                  After that, your account drops to the Free plan. You can resume
                  anytime before that date.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50"
              >
                {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Card Modal ───────────────────────────────────── */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add payment method</h3>
              <button
                onClick={() => setShowAddCard(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <Elements stripe={getStripe()}>
                <CardPaymentForm
                  onPaymentMethod={handleAddCardSuccess}
                  submitting={addingCard}
                  submitLabel="Save card"
                />
              </Elements>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Your card is securely stored by Stripe — we never see the full number.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;