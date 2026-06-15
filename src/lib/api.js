import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Tokens live in memory but are mirrored to sessionStorage so the session
// survives a full-page navigation — e.g. the Paystack checkout round-trip —
// without depending on the cross-site refresh cookie (which some browsers
// block). sessionStorage is per-tab and cleared when the tab closes.
const AT_KEY = "tw_at";
const RT_KEY = "tw_rt";

const readStore = (k) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const writeStore = (k, v) => {
  try {
    if (v) sessionStorage.setItem(k, v);
    else sessionStorage.removeItem(k);
  } catch {
    /* storage unavailable (e.g. private mode) — memory only */
  }
};

let inMemoryToken = readStore(AT_KEY);
let inMemoryRefreshToken = readStore(RT_KEY);

export const setInMemoryToken = (token) => {
  inMemoryToken = token;
  writeStore(AT_KEY, token);
};

export const clearInMemoryToken = () => {
  inMemoryToken = null;
  writeStore(AT_KEY, null);
};

export const setInMemoryRefreshToken = (token) => {
  inMemoryRefreshToken = token;
  writeStore(RT_KEY, token);
};

export const getInMemoryToken = () => inMemoryToken;

export const clearInMemoryRefreshToken = () => {
  inMemoryRefreshToken = null;
  writeStore(RT_KEY, null);
};

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
        const { data } = await api.post("/auth/refresh", {
          refreshToken: inMemoryRefreshToken, // send in-memory token if available
        });
        const newToken = data.token;
        setInMemoryToken(newToken);
        if (data.refreshToken) setInMemoryRefreshToken(data.refreshToken); // keep in sync
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
