import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// The short-lived access token lives in memory only — never in storage — so it
// can't be read by injected scripts. The long-lived refresh token is an
// httpOnly cookie the browser sends automatically; a full-page navigation
// (e.g. the Paystack round-trip) re-mints the access token via /auth/refresh on
// app load.
let inMemoryToken = null;

export const setInMemoryToken = (token) => {
  inMemoryToken = token;
};
export const clearInMemoryToken = () => {
  inMemoryToken = null;
};
export const getInMemoryToken = () => inMemoryToken;

// Refresh tokens are no longer handled in JS (httpOnly cookie only). These
// remain as no-ops so existing imports keep working.
export const setInMemoryRefreshToken = () => {};
export const clearInMemoryRefreshToken = () => {};

api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

// ── Response interceptor — silent token refresh ──────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");
    if (isAuthEndpoint) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Relies on the httpOnly refresh cookie — no token in the body.
        const { data } = await api.post("/auth/refresh", {});
        const newToken = data.token;
        setInMemoryToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearInMemoryToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
