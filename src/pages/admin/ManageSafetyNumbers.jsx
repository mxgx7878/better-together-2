import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchSafetyNumbers,
  adminCreateSafetyNumber,
  adminUpdateSafetyNumber,
  adminDeleteSafetyNumber,
} from "../../store/actions/safetyNumberActions";
import SafetyDocumentsManager from "../../components/admin/SafetyDocumentsManager";
import { ASYNC_STATUS } from "../../constants";

const emptyForm = {
  name: "",
  phone: "",
  description: "",
  is_emergency: false,
  sort_order: 0,
  is_active: true,
};

const ManageSafetyNumbersPage = () => {
  const dispatch = useDispatch();
  const { items, status, saveStatus } = useSelector((s) => s.safetyNumber);
  const loading = status === ASYNC_STATUS.LOADING;
  const saving = saveStatus === ASYNC_STATUS.LOADING;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(adminFetchSafetyNumbers());
  }, [dispatch]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, sort_order: items.length });
    setModalOpen(true);
  };

  const openEdit = (n) => {
    setEditTarget(n);
    setForm({
      name: n.name || "",
      phone: n.phone || "",
      description: n.description || "",
      is_emergency: !!n.is_emergency,
      sort_order: n.sort_order ?? 0,
      is_active: n.is_active !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
    };
    const res = editTarget
      ? await dispatch(
          adminUpdateSafetyNumber({ id: editTarget.id, payload }),
        )
      : await dispatch(adminCreateSafetyNumber(payload));
    if (!res.error) closeModal();
  };

  const handleDelete = (n) => {
    if (window.confirm(`Delete "${n.name}"?`)) {
      dispatch(adminDeleteSafetyNumber(n.id));
    }
  };

  const toggleActive = (n) => {
    dispatch(
      adminUpdateSafetyNumber({
        id: n.id,
        payload: { is_active: !n.is_active },
      }),
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Safety Numbers"
        description="Manage the Important Contacts shown to participants on the Rights & Safety page."
      />

      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Number
        </button>
      </div>

      <SafetyDocumentsManager />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Phone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No safety numbers yet. Add the first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm ${
                n.is_emergency ? "border-red-200" : "border-slate-100"
              } ${!n.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.is_emergency
                      ? "bg-red-50 text-red-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {n.is_emergency ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {n.name}
                    </h4>
                    {n.is_emergency && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        EMERGENCY
                      </span>
                    )}
                    {!n.is_active && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-0.5">
                    {n.phone}
                  </p>
                  {n.description && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {n.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleActive(n)}
                  className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                  title={n.is_active ? "Hide from page" : "Show on page"}
                >
                  {n.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(n)}
                  className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(n)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                {editTarget ? "Edit Number" : "Add Number"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. NDIS Quality & Safeguards Commission"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 1800 035 544"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="e.g. For complaints about NDIS services"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sort order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_emergency}
                      onChange={(e) =>
                        setForm({ ...form, is_emergency: e.target.checked })
                      }
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    Emergency (top of list)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    Visible on page
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.phone.trim() || saving}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-xl inline-flex items-center justify-center gap-2 transition-all"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editTarget ? "Save Changes" : "Add Number"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSafetyNumbersPage;