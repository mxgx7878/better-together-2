import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle } from '../../../components/Icons';
import { PageHeader, Card, InputField, Toggle, Button } from '../../../components/ui';
import toast from 'react-hot-toast';

const serviceCategories = [
  { id: 'ndis', label: 'NDIS Supports', subs: ['Core Supports', 'Capacity Building', 'Capital Supports', 'SIL / STA / MTA', 'Support Coordination', 'Therapy Services', 'Early Childhood', 'Community Participation', 'Employment Supports'] },
  { id: 'aged', label: 'Aged Care Supports', subs: ['Home Care Packages', 'CHSP', 'Residential Aged Care', 'Allied Health for Older Adults', 'Dementia & Palliative Care'] },
  { id: 'health', label: 'Health & Medical', subs: ['GP & Specialist Clinics', 'Allied Health', 'Mental Health Services', 'Counselling & Psychology', 'Rehabilitation'] },
  { id: 'education', label: 'Education & Early Learning', subs: ['School Inclusion', 'Learning Support & Tutoring', 'Early Childhood Intervention', 'University/TAFE Support'] },
  { id: 'mental', label: 'Mental Health & Wellbeing', subs: ['Counselling & Psychology', 'Peer Support', 'AOD Services', 'Crisis & Suicide Prevention', 'Psychosocial Programs'] },
  { id: 'tac', label: 'TAC, WorkSafe & Injury', subs: ['TAC-funded Services', 'WorkSafe Rehabilitation', 'Return-to-work Programs', 'Injury Management'] },
  { id: 'equipment', label: 'Equipment & Technology', subs: ['Assistive Technology', 'Home Modifications', 'Vehicle Modifications', 'Mobility & Seating', 'Communication Devices'] },
  { id: 'business', label: 'Business & Professional', subs: ['Accounting & Bookkeeping', 'Legal Services', 'HR & Compliance', 'Business Consulting', 'Marketing & Branding'] },
  { id: 'community', label: 'Community & Inclusion', subs: ['First Nations-led Services', 'LGBTQIA+ Inclusive', 'CALD Community Supports', 'Advocacy & Rights Education', 'Community Participation Programs'] },
];

const ProfilePage = () => {
  const { user, isProvider, isPaid } = useAuth();

  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '0412 345 678',
    location: user.location,
    organisation: user.organisation || '',
    bio: isProvider
      ? 'We are a trusted local provider dedicated to delivering high-quality, person-centred supports across Melbourne.'
      : 'I am looking for reliable support services to help me achieve my goals and live independently.',
    website: isProvider ? 'https://communitycaresolutions.com.au' : '',
    abn: isProvider ? '12 345 678 901' : '',
    registrationStatus: 'registered',
    serviceRadius: '25',
    selectedCategories: ['ndis'],
    selectedSubs: ['Core Supports', 'Support Coordination'],
    notifyEmail: true,
    notifyPush: true,
    notifySMS: false,
  });

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      toast.success('Profile saved successfully');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 800);
  };

  const toggleSub = (sub) => {
    setFormData(prev => ({
      ...prev,
      selectedSubs: prev.selectedSubs.includes(sub)
        ? prev.selectedSubs.filter(s => s !== sub)
        : [...prev.selectedSubs, sub],
    }));
  };

  const tabs = isProvider
    ? [
        { key: 'details', label: 'Business Details' },
        { key: 'services', label: 'Services & Categories' },
        { key: 'notifications', label: 'Notifications' },
        { key: 'team', label: 'Team Members' },
      ]
    : [
        { key: 'details', label: 'My Details' },
        { key: 'preferences', label: 'Support Preferences' },
        { key: 'notifications', label: 'Notifications' },
      ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Edit Profile" subtitle="Manage your account details and preferences">
        <Button onClick={handleSave} loading={saveStatus === 'saving'}>
          {saveStatus === 'saved' ? <><CheckCircle className="w-4 h-4 inline" /> Saved!</> : 'Save Changes'}
        </Button>
      </PageHeader>

      {/* Avatar & Completion */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500">{isProvider ? user.organisation : user.location}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${user.profileComplete}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{user.profileComplete}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[90px] sm:min-w-[120px] px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label={isProvider ? 'Contact Name' : 'Full Name'} value={formData.name} onChange={v => setFormData(p => ({ ...p, name: v }))} />
              <InputField label="Email" type="email" value={formData.email} onChange={v => setFormData(p => ({ ...p, email: v }))} />
              <InputField label="Phone" value={formData.phone} onChange={v => setFormData(p => ({ ...p, phone: v }))} />
              <InputField label="Location" value={formData.location} onChange={v => setFormData(p => ({ ...p, location: v }))} />
              {isProvider && (
                <>
                  <InputField label="Organisation Name" value={formData.organisation} onChange={v => setFormData(p => ({ ...p, organisation: v }))} />
                  <InputField label="ABN" value={formData.abn} onChange={v => setFormData(p => ({ ...p, abn: v }))} />
                  <InputField label="Website" value={formData.website} onChange={v => setFormData(p => ({ ...p, website: v }))} />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Status</label>
                    <select
                      value={formData.registrationStatus}
                      onChange={e => setFormData(p => ({ ...p, registrationStatus: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none bg-white"
                    >
                      <option value="registered">NDIS Registered</option>
                      <option value="unregistered">Not Registered</option>
                      <option value="pending">Registration Pending</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{isProvider ? 'About Your Organisation' : 'About Me'}</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none resize-none"
              />
            </div>
            {isProvider && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Radius</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.serviceRadius}
                    onChange={e => setFormData(p => ({ ...p, serviceRadius: e.target.value }))}
                    className="flex-1 accent-purple-600"
                  />
                  <span className="text-sm font-semibold text-slate-700 w-16 text-right">{formData.serviceRadius} km</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services Tab - Provider only */}
        {activeTab === 'services' && isProvider && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Select the service categories your organisation offers. These will be displayed on your profile and used for matching.</p>
            {serviceCategories.map(cat => (
              <div key={cat.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      cat.subs.some(s => formData.selectedSubs.includes(s))
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-slate-300'
                    }`}>
                      {cat.subs.some(s => formData.selectedSubs.includes(s)) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{cat.label}</span>
                    {cat.subs.filter(s => formData.selectedSubs.includes(s)).length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        {cat.subs.filter(s => formData.selectedSubs.includes(s)).length}
                      </span>
                    )}
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedCategory === cat.id && (
                  <div className="px-5 pb-4 grid sm:grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    {cat.subs.map(sub => (
                      <label key={sub} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.selectedSubs.includes(sub)}
                          onChange={() => toggleSub(sub)}
                          className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-slate-700">{sub}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Support Preferences - Participant only */}
        {activeTab === 'preferences' && !isProvider && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">Tell us what kind of support you're looking for. This helps providers understand your needs.</p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What types of support are you looking for?</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {['Daily Living Support', 'Therapy (OT, Speech, Physio)', 'Support Coordination', 'Community Participation', 'Employment Support', 'Personal Care', 'Transport', 'Home Modifications', 'Mental Health Support', 'Peer Support'].map(item => (
                  <label key={item} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred provider distance</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none bg-white">
                <option>Within 10 km</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Any distance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Accessibility requirements</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {['Wheelchair accessible', 'Auslan / sign language', 'Easy read materials', 'Home visits available', 'Telehealth / online', 'CALD language support'].map(item => (
                  <label key={item} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Choose how you'd like to be notified about activity on the platform.</p>
            <Toggle label="Email notifications" description="Receive updates, referrals, and event reminders via email" checked={formData.notifyEmail} onChange={v => setFormData(p => ({ ...p, notifyEmail: v }))} />
            <Toggle label="Push notifications" description="Get real-time alerts in your browser" checked={formData.notifyPush} onChange={v => setFormData(p => ({ ...p, notifyPush: v }))} />
            <Toggle label="SMS notifications" description="Receive important alerts via text message" checked={formData.notifySMS} onChange={v => setFormData(p => ({ ...p, notifySMS: v }))} />
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Notify me about:</h3>
              <div className="space-y-3">
                {(isProvider
                  ? ['New service requests', 'Event reminders', 'Q&A replies', 'Directory messages', 'Platform updates']
                  : ['New providers in my area', 'Event reminders', 'Message board replies', 'Plan Buddy messages', 'Platform updates']
                ).map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Tab - Provider only */}
        {activeTab === 'team' && isProvider && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Add up to 4 team members to access the platform under your organisation.</p>
                <p className="text-xs text-slate-400 mt-1">Team members get access to the free tier features.</p>
              </div>
              <Button size="sm">+ Add Member</Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Maria Rodriguez', email: 'maria@communitycare.com.au', role: 'Support Coordinator', status: 'active' },
                { name: 'Tom Nguyen', email: 'tom@communitycare.com.au', role: 'Therapist', status: 'active' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email} · {member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium capitalize">{member.status}</span>
                    <button className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-center py-4">
                <p className="text-xs text-slate-400">2 of 4 team member slots used</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
