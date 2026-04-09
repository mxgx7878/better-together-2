import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Megaphone, Calendar } from 'lucide-react';

const MarketingPage = () => {
  const { isPaid } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('march');
  const [selectedPackage, setSelectedPackage] = useState(null);

  if (!isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Megaphone className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Marketing & Visibility</h1>
        <p className="text-slate-600 mb-6">Upgrade to a paid plan to access marketing and advertising tools.</p>
        <a href="/provider/upgrade" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md">Upgrade Now</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Marketing & Visibility</h1>
        <p className="text-sm text-slate-500 mt-1">Boost your presence and reach more participants</p>
      </div>

      {/* Product Placement Package */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" /></div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-2">Product Placement — $600/month</h2>
          <p className="text-purple-100 text-sm mb-4">Get your logo and message on the Participant Dashboard scrolling ribbon, featured provider sections, and relevant search results for one full month.</p>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-sm font-semibold">Dashboard Ribbon</p>
              <p className="text-xs text-purple-200 mt-1">Logo + short message visible to all participants</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-sm font-semibold">Featured Placement</p>
              <p className="text-xs text-purple-200 mt-1">Highlighted in relevant search results</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-sm font-semibold">Targeting Options</p>
              <p className="text-xs text-purple-200 mt-1">Choose regions, service types, and demographics</p>
            </div>
          </div>
          <p className="text-xs text-purple-200 mb-4 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Booking deadline: 25th of each month · Spots limited · Must have a paid subscription</p>
        </div>
      </div>

      {/* Book a Month */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Book Your Marketing Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
          {['march', 'april', 'may', 'june', 'july', 'august'].map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                selectedMonth === month ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-purple-50'
              }`}
            >
              {month}
              <span className="block text-[10px] mt-0.5 opacity-70">
                {month === 'march' ? '3 spots left' : month === 'april' ? '7 spots left' : 'Available'}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your message (shown with your logo)</label>
            <input type="text" placeholder='e.g., "Local support workers — taking clients now"' className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Target regions</label>
              <input type="text" placeholder="e.g., Melbourne CBD, Western Suburbs" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Service types</label>
              <input type="text" placeholder="e.g., Support work, Therapy" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md transition-all hover:shadow-lg">
            Book {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} — $600
          </button>
        </div>
      </div>

      {/* Engagement Analytics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Engagement Analytics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-700">1,247</p>
            <p className="text-xs text-purple-600 mt-1">Impressions</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">89</p>
            <p className="text-xs text-blue-600 mt-1">Profile Clicks</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-700">12</p>
            <p className="text-xs text-emerald-600 mt-1">Enquiries</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-700">7.1%</p>
            <p className="text-xs text-amber-600 mt-1">Click Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
