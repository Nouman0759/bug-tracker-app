"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useIssues } from "@/hooks/useIssues";
import { useDebounce } from "@/hooks/useDebounce";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueSearchBar, IssueFilters } from "@/components/issues/IssueFilters";
import { Button } from "@/components/common/Button";
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
  const newIssueHref = projectId ? `/issues/new?projectId=${projectId}` : "/issues/new";

  return (
    <div>
      <div className="mb-md flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-text">Issues</h1>
          <p className="mt-1 text-caption text-text-muted">
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
          </p>
        </div>

        <Link href={newIssueHref} className="hidden sm:block">
          <Button>+ New Issue</Button>
        </Link>
        <Link
          href={newIssueHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-white shadow-subtle sm:hidden"
          aria-label="Report issue"
        >
          +
        </Link>
      </div>

      <div className="mb-lg flex flex-col gap-sm md:flex-row md:items-center">
        <IssueSearchBar value={search} onChange={setSearch} />
        <IssueFilters
          status={status}
          priority={priority}
          onChangeStatus={setStatus}
          onChangePriority={setPriority}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : issues.length === 0 ? (
        <EmptyState title="No issues found" subtitle="Try adjusting your filters, or report a new issue." />
      ) : (
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}