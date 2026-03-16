/**
 * StatsBar.tsx
 * Summary statistics cards shown at the top of the report.
 */

import {
  Users,
  FolderGit2,
  Clock,
  Zap,
  ShieldAlert,
} from "lucide-react";
import type { AccessReport } from "../types/github";

interface Props {
  report: AccessReport;
}

export function StatsBar({ report }: Props) {
  const adminCount = report.users.filter((u) =>
    u.repositories.some((r) => r.accessLevel === "admin")
  ).length;

  const durationSec = (report.meta.durationMs / 1000).toFixed(1);

  const stats = [
    {
      icon: FolderGit2,
      label: "Repositories",
      value: report.totalRepositories,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      label: "Users / Bots",
      value: report.totalUsers,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: ShieldAlert,
      label: "Admin Access",
      value: adminCount,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: Zap,
      label: "API Calls Est.",
      value: report.meta.apiCallsEstimated,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Clock,
      label: "Duration",
      value: `${durationSec}s`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2 shadow-sm"
        >
          <div
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}
          >
            <s.icon className={`h-4 w-4 ${s.color}`} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
