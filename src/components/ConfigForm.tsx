/**
 * ConfigForm.tsx
 * Token + Organisation input form shown before the report is generated.
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  Github,
  KeyRound,
  Building2,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";

interface Props {
  onSubmit: (org: string, token: string) => void;
  onDemo: () => void;
  loading: boolean;
}

export function ConfigForm({ onSubmit, onDemo, loading }: Props) {
  const [org, setOrg] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (org.trim() && token.trim()) {
      onSubmit(org.trim(), token.trim());
    }
  }

  const valid = org.trim().length > 0 && token.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-xl ring-1 ring-white/10 mb-4">
          <Github className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          GitHub Access Report
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualise who has access to which repositories in your organisation
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
      >
        <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          Authentication &amp; Target
        </h2>

        {/* Organisation */}
        <div className="mb-5">
          <label
            htmlFor="org"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            GitHub Organisation
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="org"
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g. microsoft"
              required
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            The slug appearing in github.com/&lt;org&gt;
          </p>
        </div>

        {/* Token */}
        <div className="mb-6">
          <label
            htmlFor="token"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Personal Access Token (PAT)
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="token"
              type={showToken ? "text" : "password"}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              required
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition font-mono"
            />
            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Token is never sent anywhere except directly to api.github.com
          </p>
        </div>

        {/* Info box */}
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-700">
          <div className="flex gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
            <div>
              <strong>Required token scopes:</strong> <code>repo</code> (or{" "}
              <code>public_repo</code> for public-only) and{" "}
              <code>read:org</code>. The token is stored only in your browser's
              session memory and never persisted to disk.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!valid || loading}
          className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Generating report…" : "Generate Access Report →"}
        </button>

        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          type="button"
          onClick={onDemo}
          className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 bg-white shadow-sm transition hover:bg-gray-50 focus:outline-none"
        >
          🎭 Try with Demo Data
        </button>
      </form>

      {/* How it works */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          How it works
        </h3>
        <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
          <li>Fetches all repositories in the org (paginated, 100 per page)</li>
          <li>
            Fetches collaborators for every repo in parallel (8 concurrent
            requests)
          </li>
          <li>Builds an inverted index: user → repositories</li>
          <li>Returns a structured JSON report with access levels</li>
        </ol>
      </div>
    </div>
  );
}
