/**
 * App.tsx
 * Root component — orchestrates four application states:
 *   idle      → ConfigForm (enter org + token, or try demo)
 *   fetching  → ProgressPanel (live progress updates)
 *   error     → ErrorPanel (structured error + retry)
 *   success   → ReportView (interactive access report)
 */

import { useState } from "react";
import { useAccessReport } from "./hooks/useAccessReport";
import { ConfigForm } from "./components/ConfigForm";
import { ProgressPanel } from "./components/ProgressPanel";
import { ErrorPanel } from "./components/ErrorPanel";
import { ReportView } from "./components/ReportView";
import { MOCK_REPORT } from "./data/mockReport";
import type { AccessReport } from "./types/github";

export function App() {
  const {
    status,
    progress,
    report: liveReport,
    error,
    authenticatedAs,
    fetchReport,
    exportJson,
    reset,
  } = useAccessReport();

  // Demo mode: show mock data without hitting GitHub API
  const [demoReport, setDemoReport] = useState<AccessReport | null>(null);

  function loadDemo() {
    setDemoReport(MOCK_REPORT);
  }

  function handleReset() {
    setDemoReport(null);
    reset();
  }

  // ── demo ──────────────────────────────────────────────────────────────────
  if (demoReport) {
    return (
      <ReportView
        report={demoReport}
        authenticatedAs="demo-user"
        onReset={handleReset}
        onExport={() => {
          const blob = new Blob([JSON.stringify(demoReport, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "demo-access-report.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
      />
    );
  }

  // ── idle ──────────────────────────────────────────────────────────────────
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-6">
        <ConfigForm
          onSubmit={fetchReport}
          onDemo={loadDemo}
          loading={false}
        />
      </div>
    );
  }

  // ── fetching ──────────────────────────────────────────────────────────────
  if (status === "fetching") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-6">
        <ProgressPanel
          progress={progress}
          authenticatedAs={authenticatedAs}
          onCancel={handleReset}
        />
      </div>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────
  if (status === "error" && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-6">
        <ErrorPanel error={error} onRetry={handleReset} />
      </div>
    );
  }

  // ── success ───────────────────────────────────────────────────────────────
  if (status === "success" && liveReport) {
    return (
      <ReportView
        report={liveReport}
        authenticatedAs={authenticatedAs}
        onReset={handleReset}
        onExport={exportJson}
      />
    );
  }

  return null;
}
