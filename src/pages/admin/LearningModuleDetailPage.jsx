import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  Video,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  adminFetchLearningModuleById,
  adminDeleteLesson,
} from "../../store/actions/learningActions";
import { clearSelectedModule } from "../../store/slices/learningSlice";
import { ASYNC_STATUS } from "../../constants";

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
  intermediate: "bg-amber-50 text-amber-700 border-amber-100",
  advanced: "bg-red-50 text-red-700 border-red-100",
};

const LearningModuleDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedModule, moduleStatus } = useSelector((s) => s.learning);
  const loading = moduleStatus === ASYNC_STATUS.LOADING;

  const [deleteLessonId, setDeleteLessonId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) dispatch(adminFetchLearningModuleById(id));
    return () => dispatch(clearSelectedModule());
  }, [id, dispatch]);

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;
    setDeleting(true);
    try {
      await dispatch(adminDeleteLesson(deleteLessonId)).unwrap();
      setDeleteLessonId(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-purple-500" />
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin/learning-hub")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </button>
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <p className="text-slate-500">Module not found.</p>
        </div>
      </div>
    );
  }

  const mod = selectedModule;
  const lessons = mod.lessons || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate("/admin/learning-hub")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/learning-hub/edit/${mod.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Module
          </button>
          <button
            onClick={() =>
              navigate(`/admin/learning-hub/${mod.id}/lessons/create`)
            }
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 px-6 py-8 text-white">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {mod.category && (
                <span className="text-[11px] font-semibold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
                  {mod.category}
                </span>
              )}
              {mod.difficulty && (
                <span className="text-[11px] font-semibold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/20 capitalize">
                  {mod.difficulty}
                </span>
              )}
              {Number(mod.is_paid) === 1 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full">
                  <Lock className="w-2.5 h-2.5" /> PAID
                </span>
              )}
              {Number(mod.status) === 1 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-400/20 text-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300/30">
                  <CheckCircle className="w-2.5 h-2.5" /> ACTIVE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-400/20 text-slate-50 px-2.5 py-1 rounded-full border border-slate-300/30">
                  <XCircle className="w-2.5 h-2.5" /> INACTIVE
                </span>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">{mod.title}</h1>
          {mod.description && (
            <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
              {mod.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-5 text-sm">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{lessons.length} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Lessons</h2>
          <span className="text-xs text-slate-400">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
          </span>
        </div>

        {lessons.length === 0 ? (
          <div className="p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No lessons yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Add lessons to build out this module
            </p>
            <button
              onClick={() =>
                navigate(`/admin/learning-hub/${mod.id}/lessons/create`)
              }
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add First Lesson
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {lessons.map((lesson, idx) => (
              <li
                key={lesson.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {lesson.order || idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    {lesson.video_url && (
                      <span className="inline-flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                    {lesson.duration_minutes && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/learning-hub/${mod.id}/lessons/edit/${lesson.id}`,
                      )
                    }
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
              </li>
            ))}
          </ul>
        )}
      </div>

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
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Lesson?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The lesson will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteLessonId(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLesson}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
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

export default LearningModuleDetailPage;
