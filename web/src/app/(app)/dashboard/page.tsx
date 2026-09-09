"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useIssues } from "@/hooks/useIssues";
import { useProjects } from "@/hooks/useProjects";
import { Loader, ErrorMessage } from "@/components/common/Feedback";
import { Button } from "@/components/common/Button";
import { IssueCard } from "@/components/issues/IssueCard";
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
const PRIORITY_COLORS: Record<IssuePriority, string> = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#E11D48",
};

export default function DashboardPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const {
    data: issuesData,
    isLoading: issuesLoading,
    isError,
    error,
    refetch,
  } = useIssues({ limit: 100 });

  const issues = issuesData?.issues ?? [];

  const stats = useMemo(() => {
    const statusCounts: Record<IssueStatus, number> = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      reopened: 0,
    };
    const priorityCounts: Record<IssuePriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const issue of issues) {
      statusCounts[issue.status]++;
      priorityCounts[issue.priority]++;
    }

    const openIssues = statusCounts.open + statusCounts.in_progress + statusCounts.reopened;
    const resolvedIssues = statusCounts.resolved + statusCounts.closed;

    // Issues created per day, last 14 days
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: 0,
      });
    }
    const dayIndex = new Map(days.map((d, i) => [d.date, i]));
    for (const issue of issues) {
      const key = issue.createdAt.slice(0, 10);
      const idx = dayIndex.get(key);
      if (idx !== undefined) days[idx].count++;
    }

    const statusChartData = (Object.keys(statusCounts) as IssueStatus[])
      .filter((s) => statusCounts[s] > 0)
      .map((s) => ({ name: STATUS_LABELS[s], value: statusCounts[s], color: STATUS_COLORS[s] }));

    const priorityChartData = (Object.keys(priorityCounts) as IssuePriority[]).map((p) => ({
      name: p[0].toUpperCase() + p.slice(1),
      value: priorityCounts[p],
      color: PRIORITY_COLORS[p],
    }));

    const recentIssues = [...issues]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 4);

    return {
      total: issues.length,
      openIssues,
      resolvedIssues,
      statusChartData,
      priorityChartData,
      trend: days,
      recentIssues,
    };
  }, [issues]);

  const isLoading = projectsLoading || issuesLoading;

  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-text">Dashboard</h1>
          <p className="mt-1 text-caption text-text-muted">
            An overview of your projects and issues.
          </p>
        </div>
        <Link href="/issues/new">
          <Button>+ New Issue</Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : (
        <>
          <div className="mb-lg grid grid-cols-2 gap-md sm:grid-cols-4">
            <StatCard label="Projects" value={projects?.length ?? 0} />
            <StatCard label="Total Issues" value={stats.total} />
            <StatCard label="Open" value={stats.openIssues} accent="primary" />
            <StatCard label="Resolved" value={stats.resolvedIssues} accent="success" />
          </div>

          <div className="mb-lg grid grid-cols-1 gap-md lg:grid-cols-3">
            <div className="rounded-md border border-border bg-surface p-md lg:col-span-2">
              <p className="mb-sm text-bodyBold text-text">Issues created (last 14 days)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE5F9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6E6A8C" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6E6A8C" }} width={24} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-md border border-border bg-surface p-md">
              <p className="mb-sm text-bodyBold text-text">By status</p>
              {stats.statusChartData.length === 0 ? (
                <p className="py-lg text-center text-caption text-text-muted">No issues yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.statusChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {stats.statusChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="mb-lg grid grid-cols-1 gap-md lg:grid-cols-3">
            <div className="rounded-md border border-border bg-surface p-md lg:col-span-1">
              <p className="mb-sm text-bodyBold text-text">By priority</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.priorityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6E6A8C" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6E6A8C" }} width={24} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {stats.priorityChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-md border border-border bg-surface p-md lg:col-span-2">
              <div className="mb-sm flex items-center justify-between">
                <p className="text-bodyBold text-text">Recent issues</p>
                <Link href="/issues" className="text-caption text-primary">
                  View all
                </Link>
              </div>
              {stats.recentIssues.length === 0 ? (
                <p className="py-lg text-center text-caption text-text-muted">
                  No issues reported yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
                  {stats.recentIssues.map((issue) => (
                    <IssueCard key={issue._id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "primary" | "success";
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-md shadow-subtle">
      <p className="text-caption text-text-muted">{label}</p>
      <p
        className={
          "mt-1 text-h1 " +
          (accent === "primary" ? "text-primary" : accent === "success" ? "text-success" : "text-text")
        }
      >
        {value}
      </p>
    </div>
  );
}