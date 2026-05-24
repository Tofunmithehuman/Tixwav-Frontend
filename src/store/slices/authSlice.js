import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, {
  setInMemoryToken,
  clearInMemoryToken,
  setInMemoryRefreshToken,
  clearInMemoryRefreshToken,
  getInMemoryToken
} from "../../lib/api";

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", credentials);
      setInMemoryToken(data.token);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setInMemoryToken(data.token);
      setInMemoryRefreshToken(data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      clearInMemoryToken();
      clearInMemoryRefreshToken();
      return null;
    } catch (err) {
      // Clear token even if server call fails
      clearInMemoryToken();
      clearInMemoryRefreshToken();
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      if (!getInMemoryToken()) {
        try {
          const { data: refreshData } = await api.post("/auth/refresh", {});
          setInMemoryToken(refreshData.token);
          if (refreshData.refreshToken) setInMemoryRefreshToken(refreshData.refreshToken);
        } catch {
          return rejectWithValue("Session expired");
        }
      }
      const { data } = await api.get("/auth/me");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  },
);

export const exchangeOAuthCode = createAsyncThunk(
  "auth/exchangeCode",
  async ({ code }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/exchange", { code });
      setInMemoryToken(data.token);
      setInMemoryRefreshToken(data.refreshToken);

      const meRes = await api.get("/auth/me");
      return { ...data, user: meRes.data.user };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OAuth exchange failed",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  // Separate loading states for specific operations
  isForgotLoading: false,
  isResetLoading: false,
  error: null,
  // Tracks whether we've attempted to restore session on app mount
  sessionChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Called by userSlice when profile is updated so auth.user stays in sync
    updateAuthUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Login ─────────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Logout ────────────────────────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear state even if the server call fails
        state.user = null;
        state.isAuthenticated = false;
      });

    // ── Get Me (session restore) ──────────────────────────────────────────────
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      });

    // ── Forgot Password ───────────────────────────────────────────────────────
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isForgotLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isForgotLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isForgotLoading = false;
        state.error = action.payload;
      });

    // ── Reset Password ────────────────────────────────────────────────────────
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isResetLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isResetLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isResetLoading = false;
        state.error = action.payload;
      });

    // ── OAuth Exchange ────────────────────────────────────────────────────────
    builder
      .addCase(exchangeOAuthCode.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(exchangeOAuthCode.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectSessionChecked = (state) => state.auth.sessionChecked;
