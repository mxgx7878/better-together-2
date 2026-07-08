import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HeartHandshake,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Users,
  Inbox,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  adminFetchBuddies,
  adminCreateBuddy,
  adminUpdateBuddy,
  adminDeleteBuddy,
  adminFetchBuddyAssignments,
  adminAssignBuddy,
} from "../../store/actions/buddyActions";
import { ASYNC_STATUS } from "../../constants";
import FileUploadPreview from "../../components/common/FileUploadPreview";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  specialties: "",
  location: "",
  avatar: "",
  is_active: true,
};

const ManageBuddiesPage = () => {
  const dispatch = useDispatch();
  const {
    buddies,
    status,
    saveStatus,
    assignments,
    pendingCount,
    assignmentsStatus,
    assignStatus,
  } = useSelector((s) => s.buddy);

  const loading = status === ASYNC_STATUS.LOADING;
  const saving = saveStatus === ASYNC_STATUS.LOADING;
  const assigning = assignStatus === ASYNC_STATUS.LOADING;

  const [tab, setTab] = useState("requests"); // requests | buddies
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // per-row selected buddy for assignment
  const [assignChoice, setAssignChoice] = useState({});

  useEffect(() => {
    dispatch(adminFetchBuddies());
    dispatch(adminFetchBuddyAssignments());
  }, [dispatch]);

  // ── Buddy CRUD ──
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (b) => {
    setEditTarget(b);
    setForm({
      name: b.name || "",
      email: b.email || "",
      phone: b.phone || "",
      bio: b.bio || "",
      specialties: b.specialties || "",
      location: b.location || "",
      avatar: b.avatar || "",
      is_active: b.is_active !== false,
    });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const res = editTarget
      ? await dispatch(adminUpdateBuddy({ id: editTarget.id, payload: form }))
      : await dispatch(adminCreateBuddy(form));
    if (!res.error) closeModal();
  };
  const handleDelete = (b) => {
    if (window.confirm(`Delete "${b.name}"?`)) dispatch(adminDeleteBuddy(b.id));
  };

  // ── Assign ──
  const handleAssign = async (assignment) => {
    const buddyId = assignChoice[assignment.id];
    if (!buddyId) return;
    await dispatch(
      adminAssignBuddy({ id: assignment.id, buddy_id: Number(buddyId) }),
    );
    setEditingId(null);
    dispatch(adminFetchBuddyAssignments());
  };

   const startEditAssignment = (a) => {
    setEditingId(a.id);
    // Pre-select the currently assigned buddy in the dropdown.
    setAssignChoice((p) => ({ ...p, [a.id]: String(a.buddy?.id || "") }));
  };

  const activeBuddies = buddies.filter((b) => b.is_active !== false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Manage Buddies"
        description="Create Buddy profiles and assign them to participants who purchased a buddy subscription."
        icon={HeartHandshake}
        actions={
          tab === "buddies" && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
            >
              <Plus className="w-4 h-4" /> Add Buddy
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "requests"
              ? "bg-purple-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Inbox className="w-4 h-4" /> Requests
          {pendingCount > 0 && (
            <span className="ml-1 text-[11px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("buddies")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "buddies"
              ? "bg-purple-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" /> Buddies
        </button>
      </div>

      {/* ── REQUESTS TAB ── */}
      {tab === "requests" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {assignmentsStatus === ASYNC_STATUS.LOADING && assignments.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No buddy requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 border rounded-xl ${
                    a.status === "pending"
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">
                          {a.user?.name || "Unknown participant"}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            a.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {a.status === "pending" ? "Awaiting buddy" : "Assigned"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {a.user?.email}
                      </p>
                      {a.buddy && (
                        <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Buddy: {a.buddy.name}
                        </p>
                      )}
                    </div>

                    {a.status === "pending" || editingId === a.id ?
                     (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={assignChoice[a.id] || ""}
                          onChange={(e) =>
                            setAssignChoice((p) => ({ ...p, [a.id]: e.target.value }))
                          }
                          className="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none bg-white min-w-[160px]"
                        >
                          <option value="">Select a buddy…</option>
                          {activeBuddies.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(a)}
                          disabled={assigning || !assignChoice[a.id]}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                        >
                          {assigning && <Loader2 className="w-4 h-4 animate-spin" />}
                          Assign
                        </button>
                          {editingId === a.id && a.status !== "pending" && (
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ): (<button
                        onClick={() => startEditAssignment(a)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors flex-shrink-0"
                      >
                        <Pencil className="w-4 h-4" /> Change buddy
                      </button>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BUDDIES TAB ── */}
      {tab === "buddies" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {loading && buddies.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : buddies.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No buddies yet. Click “Add Buddy” to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {buddies.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800">
                      {b.name}
                      {b.is_active === false && (
                        <span className="ml-2 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {b.email}
                      </span>
                      {b.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {b.phone}
                        </span>
                      )}
                      {b.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {b.location}
                        </span>
                      )}
                    </div>
                    {b.specialties && (
                      <p className="text-xs text-slate-400 mt-1">{b.specialties}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buddy modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-800">
                {editTarget ? "Edit Buddy" : "Add Buddy"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {[
                { key: "name", label: "Name", ph: "e.g. Karen Burgess" },
                { key: "email", label: "Email", ph: "karen@bettertogether.com.au" },
                { key: "phone", label: "Phone (optional)", ph: "0400 123 456" },
                { key: "location", label: "Location (optional)", ph: "e.g. Melbourne, VIC" },
                { key: "specialties", label: "Specialties (optional)", ph: "Plan reviews, advocacy" },
                // { key: "avatar", label: "Avatar URL (optional)", ph: "https://…" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.ph}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              ))}

              <FileUploadPreview
          label="avatar (optional)"
          value={form.avatar}
          onChange={(url) => setForm((prev) => ({ ...prev, avatar: url }))}
          accept="image/*"
          folder="buddies/avatars"
          // maxSizeMb={2}
          placeholder="Click to upload a buddy avatar"
        />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bio (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Short background about this buddy…"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
                Active (available for assignment)
              </label>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Save Changes" : "Add Buddy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBuddiesPage;