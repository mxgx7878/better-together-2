import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, ImageIcon, FileIcon } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

/**
 * Reusable file upload with live preview.
 *
 * Uses a two-step S3 presigned URL flow:
 *   1. POST to backend → receive { presigned_url, public_url, key, expires_in }
 *   2. PUT the file directly to S3 using the presigned_url
 *   3. Save the public_url via onChange()
 *
 * @param {string}   value           Current file URL (controlled)
 * @param {function} onChange        Receives the new public S3 URL (or "" when cleared)
 * @param {string}   label           Field label
 * @param {string}   accept          File types (default: "image/*")
 * @param {string}   uploadPath      Backend endpoint that returns presigned URL
 *                                   (default: "/s3/presigned-url" — adjust to your route)
 * @param {string}   folder          S3 sub-folder under "better-together/"
 *                                   e.g. "avatars", "logos", "documents/policies"
 * @param {number}   maxSizeMb       Max file size in MB (default: 5)
 * @param {string}   variant         "avatar" (round) | "card" (rectangular, default)
 * @param {string}   placeholder     Helper text inside the dropzone
 * @param {string}   error           Error message to display
 * @param {boolean}  disabled
 */
const FileUploadPreview = ({
  value = "",
  onChange,
  label,
  accept = "image/*",
  uploadPath = "/s3/presigned-url",
  folder = "misc",
  maxSizeMb = 5,
  variant = "card",
  placeholder = "Click to upload or drag a file here",
  error,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState("");

  const previewUrl = localPreview || value;
  const isImage = accept.includes("image");

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFile = async (file) => {
    if (!file || disabled) return;

    // Optional size check
    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMb}MB.`);
      return;
    }

    // Show local preview immediately for snappy UX
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);

    setUploading(true);
    try {
      const contentType = file.type || "application/octet-stream";

      // ─── Step 1: Ask backend for a presigned PUT URL ──────────────
      const presignRes = await api.post(uploadPath, {
        filename: file.name,
        content_type: contentType,
        folder,
      });

      // Backend returns: { presigned_url, public_url, key, expires_in }
      // (some Laravel setups wrap it under `data` — handle both)
      const payload = presignRes?.data ?? presignRes;
      const presignedUrl = payload?.presigned_url;
      const publicUrl = payload?.public_url;

      if (!presignedUrl || !publicUrl) {
        throw new Error("Server did not return a valid presigned URL");
      }

      // ─── Step 2: PUT the raw file to S3 ───────────────────────────
      // IMPORTANT: bypass the `api` wrapper here so:
      //   - no Authorization header is sent to S3
      //   - the body is the raw file binary, not FormData/JSON
      //   - Content-Type matches exactly what we signed for
      const s3Res = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!s3Res.ok) {
        throw new Error(`S3 upload failed (${s3Res.status})`);
      }

      // ─── Step 3: Save the public URL via onChange ─────────────────
      onChange?.(publicUrl);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
      setLocalPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setLocalPreview("");
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // ─── Avatar variant (round, fixed size) ──────────
  if (variant === "avatar") {
    return (
      <div>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              onClick={() => !disabled && inputRef.current?.click()}
              className={`w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center ${
                disabled
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:border-purple-400"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-7 h-7 text-slate-400" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            {previewUrl && !uploading && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              {previewUrl ? "Change" : "Upload"}
            </button>
            <p className="text-xs text-slate-400 mt-0.5">Max {maxSizeMb}MB</p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // ─── Card variant (full-width dropzone) ──────────
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          error
            ? "border-red-300 bg-red-50/50"
            : previewUrl
              ? "border-purple-200 bg-purple-50/30"
              : "border-slate-200 hover:border-purple-300 bg-slate-50/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {previewUrl ? (
          <div className="p-4 flex items-center gap-4">
            {isImage ? (
              <img
                src={previewUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileIcon className="w-7 h-7 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {uploading ? "Uploading…" : "File uploaded"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {previewUrl.split("/").pop()}
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-rose-100 text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">{placeholder}</p>
            <p className="text-xs text-slate-400 mt-1">
              {accept === "image/*" ? "PNG, JPG, GIF" : "Any file"} · Max{" "}
              {maxSizeMb}MB
            </p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadPreview;