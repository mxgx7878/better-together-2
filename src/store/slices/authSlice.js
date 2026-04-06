import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, switchUserProfile } from '../actions/authAction';

const mockUsers = {
  providerFree: {
    id: 'prov-001',
    name: 'Sarah Mitchell',
    email: 'sarah@communitycare.com.au',
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
    email: 'sarah@communitycare.com.au',
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
    email: 'james.chen@email.com',
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
    email: 'james.chen@email.com',
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

const initialState = {
  user: mockUsers.providerFree,
  isAuthenticated: true,
  currentProfile: 'providerFree',
  availableProfiles: Object.keys(mockUsers),
  loading: false,
  error: null,
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
        state.user = mockUsers[action.payload.profileKey];
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
      });

    // Switch Profile
    builder
      .addCase(switchUserProfile.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
        state.user = mockUsers[action.payload];
      });
  },
});

export default authSlice.reducer;
