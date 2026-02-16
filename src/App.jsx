import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
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
import PlaceholderPage from './pages/dashboard/PlaceholderPage';

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
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/find-support" element={<FindSupportPage />} />
                    <Route path="/provide-support" element={<ProvideSupportPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/landing2" element={<LandingPage2 />} />
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
            <Route path="events" element={<PlaceholderPage pageKey="events" />} />
            <Route path="library" element={<PlaceholderPage pageKey="library" />} />
            <Route path="jobs" element={<PlaceholderPage pageKey="jobs" />} />
            <Route path="ai-support" element={<PlaceholderPage pageKey="ai-support" />} />
            <Route path="upgrade" element={<PlaceholderPage pageKey="upgrade" />} />
            <Route path="admin-support" element={<PlaceholderPage pageKey="admin-support" />} />
            <Route path="profile" element={<PlaceholderPage pageKey="profile" />} />

            {/* Provider-specific routes */}
            <Route path="directory" element={<PlaceholderPage pageKey="directory" />} />
            <Route path="requests" element={<PlaceholderPage pageKey="requests" />} />
            <Route path="innovation-lab" element={<PlaceholderPage pageKey="innovation-lab" />} />
            <Route path="qa" element={<PlaceholderPage pageKey="qa" />} />
            <Route path="marketing" element={<PlaceholderPage pageKey="marketing" />} />

            {/* Participant-specific routes */}
            <Route path="learning" element={<PlaceholderPage pageKey="learning" />} />
            <Route path="services" element={<PlaceholderPage pageKey="services" />} />
            <Route path="messages" element={<PlaceholderPage pageKey="messages" />} />
            <Route path="rights-safety" element={<PlaceholderPage pageKey="rights-safety" />} />
            <Route path="plan-buddy" element={<PlaceholderPage pageKey="plan-buddy" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;