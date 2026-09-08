"use client";

import { IssueStatus, IssuePriority } from "@/types/issue";

const STATUS_COLORS: Record<IssueStatus, string> = {
  open: "#7C3AED",
  in_progress: "#F59E0B",
  resolved: "#16A34A",
  closed: "#8B87A8",
  reopened: "#E11D48",
};

const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
};

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-block rounded-full px-sm py-1 text-small"
      style={{ backgroundColor: color + "33", color }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#E11D48",
};

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const color = PRIORITY_COLORS[priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-sm py-1 text-small"
      style={{ backgroundColor: color + "33", color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
