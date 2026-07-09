// src/components/admin/RecipientPicker.jsx
import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import api from "../../services/api";

/**
 * Reusable recipient picker.
 * Reports selection upward via onChange({ audience, selectAll, userIds, excludedUserIds, externalEmails })
 */
export default function RecipientPicker({ allowExternal = true, onChange }) {
  const [audience, setAudience] = useState("provider");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [excludedIds, setExcludedIds] = useState(new Set());
  const [externalEmails, setExternalEmails] = useState("");

  const isExternal = audience === "external";

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setSelectAll(false);
    setSelectedIds(new Set());
    setExcludedIds(new Set());
    setPage(1);
  }, [audience]);

  const roleParam = audience === "both" ? "all" : audience;

  useEffect(() => {
    if (isExternal) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users", {
          params: { minimal: 1, role: roleParam, search: debounced, page, per_page: 20 },
        });
        if (!active) return;
        const d = res.data || res;
        setUsers(d.items || []);
        setTotalPages(d.total_pages || 1);
        setTotal(d.total || 0);
      } catch {
        if (active) setUsers([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isExternal, roleParam, debounced, page]);

  useEffect(() => {
    onChange?.({
      audience,
      selectAll,
      userIds: [...selectedIds],
      excludedUserIds: [...excludedIds],
      externalEmails: externalEmails.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audience, selectAll, selectedIds, excludedIds, externalEmails]);

  const isChecked = (id) => (selectAll ? !excludedIds.has(id) : selectedIds.has(id));

  const toggleUser = (id) => {
    if (selectAll) {
      setExcludedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const selectedSummary = useMemo(() => {
    if (isExternal) return null;
    if (selectAll) return `All ${total} matching (minus ${excludedIds.size} excluded)`;
    return `${selectedIds.size} selected`;
  }, [isExternal, selectAll, total, excludedIds, selectedIds]);

  const audienceOptions = [
    { value: "provider", label: "Providers" },
    { value: "participant", label: "Participants" },
    { value: "both", label: "Both" },
    ...(allowExternal ? [{ value: "external", label: "External / custom emails" }] : []),
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          {audienceOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {isExternal ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            External emails (comma / newline separated)
          </label>
          <textarea
            rows={4}
            value={externalEmails}
            onChange={(e) => setExternalEmails(e.target.value)}
            placeholder="jane@example.com, john@example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-3 border-b border-slate-100 bg-slate-50">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or email"
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 whitespace-nowrap">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => {
                  setSelectAll(e.target.checked);
                  setSelectedIds(new Set());
                  setExcludedIds(new Set());
                }}
              />
              Select all matching
            </label>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-10">No users found.</p>
            ) : (
              users.map((u) => (
                <label key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" checked={isChecked(u.id)} onChange={() => toggleUser(u.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{u.name || "—"}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-purple-600 font-semibold">{u.role}</span>
                  <span className="text-xs text-slate-400">{u.joined_date}</span>
                </label>
              ))
            )}
          </div>

          <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50 text-sm">
            <span className="text-slate-600">{selectedSummary}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-slate-300 disabled:opacity-40">Prev</button>
              <span className="text-slate-500">{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-slate-300 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}