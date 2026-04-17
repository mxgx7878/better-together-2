// ─── Profile API Service ────────────────────────────────────────
// All API calls for profile management (self-update & admin CRUD).

import api from "./api";

// ═══════════════════════════════════════════════════════════════════
// SELF — Profile update (participant & provider update their own)
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/user/profile
 * Returns the authenticated user's full profile (with provider_profile or participant_profile)
 */
export const fetchMyProfile = () => api.get("/user/profile");

/**
 * PUT /api/user/profile
 * Body: { name, phone_number, location, ... role-specific fields }
 * Updates the currently logged-in user's profile
 */
export const updateMyProfile = (payload) => api.put("/user/profile", payload);

/**
 * POST /api/user/profile/avatar
 * Body: FormData with 'avatar' file
 */
export const uploadAvatar = (formData) => api.post("/user/profile/avatar", formData);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Create & edit any user (participant or provider)
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/admin/users
 * Body: { role, first_name, last_name, email, password, ... }
 * Admin creates a new participant or provider
 */
export const adminCreateUser = (payload) => api.post("/admin/users", payload);

/**
 * PUT /api/admin/users/:id
 * Body: { name, phone_number, location, ... role-specific fields }
 * Admin edits any user's profile
 */
export const adminUpdateUser = (id, payload) => api.put(`/admin/users/${id}`, payload);
