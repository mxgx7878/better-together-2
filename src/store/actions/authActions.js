import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.post('/api/login', { email, password });

      // Save token + user to localStorage
      localStorage.setItem('bt_token', data.token);
      localStorage.setItem('bt_user', JSON.stringify(data.user));

      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Call logout API (best effort — clear local state regardless)
    try {
      await api.post('/api/logout');
    } catch {
      // ignore — we still want to clear local state
    }

    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    return null;
  }
);
