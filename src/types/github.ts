// ─── GitHub API Response Types ────────────────────────────────────────────────

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  visibility: "public" | "private" | "internal";
  updated_at: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export interface GitHubCollaborator {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: "User" | "Bot";
  permissions: {
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
    admin: boolean;
  };
  role_name: string;
}

export interface GitHubTeam {
  id: number;
  slug: string;
  name: string;
  permission: string;
}

export interface GitHubOrgMember {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: "User" | "Bot";
}

// ─── Report Types ──────────────────────────────────────────────────────────────

export type AccessLevel =
  | "admin"
  | "maintain"
  | "push"
  | "triage"
  | "pull"
  | "unknown";

export interface RepoAccess {
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  visibility: "public" | "private" | "internal";
  accessLevel: AccessLevel;
  roleName: string;
}

export interface UserAccessEntry {
  userId: number;
  login: string;
  avatarUrl: string;
  profileUrl: string;
  userType: "User" | "Bot";
  repositories: RepoAccess[];
  repoCount: number;
}

export interface AccessReport {
  organization: string;
  generatedAt: string;
  totalRepositories: number;
  totalUsers: number;
  users: UserAccessEntry[];
  meta: {
    repositoriesScanned: number;
    apiCallsEstimated: number;
    durationMs: number;
  };
}

// ─── App State Types ───────────────────────────────────────────────────────────

export type FetchStatus = "idle" | "fetching" | "success" | "error";

export interface FetchProgress {
  stage: string;
  current: number;
  total: number;
  message: string;
}

export interface AppError {
  message: string;
  details?: string;
  status?: number;
}

export interface FilterState {
  search: string;
  accessLevel: AccessLevel | "all";
  repoFilter: string;
  userType: "all" | "User" | "Bot";
  minRepos: number;
}

export type SortField = "login" | "repoCount" | "accessLevel";
export type SortDir = "asc" | "desc";
