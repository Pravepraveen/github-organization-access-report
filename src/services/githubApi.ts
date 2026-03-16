/**
 * githubApi.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin wrapper around the GitHub REST API v3.
 *
 * Design decisions
 * ────────────────
 * 1. TOKEN is read from sessionStorage (user-supplied at runtime) so the SPA
 *    never ships a secret in its bundle.
 * 2. All list endpoints are fully paginated (page size = 100) to handle orgs
 *    with 100+ repos / 1 000+ collaborators.
 * 3. Repository collaborators are fetched in parallel (Promise.all with a
 *    concurrency cap) rather than sequentially, keeping total wall-clock time
 *    proportional to the largest page batch rather than Σ(api calls).
 * 4. A lightweight rate-limit inspector waits if < 10 requests remain in the
 *    current window before proceeding.
 */

import type {
  GitHubRepo,
  GitHubCollaborator,
  AccessReport,
  UserAccessEntry,
  RepoAccess,
  AccessLevel,
  FetchProgress,
} from "../types/github";

// ─── Constants ─────────────────────────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";
const PAGE_SIZE = 100; // maximum allowed by GitHub
const CONCURRENCY = 8; // simultaneous repo-collaborator requests

// ─── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** Throw a descriptive error if the response is not OK. */
async function assertOk(res: Response, context: string): Promise<void> {
  if (res.ok) return;
  let body = "";
  try {
    const json = await res.json();
    body = json.message ?? JSON.stringify(json);
  } catch {
    body = await res.text().catch(() => "");
  }
  const err = new Error(`[${context}] HTTP ${res.status}: ${body}`);
  (err as any).status = res.status;
  throw err;
}

/**
 * Fetch ALL pages of a paginated GitHub list endpoint.
 * @param url    First-page URL (without `?page=` / `&per_page=` params)
 * @param token  Personal Access Token
 */
async function fetchAllPages<T>(url: string, token: string): Promise<T[]> {
  const results: T[] = [];
  const separator = url.includes("?") ? "&" : "?";
  let page = 1;

  while (true) {
    const pageUrl = `${url}${separator}per_page=${PAGE_SIZE}&page=${page}`;
    const res = await fetch(pageUrl, { headers: authHeaders(token) });
    await assertOk(res, url);

    // Respect rate limits proactively
    await handleRateLimit(res);

    const data: T[] = await res.json();
    results.push(...data);

    // GitHub signals the last page by returning fewer items than requested
    if (data.length < PAGE_SIZE) break;
    page++;
  }

  return results;
}

/**
 * If the API signals we are close to exhausting our rate-limit budget,
 * pause until the reset timestamp.
 */
async function handleRateLimit(res: Response): Promise<void> {
  const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? "999");
  const resetAt = Number(res.headers.get("x-ratelimit-reset") ?? "0");

  if (remaining < 10 && resetAt > 0) {
    const waitMs = Math.max(0, resetAt * 1000 - Date.now()) + 1000;
    console.warn(`Rate limit low (${remaining} left). Waiting ${waitMs}ms…`);
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

/**
 * Run an array of async tasks with a maximum concurrency level.
 */
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ─── Derive access level from permission flags ──────────────────────────────

function deriveAccessLevel(collab: GitHubCollaborator): AccessLevel {
  const p = collab.permissions;
  if (p.admin) return "admin";
  if (p.maintain) return "maintain";
  if (p.push) return "push";
  if (p.triage) return "triage";
  if (p.pull) return "pull";
  return "unknown";
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Verify that the supplied token can reach the GitHub API and has the
 * `repo` / `read:org` scopes needed for this report.
 */
export async function validateToken(
  token: string
): Promise<{ login: string; scopes: string[] }> {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: authHeaders(token),
  });
  await assertOk(res, "validateToken");

  const scopes = (res.headers.get("x-oauth-scopes") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = await res.json();
  return { login: data.login, scopes };
}

/**
 * Fetch all repositories for the given organisation.
 * Requires the token to have at least `repo` scope for private repos,
 * or works with public access for public repos.
 */
export async function fetchOrgRepos(
  org: string,
  token: string
): Promise<GitHubRepo[]> {
  return fetchAllPages<GitHubRepo>(
    `${GITHUB_API}/orgs/${encodeURIComponent(org)}/repos`,
    token
  );
}

/**
 * Fetch all collaborators for a single repository.
 */
async function fetchRepoCollaborators(
  owner: string,
  repo: string,
  token: string
): Promise<GitHubCollaborator[]> {
  return fetchAllPages<GitHubCollaborator>(
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/collaborators?affiliation=all`,
    token
  );
}

/**
 * Main entry point.
 *
 * Generates an access report for the given GitHub organisation by:
 *  1. Listing all org repositories (paginated).
 *  2. Fetching collaborators for every repo in parallel (CONCURRENCY cap).
 *  3. Building an inverted index: user → [repos].
 *
 * @param org       GitHub organisation slug (e.g. "microsoft")
 * @param token     Personal Access Token with repo + read:org scopes
 * @param onProgress  Callback invoked with live progress updates
 */
export async function generateAccessReport(
  org: string,
  token: string,
  onProgress: (p: FetchProgress) => void
): Promise<AccessReport> {
  const startMs = Date.now();

  // ── Step 1: list repositories ───────────────────────────────────────────
  onProgress({
    stage: "repositories",
    current: 0,
    total: 1,
    message: `Fetching repositories for "${org}"…`,
  });

  const repos = await fetchOrgRepos(org, token);

  onProgress({
    stage: "repositories",
    current: 1,
    total: 1,
    message: `Found ${repos.length} repositories.`,
  });

  // ── Step 2: fetch collaborators in parallel ─────────────────────────────
  // Build a user map: login → UserAccessEntry (accumulated across repos)
  const userMap = new Map<string, UserAccessEntry>();
  let reposProcessed = 0;

  const tasks = repos.map((repo) => async () => {
    let collabs: GitHubCollaborator[] = [];
    try {
      collabs = await fetchRepoCollaborators(org, repo.name, token);
    } catch (err: any) {
      // 403 on forks / restricted repos – skip gracefully
      console.warn(`Skipping ${repo.name}: ${err.message}`);
    }

    for (const collab of collabs) {
      const accessLevel = deriveAccessLevel(collab);
      const repoAccess: RepoAccess = {
        repoName: repo.name,
        repoFullName: repo.full_name,
        repoUrl: repo.html_url,
        visibility: repo.visibility ?? (repo.private ? "private" : "public"),
        accessLevel,
        roleName: collab.role_name ?? accessLevel,
      };

      if (!userMap.has(collab.login)) {
        userMap.set(collab.login, {
          userId: collab.id,
          login: collab.login,
          avatarUrl: collab.avatar_url,
          profileUrl: collab.html_url,
          userType: collab.type,
          repositories: [],
          repoCount: 0,
        });
      }

      const entry = userMap.get(collab.login)!;
      entry.repositories.push(repoAccess);
      entry.repoCount = entry.repositories.length;
    }

    reposProcessed++;
    onProgress({
      stage: "collaborators",
      current: reposProcessed,
      total: repos.length,
      message: `Scanned collaborators: ${reposProcessed} / ${repos.length} repos`,
    });
  });

  await pLimit(tasks, CONCURRENCY);

  // ── Step 3: sort and serialise ──────────────────────────────────────────
  const users = Array.from(userMap.values()).sort((a, b) =>
    a.login.localeCompare(b.login)
  );

  // Sort each user's repo list alphabetically
  for (const user of users) {
    user.repositories.sort((a, b) => a.repoName.localeCompare(b.repoName));
  }

  const durationMs = Date.now() - startMs;

  onProgress({
    stage: "done",
    current: repos.length,
    total: repos.length,
    message: `Report ready – ${users.length} users across ${repos.length} repos in ${(durationMs / 1000).toFixed(1)}s`,
  });

  return {
    organization: org,
    generatedAt: new Date().toISOString(),
    totalRepositories: repos.length,
    totalUsers: users.length,
    users,
    meta: {
      repositoriesScanned: repos.length,
      apiCallsEstimated: repos.length + Math.ceil(repos.length / PAGE_SIZE) + 1,
      durationMs,
    },
  };
}
