import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import FloatingAIChat from './FloatingAIChat';
import useAuth from '../../hooks/useAuth';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - on mobile: slide in/out, always expanded; on desktop: toggle collapse */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <DashboardSidebar
          isCollapsed={sidebarCollapsed}
          isMobile={mobileMenuOpen}
          onToggle={() => {
            if (window.innerWidth < 1024) {
              setMobileMenuOpen(false);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          onMobileClose={closeMobileMenu}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ml-0`}
      >
        {/* Top Bar */}
        <DashboardTopbar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Chat Widget */}
      <FloatingAIChat />
    </div>
  );
};

export default DashboardLayout;
