import { apiClient } from "../apiClient";
import { AuthResponse, LoginPayload, SignupPayload } from "@/types/auth";
import { User } from "@/types/user";

export const authApi = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/signup", payload);
    return data.data;
  },
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/login", payload);
    return data.data;
  },
  async me(): Promise<{ user: User }> {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  },
  async updateMe(payload: { name?: string; avatar?: string }): Promise<User> {
    const { data } = await apiClient.put("/users/me", payload);
    return data.data.user;
  },
};
