import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.post('/api/login', { email, password });

      localStorage.setItem('bt_token', data.token);
      localStorage.setItem('bt_user', JSON.stringify(data.user));

      toast.success('Login successful!');
      return { user: data.user, token: data.token };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await api.post('/api/logout');
    } catch {
      // ignore
    }

    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    toast.success('Logged out successfully');
    return null;
  }
);
