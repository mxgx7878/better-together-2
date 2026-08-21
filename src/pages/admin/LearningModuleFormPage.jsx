import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Loader2, Plus, Save, Edit2, Trash2, X,
  BookOpen, Video, Clock,
  FileText, Image as ImageIcon, File as FileIcon,
} from "lucide-react";
import {
  adminCreateLearningModule,
  adminUpdateLearningModule,
  adminFetchLearningModuleById,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
} from "../../store/actions/learningActions";
import { clearSelectedModule } from "../../store/slices/learningSlice";
import { ASYNC_STATUS } from "../../constants";
import FileUploadPreview from "../../components/common/FileUploadPreview";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];


//please add one more field which label is for it's mean for those who selected it's select option where three  option  provider, particpents and both  
const audienceOptions = [
  { value: "provider", label: "Provider" },
  { value: "participants", label: "Participants" },
  { value: "both", label: "Both" },
];



const emptyModuleForm = {
  title: "", description: "", category: "",
  difficulty: "beginner", thumbnail: "",
  is_paid: 0, status: 1, audience: "both",
};

const emptyLessonForm = {
  title: "", content: "", video_url: "",
  attachment_url: "", attachment_name: "", attachment_type: "",
  duration_minutes: 0, order: 1,
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

const detectAttachmentType = (url, name) => {
  const n = (name || url || "").toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(n)) return "image";
  if (/\.pdf$/.test(n)) return "pdf";
  if (/\.(mp4|mov|webm|mkv)$/.test(n)) return "video";
  if (/\.(mp3|wav|ogg|m4a)$/.test(n)) return "audio";
  if (/\.(docx?|odt|rtf|txt|pptx?|xlsx?)$/.test(n)) return "doc";
  return "other";
};

const LearningModuleFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { selectedModule, moduleStatus } = useSelector((s) => s.learning);
  const loadingModule = moduleStatus === ASYNC_STATUS.LOADING;

  // Module state
  const [form, setForm] = useState(emptyModuleForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Lesson state — expandedLessonId: null | "new" | <lessonId>
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [lessonErrors, setLessonErrors] = useState({});
  const [savingLesson, setSavingLesson] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState(null);
  const [deletingLesson, setDeletingLesson] = useState(false);

  const lessons = selectedModule?.lessons || [];

  useEffect(() => {
    if (isEditMode) dispatch(adminFetchLearningModuleById(id));
    return () => dispatch(clearSelectedModule());
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && selectedModule) {
      setForm({
        title: selectedModule.title || "",
        description: selectedModule.description || "",
        category: selectedModule.category || "",
        difficulty: selectedModule.difficulty || "beginner",
         audience: selectedModule.audience || "both",
        thumbnail: selectedModule.thumbnail || "",
        is_paid: Number(selectedModule.is_paid) || 0,
        status: Number(selectedModule.status ?? 1),
      });
    }
  }, [isEditMode, selectedModule]);

  // ─── Module handlers ─────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (checked ? 1 : 0)
        : type === "number" ? Number(value)
        : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateModule = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category.trim()) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateModule()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      difficulty: form.difficulty,
      audience: form.audience,
      thumbnail: form.thumbnail.trim() || null,
      is_paid: Number(form.is_paid),
      status: Number(form.status),
    };
    try {
      if (isEditMode) {
        await dispatch(adminUpdateLearningModule({ id, moduleData: payload })).unwrap();
      } else {
        const created = await dispatch(adminCreateLearningModule(payload)).unwrap();
        // Redirect to edit mode so lessons can be added immediately
        navigate(`/admin/learning-hub/edit/${created.id}`);
      }
    } catch {
      // Toasted by action
    } finally {
      setSaving(false);
    }
  };

  // ─── Lesson handlers ─────────────────────
  const openAddLesson = () => {
    const nextOrder = lessons.length
      ? Math.max(...lessons.map((l) => l.order || 0)) + 1
      : 1;
    setLessonForm({ ...emptyLessonForm, order: nextOrder });
    setLessonErrors({});
    setExpandedLessonId("new");
  };

  const openEditLesson = (lesson) => {
    setLessonForm({
      title: lesson.title || "",
      content: lesson.content || "",
      video_url: lesson.video_url || "",
      attachment_url: lesson.attachment_url || "",
      attachment_name: lesson.attachment_name || "",
      attachment_type: lesson.attachment_type || "",
      duration_minutes: lesson.duration_minutes ?? 0,
      order: lesson.order ?? 1,
    });
    setLessonErrors({});
    setExpandedLessonId(lesson.id);
  };

  const closeLessonForm = () => {
    setExpandedLessonId(null);
    setLessonForm(emptyLessonForm);
    setLessonErrors({});
  };

  const handleLessonChange = (e) => {
    const { name, value, type } = e.target;
    setLessonForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (lessonErrors[name]) setLessonErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLesson = () => {
    const errs = {};
    if (!lessonForm.title.trim()) errs.title = "Title is required";
    if (!lessonForm.content.trim()) errs.content = "Content is required";
    setLessonErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveLesson = async () => {
    if (!validateLesson()) return;
    setSavingLesson(true);
    const payload = {
      title: lessonForm.title.trim(),
      content: lessonForm.content.trim(),
      video_url: lessonForm.video_url.trim() || null,
      attachment_url: lessonForm.attachment_url || null,
      attachment_name: lessonForm.attachment_name || null,
      attachment_type: lessonForm.attachment_type || null,
      duration_minutes: Number(lessonForm.duration_minutes) || 0,
      order: Number(lessonForm.order) || 1,
    };
    try {
      if (expandedLessonId === "new") {
        await dispatch(adminCreateLesson({ moduleId: id, lessonData: payload })).unwrap();
      } else {
        await dispatch(adminUpdateLesson({ id: expandedLessonId, lessonData: payload })).unwrap();
      }
      await dispatch(adminFetchLearningModuleById(id));
      closeLessonForm();
    } catch {
      // toasted
    } finally {
      setSavingLesson(false);
    }
  };

  const confirmDeleteLesson = async () => {
    if (!deleteLessonId) return;
    setDeletingLesson(true);
    try {
      await dispatch(adminDeleteLesson(deleteLessonId)).unwrap();
      await dispatch(adminFetchLearningModuleById(id));
      if (expandedLessonId === deleteLessonId) closeLessonForm();
      setDeleteLessonId(null);
    } finally {
      setDeletingLesson(false);
    }
  };

  // ─── Inline lesson form (function, NOT component — keeps input focus) ──
  const renderLessonForm = () => (
    <div className="bg-purple-50/40 border-2 border-purple-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">
          {expandedLessonId === "new" ? "New Lesson" : "Edit Lesson"}
        </h3>
        <button
          onClick={closeLessonForm}
          className="p-1.5 rounded-lg hover:bg-white/60 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Field label="Lesson Title" required error={lessonErrors.title}>
        <input
          name="title"
          value={lessonForm.title}
          onChange={handleLessonChange}
          placeholder="e.g. What is an NDIS plan?"
          className={inputCls(lessonErrors.title)}
        />
      </Field>

      <Field label="Content" required error={lessonErrors.content}>
        <textarea
          name="content"
          value={lessonForm.content}
          onChange={handleLessonChange}
          rows={6}
          placeholder="Lesson content, instructions, reading material..."
          className={`${inputCls(lessonErrors.content)} resize-none`}
        />
      </Field>

      <Field label="Video URL (optional)">
        <input
          name="video_url"
          value={lessonForm.video_url}
          onChange={handleLessonChange}
          placeholder="https://youtube.com/watch?v=..."
          className={inputCls(false)}
        />
      </Field>

      <Field label="Lesson Attachment (optional)">
        <FileUploadPreview
          value={lessonForm.attachment_url}
          onChange={(url) => {
            const fileName = url ? url.split("/").pop() : "";
            setLessonForm((prev) => ({
              ...prev,
              attachment_url: url || "",
              attachment_name: fileName,
              attachment_type: url ? detectAttachmentType(url, fileName) : "",
            }));
          }}
          accept="*/*"
          folder="learning-lessons"
          maxSizeMb={25}
          placeholder="Upload PDF, image, doc — anything"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Duration (minutes)">
          <input
            type="number"
            name="duration_minutes"
            value={lessonForm.duration_minutes}
            onChange={handleLessonChange}
            min="0"
            className={inputCls(false)}
          />
        </Field>
        <Field label="Order">
          <input
            type="number"
            name="order"
            value={lessonForm.order}
            onChange={handleLessonChange}
            min="1"
            className={inputCls(false)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-purple-100">
        <button
          onClick={closeLessonForm}
          className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:bg-white/60 rounded-xl transition-colors border border-slate-200"
        >
          Cancel
        </button>
        <button
          onClick={saveLesson}
          disabled={savingLesson}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm disabled:opacity-50"
        >
          {savingLesson ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : expandedLessonId === "new" ? (
            <Plus className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {expandedLessonId === "new" ? "Add Lesson" : "Save Lesson"}
        </button>
      </div>
    </div>
  );

  if (loadingModule && isEditMode) {
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
          onClick={() => navigate("/admin/learning-hub")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Learning Module" : "Create Learning Module"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditMode
              ? "Update module details and manage lessons below"
              : "Fill basic details, then save to add lessons"}
          </p>
        </div>
      </div>

      {/* ─── Module form ─────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
          Module Details
        </h2>

        <Field label="Title" required error={errors.title}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. NDIS Basics"
            className={inputCls(errors.title)}
          />
        </Field>

        <Field label="Description" required error={errors.description}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="What will learners get out of this module?"
            className={`${inputCls(errors.description)} resize-none`}
          />
        </Field>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Category" required error={errors.category}>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Plan Management"
              className={inputCls(errors.category)}
            />
          </Field>
          <Field label="Difficulty">
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className={inputCls(false)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Available For">
  <select
    name="audience"
    value={form.audience}
    onChange={handleChange}
    className={inputCls(false)}
  >
    {audienceOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</Field>
        </div>

        <Field label="Thumbnail (optional)">
          <FileUploadPreview
            value={form.thumbnail}
            onChange={(url) =>
              setForm((prev) => ({ ...prev, thumbnail: url || "" }))
            }
            accept="image/*"
            folder="learning-modules/thumbnails"
            maxSizeMb={5}
            placeholder="Upload a cover image"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Paid Module">
            <select
              name="is_paid"
              value={form.is_paid}
              onChange={handleChange}
              className={inputCls(false)}
            >
              <option value={0}>Free (everyone)</option>
              <option value={1}>Paid (premium only)</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputCls(false)}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate("/admin/learning-hub")}
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
            {isEditMode ? "Save Module" : "Create Module"}
          </button>
        </div>
      </div>

      {/* ─── Lessons section (edit mode only) ───── */}
      {isEditMode && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                Lessons
                <span className="text-xs font-medium text-slate-400">
                  ({lessons.length})
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add lessons participants will work through
              </p>
            </div>
            {expandedLessonId !== "new" && (
              <button
                onClick={openAddLesson}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm"
              >
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            )}
          </div>

          <div className="p-6 space-y-3">
            {expandedLessonId === "new" && renderLessonForm()}

            {lessons.length === 0 && expandedLessonId !== "new" && (
              <div className="text-center py-10">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No lessons yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Click <span className="font-semibold">Add Lesson</span> above to get started
                </p>
              </div>
            )}

            {lessons
              .slice()
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((lesson, idx) =>
                expandedLessonId === lesson.id ? (
                  <div key={lesson.id}>{renderLessonForm()}</div>
                ) : (
                  <div
                    key={lesson.id}
                    className="border border-slate-100 rounded-xl hover:border-purple-200 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {lesson.order || idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          {lesson.video_url && (
                            <span className="inline-flex items-center gap-1">
                              <Video className="w-3 h-3" /> Video
                            </span>
                          )}
                          {lesson.attachment_url && (
                            <span className="inline-flex items-center gap-1">
                              {lesson.attachment_type === "pdf" ? (
                                <FileText className="w-3 h-3" />
                              ) : lesson.attachment_type === "image" ? (
                                <ImageIcon className="w-3 h-3" />
                              ) : (
                                <FileIcon className="w-3 h-3" />
                              )}
                              {(lesson.attachment_type || "file").toUpperCase()}
                            </span>
                          )}
                          {lesson.duration_minutes > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration_minutes} min
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEditLesson(lesson)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit lesson"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteLessonId(lesson.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
          </div>
        </div>
      )}

      {!isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Save the module first — then you can add lessons here.
          </p>
        </div>
      )}

      {/* Delete lesson modal */}
      {deleteLessonId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteLessonId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Lesson?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The lesson will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteLessonId(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLesson}
                  disabled={deletingLesson}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingLesson && <Loader2 className="w-4 h-4 animate-spin" />}
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

export default LearningModuleFormPage;