import { apiClient } from "./client";
import {
  Issue,
  IssueFilters,
  CreateIssuePayload,
  IssueHistoryEntry,
  IssueStatus,
  IssuePriority,
} from "../../types/issue";

interface ListIssuesResult {
  issues: Issue[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const issueApi = {
  async list(filters: IssueFilters = {}): Promise<ListIssuesResult> {
    const { data } = await apiClient.get("/issues", { params: filters });
    return { issues: data.data.issues, meta: data.meta };
  },
  async get(id: string): Promise<Issue> {
    const { data } = await apiClient.get(`/issues/${id}`);
    return data.data.issue;
  },
  async create(payload: CreateIssuePayload): Promise<Issue> {
    const { data } = await apiClient.post("/issues", payload);
    return data.data.issue;
  },
  async update(id: string, payload: Partial<CreateIssuePayload>): Promise<Issue> {
    const { data } = await apiClient.put(`/issues/${id}`, payload);
    return data.data.issue;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/issues/${id}`);
  },
  async updateStatus(id: string, status: IssueStatus): Promise<Issue> {
    const { data } = await apiClient.patch(`/issues/${id}/status`, { status });
    return data.data.issue;
  },
  async updatePriority(id: string, priority: IssuePriority): Promise<Issue> {
    const { data } = await apiClient.patch(`/issues/${id}/priority`, { priority });
    return data.data.issue;
  },
  async assign(id: string, assignedTo: string | null): Promise<Issue> {
    const { data } = await apiClient.patch(`/issues/${id}/assign`, { assignedTo });
    return data.data.issue;
  },
  async getHistory(id: string): Promise<IssueHistoryEntry[]> {
    const { data } = await apiClient.get(`/issues/${id}/history`);
    return data.data.history;
  },
  async uploadScreenshots(id: string, uris: string[]): Promise<string[]> {
    const form = new FormData();
    uris.forEach((uri, i) => {
      const filename = uri.split("/").pop() || `screenshot_${i}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1] : "jpg";
      form.append("screenshots", {
        uri,
        name: filename,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      } as any);
    });
    const { data } = await apiClient.post(`/issues/${id}/screenshots`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.screenshots;
  },
};
