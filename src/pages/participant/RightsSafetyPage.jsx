import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scale, Shield, Megaphone, Landmark, AlertCircle, Phone, FileText  } from 'lucide-react';
import { fetchSafetyNumbers } from '../../store/actions/safetyNumberActions';
import SafetyDocumentsList from "../../components/common/SafetyDocumentsList";
import { resolveFileUrl } from '../../services/documentService';

const sections = [
  {
    id: 'rights',
    title: 'Your NDIS Rights',
    icon: Scale,
    color: 'from-purple-500 to-indigo-600',
    items: [
      { title: 'Right to choose your providers', desc: 'You can choose who provides your supports, where and when.' },
      { title: 'Right to be treated with respect', desc: 'All providers must treat you with dignity and respect at all times.' },
      { title: 'Right to privacy and confidentiality', desc: 'Your personal information must be kept private and secure.' },
      { title: 'Right to be involved in decisions', desc: 'You have the right to be involved in all decisions about your supports.' },
      { title: 'Right to make a complaint', desc: 'You can complain if you are not happy with a service, without any negative consequences.' },
      { title: 'Right to access information', desc: 'You have the right to access your records and information about your plan.' },
    ],
  },
  {
    id: 'safety',
    title: 'Staying Safe',
    icon: Shield,
    color: 'from-emerald-500 to-teal-600',
    items: [
      { title: 'Recognising abuse and neglect', desc: 'Learn the signs of abuse, neglect, and exploitation so you can protect yourself.' },
      { title: 'What to do if you feel unsafe', desc: 'If you feel unsafe with a provider or support worker, you can change providers, speak to someone you trust, or contact the NDIS Commission.' },
      { title: 'Restrictive practices', desc: 'Restrictive practices must be authorised and are only used as a last resort to keep you safe.' },
      { title: 'Worker screening', desc: 'All NDIS workers should have completed a Worker Screening Check.' },
    ],
  },
  {
    id: 'complaints',
    title: 'Making a Complaint',
    icon: Megaphone,
    color: 'from-amber-500 to-orange-600',
    items: [
      { title: 'Step 1: Talk to your provider', desc: 'Try to resolve the issue directly with your provider first.' },
      { title: 'Step 2: Contact the NDIS Commission', desc: "If the issue isn't resolved, contact the NDIS Quality and Safeguards Commission on 1800 035 544." },
      { title: 'Step 3: Get advocacy support', desc: 'An advocate can help you make a complaint or speak on your behalf.' },
      { title: 'Step 4: Formal review', desc: 'If you disagree with an NDIS decision, you can request a formal internal review.' },
    ],
  },
  {
    id: 'appeals',
    title: 'Appeals & Reviews',
    icon: Landmark,
    color: 'from-blue-500 to-cyan-600',
    items: [
      { title: 'Internal review', desc: 'Request an internal review within 3 months of a decision. A different person will review your case.' },
      { title: 'External review (AAT)', desc: "If the internal review doesn't change the decision, you can apply to the Administrative Appeals Tribunal (AAT)." },
      { title: 'Getting legal help', desc: 'Legal Aid and disability advocacy organisations can provide free help with AAT appeals.' },
      { title: 'What to prepare', desc: 'Gather reports from providers, evidence of your needs, and a clear statement about why the decision should change.' },
    ],
  },
];

// Fallback shown only if the admin hasn't added any numbers yet (or the
// request fails) — keeps the page useful out of the box.
const FALLBACK_CONTACTS = [
  { id: 'f1', name: 'Emergency (Police / Fire / Ambulance)', phone: '000', description: 'If you are in immediate danger', is_emergency: true },
  { id: 'f2', name: 'NDIS Quality & Safeguards Commission', phone: '1800 035 544', description: 'For complaints about NDIS services', is_emergency: false },
  { id: 'f3', name: 'NDIA (National Disability Insurance Agency)', phone: '1800 800 110', description: 'For plan enquiries and reviews', is_emergency: false },
  { id: 'f4', name: 'Disability Advocacy Network Australia', phone: '(03) 9639 5807', description: 'Independent advocacy support', is_emergency: false },
  { id: 'f5', name: 'Lifeline', phone: '13 11 14', description: '24/7 crisis support', is_emergency: false },
  { id: 'f6', name: '1800RESPECT', phone: '1800 737 732', description: 'Family & sexual violence support', is_emergency: false },
];

const RightsSafetyPage = () => {
  const dispatch = useDispatch();
  const [expandedSection, setExpandedSection] = useState('rights');

  const { items } = useSelector((s) => s.safetyNumber);

  useEffect(() => {
    dispatch(fetchSafetyNumbers());
  }, [dispatch]);

  // Use admin-managed numbers when available, otherwise the built-in fallback.
  const contacts = useMemo(
    () => (items && items.length ? items : FALLBACK_CONTACTS),
    [items],
  );

  // The first emergency-flagged number drives the banner (e.g. 000 / NDIS).
  const emergencyContact = contacts.find((c) => c.is_emergency) || contacts[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Rights & Safety</h1>
        <p className="text-sm text-slate-500 mt-1">Know your rights, stay safe, and learn how to make complaints and appeals</p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-red-800">Need Immediate Help?</h3>
            <p className="text-sm text-red-700 mt-1">
              If you are in danger, call <strong>000</strong>.
              {emergencyContact && (
                <> For help, call <strong>{emergencyContact.name}</strong> on <strong>{emergencyContact.phone}</strong>.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(section => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <SectionIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-slate-800">{section.title}</h3>
                    <p className="text-xs text-slate-500">{section.items.length} topics</p>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === section.id && (
                <div className="px-6 pb-5 border-t border-slate-100">
                  <div className="space-y-3 pt-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-purple-600">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                          <p className="text-sm text-slate-600 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Important Contacts — admin managed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Important Contacts</h2>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                contact.is_emergency
                  ? 'border-red-200 bg-red-50/60 hover:bg-red-50'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div>
                <h4 className={`text-sm font-semibold ${contact.is_emergency ? 'text-red-800' : 'text-slate-800'}`}>
                  {contact.name}
                </h4>
                {contact.description && (
                  <p className="text-xs text-slate-500">{contact.description}</p>
                )}
              </div>
              <a
                href={`tel:${String(contact.phone).replace(/\s/g, '')}`}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex-shrink-0 ${
                  contact.is_emergency
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
              >
                <Phone className="w-4 h-4" />
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

   <SafetyDocumentsList />
    </div>
  );
};

export default RightsSafetyPage;