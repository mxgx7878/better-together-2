import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../actions/authActions';

// Dummy users kept for demo profile switcher only
const dummyUsers = {
  'admin@together.com': { role: 'admin' },
  'provider.free@test.com': { role: 'provider', tier: 'free' },
  'provider.paid@test.com': { role: 'provider', tier: 'paid' },
  'participant.free@test.com': { role: 'participant', tier: 'free' },
  'participant.paid@test.com': { role: 'participant', tier: 'paid' },
};

// Restore from localStorage on app load
const loadFromStorage = () => {
  try {
    const user = localStorage.getItem('bt_user');
    const token = localStorage.getItem('bt_token');
    if (user && token) {
      return { user: JSON.parse(user), token };
    }
  } catch {
    // ignore
  }
  return { user: null, token: null };
};

const stored = loadFromStorage();

const initialState = {
  user: stored.user,
  token: stored.token,
  isAuthenticated: !!stored.token,
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
    // For demo profile switching (sets user locally, no API call)
    switchProfile(state, action) {
      const email = action.payload;
      const dummy = state.dummyUsers[email];
      if (dummy) {
        // Build a minimal user object for demo switching
        const user = {
          ...state.user,
          email,
          role: dummy.role,
          tier: dummy.tier || 'paid',
        };
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('bt_user', JSON.stringify(user));
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, switchProfile } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
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
