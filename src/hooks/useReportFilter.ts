/**
 * useReportFilter.ts
 * Derives a filtered + sorted view of the access report without mutating
 * the original data. All filtering is done client-side (no extra API calls).
 */

import { useMemo, useState } from "react";
import type {
  AccessReport,
  FilterState,
  SortDir,
  SortField,
  UserAccessEntry,
} from "../types/github";

const ACCESS_LEVEL_ORDER = ["admin", "maintain", "push", "triage", "pull", "unknown"] as const;

function maxAccessLevel(user: UserAccessEntry): number {
  const levels = user.repositories.map((r) =>
    ACCESS_LEVEL_ORDER.indexOf(r.accessLevel as any)
  );
  return Math.min(...(levels.length ? levels : [999]));
}

export function useReportFilter(report: AccessReport | null) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    accessLevel: "all",
    repoFilter: "",
    userType: "all",
    minRepos: 0,
  });

  const [sortField, setSortField] = useState<SortField>("login");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo<UserAccessEntry[]>(() => {
    if (!report) return [];

    const searchLower = filters.search.toLowerCase();
    const repoFilterLower = filters.repoFilter.toLowerCase();

    return report.users
      .filter((user) => {
        // Search by login
        if (searchLower && !user.login.toLowerCase().includes(searchLower))
          return false;

        // Filter by user type
        if (filters.userType !== "all" && user.userType !== filters.userType)
          return false;

        // Filter by minimum repo count
        if (user.repoCount < filters.minRepos) return false;

        // Filter by access level (must have at least one repo at that level)
        if (filters.accessLevel !== "all") {
          const hasLevel = user.repositories.some(
            (r) => r.accessLevel === filters.accessLevel
          );
          if (!hasLevel) return false;
        }

        // Filter by repo name substring
        if (repoFilterLower) {
          const hasRepo = user.repositories.some((r) =>
            r.repoName.toLowerCase().includes(repoFilterLower)
          );
          if (!hasRepo) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "login") {
          cmp = a.login.localeCompare(b.login);
        } else if (sortField === "repoCount") {
          cmp = a.repoCount - b.repoCount;
        } else if (sortField === "accessLevel") {
          cmp = maxAccessLevel(a) - maxAccessLevel(b);
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [report, filters, sortField, sortDir]);

  // Aggregate: unique repos that appear in the filtered set
  const allReposInView = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach((u) => u.repositories.forEach((r) => set.add(r.repoName)));
    return Array.from(set).sort();
  }, [filtered]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  return {
    filters,
    setFilters,
    sortField,
    sortDir,
    toggleSort,
    filtered,
    allReposInView,
  };
}
