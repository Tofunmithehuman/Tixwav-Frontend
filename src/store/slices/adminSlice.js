import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// ── Analytics ────────────────────────────────────────────────────────────────
export const fetchAdminOverview = createAsyncThunk(
  "admin/overview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/overview");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  },
);

export const fetchAdminRevenue = createAsyncThunk(
  "admin/revenue",
  async (period = "30days", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/revenue?period=${period}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load revenue");
    }
  },
);

export const fetchAdminEventAnalytics = createAsyncThunk(
  "admin/eventAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/events");
      return data.events;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load event analytics");
    }
  },
);

export const fetchAdminTicketAnalytics = createAsyncThunk(
  "admin/ticketAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/tickets");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load ticket analytics");
    }
  },
);

// ── Users ────────────────────────────────────────────────────────────────────
export const fetchAllUsers = createAsyncThunk(
  "admin/users",
  async (params = {}, { rejectWithValue }) => {
    try {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") q.append(k, v);
      });
      const { data } = await api.get(`/users?${q}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load users");
    }
  },
);

export const setUserRole = createAsyncThunk(
  "admin/setUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}/role`, { role });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
  },
);

export const toggleUserStatus = createAsyncThunk(
  "admin/toggleUserStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}/toggle-status`);
      return { id, isActive: data.isActive };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
  },
);

// ── Events (management) ──────────────────────────────────────────────────────
export const fetchAllEvents = createAsyncThunk(
  "admin/events",
  async (params = {}, { rejectWithValue }) => {
    try {
      const q = new URLSearchParams({ status: "all", limit: 50, ...params });
      const { data } = await api.get(`/events?${q}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load events");
    }
  },
);

export const setEventStatus = createAsyncThunk(
  "admin/setEventStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}/status`, { status });
      return data.event;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update event");
    }
  },
);

export const featureEvent = createAsyncThunk(
  "admin/featureEvent",
  async ({ id, featured }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}/feature`, { featured });
      return data.event;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update event");
    }
  },
);

export const adminDeleteEvent = createAsyncThunk(
  "admin/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete event");
    }
  },
);

// ── Orders ───────────────────────────────────────────────────────────────────
export const fetchAllOrders = createAsyncThunk(
  "admin/orders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") q.append(k, v);
      });
      const { data } = await api.get(`/orders?${q}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load orders");
    }
  },
);

const initialState = {
  overview: null,
  recentOrders: [],
  revenue: [],
  eventAnalytics: [],
  ticketAnalytics: null,
  users: [],
  usersPagination: null,
  events: [],
  eventsPagination: null,
  orders: [],
  ordersPagination: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload.stats;
        state.recentOrders = action.payload.recentOrders || [];
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(fetchAdminRevenue.fulfilled, (state, action) => {
      state.revenue = action.payload.data;
    });
    builder.addCase(fetchAdminEventAnalytics.fulfilled, (state, action) => {
      state.eventAnalytics = action.payload;
    });
    builder.addCase(fetchAdminTicketAnalytics.fulfilled, (state, action) => {
      state.ticketAnalytics = action.payload;
    });

    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(setUserRole.fulfilled, (state, action) => {
      state.users = state.users.map((u) =>
        u._id === action.payload._id ? action.payload : u,
      );
    });
    builder.addCase(toggleUserStatus.fulfilled, (state, action) => {
      state.users = state.users.map((u) =>
        u._id === action.payload.id ? { ...u, isActive: action.payload.isActive } : u,
      );
    });

    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.eventsPagination = action.payload.pagination;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    const upsertEvent = (state, updated) => {
      state.events = state.events.map((e) =>
        e._id === updated._id ? { ...e, ...updated } : e,
      );
    };
    builder.addCase(setEventStatus.fulfilled, (state, action) => upsertEvent(state, action.payload));
    builder.addCase(featureEvent.fulfilled, (state, action) => upsertEvent(state, action.payload));
    builder.addCase(adminDeleteEvent.fulfilled, (state, action) => {
      state.events = state.events.filter((e) => e._id !== action.payload);
    });

    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;

export const selectAdminOverview = (state) => state.admin.overview;
export const selectAdminRecentOrders = (state) => state.admin.recentOrders;
export const selectAdminRevenue = (state) => state.admin.revenue;
export const selectAdminEventAnalytics = (state) => state.admin.eventAnalytics;
export const selectAdminTicketAnalytics = (state) => state.admin.ticketAnalytics;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminEvents = (state) => state.admin.events;
export const selectAdminOrders = (state) => state.admin.orders;
export const selectAdminUsersPagination = (state) => state.admin.usersPagination;
export const selectAdminEventsPagination = (state) => state.admin.eventsPagination;
export const selectAdminOrdersPagination = (state) => state.admin.ordersPagination;
export const selectAdminLoading = (state) => state.admin.isLoading;
export const selectAdminError = (state) => state.admin.error;
