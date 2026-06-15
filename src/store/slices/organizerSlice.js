import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { updateAuthUser } from "./authSlice";

// Self-service: upgrade the current user to an organizer
export const becomeOrganizer = createAsyncThunk(
  "organizer/become",
  async (payload = {}, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/become-organizer", payload);
      // Keep auth.user role in sync so role-gated UI updates immediately
      dispatch(updateAuthUser({ role: "organizer", organizerInfo: data.user?.organizerInfo }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not upgrade your account");
    }
  },
);

export const fetchBanks = createAsyncThunk(
  "organizer/banks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/banks");
      return data.banks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not load banks");
    }
  },
);

export const fetchPayout = createAsyncThunk(
  "organizer/fetchPayout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/payout");
      return data.payoutAccount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not load payout details");
    }
  },
);

// payload: { bankCode, bankName, accountNumber }
export const savePayout = createAsyncThunk(
  "organizer/savePayout",
  async (payload, { rejectWithValue }) => {
    try {
      // 60s timeout so a stalled request can't leave the button stuck forever
      const { data } = await api.post("/users/payout", payload, { timeout: 60000 });
      return data.payoutAccount;
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        return rejectWithValue(
          "This is taking longer than usual — refresh the page to check if it saved.",
        );
      }
      return rejectWithValue(err.response?.data?.message || "Could not save payout account");
    }
  },
);

export const fetchOrgOverview = createAsyncThunk(
  "organizer/overview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/organizer/overview");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load analytics");
    }
  },
);

export const fetchOrgRevenue = createAsyncThunk(
  "organizer/revenue",
  async (period = "30days", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/organizer/revenue?period=${period}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load revenue");
    }
  },
);

export const fetchOrgEvents = createAsyncThunk(
  "organizer/events",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/organizer/events");
      return data.events;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load events");
    }
  },
);

const initialState = {
  banks: [],
  payoutAccount: null,
  overview: null,
  recentOrders: [],
  revenue: [],
  eventAnalytics: [],
  isLoading: false,
  isSaving: false,
  isBecoming: false,
  error: null,
};

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    clearOrganizerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(becomeOrganizer.pending, (state) => {
        state.isBecoming = true;
        state.error = null;
      })
      .addCase(becomeOrganizer.fulfilled, (state) => {
        state.isBecoming = false;
      })
      .addCase(becomeOrganizer.rejected, (state, action) => {
        state.isBecoming = false;
        state.error = action.payload;
      });

    builder.addCase(fetchBanks.fulfilled, (state, action) => {
      state.banks = action.payload;
    });

    builder.addCase(fetchPayout.fulfilled, (state, action) => {
      state.payoutAccount = action.payload;
    });

    builder
      .addCase(savePayout.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(savePayout.fulfilled, (state, action) => {
        state.isSaving = false;
        state.payoutAccount = action.payload;
      })
      .addCase(savePayout.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchOrgOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrgOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload.stats;
        state.recentOrders = action.payload.recentOrders || [];
      })
      .addCase(fetchOrgOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(fetchOrgRevenue.fulfilled, (state, action) => {
      state.revenue = action.payload.data;
    });

    builder.addCase(fetchOrgEvents.fulfilled, (state, action) => {
      state.eventAnalytics = action.payload;
    });
  },
});

export const { clearOrganizerError } = organizerSlice.actions;
export default organizerSlice.reducer;

export const selectBanks = (state) => state.organizer.banks;
export const selectPayoutAccount = (state) => state.organizer.payoutAccount;
export const selectOrgOverview = (state) => state.organizer.overview;
export const selectOrgRecentOrders = (state) => state.organizer.recentOrders;
export const selectOrgRevenue = (state) => state.organizer.revenue;
export const selectOrgEventAnalytics = (state) => state.organizer.eventAnalytics;
export const selectOrganizerLoading = (state) => state.organizer.isLoading;
export const selectOrganizerSaving = (state) => state.organizer.isSaving;
export const selectIsBecoming = (state) => state.organizer.isBecoming;
export const selectOrganizerError = (state) => state.organizer.error;
