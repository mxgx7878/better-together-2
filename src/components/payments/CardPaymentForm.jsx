import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1e293b",
      fontFamily: "system-ui, -apple-system, sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
  hidePostalCode: true,
};

/**
 * Reusable card input. Tokenizes the card → returns payment_method_id
 * to the caller (no API call here — caller decides where to send it).
 *
 * Props:
 *  - onPaymentMethod: (paymentMethodId: string) => Promise<void> | void
 *  - submitLabel: string
 *  - submitting: boolean   (parent-controlled — for backend call in flight)
 *  - disabled: boolean
 */
const CardPaymentForm = ({
  onPaymentMethod,
  submitLabel = "Pay & Subscribe",
  submitting = false,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardReady, setCardReady] = useState(false);
  const [tokenizing, setTokenizing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setTokenizing(true);
    setError(null);

    const card = elements.getElement(CardElement);
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    setTokenizing(false);

    if (pmError) {
      setError(pmError.message);
      return;
    }
    await onPaymentMethod?.(paymentMethod.id);
  };

  const busy = tokenizing || submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Card Details
        </label>
        <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              setCardReady(e.complete);
              if (e.error) setError(e.error.message);
              else setError(null);
            }}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-600 mt-2">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Lock className="w-3 h-3" />
        <span>Your payment is secured by Stripe. We never see your card.</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || !cardReady || busy || disabled}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? "Processing..." : submitLabel}
      </button>
    </form>
  );
};

export default CardPaymentForm;