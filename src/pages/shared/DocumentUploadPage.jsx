import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  FileText,
  Download,
  FolderOpen,
  Image as ImageIcon,
  Search,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { ASYNC_STATUS } from '../../constants';
import { fetchDocuments } from '../../store/actions/documentActions';
import {
  DOCUMENT_CATEGORIES,
  normalizeDocuments,
  resolveFileUrl,
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

const DocumentUploadPage = () => {
  const dispatch = useDispatch();

  const { publicDocuments, status } = useSelector((s) => s.document);
  const loading = status === ASYNC_STATUS.LOADING;

  const documents = useMemo(
    () => normalizeDocuments(publicDocuments),
    [publicDocuments],
  );

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadDocuments = useCallback(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredDocuments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return documents.filter((d) => {
      const matchesSearch =
        !q ||
        d.name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'all' || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, categoryFilter]);

  const handleDownload = (doc) => {
    const href = resolveFileUrl(doc.file_url);
    if (!href) {
      toast.info('No file attached to this document.');
      return;
    }
    const link = document.createElement('a');
    link.href = href;
    link.download = doc.original_filename || doc.name || 'document';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Documents</h1>
        <p className="text-purple-100">
          Browse and download documents shared by the admin team
        </p>
      </div>

      {/* Info banner */}
      {/* <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          These documents are uploaded and maintained by the admin team. As a{' '}
          {audience}, you have read-only access — you can view and download them,
          but cannot upload your own.
        </p>
      </div> */}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
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

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Available Documents</h2>
          <span className="text-xs text-slate-400">
            {loading
              ? 'Loading…'
              : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading && documents.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No documents available</p>
            <p className="text-sm text-slate-400 mt-1">
              Check back later — admins add new documents regularly.
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
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {doc.name}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          categoryColors[doc.category] || categoryColors.Other
                        }`}
                      >
                        {doc.category}
                      </span>
                      {doc.date && (
                        <span className="text-xs text-slate-400">{doc.date}</span>
                      )}
                      {doc.size && (
                        <span className="text-xs text-slate-400">{doc.size}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:text-white hover:bg-purple-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadPage;
