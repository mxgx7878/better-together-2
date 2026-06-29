import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { X, CreditCard, Plus, Check, Loader2, ChevronLeft } from "lucide-react";
import { getStripe } from "../../services/stripe";
import CardPaymentForm from "./CardPaymentForm";
import {
  fetchPaymentMethods,
  createCardSetupIntent,
} from "../../store/actions/billingActions";
import { ASYNC_STATUS } from "../../constants";

/**
 * Payment modal with saved-card support.
 *
 * If the user already has cards on file, they pick one (default
 * preselected) instead of re-typing card details. "Use a different card"
 * reveals the card form to add a new one. With no cards, it opens straight
 * on the card form.
 *
 * The contract with callers is unchanged: onPaymentMethod(paymentMethodId)
 * receives a Stripe payment-method id — either an existing saved card or a
 * freshly entered one. So usePayment() / UpgradePage / marketing add-on all
 * keep working without any change.
 *
 * Props:
 *  - open, onClose, title, subtitle, amount, currency, submitLabel
 *  - submitting: boolean        (parent's backend call in flight)
 *  - onPaymentMethod: (pmId) => Promise<void>
 */
const brandLabel = (b) => (b ? b.charAt(0).toUpperCase() + b.slice(1) : "Card");

const PaymentModal = ({
  open,
  onClose,
  title,
  subtitle,
  amount,
  currency = "AUD",
  submitLabel,
  submitting = false,
  onPaymentMethod,
}) => {
  const dispatch = useDispatch();
  const cards = useSelector((s) => s.billing?.cards) || [];
  const defaultPaymentMethodId = useSelector(
    (s) => s.billing?.defaultPaymentMethodId,
  );
  const cardsStatus = useSelector((s) => s.billing?.cardsStatus);
  const cardsLoading = cardsStatus === ASYNC_STATUS.LOADING;

  const hasCards = cards.length > 0;

  // "saved" → choose an existing card, "new" → enter a fresh one.
  const [mode, setMode] = useState("saved");
  const [selectedId, setSelectedId] = useState(null);

  // Refresh saved cards each time the modal opens.
  useEffect(() => {
    if (open) dispatch(fetchPaymentMethods());
  }, [open, dispatch]);

  // Pick a sensible default selection once cards are known.
  useEffect(() => {
    if (!open) return;
    if (hasCards) {
      setMode("saved");
      setSelectedId(defaultPaymentMethodId || cards[0]?.id || null);
    } else {
      setMode("new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasCards, defaultPaymentMethodId]);

  if (!open) return null;

  const priceLabel = submitLabel || `Pay $${amount?.toFixed(2) ?? ""}`;

  const payWithSaved = async () => {
    if (!selectedId) return;
    await onPaymentMethod?.(selectedId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {typeof amount === "number" && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Amount Due Today
              </p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">
                ${amount.toFixed(2)}{" "}
                <span className="text-xs font-medium text-slate-500">
                  {currency}
                </span>
              </p>
            </div>
          )}

          {/* ── Saved cards ──────────────────────────────────── */}
          {mode === "saved" && (
            <div className="space-y-3">
              {cardsLoading && !hasCards ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {cards.map((card) => {
                    const id = card.id;
                    const active = id === selectedId;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                            active
                              ? "border-purple-500 ring-2 ring-purple-200 bg-purple-50/40"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <CreditCard className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {brandLabel(card.brand)} ••••{" "}
                              {card.last4 || card.last_four || "····"}
                            </p>
                            {card.exp_month && card.exp_year && (
                              <p className="text-xs text-slate-400">
                                Expires {card.exp_month}/{card.exp_year}
                              </p>
                            )}
                          </div>
                          {id === defaultPaymentMethodId && (
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                          {active && (
                            <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                onClick={() => setMode("new")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" /> Use a different card
              </button>

              <button
                type="button"
                onClick={payWithSaved}
                disabled={!selectedId || submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {priceLabel}
              </button>
            </div>
          )}

          {/* ── New card ─────────────────────────────────────── */}
          {mode === "new" && (
            <div className="space-y-3">
              {hasCards && (
                <button
                  type="button"
                  onClick={() => setMode("saved")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" /> Use a saved card
                </button>
              )}

              <Elements stripe={getStripe()}>
                <CardPaymentForm
                  onPaymentMethod={onPaymentMethod}
                  submitting={submitting}
                  submitLabel={priceLabel}
                  mode="setup"
                  onRequestSetupIntent={async () => {
                    const r = await dispatch(createCardSetupIntent()).unwrap();
                    return r?.clientSecret;
                  }}
                />
              </Elements>

              <p className="text-xs text-slate-400 text-center">
                Your card is securely stored by Stripe for future payments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;