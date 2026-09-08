// Web equivalent of mobile/src/services/storage/tokenStorage.ts (which used
// Expo SecureStore). The web app has no secure enclave, so localStorage is
// the standard approach; the token is the same JWT issued by the same
// backend, so a user can log in on mobile and web independently with the
// same credentials against the same User record.
const TOKEN_KEY = "bug_tracker_token";

export const tokenStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
