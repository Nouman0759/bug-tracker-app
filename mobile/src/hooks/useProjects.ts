import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../services/api/projectApi";
import { CreateProjectPayload, Project, ProjectMemberRole } from "../types/project";
import { User } from "../types/user";

// Permission helpers shared across screens. The backend is the source of
// truth for enforcement; these mirror that logic for UI gating only.
export function isProjectOwner(project?: Project | null, user?: User | null): boolean {
  if (!project || !user) return false;
  return project.owner._id === user._id;
}

export function isProjectManager(project?: Project | null, user?: User | null): boolean {
  if (!project || !user) return false;
  if (isProjectOwner(project, user)) return true;
  return project.members.some((m) => m.user && m.user._id === user._id && m.role === "manager");
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.list,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectApi.get(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useProjectMembers(id: string) {
  return useQuery({
    queryKey: ["projects", id, "members"],
    queryFn: () => projectApi.listMembers(id),
    enabled: !!id,
  });
}

export function useAddMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role?: ProjectMemberRole }) =>
      projectApi.addMember(projectId, userId, role),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["projects", projectId, "members"] }),
  });
}

export function useUpdateMemberRole(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: ProjectMemberRole }) =>
      projectApi.updateMemberRole(projectId, userId, role),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["projects", projectId, "members"] }),
  });
}
