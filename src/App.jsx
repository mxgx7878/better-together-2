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
import FeatureGate from "./components/common/FeatureGate";

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
import TermsAndConditionsPage from "./pages/public/Termsandconditionspage";

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
import EventFormPage from "./pages/admin/EventFormPage";
import EventDetailsPage from "./pages/admin/EventDetailPage";
import ManageMarketingRibbonPage from "./pages/admin/ManageMarketingRibbonPage";
import ManageSafetyNumbersPage from "./pages/admin/ManageSafetyNumbers";

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

// ─── Shared Dashboard Pages ─────────────────────────────────
import ProfilePage from "./pages/shared/ProfilePage";
import EventsPage from "./pages/shared/EventsPage";
import DirectoryPage from "./pages/shared/DirectoryPage";
import JobBoardPage from "./pages/shared/JobBoardPage";
import DocumentUploadPage from "./pages/shared/DocumentUploadPage";
import AISupportPage from "./pages/shared/AISupportPage";
import UpgradePage from "./pages/shared/UpgradePage";
import AdminSupportPage from "./pages/shared/AdminSupportPage";
import LearningModuleDetailPage from "./pages/shared/LearningModuleDetailPage";
import ManageQueriesPage from "./pages/admin/ManageQueriesPage";
import BillingPage from "./pages/shared/BillingPage";
import ManageInnovationLabPage from "./pages/admin/ManageInnovationLabPage";
import InnovationLabResourceFormPage from "./pages/admin/InnovationLabFoam";
import ManagePromoCodesPage from "./pages/admin/ManagePromoCodesPage";
import BulkEmailPage from "./pages/admin/BulkEmailPage";


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
          <Route path="terms" element={<TermsAndConditionsPage />} />
        </Route>

        {/* ─── Auth pages (restricted: redirect if already logged in) */}
        <Route element={<PublicRoute restricted />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ─── Dashboard redirect (role-based) ────────────────── */}
        <Route path="/dashboard" element={<RoleRedirect />} />
      

        {/* ─── Admin Routes (no feature gating — admin bypass) ── */}
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
            <Route path="subscriptions" element={<ManageSubscriptionsPage />} />
            <Route
              path="marketing-ribbon"
              element={<ManageMarketingRibbonPage />}
            />
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

            <Route path="innovation-lab" element={<ManageInnovationLabPage />} />
            <Route
              path="innovation-lab/create"
              element={<InnovationLabResourceFormPage />}
            />
            <Route
              path="innovation-lab/edit/:id"
              element={<InnovationLabResourceFormPage />}
            />
            <Route
              path="analytics"
              element={<AdminPlaceholder title="Analytics" />}
            />
            <Route
              path="settings"
              element={<AdminPlaceholder title="Settings" />}
            />
            <Route
              path="safety-numbers"
              element={<ManageSafetyNumbersPage />}
            />

            <Route path="ai-support" element={<AISupportPage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
            <Route path="promo-codes" element={<ManagePromoCodesPage />} />
            <Route path="broadcast-email" element={<BulkEmailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="events/create" element={<EventFormPage />} />
            <Route path="events/edit/:id" element={<EventFormPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="/admin/queries" element={<ManageQueriesPage />} />
            <Route
              path="/admin/innovation-lab"
              element={<InnovationLabPage />}
            />
          </Route>
        </Route>

        {/* ─── Provider Routes (feature-gated) ────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
          <Route path="/provider" element={<DashboardLayout />}>
            <Route
              index
              element={
                <FeatureGate featureKey="dashboard" featureName="Dashboard">
                  <ProviderDashboardHome />
                </FeatureGate>
              }
            />
            <Route
              path="profile"
              element={
                <FeatureGate featureKey="profile" featureName="Profile">
                  <ProfilePage />
                </FeatureGate>
              }
            />
            <Route
              path="directory"
              element={
                <FeatureGate
                  featureKey="directory"
                  featureName="Business Directory"
                >
                  <DirectoryPage />
                </FeatureGate>
              }
            />
            <Route
              path="jobs"
              element={
                <FeatureGate featureKey="job_board" featureName="Job Board">
                  <JobBoardPage />
                </FeatureGate>
              }
            />
            <Route
              path="events"
              element={
                <FeatureGate
                  featureKey="events"
                  featureName="Events & Networking"
                >
                  <EventsPage />
                </FeatureGate>
              }
            />
            <Route
              path="innovation-lab"
              element={
                <FeatureGate
                  featureKey="innovation_lab"
                  featureName="Innovation Lab"
                >
                  <InnovationLabPage />
                </FeatureGate>
              }
            />
            <Route
              path="learning"
              element={
                <FeatureGate
                  featureKey="learning_hub"
                  featureName="Learning Hub"
                >
                  <ProviderLearningHubPage />
                </FeatureGate>
              }
            />
            <Route
              path="learning/:id"
              element={
                <FeatureGate
                  featureKey="learning_hub"
                  featureName="Learning Hub"
                >
                  <LearningModuleDetailPage />
                </FeatureGate>
              }
            />
            <Route
              path="qa"
              element={
                <FeatureGate featureKey="qa" featureName="Q & A">
                  <QAForumPage />
                </FeatureGate>
              }
            />
            <Route
              path="documents"
              element={
                <FeatureGate featureKey="documents" featureName="Documents">
                  <DocumentUploadPage />
                </FeatureGate>
              }
            />

            {/* No gate on upgrade & admin-support — always accessible */}
            <Route path="billing" element={<BillingPage />} />

            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
          </Route>
        </Route>

        {/* ─── Participant Routes (feature-gated) ──────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
          <Route path="/participant" element={<DashboardLayout />}>
            <Route
              index
              element={
                <FeatureGate featureKey="dashboard" featureName="Dashboard">
                  <ParticipantDashboardHome />
                </FeatureGate>
              }
            />
            <Route
              path="profile"
              element={
                <FeatureGate featureKey="profile" featureName="Profile">
                  <ProfilePage />
                </FeatureGate>
              }
            />
            <Route
              path="services"
              element={
                <FeatureGate
                  featureKey="directory"
                  featureName="Provider Directory"
                >
                  <DirectoryPage />
                </FeatureGate>
              }
            />
            <Route
              path="learning"
              element={
                <FeatureGate
                  featureKey="learning_hub"
                  featureName="Learning Hub"
                >
                  <LearningHubPage />
                </FeatureGate>
              }
            />
            <Route
              path="learning/:id"
              element={
                <FeatureGate
                  featureKey="learning_hub"
                  featureName="Learning Hub"
                >
                  <LearningModuleDetailPage />
                </FeatureGate>
              }
            />
            <Route
              path="qa"
              element={
                <FeatureGate featureKey="qa" featureName="Q & A">
                  <QAForumPage />
                </FeatureGate>
              }
            />
            <Route
              path="documents"
              element={
                <FeatureGate featureKey="documents" featureName="Documents">
                  <DocumentUploadPage />
                </FeatureGate>
              }
            />
            <Route
              path="looking-for-services"
              element={
                <FeatureGate
                  featureKey="looking_for_services"
                  featureName="Looking for Services"
                >
                  <LookingForServicesPage />
                </FeatureGate>
              }
            />
            {/* <Route path="events" element={<EventsPage />} /> */}
            <Route
              path="rights-safety"
              element={
                <FeatureGate
                  featureKey="rights_safety"
                  featureName="Rights & Safety"
                >
                  <RightsSafetyPage />
                </FeatureGate>
              }
            />
            <Route
              path="plan-buddy"
              element={
                <FeatureGate
                  featureKey="plan_buddy"
                  featureName="Your Buddy's Profile"
                >
                  <PlanBuddyPage />
                </FeatureGate>
              }
            />

            {/* No gate on upgrade & admin-support — always accessible */}
            <Route path="billing" element={<BillingPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
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
