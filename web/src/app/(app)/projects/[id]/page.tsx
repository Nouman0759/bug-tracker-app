"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject, isProjectOwner } from "@/hooks/useProjects";
import { useAuth } from "@/context/AuthContext";
import { Loader, ErrorMessage } from "@/components/common/Feedback";
import { Button } from "@/components/common/Button";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project, isLoading, isError, error, refetch } = useProject(id);

  if (isLoading) return <Loader />;
  if (isError || !project)
    return <ErrorMessage message={(error as Error)?.message || "Not found"} onRetry={refetch} />;

  const owner = isProjectOwner(project, user);

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-md">
        <div>
          <h1 className="text-h1 text-text">{project.name}</h1>
          {project.description ? (
            <p className="mt-xs text-body text-text-muted">{project.description}</p>
          ) : null}
        </div>
        <Link href={`/issues/new?projectId=${project._id}`}>
          <Button>+ New Issue</Button>
        </Link>
      </div>

      <div className="mt-lg grid grid-cols-2 gap-md sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-md">
          <p className="text-caption text-text-muted">Owner</p>
          <p className="mt-1 text-bodyBold text-text">{project.owner.name}</p>
        </div>
        <div className="rounded-md border border-border bg-surface p-md">
          <p className="text-caption text-text-muted">Members</p>
          <p className="mt-1 text-bodyBold text-text">{project.members.length}</p>
        </div>
      </div>

      <p className="mt-lg text-caption text-text-muted">Team</p>
      <p className="mt-1 text-body text-text">
        {project.members
          .filter((m) => m.user)
          .map((m) => m.user.name)
          .join(", ") || "No members yet"}
      </p>

      <div className="mt-lg flex flex-wrap gap-sm">
        <Link href={`/issues?projectId=${project._id}`}>
          <Button>View Issues</Button>
        </Link>
        {owner && (
          <Link href={`/projects/${project._id}/members`}>
            <Button variant="secondary">Manage Members</Button>
          </Link>
        )}
      </div>
    </div>
  );
}