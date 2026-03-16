/**
 * ProgressPanel.tsx
 * Live progress display shown while the report is being generated.
 */

import { Github, Loader2 } from "lucide-react";
import type { FetchProgress } from "../types/github";

interface Props {
  progress: FetchProgress | null;
  authenticatedAs: string | null;
  onCancel: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  auth: "Authenticating",
  repositories: "Loading Repositories",
  collaborators: "Scanning Collaborators",
  done: "Finalising",
};

export function ProgressPanel({ progress, authenticatedAs, onCancel }: Props) {
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  const stageLabel = progress
    ? (STAGE_LABELS[progress.stage] ?? progress.stage)
    : "Starting…";

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      {/* Animated icon */}
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-xl ring-1 ring-white/10 mb-6 relative">
        <Github className="h-9 w-9 text-white" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Generating Report
      </h2>
      {authenticatedAs && (
        <p className="text-sm text-gray-500 mb-6">
          Authenticated as{" "}
          <span className="font-mono font-semibold text-gray-700">
            @{authenticatedAs}
          </span>
        </p>
      )}

      {/* Progress card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-left">
        {/* Stage label */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            {stageLabel}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Message */}
        {progress && (
          <p className="text-xs text-gray-500 truncate">{progress.message}</p>
        )}

        {/* Step counter */}
        {progress && progress.total > 1 && (
          <p className="mt-1 text-xs text-gray-400">
            {progress.current} of {progress.total}
          </p>
        )}
      </div>

      {/* Stage pipeline */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        {["auth", "repositories", "collaborators", "done"].map((s, i) => {
          const done =
            progress &&
            ["auth", "repositories", "collaborators", "done"].indexOf(
              progress.stage
            ) > i;
          const active = progress?.stage === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <span
                className={
                  active
                    ? "text-blue-600 font-semibold"
                    : done
                    ? "text-green-600"
                    : "text-gray-300"
                }
              >
                {STAGE_LABELS[s]}
              </span>
              {i < 3 && <span className="text-gray-200">→</span>}
            </div>
          );
        })}
      </div>

      <button
        onClick={onCancel}
        className="mt-6 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition"
      >
        Cancel &amp; start over
      </button>
    </div>
  );
}
