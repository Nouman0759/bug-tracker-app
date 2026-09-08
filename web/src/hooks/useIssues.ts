import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueApi } from "@/lib/api/issueApi";
import { commentApi } from "@/lib/api/commentApi";
import {
  CreateIssuePayload,
  IssueFilters,
  IssueStatus,
  IssuePriority,
} from "@/types/issue";

export function useIssues(filters: IssueFilters) {
  return useQuery({
    queryKey: ["issues", filters],
    queryFn: () => issueApi.list(filters),
    refetchInterval: 6000,
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ["issues", id],
    queryFn: () => issueApi.get(id),
    enabled: !!id,
    refetchInterval: 4000,
  });
}

export function useIssueHistory(id: string) {
  return useQuery({
    queryKey: ["issues", id, "history"],
    queryFn: () => issueApi.getHistory(id),
    enabled: !!id,
    refetchInterval: 6000,
  });
}

export function useComments(issueId: string) {
  return useQuery({
    queryKey: ["issues", issueId, "comments"],
    queryFn: () => commentApi.list(issueId),
    enabled: !!issueId,
    refetchInterval: 4000,
  });
}

export function useCreateIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => issueApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues"] }),
  });
}

export function useUpdateIssue(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateIssuePayload>) => issueApi.update(issueId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issues", issueId] });
      qc.invalidateQueries({ queryKey: ["issues", issueId, "history"] });
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useDeleteIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issueId: string) => issueApi.remove(issueId),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues", issueId, "comments"] }),
  });
}

export function useUpdateComment(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      commentApi.update(commentId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues", issueId, "comments"] }),
  });
}

export function useDeleteComment(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.remove(commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues", issueId, "comments"] }),
  });
}

export function useUploadScreenshots(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => issueApi.uploadScreenshots(issueId, files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues", issueId] }),
  });
}
