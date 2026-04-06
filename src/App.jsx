import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/errors/ErrorBoundary';
import NotFound from './components/errors/NotFound';

// Auth
import AuthGuard from './components/guards/AuthGuard';
import RoleGuard from './components/guards/RoleGuard';

// Public pages
import LandingPage from './pages/public/LandingPage3';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import FindSupportPage from './pages/public/FindSupportPage';
import ProvideSupportPage from './pages/public/ProvideSupportPage';
import SubscriptionPage from './pages/public/SubscriptionPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import WhatWeDoPage from './pages/public/WhatWeDoPage';
import CalendarPage from './pages/public/CalendarPage';
import BlogPage from './pages/public/BlogPage';
import BusinessDirectoryPage from './pages/public/BusinessDirectoryPage';

// Dashboard layout
import DashboardLayout from './components/dashboard/DashboardLayout';

// Common pages (shared across roles)
import DashboardHome from './pages/common/DashboardHome';
import ProfilePage from './pages/common/ProfilePage';
import EventsPage from './pages/common/EventsPage';
import JobBoardPage from './pages/common/JobBoardPage';
import AISupportPage from './pages/common/AISupportPage';
import UpgradePage from './pages/common/UpgradePage';
import AdminSupportPage from './pages/common/AdminSupportPage';
import DocumentUploadPage from './pages/common/DocumentUploadPage';
import MessagingPage from './pages/common/MessagingPage';

// Provider pages
import DirectoryPage from './pages/provider/DirectoryPage';
import ServiceRequestsPage from './pages/provider/ServiceRequestsPage';
import InnovationLabPage from './pages/provider/InnovationLabPage';
import QAForumPage from './pages/provider/QAForumPage';
import MarketingPage from './pages/provider/MarketingPage';

// Participant pages
import LearningHubPage from './pages/participant/LearningHubPage';
import MessageBoardPage from './pages/participant/MessageBoardPage';
import RightsSafetyPage from './pages/participant/RightsSafetyPage';
import PlanBuddyPage from './pages/participant/PlanBuddyPage';
import LibraryPage from './pages/common/LibraryPage';

// Admin pages
import UserManagementPage from './pages/admin/UserManagementPage';
import ProviderApprovalsPage from './pages/admin/ProviderApprovalsPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import SubscriptionManagementPage from './pages/admin/SubscriptionManagementPage';
import SupportTicketsPage from './pages/admin/SupportTicketsPage';
import ReportsPage from './pages/admin/ReportsPage';
import PlatformSettingsPage from './pages/admin/PlatformSettingsPage';

function App() {
  return (
    <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
              success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ─── Public Routes (with Header/Footer) ──────────────── */}
            <Route
              path="/*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/what-we-do" element={<WhatWeDoPage />} />
                      <Route path="/subscription" element={<SubscriptionPage />} />
                      <Route path="/business-directory" element={<BusinessDirectoryPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/find-support" element={<FindSupportPage />} />
                      <Route path="/provide-support" element={<ProvideSupportPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* ─── Dashboard Routes (protected, own layout) ─── */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <DashboardLayout />
                </AuthGuard>
              }
            >
              <Route index element={<DashboardHome />} />

              {/* Common routes (both provider & participant) */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="jobs" element={<JobBoardPage />} />
              <Route path="ai-support" element={<AISupportPage />} />
              <Route path="upgrade" element={<UpgradePage />} />
              <Route path="admin-support" element={<RoleGuard allowedRoles={['provider', 'participant']}><AdminSupportPage /></RoleGuard>} />
              <Route path="documents" element={<DocumentUploadPage />} />
              <Route path="messaging" element={<MessagingPage />} />

              {/* Provider-specific routes */}
              <Route path="directory" element={<RoleGuard allowedRoles={['provider']}><DirectoryPage /></RoleGuard>} />
              <Route path="requests" element={<RoleGuard allowedRoles={['provider']} requirePaid><ServiceRequestsPage /></RoleGuard>} />
              <Route path="innovation-lab" element={<RoleGuard allowedRoles={['provider']}><InnovationLabPage /></RoleGuard>} />
              <Route path="qa" element={<RoleGuard allowedRoles={['provider']}><QAForumPage /></RoleGuard>} />
              <Route path="marketing" element={<RoleGuard allowedRoles={['provider']} requirePaid><MarketingPage /></RoleGuard>} />

              {/* Participant-specific routes */}
              <Route path="learning" element={<RoleGuard allowedRoles={['participant']}><LearningHubPage /></RoleGuard>} />
              <Route path="services" element={<RoleGuard allowedRoles={['participant']}><DirectoryPage /></RoleGuard>} />
              <Route path="messages" element={<RoleGuard allowedRoles={['participant']}><MessageBoardPage /></RoleGuard>} />
              <Route path="rights-safety" element={<RoleGuard allowedRoles={['participant']}><RightsSafetyPage /></RoleGuard>} />
              <Route path="plan-buddy" element={<RoleGuard allowedRoles={['participant']} requirePaid><PlanBuddyPage /></RoleGuard>} />
              <Route path="library" element={<LibraryPage />} />

              {/* Admin-specific routes */}
              <Route path="admin/users" element={<RoleGuard allowedRoles={['admin']}><UserManagementPage /></RoleGuard>} />
              <Route path="admin/approvals" element={<RoleGuard allowedRoles={['admin']}><ProviderApprovalsPage /></RoleGuard>} />
              <Route path="admin/content" element={<RoleGuard allowedRoles={['admin']}><ContentManagementPage /></RoleGuard>} />
              <Route path="admin/subscriptions" element={<RoleGuard allowedRoles={['admin']}><SubscriptionManagementPage /></RoleGuard>} />
              <Route path="admin/tickets" element={<RoleGuard allowedRoles={['admin']}><SupportTicketsPage /></RoleGuard>} />
              <Route path="admin/reports" element={<RoleGuard allowedRoles={['admin']}><ReportsPage /></RoleGuard>} />
              <Route path="admin/settings" element={<RoleGuard allowedRoles={['admin']}><PlatformSettingsPage /></RoleGuard>} />

              {/* Catch-all for dashboard */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
    </ErrorBoundary>
  );
}

export default App;
