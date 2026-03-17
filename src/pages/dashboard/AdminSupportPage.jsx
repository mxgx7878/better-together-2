import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const faqItems = [
  { q: 'How do I update my profile information?', a: 'Navigate to your Profile page from the sidebar or top bar. You can edit your details, services, and notification preferences there.' },
  { q: 'How do I upgrade my subscription?', a: 'Go to Update Subscription in the sidebar. You can compare plans and upgrade instantly. Changes take effect immediately.' },
  { q: 'I cant see some features — why?', a: 'Some features are only available on paid plans. Check the Upgrade page to see whats included in each tier.' },
  { q: 'How do I add team members?', a: 'Paid provider accounts can add up to 4 team members. Go to Profile → Team Members to invite them.' },
  { q: 'How do I report an issue with a provider or participant?', a: 'Use the contact form below or email us directly. All reports are handled confidentially by our admin team.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Update Subscription → Manage Billing → Cancel Plan. Your access continues until the end of your billing period.' },
];

const AdminSupportPage = () => {
  const { user, isProvider } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactType, setContactType] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Connect with Admin</h1>
        <p className="text-sm text-slate-500 mt-1">Get help, report issues, or give feedback to the Better Together team</p>
      </div>

      {/* Admin Team Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">SD</div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Sue Dymond</h3>
            <p className="text-sm text-slate-500">Co-founder & Team Leader</p>
            <p className="text-xs text-purple-600 mt-1">Lived experience leadership</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">KB</div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Karen Burgess</h3>
            <p className="text-sm text-slate-500">Co-founder & Team Leader</p>
            <p className="text-xs text-purple-600 mt-1">Community & provider relations</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-800 pr-4">{item.q}</span>
                <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Send Us a Message</h2>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h3 className="text-lg font-semibold text-slate-800">Message Sent!</h3>
            <p className="text-sm text-slate-500 mt-1">Our team will get back to you within 1-2 business days.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">What can we help with?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'general', label: 'General Enquiry' },
                  { key: 'technical', label: 'Technical Issue' },
                  { key: 'billing', label: 'Billing Question' },
                  { key: 'feedback', label: 'Feedback' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setContactType(t.key)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      contactType === t.key ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-purple-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" defaultValue={user.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input type="text" placeholder="Brief description of your enquiry" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea rows={4} placeholder="Tell us how we can help..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 resize-none" />
            </div>
            <button onClick={handleSubmit} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all">
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;