import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.post('/login', { email, password });

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
      await api.post('/logout');
    } catch {
      // ignore
    }

    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    toast.success('Logged out successfully');
    return null;
  }
);

export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post('/register/provider', payload);
      toast.success('Registration successful!');
      return data;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const registerParticipant = createAsyncThunk(
  'auth/registerParticipant',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post('/register/participant', payload);
      toast.success('Registration successful!');
      return data;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/user');
      const user = data?.user || data?.data || data;
      if (user) {
        localStorage.setItem('bt_user', JSON.stringify(user));
      }
      return user;
    } catch (err) {
      return rejectWithValue(err.message || 'Not authenticated');
    }
  }
);
