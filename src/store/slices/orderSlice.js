import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// payload: { eventId, items:[{tierId, quantity}], guestEmail?, guestName?, guestPhone? }
export const initiateOrder = createAsyncThunk(
  "order/initiate",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/initiate", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Could not start checkout. Try again.",
      );
    }
  },
);

export const verifyOrder = createAsyncThunk(
  "order/verify",
  async (reference, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/verify/${reference}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "We couldn't confirm this payment.",
      );
    }
  },
);

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async ({ id, email }, { rejectWithValue }) => {
    try {
      const q = email ? `?email=${encodeURIComponent(email)}` : "";
      const { data } = await api.get(`/orders/${id}${q}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  },
);

const initialState = {
  current: null,
  payment: null, // { authorizationUrl, reference }
  verifyResult: null, // confirmed order after payment
  isInitiating: false,
  isVerifying: false,
  isLoadingOrder: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetCheckout: (state) => {
      state.current = null;
      state.payment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateOrder.pending, (state) => {
        state.isInitiating = true;
        state.error = null;
        state.payment = null;
      })
      .addCase(initiateOrder.fulfilled, (state, action) => {
        state.isInitiating = false;
        state.current = action.payload.order;
        state.payment = action.payload.payment || null;
      })
      .addCase(initiateOrder.rejected, (state, action) => {
        state.isInitiating = false;
        state.error = action.payload;
      });

    builder
      .addCase(verifyOrder.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyOrder.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.verifyResult = action.payload.order;
      })
      .addCase(verifyOrder.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.current = action.payload.order;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, resetCheckout } = orderSlice.actions;
export default orderSlice.reducer;

export const selectCheckoutOrder = (state) => state.order.current;
export const selectPayment = (state) => state.order.payment;
export const selectVerifyResult = (state) => state.order.verifyResult;
export const selectIsInitiating = (state) => state.order.isInitiating;
export const selectIsVerifying = (state) => state.order.isVerifying;
export const selectIsLoadingOrder = (state) => state.order.isLoadingOrder;
export const selectOrderError = (state) => state.order.error;
