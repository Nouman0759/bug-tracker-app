import { apiClient } from "./client";
import { Project, CreateProjectPayload, ProjectMember, ProjectMemberRole } from "../../types/project";

export const projectApi = {
  async list(): Promise<Project[]> {
    const { data } = await apiClient.get("/projects");
    return data.data.projects;
  },
  async get(id: string): Promise<Project> {
    const { data } = await apiClient.get(`/projects/${id}`);
    return data.data.project;
  },
  async create(payload: CreateProjectPayload): Promise<Project> {
    const { data } = await apiClient.post("/projects", payload);
    return data.data.project;
  },
  async update(id: string, payload: Partial<CreateProjectPayload>): Promise<Project> {
    const { data } = await apiClient.put(`/projects/${id}`, payload);
    return data.data.project;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
  async listMembers(id: string): Promise<ProjectMember[]> {
    const { data } = await apiClient.get(`/projects/${id}/members`);
    return data.data.members;
  },
  // Owner-only on the backend: adds a member, optionally as a manager.
  async addMember(id: string, userId: string, role: ProjectMemberRole = "member"): Promise<ProjectMember[]> {
    const { data } = await apiClient.post(`/projects/${id}/members`, { userId, role });
    return data.data.members;
  },
  // Owner-only on the backend: promotes/demotes an existing member.
  async updateMemberRole(id: string, userId: string, role: ProjectMemberRole): Promise<ProjectMember[]> {
    const { data } = await apiClient.patch(`/projects/${id}/members/${userId}/role`, { role });
    return data.data.members;
  },
  async removeMember(id: string, userId: string): Promise<void> {
    await apiClient.delete(`/projects/${id}/members/${userId}`);
  },
};
