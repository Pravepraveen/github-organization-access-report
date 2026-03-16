/**
 * useAccessReport.ts
 * Custom React hook that drives the full report-generation lifecycle:
 *  - token validation
 *  - report fetching with live progress
 *  - JSON export
 *  - error handling
 */

import { useState, useCallback, useRef } from "react";
import { generateAccessReport, validateToken } from "../services/githubApi";
import type {
  AccessReport,
  AppError,
  FetchProgress,
  FetchStatus,
} from "../types/github";

export interface UseAccessReportReturn {
  status: FetchStatus;
  progress: FetchProgress | null;
  report: AccessReport | null;
  error: AppError | null;
  authenticatedAs: string | null;
  fetchReport: (org: string, token: string) => Promise<void>;
  exportJson: () => void;
  reset: () => void;
}

export function useAccessReport(): UseAccessReportReturn {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [progress, setProgress] = useState<FetchProgress | null>(null);
  const [report, setReport] = useState<AccessReport | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [authenticatedAs, setAuthenticatedAs] = useState<string | null>(null);

  // Keep a ref to allow future cancellation support
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setProgress(null);
    setReport(null);
    setError(null);
  }, []);

  const fetchReport = useCallback(async (org: string, token: string) => {
    reset();
    setStatus("fetching");

    try {
      // ── 1. Validate token ─────────────────────────────────────────────
      setProgress({
        stage: "auth",
        current: 0,
        total: 1,
        message: "Validating GitHub token…",
      });

      const { login } = await validateToken(token);
      setAuthenticatedAs(login);

      setProgress({
        stage: "auth",
        current: 1,
        total: 1,
        message: `Authenticated as ${login}. Fetching org data…`,
      });

      // ── 2. Generate report ────────────────────────────────────────────
      const result = await generateAccessReport(org, token, (p) => {
        setProgress(p);
      });

      setReport(result);
      setStatus("success");
    } catch (err: any) {
      const appError: AppError = {
        message: err.message ?? "An unexpected error occurred.",
        status: err.status,
        details:
          err.status === 401
            ? "Token invalid or expired. Please check your Personal Access Token."
            : err.status === 403
            ? "Insufficient permissions. Ensure the token has `repo` and `read:org` scopes."
            : err.status === 404
            ? "Organisation not found. Check the organisation name."
            : undefined,
      };
      setError(appError);
      setStatus("error");
    }
  }, [reset]);

  const exportJson = useCallback(() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.organization}-access-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  return {
    status,
    progress,
    report,
    error,
    authenticatedAs,
    fetchReport,
    exportJson,
    reset,
  };
}
