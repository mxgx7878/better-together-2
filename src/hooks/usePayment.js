import { useState } from "react";

/**
 * usePayment — payment flow state without UI.
 *
 *   const { config, submitting, pay, close, handlePaymentMethod } = usePayment();
 *
 *   <button onClick={() => pay({
 *     title: "Upgrade to Growth",
 *     amount: 29,
 *     onPay: async (paymentMethodId) => {
 *       await dispatch(changePlan({ plan_id: 5, payment_method_id: paymentMethodId })).unwrap();
 *     },
 *   })}>Pay $29</button>
 *
 *   <PaymentModal
 *     open={!!config}
 *     onClose={close}
 *     title={config?.title}
 *     subtitle={config?.subtitle}
 *     amount={config?.amount}
 *     submitting={submitting}
 *     submitLabel={config?.submitLabel}
 *     onPaymentMethod={handlePaymentMethod}
 *   />
 */
const usePayment = () => {
  const [config, setConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pay = (cfg) => setConfig(cfg);

  const close = () => {
    if (!submitting) setConfig(null);
  };

  const handlePaymentMethod = async (paymentMethodId) => {
    if (!config?.onPay) return;
    setSubmitting(true);
    try {
      await config.onPay(paymentMethodId);
      setConfig(null); // success → close
    } catch {
      // error toasted upstream; keep modal open for retry
    } finally {
      setSubmitting(false);
    }
  };

  return { config, submitting, pay, close, handlePaymentMethod };
};

export default usePayment;