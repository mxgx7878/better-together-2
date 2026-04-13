// ─── Document Service ─────────────────────────────────────────
// Client-side document store backed by localStorage. Admins manage
// (upload / edit / delete) documents here; providers and participants
// read them. This mirrors the mock-data pattern used elsewhere in the
// app until a real backend endpoint is wired up.

const STORAGE_KEY = 'bt_admin_documents';

const seedDocuments = [
  {
    id: 'seed-1',
    name: 'Welcome_Guide_2026.pdf',
    description: 'A quick-start guide to using the Better Together platform.',
    category: 'Guides',
    type: 'pdf',
    size: '1.1 MB',
    dataUrl: '',
    date: '2026-02-10',
    uploadedBy: 'Admin',
  },
  {
    id: 'seed-2',
    name: 'NDIS_Provider_Handbook.pdf',
    description: 'Official NDIS handbook for registered providers.',
    category: 'NDIS Resources',
    type: 'pdf',
    size: '2.3 MB',
    dataUrl: '',
    date: '2026-01-22',
    uploadedBy: 'Admin',
  },
  {
    id: 'seed-3',
    name: 'Participant_Rights_Overview.docx',
    description: 'Overview of participant rights and safeguards.',
    category: 'Policies',
    type: 'doc',
    size: '180 KB',
    dataUrl: '',
    date: '2026-03-01',
    uploadedBy: 'Admin',
  },
];

export const DOCUMENT_CATEGORIES = [
  'NDIS Resources',
  'Guides',
  'Policies',
  'Forms',
  'Announcements',
  'Other',
];

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const getDocuments = () => {
  if (typeof window === 'undefined') return [...seedDocuments];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (parsed) return parsed;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDocuments));
  return [...seedDocuments];
};

export const saveDocuments = (docs) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const detectType = (fileName = '') => {
  if (/\.(png|jpe?g|gif|webp)$/i.test(fileName)) return 'img';
  if (/\.docx?$/i.test(fileName)) return 'doc';
  return 'pdf';
};

export const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
