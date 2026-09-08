"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectComponents";
import { Loader, ErrorMessage, EmptyState } from "@/components/common/Feedback";

export default function ProjectsPage() {
  const { data: projects, isLoading, isError, error, refetch } = useProjects();

  return (
    <div>
      <div className="mb-sm flex items-center justify-between">
        <h1 className="text-h1 text-text">Projects</h1>
        <Link
          href="/projects/new"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xl text-white shadow-subtle"
          aria-label="Create project"
        >
          +
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          subtitle="Create your first project to start tracking issues."
        />
      ) : (
        <div className="space-y-sm">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
