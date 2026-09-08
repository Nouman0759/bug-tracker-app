import axios from "axios";
import { API_URL } from "../../config/env";
import { tokenStorage } from "../storage/tokenStorage";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach the JWT to every outgoing request, if we have one
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a plain message string so screens don't need to know about Axios
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
