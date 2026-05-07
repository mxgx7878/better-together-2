import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Loader2,
  Video,
  Lock,
  CheckCircle2,
  Circle,
  PlayCircle,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Download,
} from "lucide-react";
import {
  fetchLearningModuleById,
  fetchMyLearningProgress,
  markLessonComplete,
} from "../../store/actions/learningActions";
import { clearSelectedModule } from "../../store/slices/learningSlice";
import { ASYNC_STATUS } from "../../constants";
import {
  selectIsPaid,
  selectIsParticipant,
} from "../../store/slices/authSlice";

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
  intermediate: "bg-amber-50 text-amber-700 border-amber-100",
  advanced: "bg-red-50 text-red-700 border-red-100",
};

const LearningModuleDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPaid = useSelector(selectIsPaid);
  const isParticipant = useSelector(selectIsParticipant);

  const { selectedModule, moduleStatus, progress } = useSelector(
    (s) => s.learning,
  );
  const loading = moduleStatus === ASYNC_STATUS.LOADING;

  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchLearningModuleById(id));
    if (isParticipant) dispatch(fetchMyLearningProgress());
    return () => dispatch(clearSelectedModule());
  }, [id, dispatch, isParticipant]);

  const basePath = isParticipant
    ? "/participant/learning"
    : "/provider/learning";

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
          onClick={() => navigate(basePath)}
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
  const isLocked = Number(mod.is_paid) === 1 && !isPaid;
  const lessons = mod.lessons || [];

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed_at).map((p) => p.lesson_id),
  );

  const completedCount = lessons.filter((l) =>
    completedLessonIds.has(l.id),
  ).length;
  const progressPct = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const handleMarkComplete = async (lessonId) => {
    setCompletingId(lessonId);
    try {
      await dispatch(markLessonComplete(lessonId)).unwrap();
    } finally {
      setCompletingId(null);
    }
  };

  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(basePath)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </button>
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            This module is for paid members
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Upgrade your plan to unlock this and all other premium learning
            modules.
          </p>
          <button
            onClick={() =>
              navigate(
                isParticipant ? "/participant/upgrade" : "/provider/upgrade",
              )
            }
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate(basePath)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Hub
      </button>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl px-6 py-8 text-white">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {mod.category && (
            <span className="text-[11px] font-semibold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
              {mod.category}
            </span>
          )}
          {mod.difficulty && (
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${
                difficultyColors[mod.difficulty?.toLowerCase()] ||
                "bg-white/20 text-white border-white/20"
              }`}
            >
              {mod.difficulty}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{mod.title}</h1>
        {mod.description && (
          <p className="text-white/80 text-sm leading-relaxed max-w-3xl">
            {mod.description}
          </p>
        )}

        <div className="flex items-center gap-5 mt-5 text-sm flex-wrap">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{lessons.length} lessons</span>
          </div>
          {isParticipant && lessons.length > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">
                {progressPct}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No lessons available yet</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lessons sidebar */}
          <div className="lg:col-span-1 space-y-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-fit">
            <h2 className="text-sm font-bold text-slate-700 px-2 mb-2">
              Lessons
            </h2>
            {lessons.map((lesson, idx) => {
              const isComplete = completedLessonIds.has(lesson.id);
              const isActive = activeLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {idx + 1}. {lesson.title}
                    </p>
                    {lesson.duration_minutes > 0 && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes} min
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active lesson */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {activeLesson ? (
              <>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {activeLesson.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  {activeLesson.duration_minutes > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeLesson.duration_minutes} min
                    </span>
                  )}
                  {activeLesson.video_url && (
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video lesson
                    </span>
                  )}
                </div>

                {activeLesson.video_url && (
                  <div className="aspect-video bg-slate-900 rounded-xl mb-5 flex items-center justify-center">
                    <a
                      href={activeLesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
                    >
                      <PlayCircle className="w-12 h-12" />
                      <span className="text-sm font-medium">Watch video</span>
                    </a>
                  </div>
                )}

                {activeLesson.content && (
                  <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {activeLesson.content}
                  </div>
                )}

                {activeLesson.attachment_url && (
                  <div className="mt-6 p-4 border border-slate-200 bg-slate-50/60 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      {activeLesson.attachment_type === "pdf" ? (
                        <FileText className="w-5 h-5" />
                      ) : activeLesson.attachment_type === "image" ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : (
                        <FileIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {activeLesson.attachment_name || "Lesson resource"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(activeLesson.attachment_type || "file").toUpperCase()}
                        {activeLesson.attachment_size
                          ? ` · ${(activeLesson.attachment_size / 1024 / 1024).toFixed(2)} MB`
                          : ""}
                      </p>
                    </div>
                    <a
                      href={activeLesson.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={activeLesson.attachment_name}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex-shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                )}

                {activeLesson.attachment_type === "image" &&
                  activeLesson.attachment_url && (
                    <img
                      src={activeLesson.attachment_url}
                      alt={activeLesson.attachment_name || ""}
                      className="mt-4 rounded-xl max-h-96 object-contain border border-slate-200"
                    />
                  )}

                {isParticipant && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    {completedLessonIds.has(activeLesson.id) ? (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        Lesson completed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkComplete(activeLesson.id)}
                        disabled={completingId === activeLesson.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow text-sm disabled:opacity-50"
                      >
                        {completingId === activeLesson.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                Select a lesson to begin
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModuleDetailPage;
