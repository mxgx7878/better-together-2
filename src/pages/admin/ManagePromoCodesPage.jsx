// src/pages/admin/ManagePromoCodesPage.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import api from "../../services/api";

const empty = {
  code: "", description: "", discount_type: "fixed", discount_amount: "", expiry_date: "",
  usage_limit: "", applicability: "general", plan_ids: [], status: 1,
};

export default function ManagePromoCodesPage() {
  const [list, setList] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/promo-codes", { params: { per_page: 50 } });
      setList((res.data || res).items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const res = await api.get("/admin/subscriptions");
      const items = res.data || res.items || res;
      setPlans(Array.isArray(items) ? items : items.items || []);
    } catch { /* non-fatal */ }
  };

  useEffect(() => { load(); loadPlans(); }, []);

  const openCreate = () => setForm({ ...empty });
  const openEdit = (p) => setForm({
    id: p.id,
    code: p.code,
    description: p.description || "",
    discount_type: p.discount_type,
    discount_amount: p.discount_amount,
    expiry_date: p.expiry_date || "",
    usage_limit: p.usage_limit ?? "",
    applicability: p.applicability,
    plan_ids: (p.plans || []).map((pl) => pl.id),
    status: p.status,
  });

  const save = async () => {
    if (!form.code.trim() || !form.discount_amount) {
      toast.error("Code and discount amount are required.");
      return;
    }
    if (form.discount_type === "percent" && Number(form.discount_amount) > 100) {
      toast.error("Percentage discount cannot exceed 100.");
      return;
    }
    if (form.applicability === "specific" && form.plan_ids.length === 0) {
      toast.error("Select at least one subscription.");
      return;
    }
    const payload = {
      code: form.code,
      description: form.description || null,
      discount_type: form.discount_type,
      discount_amount: Number(form.discount_amount),
      expiry_date: form.expiry_date || null,
      usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
      applicability: form.applicability,
      plan_ids: form.applicability === "specific" ? form.plan_ids : [],
      status: form.status,
    };
    setSaving(true);
    try {
      if (form.id) await api.post(`/admin/promo-codes/${form.id}`, payload);
      else await api.post("/admin/promo-codes", payload);
      toast.success(form.id ? "Promo updated." : "Promo created.");
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this promo code?")) return;
    try {
      await api.del(`/admin/promo-codes/${id}`);
      toast.success("Deleted.");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Promo Codes</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage discount codes (AUD).</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> New code
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-purple-500 animate-spin" /></div>
        ) : list.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-16">No promo codes yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Applies to</th>
                <th className="px-5 py-3">Used / Limit</th>
                <th className="px-5 py-3">Expiry</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold text-slate-800">{p.code}</td>
                  <td className="px-5 py-3">
                    {p.discount_type === "percent" ? `${Number(p.discount_amount)}%` : `AUD ${Number(p.discount_amount).toFixed(2)}`}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {p.applicability === "general" ? "All subscriptions" : (p.plans || []).map((pl) => pl.name).join(", ")}
                  </td>
                  <td className="px-5 py-3">{p.times_redeemed} / {p.usage_limit ?? "∞"}</td>
                  <td className="px-5 py-3 text-slate-600">{p.expiry_date || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.status ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {p.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-500 hover:text-blue-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-1.5 text-slate-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {form && (
        <Modal title={form.id ? "Edit promo code" : "New promo code"} onClose={() => setForm(null)}>
          <div className="space-y-4">
            <Field label="Promo code name">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Discount type">
                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className={inputCls}>
                  <option value="fixed">Fixed (AUD)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </Field>
              <Field label={form.discount_type === "percent" ? "Discount (%)" : "Discount amount (AUD)"}>
                <input
                  type="number" step="0.01"
                  max={form.discount_type === "percent" ? 100 : undefined}
                  value={form.discount_amount}
                  onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry date">
                <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Usage limit (blank = unlimited)">
                <input type="number" min="1" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <Field label="Applicability">
              <div className="flex gap-4 text-sm">
                {["general", "specific"].map((a) => (
                  <label key={a} className="flex items-center gap-2">
                    <input type="radio" checked={form.applicability === a} onChange={() => setForm({ ...form, applicability: a })} />
                    {a === "general" ? "General (all subscriptions)" : "Subscription specific"}
                  </label>
                ))}
              </div>
            </Field>

            {form.applicability === "specific" && (
              <Field label="Subscriptions">
                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                  {plans.map((pl) => (
                    <label key={pl.id} className="flex items-center gap-2 text-sm py-1">
                      <input
                        type="checkbox"
                        checked={form.plan_ids.includes(pl.id)}
                        onChange={(e) => setForm({
                          ...form,
                          plan_ids: e.target.checked
                            ? [...form.plan_ids, pl.id]
                            : form.plan_ids.filter((x) => x !== pl.id),
                        })}
                      />
                      {pl.name}
                    </label>
                  ))}
                </div>
              </Field>
            )}

            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} className={inputCls}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setForm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}