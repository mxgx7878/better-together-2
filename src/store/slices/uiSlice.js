import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoading: false,
  pageLoading: false,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
    setPageLoading(state, action) {
      state.pageLoading = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload;
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead(state, action) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.unread = false;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => (n.unread = false));
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  setPageLoading,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  setNotifications,
} = uiSlice.actions;

// Selectors
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectPageLoading = (state) => state.ui.pageLoading;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadCount = (state) =>
  state.ui.notifications.filter((n) => n.unread).length;

export default uiSlice.reducer;
