import { createAsyncThunk } from '@reduxjs/toolkit';

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { getState, rejectWithValue }) => {
    try {
      // Simulate API call
      await delay(1000);

      const { auth } = getState();
      const user = auth.dummyUsers[email];

      if (!user) {
        return rejectWithValue('No account found with this email');
      }

      if (user.password !== password) {
        return rejectWithValue('Invalid password');
      }

      // Don't store password in state/localStorage
      const { password: _, ...safeUser } = user;

      // Save to localStorage
      localStorage.setItem('bt_user', JSON.stringify(safeUser));

      return safeUser;
    } catch {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await delay(300);
  localStorage.removeItem('bt_user');
  return null;
});
