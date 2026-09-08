import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueApi } from "../services/api/issueApi";
import { commentApi } from "../services/api/commentApi";
import { CreateIssuePayload, IssueFilters, IssueStatus, IssuePriority } from "../types/issue";

export function useIssues(filters: IssueFilters) {
  return useQuery({
    queryKey: ["issues", filters],
    queryFn: () => issueApi.list(filters),
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ["issues", id],
    queryFn: () => issueApi.get(id),
    enabled: !!id,
  });
}

export function useIssueHistory(id: string) {
  return useQuery({
    queryKey: ["issues", id, "history"],
    queryFn: () => issueApi.getHistory(id),
    enabled: !!id,
  });
}

export function useComments(issueId: string) {
  return useQuery({
    queryKey: ["issues", issueId, "comments"],
    queryFn: () => commentApi.list(issueId),
    enabled: !!issueId,
  });
}

export function useCreateIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => issueApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues"] }),
  });
}

export function useUpdateIssueStatus(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: IssueStatus) => issueApi.updateStatus(issueId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issues", issueId] });
      qc.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useUpdateIssuePriority(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (priority: IssuePriority) => issueApi.updatePriority(issueId, priority),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issues", issueId] });
      qc.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useAssignIssue(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assignedTo: string | null) => issueApi.assign(issueId, assignedTo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issues", issueId] });
      qc.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useAddComment(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => commentApi.create(issueId, text),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["issues", issueId, "comments"] }),
  });
}
