/**
 * AccessBadge.tsx
 * Colour-coded pill that represents a GitHub access level.
 */

import type { AccessLevel } from "../types/github";

const BADGE_STYLES: Record<AccessLevel, string> = {
  admin:
    "bg-red-100 text-red-700 border-red-200",
  maintain:
    "bg-orange-100 text-orange-700 border-orange-200",
  push:
    "bg-blue-100 text-blue-700 border-blue-200",
  triage:
    "bg-yellow-100 text-yellow-700 border-yellow-200",
  pull:
    "bg-green-100 text-green-700 border-green-200",
  unknown:
    "bg-gray-100 text-gray-500 border-gray-200",
};

interface Props {
  level: AccessLevel;
  label?: string;
  size?: "sm" | "xs";
}

export function AccessBadge({ level, label, size = "sm" }: Props) {
  const text = label ?? level;
  const sizeClass =
    size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded border font-semibold uppercase tracking-wide ${sizeClass} ${BADGE_STYLES[level]}`}
    >
      {text}
    </span>
  );
}
