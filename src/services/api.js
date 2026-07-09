// ─── API Instance ───────────────────────────────────────────────
// Centralized fetch wrapper with base URL, auth headers, error handling.
// Every service file imports this instead of using raw fetch().

import { API_BASE_URL } from "../constants";

const BASE_URL = API_BASE_URL || '';

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bt_token');

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, let browser set Content-Type (multipart boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // Handle 401 — token expired / invalid
  if (response.status === 401) {
    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    if(window.location.pathname !== '/login') {
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
      return;
    }
    throw new Error(data.error || 'Unauthorized');
  }


  if (!response.ok) {
    // Try multiple validation error shapes:
    //   1. Standard Laravel:   { message, errors: { field: [...] } }
    //   2. Custom BTN format:  { status: false, error: { field: [...] } }
    //   3. Custom BTN format:  { status: false, error: "string message" }
    //   4. Plain message:      { message: "..." }
    const validationErrors = data.errors || data.error;

    // Case: validation errors is an object with field arrays
    if (validationErrors && typeof validationErrors === 'object' && !Array.isArray(validationErrors)) {
      console.log(data);
      const firstError = Object.values(validationErrors).flat()[0];
      throw new Error(firstError || data.message || 'Request failed');
    }

    // Case: error is a plain string
    if (typeof validationErrors === 'string') {
      console.log(data);
      throw new Error(validationErrors);
    }

    console.log(data);
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ─── Shorthand methods ──────────────────────────────────────────

api.get = (endpoint, params = {}) => {
  const query = new URLSearchParams(params.params).toString();

  const url = query ? `${endpoint}?${query}` : endpoint;

  return api(url, { method: "GET" });
};

api.post = (endpoint, body) =>
  api(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

api.put = (endpoint, body) =>
  api(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

api.patch = (endpoint, body) =>
  api(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

api.del = (endpoint) => api(endpoint, { method: 'DELETE' });

export default api;
