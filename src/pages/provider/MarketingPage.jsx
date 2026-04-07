import { useState, useMemo } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  Megaphone,
  Calendar,
  Search,
  Star,
  Sparkles,
  Target,
  BarChart3,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
  Globe,
  Users,
  CreditCard,
  Award,
  Shield,
  Rocket,
  Crown,
} from '../../components/Icons';
import { Card, PageHeader, Button, Badge } from '../../components/ui';

// ─── Helpers ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Build the next 6 bookable months starting from the current month */
const getBookableMonths = () => {
  const now = new Date();
  const current = now.getMonth();
  const day = now.getDate();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const idx = (current + i) % 12;
    const year = CURRENT_YEAR + (current + i >= 12 ? 1 : 0);
    const spotsLeft = i === 0 ? 2 : i === 1 ? 5 : i === 2 ? 8 : 10;
    const deadlinePassed = i === 0 && day > 25;
    months.push({
      name: MONTHS[idx],
      year,
      spotsLeft,
      key: `${MONTHS[idx]}-${year}`,
      deadlinePassed,
    });
  }
  return months;
};

const BOOKABLE_MONTHS = getBookableMonths();

// ─── Package data ───────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: 'directory',
    title: 'Boosted Directory Listing',
    price: 200,
    icon: Search,
    color: 'purple',
    description:
      'Appear at the top of search results when participants look for services in your area and category.',
    features: [
      'Priority placement in search results',
      'Highlighted listing with "Featured" badge',
      'Boosted visibility in category pages',
      'Enhanced profile display with logo',
    ],
  },
  {
    id: 'events',
    title: 'Sponsored Event Placement',
    price: 350,
    icon: Calendar,
    color: 'pink',
    description:
      'Add your branding to events, webinars, and expos. Get prominent logo placement and attendee exposure.',
    features: [
      'Logo on event pages & email invites',
      'Speaking or sponsor slot at webinars',
      'Expo booth placement priority',
      'Attendee list access post-event',
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising Package',
    price: 600,
    icon: Megaphone,
    color: 'purple',
    popular: true,
    description:
      'Full-service advertising with banner ads, spotlight features, and targeted campaigns across the portal.',
    features: [
      'Dashboard ribbon banner ad',
      'Spotlight feature on homepage',
      'Targeted campaigns by region & category',
      'Dedicated account support',
    ],
  },
];

// ─── Analytics mock data ────────────────────────────────────────────────────

const ANALYTICS = {
  current: { views: 3842, clicks: 247, referrals: 34, ctr: '6.4%' },
  previous: { views: 2910, clicks: 198, referrals: 21, ctr: '6.8%' },
};

const WEEKLY_DATA = [
  { week: 'Week 1', views: 820, clicks: 52 },
  { week: 'Week 2', views: 1040, clicks: 71 },
  { week: 'Week 3', views: 960, clicks: 63 },
  { week: 'Week 4', views: 1022, clicks: 61 },
];

const ACTIVE_CAMPAIGNS = [
  { name: 'Boosted Directory Listing', status: 'active', months: 'Apr-May 2026', impressions: 1240 },
  { name: 'Sponsored Webinar', status: 'active', months: 'Apr 2026', impressions: 580 },
  { name: 'Banner Ad - Homepage', status: 'scheduled', months: 'May 2026', impressions: 0 },
];

// ─── Free-user upgrade prompt ───────────────────────────────────────────────

const UpgradePrompt = () => (
  <div className="max-w-2xl mx-auto text-center py-16 px-4">
    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Megaphone className="w-9 h-9 text-purple-600" />
    </div>
    <h1 className="text-2xl font-bold text-slate-800 mb-3">Promote Your Services</h1>
    <p className="text-slate-600 mb-3 max-w-md mx-auto">
      Upgrade to a paid plan to unlock marketing tools, boosted listings, sponsored event
      placements, and advertising packages.
    </p>
    <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm text-slate-500">
      <span className="flex items-center gap-1.5">
        <Search className="w-4 h-4 text-purple-500" /> Boosted Listings
      </span>
      <span className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-pink-500" /> Sponsored Events
      </span>
      <span className="flex items-center gap-1.5">
        <Megaphone className="w-4 h-4 text-purple-500" /> Advertising
      </span>
      <span className="flex items-center gap-1.5">
        <BarChart3 className="w-4 h-4 text-pink-500" /> Analytics
      </span>
    </div>

    {/* Feature preview cards */}
    <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
      {[
        {
          icon: Search,
          title: 'Boosted Directory Listings',
          desc: 'Appear at the top of search results',
          color: 'purple',
        },
        {
          icon: Calendar,
          title: 'Sponsored Events',
          desc: 'Add branding to events & webinars',
          color: 'pink',
        },
        {
          icon: Megaphone,
          title: 'Advertising Packages',
          desc: 'Banner ads & targeted campaigns',
          color: 'purple',
        },
        {
          icon: BarChart3,
          title: 'Engagement Analytics',
          desc: 'Track views, clicks & referrals',
          color: 'pink',
        },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                item.color === 'pink' ? 'bg-pink-100' : 'bg-purple-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  item.color === 'pink' ? 'text-pink-600' : 'text-purple-600'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>

    <a
      href="/dashboard/upgrade"
      className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
    >
      Upgrade Now <ArrowRight className="w-4 h-4" />
    </a>
  </div>
);

// ─── Package card ───────────────────────────────────────────────────────────

const PackageCard = ({ pkg, selected, onSelect }) => {
  const Icon = pkg.icon;
  const isSelected = selected === pkg.id;
  const borderColor = isSelected
    ? 'border-purple-400 ring-2 ring-purple-100'
    : 'border-slate-100';

  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`relative bg-white rounded-2xl shadow-sm border ${borderColor} p-5 cursor-pointer transition-all hover:shadow-md`}
    >
      {pkg.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <Badge color="purple">Most Popular</Badge>
        </div>
      )}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
          pkg.color === 'pink' ? 'bg-pink-100' : 'bg-purple-100'
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            pkg.color === 'pink' ? 'text-pink-600' : 'text-purple-600'
          }`}
        />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{pkg.title}</h3>
      <p className="text-sm text-slate-500 mb-3">{pkg.description}</p>
      <ul className="space-y-1.5 mb-4">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-slate-800">
          ${pkg.price}
          <span className="text-xs font-normal text-slate-400">/mo</span>
        </p>
        {isSelected && <Badge color="purple">Selected</Badge>}
      </div>
    </div>
  );
};

// ─── Month selector (multi-select) ─────────────────────────────────────────

const MonthSelector = ({ selectedMonths, onToggle }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-slate-700">Select Month(s)</h3>
      <p className="text-xs text-slate-400 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> Payment deadline: 25th of prior month
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {BOOKABLE_MONTHS.map((m) => {
        const active = selectedMonths.includes(m.key);
        return (
          <button
            key={m.key}
            onClick={() => !m.deadlinePassed && onToggle(m.key)}
            disabled={m.deadlinePassed}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              m.deadlinePassed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : active
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-purple-50'
            }`}
          >
            <span className="block">{m.name}</span>
            <span className="block text-[10px] mt-0.5 opacity-80">
              {m.deadlinePassed
                ? 'Deadline passed'
                : m.spotsLeft <= 3
                  ? `${m.spotsLeft} spots left`
                  : `${m.spotsLeft} spots`}
            </span>
          </button>
        );
      })}
    </div>
    {selectedMonths.length > 1 && (
      <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" />
        Multi-month billing: you will be charged for {selectedMonths.length} months at booking.
      </p>
    )}
  </div>
);

// ─── Active campaigns table ────────────────────────────────────────────────

const ActiveCampaigns = () => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold text-slate-700">Your Active Campaigns</h4>
      <Badge color="purple">{ACTIVE_CAMPAIGNS.filter((c) => c.status === 'active').length} live</Badge>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
            <th className="pb-2 font-medium">Campaign</th>
            <th className="pb-2 font-medium">Period</th>
            <th className="pb-2 font-medium">Impressions</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {ACTIVE_CAMPAIGNS.map((c) => (
            <tr key={c.name} className="border-b border-slate-50">
              <td className="py-2.5 text-slate-700 font-medium">{c.name}</td>
              <td className="py-2.5 text-slate-600">{c.months}</td>
              <td className="py-2.5 text-slate-600">
                {c.impressions > 0 ? c.impressions.toLocaleString() : '--'}
              </td>
              <td className="py-2.5">
                <Badge color={c.status === 'active' ? 'green' : 'yellow'}>
                  {c.status === 'active' ? 'Active' : 'Scheduled'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Analytics section ──────────────────────────────────────────────────────

const AnalyticsSection = () => {
  const kpiItems = useMemo(
    () => [
      {
        label: 'Views',
        value: ANALYTICS.current.views.toLocaleString(),
        prev: ANALYTICS.previous.views,
        current: ANALYTICS.current.views,
        icon: Eye,
        bg: 'bg-purple-50',
        color: 'text-purple-700',
        sub: 'text-purple-600',
      },
      {
        label: 'Clicks',
        value: ANALYTICS.current.clicks.toLocaleString(),
        prev: ANALYTICS.previous.clicks,
        current: ANALYTICS.current.clicks,
        icon: Target,
        bg: 'bg-pink-50',
        color: 'text-pink-700',
        sub: 'text-pink-600',
      },
      {
        label: 'Referrals',
        value: ANALYTICS.current.referrals.toString(),
        prev: ANALYTICS.previous.referrals,
        current: ANALYTICS.current.referrals,
        icon: Users,
        bg: 'bg-emerald-50',
        color: 'text-emerald-700',
        sub: 'text-emerald-600',
      },
      {
        label: 'Click Rate',
        value: ANALYTICS.current.ctr,
        prev: null,
        current: null,
        icon: TrendingUp,
        bg: 'bg-amber-50',
        color: 'text-amber-700',
        sub: 'text-amber-600',
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Engagement Analytics</h3>
        <Badge color="green">Live</Badge>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.map((kpi) => {
          const Icon = kpi.icon;
          const growth =
            kpi.prev != null
              ? Math.round(((kpi.current - kpi.prev) / kpi.prev) * 100)
              : null;
          return (
            <div key={kpi.label} className={`${kpi.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${kpi.sub}`} />
                {growth !== null && growth > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    +{growth}%
                  </span>
                )}
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className={`text-xs ${kpi.sub} mt-0.5`}>{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Weekly Breakdown (Current Month)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Period</th>
                <th className="pb-2 font-medium">Views</th>
                <th className="pb-2 font-medium">Clicks</th>
                <th className="pb-2 font-medium">CTR</th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY_DATA.map((w) => (
                <tr key={w.week} className="border-b border-slate-50">
                  <td className="py-2.5 text-slate-700 font-medium">{w.week}</td>
                  <td className="py-2.5 text-slate-600">{w.views.toLocaleString()}</td>
                  <td className="py-2.5 text-slate-600">{w.clicks}</td>
                  <td className="py-2.5 text-slate-600">
                    {((w.clicks / w.views) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual bar chart */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Views vs Clicks</h4>
        <div className="space-y-3">
          {WEEKLY_DATA.map((w) => {
            const viewsPct = Math.round((w.views / 1100) * 100);
            const clicksPct = Math.round((w.clicks / 80) * 100);
            return (
              <div key={w.week} className="space-y-1">
                <p className="text-xs text-slate-500">{w.week}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${viewsPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-12 text-right">
                    {w.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all"
                      style={{ width: `${clicksPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-12 text-right">{w.clicks}</span>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded" /> Views
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded" /> Clicks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────

const MarketingPage = () => {
  const { isPaid } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [message, setMessage] = useState('');
  const [targetRegions, setTargetRegions] = useState('');
  const [serviceTypes, setServiceTypes] = useState('');
  const [activeTab, setActiveTab] = useState('packages');

  const toggleMonth = (key) => {
    setSelectedMonths((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key],
    );
  };

  const activePkg = PACKAGES.find((p) => p.id === selectedPackage);
  const totalCost = activePkg ? activePkg.price * selectedMonths.length : 0;

  // ── Free users ──────────────────────────────────────────────────────────
  if (!isPaid) {
    return <UpgradePrompt />;
  }

  // ── Paid users ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Marketing & Visibility"
        subtitle="Promote your services and reach more participants"
      >
        <Badge color="purple">Paid Plan</Badge>
      </PageHeader>

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
            <Megaphone className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Promote Your Services</h2>
            <p className="text-purple-100 text-sm max-w-xl">
              Feature your organisation in high-traffic portal areas. Choose from boosted directory
              listings, sponsored event placements, or full advertising packages to maximise your
              visibility.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-purple-200">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" /> Portal-wide reach
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" /> Instant activation
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> Limited spots
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { key: 'packages', label: 'Advertising Packages', icon: Megaphone },
          { key: 'analytics', label: 'Engagement Analytics', icon: BarChart3 },
          { key: 'campaigns', label: 'Active Campaigns', icon: Rocket },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Advertising Packages tab ────────────────────────────────────── */}
      {activeTab === 'packages' && (
        <>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Advertising Packages</h2>
              <Badge color="purple">{PACKAGES.length} options</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedPackage}
                  onSelect={setSelectedPackage}
                />
              ))}
            </div>
          </div>

          {/* ── Booking section (shown when a package is selected) ──────── */}
          {selectedPackage && (
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Book Your Marketing Months
                </h3>
              </div>

              <div className="space-y-5">
                <MonthSelector selectedMonths={selectedMonths} onToggle={toggleMonth} />

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Spots are limited each month. Payment is due by the 25th of each month for the
                    following month.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your message (shown with your logo)
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder='e.g., "Local support workers — taking clients now"'
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Target regions
                      </label>
                      <input
                        type="text"
                        value={targetRegions}
                        onChange={(e) => setTargetRegions(e.target.value)}
                        placeholder="e.g., Melbourne CBD, Western Suburbs"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Service types
                      </label>
                      <input
                        type="text"
                        value={serviceTypes}
                        onChange={(e) => setServiceTypes(e.target.value)}
                        placeholder="e.g., Support work, Therapy"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking summary & CTA */}
                <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {activePkg?.title}
                      {selectedMonths.length > 0 && (
                        <span className="text-slate-400 ml-1">
                          x {selectedMonths.length} month
                          {selectedMonths.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                    {totalCost > 0 && (
                      <p className="text-2xl font-bold text-slate-800 mt-0.5">
                        ${totalCost.toLocaleString()}
                        <span className="text-sm font-normal text-slate-400 ml-1">total</span>
                      </p>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={selectedMonths.length === 0}
                    className="w-full sm:w-auto"
                  >
                    <CreditCard className="w-4 h-4" />
                    {selectedMonths.length === 0
                      ? 'Select at least one month'
                      : `Book & Pay $${totalCost.toLocaleString()}`}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── Engagement Analytics tab ────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <Card>
          <AnalyticsSection />
        </Card>
      )}

      {/* ── Active Campaigns tab ────────────────────────────────────────── */}
      {activeTab === 'campaigns' && (
        <Card>
          <ActiveCampaigns />
        </Card>
      )}

      {/* ── How It Works footer ─────────────────────────────────────────── */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How Monthly Booking Works</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: 'Choose a Package',
              desc: 'Pick the marketing option that fits your goals and budget.',
              icon: Star,
            },
            {
              step: '2',
              title: 'Select Months',
              desc: 'Spots are limited. Pick one or multiple months. Multi-month billing is available.',
              icon: Calendar,
            },
            {
              step: '3',
              title: 'Pay by the 25th',
              desc: 'Payment is due by the 25th of the month prior. Your placement goes live on the 1st.',
              icon: CreditCard,
            },
            {
              step: '4',
              title: 'Track Results',
              desc: 'Monitor views, clicks, and referrals in real time from your analytics dashboard.',
              icon: BarChart3,
            },
          ].map((item) => {
            const StepIcon = item.icon;
            return (
              <div key={item.step} className="relative bg-purple-50/60 rounded-xl p-4">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold rounded-lg flex items-center justify-center mb-2">
                  {item.step}
                </div>
                <h4 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <StepIcon className="w-3.5 h-3.5 text-purple-500" />
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Quick-reference rules ───────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Clock,
            title: 'Payment Deadline',
            desc: '25th of each month for the following month placement.',
            color: 'purple',
          },
          {
            icon: Award,
            title: 'Limited Spots',
            desc: 'Each month has a capped number of slots. Book early to secure yours.',
            color: 'pink',
          },
          {
            icon: Crown,
            title: 'Multi-Month Billing',
            desc: 'Select and pay for multiple months in a single transaction.',
            color: 'purple',
          },
        ].map((rule) => {
          const RuleIcon = rule.icon;
          return (
            <div
              key={rule.title}
              className={`rounded-xl p-4 ${
                rule.color === 'pink' ? 'bg-pink-50' : 'bg-purple-50'
              }`}
            >
              <RuleIcon
                className={`w-5 h-5 mb-2 ${
                  rule.color === 'pink' ? 'text-pink-600' : 'text-purple-600'
                }`}
              />
              <h4 className="text-sm font-semibold text-slate-800 mb-1">{rule.title}</h4>
              <p className="text-xs text-slate-500">{rule.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketingPage;
