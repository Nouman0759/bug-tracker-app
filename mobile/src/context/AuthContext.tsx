import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../services/api/authApi";
import { tokenStorage } from "../services/storage/tokenStorage";
import { User } from "../types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await tokenStorage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.me();
        setUser(me);
      } catch {
        await tokenStorage.clearToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const { user: loggedInUser, token } = await authApi.login({ email, password });
    await tokenStorage.setToken(token);
    setUser(loggedInUser);
  }

  async function signup(name: string, email: string, password: string) {
    const { user: newUser, token } = await authApi.signup({ name, email, password });
    await tokenStorage.setToken(token);
    setUser(newUser);
  }

  async function logout() {
    await tokenStorage.clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}
