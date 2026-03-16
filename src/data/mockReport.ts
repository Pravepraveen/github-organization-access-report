/**
 * mockReport.ts
 * Realistic-looking mock data for the demo / preview mode.
 * Lets users explore the UI without a real GitHub token.
 */

import type { AccessReport } from "../types/github";

export const MOCK_REPORT: AccessReport = {
  organization: "acme-corp",
  generatedAt: new Date().toISOString(),
  totalRepositories: 12,
  totalUsers: 8,
  users: [
    {
      userId: 1001,
      login: "alice-dev",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      profileUrl: "https://github.com/alice-dev",
      userType: "User",
      repoCount: 5,
      repositories: [
        { repoName: "api-gateway", repoFullName: "acme-corp/api-gateway", repoUrl: "https://github.com/acme-corp/api-gateway", visibility: "private", accessLevel: "admin", roleName: "admin" },
        { repoName: "frontend-app", repoFullName: "acme-corp/frontend-app", repoUrl: "https://github.com/acme-corp/frontend-app", visibility: "private", accessLevel: "admin", roleName: "admin" },
        { repoName: "shared-lib", repoFullName: "acme-corp/shared-lib", repoUrl: "https://github.com/acme-corp/shared-lib", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "docs", repoFullName: "acme-corp/docs", repoUrl: "https://github.com/acme-corp/docs", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "infra", repoFullName: "acme-corp/infra", repoUrl: "https://github.com/acme-corp/infra", visibility: "private", accessLevel: "admin", roleName: "admin" },
      ],
    },
    {
      userId: 1002,
      login: "bob-backend",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      profileUrl: "https://github.com/bob-backend",
      userType: "User",
      repoCount: 4,
      repositories: [
        { repoName: "api-gateway", repoFullName: "acme-corp/api-gateway", repoUrl: "https://github.com/acme-corp/api-gateway", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "data-pipeline", repoFullName: "acme-corp/data-pipeline", repoUrl: "https://github.com/acme-corp/data-pipeline", visibility: "private", accessLevel: "maintain", roleName: "maintain" },
        { repoName: "shared-lib", repoFullName: "acme-corp/shared-lib", repoUrl: "https://github.com/acme-corp/shared-lib", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "worker-service", repoFullName: "acme-corp/worker-service", repoUrl: "https://github.com/acme-corp/worker-service", visibility: "private", accessLevel: "push", roleName: "write" },
      ],
    },
    {
      userId: 1003,
      login: "carol-frontend",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
      profileUrl: "https://github.com/carol-frontend",
      userType: "User",
      repoCount: 3,
      repositories: [
        { repoName: "frontend-app", repoFullName: "acme-corp/frontend-app", repoUrl: "https://github.com/acme-corp/frontend-app", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "design-system", repoFullName: "acme-corp/design-system", repoUrl: "https://github.com/acme-corp/design-system", visibility: "public", accessLevel: "maintain", roleName: "maintain" },
        { repoName: "docs", repoFullName: "acme-corp/docs", repoUrl: "https://github.com/acme-corp/docs", visibility: "public", accessLevel: "push", roleName: "write" },
      ],
    },
    {
      userId: 1004,
      login: "dave-devops",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dave",
      profileUrl: "https://github.com/dave-devops",
      userType: "User",
      repoCount: 6,
      repositories: [
        { repoName: "infra", repoFullName: "acme-corp/infra", repoUrl: "https://github.com/acme-corp/infra", visibility: "private", accessLevel: "admin", roleName: "admin" },
        { repoName: "api-gateway", repoFullName: "acme-corp/api-gateway", repoUrl: "https://github.com/acme-corp/api-gateway", visibility: "private", accessLevel: "maintain", roleName: "maintain" },
        { repoName: "worker-service", repoFullName: "acme-corp/worker-service", repoUrl: "https://github.com/acme-corp/worker-service", visibility: "private", accessLevel: "maintain", roleName: "maintain" },
        { repoName: "data-pipeline", repoFullName: "acme-corp/data-pipeline", repoUrl: "https://github.com/acme-corp/data-pipeline", visibility: "private", accessLevel: "maintain", roleName: "maintain" },
        { repoName: "monitoring", repoFullName: "acme-corp/monitoring", repoUrl: "https://github.com/acme-corp/monitoring", visibility: "private", accessLevel: "admin", roleName: "admin" },
        { repoName: "shared-lib", repoFullName: "acme-corp/shared-lib", repoUrl: "https://github.com/acme-corp/shared-lib", visibility: "public", accessLevel: "push", roleName: "write" },
      ],
    },
    {
      userId: 1005,
      login: "eve-security",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve",
      profileUrl: "https://github.com/eve-security",
      userType: "User",
      repoCount: 7,
      repositories: [
        { repoName: "api-gateway", repoFullName: "acme-corp/api-gateway", repoUrl: "https://github.com/acme-corp/api-gateway", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "infra", repoFullName: "acme-corp/infra", repoUrl: "https://github.com/acme-corp/infra", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "frontend-app", repoFullName: "acme-corp/frontend-app", repoUrl: "https://github.com/acme-corp/frontend-app", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "worker-service", repoFullName: "acme-corp/worker-service", repoUrl: "https://github.com/acme-corp/worker-service", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "data-pipeline", repoFullName: "acme-corp/data-pipeline", repoUrl: "https://github.com/acme-corp/data-pipeline", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "monitoring", repoFullName: "acme-corp/monitoring", repoUrl: "https://github.com/acme-corp/monitoring", visibility: "private", accessLevel: "triage", roleName: "triage" },
        { repoName: "shared-lib", repoFullName: "acme-corp/shared-lib", repoUrl: "https://github.com/acme-corp/shared-lib", visibility: "public", accessLevel: "pull", roleName: "read" },
      ],
    },
    {
      userId: 1006,
      login: "frank-intern",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank",
      profileUrl: "https://github.com/frank-intern",
      userType: "User",
      repoCount: 2,
      repositories: [
        { repoName: "docs", repoFullName: "acme-corp/docs", repoUrl: "https://github.com/acme-corp/docs", visibility: "public", accessLevel: "pull", roleName: "read" },
        { repoName: "design-system", repoFullName: "acme-corp/design-system", repoUrl: "https://github.com/acme-corp/design-system", visibility: "public", accessLevel: "pull", roleName: "read" },
      ],
    },
    {
      userId: 1007,
      login: "grace-pm",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
      profileUrl: "https://github.com/grace-pm",
      userType: "User",
      repoCount: 3,
      repositories: [
        { repoName: "docs", repoFullName: "acme-corp/docs", repoUrl: "https://github.com/acme-corp/docs", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "design-system", repoFullName: "acme-corp/design-system", repoUrl: "https://github.com/acme-corp/design-system", visibility: "public", accessLevel: "pull", roleName: "read" },
        { repoName: "frontend-app", repoFullName: "acme-corp/frontend-app", repoUrl: "https://github.com/acme-corp/frontend-app", visibility: "private", accessLevel: "triage", roleName: "triage" },
      ],
    },
    {
      userId: 1008,
      login: "ci-bot[bot]",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ci-bot",
      profileUrl: "https://github.com/ci-bot",
      userType: "Bot",
      repoCount: 8,
      repositories: [
        { repoName: "api-gateway", repoFullName: "acme-corp/api-gateway", repoUrl: "https://github.com/acme-corp/api-gateway", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "frontend-app", repoFullName: "acme-corp/frontend-app", repoUrl: "https://github.com/acme-corp/frontend-app", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "worker-service", repoFullName: "acme-corp/worker-service", repoUrl: "https://github.com/acme-corp/worker-service", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "data-pipeline", repoFullName: "acme-corp/data-pipeline", repoUrl: "https://github.com/acme-corp/data-pipeline", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "shared-lib", repoFullName: "acme-corp/shared-lib", repoUrl: "https://github.com/acme-corp/shared-lib", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "infra", repoFullName: "acme-corp/infra", repoUrl: "https://github.com/acme-corp/infra", visibility: "private", accessLevel: "push", roleName: "write" },
        { repoName: "design-system", repoFullName: "acme-corp/design-system", repoUrl: "https://github.com/acme-corp/design-system", visibility: "public", accessLevel: "push", roleName: "write" },
        { repoName: "monitoring", repoFullName: "acme-corp/monitoring", repoUrl: "https://github.com/acme-corp/monitoring", visibility: "private", accessLevel: "push", roleName: "write" },
      ],
    },
  ],
  meta: {
    repositoriesScanned: 12,
    apiCallsEstimated: 25,
    durationMs: 3420,
  },
};
