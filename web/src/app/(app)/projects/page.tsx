"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectComponents";
import { Button } from "@/components/common/Button";
import { Loader, ErrorMessage, EmptyState } from "@/components/common/Feedback";

export default function ProjectsPage() {
  const { data: projects, isLoading, isError, error, refetch } = useProjects();

  return (
    <div>
      <div className="mb-md flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-text">Projects</h1>
          <p className="mt-1 text-caption text-text-muted">
            {projects?.length ?? 0} {projects?.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <Link href="/projects/new" className="hidden sm:block">
          <Button>+ New Project</Button>
        </Link>
        <Link
          href="/projects/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-white shadow-subtle sm:hidden"
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
        <EmptyState title="No projects yet" subtitle="Create your first project to start tracking issues." />
      ) : (
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}