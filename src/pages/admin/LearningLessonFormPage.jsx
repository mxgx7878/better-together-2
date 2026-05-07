import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import {
  adminCreateLesson,
  adminUpdateLesson,
  adminFetchLessonById,
} from "../../store/actions/learningActions";
import { clearSelectedLesson } from "../../store/slices/learningSlice";
import { ASYNC_STATUS } from "../../constants";
import FileUploadPreview from "../../components/common/FileUploadPreview";

const emptyForm = {
  title: "",
  content: "",
  video_url: "",
  attachment_url: "",
  attachment_name: "",
  attachment_type: "",
  attachment_size: 0,
  duration_minutes: 0,
  order: 1,
};

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm outline-none transition-colors placeholder:text-slate-300 ${
    err
      ? "border-red-300 focus:border-red-400"
      : "border-slate-100 focus:border-purple-400 focus:bg-white"
  }`;

const LearningLessonFormPage = () => {
  const { moduleId, lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(lessonId);

  const { selectedLesson, lessonStatus } = useSelector((s) => s.learning);
  const loadingLesson = lessonStatus === ASYNC_STATUS.LOADING;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) dispatch(adminFetchLessonById(lessonId));
    return () => {
      dispatch(clearSelectedLesson());
    };
  }, [lessonId, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && selectedLesson) {
      setForm({
        title: selectedLesson.title || "",
        content: selectedLesson.content || "",
        video_url: selectedLesson.video_url || "",
        attachment_url: selectedLesson.attachment_url || "",
        attachment_name: selectedLesson.attachment_name || "",
        attachment_type: selectedLesson.attachment_type || "",
        attachment_size: selectedLesson.attachment_size || 0,
        duration_minutes: Number(selectedLesson.duration_minutes) || 0,
        order: Number(selectedLesson.order) || 1,
      });
    }
  }, [isEditMode, selectedLesson]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.content.trim()) errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      video_url: form.video_url.trim() || null,
      attachment_url: form.attachment_url || null,
      attachment_name: form.attachment_name || null,
      attachment_type: form.attachment_type || null,
      attachment_size: form.attachment_size
        ? Number(form.attachment_size)
        : null,
      duration_minutes: Number(form.duration_minutes) || 0,
      order: Number(form.order) || 1,
    };

    try {
      if (isEditMode) {
        await dispatch(
          adminUpdateLesson({ id: lessonId, lessonData: payload }),
        ).unwrap();
      } else {
        await dispatch(
          adminCreateLesson({ moduleId, lessonData: payload }),
        ).unwrap();
      }
      navigate(`/admin/learning-hub/${moduleId}`);
    } catch {
      // Toasted
    } finally {
      setSaving(false);
    }
  };

  if (loadingLesson && isEditMode) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/admin/learning-hub/${moduleId}`)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Lesson" : "Create Lesson"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditMode
              ? "Update the lesson details below"
              : "Add a new lesson to this module"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
          Lesson Details
        </h2>

        <Field label="Lesson Title" required error={errors.title}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. What is an NDIS plan?"
            className={inputCls(errors.title)}
          />
        </Field>

        <Field label="Content" required error={errors.content}>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            placeholder="Lesson content, instructions, reading material..."
            className={`${inputCls(errors.content)} resize-none`}
          />
        </Field>

        <Field label="Video URL (optional)">
          <input
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className={inputCls(false)}
          />
        </Field>

        <Field label="Lesson Attachment (optional)">
          <FileUploadPreview
            value={form.attachment_url}
            onChange={(url) => {
              const fileName = url ? url.split("/").pop() : "";
              setForm((prev) => ({
                ...prev,
                attachment_url: url || "",
                attachment_name: fileName,
                attachment_type: url ? detectAttachmentType(url, fileName) : "",
                // size won't be known here since component returns only URL —
                // leave as-is or 0; backend handles nullable
                attachment_size: url ? prev.attachment_size : 0,
              }));
            }}
            accept="*/*"
            folder="learning-lessons"
            maxSizeMb={25}
            placeholder="Upload PDF, image, doc, video — anything"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Duration (minutes)">
            <input
              type="number"
              name="duration_minutes"
              value={form.duration_minutes}
              onChange={handleChange}
              min="0"
              className={inputCls(false)}
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              className={inputCls(false)}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate(`/admin/learning-hub/${moduleId}`)}
            className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isEditMode ? "Save Changes" : "Create Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningLessonFormPage;
