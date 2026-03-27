import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, Trash2, Download, FolderOpen, Image, CheckCircle } from '../../components/Icons';

const categories = ['NDIS Plan', 'Service Agreements', 'Medical Reports', 'Invoices & Receipts', 'Other'];

const categoryColors = {
  'NDIS Plan': 'bg-purple-50 text-purple-700',
  'Service Agreements': 'bg-blue-50 text-blue-700',
  'Medical Reports': 'bg-emerald-50 text-emerald-700',
  'Invoices & Receipts': 'bg-amber-50 text-amber-700',
  'Other': 'bg-slate-100 text-slate-600',
};

const initialDocuments = [
  { id: 1, name: 'NDIS_Plan_2026.pdf', category: 'NDIS Plan', type: 'pdf', size: '1.2 MB', date: '2026-02-15' },
  { id: 2, name: 'Service_Agreement_TherapyPlus.pdf', category: 'Service Agreements', type: 'pdf', size: '340 KB', date: '2026-01-28' },
  { id: 3, name: 'GP_Report_March2026.docx', category: 'Medical Reports', type: 'doc', size: '89 KB', date: '2026-03-05' },
  { id: 4, name: 'Invoice_Support_Feb2026.pdf', category: 'Invoices & Receipts', type: 'pdf', size: '156 KB', date: '2026-02-20' },
  { id: 5, name: 'OT_Assessment_Photo.png', category: 'Medical Reports', type: 'img', size: '2.4 MB', date: '2026-03-12' },
];

const typeIconMap = {
  pdf: { Icon: FileText, color: 'text-red-500' },
  doc: { Icon: FolderOpen, color: 'text-blue-500' },
  img: { Icon: Image, color: 'text-emerald-500' },
};

const DocumentUploadPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState('NDIS Plan');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length) simulateUpload(e.target.files);
  };

  const simulateUpload = (files) => {
    const newDocs = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      category: selectedCategory,
      type: file.name.match(/\.(png|jpg|jpeg)$/i) ? 'img' : file.name.match(/\.docx?$/i) ? 'doc' : 'pdf',
      size: `${(file.size / 1024).toFixed(0)} KB`,
      date: new Date().toISOString().split('T')[0],
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-1">My Documents</h1>
        <p className="text-purple-100">Upload and manage your important documents</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Documents</h2>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">Document Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50/50'
          }`}
        >
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-purple-600" />
          </div>
          <p className="text-slate-700 font-medium mb-1">Drag & drop files here or click to browse</p>
          <p className="text-sm text-slate-400">Accepted file types: PDF, DOC, JPG, PNG</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Upload Success */}
        {uploadSuccess && (
          <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2.5 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            File uploaded successfully!
          </div>
        )}
      </div>

      {/* Storage Indicator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{documents.length} of 50 documents uploaded</p>
            <p className="text-xs text-slate-400">You can store up to 50 documents</p>
          </div>
        </div>
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${Math.min((documents.length / 50) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Uploaded Documents</h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No documents uploaded yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const { Icon, color } = typeIconMap[doc.type] || typeIconMap.pdf;
              return (
                <li key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  {/* File Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[doc.category]}`}>
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">{doc.date}</span>
                      <span className="text-xs text-slate-400">{doc.size}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
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
    </div>
  );
};

export default DocumentUploadPage;
