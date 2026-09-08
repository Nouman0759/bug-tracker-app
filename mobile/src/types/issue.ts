import { User } from "./user";

export type IssueStatus = "open" | "in_progress" | "resolved" | "closed" | "reopened";
export type IssuePriority = "low" | "medium" | "high" | "critical";

export interface Issue {
  _id: string;
  project: string | { _id: string; name: string };
  title: string;
  description: string;
  screenshots: string[];
  priority: IssuePriority;
  status: IssueStatus;
  createdBy: User;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  project?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateIssuePayload {
  project: string;
  title: string;
  description: string;
  priority?: IssuePriority;
  assignedTo?: string | null;
}

export interface IssueHistoryEntry {
  _id: string;
  issue: string;
  user: User;
  action:
    | "ISSUE_CREATED"
    | "STATUS_CHANGED"
    | "PRIORITY_CHANGED"
    | "ASSIGNED_CHANGED"
    | "TITLE_CHANGED"
    | "DESCRIPTION_CHANGED";
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}
