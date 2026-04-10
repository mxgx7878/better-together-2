import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Briefcase,
  Heart,
  Loader2,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Loader';

// ─── Dummy data (will be replaced by API) ─────────────────────────
const allDummyUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@communitycare.com.au', role: 'provider', tier: 'paid', status: 'active', organisation: 'Community Care Solutions', location: 'Melbourne, VIC', joinedDate: '2024-11-15' },
  { id: 2, name: 'James Chen', email: 'james.chen@email.com', role: 'participant', tier: 'free', status: 'active', location: 'Sydney, NSW', joinedDate: '2025-01-10' },
  { id: 3, name: 'Emily Davis', email: 'emily@enablelife.com.au', role: 'provider', tier: 'free', status: 'active', organisation: 'EnableLife', location: 'Brisbane, QLD', joinedDate: '2024-09-20' },
  { id: 4, name: 'Michael Brown', email: 'michael.b@email.com', role: 'participant', tier: 'paid', status: 'inactive', location: 'Perth, WA', joinedDate: '2024-12-05' },
  { id: 5, name: 'Jessica Taylor', email: 'jessica@sunrisesupport.com', role: 'provider', tier: 'paid', status: 'active', organisation: 'Sunrise Support Services', location: 'Adelaide, SA', joinedDate: '2024-08-12' },
  { id: 6, name: 'David Wilson', email: 'david.w@email.com', role: 'participant', tier: 'free', status: 'active', location: 'Hobart, TAS', joinedDate: '2025-02-01' },
  { id: 7, name: 'Lisa Anderson', email: 'lisa@carepathndis.com.au', role: 'provider', tier: 'paid', status: 'active', organisation: 'CarePath NDIS', location: 'Melbourne, VIC', joinedDate: '2024-07-18' },
  { id: 8, name: 'Robert Garcia', email: 'robert.g@email.com', role: 'participant', tier: 'paid', status: 'active', location: 'Sydney, NSW', joinedDate: '2024-10-22' },
  { id: 9, name: 'Amanda White', email: 'amanda@alliedhealthhub.com', role: 'provider', tier: 'free', status: 'inactive', organisation: 'Allied Health Hub', location: 'Darwin, NT', joinedDate: '2024-06-30' },
  { id: 10, name: 'Chris Martin', email: 'chris.m@email.com', role: 'participant', tier: 'free', status: 'active', location: 'Canberra, ACT', joinedDate: '2025-03-15' },
  { id: 11, name: 'Karen Thompson', email: 'karen@brightfutures.com.au', role: 'provider', tier: 'paid', status: 'active', organisation: 'Bright Futures Care', location: 'Gold Coast, QLD', joinedDate: '2024-05-10' },
  { id: 12, name: 'Steven Lee', email: 'steven.lee@email.com', role: 'participant', tier: 'paid', status: 'active', location: 'Melbourne, VIC', joinedDate: '2025-01-28' },
  { id: 13, name: 'Rachel Kim', email: 'rachel@harmonycare.com.au', role: 'provider', tier: 'free', status: 'active', organisation: 'Harmony Support', location: 'Sydney, NSW', joinedDate: '2024-11-02' },
  { id: 14, name: 'Tom Harris', email: 'tom.harris@email.com', role: 'participant', tier: 'free', status: 'inactive', location: 'Brisbane, QLD', joinedDate: '2024-09-14' },
  { id: 15, name: 'Sophie Clark', email: 'sophie@abilityconnect.com', role: 'provider', tier: 'paid', status: 'active', organisation: 'Ability Connect', location: 'Perth, WA', joinedDate: '2024-04-22' },
  { id: 16, name: 'Nathan Young', email: 'nathan.y@email.com', role: 'participant', tier: 'paid', status: 'active', location: 'Adelaide, SA', joinedDate: '2025-02-18' },
  { id: 17, name: 'Michelle Scott', email: 'michelle@plancarepro.com', role: 'provider', tier: 'paid', status: 'active', organisation: 'PlanCare Pro', location: 'Melbourne, VIC', joinedDate: '2024-03-08' },
  { id: 18, name: 'Alex Turner', email: 'alex.t@email.com', role: 'participant', tier: 'free', status: 'active', location: 'Sydney, NSW', joinedDate: '2025-03-01' },
];

const ITEMS_PER_PAGE = 8;

const ROLE_TABS = [
  { key: 'all', label: 'All Users', icon: Users },
  { key: 'provider', label: 'Providers', icon: Briefcase },
  { key: 'participant', label: 'Participants', icon: Heart },
];

const STATUS_OPTIONS = [
  { key: 'all', label: 'All Status' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
];

const TIER_OPTIONS = [
  { key: 'all', label: 'All Plans' },
  { key: 'free', label: 'Free' },
  { key: 'paid', label: 'Paid' },
];

// ─── Simulated API call ─────────────────────────────────────────
// In production, this will be replaced with actual API call
// The API will receive: { search, role, status, tier, page, limit }
const fetchUsers = async ({ search, role, status, tier, page, limit }) => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...allDummyUsers];

  // Role filter
  if (role !== 'all') {
    filtered = filtered.filter((u) => u.role === role);
  }

  // Status filter
  if (status !== 'all') {
    filtered = filtered.filter((u) => u.status === status);
  }

  // Tier filter
  if (tier !== 'all') {
    filtered = filtered.filter((u) => u.tier === tier);
  }

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organisation && u.organisation.toLowerCase().includes(q)) ||
        u.location.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, totalPages, page };
};

// ─── Component ──────────────────────────────────────────────────
const ManageUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // This is the query that will go to the API
      const result = await fetchUsers({
        search: searchTerm,
        role: activeRole,
        status: statusFilter,
        tier: tierFilter,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setUsers(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeRole, statusFilter, tierFilter, currentPage]);

  // Fetch on filter/page change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Count per role (for tab badges) — in production, comes from API
  const roleCounts = {
    all: allDummyUsers.length,
    provider: allDummyUsers.filter((u) => u.role === 'provider').length,
    participant: allDummyUsers.filter((u) => u.role === 'participant').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Manage Users" description="View and manage all platform users" icon={Users} />

      {/* ─── Role Tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(setActiveRole)(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-[1px] ${
              activeRole === tab.key
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                activeRole === tab.key
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {roleCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ─── Search & Filters Row ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, organisation, location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none min-w-[130px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Tier filter */}
        <select
          value={tierFilter}
          onChange={(e) => handleFilterChange(setTierFilter)(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none min-w-[130px]"
        >
          {TIER_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Results count ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-slate-700">{totalCount}</span> users
            </>
          )}
        </p>
      </div>

      {/* ─── Table ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Plan
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Location
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {u.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.role === 'provider'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {u.role === 'provider' ? (
                          <Briefcase className="w-3 h-3" />
                        ) : (
                          <Heart className="w-3 h-3" />
                        )}
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.tier === 'paid'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.tier.charAt(0).toUpperCase() + u.tier.slice(1)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.status === 'active' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{u.location}</p>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-500">
                        {new Date(u.joinedDate).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                          title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Pagination ────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
