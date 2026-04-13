import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Loader2, Plus, Save } from "lucide-react";
import {
  adminCreateLearningModule,
  adminUpdateLearningModule,
  adminFetchLearningModuleById,
} from "../../store/actions/learningActions";
import { clearSelectedModule } from "../../store/slices/learningSlice";
import { ASYNC_STATUS } from "../../constants";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const emptyForm = {
  title: "",
  description: "",
  category: "",
  difficulty: "beginner",
  thumbnail: "",
  is_paid: 0,
  status: 1,
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

const LearningModuleFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { selectedModule, moduleStatus } = useSelector((s) => s.learning);
  const loadingModule = moduleStatus === ASYNC_STATUS.LOADING;

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) dispatch(adminFetchLearningModuleById(id));
    return () => {
      dispatch(clearSelectedModule());
    };
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && selectedModule) {
      setForm({
        title: selectedModule.title || "",
        description: selectedModule.description || "",
        category: selectedModule.category || "",
        difficulty: selectedModule.difficulty || "beginner",
        thumbnail: selectedModule.thumbnail || "",
        is_paid: Number(selectedModule.is_paid) || 0,
        status: Number(selectedModule.status ?? 1),
      });
    }
  }, [isEditMode, selectedModule]);

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
            ? Number(value)
            : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category.trim()) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      difficulty: form.difficulty,
      thumbnail: form.thumbnail.trim() || null,
      is_paid: Number(form.is_paid),
      status: Number(form.status),
    };

    try {
      if (isEditMode) {
        await dispatch(
          adminUpdateLearningModule({ id, moduleData: payload }),
        ).unwrap();
      } else {
        await dispatch(adminCreateLearningModule(payload)).unwrap();
      }
      navigate("/admin/learning-hub");
    } catch {
      // Toasted by action
    } finally {
      setSaving(false);
    }
  };

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
              ? "Update the module details below"
              : "Fill in the details to create a new learning module"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
            Module Details
          </h2>

          <Field label="Module Title" required error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Understanding Your NDIS Plan"
              className={inputCls(errors.title)}
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe what participants will learn..."
              className={`${inputCls(errors.description)} resize-none`}
            />
          </Field>

          <Field label="Category" required error={errors.category}>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Getting Started, Managing Your Plan"
              className={inputCls(errors.category)}
            />
          </Field>

          <Field label="Thumbnail URL">
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputCls(false)}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
              Settings
            </h2>

            <Field label="Difficulty Level">
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

            <Field label="Access Tier">
              <select
                name="is_paid"
                value={form.is_paid}
                onChange={handleChange}
                className={inputCls(false)}
              >
                <option value={0}>Free (All users)</option>
                <option value={1}>Paid only</option>
              </select>
            </Field>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isEditMode ? "Save Changes" : "Create Module"}
          </button>

          <button
            onClick={() => navigate("/admin/learning-hub")}
            className="w-full py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningModuleFormPage;
