import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../actions/authActions';

// Dummy user data
const dummyUsers = {
  'admin@bettertogether.com': {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@bettertogether.com',
    password: 'admin123',
    role: 'admin',
    tier: 'paid',
    organisation: 'Better Together Network',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-01-01',
    profileComplete: 100,
  },
  'provider.free@test.com': {
    id: 'prov-001',
    name: 'Sarah Mitchell',
    email: 'provider.free@test.com',
    password: 'provider123',
    role: 'provider',
    tier: 'free',
    organisation: 'Community Care Solutions',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-11-15',
    profileComplete: 65,
  },
  'provider.paid@test.com': {
    id: 'prov-002',
    name: 'Sarah Mitchell',
    email: 'provider.paid@test.com',
    password: 'provider123',
    role: 'provider',
    tier: 'paid',
    subscriptionPlan: 'Growth & Referral',
    organisation: 'Community Care Solutions',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-11-15',
    profileComplete: 92,
    analytics: {
      profileViews: 148,
      referralsThisMonth: 12,
      eventEngagement: 8,
      responseRate: '94%',
    },
  },
  'participant.free@test.com': {
    id: 'part-001',
    name: 'James Chen',
    email: 'participant.free@test.com',
    password: 'participant123',
    role: 'participant',
    tier: 'free',
    avatar: null,
    location: 'Sydney, NSW',
    joinedDate: '2025-01-10',
    profileComplete: 70,
  },
  'participant.paid@test.com': {
    id: 'part-002',
    name: 'James Chen',
    email: 'participant.paid@test.com',
    password: 'participant123',
    role: 'participant',
    tier: 'paid',
    subscriptionPlan: 'Personal Support Plus',
    avatar: null,
    location: 'Sydney, NSW',
    joinedDate: '2025-01-10',
    profileComplete: 88,
    planBuddy: {
      name: 'Karen Burgess',
      nextCheckIn: '2026-02-28',
    },
  },
};

// Try to restore user from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('bt_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch {
    // ignore
  }
  return null;
};

const storedUser = loadUserFromStorage();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
  dummyUsers,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // For demo profile switching
    switchProfile(state, action) {
      const email = action.payload;
      const user = state.dummyUsers[email];
      if (user) {
        const { password, ...safeUser } = user;
        state.user = safeUser;
        state.isAuthenticated = true;
        localStorage.setItem('bt_user', JSON.stringify(safeUser));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, switchProfile } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsProvider = (state) => state.auth.user?.role === 'provider';
export const selectIsParticipant = (state) => state.auth.user?.role === 'participant';
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsFree = (state) => state.auth.user?.tier === 'free';
export const selectIsPaid = (state) => state.auth.user?.tier === 'paid';
export const selectDummyUsers = (state) => state.auth.dummyUsers;

export default authSlice.reducer;
