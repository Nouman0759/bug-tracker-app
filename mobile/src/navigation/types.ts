export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  DashboardTab: undefined;
  ProjectsTab: undefined;
  IssuesTab: undefined;
  ProfileTab: undefined;
};

export type ProjectsStackParamList = {
  Projects: undefined;
  CreateProject: undefined;
  ProjectDetails: { projectId: string };
  ProjectMembers: { projectId: string };
};

export type IssuesStackParamList = {
  Issues: { projectId?: string } | undefined;
  CreateIssue: { projectId?: string } | undefined;
  IssueDetails: { issueId: string };
  EditIssue: { issueId: string };
  IssueHistory: { issueId: string };
};