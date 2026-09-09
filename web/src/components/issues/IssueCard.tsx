"use client";

import Link from "next/link";
import { Issue } from "@/types/issue";
import { IssueStatusBadge, PriorityBadge } from "./Badges";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link
      href={`/issues/${issue._id}`}
      className="block rounded-md border border-border bg-surface p-md shadow-card transition-all hover:-translate-y-0.5 hover:shadow-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <p className="mb-1 truncate text-bodyBold text-text">{issue.title}</p>
      <p className="mb-sm line-clamp-2 text-caption text-text-muted">{issue.description}</p>
      <div className="flex gap-sm">
        <IssueStatusBadge status={issue.status} />
        <PriorityBadge priority={issue.priority} />
      </div>
      <div className="mt-sm border-t border-border pt-sm">
        <p className="text-small text-text-muted">
          {issue.assignedTo ? `Assigned to ${issue.assignedTo.name}` : "Unassigned"}
        </p>
      </div>
    </Link>
  );
}