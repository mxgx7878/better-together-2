import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

export const adminFetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (params = {}, { rejectWithValue }) => { 
    try {
      const data = await api.get("/admin/events" , {
        params,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch events");
    }
  },
);


export const adminCreateEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/events", eventData);
      toast.success('Event created successfully!');
      return data;
    } catch (err) {
      toast.error('Failed to create event');
      return rejectWithValue(err.message || "Failed to create event");
    }
  },
);

export const adminUpdateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {           
    try {
      const data = await api.put(`/admin/events/${id}`, eventData);
      toast.success('Event updated successfully!');

      return data;
    } catch (err) {
      toast.error('Failed to update event');
      return rejectWithValue(err.message || "Failed to update event");
    }   
    },
);

export const adminDeleteEvent = createAsyncThunk(
    "events/deleteEvent",
    async (id, { rejectWithValue }) => {
        try {
            await api.del(`/admin/events/${id}`);
            toast.success('Event deleted successfully!');
            return id;
        } catch (err) {
            toast.error('Failed to delete event');
            return rejectWithValue(err.message || "Failed to delete event");
        }   
    },
);


//Public events for all users

export const fetchPublicEvents = createAsyncThunk(
  "events/fetchPublicEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/events", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch events");
    }
  },
);


export const fetchEventById  = createAsyncThunk(
  "events/fetchEventById ",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/events/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch event details");
    }
  },
);

export const fetchAdminEventById  = createAsyncThunk(
  "events/fetchAdminEventById ",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/events/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch event details");
    }
  },
);


export const rsvpEvent = (id) =>
  api.post(`/events/${id}/rsvp`);

export const cancelRsvp = (id) =>
  api.del(`/events/${id}/rsvp`);