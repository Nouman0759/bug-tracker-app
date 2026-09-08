import { User } from "./user";

export type ProjectMemberRole = "manager" | "member";

export interface ProjectMember {
  user: User;
  role: ProjectMemberRole;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}
