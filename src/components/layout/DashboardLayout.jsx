import { useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import PendingBanner from '../common/PendingBanner';
import { PageLoader, GlobalLoader } from '../common/Loader';
import {
  selectSidebarCollapsed,
  selectMobileMenuOpen,
  setSidebarCollapsed,
  setMobileMenuOpen,
  toggleSidebar,
  selectGlobalLoading,
  selectPageLoading,
} from '../../store/slices/uiSlice';
import {
  selectIsAuthenticated,
  selectIsAdmin,
} from '../../store/slices/authSlice';
import { fetchMySubscription } from '../../store/actions/subscriptionActions';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const mobileMenuOpen = useSelector(selectMobileMenuOpen);
  const globalLoading = useSelector(selectGlobalLoading);
  const pageLoading = useSelector(selectPageLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  // ─── Bootstrap the user's subscription on dashboard mount ──────────
  // This single fetch hydrates state.subscription.mySubscription which is
  // the primary source for ALL plan-based selectors (selectIsPaid,
  // selectPlanFeatureKeys, selectHasFeature, etc.). Until this completes,
  // FeatureGate shows a spinner instead of committing to a stale decision.
  //
  // Admins are skipped because they bypass all gating anyway.
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchMySubscription());
    }
  }, [dispatch, isAuthenticated, isAdmin , location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
  }, [location.pathname, dispatch]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        dispatch(setMobileMenuOpen(false));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarCollapsed(true));
    }
  }, [dispatch]);

  const closeMobileMenu = useCallback(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch]);

  const handleToggle = useCallback(() => {
    if (window.innerWidth < 1024) {
      dispatch(setMobileMenuOpen(false));
    } else {
      dispatch(toggleSidebar());
    }
  }, [dispatch]);

  const handleMobileMenuToggle = useCallback(() => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen));
  }, [dispatch, mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {globalLoading && <GlobalLoader />}

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <DashboardSidebar
          isCollapsed={sidebarCollapsed}
          isMobile={mobileMenuOpen}
          onToggle={handleToggle}
          onMobileClose={closeMobileMenu}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ml-0`}
      >
        <PendingBanner />
        <DashboardTopbar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        <main className="p-3 sm:p-6 lg:p-8">
          {pageLoading ? <PageLoader /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;