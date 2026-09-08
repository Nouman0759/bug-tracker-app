import axios from "axios";
import { tokenStorage } from "./tokenStorage";

// Points at the exact same Express/MongoDB backend the mobile app talks to.
// Set NEXT_PUBLIC_API_URL in .env.local to your backend's /api path
// (e.g. http://localhost:5000/api, or your deployed API URL - the same one
// used for EXPO_PUBLIC_API_URL on mobile).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach the JWT to every outgoing request, if we have one.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a plain message string, same as mobile.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    if (error?.response?.status === 401) {
      tokenStorage.clearToken();
    }
    return Promise.reject(new Error(message));
  }
);
