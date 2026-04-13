import { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Search,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Download,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  X,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import {
  DOCUMENT_CATEGORIES,
  detectType,
  formatFileSize,
  getDocuments,
  readFileAsDataUrl,
  saveDocuments,
} from '../../services/documentService';

const typeIconMap = {
  pdf: { Icon: FileText, color: 'text-red-500' },
  doc: { Icon: FolderOpen, color: 'text-blue-500' },
  img: { Icon: ImageIcon, color: 'text-emerald-500' },
};

const categoryColors = {
  'NDIS Resources': 'bg-purple-50 text-purple-700',
  'Guides': 'bg-blue-50 text-blue-700',
  'Policies': 'bg-emerald-50 text-emerald-700',
  'Forms': 'bg-amber-50 text-amber-700',
  'Announcements': 'bg-pink-50 text-pink-700',
  'Other': 'bg-slate-100 text-slate-600',
};

const emptyForm = {
  name: '',
  description: '',
  category: DOCUMENT_CATEGORIES[0],
  file: null,
  type: 'pdf',
  size: '',
  dataUrl: '',
};

const ManageDocumentsPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState(() => getDocuments());
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const persist = (next) => {
    setDocuments(next);
    saveDocuments(next);
  };

  const filteredDocuments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return documents.filter((d) => {
      const matchesSearch =
        !q ||
        d.name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, categoryFilter]);

  // ─── Modal handlers ─────────────────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      description: doc.description || '',
      category: doc.category || DOCUMENT_CATEGORIES[0],
      file: null,
      type: doc.type,
      size: doc.size,
      dataUrl: doc.dataUrl || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((prev) => ({
        ...prev,
        file,
        name: prev.name || file.name,
        type: detectType(file.name),
        size: formatFileSize(file.size),
        dataUrl,
      }));
    } catch {
      toast.error('Could not read the selected file.');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Document name is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!editingId && !formData.dataUrl) errs.file = 'Please select a file to upload';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        const next = documents.map((d) =>
          d.id === editingId
            ? {
                ...d,
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                // If a new file was chosen, replace the file bits
                ...(formData.file
                  ? {
                      type: formData.type,
                      size: formData.size,
                      dataUrl: formData.dataUrl,
                    }
                  : {}),
              }
            : d,
        );
        persist(next);
        toast.success('Document updated');
      } else {
        const newDoc = {
          id: `doc-${Date.now()}`,
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          type: formData.type,
          size: formData.size,
          dataUrl: formData.dataUrl,
          date: new Date().toISOString().split('T')[0],
          uploadedBy: user?.name || 'Admin',
        };
        persist([newDoc, ...documents]);
        toast.success('Document uploaded');
      }
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const next = documents.filter((d) => d.id !== deleteId);
    persist(next);
    toast.success('Document deleted');
    setDeleteId(null);
  };

  const handleDownload = (doc) => {
    if (!doc.dataUrl) {
      toast.info('This seeded document has no file attached.');
      return;
    }
    const link = document.createElement('a');
    link.href = doc.dataUrl;
    link.download = doc.name;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Manage Documents"
        description="Upload and manage documents for providers and participants"
        icon={FileText}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white outline-none min-w-[180px]"
        >
          <option value="all">All Categories</option>
          {DOCUMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
      </p>

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No documents found</p>
            <p className="text-sm text-slate-400 mt-1">
              Click "Upload Document" to add one.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => {
              const { Icon, color } = typeIconMap[doc.type] || typeIconMap.pdf;
              return (
                <li
                  key={doc.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                    {doc.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{doc.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          categoryColors[doc.category] || categoryColors.Other
                        }`}
                      >
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">{doc.date}</span>
                      <span className="text-xs text-slate-400">{doc.size}</span>
                      {doc.uploadedBy && (
                        <span className="text-xs text-slate-400">by {doc.uploadedBy}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(doc.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? 'Edit Document' : 'Upload Document'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* File */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  File {editingId && <span className="text-xs text-slate-400">(optional — leave blank to keep current)</span>}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl p-5 text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {formData.file
                      ? formData.file.name
                      : 'Click to choose a file (PDF, DOC, Image)'}
                  </p>
                  {formData.size && (
                    <p className="text-xs text-slate-400 mt-1">{formData.size}</p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {formErrors.file && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.file}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Document Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="e.g. NDIS Handbook 2026"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                >
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Short description (optional)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {editingId ? 'Save Changes' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Document?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The document will be permanently removed
                and will no longer be visible to providers or participants.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDocumentsPage;
