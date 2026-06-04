import { loadStripe } from "@stripe/stripe-js";

// Stripe ko sirf ek martaba load karenge — singleton promise
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = "pk_live_51THHuH2miLtPrQ6CMn7n51p3K64xYw21jk0JTKXWtCXvhKuy7pxt79wyndLLsz6hXecw0Oe6WX49tRQ3AjNfisGf00V0PTCpB7";
    if (!key) {
      // eslint-disable-next-line no-console
      console.warn("VITE_STRIPE_PUBLIC_KEY missing in .env");
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};