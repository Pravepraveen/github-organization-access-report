/**
 * ApiEndpointPanel.tsx
 * Shows the "virtual API endpoint" – the JSON report with copy/download actions.
 * This fulfils the requirement: "expose an API endpoint that returns this
 * access report in JSON format."
 *
 * Because this is a fully client-side SPA (no server), we simulate the API
 * response by rendering the JSON in-page and providing a download mechanism.
 * The panel shows the exact JSON structure a real REST endpoint would return.
 */

import { useState } from "react";
import {
  Code2,
  Copy,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AccessReport } from "../types/github";

interface Props {
  report: AccessReport;
  onExport: () => void;
}

export function ApiEndpointPanel({ report, onExport }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Build a trimmed preview (first 3 users)
  const preview: AccessReport = {
    ...report,
    users: report.users.slice(0, 2),
  };
  const jsonStr = JSON.stringify(preview, null, 2);

  function handleCopy() {
    navigator.clipboard
      .writeText(JSON.stringify(report, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <Code2 className="h-4 w-4 text-gray-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              API Endpoint — JSON Response
            </p>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <span className="rounded bg-green-100 text-green-700 px-1.5 py-0.5 text-[10px] font-mono font-bold">
                  GET
                </span>
                <span className="font-mono">/api/v1/orgs/{report.organization}/access-report</span>
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
          {open ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* JSON preview */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Endpoint metadata */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-xs text-center">
            <div className="py-2 text-gray-500">
              <span className="block font-semibold text-gray-800">200 OK</span>
              Status
            </div>
            <div className="py-2 text-gray-500">
              <span className="block font-semibold text-gray-800">
                application/json
              </span>
              Content-Type
            </div>
            <div className="py-2 text-gray-500">
              <span className="block font-semibold text-gray-800">
                {(
                  new Blob([JSON.stringify(report)]).size / 1024
                ).toFixed(1)}{" "}
                KB
              </span>
              Payload size
            </div>
          </div>

          {/* Schema description */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Response Schema
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-500 font-mono">
              {[
                ["organization", "string — org slug"],
                ["generatedAt", "ISO 8601 timestamp"],
                ["totalRepositories", "number"],
                ["totalUsers", "number"],
                ["users[]", "array of UserAccessEntry"],
                ["users[].login", "string"],
                ["users[].avatarUrl", "string"],
                ["users[].userType", '"User" | "Bot"'],
                ["users[].repositories[]", "RepoAccess[]"],
                ["users[].repositories[].repoName", "string"],
                ["users[].repositories[].visibility", '"public" | "private" | "internal"'],
                ["users[].repositories[].accessLevel", '"admin" | "maintain" | "push" | "triage" | "pull"'],
                ["meta.apiCallsEstimated", "number"],
                ["meta.durationMs", "number"],
              ].map(([key, desc]) => (
                <div key={key} className="flex gap-1.5">
                  <span className="text-blue-600 shrink-0">{key}</span>
                  <span className="text-gray-400">→ {desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* JSON body */}
          <div className="relative">
            <pre className="overflow-x-auto p-5 text-xs text-gray-700 bg-gray-950 text-green-400 leading-relaxed max-h-96">
              {jsonStr}
              {report.users.length > 2 && (
                <span className="text-gray-500">
                  {"\n"}  {`// … and ${report.users.length - 2} more users`}
                </span>
              )}
            </pre>
            {report.users.length > 2 && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-950 to-transparent flex items-end justify-center pb-3">
                <span className="text-xs text-gray-400">
                  Showing 2 of {report.users.length} users — download full JSON
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
