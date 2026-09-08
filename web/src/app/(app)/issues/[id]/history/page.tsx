"use client";

import { useParams } from "next/navigation";
import { useIssueHistory } from "@/hooks/useIssues";
import { Loader, ErrorMessage, EmptyState } from "@/components/common/Feedback";
import { IssueHistoryEntry } from "@/types/issue";

function describeEntry(entry: IssueHistoryEntry): string {
  const actor = entry.user?.name || "Someone";
  switch (entry.action) {
    case "ISSUE_CREATED":
      return `${actor} created this issue`;
    case "STATUS_CHANGED":
      return `${actor} changed status: ${entry.oldValue} → ${entry.newValue}`;
    case "PRIORITY_CHANGED":
      return `${actor} changed priority: ${entry.oldValue} → ${entry.newValue}`;
    case "ASSIGNED_CHANGED":
      return `${actor} changed the assignee`;
    case "TITLE_CHANGED":
      return `${actor} changed the title`;
    case "DESCRIPTION_CHANGED":
      return `${actor} updated the description`;
    default:
      return `${actor} updated this issue`;
  }
}

export default function IssueHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: history, isLoading, isError, error, refetch } = useIssueHistory(id);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} onRetry={refetch} />;
  if (!history || history.length === 0) return <EmptyState title="No history yet" />;

  return (
    <div>
      <h1 className="mb-md text-h1 text-text">Issue History</h1>
      <div className="space-y-md">
        {history.map((item) => (
          <div key={item._id} className="flex gap-sm">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-small text-text-muted">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="mt-0.5 text-body text-text">{describeEntry(item)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
