"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useIssues } from "@/hooks/useIssues";
import { useDebounce } from "@/hooks/useDebounce";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueSearchBar, IssueFilters } from "@/components/issues/IssueFilters";
import { Loader, ErrorMessage, EmptyState } from "@/components/common/Feedback";
import { IssueStatus, IssuePriority } from "@/types/issue";

export default function IssuesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <IssuesPageInner />
    </Suspense>
  );
}

function IssuesPageInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || undefined;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState<IssueStatus | undefined>(undefined);
  const [priority, setPriority] = useState<IssuePriority | undefined>(undefined);

  const { data, isLoading, isError, error, refetch } = useIssues({
    project: projectId,
    status,
    priority,
    search: debouncedSearch || undefined,
  });

  const issues = data?.issues ?? [];

  return (
    <div>
      <div className="mb-sm flex items-center justify-between">
        <h1 className="text-h1 text-text">Issues</h1>
        <Link
          href={projectId ? `/issues/new?projectId=${projectId}` : "/issues/new"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xl text-white shadow-subtle"
          aria-label="Report issue"
        >
          +
        </Link>
      </div>

      <IssueSearchBar value={search} onChange={setSearch} />
      <IssueFilters
        status={status}
        priority={priority}
        onChangeStatus={setStatus}
        onChangePriority={setPriority}
      />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : issues.length === 0 ? (
        <EmptyState title="No issues found" subtitle="Try adjusting your filters, or report a new issue." />
      ) : (
        <div className="space-y-sm">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
