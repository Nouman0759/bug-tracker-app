"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/lib/api/authApi";
import { tokenStorage } from "@/lib/tokenStorage";
import { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = tokenStorage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.me();
        setUser(me);
      } catch {
        tokenStorage.clearToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Keep sessions in sync across tabs: if the token is cleared or changed in
  // another tab (e.g. logging out, or logging in as someone else), reflect
  // that here too.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== "bug_tracker_token") return;
      if (!e.newValue) {
        setUser(null);
      } else {
        authApi.me().then(({ user: me }) => setUser(me)).catch(() => setUser(null));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function login(email: string, password: string) {
    const { user: loggedInUser, token } = await authApi.login({ email, password });
    tokenStorage.setToken(token);
    setUser(loggedInUser);
  }

  async function signup(name: string, email: string, password: string) {
    const { user: newUser, token } = await authApi.signup({ name, email, password });
    tokenStorage.setToken(token);
    setUser(newUser);
  }

  function logout() {
    tokenStorage.clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
