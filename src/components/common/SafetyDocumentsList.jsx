import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { fetchSafetyDocuments } from "../../store/actions/safetyNumberActions";
import { ASYNC_STATUS } from "../../constants";
import { resolveFileUrl } from "../../services/documentService";

const formatSize = (bytes) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const SafetyDocumentsList = () => {
  const dispatch = useDispatch();
  const { documents, docStatus } = useSelector((s) => s.safetyNumber);
  const loading = docStatus === ASYNC_STATUS.LOADING;

  useEffect(() => {
    dispatch(fetchSafetyDocuments());
  }, [dispatch]);

  const docs = useMemo(() => documents || [], [documents]);

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

  // Don't render the card at all if there are no documents
  if (!loading && docs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Helpful Documents
      </h2>

      {loading && docs.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => {
            const href = resolveFileUrl(d.file_url);
            return (
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
                    </h4>
                    {d.description && (
                      <p className="text-xs text-slate-500 truncate">
                        {d.description}
                      </p>
                    )}
                    {d.size_bytes ? (
                      <p className="text-[11px] text-slate-400">
                        {formatSize(d.size_bytes)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Eye className="w-4 h-4" /> View
                  </a>
                  <button
                    onClick={() => download(d)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SafetyDocumentsList;