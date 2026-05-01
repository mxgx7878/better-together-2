import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";
import { selectIsAuthenticated, selectUser } from "./store/slices/authSlice";
import { checkAuth } from "./store/actions/authActions";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRedirect from "./routes/RoleRedirect";

// ─── Public Pages ───────────────────────────────────────────
import LandingPage from "./pages/public/LandingPage";
import WhatWeDoPage from "./pages/public/WhatWeDoPage";
import SubscriptionPage from "./pages/public/SubscriptionPage";
import BusinessDirectoryPage from "./pages/public/BusinessDirectoryPage";
import CalendarPage from "./pages/public/CalendarPage";
import BlogPage from "./pages/public/BlogPage";
import ContactPage from "./pages/public/ContactPage";
import AboutPage from "./pages/public/AboutPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

// ─── Admin Pages ────────────────────────────────────────────
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import ManageCategoriesPage from "./pages/admin/ManageCategoriesPage";
import ManageSubscriptionsPage from "./pages/admin/ManageSubscriptionsPage";
import ManageDocumentsPage from "./pages/admin/ManageDocumentsPage";
import ManageLearningHubPage from "./pages/admin/ManageLearningHubPage";
import LearningModuleFormPage from "./pages/admin/LearningModuleFormPage";
import AdminLearningModuleDetailPage from "./pages/admin/LearningModuleDetailPage";
import LearningLessonFormPage from "./pages/admin/LearningLessonFormPage";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import UserFormPage from "./pages/admin/UserFormPage";
import ManageServiceRequestsPage from "./pages/admin/ManageServiceRequestsPage";

// ─── Provider Pages ─────────────────────────────────────────
import ProviderDashboardHome from "./pages/provider/ProviderDashboardHome";
import InnovationLabPage from "./pages/provider/InnovationLabPage";
import QAForumPage from "./pages/provider/QAForumPage";
import ProviderLearningHubPage from "./pages/provider/LearningHubPage";

// ─── Participant Pages ──────────────────────────────────────
import ParticipantDashboardHome from "./pages/participant/ParticipantDashboardHome";
import LearningHubPage from "./pages/participant/LearningHubPage";
import LookingForServicesPage from "./pages/participant/LookingForServicesPage";
import RightsSafetyPage from "./pages/participant/RightsSafetyPage";
import PlanBuddyPage from "./pages/participant/PlanBuddyPage";

// ─── Shared Dashboard Pages ────────────────────────────────
import ProfilePage from "./pages/shared/ProfilePage";
import EventsPage from "./pages/shared/EventsPage";
import DirectoryPage from "./pages/shared/DirectoryPage";
import JobBoardPage from "./pages/shared/JobBoardPage";
import DocumentUploadPage from "./pages/shared/DocumentUploadPage";
import AISupportPage from "./pages/shared/AISupportPage";
import UpgradePage from "./pages/shared/UpgradePage";
import AdminSupportPage from "./pages/shared/AdminSupportPage";
import LearningModuleDetailPage from "./pages/shared/LearningModuleDetailPage";
import EventFormPage from "./pages/admin/EventFormPage";
import EventDetailsPage from "./pages/admin/EventDetailPage";
import ManageMarketingRibbonPage from "./pages/admin/ManageMarketingRibbonPage";

// Catch-all: if logged in go to dashboard, otherwise go home
function CatchAll() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  if (isAuthenticated && user) {
    const map = {
      admin: "/admin",
      provider: "/provider",
      participant: "/participant",
    };
    return (
      <Navigate to={map[(user.role || "").toLowerCase()] || "/"} replace />
    );
  }
  return <Navigate to="/" replace />;
}

function App() {
  const dispatch = useDispatch();

  // Verify token on app load by calling /user
  useEffect(() => {
    const token = localStorage.getItem("bt_token");
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <ScrollToTop />
      <Routes>
        {/* ─── Public Routes (with Header/Footer) ────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/what-we-do" element={<WhatWeDoPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route
            path="/business-directory"
            element={<BusinessDirectoryPage />}
          />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* ─── Auth pages (restricted: redirect if already logged in) */}
        <Route element={<PublicRoute restricted />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ─── Dashboard redirect (role-based) ────────────────── */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* ─── Admin Routes ──────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="users/create" element={<UserFormPage />} />
            <Route path="users/:id/edit" element={<UserFormPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="events" element={<ManageEventsPage />} />
            <Route path="categories" element={<ManageCategoriesPage />} />
            <Route
              path="service-requests"
              element={<ManageServiceRequestsPage />}
            />
            <Route
              path="subscriptions"
              element={<ManageSubscriptionsPage />}
            />
            <Route path="marketing-ribbon" element={<ManageMarketingRibbonPage />} />
            <Route path="documents" element={<ManageDocumentsPage />} />
            <Route path="learning-hub" element={<ManageLearningHubPage />} />
            <Route
              path="learning-hub/create"
              element={<LearningModuleFormPage />}
            />
            <Route
              path="learning-hub/edit/:id"
              element={<LearningModuleFormPage />}
            />
            <Route
              path="learning-hub/:id"
              element={<AdminLearningModuleDetailPage />}
            />
            <Route
              path="learning-hub/:moduleId/lessons/create"
              element={<LearningLessonFormPage />}
            />
            <Route
              path="learning-hub/:moduleId/lessons/edit/:lessonId"
              element={<LearningLessonFormPage />}
            />
            <Route
              path="analytics"
              element={<AdminPlaceholder title="Analytics" />}
            />
            <Route
              path="settings"
              element={<AdminPlaceholder title="Settings" />}
            />
            <Route path="ai-support" element={<AISupportPage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="events/create" element={<EventFormPage />} />
            <Route path="events/edit/:id" element={<EventFormPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
          </Route>
        </Route>

        {/* ─── Provider Routes ────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
          <Route path="/provider" element={<DashboardLayout />}>
            <Route index element={<ProviderDashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="jobs" element={<JobBoardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="innovation-lab" element={<InnovationLabPage />} />
            <Route path="learning" element={<ProviderLearningHubPage />} />
            <Route path="learning/:id" element={<LearningModuleDetailPage />} />
            <Route path="qa" element={<QAForumPage />} />
            <Route path="documents" element={<DocumentUploadPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
          </Route>
        </Route>

        {/* ─── Participant Routes ─────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
          <Route path="/participant" element={<DashboardLayout />}>
            <Route index element={<ParticipantDashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="services" element={<DirectoryPage />} />
            <Route path="learning" element={<LearningHubPage />} />
            <Route path="learning/:id" element={<LearningModuleDetailPage />} />
            <Route path="qa" element={<QAForumPage />} />
            <Route path="documents" element={<DocumentUploadPage />} />
            <Route
              path="looking-for-services"
              element={<LookingForServicesPage />}
            />
            <Route path="events" element={<EventsPage />} />
            <Route path="rights-safety" element={<RightsSafetyPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="plan-buddy" element={<PlanBuddyPage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
          </Route>
        </Route>

        {/* ─── Catch-all: unknown routes go home ─────────────── */}
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </Router>
  );
}

export default App;
