import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../actions/authAction';

export const mockUsers = {
  providerFree: {
    id: 'prov-001',
    name: 'Sarah Mitchell',
    email: 'sarah@communitycare.com.au',
    password: 'provider123',
    role: 'provider',
    tier: 'free',
    organisation: 'Community Care Solutions',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-11-15',
    profileComplete: 65,
  },
  providerPaid: {
    id: 'prov-002',
    name: 'Sarah Mitchell',
    email: 'sarah.paid@communitycare.com.au',
    password: 'provider456',
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
  participantFree: {
    id: 'part-001',
    name: 'James Chen',
    email: 'james@email.com',
    password: 'participant123',
    role: 'participant',
    tier: 'free',
    avatar: null,
    location: 'Sydney, NSW',
    joinedDate: '2025-01-10',
    profileComplete: 70,
  },
  participantPaid: {
    id: 'part-002',
    name: 'James Chen',
    email: 'james.paid@email.com',
    password: 'participant456',
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
  admin: {
    id: 'admin-001',
    name: 'Sue Dymond',
    email: 'admin@bettertogether.com.au',
    password: 'admin123',
    role: 'admin',
    tier: 'paid',
    organisation: 'The Better Together Group',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-01-01',
    profileComplete: 100,
  },
};

// Load persisted auth from localStorage
const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAuthenticated && parsed.currentProfile && mockUsers[parsed.currentProfile]) {
        const userData = { ...mockUsers[parsed.currentProfile] };
        delete userData.password;
        return {
          user: userData,
          isAuthenticated: true,
          currentProfile: parsed.currentProfile,
          loading: false,
          error: null,
        };
      }
    }
  } catch {
    // ignore parse errors
  }
  return null;
};

const persisted = loadAuthFromStorage();

const initialState = persisted || {
  user: null,
  isAuthenticated: false,
  currentProfile: null,
  loading: false,
  error: null,
};

const saveToStorage = (profileKey) => {
  localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, currentProfile: profileKey }));
};

const clearStorage = () => {
  localStorage.removeItem('auth');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentProfile = action.payload.profileKey;
        const userData = { ...mockUsers[action.payload.profileKey] };
        delete userData.password;
        state.user = userData;
        saveToStorage(action.payload.profileKey);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.currentProfile = null;
        state.loading = false;
        state.error = null;
        clearStorage();
      });
  },
});

export default authSlice.reducer;
