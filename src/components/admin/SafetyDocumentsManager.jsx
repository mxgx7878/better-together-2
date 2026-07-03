import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  adminFetchSafetyDocuments,
  adminCreateSafetyDocument,
  adminUpdateSafetyDocument,
  adminDeleteSafetyDocument,
} from "../../store/actions/safetyNumberActions";
import { ASYNC_STATUS } from "../../constants";
import { resolveFileUrl } from "../../services/documentService";

const emptyForm = { title: "", description: "", sort_order: 0, is_active: true };

const formatSize = (bytes) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const SafetyDocumentsManager = () => {
  const dispatch = useDispatch();
  const { documents, docStatus, docSaveStatus } = useSelector(
    (s) => s.safetyNumber,
  );
  const loading = docStatus === ASYNC_STATUS.LOADING;
  const saving = docSaveStatus === ASYNC_STATUS.LOADING;

  const fileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(adminFetchSafetyDocuments());
  }, [dispatch]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, sort_order: documents.length });
    setFile(null);
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditTarget(d);
    setForm({
      title: d.title || "",
      description: d.description || "",
      sort_order: d.sort_order ?? 0,
      is_active: d.is_active !== false,
    });
    setFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
    setFile(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (!editTarget && !file) return; // file required on create

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("sort_order", String(Number(form.sort_order) || 0));
    fd.append("is_active", form.is_active ? "1" : "0");
    if (file) fd.append("file", file);

    const res = editTarget
      ? await dispatch(
          adminUpdateSafetyDocument({ id: editTarget.id, formData: fd }),
        )
      : await dispatch(adminCreateSafetyDocument(fd));

    if (!res.error) closeModal();
  };

  const handleDelete = (d) => {
    if (window.confirm(`Delete "${d.title}"?`)) {
      dispatch(adminDeleteSafetyDocument(d.id));
    }
  };

  const toggleActive = (d) => {
    const fd = new FormData();
    fd.append("is_active", d.is_active ? "0" : "1");
    dispatch(adminUpdateSafetyDocument({ id: d.id, formData: fd }));
  };

  const download = (d) => {
    const href = resolveFileUrl(d.file_url);
    if (!href) return;
    const a = document.createElement("a");
    a.href = href;
    a.download = d.original_filename || d.title || "document";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Safety Documents
          </h2>
          <p className="text-sm text-slate-500">
            Uploaded files shown to participants on the Rights &amp; Safety page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {loading && documents.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          No documents yet. Click “Add Document” to upload one.
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    {d.title}
                    {!d.is_active && (
                      <span className="ml-2 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </h4>
                  {d.description && (
                    <p className="text-xs text-slate-500 truncate">
                      {d.description}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    {d.original_filename} {d.size_bytes ? `· ${formatSize(d.size_bytes)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => download(d)}
                  title="Download"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleActive(d)}
                  title={d.is_active ? "Hide" : "Show"}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  {d.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(d)}
                  title="Edit"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(d)}
                  title="Delete"
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editTarget ? "Edit Document" : "Add Document"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* File */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  File{" "}
                  {editTarget && (
                    <span className="text-xs text-slate-400">
                      (optional — leave blank to keep current)
                    </span>
                  )}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl p-5 text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {file
                      ? `${file.name} (${formatSize(file.size)})`
                      : editTarget
                        ? "Click to replace the current file"
                        : "Click to choose a file (PDF, DOC, XLSX, Image)"}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. NDIS Rights & Safeguards Handbook"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Description */}
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
                  placeholder="Short summary of the document"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Sort + Active */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
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
                <label className="flex items-center gap-2 mt-6 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-4 h-4 accent-purple-600"
                  />
                  Active (visible to users)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
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
                {editTarget ? "Save Changes" : "Add Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyDocumentsManager;