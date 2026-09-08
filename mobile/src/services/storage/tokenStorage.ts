import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "bug_tracker_auth_token";

// expo-secure-store has no web implementation and throws if called there,
// so on web we fall back to localStorage. This is fine for local dev/testing;
// it is not a secure storage mechanism for production web deployments.
export const tokenStorage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clearToken(): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};