import { loadStripe } from "@stripe/stripe-js";

// Stripe ko sirf ek martaba load karenge — singleton promise
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    //const key = "pk_live_51THHuH2miLtPrQ6CMn7n51p3K64xYw21jk0JTKXWtCXvhKuy7pxt79wyndLLsz6hXecw0Oe6WX49tRQ3AjNfisGf00V0PTCpB7"
    const key = "pk_test_51TmxElLoy8os4su7frdJMmwOyr0lqf9tT3HPCh1VhEDoK6cHsSHRIBZ3qLayO0GxXtsUT6JssIJqZkLZhki0at1500y0EY8tyI";
    if (!key) {
      // eslint-disable-next-line no-console
      console.warn("VITE_STRIPE_PUBLIC_KEY missing in .env");
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};