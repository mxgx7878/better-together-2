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

function App() {
  return (
    <Router>
      <ScrollToTop />
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
    </Router>
  );
}

export default App;