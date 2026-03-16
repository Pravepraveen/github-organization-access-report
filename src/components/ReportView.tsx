/**
 * ReportView.tsx
 * Full report view: stats, API endpoint panel, filters, and user table.
 */

import { useState } from "react";
import {
  Github,
  RefreshCw,
  Calendar,
  Building2,
  ExpandIcon,
  MinimizeIcon,
} from "lucide-react";
import type { AccessReport } from "../types/github";
import { useReportFilter } from "../hooks/useReportFilter";
import { StatsBar } from "./StatsBar";
import { ApiEndpointPanel } from "./ApiEndpointPanel";
import { ReportFilters } from "./ReportFilters";
import { UserRow } from "./UserRow";

interface Props {
  report: AccessReport;
  authenticatedAs: string | null;
  onReset: () => void;
  onExport: () => void;
}

export function ReportView({
  report,
  authenticatedAs,
  onReset,
  onExport,
}: Props) {
  const {
    filters,
    setFilters,
    sortField,
    sortDir,
    toggleSort,
    filtered,
  } = useReportFilter(report);

  const [expandAll, setExpandAll] = useState(false);

  const generatedDate = new Date(report.generatedAt).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Github className="h-5 w-5 text-gray-700 shrink-0" />
            <span className="font-bold text-gray-900 text-sm truncate">
              GitHub Access Report
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              <Building2 className="h-3 w-3" />
              {report.organization}
            </span>
          </div>

          {authenticatedAs && (
            <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
              <img
                src={`https://github.com/${authenticatedAs}.png?size=24`}
                alt={authenticatedAs}
                className="h-5 w-5 rounded-full"
              />
              @{authenticatedAs}
            </span>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {generatedDate}
            </span>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New Report
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Stats */}
        <StatsBar report={report} />

        {/* API Endpoint Panel */}
        <ApiEndpointPanel report={report} onExport={onExport} />

        {/* User Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                User Access Matrix
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Click a row to expand repository details
              </p>
            </div>
            <button
              onClick={() => setExpandAll((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition border border-gray-200 rounded-lg px-3 py-1.5"
            >
              {expandAll ? (
                <MinimizeIcon className="h-3.5 w-3.5" />
              ) : (
                <ExpandIcon className="h-3.5 w-3.5" />
              )}
              {expandAll ? "Collapse all" : "Expand all"}
            </button>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <ReportFilters
              filters={filters}
              setFilters={setFilters}
              sortField={sortField}
              sortDir={sortDir}
              toggleSort={toggleSort}
              totalVisible={filtered.length}
              totalUsers={report.totalUsers}
            />
          </div>

          {/* Column headers */}
          <div className="px-4 py-2.5 grid grid-cols-[24px_36px_1fr_auto_80px_32px] gap-3 items-center text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100 bg-white">
            <span />
            <span />
            <span>User</span>
            <span>Highest Access</span>
            <span className="text-right">Repos</span>
            <span />
          </div>

          {/* Rows */}
          <div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-400">
                  No users match the current filters.
                </p>
              </div>
            ) : (
              filtered.map((user) => (
                <UserRow
                  key={user.login}
                  user={user}
                  repoFilter={filters.repoFilter}
                  forceExpand={expandAll ? true : undefined}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
            <span>
              {filtered.length} user{filtered.length !== 1 ? "s" : ""} shown
            </span>
            <span>{report.totalRepositories} repositories scanned</span>
          </div>
        </div>
      </main>
    </div>
  );
}
