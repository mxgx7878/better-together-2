// ─── Document Helpers ─────────────────────────────────────────
// Pure helpers used by document pages. Data now comes from the
// backend API via documentActions / documentSlice.

// Public storage path where uploaded documents live on the backend.
// The API returns `file_url` as a relative path (e.g. "documents/foo.pdf");
// we prefix it with this when rendering / downloading.
export const STORAGE_BASE_URL =
  'https://demowebportals.com/better-backend/storage/app/public/';

export const DOCUMENT_CATEGORIES = [
  'NDIS Resources',
  'Guides',
  'Policies',
  'Forms',
  'Announcements',
  'Other',
];

/**
 * Resolve a document's `file_url` to an absolute URL.
 * - Leaves fully-qualified URLs untouched (http/https/data/blob).
 * - Otherwise prepends STORAGE_BASE_URL and trims a leading slash.
 */
export const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (/^(https?:\/\/|data:|blob:)/i.test(fileUrl)) return fileUrl;
  const trimmed = String(fileUrl).replace(/^\/+/, '');
  return `${STORAGE_BASE_URL}${trimmed}`;
};

export const detectType = (fileName = '', mime = '') => {
  const name = String(fileName).toLowerCase();
  const m = String(mime).toLowerCase();
  if (m.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(name)) return 'img';
  if (m.includes('word') || /\.docx?$/i.test(name)) return 'doc';
  return 'pdf';
};

export const formatFileSize = (bytes = 0) => {
  const n = Number(bytes);
  if (!n) return '0 KB';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Normalize a raw document object from the API into the shape the UI expects.
 * Defensive against missing fields so the UI never crashes on partial data.
 */
export const normalizeDocument = (doc = {}) => {
  const name =
    doc.name || doc.title || doc.original_filename || 'Untitled document';
  const type =
    doc.type || detectType(doc.original_filename || name, doc.mime_type);
  const size =
    doc.size ||
    (doc.size_bytes ? formatFileSize(doc.size_bytes) : '');
  const uploadedBy =
    (typeof doc.uploaded_by === 'object' ? doc.uploaded_by?.name : doc.uploaded_by) ||
    doc.uploader_name ||
    '';
  const date =
    (doc.created_at || doc.updated_at || '').split('T')[0] || doc.date || '';

  return {
    id: doc.id,
    name,
    description: doc.description || '',
    category: doc.category || 'Other',
    type,
    size,
    file_url: resolveFileUrl(doc.file_url),
    original_filename: doc.original_filename || name,
    status: doc.status ?? 1,
    uploaded_by: uploadedBy,
    date,
  };
};

export const normalizeDocuments = (docs = []) =>
  (Array.isArray(docs) ? docs : []).map(normalizeDocument);
