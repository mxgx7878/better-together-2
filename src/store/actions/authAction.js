import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, profileKey = 'providerFree' }, { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      // const response = await authService.login(email, password);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { profileKey };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // TODO: Replace with real API call
    // await authService.logout();
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
);

export const switchUserProfile = createAsyncThunk(
  'auth/switchUserProfile',
  async (profileKey, { rejectWithValue }) => {
    try {
      // Validate profile key exists
      const validProfiles = ['providerFree', 'providerPaid', 'participantFree', 'participantPaid', 'admin'];
      if (!validProfiles.includes(profileKey)) {
        return rejectWithValue('Invalid profile');
      }
      return profileKey;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
