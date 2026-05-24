import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { updateAuthUser } from "./authSlice";

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/profile");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (updates, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/profile", updates);
      // Keep auth.user in sync
      dispatch(updateAuthUser(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateAuthUser({ avatar: data.avatar }));
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update avatar"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "user/getMyOrders",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/orders?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  profile: null,
  orders: [],
  ordersPagination: null,
  isProfileLoading: false,
  isUpdating: false,
  isAvatarUploading: false,
  isPasswordChanging: false,
  isOrdersLoading: false,
  error: null,
  passwordError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearPasswordError: (state) => {
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    // ── Get Profile ───────────────────────────────────────────────────────────
    builder
      .addCase(getProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload.user;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload;
      });

    // ── Update Profile ────────────────────────────────────────────────────────
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });

    // ── Update Avatar ─────────────────────────────────────────────────────────
    builder
      .addCase(updateAvatar.pending, (state) => {
        state.isAvatarUploading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isAvatarUploading = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isAvatarUploading = false;
        state.error = action.payload;
      });

    // ── Change Password ───────────────────────────────────────────────────────
    builder
      .addCase(changePassword.pending, (state) => {
        state.isPasswordChanging = true;
        state.passwordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isPasswordChanging = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isPasswordChanging = false;
        state.passwordError = action.payload;
      });

    // ── Get Orders ────────────────────────────────────────────────────────────
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearPasswordError } = userSlice.actions;
export default userSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectProfile = (state) => state.user.profile;
export const selectOrders = (state) => state.user.orders;
export const selectOrdersPagination = (state) => state.user.ordersPagination;
export const selectIsUpdating = (state) => state.user.isUpdating;
export const selectIsAvatarUploading = (state) => state.user.isAvatarUploading;
export const selectIsPasswordChanging = (state) => state.user.isPasswordChanging;
export const selectIsOrdersLoading = (state) => state.user.isOrdersLoading;
export const selectUserError = (state) => state.user.error;
export const selectPasswordError = (state) => state.user.passwordError;