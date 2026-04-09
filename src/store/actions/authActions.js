import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../constants';



export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    console.log('run')
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Laravel validation errors come as { message, errors: { email: [...], password: [...] } }
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          return rejectWithValue(firstError || 'Login failed');
        }
        return rejectWithValue(data.message || 'Invalid credentials');
      }

      // Save token + user to localStorage
      localStorage.setItem('bt_token', data.token);
      localStorage.setItem('bt_user', JSON.stringify(data.user));

      return { user: data.user, token: data.token };
    } catch {
      return rejectWithValue('Network error. Please check your connection.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    const { auth } = getState();
    const token = auth.token;

    // Call logout API (best effort — clear local state regardless)
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch {
      // ignore — we still want to clear local state
    }

    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    return null;
  }
);
