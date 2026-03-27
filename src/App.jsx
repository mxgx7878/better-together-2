import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage3 from './pages/LandingPage3';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import FindSupportPage from './pages/FindSupportPage';
import ProvideSupportPage from './pages/ProvideSupportPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import ScrollToTop from './components/ScrollToTop';

// Dashboard imports
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';

// Dashboard pages
import ProfilePage from './pages/dashboard/ProfilePage';
import EventsPage from './pages/dashboard/EventsPage';
import DirectoryPage from './pages/dashboard/DirectoryPage';
import ServiceRequestsPage from './pages/dashboard/ServiceRequestsPage';
import InnovationLabPage from './pages/dashboard/InnovationLabPage';
import LibraryPage from './pages/dashboard/LibraryPage';
import QAForumPage from './pages/dashboard/QAForumPage';
import JobBoardPage from './pages/dashboard/JobBoardPage';
import MarketingPage from './pages/dashboard/MarketingPage';
import AISupportPage from './pages/dashboard/AISupportPage';
import UpgradePage from './pages/dashboard/UpgradePage';
import AdminSupportPage from './pages/dashboard/AdminSupportPage';
import LearningHubPage from './pages/dashboard/LearningHubPage';
import MessageBoardPage from './pages/dashboard/MessageBoardPage';
import RightsSafetyPage from './pages/dashboard/RightsSafetyPage';
import PlanBuddyPage from './pages/dashboard/PlanBuddyPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ─── Public Routes (with Header/Footer) ──────────────── */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<LandingPage3 />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/find-support" element={<FindSupportPage />} />
                    <Route path="/provide-support" element={<ProvideSupportPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/landing3" element={<LandingPage3 />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* ─── Dashboard Routes (own layout, no Header/Footer) ─── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Shared routes (both provider & participant) */}
            <Route path="events" element={<EventsPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="jobs" element={<JobBoardPage />} />
            <Route path="ai-support" element={<AISupportPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="admin-support" element={<AdminSupportPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Provider-specific routes */}
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="requests" element={<ServiceRequestsPage />} />
            <Route path="innovation-lab" element={<InnovationLabPage />} />
            <Route path="qa" element={<QAForumPage />} />
            <Route path="marketing" element={<MarketingPage />} />

            {/* Participant-specific routes */}
            <Route path="learning" element={<LearningHubPage />} />
            <Route path="services" element={<DirectoryPage />} />
            <Route path="messages" element={<MessageBoardPage />} />
            <Route path="rights-safety" element={<RightsSafetyPage />} />
            <Route path="plan-buddy" element={<PlanBuddyPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;