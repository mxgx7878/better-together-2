import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const adminFetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params = {}, { rejectWithValue }) => { 
    console.log("Fetching users with params:", params);
    try {
      const data = await api.get("/admin/users" , {
        params,
      });
      console.log("Fetched users data:", data.data.data);
      return data.data;
    } catch (err) {
      console.error("Error fetching users:", err);  
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  },
);

export const adminFetchUser = createAsyncThunk(
  "user/adminFetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      return data.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);