import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockUsers } from '../slices/authSlice';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user by email and password
      const matchedEntry = Object.entries(mockUsers).find(
        ([, user]) => user.email === email && user.password === password
      );

      if (!matchedEntry) {
        return rejectWithValue('Invalid email or password');
      }

      const [profileKey] = matchedEntry;
      return { profileKey };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
);

export const switchUserProfile = createAsyncThunk(
  'auth/switchUserProfile',
  async (profileKey, { rejectWithValue }) => {
    try {
      const validProfiles = Object.keys(mockUsers);
      if (!validProfiles.includes(profileKey)) {
        return rejectWithValue('Invalid profile');
      }
      return profileKey;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
