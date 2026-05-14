import { Elements } from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { getStripe } from "../../services/stripe";
import CardPaymentForm from "./CardPaymentForm";

/**
 * Generic payment modal — wraps CardPaymentForm in Stripe Elements.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - title: string                e.g. "Upgrade to Growth Plan"
 *  - subtitle?: string            e.g. "$29 prorated for 18 days"
 *  - amount?: number              dollars (display only — backend calculates real charge)
 *  - currency?: string            default "AUD"
 *  - submitLabel?: string
 *  - submitting?: boolean         (parent shows backend call in flight)
 *  - onPaymentMethod: (pmId) => Promise<void>
 */
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
  if (!open) return null;

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

          <Elements stripe={getStripe()}>
            <CardPaymentForm
              onPaymentMethod={onPaymentMethod}
              submitting={submitting}
              submitLabel={submitLabel || `Pay $${amount?.toFixed(2) ?? ""}`}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;