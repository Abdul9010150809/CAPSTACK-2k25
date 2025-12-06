import axios, { type InternalAxiosRequestConfig } from "axios";

// Create only ONE axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://capstack-2k25-backend.onrender.com" || "http://localhost:3001",
  withCredentials: true,
});

// Attach token automatically
// Helper to check token expiry by decoding the JWT payload (no external lib)
function isTokenExpired(token: string | null) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(decodeURIComponent(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    ));
    if (!payload || typeof payload !== 'object') return true;
    if (!payload.exp) return true;
    const now = Date.now() / 1000;
    return payload.exp <= now;
  } catch (e) {
    return true;
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // If token is missing or expired, clear and redirect to login
    if (!token || isTokenExpired(token)) {
      try { localStorage.removeItem('token'); } catch (e) {}
      // avoid redirect loop if on auth pages
      const pathname = window.location.pathname;
      if (!pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
      // Reject the request to avoid sending an invalid token
      return Promise.reject(new Error('Token missing or expired'));
    }

    // Attach valid token (normalize if it accidentally contains a 'Bearer ' prefix)
    const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    config.headers = config.headers || ({} as any);
    (config.headers as Record<string, string>).Authorization = `Bearer ${rawToken}`;
  }
  return config;
});

// Response interceptor to log 401s for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error?.response?.status === 401) {
        // Token already handled in request interceptor
      }
    } catch (e) {
      // ignore logging errors
    }
    return Promise.reject(error);
  }
);

export default api;
