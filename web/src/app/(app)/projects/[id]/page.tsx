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
    <div>
      <h1 className="text-h1 text-text">{project.name}</h1>
      {project.description ? (
        <p className="mt-xs text-body text-text-muted">{project.description}</p>
      ) : null}

      <p className="mt-lg text-caption text-text-muted">Owner</p>
      <p className="mt-1 text-body text-text">{project.owner.name}</p>

      <p className="mt-lg text-caption text-text-muted">Members ({project.members.length})</p>
      <p className="mt-1 text-body text-text">
        {project.members
          .filter((m) => m.user)
          .map((m) => m.user.name)
          .join(", ") || "No members yet"}
      </p>

      <div className="mt-lg flex flex-col gap-sm">
        <Link href={`/issues?projectId=${project._id}`}>
          <Button fullWidth>View Issues</Button>
        </Link>
        {owner && (
          <Link href={`/projects/${project._id}/members`}>
            <Button variant="secondary" fullWidth>
              Manage Members
            </Button>
          </Link>
        )}
        <Link href={`/issues/new?projectId=${project._id}`}>
          <Button variant="ghost" fullWidth>
            Report New Issue
          </Button>
        </Link>
      </div>
    </div>
  );
}
