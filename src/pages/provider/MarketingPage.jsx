import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { Megaphone, Calendar } from "lucide-react";
import usePayment from "../../hooks/usePayment";
import { purchaseMarketingAddon } from "../../store/actions/subscriptionActions";
import { checkAuth } from "../../store/actions/authActions";
import PaymentModal from "../../components/payments/PaymentModal";

const MONTHS = ["march", "april", "may", "june", "july", "august"];
const MONTH_PRICE = 600;

const MarketingPage = () => {
  const dispatch = useDispatch();
  const { isPaid } = useAuth();
  const { config, submitting, pay, close, handlePaymentMethod } = usePayment();
  const [selectedMonth, setSelectedMonth] = useState("march");
  const [message, setMessage] = useState("");
  const [regions, setRegions] = useState("");
  const [services, setServices] = useState("");

  if (!isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Megaphone className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Marketing & Visibility
        </h1>
        <p className="text-slate-600 mb-6">
          Upgrade to a paid plan to access marketing and advertising tools.
        </p>
        <a
          href="/provider/upgrade"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  const handleBook = () => {
    pay({
      title: `Book ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} — Marketing`,
      subtitle: "Featured Partners ribbon + boosted listing for 1 month",
      amount: MONTH_PRICE,
      submitLabel: `Pay $${MONTH_PRICE} & Book`,
      onPay: async (paymentMethodId) => {
        await dispatch(
          purchaseMarketingAddon({
            payment_method_id: paymentMethodId,
            month: selectedMonth,
            message,
            regions,
            services,
          }),
        ).unwrap();
        await dispatch(checkAuth());
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Marketing & Visibility
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Boost your presence and reach more participants
        </p>
      </div>

      {/* Product Placement Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-2">
            Product Placement — ${MONTH_PRICE}/month
          </h2>
          <p className="text-purple-100 text-sm mb-4">
            Get your logo and message on the Participant Dashboard scrolling
            ribbon, featured provider sections, and relevant search results for
            one full month.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {[
              {
                t: "Dashboard Ribbon",
                d: "Logo + short message visible to all participants",
              },
              {
                t: "Featured Placement",
                d: "Highlighted in relevant search results",
              },
              {
                t: "Targeting Options",
                d: "Choose regions, service types, and demographics",
              },
            ].map((b, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="text-sm font-semibold">{b.t}</p>
                <p className="text-xs text-purple-200 mt-1">{b.d}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-purple-200 mb-4 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Booking deadline: 25th of each
            month · Spots limited
          </p>
        </div>
      </div>

      {/* Book Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Book Your Marketing Month
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                selectedMonth === m
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-purple-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Your message (shown with your logo)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='e.g., "Local support workers — taking clients now"'
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Target regions
              </label>
              <input
                type="text"
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
                placeholder="e.g., Melbourne CBD, Western Suburbs"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Service types
              </label>
              <input
                type="text"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="e.g., Support work, Therapy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleBook}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            Book{" "}
            {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} — $
            {MONTH_PRICE}
          </button>
        </div>
      </div>

      <PaymentModal
        open={!!config}
        onClose={close}
        title={config?.title}
        subtitle={config?.subtitle}
        amount={config?.amount}
        submitting={submitting}
        submitLabel={config?.submitLabel}
        onPaymentMethod={handlePaymentMethod}
      />
    </div>
  );
};

export default MarketingPage;
