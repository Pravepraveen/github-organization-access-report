/**
 * ReportFilters.tsx
 * Filter & sort controls for the access report table.
 */

import { Search, Filter, X } from "lucide-react";
import type { FilterState, AccessLevel, SortField, SortDir } from "../types/github";

interface Props {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  sortField: SortField;
  sortDir: SortDir;
  toggleSort: (f: SortField) => void;
  totalVisible: number;
  totalUsers: number;
}

const ACCESS_LEVELS: { value: AccessLevel | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "admin", label: "Admin" },
  { value: "maintain", label: "Maintain" },
  { value: "push", label: "Push (Write)" },
  { value: "triage", label: "Triage" },
  { value: "pull", label: "Pull (Read)" },
];

function SortBtn({
  field,
  label,
  sortField,
  sortDir,
  toggleSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDir: SortDir;
  toggleSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <button
      onClick={() => toggleSort(field)}
      className={`text-xs px-2.5 py-1 rounded-md border transition font-medium ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}{" "}
      {active ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </button>
  );
}

export function ReportFilters({
  filters,
  setFilters,
  sortField,
  sortDir,
  toggleSort,
  totalVisible,
  totalUsers,
}: Props) {
  function update(patch: Partial<FilterState>) {
    setFilters({ ...filters, ...patch });
  }

  const hasActiveFilters =
    filters.search ||
    filters.accessLevel !== "all" ||
    filters.repoFilter ||
    filters.userType !== "all" ||
    filters.minRepos > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      {/* Row 1: search + result count */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search by username…"
            className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="relative flex-1 min-w-48">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.repoFilter}
            onChange={(e) => update({ repoFilter: e.target.value })}
            placeholder="Filter by repository name…"
            className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <span className="text-xs text-gray-500 whitespace-nowrap ml-auto">
          Showing{" "}
          <strong className="text-gray-800">{totalVisible}</strong> of{" "}
          <strong className="text-gray-800">{totalUsers}</strong> users
        </span>
      </div>

      {/* Row 2: access level + user type + min repos + sort */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Access level select */}
        <select
          value={filters.accessLevel}
          onChange={(e) =>
            update({ accessLevel: e.target.value as AccessLevel | "all" })
          }
          className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
        >
          {ACCESS_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {/* User type */}
        <select
          value={filters.userType}
          onChange={(e) =>
            update({
              userType: e.target.value as "all" | "User" | "Bot",
            })
          }
          className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="User">Users</option>
          <option value="Bot">Bots</option>
        </select>

        {/* Min repos */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span>Min repos:</span>
          <input
            type="number"
            min={0}
            value={filters.minRepos}
            onChange={(e) =>
              update({ minRepos: Math.max(0, Number(e.target.value)) })
            }
            className="w-16 rounded-md border border-gray-200 px-2 py-1.5 text-xs text-center focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Sort:</span>
          <SortBtn
            field="login"
            label="Name"
            sortField={sortField}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
          <SortBtn
            field="repoCount"
            label="Repos"
            sortField={sortField}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
          <SortBtn
            field="accessLevel"
            label="Access"
            sortField={sortField}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() =>
              setFilters({
                search: "",
                accessLevel: "all",
                repoFilter: "",
                userType: "all",
                minRepos: 0,
              })
            }
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition ml-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
          {filters.search && (
            <FilterPill
              label={`User: "${filters.search}"`}
              onRemove={() => update({ search: "" })}
            />
          )}
          {filters.repoFilter && (
            <FilterPill
              label={`Repo: "${filters.repoFilter}"`}
              onRemove={() => update({ repoFilter: "" })}
            />
          )}
          {filters.accessLevel !== "all" && (
            <FilterPill
              label={`Level: ${filters.accessLevel}`}
              onRemove={() => update({ accessLevel: "all" })}
            />
          )}
          {filters.userType !== "all" && (
            <FilterPill
              label={`Type: ${filters.userType}`}
              onRemove={() => update({ userType: "all" })}
            />
          )}
          {filters.minRepos > 0 && (
            <FilterPill
              label={`Min repos: ${filters.minRepos}`}
              onRemove={() => update({ minRepos: 0 })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs text-blue-700 font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900 transition">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
