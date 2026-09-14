import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Loader2, Save, Sparkles } from "lucide-react";
import {
  adminCreateInnovationLabResource,
  adminUpdateInnovationLabResource,
  adminFetchInnovationLabResourceById,
  fetchInnovationLabCategories,
} from "../../store/actions/innovationLabActions";
import { clearSelectedResource } from "../../store/slices/innovationLabSlice";
import { ASYNC_STATUS } from "../../constants";
import FileUploadPreview from "../../components/common/FileUploadPreview";

const TYPE_OPTIONS = [
  { value: "guide", label: "Guide" },
  { value: "video", label: "Video" },
  { value: "template", label: "Template" },
  { value: "webinar", label: "Webinar" },
];

// File picker `accept` per resource type
const acceptByType = {
  guide: ".pdf,.doc,.docx,.ppt,.pptx,.txt",
  video: "video/*",
  template: ".pdf,.doc,.docx,.xlsx,.xls,.csv,.ppt,.pptx,.zip",
  webinar: "video/*,audio/*",
};

const emptyForm = {
  title: "",
  description: "",
  category: "",
  type: "guide",
  duration: "",
  thumbnail: "",
  attachment_url: "",
  attachment_name: "",
  attachment_type: "",
  attachment_size: 0,
  is_paid: 0,
  status: 1,
  sort_order: 0,
};

// Detect generic attachment type from extension (mirrors LearningModuleFormPage helper)
const detectAttachmentType = (url, name) => {
  const n = (name || url || "").toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(n)) return "image";
  if (/\.pdf$/.test(n)) return "pdf";
  if (/\.(mp4|mov|webm|mkv|avi)$/.test(n)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac)$/.test(n)) return "audio";
  if (/\.(docx?|odt|rtf|txt)$/.test(n)) return "document";
  if (/\.(pptx?)$/.test(n)) return "presentation";
  if (/\.(xlsx?|csv)$/.test(n)) return "spreadsheet";
  if (/\.zip$/.test(n)) return "archive";
  return "file";
};

const isMediaUrl = (url) =>
  /\.(mp4|mov|webm|mkv|avi|mp3|wav|ogg|m4a|aac)$/i.test(url || "");

const isAudioUrl = (url) =>
  /\.(mp3|wav|ogg|m4a|aac)$/i.test(url || "");

// Format seconds → "1 hr 5 min" / "12 min" / "45 sec"
const formatDuration = (seconds) => {
  const s = Math.floor(seconds);
  if (!s || !isFinite(s)) return "";
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  if (mins > 0) return `${mins} min`;
  return `${secs} sec`;
};

// Read media duration by loading the URL into a hidden <video>/<audio> element
const probeMediaDuration = (url) =>
  new Promise((resolve, reject) => {
    const el = document.createElement(isAudioUrl(url) ? "audio" : "video");
    el.preload = "metadata";
    el.muted = true;

    const cleanup = () => {
      el.onloadedmetadata = null;
      el.onerror = null;
      el.removeAttribute("src");
    };

    el.onloadedmetadata = () => {
      const seconds = el.duration;
      cleanup();
      if (!isFinite(seconds) || seconds <= 0) {
        reject(new Error("Invalid duration"));
        return;
      }
      resolve(seconds);
    };

    el.onerror = () => {
      cleanup();
      reject(new Error("Could not load media"));
    };

    el.src = url;
  });

const InnovationLabResourceFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedResource, categories, resourceStatus } = useSelector(
    (s) => s.innovationLab,
  );
  const loading = resourceStatus === ASYNC_STATUS.LOADING;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [probingDuration, setProbingDuration] = useState(false);

  // Load categories
  useEffect(() => {
    dispatch(fetchInnovationLabCategories());
  }, [dispatch]);

  // Load resource on edit
  useEffect(() => {
    if (isEditMode) {
      dispatch(adminFetchInnovationLabResourceById(id));
    }
    return () => {
      dispatch(clearSelectedResource());
    };
  }, [isEditMode, id, dispatch]);

  // Populate form on edit
  useEffect(() => {
    if (isEditMode && selectedResource) {
      setForm({
        title: selectedResource.title || "",
        description: selectedResource.description || "",
        category: selectedResource.category || "",
        type: selectedResource.type || "guide",
        duration: selectedResource.duration || "",
        thumbnail: selectedResource.thumbnail || "",
        attachment_url: selectedResource.attachment_url || "",
        attachment_name: selectedResource.attachment_name || "",
        attachment_type: selectedResource.attachment_type || "",
        attachment_size: selectedResource.attachment_size ?? 0,
        is_paid: Number(selectedResource.is_paid) || 0,
        status: Number(selectedResource.status) ?? 1,
        sort_order: Number(selectedResource.sort_order) || 0,
      });

      if (
        selectedResource.category &&
        categories.length > 0 &&
        !categories.includes(selectedResource.category)
      ) {
        setCustomCategory(true);
      }
    }
  }, [isEditMode, selectedResource, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : type === "number"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ─── Attachment upload handler ──────────────────────────────────
  // FileUploadPreview returns only the public URL. We infer name/type
  // from the URL and auto-probe duration for media files.
  const handleAttachmentChange = useCallback(async (url) => {
    if (!url) {
      setForm((prev) => ({
        ...prev,
        attachment_url: "",
        attachment_name: "",
        attachment_type: "",
        attachment_size: 0,
      }));
      return;
    }

    const fileName = url.split("/").pop() || "";
    const detectedType = detectAttachmentType(url, fileName);

    setForm((prev) => ({
      ...prev,
      attachment_url: url,
      attachment_name: fileName,
      attachment_type: detectedType,
    }));

    // Auto-probe duration for media (video/audio) files
    if (isMediaUrl(url)) {
      setProbingDuration(true);
      try {
        const seconds = await probeMediaDuration(url);
        const formatted = formatDuration(seconds);
        setForm((prev) => ({ ...prev, duration: formatted }));
      } catch {
        // Silent — admin can still type duration manually if probing fails
      } finally {
        setProbingDuration(false);
      }
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category.trim()) errs.category = "Category is required";
    if (!form.type) errs.type = "Type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category.trim(),
      type: form.type,
      duration: form.duration.trim() || null,
      thumbnail: form.thumbnail || null,
      attachment_url: form.attachment_url || null,
      attachment_name: form.attachment_name || null,
      attachment_type: form.attachment_type || null,
      attachment_size: form.attachment_size || null,
      is_paid: Number(form.is_paid),
      status: Number(form.status),
      sort_order: Number(form.sort_order) || 0,
    };

    try {
      if (isEditMode) {
        await dispatch(
          adminUpdateInnovationLabResource({ id, resourceData: payload }),
        ).unwrap();
      } else {
        await dispatch(adminCreateInnovationLabResource(payload)).unwrap();
      }
      navigate("/admin/innovation-lab");
    } catch {
      // toast handled by thunk
    } finally {
      setSaving(false);
    }
  };

  if (isEditMode && loading && !selectedResource) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  const isMediaType = form.type === "video" || form.type === "webinar";
  const durationIsAutoDetected = isMediaUrl(form.attachment_url);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/innovation-lab")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Resource" : "Create New Resource"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditMode
              ? "Update the details of this Innovation Lab resource"
              : "Add a new resource to the Innovation Lab"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Person-Centred Planning Guide"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none ${
              errors.title
                ? "border-red-300 focus:border-red-400"
                : "border-slate-200 focus:border-purple-500"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Short summary shown when the resource is expanded"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          />
        </div>

        {/* Category + Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomCategory((v) => !v)}
                className="text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                {customCategory ? "Pick from list" : "+ Add new"}
              </button>
            </div>
            {customCategory ? (
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter new category"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none ${
                  errors.category
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-purple-500"
                }`}
              />
            ) : (
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white outline-none ${
                  errors.category
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-purple-500"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thumbnail */}
        <FileUploadPreview
          label="Thumbnail (optional)"
          value={form.thumbnail}
          onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))}
          accept="image/*"
          folder="innovation-lab/thumbnails"
          maxSizeMb={2}
          placeholder="Click to upload a cover image"
        />

        {/* Attachment */}
        <FileUploadPreview
          label="Resource File"
          value={form.attachment_url}
          onChange={handleAttachmentChange}
          accept={acceptByType[form.type] || "*"}
          folder="innovation-lab/files"
          maxSizeMb={50}
          placeholder={
            form.type === "video"
              ? "Upload a video file (mp4, mov, webm...)"
              : form.type === "webinar"
                ? "Upload a webinar recording (video or audio)"
                : form.type === "template"
                  ? "Upload a template (PDF, DOC, XLSX...)"
                  : "Upload a guide (PDF, DOC...)"
          }
        />

        {/* Duration + Sort order */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1.5">
              <span>Duration</span>
              {durationIsAutoDetected && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> Auto-detected
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                name="duration"
                value={probingDuration ? "Detecting..." : form.duration}
                onChange={handleChange}
                readOnly={durationIsAutoDetected || probingDuration}
                placeholder={
                  isMediaType
                    ? "Auto-fills after upload"
                    : "e.g. 15 min read, Download"
                }
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none ${
                  durationIsAutoDetected
                    ? "bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed"
                    : "border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                }`}
              />
              {probingDuration && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 animate-spin" />
              )}
            </div>
            {durationIsAutoDetected && (
              <p className="text-xs text-slate-400 mt-1">
                Pulled from the uploaded media file
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_paid"
              checked={Number(form.is_paid) === 1}
              onChange={handleChange}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-slate-700">
              Paid tier only
              <span className="block text-xs text-slate-400">
                Restrict to paid subscribers
              </span>
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="status"
              checked={Number(form.status) === 1}
              onChange={handleChange}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-slate-700">
              Published
              <span className="block text-xs text-slate-400">
                Visible to providers on the Innovation Lab page
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => navigate("/admin/innovation-lab")}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || probingDuration}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEditMode ? "Update Resource" : "Create Resource"}
        </button>
      </div>
    </div>
  );
};

export default InnovationLabResourceFormPage;