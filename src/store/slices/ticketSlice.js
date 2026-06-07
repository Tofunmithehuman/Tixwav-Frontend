import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// Verify (scan) a ticket at the door — organizer/admin
export const verifyTicket = createAsyncThunk(
  "ticket/verify",
  async (ticketCode, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/tickets/${ticketCode}/verify`);
      return data;
    } catch (err) {
      // 409/400 carry useful info (already used, cancelled, etc.)
      return rejectWithValue(
        err.response?.data || { message: "Verification failed", valid: false },
      );
    }
  },
);

export const lookupTicket = createAsyncThunk(
  "ticket/lookup",
  async (ticketCode, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tickets/${ticketCode}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ticket not found");
    }
  },
);

export const cancelTicket = createAsyncThunk(
  "ticket/cancel",
  async (ticketCode, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tickets/${ticketCode}/cancel`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not disable ticket");
    }
  },
);

export const fetchEventTickets = createAsyncThunk(
  "ticket/eventTickets",
  async ({ eventId, status, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const q = new URLSearchParams({ page, limit });
      if (status) q.append("status", status);
      const { data } = await api.get(`/tickets/events/${eventId}?${q}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tickets");
    }
  },
);

const initialState = {
  scanResult: null, // { valid, message, ticket }
  isVerifying: false,
  eventTickets: [],
  ticketsPagination: null,
  isLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearScanResult: (state) => {
      state.scanResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyTicket.pending, (state) => {
        state.isVerifying = true;
        state.scanResult = null;
        state.error = null;
      })
      .addCase(verifyTicket.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.scanResult = { ...action.payload, valid: true };
      })
      .addCase(verifyTicket.rejected, (state, action) => {
        state.isVerifying = false;
        state.scanResult = { ...action.payload, valid: false };
      });

    builder
      .addCase(lookupTicket.pending, (state) => {
        state.isVerifying = true;
        state.scanResult = null;
        state.error = null;
      })
      .addCase(lookupTicket.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.scanResult = { lookup: true, ticket: action.payload.ticket };
      })
      .addCase(lookupTicket.rejected, (state, action) => {
        state.isVerifying = false;
        state.scanResult = { lookup: true, valid: false, message: action.payload };
      });

    builder.addCase(cancelTicket.fulfilled, (state, action) => {
      state.eventTickets = state.eventTickets.map((t) =>
        t.ticketCode === action.payload.ticketCode
          ? { ...t, status: action.payload.status }
          : t,
      );
    });

    builder
      .addCase(fetchEventTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventTickets = action.payload.tickets;
        state.ticketsPagination = action.payload.pagination;
      })
      .addCase(fetchEventTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearScanResult } = ticketSlice.actions;
export default ticketSlice.reducer;

export const selectScanResult = (state) => state.ticket.scanResult;
export const selectIsVerifying = (state) => state.ticket.isVerifying;
export const selectEventTickets = (state) => state.ticket.eventTickets;
export const selectTicketsPagination = (state) => state.ticket.ticketsPagination;
export const selectTicketsLoading = (state) => state.ticket.isLoading;
