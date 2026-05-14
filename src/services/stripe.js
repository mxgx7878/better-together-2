import { loadStripe } from "@stripe/stripe-js";

// Stripe ko sirf ek martaba load karenge — singleton promise
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = "pk_test_51P6NSDLLTNpiEfk0DufGtVPitSzXpKTlHHFjvVzDWy0B5dKC4KKPPsb9puSjEq8PGiIyXj5j32SQQDMpRgelTJWH00H0t1ley0";
    if (!key) {
      // eslint-disable-next-line no-console
      console.warn("VITE_STRIPE_PUBLIC_KEY missing in .env");
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};