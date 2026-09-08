"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useIssues } from "@/hooks/useIssues";
import { Loader } from "@/components/common/Feedback";
import { IssueStatusBadge, PriorityBadge } from "@/components/issues/Badges";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data, isLoading: issuesLoading } = useIssues({ limit: 50 });

  const isLoading = projectsLoading || issuesLoading;
  const issues = data?.issues ?? [];

  const openCount = issues.filter((i) => i.status === "open").length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const projectCount = projects?.length ?? 0;

  const recentIssues = issues.slice(0, 5);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Header */}
      <div className="mb-lg flex items-center justify-between">
        <div>
          <p className="text-caption text-text-muted">{greeting()},</p>
          <h1 className="text-h2 text-text">{user?.name || "User"}</h1>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
          👤
        </div>
      </div>

      {/* Stats */}
      <div className="mb-lg grid grid-cols-2 gap-sm sm:grid-cols-4">
        <StatCard emoji="🐛" label="Open" value={openCount} color="#7C3AED" />
        <StatCard emoji="⏱️" label="In Progress" value={inProgressCount} color="#F59E0B" />
        <StatCard emoji="✅" label="Resolved" value={resolvedCount} color="#16A34A" />
        <StatCard emoji="📁" label="Projects" value={projectCount} color="#7C3AED" />
      </div>

      {/* Quick Actions */}
      <h2 className="mb-sm text-h3 text-text">Quick Actions</h2>
      <div className="mb-lg grid grid-cols-3 gap-sm">
        <ActionCard href="/issues/new" emoji="➕" label="New Issue" />
        <ActionCard href="/projects/new" emoji="📂" label="New Project" />
        <ActionCard href="/issues" emoji="📋" label="All Issues" />
      </div>

      {/* Recent Issues */}
      <h2 className="mb-sm text-h3 text-text">Recent Issues</h2>

      {recentIssues.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-lg text-center">
          <p className="text-caption text-text-muted">No issues yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-sm">
          {recentIssues.map((issue) => (
            <Link
              key={issue._id}
              href={`/issues/${issue._id}`}
              className="block rounded-md border border-border bg-surface p-md transition-shadow hover:shadow-card"
            >
              <div className="mb-xs flex items-center justify-between gap-sm">
                <p className="truncate text-bodyBold text-text">{issue.title}</p>
                <PriorityBadge priority={issue.priority} />
              </div>
              <div className="flex items-center gap-sm">
                <IssueStatusBadge status={issue.status} />
                <span className="text-caption text-text-muted">
                  {typeof issue.project === "object" ? issue.project.name : "Project"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-border bg-surface p-sm text-center">
      <span className="text-lg" style={{ color }}>
        {emoji}
      </span>
      <p className="mt-1 text-h3 text-text">{value}</p>
      <p className="text-small text-text-muted">{label}</p>
    </div>
  );
}

function ActionCard({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center rounded-md border border-border bg-surface py-md transition-shadow hover:shadow-card"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1.5 text-caption font-semibold text-text">{label}</span>
    </Link>
  );
}