/**
 * UserRow.tsx
 * Expandable row showing a single user's repository access details.
 */

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  Globe,
  Bot,
  User,
} from "lucide-react";
import type { UserAccessEntry, RepoAccess } from "../types/github";
import { AccessBadge } from "./AccessBadge";

interface Props {
  user: UserAccessEntry;
  repoFilter: string;
  forceExpand?: boolean;
}

// Compute the "highest" access level a user holds across all repos
const LEVEL_ORDER = ["admin", "maintain", "push", "triage", "pull", "unknown"];

function highestAccess(repos: RepoAccess[]): string {
  let best = 99;
  for (const r of repos) {
    const i = LEVEL_ORDER.indexOf(r.accessLevel);
    if (i < best) best = i;
  }
  return LEVEL_ORDER[best] ?? "unknown";
}

export function UserRow({ user, repoFilter, forceExpand }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = forceExpand ?? expanded;

  const filterLower = repoFilter.toLowerCase();
  const visibleRepos = filterLower
    ? user.repositories.filter((r) =>
        r.repoName.toLowerCase().includes(filterLower)
      )
    : user.repositories;

  const topLevel = highestAccess(user.repositories) as any;

  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Collapsed row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-left group"
      >
        {/* Expand icon */}
        <span className="text-gray-300 group-hover:text-gray-500 transition shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>

        {/* Avatar */}
        <img
          src={user.avatarUrl}
          alt={user.login}
          className="h-8 w-8 rounded-full border border-gray-200 shrink-0"
          loading="lazy"
        />

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {user.login}
            </span>
            {user.userType === "Bot" ? (
              <span className="inline-flex items-center gap-0.5 rounded text-[10px] font-medium px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-100">
                <Bot className="h-3 w-3" />
                Bot
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 rounded text-[10px] font-medium px-1.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-100">
                <User className="h-3 w-3" />
                User
              </span>
            )}
          </div>
        </div>

        {/* Top access level */}
        <div className="shrink-0">
          <AccessBadge level={topLevel} />
        </div>

        {/* Repo count */}
        <div className="shrink-0 text-right min-w-[60px]">
          <span className="text-sm font-semibold text-gray-800">
            {user.repoCount}
          </span>
          <span className="text-xs text-gray-400 ml-1">repo{user.repoCount !== 1 ? "s" : ""}</span>
        </div>

        {/* Profile link */}
        <a
          href={user.profileUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-gray-300 hover:text-blue-500 transition"
          aria-label="Open GitHub profile"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </button>

      {/* Expanded repo list */}
      {isExpanded && (
        <div className="px-14 pb-3">
          {visibleRepos.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">
              No repositories match the current filter.
            </p>
          ) : (
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2 text-left font-medium">Repository</th>
                    <th className="px-3 py-2 text-left font-medium">Visibility</th>
                    <th className="px-3 py-2 text-left font-medium">Access Level</th>
                    <th className="px-3 py-2 text-left font-medium">Role</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRepos.map((repo) => (
                    <tr
                      key={repo.repoName}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 font-mono font-medium text-gray-800 truncate max-w-[220px]">
                        {repo.repoName}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            repo.visibility === "private"
                              ? "text-gray-500"
                              : repo.visibility === "internal"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {repo.visibility === "private" ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Globe className="h-3 w-3" />
                          )}
                          {repo.visibility}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <AccessBadge level={repo.accessLevel} size="xs" />
                      </td>
                      <td className="px-3 py-2 text-gray-500">{repo.roleName}</td>
                      <td className="px-2 py-2">
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-300 hover:text-blue-500 transition"
                          aria-label={`Open ${repo.repoName}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
