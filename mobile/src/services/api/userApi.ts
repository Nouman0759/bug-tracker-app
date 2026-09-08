import { apiClient } from "./client";
import { User } from "../../types/user";

export const userApi = {
  async search(query: string): Promise<User[]> {
    const { data } = await apiClient.get("/users", { params: { search: query } });
    return data.data.users;
  },
};
