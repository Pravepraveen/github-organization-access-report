/**
 * ErrorPanel.tsx
 * Displays a structured error with guidance.
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import type { AppError } from "../types/github";

interface Props {
  error: AppError;
  onRetry: () => void;
}

export function ErrorPanel({ error, onRetry }: Props) {
  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 mb-5">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {error.status ? `Error ${error.status}` : "Something went wrong"}
      </h2>

      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-left mb-5">
        <p className="text-sm text-red-800 font-medium">{error.message}</p>
        {error.details && (
          <p className="mt-2 text-xs text-red-600">{error.details}</p>
        )}
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-700 transition"
      >
        <RefreshCw className="h-4 w-4" />
        Start over
      </button>
    </div>
  );
}
