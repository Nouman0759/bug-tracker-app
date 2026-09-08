import { apiClient } from "../apiClient";
import { Comment } from "@/types/comment";

export const commentApi = {
  async list(issueId: string): Promise<Comment[]> {
    const { data } = await apiClient.get(`/issues/${issueId}/comments`);
    return data.data.comments;
  },
  async create(issueId: string, text: string): Promise<Comment> {
    const { data } = await apiClient.post(`/issues/${issueId}/comments`, { text });
    return data.data.comment;
  },
  async update(commentId: string, text: string): Promise<Comment> {
    const { data } = await apiClient.put(`/comments/${commentId}`, { text });
    return data.data.comment;
  },
  async remove(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
