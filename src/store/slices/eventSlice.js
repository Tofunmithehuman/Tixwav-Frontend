import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "All") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

// ── Public ───────────────────────────────────────────────────────────────────
export const fetchEvents = createAsyncThunk(
  "event/fetchEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events${toQuery(params)}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load events");
    }
  },
);

export const fetchFeatured = createAsyncThunk(
  "event/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events?featured=true&limit=6`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load events");
    }
  },
);

export const fetchEvent = createAsyncThunk(
  "event/fetchEvent",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events/${idOrSlug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Event not found");
    }
  },
);

// ── Organizer / Admin ────────────────────────────────────────────────────────
export const fetchMyEvents = createAsyncThunk(
  "event/fetchMyEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events/my${toQuery(params)}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load your events");
    }
  },
);

// payload: FormData (supports optional image + JSON-stringified ticketTiers/venue/tags)
export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create event");
    }
  },
);

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update event");
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete event");
    }
  },
);

export const publishEvent = createAsyncThunk(
  "event/publishEvent",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}/publish`, { action });
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Failed to update event",
        code: err.response?.data?.code,
      });
    }
  },
);

const initialState = {
  list: [],
  pagination: null,
  featured: [],
  current: null,
  myEvents: [],
  myPagination: null,
  isLoading: false,
  isLoadingCurrent: false,
  isMutating: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.current = null;
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(fetchFeatured.fulfilled, (state, action) => {
      state.featured = action.payload.events;
    });

    builder
      .addCase(fetchEvent.pending, (state) => {
        state.isLoadingCurrent = true;
        state.current = null;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.current = action.payload.event;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload.events;
        state.myPagination = action.payload.pagination;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createEvent.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isMutating = false;
        state.myEvents.unshift(action.payload.event);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateEvent.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isMutating = false;
        const updated = action.payload.event;
        state.myEvents = state.myEvents.map((e) =>
          e._id === updated._id ? updated : e,
        );
        if (state.current?._id === updated._id) state.current = updated;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      });

    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.myEvents = state.myEvents.filter((e) => e._id !== action.payload);
    });

    builder.addCase(publishEvent.fulfilled, (state, action) => {
      const updated = action.payload.event;
      state.myEvents = state.myEvents.map((e) =>
        e._id === updated._id ? updated : e,
      );
      if (state.current?._id === updated._id) state.current = updated;
    });
  },
});

export const { clearCurrentEvent, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;

export const selectEvents = (state) => state.event.list;
export const selectEventsPagination = (state) => state.event.pagination;
export const selectFeatured = (state) => state.event.featured;
export const selectCurrentEvent = (state) => state.event.current;
export const selectMyEvents = (state) => state.event.myEvents;
export const selectEventsLoading = (state) => state.event.isLoading;
export const selectCurrentLoading = (state) => state.event.isLoadingCurrent;
export const selectEventMutating = (state) => state.event.isMutating;
export const selectEventError = (state) => state.event.error;
